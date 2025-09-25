<template>
  <div class="form">
    <h2>Se connecter</h2>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
  <a href="/" class="forgot-password-link">
    Mot de passe oublié ?
  </a>
  <button @click="handleLogin" :disabled="!isFormValid">Se connecter</button>
  </div>

</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import bcrypt from 'bcryptjs'
import { getUser } from '../db.js'
import Footer from './Footer.vue';

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

  localStorage.setItem('currentUserEmail', user.email)
  alert(`Bienvenue ${user.firstName} !`)
  router.push('/dashboard')
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
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

.forgot-password-link {
  color: #183473;
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
}
.forgot-password-link:hover {
  color: #1a4a8d;
}
</style>