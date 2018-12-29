const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");
const ObjectId = require('mongodb').ObjectID;

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
    if (socket.request._query['userId'] != 'null' && socket.request._query['userId'] != 'undefined') {
        let userId = socket.request._query['userId'];
        let userSocketId = socket.id;

        console.log("userId :", userId);
        console.log("userSocketId :", userSocketId);
        if (userId && userSocketId) {
            var collection = db.get().collection('customer');
            collection.find({
                _id: ObjectId(userId)
            }).toArray(function (err, success) {
                if (err) {
                    console.log('socket id update failed');
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
                                    console.log('socket id update failed');
                                } else {
                                    console.log('Socket id updated successfully.');
                                }
                            });
                    }
                }
            });
        }
    }

    /** 
     * get user chat messages
     */
    socket.on('chat-list', (data) => {
        let chatListResponse = {};

        if (data.userId == '' || data.userId == 'null' || data.userId == 'undefined') {
            chatListResponse.error = true;
            chatListResponse.message = `User does not found.`;

            socket.emit('chat-list-response', chatListResponse);
        } else {
            // helper.getUserInfo(data.userId, (err, UserInfoResponse) => {

            //     delete UserInfoResponse.password;

            //     helper.getChatList(socket.id, UserInfoResponse, (err, response) => {

            //         this.io.to(socket.id).emit('chat-list-response', {
            //             error: false,
            //             singleUser: false,
            //             chatList: response
            //         });
            //     });
            // });
        }
    });

    /**
     * send message to user
     */
    socket.on('add-message', (data) => {
        console.log("data :", data);
        if (data.message === '') {
            socket.to(socket.id).emit(`add-message-response`, `Message cant be empty`);
        } else if (data.fromUserId === '') {
            socket.to(socket.id).emit(`add-message-response`, `Unexpected error, Login again.`);
        } else if (data.toUserId === '') {
            socket.to(socket.id).emit(`add-message-response`, `Select a user to chat.`);
        } else {
            let toSocketId;
            let fromSocketId;
            data.timestamp = Math.floor(new Date() / 1000);

            var collection = db.get().collection('customer');

            // to user details get
            collection.find({
                _id: ObjectId(data.toUserId)
            }).toArray(function (err, success) {
                if (err) {
                    console.log('user information can not found');
                } else {
                    if (success.length != 0) {
                        console.log('to user details found :', success);

                        //from user details get
                        collection.find({
                            _id: ObjectId(data.fromUserId)
                        }).toArray(function (err1, success1) {
                            if (err) {
                                console.log('user information can not found');
                            } else {
                                if (success1.length != 0) {
                                    console.log('from user details found :', success1);


                                } else {
                                    console.log('user not found');
                                }
                            }
                        });
                    } else {
                        console.log('user not found');
                    }
                }
            });

            // helper.getUserInfo(data.toUserId, (err, Response) => {
            //     console.log("1" + Response.socketId);
            //     data.toSocketId = Response.socketId
            //     toSocketId = data.toSocketId;
            //     helper.getUserInfo(data.fromUserId, (err, Response) => {
            //         console.log("2" + Response.socketId);
            //         data.fromSocketId = Response.socketId
            //         fromSocketId = data.fromSocketId;
            //         delete data.toSocketId;
            //         helper.insertMessages(data, (error, response) => {
            //             console.log("tosocketId" + toSocketId)
            //             console.log(data);
            //             this.io.to(toSocketId).emit(`add-message-response`, data);
            //         });
            //     });
            // });
        }
    });

});

app.use(express.static('public'));
app.use('/image', express.static(__dirname + '/uploadUserImage'));
app.use('/eventImage', express.static(__dirname + '/eventsImage'));
app.use('/skillShareImage', express.static(__dirname + '/skillShareImage'));
app.use('/api', routes);
server.listen(port);

console.log('Listening on port ' + port);
