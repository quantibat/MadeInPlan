// app/models/Contact.js

var mongoose = require('mongoose');

var contactSchema = mongoose.Schema({
    owner                           : {
        type                        : mongoose.Schema.Types.ObjectId,
        ref                         : 'User'
    },
    _ref                            : String,
    contactType                     : String,
    name                            : String,
    firstName                       : String,
    localisation                    : String,
    email                           : String,
    phoneNumber                     : String,
    deletable                       : Boolean,
    note                            : String
});

module.exports = mongoose.model('Contact', contactSchema);