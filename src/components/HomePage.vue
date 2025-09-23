<template>
  <div class="container">
    <Header />

    <!-- Onglets -->
    <div class="tabs">
      <button
        @click="activeTab = 'login'"
        :class="{ active: activeTab === 'login' }"
      >
        Se connecter
      </button>
      <button
        @click="activeTab = 'signup'"
        :class="{ active: activeTab === 'signup' }"
      >
        S'enregistrer
      </button>
    </div>

    <!-- Formulaires -->
    <LoginForm v-if="activeTab === 'login'" />
    <SignUpForm v-else :active-tab="activeTab" @switch-to-login="activeTab = 'login'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './Header.vue'
import LoginForm from './LoginForm.vue'
import SignUpForm from './SignUpForm.vue'

const activeTab = ref('login')
</script>

<style scoped>
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
</style>
