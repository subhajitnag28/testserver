var express = require('express');

// Controller imports
var customerController = require('./controllers/customer');
var imageController = require('./controllers/image');
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

module.exports = routes;
