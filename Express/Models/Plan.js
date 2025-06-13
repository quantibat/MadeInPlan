// Express/Models/Plan.js

var mongoose = require('mongoose');

var planSchema = mongoose.Schema({
    user            : {
        type        : mongoose.Schema.Types.ObjectId,
        ref         : 'User'
    },
    plan            : Object,
    totalPrice      : Number,
    url             : String,
    favori          : Boolean,
    date            : Date
});

module.exports = mongoose.model('Plan', planSchema);
