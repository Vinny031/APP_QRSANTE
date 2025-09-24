<template>
  <div class="form">
    <h2>Se connecter</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <button @click="handleLogin" :disabled="!isFormValid">Se connecter</button>
    <button type="button" @click="emit('switch-to-signup')">
      Pas encore de compte ? S'inscrire
    </button>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import bcrypt from 'bcryptjs'
import { getUser } from '../db.js'

const emit = defineEmits(['switch-to-signup'])
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const isFormValid = computed(() => email.value.trim() !== '' && password.value.trim() !== '')

async function handleLogin() {
  errorMessage.value = ''
  const user = await getUser(email.value.trim())

  if (!user) {
    errorMessage.value = 'Email ou mot de passe incorrect.'
    return
  }

  const validPassword = await bcrypt.compare(password.value, user.password)
  if (!validPassword) {
    errorMessage.value = 'Email ou mot de passe incorrect.'
    return
  }

  // Stocke uniquement l'email de l'utilisateur, et non tout l'objet
  localStorage.setItem('currentUserEmail', user.email)
  
  // Affiche un message de succès (à remplacer par une modale plus tard)
  alert(`Bienvenue ${user.firstName} !`)
  
  // Redirige vers le tableau de bord
  router.push('/dashboard')
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form h2 {
  color: #183473;
}
.form input {
  display: block;
  width: 95%;
  margin: 10px 0;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
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
.form button:disabled {
  background: #999;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 5px;
}
</style>