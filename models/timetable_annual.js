var mongoose = require('mongoose');
var shortid = require('shortid');

var TimetableSchema = new mongoose.Schema ({
    
    timeslot: {
        required: true, 
        'type': String,
    },

    classroom :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
    },

    subject :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },

    teacher :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'   
    },

    day :{
        type:String, 
        required: true, 
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

var Timetable = mongoose.model('Timetable', TimetableSchema);
module.exports = Timetable;