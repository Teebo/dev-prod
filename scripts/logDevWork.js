#!/usr/bin/env node
const { SERVER_RESPONSE_CODES } = require("../enums");
const fs = require("fs");
const fetch = require("node-fetch");
const shell = require("shelljs");
const homedir = require('os').homedir();

const sendMail = require('../mailer/sendEmailForMultipleWorkItems');

const formatString = str => str.replace(/(\r\n|\n|\r)/gm, "");

const commitHash = fs.readFileSync(`${homedir}/.git-temp-history/commit-hitory-hash`, {encoding: 'utf-8'});
const commitMessage = fs.readFileSync(`${homedir}/.git-temp-history/commit-hitory-message`, {encoding: 'utf-8'});


console.log('commitHash', commitHash);

console.log('commitMessage', commitMessage);

const devName = shell.exec("git config user.name").stdout;
const devEmail = shell.exec("git config user.email").stdout;

const devDetails = {
  devName: formatString(devName),
  devEmail: formatString(devEmail),
  projectName: '',
  logMessage: formatString(commitMessage),
  logTime: new Date().toISOString(),
  projectMetadata: {
    name: '',
    repository: ''
  },
  projectRemoteOrigin: ''
};

const recordUserCommitHistory = () => {
  return fetch(
    "https://tranquil-crag-92279.herokuapp.com/api/devWorkHistoryLog",
    {
      method: "post",
      body: JSON.stringify(devDetails),
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

const linkAndRecordUserCommitToDevOpsWorkItem = (commitHash) => {
  if (validateEmail(formatString(devEmail))) {
    const body = {
      email: devDetails.devEmail,
      commitHash
    };

    fetch("https://rocky-meadow-93622.herokuapp.com/api/workItems", {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === SERVER_RESPONSE_CODES.multipleTaskInProgress) {
          sendMail(formatString(devEmail), commitHash, res.data)
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
    console.log("Invalid email address..");
  }
};

const validateEmail = email => {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return regex.test(String(email).toLowerCase());
};

recordUserCommitHistory().then(res => {
    linkAndRecordUserCommitToDevOpsWorkItem(commitHash);
});

