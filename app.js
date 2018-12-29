const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 7000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const db = require('./db');
const routes = require('./routes');
// const router = express.Router();

db.connect('mongodb://test:password1@ds237932.mlab.com:37932/ionic_test', function (err) {
    // db.connect('mongodb://127.0.0.1:27017/app_server', function (err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        console.log("connect to mongodb");
    }
});

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', function (socket) {
    if (socket.request._query['userId'] != 'null' && socket.request._query['userId'] != undefined) {
        let userId = socket.request._query['userId'];
        let userSocketId = socket.id;
        if (userId && userSocketId) {
            var collection = db.get().collection('customer');
            collection.find({
                _id: ObjectId(userId)
            }).toArray(function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                } else {
                    if (success.length != 0) {
                        collection.update({
                            _id: ObjectId(userId)
                        }, {
                                $set: { socketId: userSocketId }
                            }, {
                                upsert: true
                            },
                            function (err2, res2) {
                                if (err2) {
                                    res.status(500).json({
                                        success: false,
                                        data: {
                                            message: err2
                                        }
                                    })
                                } else {
                                    res.status(200).json({
                                        success: true,
                                        data: {
                                            message: "Socket id updated successfully."
                                        }
                                    });
                                }
                            });
                    }
                }
            });
        }
    }
});

app.use(express.static('public'));
app.use('/image', express.static(__dirname + '/uploadUserImage'));
app.use('/eventImage', express.static(__dirname + '/eventsImage'));
app.use('/skillShareImage', express.static(__dirname + '/skillShareImage'));
app.use('/api', routes);
server.listen(port);

console.log('Listening on port ' + port);
