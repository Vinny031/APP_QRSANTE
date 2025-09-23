import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'votre-cle-secrete-et-longue-ici';

export function encryptData(data) {
    // Chiffre les données en JSON
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    return ciphertext;
}

export function decryptData(ciphertext) {
    try {
    // Déchiffre les données et les parse en JSON
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
    } catch (e) {
    // Gérer les erreurs de déchiffrement (mauvaise clé, données corrompues)
    console.error('Erreur de déchiffrement :', e);
    return null;
    }
}