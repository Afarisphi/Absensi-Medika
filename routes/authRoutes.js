const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definisikan URL dan hubungkan ke Controller
router.post('/login', authController.login);
router.get('/face/:user_id', authController.getFaceData);
router.post('/face/register', authController.registerFace);

module.exports = router;