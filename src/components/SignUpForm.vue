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
    <div v-if="passwordError" class="error-message">{{ passwordError }}</div>

    <button type="button" @click="showProInput = !showProInput">
      Professionnel de santé ?
    </button>

    <div v-if="showProInput" class="collapse">
      <div class="rpps-wrapper">
        <input
          v-model="proNumber"
          :type="showProPassword ? 'text' : 'password'"
          placeholder="Ajoute ton RPPS"
          @input="proNumber = proNumber.replace(/\D/g, '').slice(0, 11)"
        />
        <button type="button" @click="showProPassword = !showProPassword" class="toggle-password">
          <i :class="showProPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>
      </div>
      <div
        v-if="showProInput && proNumber && proNumber.length !== 11"
        class="error-message"
      >
        Le RPPS doit contenir 11 chiffres.
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <button @click="handleSignup" :disabled="!isFormValid">S’inscrire</button>
  </div>
</template>

<script setup>
import { ref, watch, computed, defineEmits } from 'vue'
import bcrypt from 'bcryptjs'
import { saveUser, getUser } from '../db.js'

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
  const rp = !showProInput.value || proNumber.value.length === 11
  return (
    fullName.value.trim().length > 1 &&
    firstName.value.trim().length > 1 &&
    validateEmail(email.value) &&
    validatePassword(password.value) &&
    rp
  )
})

// Vérification RPPS via l'API eSanté et ajout d'un message générique si échec pour masquer la raison exacte
async function validateRPPS(rpps, fullNameInput, firstNameInput) {
  try {
    const response = await fetch(
      `https://gateway.api.esante.gouv.fr/fhir/v2/Practitioner?identifier=${rpps}`,
      {
        method: 'GET',
        headers: {
          'ESANTE-API-KEY': '4e2accac-2801-40c0-ab1e-a3e780bdca22',
          'Accept': 'application/fhir+json',
        },
      }
    )

    if (!response.ok) throw new Error('Erreur API')

    const data = await response.json()

    // Si RPPS inexistant ou nom/prénom ne correspond pas → message générique
    if (!data.total || data.total === 0) return { valid: false }

    const practitioner = data.entry[0].resource
    const apiLastName = practitioner.name[0].family.toLowerCase()
    const apiFirstName = practitioner.name[0].given[0].toLowerCase()

    if (
      apiLastName !== fullNameInput.trim().toLowerCase() ||
      apiFirstName !== firstNameInput.trim().toLowerCase()
    ) {
      return { valid: false }
    }

    return { valid: true }
  } catch (error) {
    console.error(error)
    return { valid: false }
  }
}

// Gestion de l'inscription
async function handleSignup() {
  errorMessage.value = ''

  if (showProInput.value) {
    const rppsResult = await validateRPPS(
      proNumber.value,
      fullName.value,
      firstName.value
    )
    if (!rppsResult.valid) {
      errorMessage.value = 'Le RPPS est invalide ou ne correspond pas à vos informations.'
      return
    }
  }

  const existingUser = await getUser(email.value.trim())
  if (existingUser) {
    errorMessage.value = 'Cet email est déjà utilisé.'
    return
  }

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
  margin: 20px auto;
  width: 100%;
  max-width: 400px;
  padding: 0 10px;
  box-sizing: border-box;
}

.form input,
.form button {
  width: 100%;
  min-height: 40px;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  box-sizing: border-box;
}

.password-wrapper,
.rpps-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  width: 100%;
  min-height: 40px;
  box-sizing: border-box;
}

.password-wrapper input,
.rpps-wrapper input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0 8px;
  font-size: 14px;
  box-sizing: border-box;
  border-radius: 0;
}

.password-wrapper .toggle-password,
.rpps-wrapper .toggle-password {
  width: 40px;
  height: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.collapse {
  margin-top: 10px;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  width: 100%;
}

.form button {
  background: #183473;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
  transition: background 0.3s ease;
}

.form button:disabled {
  background: #999;
  cursor: not-allowed;
}

@media (max-width: 360px) {
  .form input,
  .form button {
    padding: 8px;
    font-size: 13px;
  }

  .password-wrapper input,
  .rpps-wrapper input {
    font-size: 13px;
  }
}

</style>
