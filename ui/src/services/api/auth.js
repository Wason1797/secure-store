import axios from "axios";
import EnvManager from '../../config/envManager';

const baseUrl = `${EnvManager.BACKEND_URL}/auth`;


const logoutUser = async () => {
    try {
        const response = await axios.get(`${baseUrl}/logout`, {
            withCredentials: true
        });
        return response?.data;
    }
    catch (error) {
        return null;
    }
};


const logoutUserSession = async () => {
    const didLogout = await logoutUser();
    sessionStorage.clear();
    return Boolean(didLogout);
};


export {
    logoutUserSession
};