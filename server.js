const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    port: PORT,
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
    `SELECT employee.id, first_name, last_name, title, name AS department, salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
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
  
}

const addEmployee = () => {
  
}

const updateEmployeeRole = () => {
  
}

runPrompt();