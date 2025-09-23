<template>
  <div class="form">
    <input v-model="email" type="email" placeholder="E-mail" />
    <input
      v-model="password"
      :type="showPassword ? 'text' : 'password'"
      placeholder="Mot de passe"
    />
    <button type="button" @click="showPassword = !showPassword" class="toggle-password">
      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
    </button>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <button @click="handleLogin">Se connecter</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const router = useRouter()

function handleLogin() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.email === email.value && u.password === password.value)

  if (!user) {
    errorMessage.value = 'Email ou mot de passe incorrect.'
    return
  }

  alert(`Bienvenue ${user.firstName || ''} !`)
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
.toggle-password {
  background: none;
  border: none;
  cursor: pointer;
  margin: 5px 0;
}
.error {
  color: red;
  margin-top: 5px;
}
</style>
