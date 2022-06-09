import * as crypto from "crypto-browserify";

const subtleCrypto = window.crypto.subtle;

const decryptWithPrivateKey = (privateKey, secret) => {
    try {
        const decryptedData = crypto.privateDecrypt(
            {
                key: Buffer.from(privateKey),
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            Buffer.from(secret, 'base64')
        );
        return decryptedData.toString('utf-8');
    }
    catch (error) {
        console.log('Error ', error);
        return '';
    }

};

const decryptSecretsWithPrivateKeyFile = async (privateKey, secrets) => {
    if (!privateKey || !secrets) return;
    const privateKeyArrayBuffer = await privateKey.arrayBuffer();
    return secrets.map((secretData) => ({
        ...secretData,
        secret: decryptWithPrivateKey(privateKeyArrayBuffer, secretData.secret),
    }));
};

const getKeyStart = (publicOrPrivate) => `-----BEGIN ${publicOrPrivate} KEY-----\n`;
const getKeyEnd = (publicOrPrivate) => `\n-----END ${publicOrPrivate} KEY-----`;

const generateRSAKeyPair = async (keyLength = 1024) => {

    const rsaKeyPair = await subtleCrypto.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: keyLength,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: 'SHA-256' },
        },
        true,
        ['encrypt', 'decrypt']
    );
    const [rsaPublicKey, rsaPrivateKey] = await Promise.all(
        [subtleCrypto.exportKey('spki', rsaKeyPair.publicKey),
        subtleCrypto.exportKey('pkcs8', rsaKeyPair.privateKey)]
    );
    return {
        rsaPublicKey: `${getKeyStart('PUBLIC')}${Buffer.from(rsaPublicKey).toString('base64')}${getKeyEnd('PUBLIC')}`,
        rsaPrivateKey: `${getKeyStart('PRIVATE')}${Buffer.from(rsaPrivateKey).toString('base64')}${getKeyEnd('PRIVATE')}`
    };
};


export {
    generateRSAKeyPair,
    decryptWithPrivateKey,
    decryptSecretsWithPrivateKeyFile
};
