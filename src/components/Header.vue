<template>
  <header class="header">
    <img src="/src/assets/favicon.png" alt="logo QR Santé" class="logo" />
    <h1>QR Santé</h1>
  </header>
</template>


<script setup>
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}
.logo {
  width: 60px;
  height: 60px;
}
h1 {
  font-family: 'Nunito', sans-serif;
  color: #183473;
  font-weight: 700;
  font-size: 1.8rem;
}
</style>