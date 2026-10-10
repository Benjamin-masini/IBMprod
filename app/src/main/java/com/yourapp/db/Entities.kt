package com.ibmprod.db

import androidx.room.*
import java.util.*

@Entity(tableName = "users")
data class User(
  @PrimaryKey(autoGenerate = true) val id: Long = 0,
  val username: String,
  val email: String?,
  val displayName: String?,
  val passwordHash: String?,
  val metadata: String?, // JSON string
  val createdAt: Date = Date(),
  val updatedAt: Date? = null
)

@Entity(tableName = "modules", indices = [Index(value = ["code"], unique = true)])
data class Module(
  @PrimaryKey(autoGenerate = true) val id: Int = 0,
  val code: String,
  val name: String,
  val description: String?,
  val createdAt: Date = Date()
)

@Entity(
  tableName = "items",
  foreignKeys = [
    ForeignKey(entity = Module::class, parentColumns = ["id"], childColumns = ["moduleId"], onDelete = ForeignKey.CASCADE),
    ForeignKey(entity = User::class, parentColumns = ["id"], childColumns = ["ownerId"], onDelete = ForeignKey.SET_NULL)
  ],
  indices = [Index("moduleId"), Index("ownerId")]
)
data class Item(
  @PrimaryKey(autoGenerate = true) val id: Long = 0,
  val moduleId: Int,
  val ownerId: Long?,
  val title: String?,
  val body: String?,
  val metadata: String?, // JSON string
  val createdAt: Date = Date(),
  val updatedAt: Date? = null,
  val deleted: Int = 0
)

@Entity(
  tableName = "media",
  foreignKeys = [
    ForeignKey(entity = Item::class, parentColumns=["id"], childColumns=["itemId"], onDelete = ForeignKey.CASCADE),
    ForeignKey(entity = User::class, parentColumns=["id"], childColumns=["ownerId"], onDelete = ForeignKey.SET_NULL)
  ],
  indices = [Index("itemId"), Index("ownerId")]
)
data class Media(
  @PrimaryKey(autoGenerate = true) val id: Long = 0,
  val itemId: Long?,
  val ownerId: Long?,
  val filePath: String, // content:// URI or absolute path
  val mimeType: String?,
  val thumbnailPath: String?,
  val metadata: String?,
  val size: Long?,
  val createdAt: Date = Date(),
  val deleted: Int = 0
)

@Entity(tableName = "tags", indices = [Index(value = ["name"], unique = true)])
data class Tag(
  @PrimaryKey(autoGenerate = true) val id: Long = 0,
  val name: String
)

@Entity(primaryKeys = ["itemId", "tagId"], tableName = "item_tags",
        foreignKeys = [
          ForeignKey(entity = Item::class, parentColumns=["id"], childColumns=["itemId"], onDelete = ForeignKey.CASCADE),
          ForeignKey(entity = Tag::class, parentColumns=["id"], childColumns=["tagId"], onDelete = ForeignKey.CASCADE)
        ])
data class ItemTag(
  val itemId: Long,
  val tagId: Long
)

@Entity(tableName = "app_settings")
data class AppSetting(
  @PrimaryKey val key: String,
  val value: String?,
  val updatedAt: Date = Date()
)

@Entity(tableName = "sync_log")
data class SyncLog(
  @PrimaryKey(autoGenerate = true) val id: Long = 0,
  val tableName: String,
  val rowId: Long?,
  val operation: String, // INSERT, UPDATE, DELETE
  val payload: String?, // JSON
  val processed: Int = 0,
  val createdAt: Date = Date()
)
