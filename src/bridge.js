import axios from "axios";
import config from "./config";

async function register(data) {
    await axios.post(
        `${config.apiUrl}/users/register`,
        data,
        {headers: {'Content-Type': 'application/json'}}
    );
}

async function login(data) {
    await axios.post(
        `${config.apiUrl}/users/login`,
        data,
        {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }
    );
}

async function getMessages() {
    return await axios.get(`${config.apiUrl}/messages`,
        {
            withCredentials: true
        });
}

async function sendMessage(data) {
    await axios.post(
        `${config.apiUrl}/messages`,
        data,
        {headers: {'Content-Type': 'application/json'}}
    );
}

async function setMessageResponse(msgId, response) {
    await axios.put(
        `${config.apiUrl}/messages/${msgId}`,
        {response: response},
        {headers: {'Content-Type': 'application/json'}}
    );
}

export default {
    register,
    login,
    getMessages,
    sendMessage,
    setMessageResponse,
};