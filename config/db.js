// config/db.js
const { Pool } = require('pg');

// PENTING: Load dotenv dengan path yang benar
// Karena file ini ada di dalam folder 'config', kita perlu mundur satu folder (../) untuk cari .env
require('dotenv').config({ path: './.env' }); 

// Debugging: Cek apakah link terbaca?
console.log("Cek Koneksi DB:", process.env.DATABASE_URL ? "Link Terbaca" : "Link KOSONG/UNDEFINED");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool;