#!/usr/bin/env node

const fs = require("fs");
const fetch = require("node-fetch");

let commitMessage = fs.readFileSync(process.argv[2], { encoding: "utf-8" });

const body = {
  devEmail: "emailll",
  projectName: "projecname..",
  logMessage: commitMessage,
  logTime: "logtimmeee"
};

fetch("https://tranquil-crag-92279.herokuapp.com/api/devWorkHistoryLog", {
  method: "post",
  body: JSON.stringify(body),
  headers: { "Content-Type": "application/json" }
})
  .then(res => res.json())
  .then(json => {
    console.log(json);
  })
  .catch(err => {
    console.log("Error:", err);
  });
