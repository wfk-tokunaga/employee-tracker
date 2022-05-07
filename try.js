const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');
// const cTable = require('console.table');

//require('dotenv').config()

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to database
const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'mysql_PW#1',
        database: 'company'
    },
    console.log(`Connected to the employee_db database`)
);

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to employee_db')
    promptUser();
});


const promptUser = () => {
    inquirer.prompt([{
            type: 'list',
            name: 'menu',
            message: "Choose one of the following options",
            choices: ['View all Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Finish'
            ]
        }])
        .then((answers) => {
            const choices = answers.menu;
            if (choices === 'View all Departments') {
                showDepartments();
            }
            if (choices === 'View all Roles') {
                showRoles();
            }
            if (choices === 'View all Employees') {
                showEmployees();
            }
            if (choices === 'Add a Department') {
                addDepartment();
            }
            if (choices === 'Add a Role') {
                addRole();
            }
            if (choices === 'Add an Employee') {
                addEmployee();
            }
            if (choices === 'Update an Employee Role') {
                updateEmployeeRole();
            }
            if (choices === 'Finish') {
                connection.end();
            };
        });
};

// show all departments
showDepartments = () => {
    console.log('Viewing all departments');
    const sql = `SELECT department.id AS id, department.name AS department FROM department;`;


    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// show all roles
showRoles = () => {
    console.log('Viewing all roles');
    const sql = `SELECT role.id, role.title,role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id;`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};

// show all employees
showEmployees = () => {
    console.log('Viewing  all employees');
    const sql = `SELECT employee.id,
                    employee.first_name, employee.last_name, 
                    employee.role_id,
                    CONCAT (manager.first_name,"" ,manager.last_name) AS manager, role.title AS       job_title,
                    role.salary AS salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee manager ON
                    employee.manager_id = employee.id;`;
    connection.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};


// add department
addDepartment = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'addDept',
            message: 'Enter the name of the department',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Enter a department');
                    return false;
                }
            }
        }])
        .then(answer => {
            const sql = `INSERT INTO department (name) VALUES (?);`;
            connection.query(sql, answer.addDept, (err, result) => {
                if (err) throw err;
                console.log('Added' + answer.addDept + 'to departments');

                showDepartments();
            });
        });
};

// add role
const addRole = () => {
    inquirer.prompt([{
                type: 'input',
                name: 'rolename',
                message: 'What is the name of this role?',
                validate: addRole => {
                    if (addRole) {
                        return true;
                    } else {
                        console.log('Please enter a role');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'rolesalary',
                message: 'What is the salary for this role?',
                validate: addSalary => {
                    if (addSalary) {
                        return true;
                    } else {
                        console.log('Please enter a role');
                        return false;
                    }
                }
            }
        ])
        .then(answer => {
            const params = [answer.role, answer.salary];
            const roleSql = `SELECT name, id FROM department;`;

            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([{
                    type: 'list',
                    name: 'dept',
                    message: 'Department this role belongs to',
                    choices: dept
                }]).then(deptChoice => {
                    const dept = deptChoice.dept;
                    params.push(dept);

                    const sql = `INSERT INTO role (title, salary,department_id) VALUES (?,?,?);`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Added' + answer.role + "to roles");
                        showRoles();
                    });
                });
            });
        });
};


// add employees
addEmployee = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },

        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ]).then(answer => {
        const params = [answer.firstName, answer.lastName]

        const roleSql = `SELECT role.id, role.title FROM role;`;

        connection.query(roleSql, (err, data) => {
            if (err) throw err;

            const roles = data.map(({ id, title }) => ({ name: title, value: id }));

            inquirer.prompt([{
                type: 'list',
                name: 'role',
                message: 'What is the employees role',
                choices: roles
            }]).then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);

                const managerSql = 'SELECT * FROM employee;';

                connection.query(managerSql, (err, data) => {
                    if (err) throw err;

                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));

                    inquirer.prompt([{
                        type: 'list',
                        name: 'manager',
                        message: 'Name of employees manager',
                        choices: managers
                    }]).then(managerChoice => {
                        const manager = managerChoice.manager;
                        params.push(manager);

                        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`;

                        connection.query(sql, params, (err, result) => {
                            if (err) throw err;
                            console.log('Employee has been added')

                            showEmployees();
                        });
                    });
                });
            });


        });
    });
};


// update employee
updateEmployee = () => {
    const employeeSql = `SELECT * FROM employee;`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw err;

        const employees = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));


        inquirer.prompt([{
            type: 'list',
            name: 'name',
            message: 'Which employee should be updated?',
            choices: employees
        }]).then(empChoice => {
            const employee = empChoice.name;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM role;`;

            connection.query(roleSql, (err, data) => {
                if (err) throw err;

                const roles = data.map(({ id, title }) => ({ name: title, value: id }));

                inquirer.prompt([{
                    type: 'list',
                    name: 'role',
                    message: 'What is the role?',
                    choices: roles
                }]).then(roleChoice => {
                    const role = roleChoice.role;
                    params.push(role);

                    let employee = params[0]
                    params[0] = role
                    params[1] = employee

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?;`;

                    connection.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log('Employee is updated');

                        showEmployees();
                    });
                });

            });
        });

    });
};
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});