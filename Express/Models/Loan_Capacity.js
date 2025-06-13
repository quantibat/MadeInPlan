// app/models/Loan_Capacity.js

var mongoose = require('mongoose');

var loan_CapacitySchema = mongoose.Schema({
    owner                           : {
        type                        : mongoose.Schema.Types.ObjectId,
        ref                         : 'User'
    },
    monthlyAmount                   : Number,
    loanDuration                    : Number,
    interestRate                    : Number,
    insuranceRate                   : Number
});

module.exports = mongoose.model('Loan_Capacity', loan_CapacitySchema);
