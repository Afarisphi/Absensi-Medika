// index.js (Versi Final & Bersih)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes yang sudah dipisah
const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Gunakan Routes
// Semua yang ada di authRoutes otomatis diawali /api
// Contoh: /api/login, /api/face/register
app.use('/api', authRoutes);
app.use('/api', attendanceRoutes);

app.get('/', (req, res) => {
    res.send('Server Absensi Modular Siap! 🚀');
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});