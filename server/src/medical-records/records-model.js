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

module.exports = {
    getUserRecords,
};