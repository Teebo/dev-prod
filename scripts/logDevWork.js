#!/usr/bin/env node

const fs = require("fs");
const fetch = require("node-fetch");
const shell = require("shelljs");

const formatString = (str) => str.replace(/(\r\n|\n|\r)/gm, "");

let commitMessage = fs.readFileSync(process.argv[2], { encoding: "utf-8" });
const cwd = shell.pwd().stdout;

const packagesJSON = require(`${cwd}/package.json`);
const devName = (shell.exec('git config user.name').stdout);
const devEmail = shell.exec('git config user.email').stdout;
const projectRemoteOrigin = shell.exec('git config remote.origin.url').stdout;

const body = {
  devName: formatString(devName),
  devEmail: formatString(devEmail),
  projectName: formatString(packagesJSON.name),
  logMessage: formatString(commitMessage),
  logTime: new Date().toISOString(),
  projectMetadata: {
    name: formatString(packagesJSON.name),
    repository: formatString(packagesJSON.repository || '')
  },
  projectRemoteOrigin: formatString(projectRemoteOrigin)
};

const recordUserCommitHistory = async () => {
  return fetch("https://tranquil-crag-92279.herokuapp.com/api/devWorkHistoryLog", {
    method: "post",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(() => {
      return true;
    })
    .catch(err => {
      console.log("Error:", err);
  });
};

const recordingResults = async () => {
  const res = await recordUserCommitHistory();

  return res;
}


console.log('Res...', recordingResults());