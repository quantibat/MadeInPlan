// app/models/Payment_Simulation.js

var mongoose = require('mongoose');

var payment_SimulationSchema = mongoose.Schema({
    owner                           : {
        type                        : mongoose.Schema.Types.ObjectId,
        ref                         : 'User'
    },
    loanAmount                      : Number,
    loanDuration                    : Number,
    interestRate                    : Number,
    insuranceRate                   : Number
});

module.exports = mongoose.model('Payment_Simulation', payment_SimulationSchema);
