const {executeQuery} = require('../database');
const {generateToken} = require('./authorization');
const {ServerError, JsonError} = require('../utils/errors');
const crypto = require('crypto');
const {Mailer} = require('../utils/mailer');
const randtoken = require('rand-token');
const {UserRoles, hashPassword, validatePassword} = require('./authorization');

const mailer = new Mailer();

const addUser = async (username, password, email, name) => {
    const roleId = UserRoles.NORMAL_USER;
    const encryptedPassword = await hashPassword(password);

    // build the email verification link
    const emailAddressHash = crypto.createHash('md5').update(email).digest('hex');
    const salt = randtoken.generate(16);
    const verificationToken = `${email}-${emailAddressHash}-${salt}`;

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

    await sendAdminApprovalEmail(email, username, name, verificationToken);
};

const sendPasswordResetMail = async (username) => {
    const query = `
        SELECT u.email
        FROM users u
        WHERE u.username = $1
           or u.email = $1
    `;
    const result = await executeQuery(query, [username]);
    const user = result[0];
    const email = user.email;

    const emailAddressHash = crypto.createHash('md5').update(email).digest('hex');
    const salt = randtoken.generate(16);
    const verificationToken = `${email}-${emailAddressHash}-${salt}`;

    const verificationLink = `${process.env.WEB_HOST}/resetpass?token=${verificationToken}`;

    const mailSubject = "Reset password";
    const mailBody =
        'Click the following link to reset your password: <br/><br/>' +
        `<a href="${verificationLink}">${verificationLink}</a>`;

    await mailer.sendMail(email, mailSubject, mailBody);
};

const resetPassword = async (token, password) => {
    const email = token.split("-")[0];
    console.log("resetting", password, email);
    const encryptedPassword = await hashPassword(password);

    const query = `
        UPDATE users
        SET password = $2
        WHERE email = $1
    `;
    await executeQuery(query, [email, encryptedPassword]);
};

const authenticate = async (username, password) => {
    const query = `
        SELECT u.id, u.password, u.role_id
        FROM users u
        WHERE u.username = $1
           or u.email = $1
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

const sendAdminApprovalEmail = async (email, username, name, verificationToken) => {
    const verificationLink = `${process.env.HOST}:${process.env.PORT}/api/v1/users/approve?token=${verificationToken}`;

    const mailSubject = "Registration request";
    const mailBody =
        'There is a new registration request to be admin approved for the following user: <br/><br/>' +
        `<b>Name:</b> ${name} <br/>` +
        `<b>Username:</b> ${username} <br/>` +
        `<b>Email:</b> ${email} <br/><br/>` +
        'After you validate the data, click the link to perform the activation of the account' +
        `<br/><a class="button" href="${verificationLink}" style="
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          margin: 30px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          ">Approve registration request</a>`;

    await mailer.sendMail(process.env.EMAIL_SENDER, mailSubject, mailBody);
};

const sendAccountValidationEmail = async (email) => {
    const mailSubject = "Account activated";
    const mailBody =
        'Welcome to the Medical.Net platform! <br/><br/>' +
        'Your account was approved and activated by the administrator. You can login into the platform now. <br/>' +
        `<br/><a class="button" href="${process.env.WEB_HOST}/login" style="
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 15px 32px;
          margin: 30px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          ">Go to login</a>`;

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
        select id, username, name, email, role_id
        from users
        where id = $1
    `;
    const data = await executeQuery(query, [userId]);
    return data[0];
};

const getDoctorGrants = async (doctorUserId) => {
    const query = `
        select u.id, u.name, u.email
        from access_grants
                 join users u on access_grants.user_id = u.id
        where doctor_id = (select id from doctors where doctors.user_id = $1)
    `;
    return await executeQuery(query, [doctorUserId]);
};

module.exports = {
    addUser,
    authenticate,
    verifyEmailToken,
    getUserProfile,
    getDoctorGrants,
    sendAccountValidationEmail,
    sendAdminApprovalEmail,
    sendPasswordResetMail,
    resetPassword,
};