import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/editor/regexp',
    name: 'RegexpEditor',
    component: () => import('../views/RegexpEditor.vue'),
  },
  {
    path: '/editor/tex',
    name: 'TexEditor',
    component: () => import('../views/TexEditor.vue'),
  },
  {
    path: '/editor/ipa',
    name: 'IpaEditor',
    component: () => import('../views/IpaEditor.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
