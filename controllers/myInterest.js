var express = require('express'),
    router = express.Router()

var db = require('../db')

const myinterestController = {};
const ObjectId = require('mongodb').ObjectID;

myinterestController.createInterest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.mainCategory && requestBody.subCategory &&
        requestBody.type && requestBody.hobby && requestBody.interest &&
        requestBody.personType && requestBody.favourite && requestBody.userId) {
        var collection = db.get().collection('interest');

        collection.save(requestBody, function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Interest created successfully"
                });
            }
        });
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "All fields are required."
            }
        })
    }

}

myinterestController.getInterest = (req, res) => {
    const requestBody = req.param('userId');
    if (requestBody) {
        var collection = db.get().collection('interest');
        collection.find({
            userId: requestBody
        }).toArray(function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (success.length > 0) {
                    const data = success[0];
                    res.status(200).json({
                        success: true,
                        data: {
                            interestDetails: data
                        }
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        data: {
                            message: "No interest found."
                        }
                    })
                }
            }
        })
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "User Id is required."
            }
        })
    }
}

myinterestController.updateInterest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.userId) {
        var collection = db.get().collection('interest');
        collection.find({
            userId: requestBody.userId
        }).toArray(function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (success.length > 0) {
                    collection.update({
                        userId: requestBody.userId
                    }, {
                            $set: requestBody
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
                                        message: "Interest updated successfully."
                                    }
                                })
                            }
                        });
                } else {
                    res.status(404).json({
                        success: false,
                        data: {
                            message: "User not found."
                        }
                    })
                }
            }
        })
    } else {
        res.status(403).json({
            success: false,
            data: "user id is required."
        });
    }
}

myinterestController.searchUserOnMainCategory = (req, res) => {
    const requestBody = req.body;
    if (requestBody.categoryName && requestBody.userId) {
        const categoryName = requestBody.categoryName;
        const userId = requestBody.userId;
        var collection = db.get().collection('interest');
        var customer = db.get().collection('customer');
        let query = {};
        let userList = [];
        let userIds = [];
        if (categoryName) {
            const x = [categoryName],
                regex = x.map(function (e) {
                    return new RegExp(e, "i");
                });
            query["mainCategory"] = {
                $in: regex
            }

            collection.find(query, {})
                .toArray(function (err, success) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            data: {
                                message: err
                            }
                        });
                    } else {
                        if (success.length != 0) {
                            for (let i in success) {
                                if (success[i].userId != userId) {
                                    userIds.push(success[i].userId);
                                    customer.find({
                                        _id: ObjectId(success[i].userId)
                                    }).toArray(function (err1, details) {
                                        if (err1) {
                                            res.status(500).json({
                                                success: false,
                                                data: {
                                                    message: err1
                                                }
                                            });
                                        } else {
                                            if (details.length != 0) {
                                                userList.push(details[0]);
                                                if (userIds.length == userList.length) {
                                                    res.status(200).json({
                                                        success: true,
                                                        data: {
                                                            message: "User details on category",
                                                            users: userList
                                                        }
                                                    });
                                                }
                                            } else {
                                                res.status(404).json({
                                                    success: false,
                                                    data: {
                                                        message: "Users not found"
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        } else {
                            res.status(404).json({
                                success: false,
                                data: {
                                    message: "Category does not match"
                                }
                            });
                        }
                    }
                });
        }
    } else {
        res.status(403).json({
            success: false,
            data: "Category name is required"
        });
    }
}


module.exports = myinterestController;