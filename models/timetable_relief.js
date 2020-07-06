var mongoose = require('mongoose');
var Timetable_reliefSchema = new mongoose.Schema ({
    
    timeslot: {
        required: true, 
        type: String,
    },

    classroom :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom'
        
    },

    subject :{
        required: true, 
        'type': String,
        
    },

    teacher :{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
           
    },

    day :{
        type:String, 
        required: true, 
    },

    session :{
        type:String,
        required:true,
    },

    replacement :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'    
    },


    dateEntry:{
        type:String
    },


})

var Timetable_relief = mongoose.model('Timetable_relief', Timetable_reliefSchema);
module.exports = Timetable_relief;