package com.yourapp.db

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import android.content.Context

@Database(entities = [
  User::class, Module::class, Item::class, Media::class,
  Tag::class, ItemTag::class, AppSetting::class, SyncLog::class
], version = 1, exportSchema = true)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
  abstract fun userDao(): UserDao
  abstract fun moduleDao(): ModuleDao
  abstract fun itemDao(): ItemDao
  abstract fun mediaDao(): MediaDao
  abstract fun tagDao(): TagDao
  abstract fun syncLogDao(): SyncLogDao

  companion object {
    @Volatile private var INSTANCE: AppDatabase? = null
    fun getInstance(context: Context): AppDatabase =
      INSTANCE ?: synchronized(this) {
        INSTANCE ?: Room.databaseBuilder(context.applicationContext,
          AppDatabase::class.java, "app_local.db")
          .build().also { INSTANCE = it }
      }
  }
}
