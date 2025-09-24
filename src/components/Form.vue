<template>
    <div class="dashboard">
        <Header />
        <h2>Bienvenue sur votre espace QR Santé</h2>

        <h3>Données personnelles</h3>
        <div class="form">
            <div class="form-row">
                <label for="birthDate">Date de naissance</label>
                <input type="date" id="birthDate" v-model="patientData.birthDate" />
            </div>
            <div class="form-row">
                <label for="birthplace">Lieu de naissance</label>
                <input type="text" id="birthplace" v-model="patientData.birthplace" />
            </div>
            <div class="form-row">
                <label for="birthDepartment">Département de naissance</label>
                <input type="text" id="birthDepartment" v-model="patientData.birthDepartment" />
            </div>
            <div class="form-row">
                <label for="currentAddress">Adresse actuelle</label>
                <input type="text" id="currentAddress" v-model="patientData.currentAddress" />
            </div>
            
        </div>
    
        <h3>Carnet médical</h3>
        <div class="form">
            <div class="card">
                <h4>Les essentielles :</h4>
                <div class="form-row">
                    <label for="hasPacemaker">Pacemaker ?</label>
                    <div class="options">
                        <!-- Utilisation de :value pour lier des valeurs booléennes -->
                        <input type="radio" id="pacemaker-yes" name="pacemaker" :value="true" v-model="patientData.hasPacemaker" />
                        <label for="pacemaker-yes">Oui</label>
                        <input type="radio" id="pacemaker-no" name="pacemaker" :value="false" v-model="patientData.hasPacemaker" />
                        <label for="pacemaker-no">Non</label>
                    </div>
                </div>
                
                <div class="form-row">
                    <label for="organDonation">Don d'organes ?</label>
                    <div class="options">
                        <!-- Utilisation de :value pour lier des valeurs booléennes -->
                        <input type="radio" id="organ-yes" name="organDonation" :value="true" v-model="patientData.organDonation" />
                        <label for="organ-yes">Oui</label>
                        <input type="radio" id="organ-no" name="organDonation" :value="false" v-model="patientData.organDonation" />
                        <label for="organ-no">Non</label>
                    </div>
                </div>

                <div class="form-row">
                    <label for="allergiesKnown">Allergies connues ?</label>
                    <div class="options">
                        <!-- Utilisation de :value pour lier des valeurs booléennes -->
                        <input type="radio" id="allergies-yes" name="allergies" :value="true" v-model="patientData.allergiesKnown" />
                        <label for="allergies-yes">Oui</label>
                        <input type="radio" id="allergies-no" name="allergies" :value="false" v-model="patientData.allergiesKnown" />
                        <label for="allergies-no">Non</label>
                    </div>
                </div>

                <div class="form-row">
                    <label for="allergies">Allergies</label>
                    <input type="text" id="allergies" v-model="patientData.allergies" />
                </div>

                <div class="form-row">
                    <label for="Groupe sanguin">Groupe sanguin</label>
                    <select v-model="patientData.bloodType" id="Groupe sanguin">
                        <option value="" disabled selected>Sélectionner un groupe</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

            </div>
            
            <div class="card">
                <h4>Données médicales :</h4>
                    <div class="form-row">
                        <label for="medicalEquipment">Matériel médical (PTG, PTH, PHC...)</label>
                        <input type="text" id="medicalEquipment" v-model="patientData.medicalEquipment" />
                    </div>
                    <div class="form-row">
                        <label for="chronicDiseases">Maladies chroniques</label>
                        <input type="text" id="chronicDiseases" v-model="patientData.chronicDiseases" />
                    </div>
                    <div class="form-row">
                        <label for="medicalHistory">Antécédents médicaux</label>
                        <input type="text" id="medicalHistory" v-model="patientData.medicalHistory" />
                    </div>
                    <div class="form-row">
                        <label for="currentTreatments">Traitements en cours</label>
                        <input type="text" id="currentTreatments" v-model="patientData.currentTreatments" />
                    </div>
                    <div class="form-row">
                        <label for="medicalExams">Examens médicaux</label>
                        <input type="text" id="medicalExams" v-model="patientData.medicalExams" />
                    </div>
                    <div class="form-row">
                        <label for="advanceDirectives">Directives anticipées</label>
                        <input type="text" id="advanceDirectives" v-model="patientData.advanceDirectives" />
                    </div>
                    <div class="form-row">
                        <label for="vaccinations">Vaccinations</label>
                        <input type="text" id="vaccinations" v-model="patientData.vaccinations" />
                    </div>
            </div>

            <div class="card">
                <h4>Contacts :</h4>
                <div class="form-row">
                    <label for="attendingPhysician">Médecin traitant</label>
                    <input type="text" id="attendingPhysician" v-model="patientData.attendingPhysician" />
                </div>
                <div class="form-row">
                    <label for="physicianPhone">Numéro de téléphone du médecin traitant</label>
                    <input type="tel" id="physicianPhone" v-model="patientData.physicianPhone" />
                </div>
                <div class="form-row">
                    <label for="emergencyContacts">Contacts d'urgence</label>
                    <input type="text" id="emergencyContacts" v-model="patientData.emergencyContacts" />
                </div>
                <div class="form-row">
                    <label for="emergencyContactPhone">Numéro de téléphone du contact d'urgence</label>
                    <input type="tel" id="emergencyContactPhone" v-model="patientData.emergencyContactPhone" />
                </div>
            </div>
        </div>
        <button @click="validate">Valider</button>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import Header from './Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const patientData = reactive({
    birthplace: null,
    birthDepartment: null,
    currentAddress: null,
    birthDate: null,
    bloodType: null,
    allergies: null,
    hasPacemaker: false,
    allergiesKnown: false, // Initialisation
    medicalEquipment: null,
    chronicDiseases: null,
    medicalHistory: null,
    currentTreatments: null,
    medicalExams: null,
    advanceDirectives: null,
    organDonation: false, // Initialisation
    vaccinations: null,
    attendingPhysician: null,
    physicianPhone: null,
    emergencyContacts: null,
    emergencyContactPhone: null
});

onMounted(() => {
  const storedData = localStorage.getItem('patientMedicalData');
  if (storedData) {
    const data = JSON.parse(storedData);
    Object.assign(patientData, data);
  }
});

function validate() {
    localStorage.setItem('patientMedicalData', JSON.stringify(patientData));
    console.log("Données sauvegardées : ", patientData);
    router.push('/dashboard'); 
}
</script>

<style scoped>
.form, .form *, .card {
    box-sizing: border-box;
}

.dashboard {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    text-align: left; 
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
    border-radius: 10px;
}

h2, h3 {
    color: #183473;
    margin-bottom: 20px;
    text-align: center;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
}

.form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.form-row label {
    flex-basis: 40%;
    flex-shrink: 0;
    font-weight: bold;
    color: #555;
    text-align: left;
}

.form-row input,
.form-row select {
    flex-basis: 55%;
    flex-grow: 1;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-sizing: border-box;
}

/* Style corrigé pour les groupes de boutons radio */
.radio-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.radio-group .options {
    display: flex;
    gap: 15px;
    align-items: center;
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

.card h4 {
    margin-top: 0;
    color: #183473;
    text-align: center;
}

button {
    width: 100%;
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
