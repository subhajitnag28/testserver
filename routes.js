var express = require('express');

// Controller imports
var customerController = require('./controllers/customer');
var imageController = require('./controllers/image');
var myinterestController = require('./controllers/myInterest');
var eventController = require('./controllers/events');
var skillShareController = require('./controllers/skillShare');
var requestController = require('./controllers/request');
var messageController = require('./controllers/chatMessage');
const routes = express();

/**routes for customers*/

//register
routes.post('/customerSignup', customerController.customerSignup);

//login
routes.post('/customerLogin', customerController.customerLogin);

//update customer
routes.post('/updateCustomer', customerController.updateCustomer);

//getCustomerById
routes.get('/getCustomerById/:id', customerController.getCustomerById);

//get all customer
routes.post('/getAllCustomers', customerController.getAllCustomers);

// user image upload
routes.post('/uploadImage', imageController.uploadImage);

//create my interest
routes.post('/createInterest', myinterestController.createInterest);

//get interest
routes.get('/getInterest/:userId', myinterestController.getInterest);

//update interest
routes.post('/updateInterest', myinterestController.updateInterest);

//search user on main category
routes.post('/searchUserOnMainCategory', myinterestController.searchUserOnMainCategory);

//create event
routes.post('/createEvent', eventController.createEvent);

routes.post('/eventImageSaved', eventController.eventImageSaved);

//get all events
routes.get('/getAllEvents', eventController.getAllEvents);

//create skill share
routes.post('/createSkillShare', skillShareController.createSkillShare);

routes.post('/skillShareImageSaved', skillShareController.skillShareImageSaved);

//get all skill share
routes.get('/getAllSkillShare', skillShareController.getAllSkillShare);

//send request
routes.post('/sendRequest', requestController.sendRequest);

//accept request
routes.post('/acceptRequest', requestController.acceptRequest);

//cancel request
routes.post('/cancelRequest', requestController.cancelRequest);

//request status of from user
routes.get('/getRequest/:id', requestController.getRequest);

//request status of to user
// routes.post('/requestStatusOfToUser', requestController.requestStatusOfToUser);

//get chat messages
routes.post('/getMessages', messageController.getMessages);

module.exports = routes;