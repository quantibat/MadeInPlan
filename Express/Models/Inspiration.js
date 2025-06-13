// Express/Models/Inspiration.js

var mongoose = require('mongoose');

var inspirationSchema = mongoose.Schema({
    user            : {
        type        : mongoose.Schema.Types.ObjectId,
        ref         : 'User'
    },
    favori          : Boolean,
    favoriArray     : [],
    _index          : Number,
    _edit           : Boolean,
    url             : String,
    height          : Number,
    width           : Number,
    date            : Date,
    tag             : [],
    board           : {
        type        : mongoose.Schema.Types.ObjectId,
        ref         : 'Board'
    }
});

module.exports = mongoose.model('Inspiration', inspirationSchema);
