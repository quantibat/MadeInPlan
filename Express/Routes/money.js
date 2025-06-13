const express = require('express');
const nodemailer = require('nodemailer');
const nodemailer_smtp = require('nodemailer-smtp-transport');
const async = require('async');
const crypto = require('crypto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moneyRouter = express.Router();

const User = require('../Models/User');

var isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ success: false });
}

function checkoutMonthly(user, token, cb) {
    stripe.customers.create({
        email: user.local.email,
        source: token
    }).then(customer => stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: 'plan_D0LQHVVZvza3XZ' }],
    })).then((subscription, err) => {
        if (err) throw new Error(err);
        else {
            user.meta.firstConnexion = false;
            user.money.hasPaid = true;
            user.money.sub_type = 'monthly';
            user.money.stripe = subscription;
            user.save((err, saved) => { cb(saved); });
        }
    });
}

function checkoutFull(user, token, cb) {
    stripe.customers.create({
        email: user.local.email,
        source: token
    }).then(customer => stripe.charges.create({
        amount: 9000,
        description: "Full Charge 90€",
        currency: "eur",
        customer: customer.id
    })).then((charge, err) => {
        if (err) throw new Error(err);
        else {
            user.meta.firstConnexion = false;
            user.money.hasPaid = true;
            user.money.sub_type = 'full';
            user.money.stripe = charge;
            user.save((err, saved) => { cb(saved); });
        }
    });
}

module.exports = function(app) {
    moneyRouter.get('/charge/:id', (req, res) => {
        stripe.charges.retrieve(req.params.id, (err, charge) => {
            if (err) res.status(500).json({ error: err, charge: false });
            else res.json({ error: false, charge: charge });
        });
    });

    moneyRouter.post('/charge/free', isLoggedIn, (req, res) => {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            user.meta.firstConnexion = false;
            user.money.hasPaid = false;
            user.money.sub_type = 'free';
            user.money.first_sub_type = 'free';
            user.save(err => {
                return res.json({ user: user });
            });
        });
    });

    moneyRouter.post('/charge/monthly', isLoggedIn, (req, res) => {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (user.money.sub_type == 'monthly') res.json({ success: false, message: 'Vous avez déjà souscrit à notre offre mentuel' });
            user.money.first_sub_type = 'monthly';
            checkoutMonthly(user, req.body.token, (saved) => {
                return res.json({ user: saved });
            });
        });
    });

    moneyRouter.post('/charge/full', isLoggedIn, (req, res) => {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (user.money.sub_type == 'full') res.json({ success: false, message: 'Vous avez déjà souscrit à notre offre illimité' });
            user.money.first_sub_type = 'full';
            checkoutFull(user, req.body.token, (saved) => {
                return res.json({ user: saved });
            });
        });
    });

    // CHANGE

    moneyRouter.post('/change/free', isLoggedIn, (req, res) => {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (user.money.sub_type == 'free') {
                res.status(400).json({ message: 'Vous avez déjà souscrit à cette offre !' });
            } else if (user.money.sub_type == 'monthly') {
                stripe.subscriptions.del(user.money.stripe.id);
                user.money.hasPaid = false;
                user.money.sub_type = 'free';
                user.save(err => { return res.json({ message: 'Votre changement de souscription a été valider !', user: user }); });
            } else if (user.money.sub_type == 'full') {
                user.money.hasPaid = false;
                user.money.sub_type = 'free';
                user.save(err => { return res.json({ message: 'Votre changement de souscription a été valider !', user: user }); });
            }
        });
    });

    moneyRouter.post('/change/monthly', isLoggedIn, (req, res) => {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (user.money.sub_type == 'monthly') {
                res.status(400).json({ message: 'Vous avez déjà souscrit à cette offre !' });
            } else {
                checkoutMonthly(user, req.body.token, (saved) => {
                    return res.json({ message: 'Votre changement de souscription a été valider !', user: saved });
                });
            }
        });
    });

    moneyRouter.post('/change/full', isLoggedIn, (req, res) => {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (user.money.sub_type == 'full') {
                res.status(400).json({ message: 'Vous avez déjà souscrit à cette offre ! '});
            } else {
                if (user.money.sub_type == 'monthly') stripe.subscriptions.del(user.money.stripe.id);
                checkoutFull(user, req.body.token, (saved) => {
                    return res.json({ message: 'Votre changement de souscription a été valider !', user: saved });
                });
            }
        });
    });

    // PAY COACH

    moneyRouter.post('/coach', isLoggedIn, (req, res) => {
        User.findOne({ '_id': req.user._id }, (err, user) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (user.coach.hasPaid == true) res.json({ success: false, message: 'Vous avez déjà souscrit à notre offre coach !' });

            stripe.customers.create({
                email: user.local.email,
                source: req.body.token
            }).then(customer => stripe.charges.create({
                amount: 249900,
                description: "Coach Charge 2499",
                currency: "eur",
                customer: customer.id
            })).then((charge, err) => {
                if (err) throw new Error(err);
                else {
                    user.coach.hasPaid = true;
                    user.coach.stripe = charge;
                    user.save((err, saved) => {
                        return res.json({ user: saved });
                    });
                }
            });
        });
    });

    app.use('/money', moneyRouter);
}
