var mongoose = require('mongoose');


var ClassroomSchema = new mongoose.Schema ({

    classroom_name: {
        type:String,
        required:true,
    },

    classroom_blok:{
        type:String,
        required:true,
    },

    classroom_floor: {
        type:String,
        required:true,
    }
    


});

var Classroom = mongoose.model('Classroom', ClassroomSchema);
module.exports = Classroom;