const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection configuration - using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql', // Default to service name if env var not set
    user: process.env.DB_USER || 'appuser', // Using non-root user
    password: process.env.DB_PASSWORD || 'apppassword',
    database: process.env.DB_NAME || 'ftl', // Changed to match your compose file
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Improved connection handling with retries
const connectWithRetry = () => {
    db.connect(err => {
        if (err) {
            console.error('DB connection failed:', err.message);
            console.log('Retrying connection in 5 seconds...');
            setTimeout(connectWithRetry, 5000);
            return;
        }
        console.log('Connected to MySQL database');
    });
};

connectWithRetry();

// Error handling for database connection
db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connectWithRetry();
    } else {
        throw err;
    }
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