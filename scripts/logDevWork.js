#!/usr/bin/env node
const { SERVER_RESPONSE_CODES } = require("../enums");

const fs = require("fs");
const fetch = require("node-fetch");
const shell = require("shelljs");
const sendMail = require('../mailer/sendEmailForMultipleWorkItems');

const formatString = str => str.replace(/(\r\n|\n|\r)/gm, "");

let commitMessage = fs.readFileSync(process.argv[2], { encoding: "utf-8" });
const cwd = shell.pwd().stdout;

const packagesJSON = require(`${cwd}/package.json`);
const devName = shell.exec("git config user.name").stdout;
const devEmail = shell.exec("git config user.email").stdout;
const projectRemoteOrigin = shell.exec("git config remote.origin.url").stdout;

const body = {
  devName: formatString(devName),
  devEmail: formatString(devEmail),
  projectName: formatString(packagesJSON.name),
  logMessage: formatString(commitMessage),
  logTime: new Date().toISOString(),
  projectMetadata: {
    name: formatString(packagesJSON.name),
    repository: formatString(packagesJSON.repository || "")
  },
  projectRemoteOrigin: formatString(projectRemoteOrigin)
};

const recordUserCommitHistory = () => {
  return fetch(
    "https://tranquil-crag-92279.herokuapp.com/api/devWorkHistoryLog",
    {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    }
  )
    .then(res => res.json())
    .then(() => {
      return true;
    })
    .catch(err => {
      console.log("Error:", err);
    });
};

const linkAndRecordUserCommitToDevOpsWorkItem = commitHash => {
  if (validateEmail(formatString(devEmail))) {
    const body = {
      email: 'nerudo@basalt.co',
      commitHash
    };

    fetch("http://localhost:8080/api/workItems", {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === SERVER_RESPONSE_CODES.multipleTaskInProgress) {
          console.log('SKAPP');
          sendMail(formatString(devEmail), res.data)
          .then(
            (data) => {
              console.log('Mailer response:', data);
            }
          )
          .catch(
            (err) =>{
              console.log('ERROR SENDING MAIL', err);
            }
          )
        } else {
          console.log('Work item logged');
        }
      })
      .catch(err => {
        console.log("Error:", err);
      });
  } else {
    console.log("Invalid email address");
  }
};

const validateEmail = email => {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(String(email).toLowerCase());
};

recordUserCommitHistory().then(res => {
  const commitHash = shell.exec(`git rev-parse --verify HEAD`).stdout;
  
  linkAndRecordUserCommitToDevOpsWorkItem(commitHash);
});
