# Google OAuth & Server-side Drive Upload

This document explains how to configure Google OAuth for server-side refresh token storage and how to use the backend endpoints added to the project.

1) Create OAuth credentials in Google Cloud Console
- Go to https://console.cloud.google.com/apis/credentials
- Configure OAuth consent screen (internal or external as appropriate). Add your application name and contact.
- Create credentials:
  - For server-side exchange, create an OAuth 2.0 Client ID of type "Web application" and add an authorized redirect URI (e.g., https://your-server.example.com/oauth2callback)
  - If your Android app needs to perform Google Sign-In, create an "Android" credential and provide package name & SHA-1.

2) How the flow works (recommended server-side)
- The mobile app opens a Google consent screen (using Google Sign-In or external browser) requesting the scopes you need (e.g., https://www.googleapis.com/auth/drive.file).
- The provider returns an authorization code to the redirect URI (or your app if using an Android intent). The app sends this code to the backend endpoint POST /api/auth/google/exchange with Authorization: Bearer <JWT>.
- The backend exchanges the code with Google (using the server client secret), receives tokens, stores the refresh_token encrypted in the database, and returns success.
- When a backup needs to be uploaded, the mobile app sends the export to POST /api/backups/upload (Authorization: Bearer <JWT>), which stores the file. Then the app or an admin can call POST /api/backups/upload/drive { backupId } to ask the server to upload the stored file to Drive using the stored refresh_token.

3) Endpoints
- POST /api/auth/google/exchange
  - Auth required (JWT)
  - Body: { code: "<google_authorization_code>" }
  - Returns: { ok: true }

- POST /api/auth/google/refresh
  - Auth required (JWT)
  - Returns: { accessToken, expiry }

- POST /api/backups/upload
  - Auth required (JWT)
  - multipart/form-data field: file
  - Max size: 50 MB
  - Allowed MIME: application/json, application/octet-stream, application/zip
  - Returns: { backupId }

- POST /api/backups/upload/drive
  - Auth required (JWT)
  - Body: { backupId: "..." }
  - Returns: { ok: true, driveFileId: "..." }

4) ENCRYPTION_KEY
- The server expects an environment variable ENCRYPTION_KEY containing 32 random bytes encoded in base64.
- To generate locally:
  - Node: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  - OpenSSL: openssl rand -base64 32
- Store the key in your environment or secret manager (DO NOT commit it to source control).

5) Notes
- All communication must be over HTTPS in production.
- Refresh tokens are stored encrypted using AES-GCM. Keep ENCRYPTION_KEY secret and rotate if compromised.
