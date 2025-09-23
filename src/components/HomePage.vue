<template>
  <div class="container">
    <Header />

    <div class="tabs">
      <button @click="activeTab = 'login'" :class="{ active: activeTab === 'login' }">Se connecter</button>
      <button @click="activeTab = 'signup'" :class="{ active: activeTab === 'signup' }">S'enregistrer</button>
    </div>

    <div v-if="activeTab === 'login'" class="form">
      <input type="email" placeholder="E-mail" />
      <input type="password" placeholder="Mot de passe" />
      <button @click="handleLogin">Se connecter</button>
    </div>

    <div v-else class="form">
      <input type="text" placeholder="Nom complet" />
      <input type="text" placeholder="Prenom" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Mot de passe" />

      <button type="button" @click="showProInput = !showProInput">
        Professionnel de santé ?
      </button>

      <div v-if="showProInput" class="collapse">
        <input
          type="password"
          placeholder="Ajoute ton RPPS (11 chiffres)"
          v-model="proNumber"
          @input="proNumber = proNumber.replace(/\D/g, '').slice(0, 11)"
        />
      </div>

      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

      <button @click="handleSignup">S’inscrire</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Header.vue'

const activeTab = ref('login')
const router = useRouter()
const showProInput = ref(false)
const proNumber = ref('')
const errorMessage = ref('')

// Connexion simple
function handleLogin() {
  router.push('/dashboard')
}

// Inscription avec validation RPPS
function handleSignup() {
  errorMessage.value = ''

  if (showProInput.value && proNumber.value.length !== 11) {
    errorMessage.value = 'Le RPPS doit comporter 11 chiffres.'
    return
  }

  // Ici, tu peux ajouter la logique d'inscription (API, stockage, etc.)
  alert('Inscription réussie !')
}
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

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
  border-radius: 10px;
  transition: background 0.3s;
}
button.active {
  background: #183473;
  color: white;
}

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

.collapse {
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>
