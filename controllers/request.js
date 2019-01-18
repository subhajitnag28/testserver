var express = require('express'),
    router = express.Router();
var db = require('../db');
const requestController = {};
const ObjectId = require('mongodb').ObjectID;

requestController.sendRequest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.senderId &&
        requestBody.receiverId) {
        var Request = db.get().collection('request');

        Request.find({
            userId: ObjectId(requestBody.senderId)
        }).toArray(function (err, docs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (docs.length != 0) {
                    let request_send = docs[0].request_send;
                    if (request_send.includes(requestBody.receiverId)) {
                        res.status(200).json({
                            success: false,
                            data: {
                                message: "Already request send."
                            }
                        });
                    } else {
                        request_send.push(requestBody.receiverId);
                        const data = {
                            _id: docs[0]._id,
                            userId: docs[0].userId,
                            friend: docs[0].friend,
                            request_send: request_send,
                            pending_request: docs[0].pending_request
                        };
                        Request.update({
                            _id: docs[0]._id
                        }, {
                                $set: data
                            }, {
                                upsert: true
                            },
                            function (err1, res1) {
                                if (err1) {
                                    res.status(500).json({
                                        success: false,
                                        data: {
                                            message: err1
                                        }
                                    });
                                } else {
                                    Request.find({
                                        userId: ObjectId(requestBody.receiverId)
                                    }).toArray(function (err2, docs1) {
                                        if (err2) {
                                            res.status(500).json({
                                                success: false,
                                                data: err2
                                            });
                                        } else {
                                            if (docs1.length != 0) {
                                                let pending_request = docs1[0].pending_request;
                                                if (pending_request.includes(requestBody.senderId)) {
                                                    res.status(200).json({
                                                        success: false,
                                                        data: {
                                                            message: "Already request send."
                                                        }
                                                    });
                                                } else {
                                                    pending_request.push(requestBody.senderId);
                                                    const data1 = {
                                                        _id: docs1[0]._id,
                                                        userId: docs1[0].userId,
                                                        friend: docs1[0].friend,
                                                        request_send: docs1[0].request_send,
                                                        pending_request: pending_request
                                                    };
                                                    Request.update({
                                                        _id: docs1[0]._id
                                                    }, {
                                                            $set: data1
                                                        }, {
                                                            upsert: true
                                                        },
                                                        function (err3, res2) {
                                                            if (err3) {
                                                                res.status(500).json({
                                                                    success: false,
                                                                    data: {
                                                                        message: err3
                                                                    }
                                                                });
                                                            } else {
                                                                res.status(200).json({
                                                                    success: false,
                                                                    data: {
                                                                        message: "Request send."
                                                                    }
                                                                });
                                                            }
                                                        });
                                                }
                                            } else {
                                                const senderData1 = {
                                                    userId: ObjectId(requestBody.receiverId),
                                                    friend: [],
                                                    request_send: [],
                                                    pending_request: [requestBody.senderId]
                                                };
                                                Request.save(senderData1, function (err11, success4) {
                                                    if (err11) {
                                                        res.status(500).json({
                                                            success: false,
                                                            data: err11
                                                        });
                                                    } else {
                                                        res.status(200).json({
                                                            success: false,
                                                            data: {
                                                                message: "Request send."
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                    }
                } else {
                    const senderData = {
                        userId: ObjectId(requestBody.senderId),
                        friend: [],
                        request_send: [requestBody.receiverId],
                        pending_request: []
                    };
                    Request.save(senderData, function (err5, success1) {
                        if (err5) {
                            res.status(500).json({
                                success: false,
                                data: err5
                            });
                        } else {
                            Request.find({
                                userId: ObjectId(requestBody.receiverId)
                            }).toArray(function (err6, docs2) {
                                if (err6) {
                                    res.status(500).json({
                                        success: false,
                                        data: err6
                                    });
                                } else {
                                    if (docs2.length != 0) {
                                        let pending_request = docs2[0].pending_request;
                                        if (pending_request.includes(requestBody.senderId)) {
                                            res.status(200).json({
                                                success: false,
                                                data: {
                                                    message: "Already request send."
                                                }
                                            });
                                        } else {
                                            pending_request.push(requestBody.senderId);
                                            const data3 = {
                                                _id: docs2[0]._id,
                                                userId: docs2[0].userId,
                                                friend: docs2[0].friend,
                                                request_send: docs2[0].request_send,
                                                pending_request: pending_request
                                            };
                                            Request.update({
                                                _id: docs2[0]._id
                                            }, {
                                                    $set: data3
                                                }, {
                                                    upsert: true
                                                },
                                                function (err10, res4) {
                                                    if (err10) {
                                                        res.status(500).json({
                                                            success: false,
                                                            data: {
                                                                message: err10
                                                            }
                                                        })
                                                    } else {
                                                        res.status(200).json({
                                                            success: false,
                                                            data: {
                                                                message: "Request send."
                                                            }
                                                        });
                                                    }
                                                });
                                        }
                                    } else {
                                        const receiverData = {
                                            userId: ObjectId(requestBody.receiverId),
                                            friend: [],
                                            request_send: [],
                                            pending_request: [requestBody.senderId]
                                        };
                                        Request.save(receiverData, function (err7, success3) {
                                            if (err7) {
                                                res.status(500).json({
                                                    success: false,
                                                    data: err7
                                                });
                                            } else {
                                                res.status(200).json({
                                                    success: false,
                                                    data: {
                                                        message: "Request send."
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "senderId, receiverId are required."
            }
        });
    }
}

requestController.acceptRequest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.senderId && requestBody.receiverId) {
        var Request = db.get().collection('request');
        Request.find({
            userId: ObjectId(requestBody.senderId)
        }).toArray(function (err, docs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (docs.length != 0) {
                    let request_send = docs[0].request_send;
                    if (request_send.includes(requestBody.receiverId)) {
                        request_send.splice(request_send.indexOf(requestBody.receiverId), 1);
                        const data = {
                            _id: docs[0]._id,
                            userId: docs[0].userId,
                            friend: docs[0].friend.length != 0 ? docs[0].friend.concat(requestBody.receiverId) : [requestBody.receiverId],
                            request_send: request_send,
                            pending_request: []
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
                                    Request.find({
                                        userId: ObjectId(requestBody.receiverId)
                                    }).toArray(function (err3, docs1) {
                                        if (err3) {
                                            res.status(500).json({
                                                success: false,
                                                data: err3
                                            });
                                        } else {
                                            if (docs1.length != 0) {
                                                let pending_request = docs1[0].pending_request;
                                                if (pending_request.includes(requestBody.senderId)) {
                                                    pending_request.splice(pending_request.indexOf(requestBody.senderId), 1);
                                                    const data1 = {
                                                        _id: docs1[0]._id,
                                                        userId: docs1[0].userId,
                                                        friend: docs1[0].friend.length != 0 ? docs1[0].friend.concat(requestBody.senderId) : [requestBody.senderId],
                                                        request_send: docs1[0].request_send,
                                                        pending_request: pending_request
                                                    };
                                                    Request.update({
                                                        _id: docs1[0]._id
                                                    }, {
                                                            $set: data1
                                                        }, {
                                                            upsert: true
                                                        },
                                                        function (err4, res4) {
                                                            if (err2) {
                                                                res.status(500).json({
                                                                    success: false,
                                                                    data: {
                                                                        message: err4
                                                                    }
                                                                })
                                                            } else {
                                                                res.status(200).json({
                                                                    success: false,
                                                                    data: {
                                                                        message: "Request accept successfully."
                                                                    }
                                                                });
                                                            }
                                                        });
                                                } else {
                                                    res.status(200).json({
                                                        success: false,
                                                        data: {
                                                            message: "Request not found.",
                                                            data: []
                                                        }
                                                    });
                                                }
                                            } else {
                                                res.status(200).json({
                                                    success: false,
                                                    data: {
                                                        message: "Request not found.",
                                                        data: []
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                    } else {
                        res.status(200).json({
                            success: false,
                            data: {
                                message: "Request not found.",
                                data: []
                            }
                        });
                    }
                } else {
                    res.status(200).json({
                        success: false,
                        data: {
                            message: "Request not found.",
                            data: []
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
            userId: ObjectId(requestBody.senderId)
        }).toArray(function (err, docs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (docs.length != 0) {
                    let request_send = docs[0].request_send;
                    if (request_send.includes(requestBody.receiverId)) {
                        request_send.splice(request_send.indexOf(requestBody.receiverId), 1);
                        const data = {
                            _id: docs[0]._id,
                            userId: docs[0].userId,
                            friend: docs[0].friend,
                            request_send: request_send,
                            pending_request: docs[0].pending_request
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
                                    Request.find({
                                        userId: ObjectId(requestBody.receiverId)
                                    }).toArray(function (err3, docs1) {
                                        if (err3) {
                                            res.status(500).json({
                                                success: false,
                                                data: err3
                                            });
                                        } else {
                                            if (docs1.length != 0) {
                                                let pending_request = docs1[0].pending_request;
                                                if (pending_request.includes(requestBody.senderId)) {
                                                    pending_request.splice(pending_request.indexOf(requestBody.senderId), 1);
                                                    const data1 = {
                                                        _id: docs1[0]._id,
                                                        userId: docs1[0].userId,
                                                        friend: docs1[0].friend,
                                                        request_send: docs1[0].request_send,
                                                        pending_request: pending_request
                                                    };
                                                    Request.update({
                                                        _id: docs1[0]._id
                                                    }, {
                                                            $set: data1
                                                        }, {
                                                            upsert: true
                                                        },
                                                        function (err4, res4) {
                                                            if (err2) {
                                                                res.status(500).json({
                                                                    success: false,
                                                                    data: {
                                                                        message: err4
                                                                    }
                                                                })
                                                            } else {
                                                                res.status(200).json({
                                                                    success: false,
                                                                    data: {
                                                                        message: "Request cancel successfully."
                                                                    }
                                                                });
                                                            }
                                                        });
                                                } else {
                                                    res.status(200).json({
                                                        success: false,
                                                        data: {
                                                            message: "Request not found.",
                                                            data: []
                                                        }
                                                    });
                                                }
                                            } else {
                                                res.status(200).json({
                                                    success: false,
                                                    data: {
                                                        message: "Request not found.",
                                                        data: []
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            });
                    } else {
                        res.status(200).json({
                            success: false,
                            data: {
                                message: "Request not found.",
                                data: []
                            }
                        });
                    }
                } else {
                    res.status(200).json({
                        success: false,
                        data: {
                            message: "Request not found.",
                            data: []
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

requestController.getRequest = (req, res) => {
    const userId = req.param('id');
    if (userId) {
        var Request = db.get().collection('request');
        var customer = db.get().collection('customer');
        var user_data = [];
        Request.find({
            userId: ObjectId(userId)
        }).toArray(function (err, docs) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (docs.length != 0) {
                    var pendind_Ids = docs[0].pending_request;
                    if (pendind_Ids.length != 0) {
                        for (var i = 0; i <= docs[0].pending_request.length; i++) {
                            customer.findOne({ _id: ObjectId(docs[0].pending_request[i]) }, function (err1, item) {
                                if (err1) {
                                    res.status(500).json({
                                        success: false,
                                        data: err1
                                    });
                                } else {
                                    user_data.push(item);
                                    if (pendind_Ids.length === user_data.length) {
                                        const request_data = {
                                            _id: docs[0]._id,
                                            userId: docs[0].userId,
                                            friend: docs[0].friend,
                                            request_send: docs[0].request_send,
                                            pending_request: user_data
                                        };
                                        res.status(200).json({
                                            success: true,
                                            data: {
                                                message: "User request response.",
                                                details: request_data
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    } else {
                        res.status(200).json({
                            success: true,
                            data: {
                                message: "User request response.",
                                details: docs
                            }
                        });
                    }
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
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "UserId is required."
            }
        });
    }
}

module.exports = requestController;