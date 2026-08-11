const mongoose = require('mongoose');

const OAuthTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  provider: { type: String, required: true, default: 'google' },
  refreshTokenEncrypted: { type: String, required: true },
  scope: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date }
});

module.exports = mongoose.model('OAuthToken', OAuthTokenSchema);
