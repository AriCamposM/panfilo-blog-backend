const users = require('express').Router();
const { createUser, logInUser, checkToken } = require('../controllers/users');


users.post('/signup', createUser);

users.post('/login', logInUser);

users.get('/check-token', checkToken);

module.exports = users;