<template>
  <div class="form">
    <input v-model="fullName" type="text" placeholder="Nom complet" />
    <input v-model="firstName" type="text" placeholder="Prénom" />
    <input v-model="email" type="email" placeholder="Email" />

    <div class="password-wrapper">
      <input
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        placeholder="Mot de passe"
      />
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
          v-model="proNumber"
          :type="showProPassword ? 'text' : 'password'"
          placeholder="Ajoute ton RPPS (11 chiffres)"
          @input="proNumber = proNumber.replace(/\D/g, '').slice(0, 11)"
        />
        <button type="button" @click="showProPassword = !showProPassword" class="toggle-password">
          <i :class="showProPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

    <button @click="handleSignup" :disabled="!isFormValid">S’inscrire</button>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineEmits } from 'vue'
import bcrypt from 'bcryptjs'
import { saveUser, getUser } from '../db.js' // Ajuste le chemin selon ton projet

const emit = defineEmits(['switch-to-login'])

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

// Validation password
function validatePassword(pw) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/
  return regex.test(pw)
}

watch(password, (newVal) => {
  if (!newVal) passwordError.value = ''
  else if (!validatePassword(newVal)) {
    passwordError.value =
      'Minimum 12 caractères, avec majuscule, minuscule, chiffre et caractères spéciaux.'
  } else passwordError.value = ''
})

// Validation email simple
function validateEmail(mail) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(mail)
}

const isFormValid = computed(() => {
  return (
    fullName.value.trim().length > 1 &&
    firstName.value.trim().length > 1 &&
    validateEmail(email.value) &&
    validatePassword(password.value) &&
    (!showProInput.value || proNumber.value.length === 11)
  )
})

async function handleSignup() {
  errorMessage.value = ''

  const existingUser = await getUser(email.value.trim())
  if (existingUser) {
    errorMessage.value = 'Cet email est déjà utilisé.'
    return
  }

  // 🔹 Hashage du mot de passe avant sauvegarde
  const hashedPassword = await bcrypt.hash(password.value, 10)

  const user = {
    fullName: fullName.value,
    firstName: firstName.value,
    email: email.value,
    password: hashedPassword,
    proNumber: showProInput.value ? proNumber.value : null,
    createdAt: new Date().toISOString(),
  }

  await saveUser(user)

  alert('Inscription réussie !')
  emit('switch-to-login')

  // 🔹 Réinitialiser le formulaire (optionnel si tu veux conserver les valeurs)
  fullName.value = ''
  firstName.value = ''
  email.value = ''
  password.value = ''
  showPassword.value = false
  showProInput.value = false
  proNumber.value = ''
  showProPassword.value = false
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
.form button:disabled {
  background: #999;
  cursor: not-allowed;
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
}
.password-error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
}
</style>
