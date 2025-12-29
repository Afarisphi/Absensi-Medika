const pool = require('../config/db');
const { calculateEuclideanDistance } = require('../utils/face');

const FACE_THRESHOLD = 1.0;

exports.verifyFace = async (req, res) => {
    try {
        const { user_id, embedding } = req.body;

        if (!user_id || !embedding) {
            return res.status(400).json({
                success: false,
                message: "user_id dan embedding wajib"
            });
        }

        // Ambil embedding dari DB
        const result = await pool.query(
            'SELECT embedding_vector FROM face_embeddings WHERE employee_id = $1',
            [user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Data wajah belum terdaftar"
            });
        }

        const dbEmbedding = JSON.parse(result.rows[0].embedding_vector);

        const distance = calculateEuclideanDistance(
            embedding,
            dbEmbedding
        );

        const isMatch = distance < FACE_THRESHOLD;

        res.json({
            success: isMatch,
            distance: Number(distance.toFixed(4)),
            message: isMatch
                ? "Wajah cocok"
                : "Wajah tidak cocok"
        });

    } catch (err) {
        console.error("VERIFY FACE ERROR:", err);
        res.status(500).json({
            success: false,
            message: "Server error",
            detail: err.message
        });
    }
};
