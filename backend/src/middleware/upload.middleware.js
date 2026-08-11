const multer = require('multer');
const path = require('path');

// Storage: disk in uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// File filter: allow JSON and binary
function fileFilter(req, file, cb) {
  const allowed = ['application/json', 'application/octet-stream', 'application/zip'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('INVALID_MIME'));
}

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter
});

module.exports = upload;
