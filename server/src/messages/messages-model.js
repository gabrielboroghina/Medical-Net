const {executeQuery} = require('../database');


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

const insertMessage = (data) => {
    const query = `
        insert into messages (subject, message, response, important)
        values ($1, $2, null, false)
    `;
    return executeQuery(query, [data.subject, data.message]);
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
    console.log(query, [msgId, ...setProps.map(prop => newProps[prop])]);
    return executeQuery(query, [msgId, ...setProps.map(prop => newProps[prop])]);
};

module.exports = {
    getAll,
    insertMessage,
    updateMessage,
};