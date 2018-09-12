var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db');
var cors = require('cors')
var routes = require('./routes');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
var port = process.env.PORT || 7000;

db.connect('mongodb://test:password1@ds237932.mlab.com:37932/ionic_test', function (err) {
// db.connect('mongodb://127.0.0.1:27017/app_server', function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        console.log("connect to mongodb");
    }
})
var router = express.Router();

app.use(express.static('public'));
app.use('/image', express.static(__dirname + '/uploadUserImage'));
app.use('/eventImage', express.static(__dirname + '/eventsImage'));
app.use('/api', routes);
app.listen(port);
console.log('Listening on port ' + port);
