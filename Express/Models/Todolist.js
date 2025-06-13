// Express/models/Todolist.js

const mongoose = require('mongoose');
const crypto = require('crypto');
const fs = require('fs');

var todolistSchema = mongoose.Schema({
    owner                   : {
        type                : mongoose.Schema.Types.ObjectId,
        ref                 : 'User'
    },
    lastToggled             : [String],
    tasks                   : [{
        id                  : String,
        url                 : String,
        name                : String,
        desc                : String,
        objectif            : String,
        category            : String,
        favori              : Boolean,
        dateTime            : String,
        budget              : String,
        note                : String,
        checklist           : [{
            name            : String,
            done            : Boolean
        }],
        ressources          : [{
            url             : String,
            formType        : String,
            name            : String,
            desc            : String,
            html            : String,
            category        : [],
            date            : {
                create      : Date,
                modify      : Date,
                publish     : Date
            },
            like            : Number
        }],
        date                : {
            create          : Date,
            modify          : Date
        },
        done                : Boolean,
        _edit               : Boolean
    }],

    categories              : [{
        name                : String,
        totalTask           : Number,
        completeTask        : Number
    }],
    objectifs               : [{
        name                : String,
        totalTask           : Number,
        completeTask        : Number
    }]
});

todolistSchema.methods.addTask = function(task) {
    var id = crypto.randomBytes(10).toString('hex');
    var pos = this.tasks.length;
    if (task._edit == true) {
        for (var i = this.tasks.length - 1; i >= 0; i--) {
            if (this.tasks[i].objectif == task.objectif) {
                pos = i + 1; break;
            }
        }
    }

    this.tasks.splice(pos, 0, {
        id: (task.id ? task.id : id),
        name: task.name,
        desc: task.desc,
        objectif: task.objectif,
        category: task.category,
        favori: task.favori,
        ressources: task.ressources,
        dateTime: '',
        budget: '',
        note: '',
        url: task.url,
        checklist: [],
        done: task.done,
        _edit: task._edit
    });

    this.objectifs.map((item) => {
        if (item.name == task.objectif) item.totalTask += 1;
        return item;
    });
    this.categories.map((item) => {
        if (item.name == task.category) item.totalTask += 1;
        return item;
    });
    return (task.id ? task.id : id);
};

module.exports = mongoose.model('Todolist', todolistSchema);
