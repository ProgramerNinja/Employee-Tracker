const inquirer = require('inquirer');
const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '!JaredsSQLPassword1',
    database: 'employees_db'
});

// Connect to the database
connection.connect((error) => {
    if (error) {
        console.error('Error connecting to database:', error);
        return;
    }
    console.log('Connected to the database');
    init(); // Call the init function after the connection is established
});

function init() {
    // Start the question loop
    askQuestions();
}


// Prompt the user for input
function askQuestions() {
    inquirer.prompt(    {
        type: 'list',
        name: 'option',
        message: 'Select an option:',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee', 'Exit']
    }).then(answer => {
        switch (answer.option) {

            case 'View all departments':
                handleViewDepartments();
            break;

            case 'View all employees':
                handleViewEmployees();
            break;

            case 'View all roles':
                handleViewRoles();
            break;

            case 'Add a department':
                handleAddDepartment();
            break;

            case 'Add a role':
                handleAddRole();
            break;

            case 'Add an employee':
                handleAddEmployee();
            break;

            case 'Update an employee':
                handleUpdateEmployee();
            break;

            case 'Exit':
                console.log('Exiting...');
                connection.end(); // Close the database connection
            break;

            default:
                console.log('Invalid option');
                askQuestions(); // Continue the loop
        }
    }).catch(error => {
        console.error('Error in asking questions:', error);
        // Handle the error as needed
    });
};

function handleViewDepartments() {
    connection.query(
            `SELECT id AS department_id, name AS department_name
            FROM departments;`,
        (error, results) => {
        if (error) {
            console.error('Error viewing departments:', error);
        } else {
            console.log(results);
        }
        askQuestions(); // Continue the loop
    });
};

function handleViewEmployees() {
    connection.query(
            `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
            FROM employees AS e 
            JOIN roles AS r ON e.role_id = r.id 
            JOIN departments AS d ON r.department_id = d.id 
            LEFT JOIN employees AS m ON e.manager_id = m.id;`, 
        (error, results) => {
        if (error) {
            console.error('Error viewing employees:', error);
        } else {
            console.log(results);
        }
        askQuestions(); // Continue the loop
    });
};

function handleViewRoles() {
    connection.query(
            `SELECT r.id AS role_id, r.title AS job_title, d.name AS department_name, r.salary 
            FROM roles r 
            JOIN departments d ON r.department_id = d.id;`, 
        (error, results) => {
        if (error) {
            console.error('Error viewing roles:', error);
        } else {
            console.log(results);
        }
        askQuestions(); // Continue the loop
    });
};

function handleAddDepartment() {
    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
    }).then(newDepartment => {
        connection.query('INSERT INTO departments (name) VALUES (?)', [newDepartment.departmentName], (error, results) => {
            if (error) {
                console.error('Error adding department:', error);
            } else {
                console.log('Department added successfully.');
            }
            askQuestions(); // Continue the loop
        });
    });
};

async function handleAddRole() {
    try {
        const departments = await new Promise((resolve, reject) => {
            connection.query('SELECT id AS department_id, name AS department_name FROM departments;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const departmentChoices = departments.map(department => department.department_name);

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'newRoleName',
                message: 'Enter the name of the role:'
            },
            {
                type: 'input',
                name: 'salaryAmount',
                message: 'Enter the salary amount:'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Select a department:',
                choices: departmentChoices
            }
        ]);

        const selectedDepartment = departments.find(department => department.department_name === answers.department);
        const selectedDepartmentId = selectedDepartment.department_id;

        connection.query(
            `INSERT INTO roles (title, salary, department_id) VALUES ('${answers.newRoleName}', ${answers.salaryAmount}, ${selectedDepartmentId});`,
            (error, results) => {
                if (error) {
                    console.error('Error adding role:', error);
                } else {
                    console.log('Role added successfully.');
                }
                askQuestions(); // Continue the loop
            }
        );
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleAddEmployee() {
    try {
        const roles = await new Promise((resolve, reject) => {
            connection.query('SELECT id AS role_id, title FROM roles;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
        const managers = await new Promise((resolve, reject) => {
            connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager_name FROM employees;', (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        // Add a "No Manager" option to the managers array
        managers.unshift({ id: null, manager_name: 'No Manager' });

        const employeeAnswers = await inquirer.prompt([
            {
                type: 'input',
                name: 'employeeFirstName',
                message: 'Enter the employee\'s first name:',
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'Enter the employee\'s last name:',
            }
        ]);

        const roleManagerAnswers = await inquirer.prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Select the role for the employee:',
                choices: roles.map(role => role.title)
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Select the manager for the employee:',
                choices: managers.map(manager => manager.manager_name)
            }
        ]);

        const selectedRole = roles.find(role => role.title === roleManagerAnswers.roleId);
        const selectedManager = managers.find(manager => manager.manager_name === roleManagerAnswers.managerId);

        const results = await new Promise((resolve, reject) => {
            connection.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${employeeAnswers.employeeFirstName}', '${employeeAnswers.employeeLastName}', ${selectedRole.role_id}, ${selectedManager.id});`, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        console.log('Employee added successfully.');
        askQuestions(); // Continue the loop
    } catch (error) {
        console.error('Error adding employee:', error);
    }
}

async function handleUpdateEmployee() {
    try {
        const employees = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT id, CONCAT(first_name, " ", last_name) AS employee_name
                FROM employees;
            `, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const roles = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT id AS role_id, title
                FROM roles;
            `, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const managers = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT id, CONCAT(first_name, " ", last_name) AS manager_name
                FROM employees;`, 
                (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        const employeeToUpdate = await inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employees.map(employee => employee.employee_name)
        });

        const selectedEmployee = employees.find(employee => employee.employee_name === employeeToUpdate.employeeId);
        // Add a "No Manager" option to the managers array
        managers.unshift({ id: null, manager_name: 'No Manager' });

        const updatedEmployeeInfo = await inquirer.prompt([
            {
                type: 'input',
                name: 'updatedFirstName',
                message: "Enter the updated first name:",
                default: selectedEmployee.employee_name.split(' ')[0]
            },
            {
                type: 'input',
                name: 'updatedLastName',
                message: "Enter the updated last name:",
                default: selectedEmployee.employee_name.split(' ')[1]
            },
            {
                type: 'list',
                name: 'updatedRoleId',
                message: 'Select the updated role for the employee:',
                choices: roles.map(role => role.title)
            },
            {
                type: 'list',
                name: 'updatedManagerId',
                message: 'Select the updated manager for the employee:',
                choices: managers.map(manager => manager.manager_name)
            }
        ]);

        const selectedRole = roles.find(role => role.title === updatedEmployeeInfo.updatedRoleId);
        const selectedManager = managers.find(manager => manager.manager_name === updatedEmployeeInfo.updatedManagerId);

        const results = await new Promise((resolve, reject) => {
            connection.query(`
                UPDATE employees 
                SET 
                    first_name = '${updatedEmployeeInfo.updatedFirstName}', 
                    last_name = '${updatedEmployeeInfo.updatedLastName}', 
                    role_id = ${selectedRole.role_id}, 
                    manager_id = ${selectedManager.id} 
                WHERE id = ${selectedEmployee.id};
            `, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        console.log('Employee updated successfully.');
        askQuestions(); // Continue the loop
    } catch (error) {
        console.error('Error updating employee:', error);
    }
}

// Start the question loop
init();