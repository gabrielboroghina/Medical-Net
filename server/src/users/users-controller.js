const express = require('express');
const UsersService = require('./users-model.js');
const {validateFields} = require('../utils/field-validator');
const RecordsController = require('../medical-records/records-controller');

const router = express.Router();
router.use('/:id/records', RecordsController);

router.post('/register', async (req, res, next) => {
    const {username, password, email, name} = req.body;

    // validare de campuri
    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'alpha'
            },
            password: {
                value: password,
                type: 'ascii'
            },
            email: {
                value: email,
                type: 'email'
            }
        };
        validateFields(fieldsToBeValidated);

        await UsersService.addUser(username, password, email, name);
        res.status(201).json({message: "User created. Awaiting email verification"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/verify', async (req, res, next) => {
    const verificationToken = req.query.token;
    const validated = await UsersService.verifyEmailToken(verificationToken);

    if (validated)
        res.redirect(302, `${process.env.WEB_HOST}/emailconfirmed`);
    else
        res.status(404).end();
});

router.post('/login', async (req, res, next) => {
    const {username, password} = req.body;

    try {
        const fieldsToBeValidated = {
            password: {
                value: password,
                type: 'ascii'
            }
        };
        validateFields(fieldsToBeValidated);

        const [userId, token] = await UsersService.authenticate(username, password);
        const userProfile = await UsersService.getUserProfile(userId);

        res.status(200).json({
            accessToken: token,
            userProfile: userProfile,
        });
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js
        next(err);
    }
});

module.exports = router;