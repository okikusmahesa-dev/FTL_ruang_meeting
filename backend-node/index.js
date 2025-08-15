const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi koneksi MySQL
const dbConfig = {
    host: 'mysql',
    user: 'root',
    password: 'rootpassword',
    database: 'ftl',
    port: 3306
};

let db;

// Fungsi untuk konek ke MySQL dengan retry
function connectDB() {
    db = mysql.createConnection(dbConfig);

    db.connect(err => {
        if (err) {
            console.error('❌ MySQL belum siap, mencoba lagi dalam 2 detik...');
            setTimeout(connectDB, 2000);
        } else {
            console.log('✅ Terhubung ke MySQL');
        }
    });

    // Handle koneksi terputus setelah jalan
    db.on('error', err => {
        console.error('⚠️ MySQL error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            connectDB();
        } else {
            throw err;
        }
    });
}

connectDB();

// CREATE
app.post('/ruang-meeting', (req, res) => {
    const { unit, ruang, kapasitas, tanggal_rapat, waktu, jumlah_peserta, jenis_konsumsi } = req.body;
    db.query(
        `INSERT INTO ruang_meeting (unit, ruang, kapasitas, tanggal_rapat, waktu, jumlah_peserta, jenis_konsumsi)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [unit, ruang, kapasitas, tanggal_rapat, waktu, jumlah_peserta, jenis_konsumsi],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send({ id: result.insertId, ...req.body });
        }
    );
});

// READ ALL
app.get('/ruang-meeting', (req, res) => {
    db.query('SELECT * FROM ruang_meeting', (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
    });
});

// READ ONE
app.get('/ruang-meeting/:id', (req, res) => {
    db.query('SELECT * FROM ruang_meeting WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).send(err);
        if (rows.length === 0) return res.status(404).send({ message: 'Data not found' });
        res.send(rows[0]);
    });
});

// UPDATE
app.put('/ruang-meeting/:id', (req, res) => {
    const { unit, ruang, kapasitas, tanggal_rapat, waktu, jumlah_peserta, jenis_konsumsi } = req.body;
    db.query(
        `UPDATE ruang_meeting SET unit=?, ruang=?, kapasitas=?, tanggal_rapat=?, waktu=?, jumlah_peserta=?, jenis_konsumsi=?
         WHERE id=?`,
        [unit, ruang, kapasitas, tanggal_rapat, waktu, jumlah_peserta, jenis_konsumsi, req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ id: req.params.id, ...req.body });
        }
    );
});

// DELETE
app.delete('/ruang-meeting/:id', (req, res) => {
    db.query('DELETE FROM ruang_meeting WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Data deleted' });
    });
});

app.listen(5000, () => {
    console.log('🚀 Backend running on port 5000');
});
