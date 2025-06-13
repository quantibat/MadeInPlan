const express = require('express');
const axios = require('axios');
const Todolist = require('../Models/Todolist');
const todolistRouter = express.Router();

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({success: false});
}

module.exports = function(app) {

    /* GET Todolist */
	todolistRouter.get('/get', isLoggedIn, (req, res) => {
        Todolist.findOne({ 'owner': req.user._id }, (err, todolist) => {
			if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
            if (!todolist) {
				var newTodolist = new Todolist({ owner: req.user._id });
				// Initialiser une todolist vide au lieu d'essayer de récupérer depuis localhost:9000
				newTodolist.save();
				return res.status(200).json({ todolist: newTodolist });
			} else
				return res.status(200).json({ todolist: todolist });
		});
	});

	/* GET Todolist */
	todolistRouter.get('/get-task/:id', isLoggedIn, (req, res) => {
        Todolist.findOne({ 'owner': req.user._id }, (err, todolist) => {
			if (err || !todolist) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
			var task = todolist.tasks.find((item) => {
				return item.id == req.params.id;
			});
			return res.status(200).json({ task: task });
		});
	});

    /* POST /add-task Todolist */
	todolistRouter.post('/add-task', isLoggedIn, (req, res) => {
        Todolist.findOne({ 'owner': req.user._id }, (err, todolist) => {
            if (err || !todolist) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
			var id = todolist.addTask(req.body.task);
			todolist.save((err) => {
				if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
				return res.status(200).json({ id: id });
			});
		});
	});

	/* POST /toogle-task Todolist */
	todolistRouter.post('/toggle-task', isLoggedIn, (req, res) => {
        Todolist.findOne({ 'owner': req.user._id }, (err, todolist) => {
            if (err || !todolist) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });

			for (var i = 0; i < todolist.tasks.length; i++) {
				if (todolist.tasks[i].id == req.body.id) {
					todolist.tasks[i].done = !todolist.tasks[i].done;
					var iObjectif = todolist.objectifs.findIndex((item) => { return item.name == todolist.tasks[i].objectif });
		            var iCategory = todolist.categories.findIndex((item) => { return item.name == todolist.tasks[i].category });

		            todolist.objectifs[iObjectif].completeTask += (todolist.tasks[i].done ? 1 : -1);
		            todolist.categories[iCategory].completeTask += (todolist.tasks[i].done ? 1 : -1);
					
					break;
				}
			}

			if (todolist.tasks[i].done) {
				todolist.lastToggled.unshift(req.body.id);
			} else {
				const index = todolist.lastToggled.findIndex(id => id == req.body.id);
				if (index != -1) todolist.lastToggled.splice(index, 1);
			}

			todolist.save((err) => {
				if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
				return res.status(200).json({ success: true });
			});
		});
	});

	/* POST /edit-key-value Todolist */
	todolistRouter.post('/edit-key-value', isLoggedIn, (req, res) => {
        Todolist.findOne({ 'owner': req.user._id }, (err, todolist) => {
            if (err || !todolist) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });

			for (var i = 0; i < todolist.tasks.length; i++) {
				if (todolist.tasks[i].id == req.body.id) {
					todolist.tasks[i][req.body.key] = req.body.value;
					break;
				}
			}

			todolist.save((err) => {
				if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
				return res.status(200).json({ success: true });
			});
		});
	});

	/* POST /remove-task Todolist */
	todolistRouter.post('/remove-task', isLoggedIn, (req, res) => {
        Todolist.findOne({ 'owner': req.user._id }, (err, todolist) => {
            if (err || !todolist) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });

			for (var i = 0; i < todolist.tasks.length; i++) {
				if (todolist.tasks[i].id == req.body.id) {
					var iObjectif = todolist.objectifs.findIndex((item) => { return item.name == todolist.tasks[i].objectif });
		            var iCategory = todolist.categories.findIndex((item) => { return item.name == todolist.tasks[i].category });

		            todolist.objectifs[iObjectif].completeTask -= (todolist.tasks[i].done ? 1 : 0);
		            todolist.categories[iCategory].completeTask -= (todolist.tasks[i].done ? 1 : 0);
					todolist.objectifs[iObjectif].totalTask -= 1;
		            todolist.categories[iCategory].totalTask -= 1;

					todolist.tasks.splice(i, 1);
					break;
				}
			}

			todolist.save((err) => {
				if (err) return res.status(500).json({ message: 'Oups, une erreur est survenu...' });
				return res.status(200).json({ success: true });
			});
		});
	});

	app.use('/todolist', todolistRouter);
}
