const inquirer = require('inquirer');

const db = require('./db/connection');

// const { getAllDepartments, promptDepartment } = require('./utils/departments');

// var departments = [];
var roles = [];

// Would it be possible to have all the prompts in one question prompt with a bunch of whens?
// Afterwards, it'll return the array of answers and I can access them for the next thingy

const initialPrompt = [{
    type: 'list',
    name: 'initialAction',
    message: 'What would you like to do?',
    choices: [
        'View all departments',
        'View all roles',
        // 'View all employees',
        'Add a department',
        'Add a role',
        // 'Add an employee',
        // 'Update an employee role',
        'Exit'
    ]
}];

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

// ========== DEPARTMENTS ==========

const getAllDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
}

const insertDeptartment = newDepartment => {
    // DOES THIS RETURN A PROMISE??
    const sql = `INSERT INTO departments (name) VALUES(?)`;
    db.query(sql, newDepartment, (err, result) => {
        if (err) throw err;
        console.log(`Inserting ${newDepartment} into departments`);
        getAllDepartments();
    });
    // updateDepartmentArr();
};

const promptDepartment = () => {
    inquirer
        .prompt(addDepartmentPrompt)
        .then(answer => insertDeptartment(answer.newDepartment));
};

// ========== ROLES ==========

const addRolePrompt = [{
        type: 'input',
        name: 'title',
        message: 'What\'s the title of the new role?',
        validate: (name) => {
            if (!name) {
                console.log("\n\nMust enter a title!");
                return false;
            }
            return true;
        }
    },
    {
        type: 'input',
        name: 'salary',
        message: 'What\'s the salary of the new role?',
        validate: (salary) => {
            if (!salary || isNaN(salary)) {
                console.log("\n\nMust enter a number!");
                return false;
            }
            return true;
        },
    }
];

const getAllRoles = () => {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
}

const insertRole = (params) => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    db.query(sql, params, (err, row) => {
        if (err) throw err;
        getAllRoles();
    })
}

const promptRole = () => {
    return inquirer
        .prompt(addRolePrompt)
        .then(answers => {
            const params = [answers.title, answers.salary];
            const sql = `SELECT name, id FROM departments`;
            db.query(sql, (err, data) => {
                    if (err) throw err;
                    // This feels like magic
                    const depts = data.map(({ name, id }) => ({ name: name, value: id }));
                    inquirer.prompt([{
                            type: 'list',
                            name: 'department',
                            message: 'Which department does this role belong to?',
                            choices: depts,
                        }])
                        .then(({ department }) => {
                            params.push(department);
                            insertRole(params);
                        });
                })
                // insertRole([answers.title, answers.salary]);
        })
}


// Get initial action, returns a promise
const promptUser = () => {
    inquirer
        .prompt(initialPrompt)
        .then(answer => {
            //parse answer
            switch (answer.initialAction) {
                case 'View all departments':
                    console.log("\ngetAllDepartments() switch statement");
                    getAllDepartments();
                    break;
                case 'View all roles':
                    getAllRoles();
                    break;
                case 'View all employees':
                    break;
                case 'Add a department':
                    promptDepartment();
                    break;
                case 'Add a role':
                    promptRole();
                    break;
                case 'Add an employee':
                    break;
                case 'Update an employee role':
                    break;
                case 'Exit':
                    db.end();
            }
        });
}

promptUser();


const queries = {
    viewDepartments: `SELECT * FROM departments`,
    addDepartment: `INSERT INTO departments (name) VALUES (?)`
}



// db.query(sql, (err, rows) => {
//     if (err) {
//         console.log(err.message);
//     }
//     console.table(rows);
// });

// inquirer.prompt(initialPrompt)
//     .then(response => {
//         console.log(`response ` + JSON.stringify(response));
//         var sql;
//         var params = [];
//         switch (response.initialAction) {
//             case 'View all departments':
//                 sql = queries.viewDepartments;
//                 break;
//             case 'Add a department':
//                 sql = `INSERT INTO departments (name) VALUES (?)`;
//                 params = [response.newDepartment];
//                 break;
//         }
//         console.log(sql);
//         console.log(params);
//         if (params.length === 0) {
//             console.log('\ntest with no params');
//             // db.query(sql, (err, rows) => {
//             //     if (err) {
//             //         console.log(err.message);
//             //     }
//             //     console.table(rows);
//             // });
//             console.log(getAllDepartments());
//         } else {
//             console.log('\ntest WITH params');
//             db.query(sql, params, (err, rows) => {
//                 if (err) {
//                     console.log(err.message);
//                 }
//                 console.table(rows.affectedRows);
//             });
//         }
//     });

// db.connect(err => {
//     if (err) throw err;
//     console.log('\nDatabase connected');
//     app.listen(PORT, () => {
//         console.log(`Now listening on PORT ${PORT}`);
//     })
// })