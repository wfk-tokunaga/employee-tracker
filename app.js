const inquirer = require('inquirer');
const db = require('./db/connection');

const initialPrompt = [{
    type: 'list',
    name: 'initialAction',
    message: 'What would you like to do?',
    choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
    ]
}];

// ========== DEPARTMENTS ==========
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
const insertDeptartment = newDepartment => {
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

// ========== EMPLOYEES ==========
const addEmployeePrompt = [{
        type: 'input',
        name: 'first_name',
        message: 'What\'s the first name of the new employee?',
        validate: (first_name) => {
            if (!first_name) {
                console.log("\n\nMust enter a first name!");
                return false;
            }
            return true;
        }
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'What\'s the last name of the new employee?',
        validate: (last_name) => {
            if (!last_name) {
                console.log("\n\nMust enter a last name!");
                return false;
            }
            return true;
        }
    },
];
const updateRolePrompt = [{
    type: 'list',
    name: 'employee',
    message: 'Which employee would you like to update?',
    choices: [],
}]
const getAllEmployees = () => {
    const sql = 'SELECT * FROM employees';
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
}
const promptEmployee = () => {
    inquirer.prompt(addEmployeePrompt)
        .then(answers => {
            const params = [answers.first_name, answers.last_name];
            // Have the names, now need the role and the manager
            const roleSql = `SELECT title, id FROM roles`;
            db.query(roleSql, (err, data) => {
                const roles = data.map(({ title, id }) => ({ name: title, value: id }));
                inquirer.prompt({
                    type: 'list',
                    name: 'role',
                    message: 'Select one of the following roles:',
                    choices: roles
                }).then(({ role }) => {
                    params.push(role);
                    const managerSql = `SELECT first_name, last_name, id FROM employees`;
                    db.query(managerSql, (err, data) => {
                        const managers = data.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id }));
                        inquirer.prompt({
                            type: 'list',
                            name: 'manager_id',
                            message: 'Who is this employees manager?',
                            choices: managers
                        }).then(({ manager_id }) => {
                            params.push(manager_id);
                            const employeeSql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                            db.query(employeeSql, params, (err, data) => {
                                if (err) throw err;
                                console.log(`Adding ${data.last_name} to employees.`);
                                getAllEmployees();
                            })
                        })
                    })
                })
            })
        })
}
const updateEmployeeRole = () => {
    // User inputs an existing employee then chooses a new role for them.
    // Start by selecting all employees
    updateRolePrompt[0].choices = [];
    const employeeSql = `SELECT first_name, last_name, id FROM employees`;
    db.query(employeeSql, (err, data) => {
        const managers = data.map(({ first_name, last_name, id }) => ({ name: first_name + " " + last_name, value: id }));
        updateRolePrompt[0].choices = managers;
        inquirer.prompt(updateRolePrompt)
            .then(({ employee }) => {
                // List all roles
                const roleSql = `SELECT title, id FROM roles`;
                db.query(roleSql, (err, data) => {
                    const roles = data.map(({ title, id }) => ({ name: title, value: id }));
                    inquirer.prompt({
                        type: 'list',
                        name: 'role',
                        message: 'Select the employee\'s new role:',
                        choices: roles
                    }).then(({ role }) => {
                        // Update their existing role
                        const updateSql = 'UPDATE employees SET role_id = ? WHERE id = ?';
                        console.log(role, employee);
                        const params = [role, employee];
                        db.query(updateSql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Updating new role!');
                            getAllEmployees();
                        })
                    })
                })
            });
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
                    getAllDepartments();
                    break;
                case 'View all roles':
                    getAllRoles();
                    break;
                case 'View all employees':
                    getAllEmployees();
                    break;
                case 'Add a department':
                    promptDepartment();
                    break;
                case 'Add a role':
                    promptRole();
                    break;
                case 'Add an employee':
                    promptEmployee();
                    break;
                case 'Update an employee role':
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    db.end();
            }
        });
}

promptUser();


// const queries = {
//     viewDepartments: `SELECT * FROM departments`,
//     addDepartment: `INSERT INTO departments (name) VALUES (?)`
// }