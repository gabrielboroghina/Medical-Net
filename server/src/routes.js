const Router = require('express')();

const UsersController = require('./users/users-controller');
const MessagesController = require('./messages/messages-controller');
const DoctorsController = require('./doctors/doctors-controller');

Router.use('/users', UsersController);
Router.use('/messages', MessagesController);
Router.use('/doctors', DoctorsController);

module.exports = Router;