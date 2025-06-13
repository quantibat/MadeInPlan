const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const User = require('../Models/User');
const bCrypt = require('bcrypt-nodejs');

function createHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

module.exports = function(passport) {

	passport.use('signup', new LocalStrategy({
			usernameField : 'mail',
	        passwordField : 'password',
            passReqToCallback : true
        },
        function(req, mail, password, done) {

            findOrCreateUser = function() {
                User.findOne({ 'local.email' :  mail }, function(err, user) {
                    if (err) return done(err);
                    if (user) return done(null, false, 'Adresse e-mail déjà utilisée.');
                    else {
                        var newUser = new User({
							local: {
								email: req.body.mail,
								password: createHash(password)
							},
							info: [
								{ firstName: req.body.firstName, lastName: req.body.lastName, mail: req.body.mail, picture: '', phone: '' },
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
							active: false
						});
                        newUser.save(function(err, savedUser) {
                            if (err) throw err;
                            return done(null, savedUser);
                        });
                    }
                });
            };
            process.nextTick(findOrCreateUser);
        })
    );
}
