const nodemailer = require("nodemailer");

const generateEmailTemplate = (workItems, commitHash,forHTML=false) => {
  let workItemTableRows = ``;

  workItems.forEach(workItem => {
    const emailDev = workItem.assignedTo.uniqueName;
    const id = workItem.id;

    if(forHTML) {
      workItemTableRows += `
      <tr>
        <td style="border: 1px solid #dddddd;
        text-align: left;
        padding: 15px;">${workItem.id}</td>
        <td style="border: 1px solid #dddddd;
        text-align: left;
        padding: 15px;">${workItem.title}</td>
        <td style="border: 1px solid #dddddd;
        text-align: left;
        padding: 15px;">
          <a href="https://rocky-meadow-93622.herokuapp.com/api/workItems/log?emailAddress=${emailDev}&id=${id}&commitHash=${commitHash}" style="color: #fff!important;
          background-color: #2196F3!important;
          padding: 8px;Fto
          text-decoration: none;
          cursor: pointer;">Mark as in progress</a>
        </td>
      </tr>  
      `;
    } else {
      workItemTableRows += `${workItem.id}  ${workItem.title} <a href="https://rocky-meadow-93622.herokuapp.com/api/workItems/log?emailAddress=${emailDev}&id=${id}&commitHash=${commitHash}" class="action-button">Mark as in progress</a>`
    }
  });

  return `
  <h2>Work items in progress</h2>
    <table style="font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;">
      <tr>
        <th style="border: 1px solid #dddddd;
        text-align: left;
        padding: 15px;">ID</th>
        <th style="border: 1px solid #dddddd;
        text-align: left;
        padding: 15px;">Title</th>
        <th style="border: 1px solid #dddddd;
        text-align: left;
        padding: 15px;">Action</th>
      </tr>
      ${workItemTableRows}
    </table>
  `
};
const sendMail = (devEmail, commitHash, workItems) => {
  console.log('SDFSFKJDSKF',workItems);
  let transporter = nodemailer.createTransport({
    // host: "email-smtp.us-east-1.amazonaws.com",
    // port: 465,
    // secure: true,
    // auth: {
    //   user: "thabo@basalt.co",
    //   pass: "4udX**ng"
    // }
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: "rellomailer@gmail.com",
      pass: "Rello@123"
    }
  });



  let mailOptions = {
    from: "nerudo@basalt.co",
    to: 'thabo@basalt.co',
    subject: "Multiple work items in progress",
    text: generateEmailTemplate(workItems, commitHash,false),
    html: generateEmailTemplate(workItems, commitHash,true)
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
