var mongoose = require('mongoose');
var shortid = require('shortid');

var TimetableSchema = new mongoose.Schema ({
    
    timeslot_id: {
        required: true, 
        'type': String,
        'default': shortid.generate
    },
})