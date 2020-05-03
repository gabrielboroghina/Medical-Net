const Router = require('express')();

const UsersController = require('./users/users-controller');
const MessagesController = require('./messages/messages-controller');

Router.use('/users', UsersController);
Router.use('/messages', MessagesController);

module.exports = Router;