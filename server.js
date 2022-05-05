const sql = require('mysql2');
const inquirer = require('inquirer');
const express = require('express');

const PORT = process.env.PORT || 3002;

const app = express();

app.listen(PORT, () => {
    console.log(`Now listening on PORT ${PORT}`);
})