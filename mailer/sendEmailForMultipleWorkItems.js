const nodemailer = require("nodemailer");

const generateEmailTemplate = (workItems, forHTML=false) => {
  let workItemTableRows = ``;

  workItems.forEach(workItem => {

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
          <a href="https://tranquil-crag-92279.herokuapp.com/api/devWorkHistoryLogs" style="color: #fff!important;
          background-color: #2196F3!important;
          padding: 8px;
          text-decoration: none;
          cursor: pointer;">Mark as in progress</a>
        </td>
      </tr>  
      `;
    } else {
      workItemTableRows += `${workItem.id}  ${workItem.title} <a href="https://tranquil-crag-92279.herokuapp.com/api/devWorkHistoryLogs" class="action-button">Mark as in progress</a>`
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
const sendMail = (devEmail, workItems) => {
  console.log('SDFSFKJDSKF',workItems);
  let transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true,
    auth: {
      user: "AKIA3ENJY6CJ5FZEXF55",
      pass: "BEtoOR6IrvQLxbSfsU/73L/GLbRT6GsZ21qPLT+O3jZW"
    }
  });

  let mailOptions = {
    from: "thabo@basalt.co",
    to: 'ngubanethabo.ambrose@gmail.com',
    subject: "Multiple work items in progress",
    text: generateEmailTemplate(workItems, false),
    html: generateEmailTemplate(workItems, true)
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
