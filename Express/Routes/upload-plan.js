const express = require('express');
const planRouter = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const CustomersPlans = require('../Models/CustomersPlans');

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({success: false});
}

module.exports = function (app) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../../../Upload/Plans/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    const upload = multer({ storage: storage });
    if (!fs.existsSync(__dirname + '/../../../Upload/Plans/')) fs.mkdir(__dirname + '/../../../Upload/Plans/', (err) => {});


    planRouter.post('/add', isLoggedIn, upload.any(), (req, res, next) => {
        var files = [];
        req.files.forEach((file) => {
            files.push({ filename: file.filename });
        });
        var newItem = new CustomersPlans({
            email: req.query.email,
            files: files,
            created: new Date()
        });
        newItem.save((err, saved) => {
            res.status(201).json({ success: true });
        });
    });

    planRouter.get('/get', isLoggedIn, (req, res) => {
        CustomersPlans.find({ email: req.query.email }, function(err, subs) {
            res.status(200).json(subs);
        });
    });

	planRouter.post('/remove', isLoggedIn, (req, res) => {
		CustomersPlans.findOne({ _id: req.body.id }, (err, item) => {
            fs.unlinkSync(__dirname + '/../../../Upload/Plans/' + req.body.filename);
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
    app.use('/upload-plan', planRouter);
}