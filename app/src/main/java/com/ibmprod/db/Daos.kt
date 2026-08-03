package com.ibmprod.db

import androidx.room.*

@Dao
interface UserDao {
  @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun insert(user: User): Long
  @Query("SELECT * FROM users WHERE id = :id") suspend fun getById(id: Long): User?
}

@Dao
interface ModuleDao {
  @Insert(onConflict = OnConflictStrategy.IGNORE) suspend fun insert(module: Module): Long
  @Query("SELECT * FROM modules WHERE code = :code") suspend fun getByCode(code: String): Module?
  @Query("SELECT * FROM modules") suspend fun listAll(): List<Module>
}

@Dao
interface ItemDao {
  @Insert suspend fun insert(item: Item): Long
  @Update suspend fun update(item: Item)
  @Query("SELECT * FROM items WHERE id = :id") suspend fun getById(id: Long): Item?
  @Query("SELECT * FROM items WHERE moduleId = :moduleId AND deleted = 0 ORDER BY createdAt DESC") suspend fun listByModule(moduleId: Int): List<Item>
}

@Dao
interface MediaDao {
  @Insert suspend fun insert(media: Media): Long
  @Query("SELECT * FROM media WHERE item_id = :itemId AND deleted = 0") suspend fun listByItem(itemId: Long): List<Media>
}

@Dao
interface TagDao {
  @Insert(onConflict = OnConflictStrategy.IGNORE) suspend fun insert(tag: Tag): Long
  @Query("SELECT * FROM tags WHERE name = :name") suspend fun findByName(name: String): Tag?
}

@Dao
interface AppSettingDao {
  @Insert(onConflict = OnConflictStrategy.REPLACE) suspend fun upsert(setting: AppSetting)
  @Query("SELECT * FROM app_settings WHERE key = :key") suspend fun getByKey(key: String): AppSetting?
}

@Dao
interface SyncLogDao {
  @Insert suspend fun insertLog(log: SyncLog): Long
  @Query("SELECT * FROM sync_log WHERE processed = 0 ORDER BY createdAt ASC LIMIT :limit") suspend fun fetchPending(limit: Int): List<SyncLog>
  @Query("UPDATE sync_log SET processed = 1 WHERE id = :id") suspend fun markProcessed(id: Long)
}
