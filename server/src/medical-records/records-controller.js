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

router.put('/grants', authorize(UserRoles.NORMAL_USER), async (req, res, next) => {
    const userData = res.locals.userData;
    const reqUserId = parseInt(req.params.id);
    const {type, doctorId} = req.body;

    if (userData.userId !== reqUserId) {
        next(new JsonError(1, {description: 'Not authorized to access this resource'}, 403));
        return;
    }

    try {
        let data;
        if (type === "grant")
            data = await recordsModel.grantAccess(req.params.id, doctorId);
        else if (type === "revoke")
            data = await recordsModel.revokeAccess(req.params.id, doctorId);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
});

router.get('/grants', authorize(UserRoles.NORMAL_USER), async (req, res, next) => {
    const userData = res.locals.userData;
    const reqUserId = parseInt(req.params.id);

    if (userData.userId !== reqUserId) {
        next(new JsonError(1, {description: 'Not authorized to access this resource'}, 403));
        return;
    }

    try {
        const data = await recordsModel.getAccessGrants(reqUserId);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = router;