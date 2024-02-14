const startQuestions = 
    {
        type: 'list',
        name: 'option',
        message: 'Select an option:',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
    };

const departmentQuestion = 
    {
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:',
        when: (answers) => answers.option === 'Add a department'
    };

const jobTitleQuestion = 
    {
        type: 'input',
        name: 'jobTitle',
        message: 'Enter the name of the Job Title:'
    };

const roleQuestion = 
    {
        type: 'input',
        name: 'roleName',
        message: 'Enter the name of the role:',
        when: (answers) => answers.option === 'Add a role'
    };

const employeeFirstNameQuestion =
    {
        type: 'input',
        name: 'employeeFirstName',
        message: 'Enter the employee\'s first name:',
    }

const employeeLastNameQuestion =     {
    type: 'input',
    name: 'employeeLastName',
    message: 'Enter the employee\'s last name:',
}


return {startQuestions, departmentQuestion, roleQuestion, employeeFirstNameQuestion, employeeLastNameQuestion};