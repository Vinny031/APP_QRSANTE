<template>
  <div class="container">
    <!-- Import du header -->
    <Header />

    <!-- Tabs -->
    <div class="tabs">
      <button @click="activeTab = 'login'" :class="{ active: activeTab === 'login' }">Login</button>
      <button @click="activeTab = 'signup'" :class="{ active: activeTab === 'signup' }">Sign Up</button>
    </div>

    <!-- Forms -->
    <div v-if="activeTab === 'login'" class="form">
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button @click="handleLogin">Se connecter</button>
    </div>

    <div v-else class="form">
      <input type="text" placeholder="Nom complet" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Mot de passe" />
      <button>S’inscrire</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const activeTab = ref('login')
const router = useRouter()

function handleLogin() {
  router.push('/dashboard') // redirection après login
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
button {
  padding: 10px;
  border: none;
  cursor: pointer;
  background: #ddd;
  border-radius: 10px; /* arrondi des angles */
  transition: background 0.3s;
}
button.active {
  background: #183473;
  color: white;
}

/* Form */
.form input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
.form button {
  width: 100%;
  padding: 10px;
  background: #183473;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  margin-top: 10px;
}
</style>
