const express = require('express');
const formRouter = express.Router();
const Form = require('../Models/Form');

var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res
        .status(401)
        .json({success: false});
}

module.exports = function (app) {

    formRouter.get('/get', isLoggedIn, function(req, res) {
        Form.findOne({ 'owner': req.user._id, 'name': req.query.name }, (err, form) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            else if (!form) return res.status(404).json({ message: 'Oups, le formulaire est introuvable' });
            res.status(200).json(form);
        });
    });

    formRouter.post('/save', isLoggedIn, function(req, res) {
        Form.findOne({ 'owner': req.user._id, 'name': req.query.name }, (err, form) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            else if (form === null) {
                var newForm = new Form({
                    owner: req.user._id,
                    name: req.query.name,
                    result: req.body
                });
                newForm.save((err, fForm) => {
                    if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
                    res.status(200).json(fForm);
                });
            } else {
                form.result = req.body;
                form.save();
                res.status(200).json(form);
            }
        });
    });

    app.use('/form', formRouter);
}
