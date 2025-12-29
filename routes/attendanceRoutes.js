// routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/attendance', attendanceController.clockIn);

module.exports = router;