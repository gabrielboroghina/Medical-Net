const {executeQuery} = require('../database');
const {Mailer} = require('../utils/mailer');
const {getUserProfile} = require('../users/users-model');

const mailer = new Mailer();
const mailerInitPromise = mailer.init();

const getAll = (onlyResolved) => {
    let query = `
        select id, subject, message, response, to_char(create_date :: DATE, 'dd/mm/yyyy') as create_date, important
        from messages
    `;
    if (onlyResolved)
        query += `
            where response is not null and important = true
        `;
    return executeQuery(query);
};

const getMessage = async (id) => {
    let query = `
        select id,
               subject,
               message,
               response,
               to_char(create_date :: DATE, 'dd/mm/yyyy') as create_date,
               important,
               author
        from messages
        where id = $1
    `;
    const msg = await executeQuery(query, [id]);
    return msg[0];
};

const insertMessage = (data) => {
    const query = `
        insert into messages (subject, message, response, important, author)
        values ($1, $2, null, false, $3)
    `;
    return executeQuery(query, [data.subject, data.message, data.author]);
};

const updateMessage = (msgId, newProps) => {
    const setProps = [];
    if (newProps.response !== undefined)
        setProps.push('response');
    if (newProps.important !== undefined)
        setProps.push('important');

    if (!setProps)
        return;

    const query = `
        update messages
        set ${setProps.map((prop, idx) => `${prop} = $${idx + 2}`).join(',')}
        where id = $1
    `;
    return executeQuery(query, [msgId, ...setProps.map(prop => newProps[prop])]);
};

const deliverMessageResponse = async (messageId) => {
    const msg = await getMessage(messageId);
    const userProfile = await getUserProfile(msg.author);

    const mailSubject = "Response to your question";
    const mailBody = `
        Hello! <br/> 
        We would like to announce you that your question registered through the FAQ page of our platform was resolved
        by our Tech Support department
        <br/><br/>
        <span style="font-size: 14px; color: #6c0a18; font-weight: bold;">Subject: </span><p>${msg.subject}</p>
        <span style="font-size: 14px; color: #6c0a18; font-weight: bold;">Description: </span><p>${msg.message}</p>
        <span style="font-size: 14px; color: #6c0a18; font-weight: bold;">Response: </span><p>${msg.response}</p>
        <br/>
        <p>We hope the answer will clarify your question!<br/>Have a good day!</p>
    `;

    await mailerInitPromise;
    return mailer.sendMail(userProfile.email, mailSubject, mailBody);
};

module.exports = {
    getAll,
    insertMessage,
    updateMessage,
    deliverMessageResponse,
};