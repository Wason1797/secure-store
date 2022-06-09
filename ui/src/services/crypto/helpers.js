
// https://stackoverflow.com/questions/36598638/generating-ecdh-keys-in-the-browser-through-webcryptoapi-instead-of-the-browseri

const bufferToHexString = buffer => Array.from(new Uint8Array(buffer))
    .map(x => ('00' + x.toString(16)).slice(-2))
    .join('');


const hexStringToArray = str => {
    if (!str) return new Uint8Array();

    const arr = [];
    for (let i = 0, len = str.length; i < len; i += 2) {
        arr.push(parseInt(str.substr(i, 2), 16));
    }
    return new Uint8Array(arr);
};


export {
    bufferToHexString,
    hexStringToArray
};
