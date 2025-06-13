// Express/models/AdministrativeDocuments.js

var mongoose = require('mongoose');

var administrativeDocumentsSchema = mongoose.Schema({
    owner                           : {
        type                        : mongoose.Schema.Types.ObjectId,
        ref                         : 'User'
    },
    documentName         : String,
    files                 : [],
    created               : Date
});

module.exports = mongoose.model('administrative-documents', administrativeDocumentsSchema);