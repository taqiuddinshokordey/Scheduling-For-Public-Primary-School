var mongoose = require('mongoose');


var SubjectSchema = new mongoose.Schema ({

    subject_name: {
        type:String,
        required:true,
    },

    subject_darjah:{
        type:String,
        required:true,
    },

});

var Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;