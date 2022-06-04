import { bufferToHexString, hexStringToArray } from './helpers';

const subtleCrypto = window.crypto.subtle;

const generateECDHKeyPair = async (keyGenParams = { name: 'ECDH', namedCurve: 'P-256' }, exportable = false) =>
    subtleCrypto.generateKey(keyGenParams, exportable, ['deriveKey', 'deriveBits']);


const getPublicKey = async (keyPair, format = 'raw') => {
    const rawPublicKey = await subtleCrypto.exportKey(format, keyPair.publicKey);
    return bufferToHexString(rawPublicKey);
};

const importECDHPublicKey = async (publicKeyHexString, format = 'spki', keyParams = { name: 'ECDH', namedCurve: 'P-256' }, exportable = true) => {
    const publicKey = hexStringToArray(publicKeyHexString);
    return subtleCrypto.importKey(format, publicKey, keyParams, exportable, []);
};



export {
    getPublicKey,
    generateECDHKeyPair,
    importECDHPublicKey,
};
