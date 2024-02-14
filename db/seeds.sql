USE employees_db;

-- Seed the department table
INSERT INTO departments (id, name) VALUES (1, 'Engineering'), (2, 'Marketing'), (3, 'Finance');

-- Seed the role table
INSERT INTO roles (id, title, salary, department_id) VALUES
(1, 'Manager', 70000.00, 1),
(2, 'Developer', 60000.00, 1),
(3, 'Designer', 55000.00, 2);

-- Seed the employees table
INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES
(1, 'John', 'Doe', 1, NULL),
(2, 'Jane', 'Smith', 2, 1),
(3, 'Alice', 'Johnson', 3, 1);