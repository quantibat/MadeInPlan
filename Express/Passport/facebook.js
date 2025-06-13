const FacebookStrategy = require('passport-facebook').Strategy;
const crypto = require('crypto');
const User = require('../Models/User');
const configAuth = require('../settings');

module.exports = function(passport) {

    passport.use(new FacebookStrategy({
        clientID            : configAuth.facebookAuth.clientID,
        clientSecret        : configAuth.facebookAuth.clientSecret,
        callbackURL         : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'email', 'name'],
    },

    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ $or : [{ 'facebook.id' : profile.id }, { 'local.email' : profile.emails[0].value }]}, function(err, user) {
                if (err) return done(err);
                if (user) return done(null, user);
                else {
                    var newUser = new User({
                        local: {
                            email: profile.emails[0].value,
                        },
                        facebook: {
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
