import { bufferToHexString, hexStringToArray } from './helpers';

const subtleCrypto = window.crypto.subtle;

const generateECDHPrivateKey = async (keyGenParams = { name: 'ECDH', namedCurve: 'p-256' }, exportable = false) =>
    subtleCrypto.generateKey(keyGenParams, exportable, ['deriveKey', 'deriveBits']);


const getPublicKey = async (privateKey, format = 'raw') => {
    const rawPublicKey = subtleCrypto.exportKey(format, privateKey.publiKey);
    return bufferToHexString(rawPublicKey);
};

const importECDHPublicKey = async (publicKeyHexString, format = 'spki', keyParams = { name: 'ECDH', namedCurve: 'p-256' }, exportable = true) => {
    const publicKey = hexStringToArray(publicKeyHexString);
    return subtleCrypto.importKey(format, publicKey, keyParams, exportable, []);
};



export {
    getPublicKey,
    generateECDHPrivateKey,
    importECDHPublicKey,
};
