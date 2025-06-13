// Express/models/Budget.js

var mongoose = require('mongoose');

var budgetSchema = mongoose.Schema({
    owner               : {
        type            : mongoose.Schema.Types.ObjectId,
        ref             : 'User'
    },
    loan                : String,
    inflow              : String,
    items: [{
        name            : String,
        estimateValue   : Number,
        paid            : Number,
        waiting         : Number,
        category        : String,
        note            : String,
        created         : {
            type        : Date,
            default     : new Date()
        },
        lastEdit        : Date,
        _editable       : {
            type        : Boolean,
            default     : true
        },
        _deletable      : {
            type        : Boolean,
            default     : true
        },
        id              : String,
    }],
    categories            : [{
        name            : String,
        expended        : {
            type        : Boolean,
            default     : false
        },
        created         : {
            type        : Date,
            default     : new Date()
        },
        lastEdit        : Date,
        _editable       : {
            type        : Boolean,
            default     : true
        },
        _deletable      : {
            type        : Boolean,
            default     : true
        },
        id              : String,
    }],
});

budgetSchema.methods.fillBudget = function() {
    this.loan = '0';
    this.inflow = '0';
    this.items = [];
    this.categories = [{ name: "Terrain" }, { name: "Crédit" }, { name: "Assurances" }, { name: "Taxes" }, { name: "Urbanisme" }, { name: "Construction" }, { name: "Travaux réservés" }, { name: "Intérieur" }, { name: "Extérieur" }];
};

module.exports = mongoose.model('Budget', budgetSchema);
