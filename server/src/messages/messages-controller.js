const express = require('express');
const {authorize, UserRoles} = require("../users/authorization");
const messagesModel = require('./messages-model');


const router = express.Router();

router.get('/', authorize(UserRoles.ADMIN, UserRoles.SUPPORT, UserRoles.NORMAL_USER, UserRoles.DOCTOR, UserRoles.NONE),
    async (req, res, next) => {
        const userData = res.locals.userData;
        try {
            const data = await messagesModel.getAll(![UserRoles.ADMIN, UserRoles.SUPPORT].includes(userData.userRole));
            res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

router.post('/', authorize(UserRoles.ADMIN, UserRoles.SUPPORT, UserRoles.NORMAL_USER, UserRoles.DOCTOR), async (req, res, next) => {
    const data = req.body;
    const userData = res.locals.userData;

    data.author = userData.userId;
    try {
        await messagesModel.insertMessage(data);
        res.status(200).json({description: "Message was sent"});
    } catch (err) {
        next(err);
    }
});

router.put('/:id', authorize(UserRoles.SUPPORT), async (req, res, next) => {
    const newMessageProps = req.body;
    try {
        const oldMessage = await messagesModel.updateMessage(req.params.id, newMessageProps);

        if (newMessageProps.response && !oldMessage.response) {
            // respond to the user that asked the question
            messagesModel.deliverMessageResponse(req.params.id);
        }

        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;