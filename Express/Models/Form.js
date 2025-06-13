// app/models/Form.js

var mongoose = require('mongoose');

var formSchema = mongoose.Schema({
    owner                           : {
        type                        : mongoose.Schema.Types.ObjectId,
        ref                         : 'User'
    },
    name                            : String,
    result                          : mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Form', formSchema);

//Form model for the front side

// {
//     formName: '', // The form name that will be stored in the database
//     questions: [{
//         type: '', // ex: multibutton, range, tile, minitile, text
//         multipleAnswer: false, // ex: false, true if multiple answers can be chosen
//         resultName: '', // The name of the result that will be stored in the database
//         baseResult: null, // The base result that will be displayed first
//         title: '', // The name of the question
//         isRequired: true, // To check if the question is required or not
//         answers: [{ // Depend of the question type example for multibutton
//             name: '', // The name of the question
//             answer: '' // The answer that will be stored in the resultName field
//         }],
//         options: {}, // To add options that depend on each type of question ex: min and max range on the range question type
//     }],
//     recap: {
//         name: '', // The name of the recap
//     }
// }