var mongoose = require('mongoose');

var KehadiranSchema = new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now,
    },
    entry:{type:Date},
    exit:{
        time:{
            type:Date
        },
        // 1 - General
        // 2 - Vacation
        // 3 - Doctor
        reason:Number
    }


})

var Kehadiran = mongoose.model('Kehadiran', KehadiranSchema);
module.exports = Kehadiran;