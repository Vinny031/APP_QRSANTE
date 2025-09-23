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
      <div class="password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Mot de passe"
        />
        <button type="button" @click="showPassword = !showPassword" class="toggle-password">
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>

      <button type="button" @click="showProInput = !showProInput">
        Professionnel de santé ?
      </button>

      <div v-if="showProInput" class="collapse">
        <div class="rpps-wrapper">
          <input
            :type="showProPassword ? 'text' : 'password'"
            placeholder="Ajoute ton RPPS (11 chiffres)"
            v-model="proNumber"
            @input="proNumber = proNumber.replace(/\D/g, '').slice(0, 11)"
          />
          <button type="button" @click="showProPassword = !showProPassword" class="toggle-password">
            <i :class="showProPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
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

const password = ref('')
const showPassword = ref(false)
const showProPassword = ref(false)

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

  // Ici, ajouter la logique d'inscription (API, stockage, etc.)
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

.password-wrapper,
.rpps-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
}

.password-wrapper input,
.rpps-wrapper input {
  width: 80%;
  padding: 0 8px;
  border: none;
  outline: none;
  border-radius: 0;
}

.password-wrapper .toggle-password,
.rpps-wrapper .toggle-password {
  width: 20%;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}
</style>
