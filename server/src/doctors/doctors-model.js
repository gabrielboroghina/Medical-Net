const {executeQuery} = require('../database');


const getAll = () => {
    let query = `
        select doc.id,
               doc.name                    as name,
               doc.title,
               doc.description,
               spec.name                   as specialty,
               h.name || ' ' || h.location as workplace,
               doc.picture_url             as picture_url,
               doc.rating
        from doctors doc
                 join medical_specialties spec on doc.specialty = spec.id
                 join hospitals h on doc.workplace = h.id;
    `;
    return executeQuery(query);
};

const deleteById = (id) => {
    let query = `
        delete
        from doctors
        where id = $1
    `;
    return executeQuery(query, [id]);
};

module.exports = {
    getAll,
    deleteById,
};