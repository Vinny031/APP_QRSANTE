<template>
  <div class="scanner-container">
    <Header />
    <h2>Scanner le QR Code du patient</h2>
    <p>Veuillez pointer la caméra vers le QR Code pour afficher les informations.</p>
    
    <div id="qr-reader" v-if="!scannedData"></div>
    
    <!-- Affichage des données scannées avec le même style que le dashboard -->
    <div v-if="scannedData && !scannedData.error" class="patient-data-section">
      <!-- Section d'information utilisateur -->
      <div v-if="scannedData.email" class="user-info-section">
        <p class="user-name">{{ scannedData.firstName }} {{ scannedData.fullName }}</p>
        <p class="user-email">E-mail : {{ scannedData.email }}</p>
      </div>

      <!-- QR Code expiré -->
      <div v-if="isQRCodeExpired" class="expired-warning">
        <h3>⚠️ QR Code Expiré</h3>
        <p>Ce QR Code a été généré il y a plus de 4 heures et n'est plus valide.</p>
        <p>Temps écoulé : {{ getTimeElapsed() }}</p>
      </div>

      <!-- Informations vitales d'urgence (toujours visibles) -->
      <div class="card emergency-card" v-if="hasEmergencyInfo">
        <h3>🚨 Informations Vitales d'Urgence</h3>
        <ul>
          <li v-if="scannedData.bloodType" class="emergency-info">
            <span class="icon">🩸</span>
            Groupe sanguin : <strong>{{ scannedData.bloodType }}</strong>
          </li>
          <li v-if="scannedData.allergies && scannedData.allergies !== 'Aucune'" class="emergency-info">
            <span class="icon">⚠️</span>
            Allergies : <strong>{{ scannedData.allergies }}</strong>
          </li>
          <li v-if="scannedData.hasPacemaker === true" class="emergency-info">
            <span class="icon">🫀</span>
            Pacemaker : <strong>Oui</strong>
          </li>
          <li v-if="scannedData.organDonation === true" class="emergency-info">
            <span class="icon">❤️</span>
            Don d'organes : <strong>Oui</strong>
          </li>
          <li v-if="scannedData.organDonation === false" class="emergency-info">
            <span class="icon">❌</span>
            Don d'organes : <strong>Non</strong>
          </li>
        </ul>
      </div>

      <!-- Données personnelles -->
      <div class="card" v-if="hasPersonalInfo">
        <h3>Données personnelles</h3>
        <ul>
          <li v-if="scannedData.birthDate">Date de naissance : {{ formatDate(scannedData.birthDate) }}</li>
          <li v-if="scannedData.birthplace">Lieu de naissance : {{ scannedData.birthplace }}</li>
          <li v-if="scannedData.birthDepartment">Département de naissance : {{ scannedData.birthDepartment }}</li>
          <li v-if="scannedData.currentAddress">Adresse actuelle : {{ scannedData.currentAddress }}</li>
        </ul>
      </div>

      <!-- Autres données médicales -->
      <div class="card" v-if="hasOtherMedicalInfo">
        <h3>Autres données médicales</h3>
        <ul>
          <li v-if="scannedData.medicalEquipment">Matériel médical : {{ scannedData.medicalEquipment }}</li>
          <li v-if="scannedData.chronicDiseases">Maladies chroniques : {{ scannedData.chronicDiseases }}</li>
          <li v-if="scannedData.medicalHistory">Antécédents médicaux : {{ scannedData.medicalHistory }}</li>
          <li v-if="scannedData.currentTreatments">Traitements en cours : {{ scannedData.currentTreatments }}</li>
          <li v-if="scannedData.medicalExams">Examens médicaux : {{ scannedData.medicalExams }}</li>
          <li v-if="scannedData.advanceDirectives">Directives anticipées : {{ scannedData.advanceDirectives }}</li>
          <li v-if="scannedData.vaccinations">Vaccinations : {{ scannedData.vaccinations }}</li>
        </ul>
      </div>

      <!-- Contacts -->
      <div class="card" v-if="hasContactInfo">
        <h3>Contacts</h3>
        <ul>
          <li v-if="scannedData.attendingPhysician">Médecin traitant : {{ scannedData.attendingPhysician }}</li>
          <li v-if="scannedData.physicianPhone">
            Numéro du médecin traitant : 
            <a :href="'tel:' + scannedData.physicianPhone" class="phone-link">{{ scannedData.physicianPhone }}</a>
          </li>
          <li v-if="scannedData.emergencyContacts">Contacts d'urgence : {{ scannedData.emergencyContacts }}</li>
          <li v-if="scannedData.emergencyContactPhone">
            Numéro du contact d'urgence : 
            <a :href="'tel:' + scannedData.emergencyContactPhone" class="phone-link">{{ scannedData.emergencyContactPhone }}</a>
          </li>
        </ul>
      </div>

      <div class="action-buttons">
        <button @click="resetScanner" class="scan-again-btn">Scanner un autre QR Code</button>
      </div>
    </div>

    <!-- Erreur de décryptage -->
    <div v-if="scannedData && scannedData.error" class="error-info">
      <h3>❌ Erreur de lecture</h3>
      <p>{{ scannedData.error }}</p>
      <div class="raw-data">
        <p><strong>Données brutes :</strong></p>
        <pre>{{ scannedData.rawData }}</pre>
      </div>
      <button @click="resetScanner">Réessayer</button>
    </div>

    <button @click="startScanning" v-if="!scanning && !scannedData">Lancer le scan</button>
    <button @click="goBack" class="back-button">Retour au tableau de bord</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import Header from './Header.vue';
