import axios from "axios";
import EnvManager from '../../config/envManager';

const baseUrl = `${EnvManager.BACKEND_URL}/users`;

const getUsers = async () => {

    const response = await axios.get(baseUrl, {
        withCredentials: true,
    });
    return response?.data.users;

};

const getActiveUserSession = async () => {
    try {
        const response = await axios.get(`${baseUrl}/session/active`, {
            withCredentials: true,
        });
        return response?.data;
    }
    catch (error) {
        return null;
    }
};



const didUserActivateSession = async () => {
    const sessionUser = sessionStorage.getItem('user');
    if (sessionUser && sessionUser.exp < new Date().getTime()) return true;
    const user = await getActiveUserSession();
    if (user) {
        sessionStorage.setItem('user', user);
        return true;
    }
    return false;
};



export {
    getUsers,
    didUserActivateSession
};