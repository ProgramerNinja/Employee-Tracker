const startQuestions = 
    {
        type: 'list',
        name: 'option',
        message: 'Select an option:',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    }

const newDepartmentQuestion = 
    {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
    }

const newRoleQuestion = 
    {
        type: 'input',
        name: 'newRoleName',
        message: 'Enter the name of the role:',
    }

const addRoleQuestion = function(roleOptions) {
    return    {
        type: 'list',
        name: 'roleName',
        message: 'Select an option:',
        choices: [...roleOptions]
    };
}
const addDepartmentQuestion = function(departmentOptions) {
    object = {
        type: 'list',
        name: 'departmentName',
        message: 'Select an option:',
        choices: [...departmentOptions]
    };
    return  {...object}
}
const addManagerQuestion = function(managerOptions) {
    return  {
        type: 'list',
        name: 'managerName',
        message: 'Select an option:',
        choices: [...managerOptions]
    }
};
const employeeFirstNameQuestion =
    {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Enter the employee\'s first name:',
    }

const employeeLastNameQuestion =
    {
        type: 'input',
        name: 'employeeLastName',
        message: 'Enter the employee\'s last name:',
    }

const salaryAmountQuestion = 
    {
        type: 'input',
        name: 'salaryAmount',
        message: 'Enter the salary amount:',
    }

questions = {startQuestions, newDepartmentQuestion, newRoleQuestion, addDepartmentQuestion, addRoleQuestion, addManagerQuestion, employeeFirstNameQuestion, employeeLastNameQuestion, salaryAmountQuestion};

module.exports = questions;