import { Html5QrcodeScanner } from "html5-qrcode";
import { decryptData } from './encryption';
import Dashboard from './Dashboard.vue';
import { useRouter } from 'vue-router';

// Initialisation du routeur
const router = useRouter();

const scannedData = ref(null);
const html5QrcodeScanner = ref(null);
const scanning = ref(false);

const goBack = () => {
  router.push('/dashboard');
};

const onScanSuccess = (decodedText, decodedResult) => {
  // Arrêter le scanner s'il est actif
  if (html5QrcodeScanner.value && typeof html5QrcodeScanner.value.clear === 'function') {
    html5QrcodeScanner.value.clear().then(() => {
      scanning.value = false;
      processScannedData(decodedText);
    }).catch(err => {
      console.error("Erreur lors de l'arrêt du scanner :", err);
      scanning.value = false;
      processScannedData(decodedText);
    });
  } else {
    scanning.value = false;
    processScannedData(decodedText);
  }
};

const processScannedData = (decodedText) => {
  try {
    const decryptedData = decryptData(decodedText);
    scannedData.value = decryptedData;
    console.log("Données décryptées :", decryptedData);
  } catch (error) {
    console.error("Erreur lors du décryptage :", error);
    scannedData.value = { 
      error: "QR Code non valide ou données corrompues", 
      rawData: decodedText.substring(0, 100) + "..." 
    };
  }
};

const onScanError = (errorMessage) => {
  // Filtrer les erreurs communes qui ne sont pas importantes
  const ignoredErrors = [
    'NotFoundException',
    'No MultiFormat Readers were able to detect the code',
    'QR code parse error',
    'Not found'
  ];
  
  const shouldIgnore = ignoredErrors.some(ignoredError => 
    errorMessage.includes(ignoredError)
  );
  
  if (!shouldIgnore) {
    console.error("Erreur de scan importante:", errorMessage);
  }
  // On ne fait rien pour les erreurs normales de détection
};

const startScanning = () => {
  scanning.value = true;
  html5QrcodeScanner.value.render(onScanSuccess, onScanError);
};

const resetScanner = () => {
  if (html5QrcodeScanner.value) {
    // Essayer clear d'abord, puis stop si clear n'existe pas
    const stopMethod = html5QrcodeScanner.value.clear || html5QrcodeScanner.value.stop;
    
    if (stopMethod && typeof stopMethod === 'function') {
      stopMethod.call(html5QrcodeScanner.value).then(() => {
        scanning.value = false;
        scannedData.value = null;
        // Réinitialiser le scanner
        initializeScanner();
        startScanning();
      }).catch(err => {
        console.error("Erreur lors de l'arrêt du scanner :", err);
        // Même si ça échoue, on peut réessayer
        scanning.value = false;
        scannedData.value = null;
        initializeScanner();
        startScanning();
      });
    } else {
      // Si aucune méthode d'arrêt n'est disponible, recréer le scanner
      scanning.value = false;
      scannedData.value = null;
      initializeScanner();
      startScanning();
    }
  } else {
    scannedData.value = null;
    initializeScanner();
    startScanning();
  }
};

const initializeScanner = () => {
  // Recréer le scanner à chaque fois
  html5QrcodeScanner.value = new Html5QrcodeScanner(
    "qr-reader",
    { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    },
    false
  );
};

// Computed properties pour l'affichage conditionnel
const hasEmergencyInfo = computed(() => {
  if (!scannedData.value) return false;
  return scannedData.value.bloodType || 
         (scannedData.value.allergies && scannedData.value.allergies !== 'Aucune') ||
         scannedData.value.hasPacemaker === true ||
         scannedData.value.organDonation !== undefined;
});

