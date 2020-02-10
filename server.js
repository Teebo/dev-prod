const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Constants = require('./constants');
const DevWorkHistory = require('./db/models/dev_work_history');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devWork';

mongoose.Promise = global.Promise;
mongoose.connect(dbURI);

mongoose.connection.on('err', function(err) {
  console.log('Could not connect to mongoDB at', dbURI);
  console.log('******************************');
  console.log(err);
  console.log('******************************');
  process.exit(1);
});

const app = express();
app.use(bodyParser.json());


// Generic error handler used by all endpoints.
const handleError  =  (res, reason, message, code) => {
  console.log('ERROR: ' + reason);
  res.status(code || 500).json({'error': message});
}

app.post('/api/devWorkHistoryLog', (req, res) => {
  const newDevWorkHistoryLog = req.body;

  const newDevWorkHistory = new DevWorkHistory({
    devEmail: 'emailll',
    projectName: 'projecname..',
    logMessage: 'message',
    logTime: 'logtimmeee'
  });

  newDevWorkHistory.save((err, doc) => {
    if(err) {
      handleError(res, err.message, 'Failed to create new contact.');
    }

    res.status(200).json({message: 'Developer history log recorded'});
  })
});


app.get('/api/devWorkHistoryLogs', (req, res) => {
  DevWorkHistory.find({})
  .exec(
    (err, docs) => {
      if(err) {
        handleError(res, err.message, 'Failed to create new contact.');
      }

      res.status(200).json({devWorkHistoryLogs: docs});
    }
  );
});


var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log('Running on port: ', port);
});
