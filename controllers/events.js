var express = require('express'),
    router = express.Router()

var db = require('../db')
var multer = require('multer');
var uploadUserImage = multer({ dest: 'eventsImage/' });
var fs = require('fs');
var path = require('path');

const eventController = {};
const ObjectId = require('mongodb').ObjectID;


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './eventsImage')
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

//event image saved
eventController.eventImageSaved = (req, res) => {
    var collection = db.get().collection('eventImage');
    var image;

    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                return cb('not support', null)
            }
            cb(null, true)
        }
    }).single('file');

    upload(req, res, function (error) {
        userId = req.body.userId;

        if (error) {
            res.status(500).json({
                success: false,
                data: {
                    message: error
                }
            });
        }
        else if (req.file) {
            image = req.file;

            if (image) {
                const data = {
                    image: image.filename
                };

                collection.save(data, function (err, success) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            data: err
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            image: success.ops[0].image,
                            message: "Event Image saved successfully."
                        });
                    }
                });
            }
        }
    });
}

// create event
eventController.createEvent = (req, res) => {
    const requestBody = req.body;
    if (requestBody.image || requestBody.userId || requestBody.eventDate
        || requestBody.eventName || requestBody.time || requestBody.location
        || requestBody.price || requestBody.age || requestBody.about || requestBody.eventType) {
        var collection = db.get().collection('event');

        collection.save(requestBody, function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: "Event created successfully"
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

/** create event
eventController.createEvent = (req, res) => {
    var collection = db.get().collection('event');

    var image;
    var userId;
    var eventDate;
    var eventName;
    var time;
    var location;
    var price;
    var age;
    var about;
    var eventType;

    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                return cb('not support', null)
            }
            cb(null, true)
        }
    }).single('file');

    upload(req, res, function (error) {
        userId = req.body.userId;
        eventDate = req.body.eventDate;
        eventName = req.body.eventName;
        time = req.body.time;
        location = req.body.location;
        price = req.body.price;
        age = req.body.age;
        about = req.body.about;
        eventType = req.body.eventType;

        if (error) {
            res.status(500).json({
                success: false,
                data: {
                    message: error
                }
            });
        }
        else if (req.file) {

            image = req.file;

            if (image) {
                const dataOne = {
                    userId: ObjectId(userId),
                    eventDate: eventDate,
                    eventName: eventName,
                    time: time,
                    location: location,
                    price: price,
                    age: age,
                    about: about,
                    eventType: eventType,
                    image: image.filename
                };

                collection.save(dataOne, function (err, success) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            data: err
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: "Event created successfully"
                        });
                    }
                });
            }
        } else {
            const data = {
                userId: ObjectId(userId),
                eventDate: eventDate,
                eventName: eventName,
                time: time,
                location: location,
                price: price,
                age: age,
                about: about,
                eventType: eventType
            };

            collection.save(data, function (err, success) {
                if (err) {
                    res.status(500).json({
                        success: false,
                        data: err
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: "Event created successfully"
                    });
                }
            });
        }
    });
}

*/

//get all event
eventController.getAllEvents = (req, res) => {
    var collection = db.get().collection('event');
    collection.find().toArray(function (err, result) {
        if (err) {
            res.status(500).json({
                success: false,
                data: {
                    message: err
                }
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Events details",
                data: result
            });
        }
    })
}

module.exports = eventController;