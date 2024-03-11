INSERT INTO department (name) VALUES 
    ('Engineering'), 
    ('Sales'), 
    ('Legal'), 
    ('Marketing'), 
    ('Finance'), 
    ('Human Resources');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Engineer', 100000, 1), 
    ('Sales Lead', 150000, 2), 
    ('Legal Counsel', 180000, 3), 
    ('Marketing Manager', 250000, 4), 
    ('Financial Analyst', 120000, 5), 
    ('HR Manager', 180000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Tom', 'Austin', 1, NULL), 
    ('Mary', 'Johnson', 2, 1), 
    ('Bob', 'Smith', 3, NULL), 
    ('Jane', 'Doe', 2, 2),
    ('John', 'Doe', 5, 4),
    ('Jim', 'Johnson', 6, NULL),
    ('Sarah', 'Smith', 5, 6);

