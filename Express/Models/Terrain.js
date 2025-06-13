// app/models/Offer.js

var mongoose = require('mongoose');

var terrainSchema = mongoose.Schema({
    owner                           : {
        type                        : mongoose.Schema.Types.ObjectId,
        ref                         : 'User'
    },
    landlord                        : String,
    number                          : String,
    price                           : String,
    fees                            : String,
    surface                         : String,
    localisation                    : String,
    groundType                      : String,
    situation                       : String,
    viable                          : String,
    sanitation                      : String,
    waterRisk                       : String,
    seismalRisk                     : String,
    pool                            : String,
    parking                         : String,
    borne                           : String,
    comments                        : String,
});

module.exports = mongoose.model('Terrain', terrainSchema);