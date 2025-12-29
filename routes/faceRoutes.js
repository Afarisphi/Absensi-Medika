const express = require('express');
const router = express.Router();
const faceController = require('../controllers/faceController');

router.post('/verify', faceController.verifyFace);

module.exports = router;
