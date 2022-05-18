import axios from "axios";
import EnvManager from '../../config/envManager';

const baseUrl = EnvManager.BACKEND_URL;

const getUsers = async () => {

    const response = await axios.get(`${baseUrl}/users`, {
        withCredentials: true,
    });
    return response?.data.users;

};

export {
    getUsers
};