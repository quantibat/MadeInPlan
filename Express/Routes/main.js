const express = require('express');
const path = require('path');
const mainRouter = express.Router();

module.exports = (app) => {

	/* GET index.html Page */
	mainRouter.get('*', (req, res) => {
		if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'preprod') {
			if (req.subdomains[0] == 'app') {
				res.sendFile(path.resolve(app.get('desktop_html')));
			} else if (req.subdomains[0] == 'mobile') {
				res.sendFile(path.resolve(app.get('mobile_html')));
			}
		} else {
			res.sendFile(app.get('desktop_html'));
		}
	});

	app.use('/', mainRouter);
}
