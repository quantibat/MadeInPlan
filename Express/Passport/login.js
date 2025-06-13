// app/passport/login.js

var LocalStrategy = require('passport-local').Strategy;
var User = require('../Models/User');
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport) {

	passport.use('login', new LocalStrategy({
			usernameField : 'mail',
	        passwordField : 'password',
            passReqToCallback : true
        },
        function(req, mail, password, done) {
            User.findOne({ 'local.email' :  mail },
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, 'Adresse e-mail incorrect');
					if (user.password == '')
                        return done(null, false, 'Cette adresse e-mail est déjà associé à un compte Facebook ou Google');
                    if (!user.isValidPassword(password))
						return done(null, false, 'Mot de passe incorrect');
                    return done(null, user);
                }
            );

        })
    );
}
