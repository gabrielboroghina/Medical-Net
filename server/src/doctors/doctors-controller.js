const express = require('express');
const {authorize, UserRoles} = require("../users/authorization");
const doctorsModel = require('./doctors-model');


const router = express.Router();

router.get('/', authorize(UserRoles.ADMIN, UserRoles.SUPPORT, UserRoles.NORMAL_USER), async (req, res, next) => {
    try {
        const data = await doctorsModel.getAll();
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', authorize(UserRoles.ADMIN), async (req, res, next) => {
    const id = req.params.id;
    try {
        await doctorsModel.deleteById(id);
        res.status(200).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;