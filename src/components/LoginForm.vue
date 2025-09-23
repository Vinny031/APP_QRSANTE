<template>
  <div class="form">
    <input type="email" placeholder="E-mail" v-model="email" />
    <input type="password" placeholder="Mot de passe" v-model="password" />
    <button @click="handleLogin">Se connecter</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function handleLogin() {
  //Ajouter la logique d'authentification
  router.push('/dashboard')
}
</script>
