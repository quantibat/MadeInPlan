const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../Models/User');
const configAuth = require('../settings');

module.exports = function(passport) {

    passport.use(new GoogleStrategy({
        clientID            : configAuth.googleAuth.clientID,
        clientSecret        : configAuth.googleAuth.clientSecret,
        callbackURL         : configAuth.googleAuth.callbackURL
    },

    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ $or : [{ 'google.id' : profile.id }, { 'local.email' : profile.emails[0].value }]}, function(err, user) {
                if (err) return done(err);
                if (user) return done(null, user);
                else {
                    var newUser = new User({
                        local: {
                            email: profile.emails[0].value,
                        },
                        google: {
                            id: profile.id,
                            token: token
                        },
                        info: [
                            { firstName: profile.name.givenName, lastName: profile.name.familyName, mail: profile.emails[0].value, picture: '', phone: '' },
                            { firstName: '', lastName: '', mail: '', picture: '', phone: '' }
                        ],
                        step: {
                            credit: false,
                            terrain: false,
                            plan: false,
                            permitConstruire: false,
                            artisant: false,
                            chantier: false
                        },
                        money: {
                            hasPaid: false,
                            sub_type: '',
                            stripe: {}
                        },
                        coach: {
                            hasPaid: false,
                            stripe: {}
                        },
                        meta: {
                            created: new Date(),
                            auto_login: crypto.randomBytes(64).toString('hex'),
                            firstConnexion: true
                        },
                        active: true
                    });

                    newUser.save(function(err) {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

};
