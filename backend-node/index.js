const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// koneksi MySQL
const db = mysql.createConnection({
    host: 'mysql',
    user: 'root',
    password: 'rootpassword',
    database: 'crud_db'
});

db.connect(err => {
    if (err) {
        console.error('DB connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// CREATE
app.post('/items', (req, res) => {
    const { name, description } = req.body;
    db.query(
        'INSERT INTO items (name, description) VALUES (?, ?)',
        [name, description],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send({ id: result.insertId, name, description });
        }
    );
});

// READ
app.get('/items', (req, res) => {
    db.query('SELECT * FROM items', (err, rows) => {
        if (err) return res.status(500).send(err);
        res.send(rows);
    });
});

// UPDATE
app.put('/items/:id', (req, res) => {
    const { name, description } = req.body;
    db.query(
        'UPDATE items SET name = ?, description = ? WHERE id = ?',
        [name, description, req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            res.send({ id: req.params.id, name, description });
        }
    );
});

// DELETE
app.delete('/items/:id', (req, res) => {
    db.query('DELETE FROM items WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Item deleted' });
    });
});

app.listen(5000, () => {
    console.log('Backend running on port 5000');
});
