<template>
  <button :disabled="!hasProNumber" @click="openScanner">
    <slot>Scanner un QR code</slot>
  </button>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  proNumber: {
    type: String,
    default: null
  }
});

const router = useRouter();

// Vérification de l'existance d'un proNumber et non vide
const hasProNumber = computed(() => {
  const result = !!props.proNumber?.trim();
  return result;
});

// Redirection vers Scanner.vue
const openScanner = () => {
  if (hasProNumber.value) {
    router.push('/scanner');
  }
};
</script>

<style scoped>
button {
  width: 100%;
  padding: 12px;
  border: none;
  cursor: pointer;
  background: #183473;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  transition: background 0.3s;
}

button:hover {
  background: #1a4a8d;
}

button:disabled {
    background: grey;
    cursor: not-allowed;
}
</style>
