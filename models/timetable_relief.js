var mongoose = require('mongoose');


var Timetable_reliefSchema = new mongoose.Schema ({
    
    timeslot: {
        required: true, 
        type: String,
    },

    classroom :{
        type: String,
        
    },

    subject :{
        type: String,
        
    },

    teacher :{
        type: String,
           
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
        type: String,
        ref: 'User'   
    },


})

var Timetable_relief = mongoose.model('Timetable_relief', Timetable_reliefSchema);
module.exports = Timetable_relief;