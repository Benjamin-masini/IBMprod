const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {google} = require('googleapis');

const User = require('../models/User'); // Adjust the path as necessary
const OAuthToken = require('./oauthTokenModel');
const { encrypt, decrypt } = require('./cryptoUtil');

// Register function
exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login function
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Logout function
exports.logout = (req, res) => {
    // Handle the logout logic here (e.g., delete token on client-side)
    res.status(200).json({ message: 'User logged out' });
};

// Google OAuth code exchange: requires authenticated user (use auth middleware)
exports.googleExchange = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'missing code' });

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const result = await oauth2Client.getToken(code);
    const tokens = result.tokens;

    if (!tokens || !tokens.refresh_token) {
      // Refresh token might be missing if consent already granted; inform client to use proper flow
      console.warn('No refresh token returned from Google during exchange');
    }

    const encrypted = encrypt(tokens.refresh_token || '');
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ error: 'unauthenticated' });

    await OAuthToken.findOneAndUpdate(
      { userId: userId, provider: 'google' },
      { refreshTokenEncrypted: encrypted, scope: tokens.scope || '' },
      { upsert: true }
    );

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'token exchange failed' });
  }
};

// Refresh access token using stored refresh token
exports.googleRefresh = async (req, res) => {
  try {
    const userId = req.user && (req.user.id || req.user._id);
    if (!userId) return res.status(401).json({ error: 'unauthenticated' });

    const doc = await OAuthToken.findOne({ userId: userId, provider: 'google' });
    if (!doc) return res.status(404).json({ error: 'no refresh token' });
    const refreshToken = decrypt(doc.refreshTokenEncrypted);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const r = await oauth2Client.getAccessToken();
    const accessToken = r && r.token ? r.token : null;
    const expiry = r && r.res && r.res.data ? r.res.data.expires_in : null;

    res.json({ accessToken, expiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'refresh failed' });
  }
};
