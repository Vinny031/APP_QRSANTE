<template>
  <div class="qr-container">
    <Header />
    <h2>Votre QR Code de Santé</h2>
    <p>Ce QR Code est scannable par un professionnel de santé et expire après 4 heures.</p>

    <div class="qr-code-wrapper" ref="qrWrapper">
      <qrcode-vue
        :value="encryptedData"
        :size="qrSize"
        level="M"
        :foreground="'#183473'"
        ref="qrcodeRef"
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

    <button @click="downloadQRCode" class="download-button">Télécharger le QR Code</button>
    <button @click="goBack">Retour au tableau de bord</button>
  </div>
  <Footer />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Header from './Header.vue';
import QrcodeVue from 'qrcode.vue';
import { useRouter } from 'vue-router';
import { encryptData } from './encryption';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Footer from './Footer.vue';
import html2canvas from 'html2canvas';

const qrcodeRef = ref(null);
const qrWrapper = ref(null);
const qrSize = ref(300);

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
    patientData.value.hasPacemaker = data.hasPacemaker === true;
    encryptedData.value = encryptData({ ...data, timestamp: Date.now() });
  }
};

const goBack = () => router.push('/dashboard');

const updateQRSize = () => {
  if (qrWrapper.value) {
    qrSize.value = Math.min(qrWrapper.value.clientWidth, 320);
  }
};

const downloadQRCode = () => {
  if (!qrWrapper.value) return alert('QR Code non disponible');

  html2canvas(qrWrapper.value, { scale: 4, useCORS: true, allowTaint: true }).then(canvas => {
    // Créer le fond d'écran
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    const width = 1080;
    const height = 1920;
    finalCanvas.width = width;
    finalCanvas.height = height;

    // Fond dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#f0f4ff');
    gradient.addColorStop(1, '#e8f0fe');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // QR code centré
    const qrSizeFinal = width * 0.7;
    const qrX = (width - qrSizeFinal) / 2;
    const qrY = (height - qrSizeFinal) / 2;
    ctx.drawImage(canvas, qrX, qrY, qrSizeFinal, qrSizeFinal);

    // Texte en haut
    ctx.fillStyle = '#183473';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code de Santé', width / 2, 120);
    ctx.font = '32px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText('Urgence Médicale', width / 2, 180);

    // Texte en bas
    ctx.font = '28px Arial';
    ctx.fillStyle = '#888';
    ctx.fillText("À scanner par un professionnel", width / 2, height - 200);
    ctx.fillText("de santé en cas d'urgence", width / 2, height - 160);

    // Infos patient
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#183473';
    let infoText = '';
    if (patientData.value.bloodType) infoText += `Groupe: ${patientData.value.bloodType}  `;
    if (patientData.value.allergies && patientData.value.allergies !== 'Aucune') infoText += `Allergies: ${patientData.value.allergies}  `;
    if (patientData.value.hasPacemaker) infoText += 'Pacemaker  ';
    if (infoText) ctx.fillText(infoText.trim(), width / 2, height - 100);

    // Télécharger
    const link = document.createElement('a');
    link.download = 'qr-code-sante-wallpaper.png';
    link.href = finalCanvas.toDataURL('image/png', 1.0);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

onMounted(() => {
  fetchAndEncryptData();
  updateQRSize();
  window.addEventListener('resize', updateQRSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateQRSize);
});
</script>

<style scoped>
.qr-container {
  width: 90%;
  max-width: 320px;
  margin: 20px auto;
  padding: 15px;
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  border-radius: 10px;
}

h2 {
  color: #183473;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

p {
  color: #555;
  margin-bottom: 10px;
  font-size: 1rem;
}

.qr-code-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
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
  margin: 4px 0;
}

.icon-group svg {
  font-size: 14px;
  color: #183473;
}

.icon-group p {
  margin-top: 3px;
  font-size: 13px;
  color: #555;
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
  margin-top: 15px;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover {
  background: #1a4a8d;
}

/* Mobile très petit */
@media (max-width: 320px) {
  h2 { font-size: 1.3rem; }
  p { font-size: 0.9rem; }
  .icon-group p { font-size: 12px; }
}
</style>