const hasPersonalInfo = computed(() => {
  if (!scannedData.value) return false;
  return scannedData.value.birthDate || scannedData.value.birthplace || 
         scannedData.value.birthDepartment || scannedData.value.currentAddress;
});

const hasOtherMedicalInfo = computed(() => {
  if (!scannedData.value) return false;
  return scannedData.value.medicalEquipment || scannedData.value.chronicDiseases ||
         scannedData.value.medicalHistory || scannedData.value.currentTreatments ||
         scannedData.value.medicalExams || scannedData.value.advanceDirectives ||
         scannedData.value.vaccinations;
});

const hasContactInfo = computed(() => {
  if (!scannedData.value) return false;
  return scannedData.value.attendingPhysician || scannedData.value.physicianPhone ||
         scannedData.value.emergencyContacts || scannedData.value.emergencyContactPhone;
});

const isQRCodeExpired = computed(() => {
  if (!scannedData.value || !scannedData.value.timestamp) return false;
  const fourHours = 4 * 60 * 60 * 1000; // 4 heures en millisecondes
  return (Date.now() - scannedData.value.timestamp) > fourHours;
});

// Utilitaires
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

const getTimeElapsed = () => {
  if (!scannedData.value || !scannedData.value.timestamp) return '';
  const elapsed = Date.now() - scannedData.value.timestamp;
  const hours = Math.floor(elapsed / (60 * 60 * 1000));
  const minutes = Math.floor((elapsed % (60 * 60 * 1000)) / (60 * 1000));
  return `${hours}h ${minutes}min`;
};

const printInfo = () => {
  window.print();
};

onMounted(() => {
  initializeScanner();
});

onUnmounted(() => {
  if (html5QrcodeScanner.value) {
    // Essayer toutes les méthodes possibles pour arrêter le scanner
    const stopMethod = html5QrcodeScanner.value.clear || 
                      html5QrcodeScanner.value.stop || 
                      html5QrcodeScanner.value.destroy;
    
    if (stopMethod && typeof stopMethod === 'function') {
      stopMethod.call(html5QrcodeScanner.value).catch(err => 
        console.error("Erreur lors de l'arrêt du scanner :", err)
      );
    }
  }
});
</script>

<style scoped>
.scanner-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2, h3 {
  color: #183473;
  margin-bottom: 15px;
  text-align: center;
  font-size: 16px;
}

p {
  color: #555;
  margin-bottom: 20px;
  text-align: center;
}

#qr-reader {
  width: 100%;
  max-width: 400px;
  margin: 0 auto 20px;
}

/* Reprise des styles du dashboard */
.patient-data-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-wrap: break-word;
  margin-top: 20px;
}

.user-info-section {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #e8e8e8;
  border-radius: 8px;
  font-size: 1.1em;
  color: #333;
  width: 100%;
}

.user-info-section .user-name {
  font-weight: bold;
  font-size: 1.2em;
  margin: 0 0 5px 0;
}

.user-info-section .user-email {
  font-style: italic;
  margin: 0;
}

.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  width: 100%;
}

.emergency-card {
  border-left: 5px solid #e74c3c;
  background-color: #fff5f5;
}

.emergency-card h3 {
  color: #e74c3c;
  text-align: left;
}

ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
}

li:last-child {
  border-bottom: none;
}

.emergency-info {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.emergency-info .icon {
  margin-right: 8px;
  font-size: 1.2em;
}

.phone-link {
  color: #183473;
  text-decoration: none;
  font-weight: bold;
}

.phone-link:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  margin-top: 20px;
  width: 100%;
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
  margin: 10px auto;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover {
  background: #1a4a8d;
}

.scan-again-btn {
  background: #2ecc71;
}

.scan-again-btn:hover {
  background: #27ae60;
}

.print-btn {
  background: #3498db;
}

.print-btn:hover {
  background: #2980b9;
}

.expired-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
  text-align: center;
  color: #856404;
}

.expired-warning h3 {
  color: #856404;
  margin-bottom: 10px;
}

.error-info {
  margin-top: 20px;
  padding: 20px;
  background-color: #ffebee;
  border: 1px solid #f8bbd9;
  border-radius: 8px;
  text-align: center;
}

.error-info h3 {
  color: #c62828;
}

.raw-data {
  margin-top: 15px;
  text-align: left;
}

.raw-data pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 12px;
}

/* Styles pour l'impression */
@media print {
  .action-buttons, .expired-warning {
    display: none;
  }
  
  .scanner-container {
    box-shadow: none;
    background-color: white;
  }
}
</style>