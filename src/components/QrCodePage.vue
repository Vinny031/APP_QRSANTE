<template>
  <div class="qr-container">
    <Header />
    <h2>Votre QR Code de Santé</h2>
    <p>Ce QR Code est scannable par un professionnel de santé et expire après 4 heures.</p>
    
    <div class="qr-code-wrapper">
      <qrcode-vue
        :value="encryptedData"
        :size="300"
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

    <!-- Nouveau bouton pour télécharger l'image -->
    <button @click="downloadQRCode" class="download-button">Télécharger le QR Code</button>
    
    <button @click="goBack" class="back-button">Retour au tableau de bord</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './Header.vue';
import QrcodeVue from 'qrcode.vue';
import { useRouter } from 'vue-router';
import { encryptData } from './encryption';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import html2canvas from 'html2canvas';

const qrcodeRef = ref(null);

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
    patientData.value.hasPacemaker = data.hasPacemaker === true; // Convertir la chaîne "true" en booléen true

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

const downloadQRCode = () => {
  if (qrcodeRef.value) {
    console.log('qrcodeRef.value:', qrcodeRef.value);
    console.log('qrcodeRef.value.$el:', qrcodeRef.value.$el);
    
    let canvas = null;
    
    // Méthode 1 : Essayer différentes façons d'accéder au canvas
    try {
      // Si $el est un élément DOM
      if (qrcodeRef.value.$el && typeof qrcodeRef.value.$el.querySelector === 'function') {
        canvas = qrcodeRef.value.$el.querySelector('canvas');
        console.log('Canvas trouvé via $el.querySelector:', canvas);
      }
      
      // Si $el est directement le canvas
      if (!canvas && qrcodeRef.value.$el && qrcodeRef.value.$el.tagName === 'CANVAS') {
        canvas = qrcodeRef.value.$el;
        console.log('$el est directement le canvas:', canvas);
      }
      
      // Méthode alternative : chercher dans le DOM parent
      if (!canvas) {
        const wrapper = document.querySelector('.qr-code-wrapper');
        if (wrapper) {
          canvas = wrapper.querySelector('canvas');
          console.log('Canvas trouvé via wrapper:', canvas);
        }
      }
      
      // Dernière méthode : chercher tous les canvas de la page
      if (!canvas) {
        const allCanvas = document.querySelectorAll('canvas');
        // Prendre le dernier canvas (probablement celui du QR code)
        if (allCanvas.length > 0) {
          canvas = allCanvas[allCanvas.length - 1];
          console.log('Canvas trouvé via querySelectorAll:', canvas);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la recherche du canvas:', error);
    }
    if (canvas) {
      try {
        // Capturer toute la zone avec les icônes
        const qrWrapper = document.querySelector('.qr-code-wrapper');
        
        if (qrWrapper) {
          // Utiliser html2canvas pour capturer le QR code avec les icônes
          html2canvas(qrWrapper, {
            backgroundColor: '#ffffff',
            scale: 4, // Très haute résolution
            useCORS: true,
            allowTaint: true,
            logging: false
          }).then(qrCanvas => {
            // Créer le canvas final au format téléphone (9:16 ou 9:19.5)
            const finalCanvas = document.createElement('canvas');
            const ctx = finalCanvas.getContext('2d');
            
            // Dimensions pour écran de téléphone (par exemple iPhone)
            const width = 1080;
            const height = 1920; // Ratio 9:16, ou utilise 2340 pour 9:19.5 (iPhone X+)
            
            finalCanvas.width = width;
            finalCanvas.height = height;
            
            // Fond dégradé ou couleur unie
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, '#f0f4ff');
            gradient.addColorStop(1, '#e8f0fe');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
            
            // Taille du QR code (plus grand pour la qualité)
            const qrSize = Math.min(width * 0.7, height * 0.4);
            const qrX = (width - qrSize) / 2;
            const qrY = (height - qrSize) / 2;
            
            // Dessiner le QR code avec les icônes
            ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
            
            // Ajouter du texte en haut et en bas
            ctx.fillStyle = '#183473';
            ctx.textAlign = 'center';
            
            // Titre en haut
            ctx.font = 'bold 48px Arial';
            ctx.fillText('QR Code de Santé', width / 2, 120);
            
            // Sous-titre
            ctx.font = '32px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText('Urgence Médicale', width / 2, 180);
            
            // Instructions en bas
            ctx.font = '28px Arial';
            ctx.fillStyle = '#888';
            const bottomY = height - 200;
            ctx.fillText('À scanner par un professionnel', width / 2, bottomY);
            ctx.fillText('de santé en cas d\'urgence', width / 2, bottomY + 40);
            
            // Informations importantes en bas
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = '#183473';
            const infoY = height - 100;
            let infoText = '';
            if (patientData.value.bloodType) {
              infoText += `Groupe: ${patientData.value.bloodType}  `;
            }
            if (patientData.value.allergies && patientData.value.allergies !== 'Aucune') {
              infoText += `Allergies: ${patientData.value.allergies}  `;
            }
            if (patientData.value.hasPacemaker) {
              infoText += 'Pacemaker  ';
            }
            
            if (infoText) {
              ctx.fillText(infoText.trim(), width / 2, infoY);
            }
            
            // Télécharger l'image
            const dataURL = finalCanvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = 'qr-code-sante-wallpaper.png';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            console.log('QR Code téléchargé avec succès !');
            alert('QR Code fond d\'écran créé avec succès !');
          }).catch(error => {
            console.error('Erreur html2canvas:', error);
            // Fallback vers l'ancienne méthode
            fallbackDownloadSimple(canvas);
          });
        } else {
          // Fallback si le wrapper n'est pas trouvé
          fallbackDownloadSimple(canvas);
        }
      } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        fallbackDownloadSimple(canvas);
      }
    } else {
      console.error('Canvas non trouvé');
      alert('Impossible de trouver le QR Code à télécharger');
    }
  } else {
    console.error('Référence QR Code non trouvée');
    alert('Erreur: référence QR Code non trouvée');
  }
};

const fallbackDownloadSimple = (canvas) => {
  try {
    // Version simple haute résolution avec format rectangulaire
    const finalCanvas = document.createElement('canvas');
    const ctx = finalCanvas.getContext('2d');
    
    const width = 1080;
    const height = 1920;
    finalCanvas.width = width;
    finalCanvas.height = height;
    
    // Fond
    ctx.fillStyle = '#f0f4ff';
    ctx.fillRect(0, 0, width, height);
    
    // QR code centré
    const qrSize = width * 0.6;
    const qrX = (width - qrSize) / 2;
    const qrY = (height - qrSize) / 2;
    
    ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);
    
    // Titre
    ctx.fillStyle = '#183473';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR Code de Santé', width / 2, qrY - 100);
    
    const dataURL = finalCanvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = 'qr-code-sante-wallpaper.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('QR Code téléchargé (version simplifiée)');
  } catch (error) {
    console.error('Erreur fallback:', error);
    alert('Erreur lors du téléchargement: ' + error.message);
  }
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
  margin-bottom: 10px;
}

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
  font-size: 15px; 
  color: #183473;
}

.icon-group p {
  margin-top: 5px;
  font-size: 15px;
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
  margin-top: 20px;
  font-size: 16px;
  transition: background 0.3s;
  margin: 5px;
}

button:hover {
    background: #1a4a8d;
}

.back-button {
  background: #aaa;
  color: #333;
}

.back-button:hover {
  background: #999;
}
</style>
