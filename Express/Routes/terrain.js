const express = require('express');
const axios = require('axios');
const Terrain = require('../Models/Terrain');
const terrainRouter = express.Router();

var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) 
        return next();
    res
        .status(401)
        .json({success: false});
}

module.exports = function (app) {

    /* GET TERRAINS  */
    terrainRouter
        .get('/get', isLoggedIn, function (req, res) {
            Terrain.find({
                'owner': req.user._id
            }, (err, terrains) => {
                if (err) 
                    return res.status(500).json({message: 'Oups, une erreur est survenue...'});
                res
                    .status(200)
                    .json({terrains: terrains});
            });
        });

    terrainRouter.post('/add-terrain', isLoggedIn, function (req, res) {
        var newTerrain = new Terrain({
			owner: req.user._id,
            landlord: req.body.terrain.landlord,
            number: req.body.terrain.number,
            price: req.body.terrain.price,
            fees: req.body.terrain.fees,
            surface: req.body.terrain.surface,
            localisation: req.body.terrain.localisation,
            groundType: req.body.terrain.groundType,
            situation: req.body.terrain.situation,
            viable: req.body.terrain.viable,
            sanitation: req.body.terrain.sanitation,
            waterRisk: req.body.terrain.waterRisk,
            seismalRisk: req.body.terrain.seismalRisk,
            pool: req.body.terrain.pool,
            parking: req.body.terrain.parking,
            borne: req.body.terrain.borne,
            comments: req.body.terrain.comments
        });
        newTerrain.save((err, sTerrain) => {
            if (err) 
                return res.status(500).json({message: 'Oups, une erreur est survenu...'});
            res
                .status(200)
                .json({id: sTerrain._id});
        });
    });

    terrainRouter.post('/edit-terrain', isLoggedIn, function (req, res) {
        var offre = req.body.terrain;
        Terrain.findOne({
            'owner': req.user._id,
            '_id': req.body.terrain._id
        }, (err, terrain) => {

            terrain.landlord = req.body.terrain.landlord;
            terrain.number = req.body.terrain.number;
            terrain.price = req.body.terrain.price;
            terrain.fees = req.body.terrain.fees;
            terrain.surface = req.body.terrain.surface;
            terrain.localisation = req.body.terrain.localisation;
            terrain.groundType = req.body.terrain.groundType;
            terrain.situation = req.body.terrain.situation;
            terrain.viable = req.body.terrain.viable;
            terrain.sanitation = req.body.terrain.sanitation;
            terrain.waterRisk = req.body.terrain.waterRisk;
            terrain.seismalRisk = req.body.terrain.seismalRisk;
            terrain.pool = req.body.terrain.pool;
            terrain.parking = req.body.terrain.parking;
            terrain.borne = req.body.terrain.borne;
            terrain.comments = req.body.terrain.comments;

            terrain.save((err) => {
                console.log(err)
            });
            res
                .status(200)
                .json(terrain)
        });
    });

    terrainRouter.post('/remove-terrain', isLoggedIn, function (req, res) {
        Terrain.findOneAndRemove({
            'owner': req.user._id,
            '_id': req.body.id
        }, (err, terrain) => {
            if (err) 
                return res.status(500).json({message: 'Oups, une erreur est survenu...'});
            res
                .status(200)
                .json({success: true});
        });
    });

    terrainRouter.post('/edit-key-value', isLoggedIn, function (req, res) {
        Terrain.findOne({
            'owner': req.user._id,
            '_id': req.body.id
        }, (err, terrain) => {
            if (err || !terrain) 
                return res.status(500).json({message: 'Oups, une erreur est survenu...'});
            terrain[req.body.key] = req.body.value;
            terrain.save();
        });
    });

    app.use('/terrain', terrainRouter);
}
