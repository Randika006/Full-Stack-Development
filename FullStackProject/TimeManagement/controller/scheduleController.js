const { application } = require('express');
const express = require('express');

const mongoose = require('mongoose');

var nodemailer = require('nodemailer');

const Schedule = mongoose.model('Schedule');

const router = express.Router();


//Display a Home Page
router.get('/', (req, res) => {
    Schedule.find((err, docs) => {
        if (!err) {
            res.render('schedule/home', {
                home: docs
            })
        }
    })
})

//Gunchart
router.get('/gchart', (req, res) => {
    Schedule.find((err, docs) => {
        if (!err) {
            res.render('schedule/gchart', {
                home: docs
            })
        }
    })
})

//Services
router.get('/myser', (req, res) => {
    Schedule.find((err, docs) => {
        if (!err) {
            res.render('schedule/sear', {
                home: docs
            })
        }
    })
})


//voice recognition

router.get('/voice', (req, res) => {
    Schedule.find((err, docs) => {
        if (!err) {
            res.render('schedule/voice', {
                home: docs
            })
        }
    })
})



//Display a Activity Details entring form
router.get('/addOrEdit', (req, res) => {
    res.render('schedule/addOrEdit.hbs', {
        //viewTitle: 'Add Activity Details'
    })
})

//handle the post request
router.post('/', (req, res) => {
    //just check if this post is for the creation of the record or the updation
    if (req.body._id == "") {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }

    //insertRecord(req, res);

})

function insertRecord(req, res) {
    var schedule = new Schedule();

    schedule.ActivityID = req.body.ActivityID;

    schedule.StartDate = req.body.StartDate;

    schedule.EndDate = req.body.EndDate;
    schedule.title = req.body.title;
    schedule.des = req.body.des;
    schedule.Atype = req.body.Atype;

    //checking for validation
    if (schedule.ActivityID == "" || schedule.StartDate == "" || schedule.EndDate == "" || schedule.title == "" || schedule.des == "" || schedule.Atype == "") {
        res.render('schedule/addOrEdit', ({
            viewTitle: 'Add Activity Details',
            error: 'Enter all details',
            schedule: req.body

        }))
        return;
    }

    schedule.save((err, doc) => {
        //if no error is there
        if (!err) {
            res.redirect('schedule/list');
        } else {
            //if error is there 

            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render('schedule/addOrEdit', {
                    viewTitle: 'Insert Schedule',
                    schedule: req.body
                })
            }

            console.log("Error occured during record insertion" + err);
        }
    })

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'timeschedule78@gmail.com',
            pass: 'wtcfbmfgshmecmny'
        }
    });

    var mailOptions = {
        from: 'timeschedule78@gmail.com',
        to: 'timeschedule78@gmail.com',
        subject: 'Sending a sucess message',
        //text: 'your task added successfully to the time schedule'

        text: 'Activity ID :==>' + schedule.ActivityID + '|| Start Date :==>' + schedule.StartDate + '|| End Date :==>' + schedule.EndDate + '|| Title :==>' + schedule.title + '|| Descriptin :==>' + schedule.des + '|| Activity type :==>' + schedule.Atype

    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });


}

// create a route for displaying all users
router.get('/list', (req, res) => {
    Schedule.find((err, docs) => {
        if (!err) {
            res.render('schedule/list', {
                list: docs
            })
        }
    })
})


router.get('/:id', (req, res) => {
    Schedule.findById(req.params.id, (err, doc) => {
        //check for the error
        if (!err) {
            res.render('schedule/addOrEdit', ({
                viewTitle: 'Update Activity',
                schedule: doc
            }))
        }
    })

})

router.get('/delete/:id', (req, res) => {
    Schedule.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/schedule/list');
        } else {
            console.log("An error occured during the delete operaton" + err);
        }
    })
})

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'ActivityID':
                body['ActivityIDError'] = err.errors[field].message;
                break;

            case 'StartDate':
                body['StartDateError'] = err.errors[field].message;
                break;
            case 'EndDate':
                body['EndDateError'] = err.errors[field].message;
                break;
            case 'title':
                body['titleError'] = err.errors[field].message;
                break;
            case 'des':
                body['desError'] = err.errors[field].message;
                break;
            case 'Atype':
                body['AtypeError'] = err.errors[field].message;
                break;


            default:
                break;
        }
    }
}

function updateRecord(req, res) {

    Schedule.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        //if no error is there

        if (!err) {
            res.redirect('schedule/list');
        } else {
            //if any error is there
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render('shedule/addOrEdit', ({
                    viewTitle: 'Update Activity',
                    schedule: req.body
                }))
            } else {
                console.log("Error occured in updating the records" + err);
            }
        }
    })


}


module.exports = router;