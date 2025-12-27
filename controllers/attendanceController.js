// controllers/attendanceController.js
const pool = require('../config/db');
const { getDistanceFromLatLonInMeters } = require('../utils/geo');

exports.clockIn = async (req, res) => {
    const { user_id, latitude, longitude, photo_url } = req.body;
    try {
        // Ambil data kantor
        const officeRes = await pool.query('SELECT * FROM offices WHERE id = 1');
        if (officeRes.rows.length === 0) return res.status(500).json({message: 'Kantor belum disetting'});
        const office = officeRes.rows[0];

        // Hitung Jarak (Pakai fungsi dari Utils)
        const distance = getDistanceFromLatLonInMeters(latitude, longitude, office.latitude, office.longitude);
        
        let status = 'VALID';
        let msg = 'Absen Berhasil';
        if (distance > office.radius_meters) {
            status = 'OUT_OF_RANGE';
            msg = `Kejauhan! Jarak: ${Math.round(distance)}m (Max ${office.radius_meters}m)`;
        }

        const log = await pool.query(
            `INSERT INTO attendance_logs (employee_id, latitude, longitude, distance_meters, status, photo_url) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [user_id, latitude, longitude, distance, status, photo_url || '']
        );

        const code = status === 'VALID' ? 200 : 400;
        res.status(code).json({ success: status === 'VALID', message: msg, data: log.rows[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};