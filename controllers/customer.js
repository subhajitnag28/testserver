var express = require('express'),
    router = express.Router()

var db = require('../db')
var crypto = require('crypto');

const customerController = {};
const ObjectId = require('mongodb').ObjectID;

function getRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
}

function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

function saltHashPassword(userpassword) {
    var salt = getRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    const returnData = {
        salt: salt,
        passwordHash: passwordData.passwordHash
    };
    return returnData;
}

function getPasswordFromHash(saltKey, userpassword) {
    var passwordData = sha512(userpassword, saltKey);
    const returnData = {
        passwordHash: passwordData.passwordHash
    };
    return returnData;
}

customerController.customerSignup = (req, res) => {
    const requestBody = req.body;
    if (requestBody.username && requestBody.email && requestBody.phone && requestBody.password) {
        var collection = db.get().collection('customer');
        collection.find({
            email: requestBody.email
        }).toArray(function (err, docs) {
            if (docs.length > 0) {
                res.status(403).json({
                    success: false,
                    data: {
                        message: "Email already exists."
                    }
                })
            } else {
                const saltedPassword = saltHashPassword(requestBody.password);
                requestBody.saltKey = saltedPassword.salt;
                requestBody.salt = saltedPassword.passwordHash;
                delete requestBody.password;
                collection.save(requestBody, function (err, success) {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            data: err
                        });
                    } else {
                        collection.find({
                            email: requestBody.email
                        }).toArray(function (err1, success1) {
                            if (err1) {
                                res.status(500).json({
                                    success: false,
                                    data: {
                                        message: err1
                                    }
                                });
                            } else {
                                res.status(200).json({
                                    success: true,
                                    data: {
                                        message: "Successfully registered.",
                                        details: success1
                                    }
                                });
                            }
                        })

                    }
                })
            }
        })
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "Username, Email, Phone, and Password are required."
            }
        });
    }
}

customerController.customerLogin = (req, res) => {
    const requestBody = req.body;
    if (requestBody.email && requestBody.password) {
        var collection = db.get().collection('customer');
        collection.find({
            email: requestBody.email
        }).toArray(function (err, docs) {
            if (docs.length > 0) {
                const userData = docs[0];
                const decryptedPassword = getPasswordFromHash(userData.saltKey, requestBody.password);
                if (decryptedPassword.passwordHash && decryptedPassword.passwordHash == userData.salt) {
                    res.status(200).json({
                        success: true,
                        data: {
                            userDetails: userData
                        }
                    });
                } else {
                    res.status(200).json({
                        success: false,
                        data: {
                            messgae: "Email and password does not match"
                        }
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    data: {
                        message: "User not found."
                    }
                })
            }

        })
    } else {
        res.status(403).json({
            success: false,
            data: {
                message: "Email and password are required."
            }
        })
    }
}

customerController.getAllCustomers = (req, res) => {
    var collection = db.get().collection('customer');
    collection.find().toArray(function (err, docs) {
        res.status(200).json({
            success: true,
            data: docs
        });
    })
}

customerController.getCustomerById = (req, res) => {
    const requestBody = req.param('id');
    if (requestBody) {
        var collection = db.get().collection('customer');
        collection.find({
            _id: ObjectId(requestBody)
        }).toArray(function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (success.length > 0) {
                    const toSendData = success[0];
                    res.status(200).json({
                        success: true,
                        data: {
                            userDetails: toSendData
                        }
                    })
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
            data: {
                message: "User Id is required."
            }
        })
    }
}



customerController.updateCustomer = (req, res) => {
    const requestBody = req.body;
    if (requestBody._id) {
        var collection = db.get().collection('customer');
        collection.find({
            _id: ObjectId(requestBody._id)
        }).toArray(function (err, success) {
            if (err) {
                res.status(500).json({
                    success: false,
                    data: err
                });
            } else {
                if (success.length > 0) {

                    collection.find({
                        email: requestBody.email
                    }).toArray(function (err, docs) {
                        if (docs.length > 0 && docs[0]._id != requestBody._id) {
                            res.status(403).json({
                                success: false,
                                data: {
                                    message: "Email already exists."
                                }
                            })
                        } else {
                            const user_id = requestBody._id;
                            delete requestBody._id;
                            collection.update({
                                _id: ObjectId(user_id)
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
                                                message: "Customer updated successfully."
                                            }
                                        })
                                    }
                                })
                        }
                    })
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
            data: "Id is required."
        });
    }
}

module.exports = customerController;
