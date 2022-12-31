const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/TimeManagement";

//connect method of mongoose

mongoose.connect(url, { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log("MongoDB Connection Succeeded");
    } else {

        //if any error is there
        console.log("An Error Occured in connecting mongodb" + err);
    }
})

// include the employee model

require('./schedule.model');