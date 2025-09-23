<template>
  <div class="form">
    <input type="text" placeholder="Nom complet" v-model="fullName" />
    <input type="text" placeholder="Prénom" v-model="firstName" />
    <input type="email" placeholder="Email" v-model="email" />

    <div class="password-wrapper">
      <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Mot de passe" />
      <button type="button" @click="showPassword = !showPassword" class="toggle-password">
        <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
      </button>
    </div>
    <div class="password-error" v-if="passwordError">{{ passwordError }}</div>

    <button type="button" @click="showProInput = !showProInput">
      Professionnel de santé ?
    </button>

    <div v-if="showProInput" class="collapse">
      <div class="rpps-wrapper">
        <input
          :type="showProPassword ? 'text' : 'password'"
          placeholder="Ajoute ton RPPS (11 chiffres)"
          v-model="proNumber"
          @input="proNumber = proNumber.replace(/\D/g, '').slice(0, 11)"
        />
        <button type="button" @click="showProPassword = !showProPassword" class="toggle-password">
          <i :class="showProPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <button @click="handleSignup">S’inscrire</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const fullName = ref('')
const firstName = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const passwordError = ref('')
const showProInput = ref(false)
const proNumber = ref('')
const showProPassword = ref(false)
const errorMessage = ref('')

// Validation mot de passe
function validatePassword(pw) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/
  return regex.test(pw)
}

watch(password, (newVal) => {
  if (!newVal) passwordError.value = ''
  else if (!validatePassword(newVal)) {
    passwordError.value = 'Minimum 12 caractères, majuscule, minuscule, chiffre et caractère spécial.'
  } else passwordError.value = ''
})

function handleSignup() {
  errorMessage.value = ''
  if (showProInput.value && proNumber.value.length !== 11) {
    errorMessage.value = 'Le RPPS doit comporter 11 chiffres.'
    return
  }
  alert('Inscription réussie !')
}
</script>
