<template>
  <div class="dashboard">
    <Header />
    <h2>Bienvenue sur votre espace QR Santé</h2>
  </div>

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
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const patientData = ref(null);

const fetchPatientData = () => {
    const storedData = localStorage.getItem('patientMedicalData');
    if (storedData) { // On vérifie si les données existent
        patientData.value = JSON.parse(storedData);
    }
};

const openDataForm = () => {
    // Redirection vers le formulaire pour remplir/modifier les données
    router.push('/form'); 
};

const generateQRCode = () => {
  router.push('/qrcode');
};

// On appelle la fonction pour récupérer les données au chargement du composant
fetchPatientData();
</script>

<style scoped>
/* Styles de la page */
.dashboard {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    border-radius: 10px;
}

h2, h3, h4 {
    color: #183473;
    margin-bottom: 20px;
    text-align: center;
}

/* Styles des cartes et des boutons */
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

ul {
  list-style-type: none; /* Supprime les puces */
  padding: 0;
  margin-top: 20px;
}

li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1em;
  color: #333;
}

li:last-child {
    border-bottom: none;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-top: 30px;
}

.action-buttons button {
    width: auto;
    padding: 12px 24px;
    border: none;
    cursor: pointer;
    background: #183473;
    color: white;
    border-radius: 10px;
    font-size: 16px;
    transition: background 0.3s;
}

.action-buttons button:hover {
    background: #1a4a8d;
}
</style>