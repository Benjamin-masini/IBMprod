const express = require('express');
const expressLib = express();
const router = express.Router();

// existing mock authService preserved
const authService = {
    register: (req, res) => {
        // Handle user registration
        res.send('User registered successfully!');
    },
    login: (req, res) => {
        // Handle user login
        res.send('User logged in');
    },
    logout: (req, res) => {
        // Handle logout
        res.send('User logged out');
    }
};

// Wire existing endpoints to authService
router.post('/register', authService.register);
router.post('/login', authService.login);
router.post('/logout', authService.logout);

// New Google OAuth endpoints (server-side exchange / refresh)
const authController = require('./authController');
const authMiddleware = require('../../middleware/auth.middleware');

// Exchange authorization code for refresh token and store it server-side
router.post('/google/exchange', authMiddleware, authController.googleExchange);
// Refresh access token using stored refresh token
router.post('/google/refresh', authMiddleware, authController.googleRefresh);

module.exports = router;
