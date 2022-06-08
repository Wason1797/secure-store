import axios from "axios";
import EnvManager from '../../config/envManager';

const baseUrl = EnvManager.BACKEND_URL;

const uploadPublicKey = async (publicKeyFile, onUploadProgress, done) => {
    try {
        const data = new FormData();
        data.append('public_key', publicKeyFile);
        const response = await axios.post(`${baseUrl}/public-key`, data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
                onUploadProgress
            },
        );
        done();
        return response?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export {
    uploadPublicKey,
};
