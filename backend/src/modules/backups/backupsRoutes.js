const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload.middleware');
const auth = require('../../middleware/auth.middleware');
const controller = require('./backupsController');

router.post('/upload', auth, upload.single('file'), controller.uploadFromClient);
router.post('/upload/drive', auth, controller.requestDriveUpload);

module.exports = router;
