var mongoose = require('mongoose');
var DummySchema = new mongoose.Schema ({
    
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

    flag:{
        type:Number,
    },


})

var Dummy = mongoose.model('Dummy', DummySchema);
module.exports = Dummy;