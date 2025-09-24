<template>
    <div class="dashboard">
        <Header />
        <h2>Bienvenue sur votre espace QR Santé</h2>

        <div v-if="!hasMedicalData" class="centered-content">
            <p>Aucune donnée médicale n'a été renseignée.</p>
            <button @click="openDataForm">Remplir vos données</button>
        </div>

        <div v-else class="patient-data-section">
            <div v-if="patientData.email" class="user-info-section">
                <p class="user-name">Bonjour, {{ patientData.firstName }} {{ patientData.fullName }}</p>
                <p class="user-email">E-mail : {{ patientData.email }}</p>
            </div>

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
                <h4>Vitales</h4>
                <ul>
                    <li v-if="patientData.bloodType">Groupe sanguin : {{ patientData.bloodType }}</li>
                    <li v-if="patientData.allergies">Allergies : {{ patientData.allergies }}</li>
                    <li v-if="patientData.hasPacemaker === true">Pacemaker : Oui</li>
                    <li v-if="patientData.hasPacemaker === false">Pacemaker : Non</li>
                    <li v-if="patientData.organDonation === true">Don d'organes : Oui</li>
                    <li v-if="patientData.organDonation === false">Don d'organes : Non</li>
                </ul>
                <h4>Autres</h4>
                <ul>
                    <li v-if="patientData.medicalEquipment">Matériel médical : {{ patientData.medicalEquipment }}</li>
                    <li v-if="patientData.chronicDiseases">Maladies chroniques : {{ patientData.chronicDiseases }}</li>
                    <li v-if="patientData.medicalHistory">Antécédents médicaux : {{ patientData.medicalHistory }}</li>
                    <li v-if="patientData.currentTreatments">Traitements en cours : {{ patientData.currentTreatments }}</li>
                    <li v-if="patientData.medicalExams">Examens médicaux : {{ patientData.medicalExams }}</li>
                    <li v-if="patientData.advanceDirectives">Directives anticipées : {{ patientData.advanceDirectives }}</li>
                    <li v-if="patientData.vaccinations">Vaccinations : {{ patientData.vaccinations }}</li>
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

                <PractitionerButton 
                    v-if="patientData && patientData.proNumber" 
                    :proNumber="patientData.proNumber" 
                />
            </div>
        </div>

        <Footer />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import PractitionerButton from './PractitionerButton.vue';
import { useRouter, useRoute } from 'vue-router';
import { getUser } from '../db.js';

const router = useRouter();
const route = useRoute();

const patientData = ref(null);

const fetchPatientData = async () => {
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    if (currentUserEmail) {
        const userData = await getUser(currentUserEmail);
        const storedMedicalData = localStorage.getItem('patientMedicalData');
        const medicalData = storedMedicalData ? JSON.parse(storedMedicalData) : {};
        patientData.value = { ...userData, ...medicalData };
    }
};

const hasMedicalData = computed(() => {
    if (!patientData.value) {
        return false;
    }
    const medicalFields = [
        'birthplace', 'birthDepartment', 'currentAddress', 'birthDate',
        'bloodType', 'allergies', 'hasPacemaker', 'organDonation',
        'medicalEquipment', 'chronicDiseases', 'medicalHistory',
        'currentTreatments', 'medicalExams', 'advanceDirectives',
        'vaccinations', 'attendingPhysician', 'physicianPhone',
        'emergencyContacts', 'emergencyContactPhone'
    ];
    return medicalFields.some(field => patientData.value[field] !== null && patientData.value[field] !== undefined && patientData.value[field] !== '');
});

const openDataForm = () => router.push('/form');
const generateQRCode = () => router.push('/qrcode');

onMounted(async () => {
    fetchPatientData();
});

watch(
    () => route.path,
    (newPath) => {
        if (newPath === '/dashboard') {
            fetchPatientData();
        }
    },
    { immediate: true }
);
</script>

<style scoped>
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
  margin-bottom: 15px;
  text-align: center;
  font-size: 16px;
}

.user-info-section {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #e8e8e8;
  border-radius: 8px;
  font-size: 1.1em;
  color: #333;
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

.patient-data-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-wrap: break-word;
}

.centered-content {
    text-align: center;
    padding: 20px;
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
</style>
