const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/', authMiddleware, UserController.getAllUsers);
router.get('/:id', authMiddleware, UserController.getUserById);
router.put('/:id', authMiddleware, UserController.updateUser);
router.delete('/:id', authMiddleware, UserController.deleteUser);

module.exports = router;
