const {executeQuery} = require('../database');
const {generateToken} = require('./authorization');
const {ServerError, JsonError} = require('../utils/errors');
const crypto = require('crypto');
const {Mailer} = require('./mailer');
const randtoken = require('rand-token');
const {UserRoles, hashPassword, validatePassword} = require('./authorization');


const mailer = new Mailer();
mailer.init();

const addRole = async (value) => {
    try {
        await executeQuery('INSERT INTO roles (value) VALUES ($1)', [value]);
    } catch (err) {
        throw new ServerError(err.detail, 500);
    }
};

const getRoles = async () => {
    return await executeQuery('SELECT * FROM roles order by id');
};

const addUser = async (username, password, email, name) => {
    const roleId = UserRoles.NORMAL_USER;

    const encryptedPassword = await hashPassword(password);

    // build the email verification link
    const emailAddressHash = crypto.createHash('md5').update(email).digest('hex');
    const salt = randtoken.generate(16);
    const verificationToken = `${emailAddressHash}-${salt}`;

    // add the user in the DB together with the email verification token
    const query = `
        INSERT INTO users (username, password, email, name, role_id, email_verification_token)
        VALUES ($1, $2, $3, $4, $5, $6)
    `;
    try {
        await executeQuery(query, [username, encryptedPassword, email, name, roleId, verificationToken]);
    } catch (err) {
        console.log(err);
        if (err.code === '23505') { // unique violation
            const duplicatedField = err.detail.match(/\((.*)\)=/)[1];
            throw new JsonError(0, {description: `${duplicatedField} already exists`, field: duplicatedField}, 400);
        } else {
            throw new ServerError(err.detail, 500);
        }
    }

    sendValidationEmail(email, verificationToken);
};

const authenticate = async (username, password) => {
    const query = `
        SELECT u.id, u.password, u.role_id
        FROM users u
        WHERE u.username = $1
    `;
    const result = await executeQuery(query, [username]);
    if (result.length === 0) {
        throw new JsonError(1, {description: `Username does not exist`}, 400);
    }
    const user = result[0];

    // validate the password
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid)
        throw new JsonError(1, {description: "Invalid password"}, 403);

    // pas 2: genereaza token cu payload-ul: {userId si userRole}
    const token = await generateToken({
        userId: user.id,
        userRole: user.role_id,
    });
    return [user.id, token];
};

const sendValidationEmail = async (email, verificationToken) => {
    const verificationLink = `${process.env.HOST}:${process.env.PORT}/api/v1/users/verify?token=${verificationToken}`;

    const mailSubject = "Welcome to Medical.Net! Confirm your email";
    const mailBody = 'By clicking on the following link, you are confirming your email address.' +
        `<br/><a class="button" href="${verificationLink}" style="
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          margin: 30px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;">Confirm Email</a>`;

    await mailer.sendMail(email, mailSubject, mailBody);
};

/**
 * @return true if the mail was validated or false otherwise
 * */
const verifyEmailToken = async (verificationToken) => {
    let query = `
        SELECT id
        FROM users
        WHERE email_verification_token = $1
    `;
    const result = await executeQuery(query, [verificationToken]);
    if (result.length === 0) // no user pending email validation with this token exists
        return false;

    const user = result[0];

    // set the email verification token to NULL to mark that the user already validated his email
    query = `
        update users
        set email_verification_token = null
        where id = $1
    `;
    executeQuery(query, [user.id]);

    return true;
};

const getUserProfile = async (userId) => {
    const query = `
        select username, name, email
        from users
        where id = $1
    `;
    const data = await executeQuery(query, [userId]);
    return data[0];
};

module.exports = {
    addUser,
    addRole,
    getRoles,
    authenticate,
    verifyEmailToken,
    getUserProfile,
};