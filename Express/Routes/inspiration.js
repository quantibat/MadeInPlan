const express = require('express');
const inspirationRouter = express.Router();
const Inspiration = require('../Models/Inspiration');
const Board = require('../Models/Board');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(__dirname + '/../../../Upload/Inspiration/' + req.user._id + '/')) fs.mkdir(__dirname + '/../../../Upload/Inspiration/' + req.user._id + '/', (err) => {});
        cb(null, __dirname + '/../../../Upload/Inspiration/' + req.user._id + '/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

if (!fs.existsSync(__dirname + '/../../../Upload/Inspiration/')) fs.mkdir(__dirname + '/../../../Upload/Inspiration/', (err) => {});

var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ success: false });
}

module.exports = function (app) {

    inspirationRouter.get('/get', isLoggedIn, function(req, res) {
        Board.find({}, (err, boards) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            Inspiration.find({}, (err, inspirations) => {
                if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
                res.status(200).json({ boards: boards.filter(item => JSON.stringify(item.user) == JSON.stringify(req.user._id) || item.user == null).sort((a, b) => a._index > b._index), inspirations: inspirations.filter(item => JSON.stringify(item.user) == JSON.stringify(req.user._id) || item.user == null).sort((a, b) => a._index > b._index) });
            });
        });
    });

    inspirationRouter.get('/board/get', isLoggedIn, function(req, res) {
        Board.find({}, (err, items) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            res.status(200).json({ boards: items.filter(item => JSON.stringify(item.user) == JSON.stringify(req.user._id) || item.user == null).sort((a, b) => a._index > b._index) });
        });
    });

    inspirationRouter.get('/inspiration/get', isLoggedIn, function(req, res) {
        Inspiration.find({}, (err, items) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            res.status(200).json({ inspirations: items.filter(item => JSON.stringify(item.user) == JSON.stringify(req.user._id) || item.user == null).sort((a, b) => a._index > b._index) });
        });
    });

    inspirationRouter.get('/inspiration/get-by-board/:board', isLoggedIn, function(req, res) {
        Inspiration.find({ board: req.params.board }, (err, items) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            res.status(200).json({ inspirations: items.filter(item => JSON.stringify(item.user) == JSON.stringify(req.user._id) || item.user == null).sort((a, b) => a._index > b._index) });
        });
    });

    inspirationRouter.post('/board/add', isLoggedIn, function(req, res) {
        var newItem = new Board({
            name: req.body.name,
            user: req.user._id,
            nbPicture: 0,
            date: new Date(),
            _edit: false
        });
        newItem.save((err, saved) => {
            return res.status(200).json({ board: saved });
        });
    });

    inspirationRouter.post('/inspiration/add', isLoggedIn, upload.single('image'), function(req, res) {
        Board.findOne({ _id: req.body.board }, (err, board) => {
            Inspiration.count({ user: req.user._id }, (err, count) => {
                var newItem = new Inspiration({
                    user: req.user._id,
                    favori: false,
                    favoriArray: [],
                    _index: count,
                    _edit: false,
                    url: req.file.filename,
                    height: req.body.height,
                    width: req.body.width,
                    date: new Date(),
                    tag: JSON.parse(req.body.tag),
                    board: req.body.board
                });
                board.nbPicture += 1;
                board.save();
                newItem.save((err, saved) => {
                    return res.status(200).json({ inspiration: saved });
                });
            });
        });
    });

    inspirationRouter.post('/toogle-favori', isLoggedIn, function(req, res) {
        Inspiration.findOne({ _id: req.body.id }, (err, item) => {
            if (item.user == null) {
                var i = item.favoriArray.indexOf(req.user._id);
                if (i == -1) {
                    item.favoriArray.push(req.user._id);
                } else {
                    item.favoriArray.splice(i, 1);
                }
            } else {
                item.favori = !item.favori;
            }
            item.save(err => {
                return res.status(200).json({ success: true });
            });
        });
    });

    inspirationRouter.post('/inspiration/edit', isLoggedIn, function(req, res) {
        Inspiration.findOne({ _id: req.body.id }, (err, item) => {
            item.tag = req.body.tag;
            item.board = req.body.board;
            item.save((err, saved) => {
                return res.status(200).json({ inspiration: saved });
            });
        });
    });

    inspirationRouter.post('/inspiration/edit-picture', isLoggedIn, upload.single('image'), function(req, res) {
        Inspiration.findOne({ _id: req.body.id }, (err, item) => {
            fs.unlink(__dirname + '/../../../Upload/Inspiration/' + req.user._id + '/' + item.url, (err) => {
                item.url = req.file.filename;
                item.width = req.body.width;
                item.height = req.body.height;
                item.tag = JSON.parse(req.body.tag);
                item.board = req.body.board;
                item.save((err, saved) => {
                    return res.status(200).json({ inspiration: saved });
                });
            });
        });
    });

    inspirationRouter.post('/board/delete', isLoggedIn, function(req, res) {
        Board.findOneAndRemove({ _id: req.body.id }, (err, item) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            Inspiration.find({ board: req.body.id }, (err, items) => {
                if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
                for (var i = 0; i < items.length; i++) {
                    fs.unlink(__dirname + '/../../../Upload/Inspiration/' + req.user._id + '/' + item.url, err => {});
                    items[i].remove();
                }
                return res.status(200).json({ success: true });
            });
        });
    });

    inspirationRouter.post('/inspiration/delete', isLoggedIn, function(req, res) {
        Inspiration.findOne({ _id: req.body.id }, (err, item) => {
            if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
            fs.unlink(__dirname + '/../../../Upload/Inspiration/' + req.user._id + '/' + item.url, err => {
                if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
                Board.findOne({ _id: item.board }, (err, board) => {
                    if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
                    board.nbPicture -= 1;
                    item.remove();
                    board.save(err => {
                        if (err) return res.status(500).json({ message: 'Oups, une erreur est survenue...' });
                        return res.status(200).json({ success: true });
                    });
                });
            });
        });
    });

    app.use('/inspiration', inspirationRouter);
}
