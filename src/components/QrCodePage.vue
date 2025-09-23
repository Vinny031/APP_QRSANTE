<template>
  <div class="qr-container">
    <Header />
    <h2>Votre QR Code de Santé</h2>
    <p>Ce QR Code est scannable par un professionnel de santé et expire après 4 heures.</p>
    
    <div class="qr-code-wrapper">
      <qrcode-vue
        :value="encryptedData"
        :size="300"
        level="H"
        :foreground="'#183473'"
      ></qrcode-vue>
      
      <div class="info-icons-overlay">
        <div class="icon-group">
          <font-awesome-icon icon="fa-solid fa-droplet" />
          <p>{{ patientData.bloodType }}</p>
        </div>
        <div class="icon-group">
          <font-awesome-icon icon="fa-solid fa-allergies" />
          <p>{{ patientData.allergies }}</p>
        </div>
        <div class="icon-group" v-if="patientData.hasPacemaker">
          <font-awesome-icon icon="fa-solid fa-heart-circle-bolt" />
          <p>Pacemaker</p>
        </div>
      </div>
    </div>

    <button @click="goBack">Retour au tableau de bord</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './Header.vue';
import QrcodeVue from 'qrcode.vue';
import { useRouter } from 'vue-router';
import { encryptData } from './encryption';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const patientData = ref({
  bloodType: null,
  allergies: null,
  hasPacemaker: false
});
const encryptedData = ref('');
const router = useRouter();

const fetchAndEncryptData = () => {
  const storedData = localStorage.getItem('patientMedicalData');
  if (storedData) {
    const data = JSON.parse(storedData);
    
    patientData.value.bloodType = data.bloodType;
    patientData.value.allergies = data.allergies;
    patientData.value.hasPacemaker = data.hasPacemaker;

    const dataToEncrypt = {
      ...data,
      timestamp: Date.now()
    };
    
    encryptedData.value = encryptData(dataToEncrypt);
  }
};

const goBack = () => {
  router.push('/dashboard');
};

onMounted(() => {
  fetchAndEncryptData();
});
</script>

<style scoped>
/* Main container styles */
.qr-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 10px;
}

h2 {
  color: #183473;
  margin-bottom: 10px;
}

p {
  color: #555;
  margin-bottom: 20px;
}

/* QR Code and overlay styles */
.qr-code-wrapper {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 20px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info-icons-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  width: auto;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 7px;
  border-radius: 20px;
}

.icon-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 5px 0;
}

.info-icons-overlay .icon-group svg {
  font-size: 2.5em; 
  color: #183473;
}

.icon-group p {
  margin-top: 5px;
  font-size: 0.9em;
  color: #555;
}

/* Button styles */
button {
  width: 100%;
  max-width: 250px; /* Make button slightly smaller than container */
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