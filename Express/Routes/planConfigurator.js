const express = require('express');
const planConfiguratorRouter = express.Router();
const PlanConfigurator = require('../Models/PlanConfigurator');

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({ success: false });
}

module.exports = function(app) {

    planConfiguratorRouter.get('/get', isLoggedIn, (req, res) => {
        PlanConfigurator.findOne({  }, (err, config) => {
            if (err) res.status(500).json({ success: false });
            if (!config) {
				var newConfig = new PlanConfigurator({ configurations: [{
                    name: 'Pas de WC dans un coin',
                    enabled: true
                }, {
                    name: 'Dégagement sans mur extérieur',
                    enabled: true
                }, {
                    name: 'Salon dans un coin',
                    enabled: true
                }, {
                    name: 'Séparation jour nuit',
                    enabled: true
                }, {
                    name: 'Suite parentale dans la zone jour',
                    enabled: false
                }, {
                    name: 'Suite parentale sur terrasse',
                    enabled: false
                }], lastSync: new Date() });
				newConfig.save((err, sConfig) => {
                    res.status(201).json(sConfig);
				});
            } else {
                res.status(200).json(config);
            }
        });
    });

    app.use('/planConfigurator', planConfiguratorRouter);
};