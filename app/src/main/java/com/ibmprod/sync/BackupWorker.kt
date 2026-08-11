package com.ibmprod.sync

import android.content.Context
import androidx.work.*
import com.google.gson.Gson
import com.ibmprod.db.AppDatabase
import com.ibmprod.db.SyncLog
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.MultipartBody
import okhttp3.RequestBody
import java.util.concurrent.TimeUnit

class BackupWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {
  private val gson = Gson()
  private val db = AppDatabase.getInstance(appContext)
  private val client = OkHttpClient()

  override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
    try {
      // Read pending sync_log entries and produce an export
      val pending: List<SyncLog> = db.syncLogDao().fetchPending(1000)
      if (pending.isEmpty()) return@withContext Result.success()

      // Example export JSON
      val exportJson = gson.toJson(pending)

      // Obtain JWT from AppSetting (stored by your auth flow)
      val tokenSetting = db.appSettingDao().getByKey("auth_jwt")
      val jwt = tokenSetting?.value
      if (jwt.isNullOrBlank()) {
        // No JWT configured — fail so WorkManager can retry later
        return@withContext Result.retry()
      }

      // Build multipart request to backend
      val multipartBuilder = MultipartBody.Builder().setType(MultipartBody.FORM)
      multipartBuilder.addFormDataPart(
        "file",
        "ibmprod_sync_export_${System.currentTimeMillis()}.json",
        exportJson.toRequestBody("application/json".toMediaType())
      )

      val requestBody = multipartBuilder.build()

      val request = Request.Builder()
        .url("${'$'}{BuildConfig.BACKEND_URL}/api/backups/upload")
        .addHeader("Authorization", "Bearer ${'$'}jwt")
        .post(requestBody)
        .build()

      val resp = client.newCall(request).execute()
      if (resp.isSuccessful) {
        pending.forEach { db.syncLogDao().markProcessed(it.id) }
        Result.success()
      } else {
        // On 4xx we might not want to retry forever — but for now retry
        Result.retry()
      }
    } catch (e: Exception) {
      e.printStackTrace()
      Result.retry()
    }
  }

  companion object {
    fun schedulePeriodicBackup(context: Context) {
      val request = PeriodicWorkRequestBuilder<BackupWorker>(12, TimeUnit.HOURS)
        .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
        .build()
      WorkManager.getInstance(context).enqueueUniquePeriodicWork("periodic_backup", ExistingPeriodicWorkPolicy.KEEP, request)
    }
  }
}
