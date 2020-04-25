var mongoose = require('mongoose');
var shortid = require('shortid');


var SubjectSchema = new mongoose.Schema ({

    subject_id: {
        
        required: true, 
        'type': String,
        'default': shortid.generate
    },
    
    subject_name: {
        type:String,
        required:true,
    },

    subject_darjah:{
        type:String,
        required:true,
    }

});

var Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;