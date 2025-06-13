// Express/Models/Notification.js

var mongoose = require('mongoose');

var automaticNotificationSchema = mongoose.Schema({
    name            : String,
    desc            : String,
    url             : String,
    category        : String,
    userTarget      : Number,
    created         : {type: Date, default: new Date()},
    lastEdit        : Date,
    delay           : Number,
    type            : String,
    userId          : String,
    _seen           : [String],
    _sent           : {type: Boolean, default: false}
});

module.exports = mongoose.model('Automatic_Notification', automaticNotificationSchema);