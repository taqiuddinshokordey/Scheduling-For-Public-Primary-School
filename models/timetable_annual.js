var mongoose = require('mongoose');
var shortid = require('shortid');

var TimetableSchema = new mongoose.Schema ({
    
    timeslot: {
        required: true, 
        'type': String,
        
    },

    classroom_id :{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'classroom'
    },

    subject_id :{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'classroom'
    },

    teacher_id :{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'user'
    },

    year :{
        type:String, 
        required: true, 
    },

    session :{
        type:Number,
        required:true,
    }


})

var Timetable = mongoose.model('Timetable', TimetableSchema);
module.exports = Timetable;