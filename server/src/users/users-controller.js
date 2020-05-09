const express = require('express');
const usersService = require('./users-model.js');
const {validateFields} = require('../utils/field-validator');
const RecordsController = require('../medical-records/records-controller');
const {authorize, UserRoles} = require("../users/authorization");
const {JsonError} = require('../utils/errors');

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

        await usersService.addUser(username, password, email, name);
        res.status(201).json({message: "User created. Awaiting email verification"});
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.get('/verify', async (req, res, next) => {
    const verificationToken = req.query.token;
    const validated = await usersService.verifyEmailToken(verificationToken);

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

        const [userId, token] = await usersService.authenticate(username, password);
        const userProfile = await usersService.getUserProfile(userId);

        res.status(200).json({
            accessToken: token,
            userProfile: userProfile,
        });
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js
        next(err);
    }
});

router.get('/:id/grants', authorize(UserRoles.DOCTOR), async (req, res, next) => {
    const userData = res.locals.userData;
    const reqUserId = parseInt(req.params.id);

    if (userData.userId !== reqUserId) {
        next(new JsonError(1, {description: 'Not authorized to access this resource'}, 403));
        return;
    }

    try {
        const result = await usersService.getDoctorGrants(reqUserId);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

module.exports = router;