const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
});

module.exports = router;