// Express/models/CustomersPlans.js

var mongoose = require('mongoose');

var customersPlansSchema = mongoose.Schema({
    email                 : String,
    files                 : [],
    created               : Date
});

module.exports = mongoose.model('customers-plans', customersPlansSchema);