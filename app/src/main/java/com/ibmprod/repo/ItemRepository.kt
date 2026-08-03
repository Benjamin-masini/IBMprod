package com.ibmprod.repo

import com.ibmprod.db.*
import androidx.room.withTransaction
import com.google.gson.Gson

class ItemRepository(private val db: AppDatabase) {
  private val gson = Gson()

  suspend fun createItem(item: Item) : Long {
    return db.withTransaction {
      val id = db.itemDao().insert(item)
      val payload = gson.toJson(item.copy(id = id))
      db.syncLogDao().insertLog(SyncLog(tableName = "items", rowId = id, operation = "INSERT", payload = payload))
      id
    }
  }

  suspend fun updateItem(item: Item) {
    db.withTransaction {
      db.itemDao().update(item)
      val payload = gson.toJson(item)
      db.syncLogDao().insertLog(SyncLog(tableName = "items", rowId = item.id, operation = "UPDATE", payload = payload))
    }
  }

  suspend fun deleteItemSoft(itemId: Long) {
    db.withTransaction {
      val item = db.itemDao().getById(itemId) ?: return@withTransaction
      val deletedItem = item.copy(deleted = 1)
      db.itemDao().update(deletedItem)
      val payload = gson.toJson(deletedItem)
      db.syncLogDao().insertLog(SyncLog(tableName = "items", rowId = itemId, operation = "DELETE", payload = payload))
    }
  }
}
