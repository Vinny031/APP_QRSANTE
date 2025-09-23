<template>
  <div class="container">
    <Header />
    <div class="tabs">
      <button @click="activeTab = 'login'" :class="{ active: activeTab === 'login' }">Se connecter</button>
      <button @click="activeTab = 'signup'" :class="{ active: activeTab === 'signup' }">S'enregistrer</button>
    </div>

    <LoginForm v-if="activeTab === 'login'" />
    <SignUpForm v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './Header.vue'
import LoginForm from './LoginForm.vue'
import SignUpForm from './SignUpForm.vue'

const activeTab = ref('login')
</script>

<style>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  text-align: center;
  font-family: Arial, sans-serif;
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
  width: 15%;
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

.password-error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
}
</style>

