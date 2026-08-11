const Backup = require('./backupsModel');
const OAuthToken = require('../auth/oauthTokenModel');
const fs = require('fs');
const {google} = require('googleapis');
const { decrypt } = require('../auth/cryptoUtil');

async function uploadFromClient(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'missing file' });
    const b = await Backup.create({
      userId: req.user && req.user.id ? req.user.id : req.user?._id,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      storagePath: req.file.path,
      size: req.file.size,
      status: 'complete'
    });
    res.status(201).json({ backupId: b._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'upload failed' });
  }
}

async function requestDriveUpload(req, res) {
  try {
    const { backupId } = req.body;
    if (!backupId) return res.status(400).json({ error: 'missing backupId' });
    const backup = await Backup.findById(backupId);
    if (!backup || !backup.storagePath) return res.status(404).json({ error: 'backup not found' });
    const tokenDoc = await OAuthToken.findOne({ userId: req.user && req.user.id ? req.user.id : req.user?._id, provider: 'google' });
    if (!tokenDoc) return res.status(404).json({ error: 'no google credentials' });

    const refreshToken = decrypt(tokenDoc.refreshTokenEncrypted);
    const oauth2Client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    // Obtain an access token (will refresh using refresh token)
    const r = await oauth2Client.getAccessToken();
    const accessToken = r && r.token ? r.token : null;
    if (!accessToken) return res.status(500).json({ error: 'could not obtain access token' });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const fileMetadata = { name: backup.filename };
    const media = { mimeType: backup.mimeType || 'application/json', body: fs.createReadStream(backup.storagePath) };
    const response = await drive.files.create({ resource: fileMetadata, media, fields: 'id' });

    backup.metadata = backup.metadata || {};
    backup.metadata.driveFileId = response.data.id;
    backup.updatedAt = new Date();
    await backup.save();

    res.json({ ok: true, driveFileId: response.data.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'drive upload failed' });
  }
}

module.exports = { uploadFromClient, requestDriveUpload };
