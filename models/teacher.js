var mongoose = require('mongoose');



var TeacherSchema = new mongoose.Schema ({

    
    
    subject: {
        type:String,
        required:true,
    },

    experience:{
        type:String,
        required:true,
    },

    level: {
        type:String,
        required:true,
    },

    subject{
        type:String,
        required:true,
    }

});

var Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;