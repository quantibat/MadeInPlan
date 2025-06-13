// Express/Models/PlanConfigurator.js

var mongoose = require('mongoose');

var planConfiguratorSchema = mongoose.Schema({
    configurations   : [],
    lastSync        : Date
});

module.exports = mongoose.model('PlanConfigurator', planConfiguratorSchema);