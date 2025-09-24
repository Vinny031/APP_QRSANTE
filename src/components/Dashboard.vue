<template>
  <div class="dashboard">
    <Header />
    <h2>Bienvenue sur votre espace QR Santé</h2>

    <div class="patient-data-section">
      <div v-if="!patientData">
        <p>Aucune donnée médicale n'a été renseignée.</p>
        <button @click="openDataForm">Remplir vos données</button>
      </div>

      <div v-else>
        <div class="card">
          <h3>Données personnelles</h3>
          <ul>
            <li v-if="patientData.birthplace">Lieu de naissance : {{ patientData.birthplace }}</li>
            <li v-if="patientData.birthDepartment">Département de naissance : {{ patientData.birthDepartment }}</li>
            <li v-if="patientData.currentAddress">Adresse actuelle : {{ patientData.currentAddress }}</li>
            <li v-if="patientData.birthDate">Date de naissance : {{ patientData.birthDate }}</li>
          </ul>
        </div>

        <div class="card">
          <h3>Données médicales</h3>
          <ul>
            <li v-if="patientData.bloodType">Groupe sanguin : {{ patientData.bloodType }}</li>
            <li v-if="patientData.allergies">Allergies : {{ patientData.allergies }}</li>
            <li v-if="patientData.hasPacemaker === true">Pacemaker : Oui</li>
            <li v-if="patientData.hasPacemaker === false">Pacemaker : Non</li>
            <li v-if="patientData.organDonation === true">Don d'organes : Oui</li>
            <li v-if="patientData.organDonation === false">Don d'organes : Non</li>
            <li v-if="patientData.medicalEquipment">Matériel médical : {{ patientData.medicalEquipment }}</li>
            <li v-if="patientData.chronicDiseases">Maladies chroniques : {{ patientData.chronicDiseases }}</li>
            <li v-if="patientData.medicalHistory">Antécédents médicaux : {{ patientData.medicalHistory }}</li>
            <li v-if="patientData.currentTreatments">Traitements en cours : {{ patientData.currentTreatments }}</li>
            <li v-if="patientData.medicalExams">Examens médicaux : {{ patientData.medicalExams }}</li>
            <li v-if="patientData.advanceDirectives">Directives anticipées : {{ patientData.advanceDirectives }}</li>
            <li v-if="patientData.vaccinations">Vaccinations : {{ patientData.vaccinations }}</li>
            <li v-if="patientData.attendingPhysician">Médecin traitant : {{ patientData.attendingPhysician }}</li>
            <li v-if="patientData.physicianPhone">Numéro du médecin traitant : {{ patientData.physicianPhone }}</li>
            <li v-if="patientData.emergencyContacts">Contacts d'urgence : {{ patientData.emergencyContacts }}</li>
            <li v-if="patientData.emergencyContactPhone">Numéro du contact d'urgence : {{ patientData.emergencyContactPhone }}</li>
          </ul>
        </div>

        <div class="card">
          <h3>Contacts</h3>
          <ul>
            <li v-if="patientData.attendingPhysician">Médecin traitant : {{ patientData.attendingPhysician }}</li>
            <li v-if="patientData.physicianPhone">Numéro du médecin traitant : {{ patientData.physicianPhone }}</li>
            <li v-if="patientData.emergencyContacts">Contacts d'urgence : {{ patientData.emergencyContacts }}</li>
            <li v-if="patientData.emergencyContactPhone">Numéro du contact d'urgence : {{ patientData.emergencyContactPhone }}</li>
          </ul>
        </div>

        <div class="action-buttons">
          <button @click="openDataForm">Modifier les données</button>
          <button @click="generateQRCode">Afficher le QR Code</button>

          <!-- Bouton praticien uniquement si proNumber existe -->
          <PractitionerButton 
            v-if="users && users.proNumber" 
            :proNumber="users.proNumber" 
          />
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import PractitionerButton from './PractitionerButton.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const patientData = ref(null);
const users = ref(null);

// Récupération des données utilisateur depuis IndexedDB
const fetchUserFromIndexedDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('MyAppDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;

      let objectStoreName = null;
      if (db.objectStoreNames.contains('users')) objectStoreName = 'users';
      else if (db.objectStoreNames.length > 0) objectStoreName = db.objectStoreNames[0];

      if (!objectStoreName) return resolve(null);

      const transaction = db.transaction([objectStoreName], 'readonly');
      const store = transaction.objectStore(objectStoreName);
      const cursorRequest = store.openCursor();

      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value && cursor.value.proNumber) resolve(cursor.value);
          else cursor.continue();
        } else {
          resolve(null);
        }
      };

      cursorRequest.onerror = () => reject(cursorRequest.error);
    };
  });
};

const fetchPatientData = () => {
  const storedData = localStorage.getItem('patientMedicalData');
  if (storedData) patientData.value = JSON.parse(storedData);
};

const openDataForm = () => router.push('/form');
const generateQRCode = () => router.push('/qrcode');

onMounted(async () => {
  fetchPatientData();
  users.value = await fetchUserFromIndexedDB();
});
</script>

<style scoped>
/* Styles inchangés */
.dashboard {
  width: 100%;
  padding: 15px;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-sizing: border-box;
}

h2, h3, h4 {
  color: #183473;
  margin-bottom: 15px;
  text-align: center;
  font-size: 16px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  text-align: left;
  width: 100%;
  box-sizing: border-box;
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

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
  margin-top: 20px;
}

.action-buttons button {
  width: 100%;
  padding: 12px;
  border: none;
  cursor: pointer;
  background: #183473;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  transition: background 0.3s;
}

.action-buttons button:hover {
  background: #1a4a8d;
}

.patient-data-section {
  width: 100%;
  overflow-wrap: break-word;
}
</style>
