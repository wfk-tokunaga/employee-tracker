const sql = require('mysql2');
const inquirer = require('inquirer');

const db = require('./db/connection');

var departments = [];
var roles = [];

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
            // 'Update an employee role'
        ]
    },
    {
        type: 'input',
        name: 'newDepartment',
        message: 'What\'s the name of the new department?',
        when: (answers) => answers.initialAction === 'Add a department',
        validate: (name) => {
            // Want to add a check to see if a department has been added already
            // Maybe check outside of inquirer prompt?
            if (!name) {
                console.log("\nMust enter a name!");
                return false;
            }
            return true;
        }
    }
];

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
    console.log('\nin getAllDepartments');
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        departments = rows.map(row => row.name);
        console.log('\n\n');
    });
}

const updateDepartmentsArr = () => {
    const sql = `SELECT name FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        // Gonna have to change this later
        departments = rows.map(row => row.name);
    });
}

const insertDeptartment = newDepartment => {
    // DOES THIS RETURN A PROMISE??
    console.log("\nwhere is my new dept");
    const sql = `INSERT INTO departments (name) VALUES(?)`;
    db.query(sql, newDepartment, (err, result) => {
        if (err) throw err;
    });
    // updateDepartmentArr();
}

const promptDepartment = () => {
    // NEED TO RETURN THE PROMISE
    // console.log("\nTEST");
    return inquirer
        .prompt(addDepartmentPrompt)
        .then(answers => {
            // Is it because this isn't returning a promise?
            console.log(answers);
            // console.log('\nDo we get in here');
            insertDeptartment(answers.newDepartment);
        });
}

// This works as it should, just not within the switch statement
// promptDepartment().then(getAllDepartments);

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
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department is the role part of?',
        // HOW CAN I ACCESS THE CURRENT LIST OF DEPARTMENTS WITHIN HERE?
        // Ideas include having a global variable that is updated whenever the roles change
        // Having a function that returns it
        choices: [1, 2, 3],
    }
];

const getAllRoles = () => {
    console.log('\nin getAllRoles');
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
    });
}

const insertRole = (params) => {
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
    db.query(sql, params, (err, row) => {
        if (err) throw err;
        console.log(row.affectedRows);
    })
}

const promptRole = () => {
    return inquirer
        .prompt(addRolePrompt)
        .then(answers => {
            console.log(`Adding ${answers} to roles`);
            insertRole([answers.title, answers.salary, answers.department]);
        })
}

promptRole().then(getAllRoles);

const updateRolesArr = () => {
    const sql = `SELECT * FROM roles`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        roles = rows;
    });
}

// promptRole()
// .then(getAllRoles).then(updateRolesArr).then(() => console.log(roles));

// Get initial action, returns a promise
const promptUser = () => {
    return inquirer
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
            }
            promptUser();
        });
}

// promptUser();


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