var express = require('express');

// Controller imports
var customerController = require('./controllers/customer');
var imageController = require('./controllers/image');
var myinterestController = require('./controllers/myInterest');
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
routes.get('/getAllCustomers', customerController.getAllCustomers);

// user image upload
routes.post('/uploadImage', imageController.uploadImage);

//create my interest
routes.post('/createInterest', myinterestController.createInterest);

//get interest
routes.get('/getInterest/:userId', myinterestController.getInterest);

module.exports = routes;
