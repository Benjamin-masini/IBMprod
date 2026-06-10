const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Access denied. No token provided.' });
        }    const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
      } catch (err) {    console.error('Auth middleware error:', err);
      res.status(401).json({ error: 'Invalid or expired token.' });
    }
  };
  
  module.exports = authMiddleware;
