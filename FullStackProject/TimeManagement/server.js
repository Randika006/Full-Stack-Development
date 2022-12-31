require('./models/db');
const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');
const _hbs = require('handlebars')

const expressHandlebars = require('express-handlebars');


const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')



const scheduleController = require('./controller/scheduleController');


var app = express();



//configure midleware
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); // it will be converting all the request data to json format

//configuring the view of the application
app.set('views', path.join(__dirname, '/views/'));

// configuration express for handlebars
app.engine('hbs', expressHandlebars.engine({
    extname: 'hbs',
    defaultLayout: 'mainLayout',
    handlebars: allowInsecurePrototypeAccess(_hbs),
    layoutsDir: __dirname + '/views/layouts/'
}));

app.set('view engine', 'hbs'); // sucessfully configure the express handlebars

app.use(express.static('/views/Schedule'));
//app.use('/images', express.static('images'));

app.use(express.static(path.join(__dirname, "/public")));


app.listen(5000, () => {

    console.log("Serve is listening Port 5000");
})
app.use('/schedule', scheduleController);