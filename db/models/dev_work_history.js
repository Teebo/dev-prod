const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let devWorkHistorySchema = new Schema({
    devEmail: {type: String, require : true},
    projectName: {type: String, require : true},
    logMessage: {type: String, require : true},
    logTime: {type: String}
},{timestamps: true});

let DevWorkHistory = mongoose.model('DevWorkHistory', devWorkHistorySchema);
module.exports = DevWorkHistory;
