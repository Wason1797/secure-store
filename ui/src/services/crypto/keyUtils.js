import * as crypto from "crypto-browserify";

const decryptWithPrivateKey = (privateKey, secret) => {
    const decryptedData = crypto.privateDecrypt(
        {
            key: Buffer.from(privateKey),
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(secret, "base64")
    );
    return decryptedData.toString("utf-8");
};

const decryptSecretsWithPrivateKeyFile = async (privateKey, secrets) => {
    if (!privateKey || !secrets) return;
    const privateKeyArrayBuffer = await privateKey.arrayBuffer();
    return secrets.map((secretData) => ({
        ...secretData,
        secret: decryptWithPrivateKey(privateKeyArrayBuffer, secretData.secret),
    }));
};



export {
    decryptWithPrivateKey,
    decryptSecretsWithPrivateKeyFile
};
