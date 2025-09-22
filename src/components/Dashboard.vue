<template>
  <div class="dashboard">
    <Header />
    <h2>Bienvenue sur votre espace QR Santé</h2>
    <p>Vous êtes maintenant connecté !</p>
  </div>
</template>

<script setup>
import Header from './Header.vue'
</script>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
</style>
