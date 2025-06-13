// app/models/Offer.js

var mongoose = require('mongoose');

var offerSchema = mongoose.Schema({
    owner                           : {
        type                        : mongoose.Schema.Types.ObjectId,
        ref                         : 'User'
    },

    bank                            : {
        label                       : String,
        name                        : String,
        img                         : String,
    },

    coutGlobalCredit                : Number,
    taeg                            : Number,
    mensualiteTotal                 : Number,
    agence                      : String,

    money                           : {
        _is                         : Boolean,
        
        montantEmprunte             : Number,
        tauxCredit                  : Number,
        duree                       : Number,
        mensualiteMois              : Number,
        coutInteret                 : Number,
        fraisDossier                : Number,

        typeGarantie                : String,
        coutGarantie                : Number,
        montantRembourse            : Number,

        fraisIntercalaire           : Boolean,
        fraisIntermediaire          : Boolean,
        fraisExamenContrat          : Boolean,
        modeAmortisement            : Boolean,
        transfertPret               : Boolean,
        remboursementAnticipe       : Boolean,
        modularitePret              : Boolean,
        differeRemboursement        : Boolean,
        reportMensualite            : Boolean
    },

    assurance                       : {
        _is                         : Boolean,

        name                        : String,
        tauxCouverture              : Number,
        tauxAssurance               : Number,
        mensualiteAssurance         : Number,
        coutAssurance               : Number,
        couvertureRisqueExclus      : Boolean,
        modeExecutionGarantie       : Boolean,
        delaisCaranceFranchise      : Boolean,
        dateMotifExpirationGarantie : Boolean
    }
});

module.exports = mongoose.model('Offer', offerSchema);
