var express = require('express'),
    router = express.Router();
var db = require('../db');
const requestController = {};
const ObjectId = require('mongodb').ObjectID;

requestController.sendRequest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.senderId &&
        requestBody.receiverId &&
        requestBody.senderName &&
        requestBody.receiverName) {
        var Request = db.get().collection('request');

        const value = {
            senderId: ObjectId(requestBody.senderId),
            receiverId: ObjectId(requestBody.receiverId),
            request_time: new Date().getTime(),
            friend: [],
            request_send: [requestBody.receiverId],
            pending_request: [requestBody.senderId],
            isAccept: 0
        };
        Request.save(value, function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: {
                        message: "Request send.",
                        details: success.ops[0]
                    }
                });
            }
        });
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "senderId, receiverId, senderName and receiverName are required."
            }
        });
    }
}

requestController.acceptRequest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.senderId && requestBody.receiverId) {
        var Request = db.get().collection('request');
        Request.find({
            senderId: ObjectId(requestBody.senderId),
            receiverId: ObjectId(requestBody.receiverId)
        }).toArray(function (err, docs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (docs.length != 0) {
                    const data = {
                        _id: docs[0]._id,
                        senderId: docs[0].senderId,
                        receiverId: docs[0].receiverId,
                        request_time: docs[0].request_time,
                        friend: [{
                            senderId: docs[0].senderId,
                            receiverId: docs[0].receiverId
                        }],
                        request_send: [],
                        request_accept_time: new Date().getTime(),
                        pending_request: [],
                        isAccept: 1
                    };
                    Request.update({
                        _id: docs[0]._id
                    }, {
                            $set: data
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
                                        message: "Request accept successfully."
                                    }
                                });
                            }
                        });
                } else {
                    res.status(404).json({
                        success: false,
                        data: {
                            message: "Request not found."
                        }
                    });
                }
            }
        });
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "From user Id and User Id are required."
            }
        });
    }
}

requestController.cancelRequest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.senderId && requestBody.receiverId) {
        var Request = db.get().collection('request');
        Request.find({
            senderId: ObjectId(requestBody.senderId),
            receiverId: ObjectId(requestBody.receiverId)
        }).toArray(function (err, docs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (docs.length != 0) {
                    Request.remove({
                        _id: docs[0]._id
                    }, function (err2, res2) {
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
                                    message: "Request canceled successfully."
                                }
                            });
                        }
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        data: {
                            message: "Request not found."
                        }
                    });
                }
            }
        });
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "From user Id and User Id are required."
            }
        });
    }
}

requestController.getAllRequest = (req, res) => {
    var Request = db.get().collection('request');
    Request.find().toArray(function (err, docs) {
        if (err) {
            res.status(500).json({
                success: false,
                data: err
            });
        } else {
            if (docs.length != 0) {
                res.status(200).json({
                    success: true,
                    data: {
                        message: "Request status.",
                        details: docs
                    }
                });
            } else {
                res.status(200).json({
                    success: true,
                    data: {
                        message: "Request not found.",
                        details: []
                    }
                });
            }
        }
    });
}

module.exports = requestController;