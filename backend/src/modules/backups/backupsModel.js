const mongoose = require('mongoose');

const BackupSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  filename: { type: String, required: true },
  mimeType: { type: String },
  storagePath: { type: String }, // local path or cloud URL
  size: { type: Number },
  status: { type: String, enum: ['pending','complete','failed'], default: 'pending' },
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Backup', BackupSchema);
