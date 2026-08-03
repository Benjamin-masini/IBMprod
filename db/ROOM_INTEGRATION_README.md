# Local DB + Room integration notes

This file was added by Copilot to provide boilerplate for local SQLite/Room integration.

Files added:
- app/src/main/java/com/yourapp/db/Entities.kt
- app/src/main/java/com/yourapp/db/Converters.kt
- app/src/main/java/com/yourapp/db/Daos.kt
- app/src/main/java/com/yourapp/db/AppDatabase.kt
- app/src/main/java/com/yourapp/repo/ItemRepository.kt
- app/src/main/java/com/yourapp/sync/BackupWorker.kt

Add these dependencies to your module build.gradle:

implementation "androidx.room:room-runtime:2.6.0"
kapt "androidx.room:room-compiler:2.6.0"
implementation "androidx.room:room-ktx:2.6.0"
implementation "androidx.work:work-runtime-ktx:2.8.1"
implementation "com.google.code.gson:gson:2.10.1"

Make sure to adapt package names and integrate into your app modules.
