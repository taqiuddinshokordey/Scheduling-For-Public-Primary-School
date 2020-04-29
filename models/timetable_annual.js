var mongoose = require('mongoose');
var shortid = require('shortid');

var TimetableSchema = new mongoose.Schema ({
    
    timeslot_id: {
        required: true, 
        'type': String,
        'default': shortid.generate
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
    }


})

var Timetable = mongoose.model('Timetable', TimetableSchema);
module.exports = Timetable;