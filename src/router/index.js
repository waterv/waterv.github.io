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
    path: '/draftbox',
    name: 'DraftBox',
    component: () => import('../views/DraftBox.vue'),
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
  {
    path: '/editor/calc',
    name: 'CalcEditor',
    component: () => import('../views/CalcEditor.vue'),
  },
  {
    path: '/converter/font',
    name: 'FontConverter',
    component: () => import('../views/FontConverter.vue'),
  },
  {
    path: '/calculator/splitbill',
    name: 'SplitBillCalc',
    component: () => import('../views/SplitBillCalc.vue'),
  },
  {
    path: '/helper/keeptalking',
    name: 'KeepTalking',
    component: () => import('../views/KeepTalking.vue'),
  },
  {
    path: '/helper/arc',
    name: 'ArcHelper',
    component: () => import('../views/Arc.vue'),
  },
  {
    path: '/emulator/11nimmt',
    name: '11Nimmt',
    component: () => import('../views/11Nimmt.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
