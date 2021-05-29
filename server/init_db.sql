CREATE TABLE IF NOT EXISTS roles
(
    id serial primary key,
    type varchar
);

CREATE TABLE IF NOT EXISTS users
(
    id                       serial primary key,
    username                 varchar not null unique,
    password                 varchar not null,
    email                    varchar unique,
    name                     varchar,
    role_id                  integer references roles (id),
    email_verification_token varchar
);

CREATE TABLE IF NOT EXISTS hospitals
(
    id   serial primary key,
    name varchar not null
);

CREATE TABLE IF NOT EXISTS medical_specialties
(
    id   serial primary key,
    name varchar not null
);

CREATE TABLE IF NOT EXISTS doctors
(
    id          serial primary key,
    name        varchar not null,
    title       varchar not null,
    specialty   integer references medical_specialties (id),
    workplace   integer references hospitals (id),
    description varchar,
    rating      float,
    picture_url varchar,
    user_id     integer references users (id)
);

CREATE TABLE IF NOT EXISTS access_grants
(
    id          serial primary key,
    user_id     integer references users (id),
    doctor_id   integer references doctors (id),
    valid_until timestamp
);

CREATE TABLE IF NOT EXISTS record_types
(
    id   serial primary key,
    name varchar not null
);

CREATE TABLE IF NOT EXISTS records
(
    id             serial primary key,
    type           integer references record_types (id),
    investigations varchar,
    diagnosis      varchar,
    prescription   varchar,
    create_date    date,
    doctor         integer references doctors (id),
    owner_id       integer references users (id)
);

CREATE TABLE IF NOT EXISTS messages
(
    id          serial primary key,
    subject     varchar not null,
    message     varchar,
    response    varchar,
    important   bool,
    create_date date,
    author      integer references users (id)
);

---------------------------------------------------------------------------------------------------

insert into roles values(0, 'admin');
insert into roles values(1, 'support');
insert into roles values(2, 'user');
insert into roles values(3, 'doctor');

insert into record_types(name) values('Consultatie');
insert into record_types(name) values('Analize');

insert into hospitals(name) values('Spitalul Universitar de Urgenta Bucuresti');
insert into hospitals(name) values('Spitalul Floreasca Bucuresti');
insert into hospitals(name) values('Spitalul Clinic Județean de Urgență Cluj');


insert into medical_specialties(name) values('Chirurgie');
insert into medical_specialties(name) values('Urologie');
insert into medical_specialties(name) values('Cardiologie');

insert into users(username, password, email, name, role_id, email_verification_token)
values ('admin', '$2a$05$syuu4EhTXSc1C/cx.UWfD.jThhANP6ZsAnTeiCaAHy190TYUyk/E.', null, 'Administrator', 0, null); -- pass: administrator

insert into users(username, password, email, name, role_id, email_verification_token)
values ('tech', '$2a$05$59lSLlwhHq5RUjAxtLJ9o.oDViE9riaE4fqBWE2gbe5DIaaIxFYNm', null, 'Tech Support', 1, null); -- pass: support

insert into users(username, password, email, name, role_id, email_verification_token)
values ('patient', '$2a$05$FT1aRjeXyHtX5UGen1rKjuL66Pf3lUHlr443gohRYDGFr2YDrhhVi', 'john.doe@medicalnet.com', 'John Doe', 2, null); -- pass: patient

insert into users (username, password, email, name, role_id, email_verification_token)
values ('ciuce', '$2a$05$lVX0fuHRac39.85ej/IU6.80DaToR.1gXDr7pl78iWgbkpeDOxh96', 'constantin.ciuce@doctors.ro', 'Constantin Ciuce', 3, null); -- pass: gheorghe

insert into doctors(name, title, specialty, workplace, description, rating, picture_url)
values ('Florin Papagheorghe', 'Medic primar', 1, 1,
        E'Membru al Societatii Romane de Neurochirurgie (SRN) \n Membru al Asociatiei Europene a Societatilor de Neurochirurgie (EANS) \n Membru al Federatiei Mondiale a Societatilor de Neurochirurgie (WFNS)',
        9.2,
        'http://media.timisoreni.ro/upload/photo_b/2015-03/dr_florin_papagheorghe_large.jpg');

