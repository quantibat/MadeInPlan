// app/settings.js

module.exports = {
    'urlDB' : 'mongodb://localhost/MadeInPlan',
    'secret': 'leRoseauPlitMaisNeCedeQuandCasDePepin',

    'facebookAuth' : {
        'clientID'      : '280998259067457',
        'clientSecret'  : 'dc44061656e758a63b9f27d1a9e1cee8',
        'callbackURL'   : 'https://app.madeinplan.fr/auth/facebook/callback'
        // 'callbackURL'   : 'https://app.myeconomiste.com/auth/facebook/callback'
    },
    'googleAuth' : {
        'clientID'      : '780367748859-cam8v8emgudr9ah0j4c393rob3786f87.apps.googleusercontent.com',
        'clientSecret'  : 'qGQtPWC0W5DtpvOtjukz_SOH',
        'callbackURL'   : 'https://app.madeinplan.fr/auth/google/callback'
        // 'callbackURL'   : 'https://app.myeconomiste.com/auth/google/callback'
    }
}
