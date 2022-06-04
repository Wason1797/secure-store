import { generateECDHKeyPair, getPublicKey, importECDHPublicKey } from './keyUtils';
import { bufferToHexString } from './helpers';

const subtleCrypto = window.crypto.subtle;


const generateECDHKeys = async () => {
    const keyPair = await generateECDHKeyPair();
    const publicKey = await getPublicKey(keyPair);
    return {
        rawKeys: keyPair,
        publicKey,
        privateKey: keyPair.privateKey
    };
};


const deriveSharedHKDFKey = async (serverPubKeyHexString, clientPrivateKey, pubKeyParams = { name: 'ECDH', namedCurve: 'p-256' }) => {
    const serverPubKey = await importECDHPublicKey(serverPubKeyHexString);
    const sharedSecretBits = await subtleCrypto.deriveBits(
        { ...pubKeyParams, public: serverPubKey },
        clientPrivateKey,
        256
    );
    const sharedSecretKey = await subtleCrypto.importKey('raw', sharedSecretBits, { name: 'HKDF' }, false, ['deriveKey', 'deriveBits']);
    const derivedSecretBits = await subtleCrypto.deriveBits(
        { name: "HKDF", hash: "SHA-256", salt: new Uint8Array([]), info: new Uint8Array([]) },
        sharedSecretKey,
        256
    );
    return bufferToHexString(derivedSecretBits);

};

export {
    deriveSharedHKDFKey,
    generateECDHKeys
};