insert into doctors(name, title, specialty, workplace, description, rating, picture_url)
values ('Dr. Gheorghe Nita', 'Medic primar', 2, 2,
        E'Permiul Best lecturer at 21th Video Urology World Congress, 2010 pentru doua lucrari - Renal Cell Carcinoma: Energy ablation of renal masses si Minimal Invasive treatment of upper urothelial tumors\n' ||
        E'Membru Asociatia Romana de Urologie\n' ||
        E'Membru American Society for Laser Medicine and Surgery (ASLMS)',
        9.89, 'https://www.reginamaria.ro/sites/default/files/styles/large/public/medic/gheorghe_nita.png');

insert into doctors(name, title, specialty, workplace, description, rating, picture_url, user_id)
values ('Prof. Univ. Dr. Constantin Ciuce', 'Profesor', 1, 3,
        E'Doctor in Medicina, teza de doctorat: “Contributii experimentale si clinice in microchirurgia reconstructiva, UMF “Iuliu Hatieganu“ Cluj-Napoca, conducator stiintific Prof. Dr. Aurel Kaufmann' ||
        E'Profesor universitar - Disciplina Chirurgie I, Universitatea de Medicina si Farmacie “Iuliu Hatieganu” Cluj-Napoca',
        9.90, 'https://www.reginamaria.ro/sites/default/files/styles/large/public/medic/constantin_ciuce.png?itok=SUXLop9S', 3);

insert into records(type, investigations, diagnosis, prescription, create_date, doctor, owner_id)
values (1,
        E'Consult cardiologic, EKG si ecografie cord, Monitorizarea Holter EKG',
        'Endocardita - inflamația stratului interior al inimii',
        'Administrarea prelungita de agenti antimicrobieni (antibiotice intravenos)',
        now(),
        3, 2);

insert into records(type, investigations, diagnosis, prescription, create_date, doctor, owner_id)
values (2,
        E'Hemoleucograma completa (HLG), Markeri endocrini pentru functia glandei tiroide',
        'Anemie, Hipotiroidism',
        'Fier, Levotiroxina sodica',
        now(),
        1, 2);

insert into messages (subject, message, response, important, create_date)
values ('How to post a new question?', 'Am I able to ask a question about the platform?', 'Just fill the contact form above with your question in the subject field and optionally a description in the message field and you will receive the response via your e-mail.', true, now());

insert into messages (subject, message, response, important, create_date)
values ('How can I view my medical history?', '', 'Go to Medical Data tab in the navigation bar', true, now());

insert into messages (subject, message, response, important, create_date)
values ('I forgot my password. How do I reset it?', '', null, true, now());

insert into messages (subject, message, response, important, create_date)
values ('What is the platform name', '', 'Medical Net', true, now());

-- insert into users(username, password, email, name, role_id, email_verification_token)
-- values ('admin', '$2a$05$syuu4EhTXSc1C/cx.UWfD.jThhANP6ZsAnTeiCaAHy190TYUyk/E.', null, 'Administrator', 0, null);
--
-- insert into users(username, password, email, name, role_id, email_verification_token)
-- values ('boroghin', '$2a$05$lnEIkyzxW5C9d1.KxYPJn.gx3NN/1tdgUdptIinzH7cQeMejuRZEa', 'gabrielboroghina@outlook.com', 'Gabi Boro', 2, null);
--
-- insert into users(username, password, email, name, role_id, email_verification_token)
-- values ('gabi', '$2a$05$5604J5S2Ve6g0lG9d5dxi.1iJBWhPMsxSzW1ouCfROcrsU.2/vDJy', 'gabib97@yahoo.com', 'Gabriel Boroghină', 2, null);
--
-- insert into users(username, password, email, name, role_id, email_verification_token)
-- values ('pw', '$2a$05$zmL1QTEEHvIIvD2YlNEffeXjQXRgRMrsW79pyOHsMc8PEiw1nkjne', 'md.medical.net@gmail.com', 'Paul Walker', 2, null);
