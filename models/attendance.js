var mongoose = require('mongoose');

var AttendanceSchema = new mongoose.Schema({
    userId:{
        type:String
    },
    name:{
        type:String
    },
    dateEntry:{
        type:String
    },
    entry:{
        type:String
    },
    exit:{
        time:{
            type:String
        },
        // 1 - General
        // 2 - Vacation
        // 3 - Doctor
        reason:{
            type:String,
            default:"None"
        }
    }


})

var Attendance = mongoose.model('attendance', AttendanceSchema);
module.exports = Attendance;