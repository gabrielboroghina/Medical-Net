const {executeQuery} = require('../database');


const getAll = async () => {
    let query = `
        select doc.id,
               doc.name      as name,
               doc.title,
               doc.description,
               doc.specialty as specialty_id,
               spec.name     as specialty,
               doc.workplace as workplace_id,
               h.name        as workplace,
               doc.picture_url,
               doc.rating
        from doctors doc
                 join medical_specialties spec on doc.specialty = spec.id
                 join hospitals h on doc.workplace = h.id;
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

/** Check if there is a new specialty/workplace that have to be created. */
const _assureForeignKeysPrerequisites = async (info) => {
    if (typeof info.specialty === 'string') {
        const query = `
            insert into medical_specialties(name)
            values ($1)
        `;
        await executeQuery(query, [info.specialty]);
        info.specialty = (await executeQuery('select id from medical_specialties where name = $1', [info.specialty]))[0].id;
    }
    if (typeof info.workplace === 'string') {
        const query = `
            insert into hospitals(name)
            values ($1)
        `;
        await executeQuery(query, [info.workplace]);
        info.workplace = (await executeQuery('select id from hospitals where name = $1', [info.workplace]))[0].id;
    }
};

const updateById = async (id, newDetails) => {
    await _assureForeignKeysPrerequisites(newDetails);
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
    ]);
};

const add = async (data) => {
    await _assureForeignKeysPrerequisites(data);

    const query = `
        insert into doctors(name, title, specialty, workplace, description, rating, picture_url)
        values ($1, $2, $3, $4, $5, $6, $7)
    `;
    await executeQuery(query, [
        data.name,
        data.title,
        data.specialty,
        data.workplace,
        data.description,
        data.rating,
        data.picture_url,
    ]);
};

module.exports = {
    getAll,
    updateById,
    deleteById,
    add,
};