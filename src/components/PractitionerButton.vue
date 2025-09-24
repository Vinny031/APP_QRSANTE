<template>
  <button :disabled="!hasProNumber">
    <slot>Scanner un QR code</slot>
  </button>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  proNumber: {
    type: String,
    default: null
  }
});

// Vérifie que proNumber existe et n'est pas vide
const hasProNumber = computed(() => {
  const result = !!props.proNumber?.trim();
  return result;
});
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
