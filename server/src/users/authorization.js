const jwt = require('jsonwebtoken');
const {JsonError} = require('../utils/errors');
const {validateFields} = require('../utils/field-validator');
const bcryptjs = require('bcryptjs');


// va trebui sa folositi hash atunci cand stocati parola in baza de date, la register
const hashPassword = async (plainTextPassword) => {
    const salt = await bcryptjs.genSalt(5);
    return bcryptjs.hash(plainTextPassword, salt);
};

// va trebui sa folositi compare atunci cand primiti cerere de autentificare
const validatePassword = async (plainTextPassword, hashedPassword) => {
    return bcryptjs.compare(plainTextPassword, hashedPassword);
};

const options = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
    audience: process.env.JWT_AUDIENCE
};

const UserRoles = Object.freeze({
    NONE: null,
    ADMIN: 0,
    SUPPORT: 1,
    NORMAL_USER: 2,
});

const generateToken = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
    return token;
};

const authorize = (...roles) => {
    return async (req, res, next) => {
        // check the Authorization header
        if (!req.headers.authorization) {
            if (roles.includes(UserRoles.NONE)) {
                res.locals.userData = {userRole: UserRoles.NONE};
                return next();
            }
            return next(new JsonError(1, {description: 'Authorization header missing'}, 403));
        }

        const token = req.headers.authorization.split(" ")[1];

        validateFields({
            jwt: {
                value: token,
                type: 'jwt'
            }
        });

        // decode the JWT token
        let tokenPayload;
        try {
            tokenPayload = await jwt.verify(token, process.env.JWT_SECRET_KEY, options);
        } catch (err) {
            return next(new JsonError(1, {description: 'Invalid authorization token'}, 403));
        }

        // authorize the user
        if (roles.includes(tokenPayload.userRole)) {
            res.locals.userData = tokenPayload;
            return next();
        }

        return next(new JsonError(1, {description: 'Not authorized to access this resource'}, 403));
    }
};

module.exports = {
    UserRoles,
    generateToken,
    authorize,
    hashPassword,
    validatePassword,
};

// hashPassword('administrator').then(console.log);