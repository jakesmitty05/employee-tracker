const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
);

// prompt the user with options
const runPrompt = () => {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'task',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
      },
    ])
    .then((response) => {
      // Based on the user's choice, make corresponding MySQL queries
      switch(response.task) {
        case 'View all departments':
          viewAllDepartments();
        break;
        case 'View all roles':
          viewAllRoles();
        break;
        case 'View all employees':
          viewAllEmployees();
        break;
        case 'Add a department':
          addDepartment();
        break;
        case 'Add a role':
          addRole();
        break;
        case 'Add an employee':
          addEmployee();
        break;
        case 'Update an employee role':
          updateEmployeeRole();
        break;
      }
  });
}



const viewAllDepartments = () => {
  db.query(
    `SELECT * FROM department;`,
    (err, departments) => {
      if (err) throw err;
      const table = cTable.getTable(departments);
      console.log(table);
      runPrompt();
    }
  )
}

const viewAllRoles = () => {
  db.query(
    `SELECT title, role.id, department.name AS department, salary FROM role 
    INNER JOIN department ON role.department_id = department.id;`,
    (err, roles) => {
      if (err) throw err;
      const table = cTable.getTable(roles);
      console.log(table);
      runPrompt();
    }
  )
}

const viewAllEmployees = () => {
  db.query(
    `SELECT employee.id, employee.first_name, employee.last_name, title, name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`,
    (err, employees) => {
      if (err) throw err;
      const table = cTable.getTable(employees);
      console.log(table);
      runPrompt();
    }
  )
}

const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      message: 'What department would you like to add?',
      name: 'department'
    },
  ])
  .then((response) => {
    db.query(
      `INSERT INTO department (name) VALUES (?)`,
      [response.department],
      (err) => {
        if (err) throw err;
        console.log('Department added');
        runPrompt();
      }
    )
  })
}

const addRole = () => {
  db.query(
    'SELECT * FROM department',
    (err, departments) => {
      if (err) throw err;
      const departmentChoices = departments.map(department => ({
        name: department.name,
        value: department.id
      }));
      inquirer.prompt([
        {
          type: 'input',
          message: 'Enter the title of the role',
          name: 'title'
        },
        {
          type: 'input',
          message: 'Enter the salary for the role',
          name: 'salary',
          validate: input => {
            if (isNaN(input)) {
              console.log('Salary must be a number!');
              return false;
            } else {
              return true;
            }
          }
        },
        {
          type: 'list',
          message: 'Which department does the role belong to?',
          name: 'department_id',
          choices: departmentChoices
        }
      ])
      .then((response) => {
        db.query(
          'INSERT INTO role SET ?', response, (err) => {
            if (err) throw err;
            console.log('Role added');
            runPrompt();
          }
        )
      })
    }
  )
}

const addEmployee = () => {
  db.query(
    'SELECT * FROM role',
    (err, roles) => {
      if (err) throw err;
      const roleChoices = roles.map(role => ({
        name: role.title,
        value: role.id
      }));

      db.query(
        'SELECT * FROM employee',
        (err, employees) => {
          if (err) throw err;
          const managerChoices = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          }));

          managerChoices.unshift({ name: 'None', value: null });

          inquirer.prompt([
            {
              type: 'input',
              message: "Enter the employee's first name",
              name: 'first_name',
            },
            {
              type: 'input',
              message: "Enter the employee's last name",
              name: 'last_name',
            },
            {
              type: 'list',
              message: 'What is the employee’s role?',
              name: 'role_id',
              choices: roleChoices
            },
            {
              type: 'list',
              message: 'Who is the employee’s manager?',
              name: 'manager_id',
              choices: managerChoices
            }
          ])
          .then((response) => {
            db.query(
              'INSERT INTO employee SET ?', response, (err) => {
                if (err) throw err;
                console.log('Employee added');
                runPrompt();
              }
            )
          })
        }
      )
    }
  )
}

const updateEmployeeRole = () => {
  db.query(
    'SELECT * FROM employee',
    (err, employees) => {
      if (err) throw err;
      const employeeChoices = employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }));

      db.query(
        'SELECT * FROM role',
        (err, roles) => {
          if (err) throw err;
          const roleChoices = roles.map(role => ({
            name: role.title,
            value: role.id
          }));

          inquirer.prompt([
            {
              type: 'list',
              message: 'Which employee would you like to update?',
              name: 'employee_id',
              choices: employeeChoices
            },
            {
              type: 'list',
              message: 'What is their new role?',
              name: 'role_id',
              choices: roleChoices
            }
          ])
          .then((response) => {
            db.query(
              'UPDATE employee SET ? WHERE ?', [{ role_id: response.role_id }, { id: response.employee_id }], (err) => {
                if (err) throw err;
                console.log('Employee role updated');
                runPrompt();
              }
            )
          })
        }
      )
    }
  )
}

runPrompt();