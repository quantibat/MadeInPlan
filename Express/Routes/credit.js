const express = require('express');
const axios = require('axios');
const Offer = require('../Models/Offer');
const Payment_Simulation = require('../Models/Payment_Simulation');
const Loan_Capacity = require('../Models/Loan_Capacity');
const creditRouter = express.Router();

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({success: false});
}

module.exports = function(app) {

	/* GET Offers */
	creditRouter.get('/get', isLoggedIn, function(req, res) {
		Offer.find({ 'owner': req.user._id }, (err, offers) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
			res.status(200).json({ offers: offers });
		});
	});

	creditRouter.post('/add-offer', isLoggedIn, function(req, res) {
		var newOffer = new Offer({
			owner: req.user._id,
			bank: req.body.offer.bank,
			coutGlobalCredit: req.body.offer.coutGlobalCredit,
			taeg: req.body.offer.taeg,
			mensualiteTotal: req.body.offer.mensualiteTotal,
			money: req.body.offer.money,
			assurance: req.body.offer.assurance
		});
		newOffer.save((err, sOffer) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
			res.status(200).json({ id: sOffer._id });
		});
	});

	creditRouter.post('/edit-offer', isLoggedIn, function (req, res) {
		var offre = req.body.offer;
		Offer.findOne({ 'owner': req.user._id, '_id': req.body.offer._id }, (err, offer) => {
			offer.bank = req.body.offer.bank;
			offer.coutGlobalCredit = req.body.offer.coutGlobalCredit;
			offer.taeg = req.body.offer.taeg;
			offer.mensualiteTotal = req.body.offer.mensualiteTotal;
			offer.money = req.body.offer.money;
			offer.assurance = req.body.offer.assurance;
			offer.agence = req.body.offer.agence;
			offer.save((err) => {
				console.log(err)
			});
			res.status(200).json(offer)
		});
	});

	creditRouter.post('/remove-offer', isLoggedIn, function(req, res) {
		Offer.findOneAndRemove({ 'owner': req.user._id, '_id': req.body.id }, (err, offer) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
			res.status(200).json({ success: true });
		});
	});

	creditRouter.post('/edit-key-value', isLoggedIn, function(req, res) {
		Offer.findOne({ 'owner': req.user._id, '_id': req.body.id }, (err, offer) => {
			console.log(err, offer)
			if (err || !offer) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
			offer[req.body.key] = req.body.value;
			console.log(offer[req.body.key])
			offer.save();
			res.status(200).json(offer);
		});
	});

	creditRouter.get('/payment-simulation', isLoggedIn, function(req, res) {
		Payment_Simulation.find({ 'owner': req.user._id }, (err, simulations) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
			res.status(200).json({ simulations });
		});
	});

	creditRouter.post('/remove-payment-simulation', isLoggedIn, function(req, res) {
		Payment_Simulation.findOneAndRemove({ 'owner': req.user._id, '_id': req.body.id }, (err, simulation) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
			res.status(200).json({ success: true });
		});
	});

	creditRouter.post('/save-payment-simulation', isLoggedIn, function(req, res) {
		if (req.body.created) {
			var newSimulation = new Payment_Simulation({
				owner: req.user._id,
				loanAmount: req.body.loanAmount,
				loanDuration: req.body.loanDuration,
				interestRate: req.body.interestRate,
				insuranceRate: req.body.insuranceRate
			});
			newSimulation.save((err, sSimulation) => {
				if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
				res.status(200).json(sSimulation);
			});
		} else {
			Payment_Simulation.findOne({ 'owner': req.user._id, '_id': req.body.id }, (err, simulation) => {
				if (err || !simulation) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
				simulation.loanAmount = req.body.loanAmount;
				simulation.loanDuration = req.body.loanDuration;
				simulation.interestRate = req.body.interestRate;
				simulation.insuranceRate = req.body.insuranceRate;
				simulation.save();
				res.status(200).json(simulation);
			});
		}
	});

	creditRouter.get('/loan-capacity', isLoggedIn, function(req, res) {
		Loan_Capacity.find({ 'owner': req.user._id }, (err, simulations) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
			res.status(200).json({ simulations });
		});
	});

	creditRouter.post('/remove-loan-capacity', isLoggedIn, function(req, res) {
		Loan_Capacity.findOneAndRemove({ 'owner': req.user._id, '_id': req.body.id }, (err, simulation) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
			res.status(200).json({ success: true });
		});
	});

	creditRouter.post('/save-loan-capacity', isLoggedIn, function(req, res) {
		if (req.body.created) {
			var newSimulation = new Loan_Capacity({
				owner: req.user._id,
				monthlyAmount: req.body.monthlyAmount,
				loanDuration: req.body.loanDuration,
				interestRate: req.body.interestRate,
				insuranceRate: req.body.insuranceRate
			});
			newSimulation.save((err, sSimulation) => {
				if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
				res.status(200).json(sSimulation);
			});
		} else {
			Loan_Capacity.findOne({ 'owner': req.user._id, '_id': req.body.id }, (err, simulation) => {
				if (err || !simulation) return res.status(500).json({ message: 'Oups, une erreur est survenu...', err });
				simulation.monthlyAmount = req.body.monthlyAmount;
				simulation.loanDuration = req.body.loanDuration;
				simulation.interestRate = req.body.interestRate;
				simulation.insuranceRate = req.body.insuranceRate;
				simulation.save();
				res.status(200).json(simulation);
			});
		}
	});

	app.use('/credit', creditRouter);
}
