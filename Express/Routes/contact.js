const express = require('express');
const contactRouter = express.Router();
const Contact = require('../Models/Contact');
const async = require('async');

var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.status(401).json({success: false});
}

const contactBasis = [
    'Banquier',
    'Courtier en assurance',
    'Courtier en crédit',
    'Agent immobilier',
    'Lotisseur',
    'Notaire',
    'Géomètre',
    'Architecte',
    'BET Géotechnique',
    'Mairie - Service de l\'urbanisme',
    'Engie',
    'Enedis',
    'Fournisseur d\'eau',
    'Cuisiniste'];

module.exports = function (app) {

    contactRouter.get('/get/:type', isLoggedIn, function(req, res) {
        Contact.find({ 'owner':req.user._id, _ref:  req.params.type }, (err, contacts) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
            else if (contacts.length === 0) {
                if (req.params.type != "terrain") {
                    async.map(contactBasis, (contactType, callback) => {
                        var newContact = new Contact({
                            owner: req.user._id,
                            contactType: contactType,
                            firstName: '',
                            localisation: '',
                            name: '',
                            email: '',
                            phoneNumber: '',
                            deletable: false,
                            note: '',
                            _ref: req.params.type,
                        });
                        newContact.save(callback);
                    }, (err, contacts) => {
                        if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
                        res.status(200).json(contacts);
                    });
                } else {
                    return res.status(200).json(contacts);
                }
            } else
            return res.status(200).json(contacts);
        });
    });

    contactRouter.post('/delete', isLoggedIn, function(req, res) {
        Contact.findOneAndRemove({ 'owner': req.user._id, '_id': req.body._id }, (err) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
            res.status(200).json({ success: true });
        });
    });

    contactRouter.post('/add', isLoggedIn, function(req, res) {
        var newContact = new Contact({
            owner: req.user._id,
            contactType: req.body.contactType,
            name: req.body.name,
            firstName: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            localisation: req.body.localisation,
            deletable: req.body.deletable,
            note: req.body.note,
            _ref: req.body._ref
        });
        newContact.save((err, cContact) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
            res.status(200).json(cContact);
        });
    });

    contactRouter.post('/save', isLoggedIn, function(req, res) {
        Contact.findOne({ 'owner': req.user._id, '_id': req.body._id }, (err, contact) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
            else if (!contact) return res.status(404).json({ message: 'Oups, impossible de retrouver le contact...', err });
            contact.contactType = req.body.contactType;
            contact.name = req.body.name;
            contact.firstName = req.body.firstName;
            contact.email = req.body.email;
            contact.phoneNumber = req.body.phoneNumber;
            contact.localisation = req.body.localisation;
            contact.deletable = req.body.deletable;
            contact.note = req.body.note;
            contact._ref = req.body._ref;
            contact.save();
            res.status(200).json(contact);
        });
    });

    app.use('/contact', contactRouter);
}
