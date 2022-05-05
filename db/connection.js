const mysql = require('mysql2');

// Connect to mysql database
const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql_PW#1',
        database: 'company'
    },
    console.log('Connected to the election database.')
);

module.exports = db;