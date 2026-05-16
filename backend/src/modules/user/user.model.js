const userSchema =
  new mongoose.Schema({
    username: String,

    email: String,

    password: String,

    role: String,

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
    },
  });
