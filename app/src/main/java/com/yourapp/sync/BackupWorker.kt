package com.yourapp.sync

import android.content.Context
import androidx.work.*
import com.google.gson.Gson
import com.yourapp.db.AppDatabase
import com.yourapp.db.SyncLog
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
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

      // TODO: upload exportJson to your cloud storage / API here
      // For now we mark them processed to avoid repeated exports in demo
      pending.forEach { db.syncLogDao().markProcessed(it.id) }

      Result.success()
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
