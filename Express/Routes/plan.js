const express = require('express');
const planRouter = express.Router();
const Plan = require('../Models/Plan');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync(__dirname + '/../../../Upload/Plans/')) fs.mkdir(__dirname + '/../../../Upload/Plans/', (err) => {});

var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ success: false });
}

module.exports = function (app) {

    planRouter.get('/get', isLoggedIn, function(req, res) {
        Plan.find({ user: req.user._id }, (err, plans) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            res.status(200).json({ plans: plans });
        });
    });

    planRouter.post('/add', isLoggedIn, function(req, res) {
        if (!fs.existsSync(__dirname + '/../../../Upload/Plans/' + req.user._id + '/')) fs.mkdir(__dirname + '/../../../Upload/Plans/' + req.user._id + '/', (err) => {});

        var filename = Date.now() + '.png';
        var buf = new Buffer(req.body.image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        fs.writeFile(__dirname + '/../../../Upload/Plans/' + req.user._id + '/' + filename, buf, function(err) {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            var newItem = new Plan({
                user: req.user._id,
                plan: req.body.plan,
                url: filename,
                totalPrice: req.body.totalPrice,
                date: new Date(),
                favori: false,
            });
            newItem.save((err, saved) => {
                return res.status(200).json({ plan: saved });
            });
        });
    });

    planRouter.post('/toogle-favori', isLoggedIn, function(req, res) {
        Plan.findOne({ _id: req.body.id }, (err, item) => {
            item.favori = !item.favori;
            item.save(err => {
                return res.status(200).json({ success: true });
            });
        });
    });

    planRouter.post('/delete', isLoggedIn, function(req, res) {
        Plan.findOneAndRemove({ _id: req.body.id }, (err, item) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            fs.unlink(__dirname + '/../../../Upload/Plans/' + req.user._id + '/' + item.url, err => {
                if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
                return res.status(200).json({ success: true });
            });
        });
    });

    app.use('/plan', planRouter);
}
