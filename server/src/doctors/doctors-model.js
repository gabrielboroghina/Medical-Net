const {executeQuery} = require('../database');


const getAll = async () => {
    let query = `
        select doc.id,
               doc.name,
               doc.title,
               doc.description,
               doc.specialty,
               doc.workplace,
               doc.picture_url,
               doc.rating
        from doctors doc
    `;
    const doctors = await executeQuery(query);

    query = `
        select *
        from medical_specialties
    `;
    const specialties = await executeQuery(query);

    query = `
        select *
        from hospitals
    `;
    const hospitals = await executeQuery(query);

    return [doctors, specialties, hospitals];
};

const deleteById = (id) => {
    let query = `
        delete
        from doctors
        where id = $1
    `;
    return executeQuery(query, [id]);
};

const updateById = async (id, newDetails) => {
    // check if there is a new specialty/workplace
    if (typeof newDetails.specialty === 'string') {
        const query = `
            insert into medical_specialties(name)
            values ($1)
        `;
        await executeQuery(query, [newDetails.specialty]);
        newDetails.specialty = (await executeQuery('select id from medical_specialties where name = $1', [newDetails.specialty]))[0].id;
    }
    if (typeof newDetails.workplace === 'string') {
        const query = `
            insert into hospitals(name)
            values ($1)
        `;
        await executeQuery(query, [newDetails.workplace]);
        newDetails.workplace = (await executeQuery('select id from hospitals where name = $1', [newDetails.workplace]))[0].id;
    }

    const query = `
        update doctors
        set name        = $1,
            title       = $2,
            specialty   = $3,
            workplace   = $4,
            description = $5,
            rating      = $6,
            picture_url = $7
        where id = $8
    `;
    await executeQuery(query, [
        newDetails.name,
        newDetails.title,
        newDetails.specialty,
        newDetails.workplace,
        newDetails.description,
        newDetails.rating,
        newDetails.picture_url,
        id
    ])
};

module.exports = {
    getAll,
    updateById,
    deleteById,
};