const inquirer = require('inquirer');
const db = require('../db/connection');
const promptUser = require('../app');

const addDepartmentPrompt = [{
    type: 'input',
    name: 'newDepartment',
    message: 'What\'s the name of the new department?',
    validate: (name) => {
        // Want to add a check to see if a department has been added already
        // Maybe check outside of inquirer prompt?
        if (!name) {
            console.log("\nMust enter a name!");
            return false;
        } else {
            return true;
        }
        // console.log(departments);
        // db.query('SELECT name FROM departments', (err, rows) => {
        //     if (err) {
        //         console.log('\n==========ERROR==========')
        //         console.log(err.message)
        //         return false;
        //     }
        //     // console.log(rows.map(row => row.name).includes(name));
        //     else if (rows.map(row => row.name).includes(name)) {
        //         console.log('\nDepartment already exists!')
        //         return false;
        //     }
        // });
    }
}]

const getAllDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
}

const promptDepartment = () => {
    inquirer
        .prompt(addDepartmentPrompt)
        .then(answers => {
            const sql = `INSERT INTO departments (name) VALUES(?)`;
            db.query(sql, answers.newDepartment, (err, result) => {
                if (err) throw err;
                console.log(`Inserted ${answers.newDepartment} into departments.`);
                getAllDepartments();
            });
        });
};

module.exports = { promptDepartment, getAllDepartments };