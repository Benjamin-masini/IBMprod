package com.ibmprod.sync

import android.content.Context
import androidx.work.*
import com.google.gson.Gson
import com.ibmprod.db.AppDatabase
import com.ibmprod.db.SyncLog
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.*
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets
import java.util.concurrent.TimeUnit

class BackupWorker(appContext: Context, workerParams: WorkerParameters) : CoroutineWorker(appContext, workerParams) {
  private val gson = Gson()
  private val db = AppDatabase.getInstance(appContext)

  override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
    try {
      // Read pending sync_log entries and produce an export
      val pending: List<SyncLog> = db.syncLogDao().fetchPending(1000)
      if (pending.isEmpty()) return@withContext Result.success()

      // Example export JSON
      val exportJson = gson.toJson(pending)

      // Upload to Google Drive
      val tokenSetting = db.appSettingDao().getByKey("google_drive_access_token")
      val accessToken = tokenSetting?.value
      if (accessToken.isNullOrBlank()) {
        // No token configured — fail softly so WorkManager can retry later
        return@withContext Result.retry()
      }

      val success = uploadToDrive(accessToken, "ibmprod_sync_export_${System.currentTimeMillis()}.json", exportJson)
      if (success) {
        pending.forEach { db.syncLogDao().markProcessed(it.id) }
        Result.success()
      } else {
        Result.retry()
      }
    } catch (e: Exception) {
      e.printStackTrace()
      Result.retry()
    }
  }

  private fun uploadToDrive(accessToken: String, filename: String, content: String): Boolean {
    // Use Drive REST API v3 with multipart upload
    val boundary = "-------314159265358979323846"
    val twoHyphens = "--"
    val lineEnd = "\r\n"

    try {
      val url = URL("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
      val conn = url.openConnection() as HttpURLConnection
      conn.requestMethod = "POST"
      conn.doOutput = true
      conn.doInput = true
      conn.setRequestProperty("Authorization", "Bearer $accessToken")
      conn.setRequestProperty("Content-Type", "multipart/related; boundary=$boundary")

      val out = DataOutputStream(conn.outputStream)

      // Metadata part
      out.writeBytes(twoHyphens + boundary + lineEnd)
      out.writeBytes("Content-Type: application/json; charset=UTF-8" + lineEnd + lineEnd)
      val metadata = "{\"name\": \"$filename\"}"
      out.write(metadata.toByteArray(StandardCharsets.UTF_8))
      out.writeBytes(lineEnd)

      // File content part
      out.writeBytes(twoHyphens + boundary + lineEnd)
      out.writeBytes("Content-Type: application/json" + lineEnd + lineEnd)
      out.write(content.toByteArray(StandardCharsets.UTF_8))
      out.writeBytes(lineEnd)

      // End
      out.writeBytes(twoHyphens + boundary + twoHyphens + lineEnd)
      out.flush()
      out.close()

      val responseCode = conn.responseCode
      if (responseCode in 200..299) {
        // success
        conn.inputStream.close()
        return true
      } else {
        val err = conn.errorStream?.bufferedReader()?.use { it.readText() }
        System.err.println("Drive upload failed: $responseCode - $err")
        return false
      }
    } catch (e: Exception) {
      e.printStackTrace()
      return false
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
