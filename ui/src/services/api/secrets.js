import axios from "axios";
import EnvManager from '../../config/envManager';

const baseUrl = EnvManager.BACKEND_URL;

const getSecretsSharedWithMe = async () => {

    const response = await axios.get(`${baseUrl}/secrets/shared-with-me`, {
        withCredentials: true,
    });
    const secrets = response?.data.secrets;
    return secrets ? Object.entries(secrets).map(([key, value]) => ({ title: key, secret: value })) : [];

};

const shareSecrets = async (secretList) => {
    const recipients = new Set();
    const secrets = new Map();
    secretList.forEach((secret) => {
        if (!recipients.has(secret.recipient)) {
            recipients.add(secret.recipient);
        }
        if (!secrets.has(secret.name)) {
            secrets.set(secret.name, secret.value);
        }
    });

    const response = await axios.post(`${baseUrl}/secrets/share`,
        {
            users: Array.from(recipients),
            secrets: Object.fromEntries(secrets)
        },
        { withCredentials: true });
    return response?.data;
};

export {
    getSecretsSharedWithMe,
    shareSecrets
};