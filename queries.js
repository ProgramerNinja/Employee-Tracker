function showDepartments () { return `SELECT id AS department_id, name AS department_name
FROM departments;`};

function viewRoles () { return `SELECT r.id AS role_id, r.title AS job_title, d.name AS department_name, r.salary 
FROM roles r 
JOIN departments d ON r.department_id = d.id;`};

function viewEmployees () { return `SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS job_title, d.name AS department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name 
FROM employees AS e 
JOIN roles AS r ON e.role_id = r.id 
JOIN departments AS d ON r.department_id = d.id 
LEFT JOIN employees AS m ON e.manager_id = m.id;`};

function addDepartment (department_name) { return `INSERT INTO departments (name) VALUES (${department_name});`};

function addRole (title, salary, department_id) { return `INSERT INTO roles (title, salary, department_id)
VALUES ('${title}', ${salary}, ${department_id});`};

function addEmployee (first_name, last_name, role_id, manager_id) { return `INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('${first_name}', '${last_name}', '${role_id}', '${manager_id}');`};

function updateEmployee (new_role_id, new_manager_id, employee_id) {`UPDATE employee
SET role = ${new_role_id},
    manager = ${new_manager_id}
WHERE id = ${employee_id};`};