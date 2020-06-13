var mongoose = require('mongoose');

var TeacherSchema = new mongoose.Schema ({

    subject: {
        type:String,
        required:true,
    },

    level: {
        type:String,
        required:true,
    },


    second_subject: {
        type:String,
        required:true,
    },

    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

var Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;