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
        var friend = db.get().collection('friend');
        var viewerId;

        if (ObjectId(requestBody.senderId).toString() < ObjectId(requestBody.receiverId).toString) {
            console.log(1);
            viewerId = ObjectId(requestBody.receiverId).toString() + ObjectId(requestBody.senderId).toString();
        } else {
            console.log(2);
            viewerId = ObjectId(requestBody.senderId).toString() + ObjectId(requestBody.receiverId).toString();
        }

        console.log(viewerId);
        // var viewerId = (requestBody.senderId).toString() + (requestBody.receiverId).toString();

        // friend.find({
        //     viewerId: viewerId
        // }).toArray(function (err, docs) {
        //     if (err) {
        //         res.status(500).json({
        //             success: false,
        //             data: err
        //         });
        //     } else {
        //         console.log("docs :", docs);
        //         if (docs.length == 0) {
        //             const value = {
        //                 senderId: ObjectId(requestBody.senderId),
        //                 receiverId: ObjectId(requestBody.receiverId),
        //                 viewerId: viewerId,
        //                 requestTime: new Date().getTime(),
        //                 isAccept: 0
        //             };
        //             friend.save(value, function (err, success) {
        //                 if (err) {
        //                     res.status(500).json({
        //                         success: false,
        //                         data: err
        //                     });
        //                 } else {
        //                     res.status(200).json({
        //                         success: true,
        //                         data: {
        //                             message: "Request send.",
        //                             details: success.ops[0]
        //                         }
        //                     });
        //                 }
        //             });
        //         } else {
        //             res.status(200).json({
        //                 success: true,
        //                 message: "Already request sent."
        //             });
        //         }
        //     }
        // });
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
    if (requestBody.fromUser && requestBody.user_id && requestBody._id) {
        var Request = db.get().collection('request');
        Request.find({
            fromUser: ObjectId(requestBody.fromUser),
            toUser: ObjectId(requestBody.user_id)
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
                        fromUser: docs[0].fromUser,
                        toUser: docs[0].toUser,
                        requestSend_fromUser: false,
                        requestAccept: true,
                        isRequestCancel: false
                    };
                    Request.update({
                        _id: ObjectId(requestBody._id)
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
    if (requestBody.fromUser && requestBody.user_id && requestBody._id) {
        var Request = db.get().collection('request');
        Request.find({
            fromUser: ObjectId(requestBody.fromUser),
            toUser: ObjectId(requestBody.user_id)
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
                        fromUser: docs[0].fromUser,
                        toUser: docs[0].toUser,
                        requestSend_fromUser: false,
                        requestAccept: false,
                        isRequestCancel: true
                    };
                    Request.update({
                        _id: ObjectId(requestBody._id)
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
                                        message: "Request cancel successfully."
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

requestController.requestStatusOfFromUser = (req, res) => {
    const requestBody = req.body;
    if (requestBody.id) {
        var friend = db.get().collection('friend');

        const data = {
            '$or': [
                {
                    receiverId: ObjectId(requestBody.id)
                }, {
                    senderId: ObjectId(requestBody.id)
                },
            ]
        };
        friend.find(data).toArray(function (err, docs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                console.log(docs);
                if (docs.length != 0) {
                    res.status(200).json({
                        success: true,
                        data: {
                            message: "Request status.",
                            details: docs
                        }
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        data: {
                            message: "Request status not found."
                        }
                    });
                }
            }
        });
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "From user Id is required."
            }
        });
    }
}

module.exports = requestController;