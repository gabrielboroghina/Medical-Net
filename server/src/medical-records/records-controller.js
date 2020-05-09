const express = require('express');
const {authorize, UserRoles} = require("../users/authorization");
const {JsonError} = require('../utils/errors');
const recordsModel = require('./records-model');


const router = express.Router({mergeParams: true});

router.get('/', authorize(UserRoles.ADMIN, UserRoles.SUPPORT, UserRoles.NORMAL_USER), async (req, res, next) => {
    const userData = res.locals.userData;
    const reqUserId = parseInt(req.params.id);

    if (userData.userId !== reqUserId) {
        next(new JsonError(1, {description: 'Not authorized to access this resource'}, 403));
        return;
    }

    try {
        const data = await recordsModel.getUserRecords(req.params.id);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;