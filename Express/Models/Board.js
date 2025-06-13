// Express/Models/Board.js

var mongoose = require('mongoose');

var boardSchema = mongoose.Schema({
    name            : String,
    user            : {
        type        : mongoose.Schema.Types.ObjectId,
        ref         : 'User'
    },
    nbPicture       : Number,
    date            : Date,
    _index          : Number,
    _edit           : Boolean
});

module.exports = mongoose.model('Board', boardSchema);
