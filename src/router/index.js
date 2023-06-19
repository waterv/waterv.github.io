import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppsView from '../views/AppsView.vue'
import DraftBox from '../views/DraftBox.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/apps',
    name: 'AppsView',
    component: AppsView,
  },
  {
    path: '/draftbox',
    name: 'DraftBox',
    component: DraftBox,
  },
  {
    path: '/editor/regexp',
    name: 'RegexpEditor',
    component: () => import('../views/editors/RegexpEditor.vue'),
  },
  {
    path: '/editor/tex',
    name: 'TexEditor',
    component: () => import('../views/editors/TexEditor.vue'),
  },
  {
    path: '/editor/ipa',
    name: 'IpaEditor',
    component: () => import('../views/editors/IpaEditor.vue'),
  },
  {
    path: '/editor/calc',
    name: 'CalcEditor',
    component: () => import('../views/editors/CalcEditor.vue'),
  },
  {
    path: '/converter/font',
    name: 'FontConverter',
    component: () => import('../views/converters/FontConverter.vue'),
  },
  {
    path: '/calculator/splitbill',
    name: 'SplitBillCalc',
    component: () => import('../views/calculators/SplitBillCalc.vue'),
  },
  {
    path: '/helper/keeptalking',
    name: 'KeepTalking',
    component: () => import('../views/helpers/KeepTalking.vue'),
  },
  {
    path: '/helper/arc',
    name: 'ArcHelper',
    component: () => import('../views/helpers/Arc.vue'),
  },
  {
    path: '/emulator/11nimmt',
    name: '11Nimmt',
    component: () => import('../views/emulators/11Nimmt.vue'),
  },
]

const router = new VueRouter({
  routes,
})

export default router
