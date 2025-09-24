<template>
  <div class="dashboard">
    <Header />
    <h2>Bienvenue sur votre espace QR Santé</h2>

        <div class="form-container">
            <h3>Données personnelles</h3>
            <div class="card">
                <div class="form-row">
                    <label for="birthDate">Date de naissance</label>
                    <input
                        type="text"
                        id="birthDate"
                        v-model="patientData.birthDate"
                        placeholder="JJ/MM/AAAA"
                        @input="formatDate"
                    />
                </div>
                <div class="form-row">
                    <label for="birthplace">Lieu de naissance</label>
                    <input
                        type="text"
                        id="birthplace"
                        v-model="patientData.birthplace"
                        @input="patientData.birthplace = patientData.birthplace.toUpperCase()"
                    />
                </div>
                <div class="form-row">
                    <label for="birthDepartment">Département de naissance</label>
                    <select id="birthDepartment" v-model="patientData.birthDepartment">
                        <option disabled value="">-- Sélectionnez un département --</option>
                        <option v-for="dep in departements" :key="dep.id" :value="dep.id">
                            {{ dep.id }} - {{ dep.name }}
                        </option>
                    </select>
                </div>
                <div class="form-row">
                    <label for="currentAddress">Adresse actuelle</label>
                    <input type="text" id="currentAddress" v-model="patientData.currentAddress" />
                </div>
            </div>
    
            <h3>Carnet médical</h3>
            <div class="card">
                <h4>Les essentielles :</h4>
                <div class="form-row">
                    <label for="hasPacemaker">Pacemaker ?</label>
                    <div class="options">
                        <input type="radio" id="pacemaker-yes" name="pacemaker" :value="true" v-model="patientData.hasPacemaker" />
                        <label for="pacemaker-yes">Oui</label>
                        <input type="radio" id="pacemaker-no" name="pacemaker" :value="false" v-model="patientData.hasPacemaker" />
                        <label for="pacemaker-no">Non</label>
                    </div>
                </div>
                
                <div class="form-row">
                    <label for="organDonation">Don d'organes ?</label>
                    <div class="options">
                        <input type="radio" id="organ-yes" name="organDonation" :value="true" v-model="patientData.organDonation" />
                        <label for="organ-yes">Oui</label>
                        <input type="radio" id="organ-no" name="organDonation" :value="false" v-model="patientData.organDonation" />
                        <label for="organ-no">Non</label>
                    </div>
                </div>

                <div class="form-row">
                    <label for="allergiesKnown">Allergies connues ?</label>
                    <div class="options">
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

      <!-- Contacts -->
      <div class="card">
        <h4>Contacts :</h4>
        <div class="form-row">
          <label for="attendingPhysician">Médecin traitant</label>
          <input type="text" id="attendingPhysician" v-model="patientData.attendingPhysician" />
        </div>
        <div class="form-row">
          <label for="physicianPhone">Numéro du médecin traitant</label>
          <input type="tel" id="physicianPhone" v-model="patientData.physicianPhone" />
        </div>
        <div class="form-row">
          <label for="emergencyContacts">Contacts d'urgence</label>
          <input type="text" id="emergencyContacts" v-model="patientData.emergencyContacts" />
        </div>
        <div class="form-row">
          <label for="emergencyContactPhone">Numéro contact d'urgence</label>
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
import departements from "../assets/data/departements.json";
import { useRouter } from 'vue-router';

const router = useRouter();

const patientData = reactive({
  birthDate: null,
  birthplace: null,
  birthDepartment: null,
  currentAddress: null,
  bloodType: null,
  allergies: null,
  hasPacemaker: false,
  allergiesKnown: false,
  medicalEquipment: null,
  chronicDiseases: null,
  medicalHistory: null,
  currentTreatments: null,
  medicalExams: null,
  advanceDirectives: null,
  organDonation: false,
  vaccinations: null,
  attendingPhysician: null,
  physicianPhone: null,
  emergencyContacts: null,
  emergencyContactPhone: null
});

onMounted(() => {
  const storedData = localStorage.getItem('patientMedicalData');
  if (storedData) Object.assign(patientData, JSON.parse(storedData));
});

function validate() {
  localStorage.setItem('patientMedicalData', JSON.stringify(patientData));
  router.push('/dashboard');
}

function formatDate(e) {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 8) val = val.slice(0, 8);
  if (val.length >= 5) {
    val = val.slice(0,2) + '/' + val.slice(2,4) + '/' + val.slice(4);
  } else if (val.length >= 3) {
    val = val.slice(0,2) + '/' + val.slice(2);
  }
  patientData.birthDate = val;
}
</script>

<style scoped>
.form-container, .form-row, .card {
    box-sizing: border-box;
}

.dashboard {
    width: 100%;
    padding: 15px;
    text-align: left;
    font-family: Arial, sans-serif;
    background-color: #f5f5f5;
}

h2, h3 {
    color: #183473;
    margin-bottom: 15px;
    text-align: center;
    font-size: 18px;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
}

.form-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 15px; /* Ajout d'un écart pour les éléments */
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
    flex-grow: 1;
    padding: 12px;
    font-size: 14px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.options {
    display: flex;
    align-items: center;
    gap: 15px;
}

.options input[type="radio"] {
    width: auto;
    flex-grow: 0;
}

.options label {
    font-weight: normal;
}

.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    width: 100%;
}

.card h4 {
    margin-top: 0;
    color: #183473;
    text-align: center;
    font-size: 16px;
}

button {
    width: 100%;
    padding: 14px;
    background: #183473;
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 15px;
}

button:hover {
    background: #1a4a8d;
}
</style>
