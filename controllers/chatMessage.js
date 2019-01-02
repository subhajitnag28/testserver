var express = require('express'),
    router = express.Router()

var db = require('../db');
const messageController = {};
const ObjectId = require('mongodb').ObjectID;

messageController.getMessages = (req, res) => {
    const requestBody = req.body;
    if (requestBody) {
        var collection = db.get().collection('chat_message');
        const value = {
            '$or': [
                {
                    '$and': [
                        {
                            toUserId: requestBody.fromUserId
                        }, {
                            fromUserId: requestBody.toUserId
                        }
                    ]
                }, {
                    '$and': [
                        {
                            toUserId: requestBody.toUserId
                        }, {
                            fromUserId: requestBody.fromUserId
                        }
                    ]
                },
            ]
        };

        console.log('val :', value);
        collection.find(value).sort({ 'timestamp': 1 }).toArray(function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                console.log('succ :', success);
                if (success.length != 0) {
                    res.status(200).json({
                        success: true,
                        data: {
                            chat_messages: success
                        }
                    });
                } else {
                    console.log('err');
                    res.status(404).json({
                        success: false,
                        data: {
                            message: "Messages not found."
                        }
                    });
                }
            }
        });
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "fromUserId anf toUserId are required."
            }
        });
    }
}

module.exports = messageController;