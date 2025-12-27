// controllers/authController.js
const pool = require('../config/db');

// Login
exports.login = async (req, res) => {
    const { nik, password } = req.body;
    try {
        console.log("Mencoba login dengan NIK:", nik); // Debug 1: Cek input masuk

        const result = await pool.query('SELECT * FROM employees WHERE nik = $1', [nik]);
        
        console.log("Hasil Database:", result.rows); // Debug 2: Cek koneksi DB

        if (result.rows.length === 0) return res.status(401).json({ success: false, message: 'NIK salah' });
        
        const user = result.rows[0];
        if (password !== user.password) return res.status(401).json({ success: false, message: 'Password salah' });

        res.json({
            success: true,
            message: 'Login Berhasil',
            data: { id: user.id, name: user.full_name, role: user.role }
        });
    } catch (err) {
        // --- INI BAGIAN PENTING ---
        console.error("ERROR TERJADI:", err); // Cetak error lengkap ke Terminal
        res.status(500).json({ 
            error: "Terjadi kesalahan", 
            detail: err.message || "Pesan error kosong" // Coba ambil pesan error
        });
    }
};

// Get Face Data
exports.getFaceData = async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query('SELECT embedding_vector FROM face_embeddings WHERE employee_id = $1', [user_id]);
        if (result.rows.length === 0) return res.json({ success: false, message: 'Data wajah kosong' });
        
        res.json({ success: true, embedding: result.rows[0].embedding_vector });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Register Face Data
exports.registerFace = async (req, res) => {
    const { user_id, embedding_vector } = req.body;
    try {
        const cek = await pool.query('SELECT id FROM face_embeddings WHERE employee_id = $1', [user_id]);
        if (cek.rows.length > 0) {
            await pool.query('UPDATE face_embeddings SET embedding_vector = $1, created_at = NOW() WHERE employee_id = $2', [embedding_vector, user_id]);
        } else {
            await pool.query('INSERT INTO face_embeddings (employee_id, embedding_vector) VALUES ($1, $2)', [user_id, embedding_vector]);
        }
        res.json({ success: true, message: 'Wajah berhasil disimpan!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};