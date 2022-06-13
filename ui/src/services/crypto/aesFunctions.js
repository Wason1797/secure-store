import { hexStringToArray } from './helpers';


const crypto = window.crypto;
const subtleCrypto = crypto.subtle;

const getInitializationVector = () => crypto.getRandomValues(new Uint8Array(16));

const encryptWithAES_CBC = async (key, iv, message) => {
    const cryptoKey = await subtleCrypto.importKey('raw', hexStringToArray(key), 'AES-CBC', false, ['encrypt', 'decrypt']);
    const encryptedData = await subtleCrypto.encrypt({ name: 'AES-CBC', iv }, cryptoKey, Buffer.from(message));
    return Buffer.from(encryptedData).toString('hex');
};

export {
    getInitializationVector,
    encryptWithAES_CBC
};
