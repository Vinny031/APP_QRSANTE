import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';

// Remplacez faHeartPulse par faHeartCircleBolt
import { faDroplet, faAllergies, faHeartCircleBolt } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Ajoutez la nouvelle icône à la bibliothèque
library.add(faDroplet, faAllergies, faHeartCircleBolt);

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router);
app.mount('#app');