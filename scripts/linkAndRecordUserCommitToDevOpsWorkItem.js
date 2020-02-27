#!/usr/bin/env node

const fs = require("fs");
const fetch = require("node-fetch");
const shell = require("shelljs");
const inquirer = require("inquirer");


inquirer
  .prompt([
    {
      type: 'checkbox',
      message: 'Select work item(s) you want to link to this commit',
      name: 'workItem',
      choices: [
        {
          name: 'Pepperoni'
        },
        {
          name: 'Ham'
        },
        {
          name: 'Ground Meat'
        },
        {
          name: 'Bacon'
        }
      ],
      validate: function(answer) {
        if (answer.length < 1) {
          return 'You must choose at least one work item.';
        }

        return true;
      }
    }
  ])
  .then(answers => {
    console.log(JSON.stringify(answers, null, '  '));
  });