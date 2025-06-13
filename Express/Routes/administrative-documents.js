const express = require('express');
const administrativeDocumentsRouter = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdministrativeDocuments = require('../Models/AdministrativeDocuments');

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({success: false});
}

module.exports = function (app) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../../../Upload/Documents/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });
    if (!fs.existsSync(__dirname + '/../../../Upload/Documents/')) fs.mkdir(__dirname + '/../../../Upload/Documents/', (err) => {});


    administrativeDocumentsRouter.post('/add', isLoggedIn, upload.any(), (req, res, next) => {
        AdministrativeDocuments.findOne({ owner: req.user._id, documentName: req.query.documentName }, (err, item) => {
            if (item === null) {
                var files = [];
                req.files.forEach((file) => {
                    files.push({ filename: file.filename });
                });
                var newItem = new AdministrativeDocuments({
                    owner: req.user._id,
                    documentName: req.query.documentName,
                    files: files,
                    created: new Date()
                });
                newItem.save((err, saved) => {
                    res.status(201).json({ success: true });
                });
            } else {
                req.files.forEach((file) => {
                    item.files.push({ filename: file.filename });
                });
                item.save((err, saved) => {
                    res.status(201).json({ success: true });
                });
            }
        });
    });

    administrativeDocumentsRouter.get('/get', isLoggedIn, (req, res) => {
        AdministrativeDocuments.find({ owner: req.user._id }, function(err, subs) {
            res.status(200).json(subs);
        });
    });

	administrativeDocumentsRouter.post('/remove', isLoggedIn, (req, res) => {
		AdministrativeDocuments.findOne({ _id: req.body.id }, (err, item) => {
            fs.unlinkSync(__dirname + '/../../../Upload/Documents/' + req.body.filename);
            item.files = item.files.filter((file) => file.filename !== req.body.filename);
            if (item.files.length > 0) {
                item.save((err, saved) => {
                    return res.status(200).json({ id: item._id });
                });
            } else {
                item.remove((err, item) => {
                    return res.status(200).json({ id: item._id });
                });
            }
		});
    });
    app.use('/administrative-documents', administrativeDocumentsRouter);
}