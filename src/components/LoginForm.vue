<template>
  <div class="form">
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <button @click="handleLogin" :disabled="!isFormValid">Se connecter</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import bcrypt from 'bcryptjs'
import { getUser } from '../db.js'

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

  // 🔹 Vérification hash
  const validPassword = await bcrypt.compare(password.value, user.password)
  if (!validPassword) {
    errorMessage.value = 'Email ou mot de passe incorrect.'
    return
  }

  localStorage.setItem('currentUser', JSON.stringify(user))
  alert(`Bienvenue ${user.firstName} !`)
  router.push('/dashboard')
}
</script>


<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form input {
  display: block;
  width: 95%;
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
.form button:disabled {
  background: #999;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-top: 5px;
}
</style>
