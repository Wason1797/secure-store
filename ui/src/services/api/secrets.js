import axios from "axios";
import EnvManager from '../../config/envManager';
import { deriveSharedHKDFKey, generateECDHKeys } from '../crypto/ecdhFunctions';
import { encryptWithAES_CBC, getInitializationVector } from '../crypto/aesFunctions';

const baseUrl = `${EnvManager.BACKEND_URL}/secrets`;

const getSecretsSharedWithMe = async () => {

    const response = await axios.get(`${baseUrl}/user/current`, {
        withCredentials: true,
    });
    return response?.data;

};

const shareSecrets = async (secretList, sharedSecret) => {
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

    const encryptionHelper = async (name, value) => {
        const iv = getInitializationVector();
        return [name, {
            iv: Buffer.from(iv).toString('hex'),
            secret: await encryptWithAES_CBC(sharedSecret, iv, value)
        }];
    };

    const encryptedSecrets = await Promise.all(Array.from(secrets, ([name, value]) => encryptionHelper(name, value)));

    const response = await axios.post(`${baseUrl}/share`,
        {
            users: Array.from(recipients),
            secrets: Object.fromEntries(encryptedSecrets),
        },
        { withCredentials: true });
    return response?.data;
};


const performKeyAgreement = async () => {

    const clientKeyPair = await generateECDHKeys();

    const response = await axios.post(`${baseUrl}/agree/key`,
        {
            public_key: clientKeyPair.publicKey
        },
        { withCredentials: true });

    const serverPublicKey = response?.data?.server_public_key;

    return deriveSharedHKDFKey(serverPublicKey, clientKeyPair.privateKey);
};

export {
    getSecretsSharedWithMe,
    shareSecrets,
    performKeyAgreement
};
