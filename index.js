const inquirer = require('inquirer');
const mysql = require('mysql2');
const {startQuestions, departmentQuestion, roleQuestion, employeeFirstNameQuestion, employeeLastNameQuestion} = require('questions.js');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!JaredsSQLPassword1',
  database: 'employees_db'
});

connection.connect();

// Prompt the user for input
function askQuestions() {
  inquirer.prompt(questions).then(answers => {
      switch (answers.option) {
          case 'View all departments':
              connection.query('SELECT * FROM departments', (error, results) => {
                  if (error) throw error;
                  console.log('Departments:', results);
                  askQuestions(); // Continue the loop
              });
              break;
          case 'Add a department':
              inquirer.prompt({
                  type: 'input',
                  name: 'departmentName',
                  message: 'Enter the name of the department:'
              }).then(newDepartment => {
                  connection.query('INSERT INTO departments (name) VALUES (?)', [newDepartment.departmentName], (error, results) => {
                      if (error) throw error;
                      console.log('Department added successfully.');
                      askQuestions(); // Continue the loop
                  });
              });
              break;
          case 'Exit':
              console.log('Exiting...');
              connection.end(); // Close the database connection
              break;
          default:
              console.log('Invalid option');
              askQuestions(); // Continue the loop
      }
  });
}

// Start the question loop
askQuestions();