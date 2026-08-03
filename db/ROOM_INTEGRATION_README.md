# Room + Google Drive integration notes for IBMprod

This file explains the changes added by the assistant and how to configure Google Drive upload.

Files updated/added (package com.ibmprod):
- app/src/main/java/com/ibmprod/db/Entities.kt
- app/src/main/java/com/ibmprod/db/Converters.kt
- app/src/main/java/com/ibmprod/db/Daos.kt
- app/src/main/java/com/ibmprod/db/AppDatabase.kt
- app/src/main/java/com/ibmprod/repo/ItemRepository.kt
- app/src/main/java/com/ibmprod/sync/BackupWorker.kt

Gradle snippet to add to your module (app/build.gradle):

// Room
implementation "androidx.room:room-runtime:2.6.0"
kapt "androidx.room:room-compiler:2.6.0"
implementation "androidx.room:room-ktx:2.6.0"

// WorkManager
implementation "androidx.work:work-runtime-ktx:2.8.1"

// JSON
implementation "com.google.code.gson:gson:2.10.1"

Note: Add `kapt` plugin to module build.gradle: `apply plugin: 'kotlin-kapt'` if not present.

Google Drive setup (high level):
1) Enable Google Drive API for your project in Google Cloud Console.
2) Configure OAuth consent screen and create OAuth credentials (Android app type) to allow your app to request scopes.
3) In your app, implement Google Sign-In requesting the Drive scope you need (e.g. `Scope(Scopes.DRIVE_FILE)`), then obtain an OAuth access token and store it in app_settings under the key `google_drive_access_token`.
   - Alternatively, store a refresh token on a backend and exchange it there; for mobile-only, use Google Sign-In flows.
4) BackupWorker reads `google_drive_access_token` from the DB and uploads the sync_log export.

Security note: storing access tokens locally has security implications; consider using safer token storage and refresh strategies.

Drive upload limitations and improvements:
- The current code uses a simple OAuth token read from DB. In production, handle token refresh when 401s occur and re-auth flows.
- For large exports, consider chunked uploads or using a backend for secure uploads.

If you want, I can also:
- Implement Google Sign-In integration code and UI (requesting Drive scopes) and persist the token into AppSetting.
- Add token refresh handling and better error reporting in BackupWorker.
