var mongoose = require('mongoose');



var ClassroomSchema = new mongoose.Schema ({

   
    classroom_name: {
        type:String,
        required:true,
        unique: true,
    },

    classroom_blok:{
        type:String,
        required:true,
    },

    classroom_floor: {
        type:String,
        required:true,
    },
    
    


});

//authenticate input against database
ClassroomSchema.statics.authenticate = function (classroom_name,  callback) {
	Class.findOne({ classroom_name: classroom_name }).exec(function (err, user) {
        if (err) 
        {
          return callback(err)
          
        } else if (!user)
        {
		  var err = new Error('User not found.');
		  err.status = 401;
		  return callback(err);
		}
		
	  });
  }

var Classroom = mongoose.model('Classroom', ClassroomSchema);
module.exports = Classroom;