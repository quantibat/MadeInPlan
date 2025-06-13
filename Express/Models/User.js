// app/models/User.js

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    active                  : Boolean,

    local                   : {
        email               : String,
        password            : String
    },

    facebook                : {
        id                  : String,
        token               : String
    },

    google                  : {
        id                  : String,
        token               : String
    },

    info                    : [{
        picture             : String,
        firstName           : String,
        lastName            : String,
        mail                : String,
        phone               : String
    }],

    activationToken         : String,

    resetPassword           : {
        asked               : Boolean,
        token               : String,
        expireDate          : Date,
        newPassord          : String
    },

    money                   : {
        hasPaid             : Boolean,
        sub_type            : String,
        first_sub_type      : String,
        stripe              : {}
    },

    coach                   : {
        hasPaid             : Boolean,
        stripe              : {}
    },

    lexique                 : [],

    step                    : {},

    meta                    : {
        auto_login          : String,
        firstConnexion      : Boolean,
        lastConnexion       : Date,
        created             : Date
    }
});

userSchema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
