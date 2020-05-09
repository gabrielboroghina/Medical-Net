import axios from "axios";
import config from "./config";

function getToken() {
    const token = document.cookie
        .split(';')
        .map(cookie => cookie.trim().split('='))
        .filter(cookie => cookie[0] === 'access_token');

    if (token.length)
        return `Bearer ${token[0][1]}`;
    return null;
}

export async function register(data) {
    await axios.post(
        `${config.apiUrl}/users/register`,
        data,
        {headers: {'Content-Type': 'application/json'}}
    );
}

export async function login(data) {
    return axios.post(
        `${config.apiUrl}/users/login`,
        data,
        {
            headers: {'Content-Type': 'application/json'},
        }
    );
}

export async function getMessages() {
    const token = getToken();

    return await axios.get(`${config.apiUrl}/messages`,
        {
            headers: token
                ? {'Authorization': getToken()}
                : {}
        });
}

export async function sendMessage(data) {
    await axios.post(
        `${config.apiUrl}/messages`,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            }
        }
    );
}

export async function updateMessage(msgId, newProps) {
    await axios.put(
        `${config.apiUrl}/messages/${msgId}`,
        newProps,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken(),
            }
        }
    );
}

export async function getDoctors() {
    const result = await axios.get(`${config.apiUrl}/doctors`,
        {
            headers: {
                'Authorization': getToken(),
            }
        });
    return result.data;
}

export async function deleteDoctor(id) {
    await axios.delete(`${config.apiUrl}/doctors/${id}`,
        {
            headers: {
                'Authorization': getToken(),
            }
        });
}

export async function updateDoctorInfo(id, info) {
    await axios.put(`${config.apiUrl}/doctors/${id}`,
        info,
        {
            headers: {
                'Authorization': getToken(),
            }
        }
    );
}

export async function addDoctor(info) {
    await axios.post(`${config.apiUrl}/doctors`,
        info,
        {
            headers: {
                'Authorization': getToken(),
            }
        }
    );
}

export async function getRecords(userId) {
    const result = await axios.get(`${config.apiUrl}/users/${userId}/records`,
        {
            headers: {
                'Authorization': getToken(),
            }
        });
    return result.data;
}

export async function grantAccess(userId, allowedUserId) {
    await axios.put(`${config.apiUrl}/users/${userId}/records/grants`,
        {type: "grant", doctorId: allowedUserId},
        {
            headers: {
                'Authorization': getToken(),
            }
        }
    );
}

export async function revokeAccess(userId, allowedUserId) {
    await axios.put(`${config.apiUrl}/users/${userId}/records/grants`,
        {type: "revoke", doctorId: allowedUserId},
        {
            headers: {
                'Authorization': getToken(),
            }
        }
    );
}

export async function getAccessGrants(userId) {
    const result = await axios.get(`${config.apiUrl}/users/${userId}/records/grants`,
        {
            headers: {
                'Authorization': getToken(),
            }
        }
    );
    return result.data;
}

export async function getDoctorAccessGrants(doctorUserId) {
    const result = await axios.get(`${config.apiUrl}/users/${doctorUserId}/grants`,
        {
            headers: {
                'Authorization': getToken(),
            }
        }
    );
    return result.data;
}

export async function registerRecord(userId, record) {
    await axios.post(`${config.apiUrl}/users/${userId}/records`,
        record,
        {
            headers: {
                'Authorization': getToken(),
            }
        }
    );
}