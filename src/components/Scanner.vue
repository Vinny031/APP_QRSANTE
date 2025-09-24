<template>
    <div class="scanner-container">
        <Header />
        <h2>Scanner le QR Code du patient</h2>
        <p>Veuillez pointer la caméra vers le QR Code pour afficher les informations.</p>
        
        <div id="qr-reader"></div>

        <div v-if="scannedData" class="scanned-info">
            <h3>Informations du patient</h3>
            <p><strong>Données décryptées :</strong></p>
            <pre>{{ JSON.stringify(scannedData, null, 2) }}</pre>
            <button @click="stopScanning">Arrêter le scan</button>
        </div>

        <button @click="startScanning" v-if="!scanning">Lancer le scan</button>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Header from './Header.vue';
import { Html5QrcodeScanner } from "html5-qrcode";
import { decryptData } from './encryption';

const scannedData = ref(null);
const html5QrcodeScanner = ref(null);
const scanning = ref(false);

const onScanSuccess = (decodedText, decodedResult) => {
    // Une fois le QR code scanné, on arrête le scanner.
    html5QrcodeScanner.value.stop().then(() => {
        scanning.value = false;
        try {
            // Tentative de décryptage des données.
            scannedData.value = decryptData(decodedText);
        } catch (error) {
            console.error("Erreur lors du décryptage :", error);
            // Si le décryptage échoue, on affiche simplement le texte brut.
            scannedData.value = { error: "Données non valides", rawData: decodedText };
        }
    }).catch(err => {
        console.error("Erreur lors de l'arrêt du scanner :", err);
    });
};

const onScanError = (errorMessage) => {
    // Gestion des erreurs de scan.
    console.error(errorMessage);
};

const startScanning = () => {
    scanning.value = true;
    html5QrcodeScanner.value.render(onScanSuccess, onScanError);
};

const stopScanning = () => {
    html5QrcodeScanner.value.stop().then(() => {
        scanning.value = false;
        scannedData.value = null; // Réinitialisation des données scannées.
    }).catch(err => {
        console.error("Erreur lors de l'arrêt du scanner :", err);
    });
};

onMounted(() => {
    // Initialisation du scanner lors du montage du composant.
    html5QrcodeScanner.value = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
    );
});

onUnmounted(() => {
    // Arrêt du scanner lors de la destruction du composant pour libérer la caméra.
    if (scanning.value) {
        html5QrcodeScanner.value.stop().catch(err => console.error("Erreur lors de l'arrêt du scanner :", err));
    }
});
</script>

<style scoped>
.scanner-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
    color: #183473;
    margin-bottom: 10px;
}

p {
    color: #555;
    margin-bottom: 20px;
}

#qr-reader {
    width: 100%;
    max-width: 400px;
    margin: 0 auto 20px;
}

.scanned-info {
    margin-top: 20px;
    padding: 20px;
    background-color: #e8e8e8;
    border-radius: 8px;
    text-align: left;
}

.scanned-info pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: #fff;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
}

button {
    width: 100%;
    max-width: 250px;
    padding: 12px;
    background: #183473;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 10px;
    margin-top: 20px;
    font-size: 16px;
    transition: background 0.3s;
}

button:hover {
    background: #1a4a8d;
}
</style>
