const sql = require('mysql2');
const inquirer = require('inquirer');
// const express = require('express');

const PORT = process.env.PORT || 3005;
// const app = express();

const db = require('./db/connection');

// const departmentRoutes = require('./routes/apiRoutes/departmentRoutes');
// app.use('/api', departmentRoutes);

// Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
// });

const questions = [{
    type: 'input',
    name: 'test',
    prompt: 'Test question',
}]

inquirer.prompt(questions).then(response => console.log(response));

// db.connect(err => {
//     if (err) throw err;
//     console.log('Database connected');
//     app.listen(PORT, () => {
//         console.log(`Now listening on PORT ${PORT}`);
//     })
// })