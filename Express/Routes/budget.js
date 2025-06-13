const express = require('express');
const axios = require('axios');
const Budget = require('../Models/Budget');
const User = require('../Models/User');
const budgetRouter = express.Router();
var pdf = require('html-pdf');
var fs = require('fs');
var path = require('path');

var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({success: false});
}

module.exports = function (app) {

    /* GET Budgets */
    budgetRouter.get('/get', isLoggedIn, function (req, res) {
        Budget.findOne({ 'owner': req.user._id }, (err, budget) => {
            if (err)
            return res.status(500).json({message: 'Oups, une erreur est survenue...'});
            if (!budget) {
                axios.get('http://localhost:9000/budget/get').then((response) => {
                    let budgetTemplate = response.data;
                    let newBudget = new Budget({owner: req.user._id});
                    newBudget.categories = budgetTemplate.categories;
                    newBudget.items = budgetTemplate.items;
                    newBudget.loan = 0;
                    newBudget.inflow = 0;
                    newBudget.save((err, saved) => {
                        if (err) return res.status(500).json({message: 'Oups, une erreur est survenu...'});
                        if (!saved.items) return res.status(200).json(saved);
                        // saved.items = req.user.money.hasPaid == true ? saved.items : saved.items.filter(item => item._editable == true);
                        return res.status(200).json(saved);
                    });
                });
            } else {
                res.status(200).json(budget);
            }
        });
    });

    budgetRouter.post('/edit-key-value', isLoggedIn, function (req, res) {
        Budget.findOne({ 'owner': req.user._id }, (err, budget) => {
            if (err || !budget) return res.status(500).json({message: 'Oups, une erreur est survenu...'});
            budget[req.body.key] = req.body.value;
            budget.save();
            res.status(200).json(budget);
        });
    });

    budgetRouter.get('/get-preview/:id', (req, res) => {
        Budget.findOne({ 'owner': req.params.id }, (err, budget) => {
            if (err || !budget) return res.status(500).json({message: 'Oups, une erreur est survenue...'});
            User.findById(req.params.id , (err, user) => {
                if (err) return res.status(500).json({message: 'Oups, une erreur est survenue...'});
                res.status(200).json({budget, info: user.info});

            });
		});
	});

    app.use('/budget', budgetRouter);
}
