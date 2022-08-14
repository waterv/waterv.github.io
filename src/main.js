import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueClipboard from 'vue-clipboard2'

import '@mdi/font/css/materialdesignicons.css'
import 'katex/dist/katex.min.css'

Vue.config.productionTip = false
Vue.use(VueClipboard)
Vue.prototype.$range = cnt => {
  let arr = []
  for (let i = 0; i < cnt; i++) arr.push(i)
  return arr
}

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App),
  data: () => ({
    systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
    selectTheme: localStorage.getItem('theme') || 'system',
    primaryColor: localStorage.getItem('primary') || '#1976D2',
    copyError: false,
    copySuccess: false,
  }),
  computed: {
    theme() {
      return this.selectTheme == 'system'
        ? this.systemTheme
        : this.selectTheme == 'dark'
    },
    locale: {
      get() {
        return this.$i18n.locale
      },
      set(v) {
        this.$i18n.locale = v
        localStorage.setItem('locale', v)
      },
    },
  },
  watch: {
    systemTheme() {
      this.refreshTheme()
    },
    selectTheme(v) {
      this.refreshTheme()
      localStorage.setItem('theme', v)
    },
    primaryColor(v) {
      this.refreshTheme()
      localStorage.setItem('primary', v)
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
      document.body.style.backgroundColor =
        this.$vuetify.theme.themes.light.primary =
        this.$vuetify.theme.themes.dark.primary =
          this.primaryColor
    },
    doCopy(text) {
      console.log('[clipboard]', text)
      this.$copyText(text)
        .then(() => {
          this.copySuccess = true
        })
        .catch(() => {
          this.copyError = true
        })
    },
  },
}).$mount('#app')
