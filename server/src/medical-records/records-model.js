const {executeQuery} = require('../database');

const getUserRecords = async (userId) => {
    let query = `
        select rec.id,
               rec.doctor                                 as doctor_id,
               rec.owner_id,
               to_char(create_date :: DATE, 'dd/mm/yyyy') as create_date,
               investigations,
               diagnosis,
               prescription,
               doc.name                                   as doctor_name,
               h.name                                     as doctor_hospital,
               doc.picture_url                            as doctor_photo
        from records rec
                 join doctors doc on doc.id = rec.doctor
                 join hospitals h on doc.workplace = h.id
        where owner_id = $1
    `;
    const result = await executeQuery(query, [userId]);

    for (const rec of result) {
        rec.doctor = {
            id: rec.doctor_id,
            name: rec.doctor_name,
            hospital: rec.doctor_hospital,
            photo: rec.doctor_photo
        };
        delete rec.doctor_id;
        delete rec.doctor_name;
        delete rec.doctor_hospital;
        delete rec.doctor_photo;
    }
    return result;
};

const getAccessGrants = async (userId) => {
    const query = `
        select doctor_id
        from access_grants
        where user_id = $1
    `;
    const result = await executeQuery(query, [userId]);
    return result.map(res => res.doctor_id);
};

const grantAccess = async (userId, doctorId) => {
    const query = `
        insert into access_grants(user_id, doctor_id)
        values ($1, $2)
    `;
    await executeQuery(query, [userId, doctorId]);
};

const revokeAccess = async (userId, doctorId) => {
    const query = `
        delete
        from access_grants
        where user_id = $1
          and doctor_id = $2
    `;
    await executeQuery(query, [userId, doctorId]);
};

module.exports = {
    getUserRecords,
    grantAccess,
    getAccessGrants,
    revokeAccess,
};