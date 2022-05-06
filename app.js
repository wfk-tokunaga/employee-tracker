const sql = require('mysql2');
const inquirer = require('inquirer');

const db = require('./db/connection');

const initialPrompt = [{
        type: 'list',
        name: 'initialAction',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            // 'View all roles',
            // 'View all employees',
            'Add a department',
            // 'Add a role',
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
                console.log("Must enter a name!");
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
            console.log("Must enter a name!");
            return false;
        } else {
            return true;
        }
        // console.log(departments);
        // db.query('SELECT name FROM departments', (err, rows) => {
        //     if (err) {
        //         console.log('==========ERROR==========')
        //         console.log(err.message)
        //         return false;
        //     }
        //     // console.log(rows.map(row => row.name).includes(name));
        //     else if (rows.map(row => row.name).includes(name)) {
        //         console.log('Department already exists!')
        //         return false;
        //     }
        // });
    }
}]

const getAllDepartments = () => {
    console.log('in getAllDepartments');
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
    });
}

const insertDeptartment = newDepartment => {
    // DOES THIS RETURN A PROMISE??
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    db.query(sql, newDepartment, (err, result) => {
        if (err) throw err;
        // console.log(result)
    });
}

const promptDepartment = () => {
    // NEED TO RETURN THE PROMISE
    // console.log("TEST");
    return inquirer
        .prompt(addDepartmentPrompt)
        .then(answers => {
            console.log('Do we get in here');
            insertDeptartment(answers.newDepartment);
        });
}


// Get initial action, returns a promise
const promptUser = () => {
    return inquirer
        .prompt(initialPrompt)
        .then(answer => {
            //parse answer
            switch (answer.initialAction) {
                case 'View all departments':
                    // console.log("getAllDepartments() switch statement");
                    getAllDepartments();
                    break;
                case 'View all roles':
                    //Test
                    break;
                case 'View all employees':
                    //Test
                    break;
                case 'Add a department':
                    promptDepartment();
                    break;
                case 'Add a role':
                    //Test
                    break;
                case 'Add an employee':
                    //Test
                    break;
                case 'Update an employee role':
                    //Test
                    break;
            }
            promptUser()
        });
}

promptUser();





// const viewDepartments = {
//     query: `SELECT * FROM departments`
// }
// const addDepartment = {
//     query: `INSERT INTO departments (name) VALUES (?)`,
//     params: 'test'
// }

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
//             console.log('test with no params');
//             // db.query(sql, (err, rows) => {
//             //     if (err) {
//             //         console.log(err.message);
//             //     }
//             //     console.table(rows);
//             // });
//             console.log(getAllDepartments());
//         } else {
//             console.log('test WITH params');
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
//     console.log('Database connected');
//     app.listen(PORT, () => {
//         console.log(`Now listening on PORT ${PORT}`);
//     })
// })