import axios from "axios";
import config from "./config";

async function register(data) {
    await axios.post(
        `${config.apiUrl}/users/register`,
        data,
        {headers: {'Content-Type': 'application/json'}}
    );
}

export default {
    register
};