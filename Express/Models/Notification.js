// Express/Models/Notification.js

var mongoose = require('mongoose');

var notificationSchema = mongoose.Schema({
    name            : String,
    desc            : String,
    url             : String,
    category        : String,
    date            : Date,
    directSend      : Boolean,
    userTarget      : Number,
    created         : {type: Date, default: new Date()},
    lastEdit        : Date,
    _seen           : [String],
    _sent           : {type: Boolean, default: false}
});

module.exports = mongoose.model('Notification', notificationSchema);