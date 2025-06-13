const express = require('express');
const axios = require('axios');
const Notification = require('../Models/Notification');
const Automatic_Notification = require('../Models/Automatic_Notification');
const notifRouter = express.Router();

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({success: false});
}

module.exports = function(app) {

    notifRouter.get('/get', isLoggedIn, (req, res) => {
        Notification.find({}, (err, notifications) => {
            if (err) return (res.status(500).json({message: "Une erreur s'est produite"}))

            Automatic_Notification.find({}, (err, automaticNotifications) => {
            if (err) return (res.status(500).json({message: "Une erreur s'est produite"}))
                automaticNotifications.forEach(notif => notifications.push(notif))
                res.status(200).json(notifications)
            })
        })
    });

    notifRouter.post('/read-notifications', isLoggedIn, (req, res) => {
        var paramNotifs = req.body.notifications;
        paramNotifs.forEach(notif => {
            Notification.findOne({'_id': notif._id}, (err, notification) => {
                if (!notification) {
                    Automatic_Notification.findOne({'_id': notif._id}, (err, notification) => {
                        if (err || !notification) return (res.status(500).json({message: "Une erreur s'est produite"}))
                        if (!notification._seen) notification._seen = [];
                        var found = notification._seen.find(id => req.user._id == id);
                        if (!found) {
                            notification._seen.push(req.user._id);
                            notification.save();
                        }
                    });
                    return;
                };
                if (!notification._seen) notification._seen = [];
                var found = notification._seen.find(id => req.user._id == id);
                if (!found) {
                    notification._seen.push(req.user._id);
                    notification.save();
                }
            }); 
        });
        res.status(200).json({success: true})
        // Notification.find({}, (err, notifications) => {
        //     notifications.forEach(notification => {
        //         var found = notification._seen.find(id => req.user._id == id);
        //         if (!found) {
        //             notification._seen.push(req.user._id);
        //             notification.save();
        //         }
        //     });
        // });
    });

    app.use('/notifications', notifRouter);
}
