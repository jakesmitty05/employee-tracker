INSERT INTO department (name) VALUES ('Engineering'), ('Sales'), ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Engineer', 100000, 1),
       ('Sales Lead', 150000, 2),
       ('Lawyer', 180000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Tom', 'Austin', 1, NULL),
       ('Mary', 'Johnson', 2, 1),
       ('Bob', 'Smith', 3, NULL),
       ('Jane', 'Doe', 2, 2);
