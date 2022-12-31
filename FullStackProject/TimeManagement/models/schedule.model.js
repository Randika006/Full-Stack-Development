//Activity ID // Start Date // End Date // Title // Dscription // Activity Type

// schme

const mongoose = require('mongoose');

var scheduleSchema = new mongoose.Schema({
    ActivityID: {
        type: String,
        required: true
    },
    StartDate: {
        type: String
    },
    EndDate: {
        type: String
    },
    title: {
        type: String
    },
    des: {
        type: String
    },
    Atype: {
        type: String

    }
})


mongoose.model('Schedule', scheduleSchema);