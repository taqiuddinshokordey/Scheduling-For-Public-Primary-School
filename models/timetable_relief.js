var mongoose = require('mongoose');
var shortid = require('shortid');

var TimetableReliefSchema = new mongoose.Schema ({
    
    original_teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },

    replacement_teacher :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher' 
    },

    subject :{
        type:String, 
        required: true, 
    },

    teacher :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'  
    },

    year :{
        type:String, 
        required: true, 
    },

    session :{
        type:String,
        required:true,
    }


})

var Timetable = mongoose.model('TimetableRelief', TimetableReliefSchema);
module.exports = Timetable;