import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueClipboard from 'vue-clipboard2'

import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false
Vue.use(VueClipboard)

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App),
  data: () => ({
    systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
    selectTheme: localStorage.getItem('theme') || 'system',
    primaryColor: localStorage.getItem('primary') || '#1976D2',
  }),
  computed: {
    theme() {
      return this.selectTheme == 'system'
        ? this.systemTheme
        : this.selectTheme == 'dark'
    },
  },
  watch: {
    systemTheme() {
      this.refreshTheme()
    },
    selectTheme(n) {
      this.refreshTheme()
      localStorage.setItem('theme', n)
    },
    primaryColor(n) {
      this.refreshTheme()
      localStorage.setItem('primary', n)
    },
  },
  mounted() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        this.systemTheme = event.matches
        this.refreshTheme()
      })
    this.refreshTheme()
  },
  methods: {
    refreshTheme() {
      this.$vuetify.theme.dark = this.theme
      this.$vuetify.theme.themes.light.primary =
        this.$vuetify.theme.themes.dark.primary = this.primaryColor
    },
  },
}).$mount('#app')
