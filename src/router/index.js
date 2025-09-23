import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import Dashboard from '../components/Dashboard.vue'
import Form from '../components/Form.vue'
import QrCodePage from '../components/QrCodePage.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: Dashboard },
  { path: '/form', component: Form },
  { path: '/qrcode', component: QrCodePage}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
