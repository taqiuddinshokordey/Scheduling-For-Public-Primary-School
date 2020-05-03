var mongoose = require('mongoose');
var shortid = require('shortid');

var TimetableSchema = new mongoose.Schema ({
    
    timeslot: {
        required: true, 
        'type': Number,
        
    },

    classroom :{
        type:String, 
        required: true, 
    },

    subject :{
        type:String, 
        required: true, 
    },

    teacher :{
        type:String, 
        required: true, 
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