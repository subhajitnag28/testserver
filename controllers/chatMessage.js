var express = require('express'),
    router = express.Router()

var db = require('../db');
const messageController = {};
const ObjectId = require('mongodb').ObjectID;

messageController.getMessages = (req, res) => {
    const requestBody = req.body;
    if (requestBody) {
        var collection = db.get().collection('chat_message');
        collection.find({
            fromUserId: ObjectId(requestBody.fromUserId),
            toUserId: ObjectId(requestBody.toUserId)
        }).sort({ 'timestamp': 1 }).toArray(function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (success.length != 0) {
                    res.status(200).json({
                        success: true,
                        data: {
                            chat_messages: success
                        }
                    });
                } else {
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