import axios from "axios";
import config from "./config";

function getToken() {
    const token = document.cookie
        .split(';')
        .map(cookie => cookie.trim().split('='))
        .filter(cookie => cookie[0] === 'access_token');

    if (token.length)
        return `Bearer ${token[0][1]}`;
    throw new Error("Not authenticated");
}

async function register(data) {
    await axios.post(
        `${config.apiUrl}/users/register`,
        data,
        {headers: {'Content-Type': 'application/json'}}
    );
}

async function login(data) {
    return axios.post(
        `${config.apiUrl}/users/login`,
        data,
        {
            headers: {'Content-Type': 'application/json'},
        }
    );
}

async function getMessages() {
    return await axios.get(`${config.apiUrl}/messages`,
        {
            headers: {
                'Authorization': getToken(),
            }
        });
}

async function sendMessage(data) {
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

async function updateMessage(msgId, newProps) {
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

async function getDoctors() {
    const result = await axios.get(`${config.apiUrl}/doctors`,
        {
            headers: {
                'Authorization': getToken(),
            }
        });
    return result.data;
}

async function deleteDoctor(id) {
    await axios.delete(`${config.apiUrl}/doctors/${id}`,
        {
            headers: {
                'Authorization': getToken(),
            }
        });
}

export default {
    register,
    login,
    getMessages,
    sendMessage,
    updateMessage,
    getDoctors,
    deleteDoctor,
};