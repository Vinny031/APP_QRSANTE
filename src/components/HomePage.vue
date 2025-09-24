<template>
  <div class="container">
    <Header />
    
    <main class="content">
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
      <LoginForm v-if="activeTab === 'login'" />
      <SignUpForm
        v-else
        :active-tab="activeTab"
        @switch-to-login="activeTab = 'login'"
      />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './Header.vue'
import LoginForm from './LoginForm.vue'
import SignUpForm from './SignUpForm.vue'
import Footer from './Footer.vue'

const activeTab = ref('login')
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
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
