var express = require('express'),
    router = express.Router()

var db = require('../db')

const myinterestController = {};
const ObjectId = require('mongodb').ObjectID;

myinterestController.createInterest = (req, res) => {
    const requestBody = req.body;
    if (requestBody.mainCategory && requestBody.subCategory &&
        requestBody.type && requestBody.hobby && requestBody.interest
        && requestBody.personType && requestBody.favourite && requestBody.userId) {
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
    if (requestBody._id) {
        var collection = db.get().collection('interest');
        collection.find({
            userId: requestBody._id
        }).toArray(function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (success.length > 0) {

                    collection.update({
                        _id: requestBody._id
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


module.exports = myinterestController;