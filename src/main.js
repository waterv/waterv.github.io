import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueClipboard from 'vue-clipboard2'
import { Dexie } from 'dexie'

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
  data: that => ({
    db: undefined,
    apps: require('@/data/apps.json'),
    widgets: require('@/data/widgets.json'),
    currentApps: {},
    newApps: [],
    favorApps: [],
    unfavorWidgets: [],

    locale: that.$i18n.locale,
    systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches,
    selectTheme: localStorage.getItem('theme') || 'system',
    primaryColor: localStorage.getItem('primary') || '#1976D2',

    copyError: false,
    copySuccess: false,

    editorValue: '',
    currentDraft: 0,
  }),
  computed: {
    sortedApps() {
      return this.apps
        .filter(cate => this.hasCateFavorApp(cate.name))
        .map(cate => ({
          ...cate,
          apps: cate.apps
            .filter(app => this.isAppFavor(app.fullPath))
            .map(app => ({
              ...app,
              order: this.favorApps.indexOf(app.fullPath),
            }))
            .sort((a, b) => b.order - a.order),
        }))
    },
    theme() {
      return this.selectTheme == 'system'
        ? this.systemTheme
        : this.selectTheme == 'dark'
    },
  },
  watch: {
    $route(to) {
      this.filterNewApp(to.path)
      console.log('[route]', to.path)
    },
    newApps(v) {
      this.db.data.put({ key: 'newApps', value: v })
    },
    favorApps(v) {
      this.db.data.put({ key: 'favorApps', value: v })
    },
    unfavorWidgets(v) {
      this.db.data.put({ key: 'unfavorWidgets', value: v })
    },
    locale(v) {
      this.$i18n.locale = v
      localStorage.setItem('locale', v)
    },
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
    this.initDB()

    let allApps = {}
    for (let i in this.apps) {
      let cate = this.apps[i]
      for (let j in cate.apps) {
        let app = cate.apps[j]
        app.fullPath = `/${cate.name}/${app.path}`.replace('//', '/')
        allApps[app.fullPath] = {
          version: app.version,
        }
      }
    }

    this.db.data
      .bulkGet(['currentApps', 'newApps', 'favorApps', 'unfavorWidgets'])
      .then(res => {
        this.favorApps = res[2]?.value ?? []
        this.unfavorWidgets = res[3]?.value ?? []
        this.db.data.put({ key: 'currentApps', value: allApps })

        if (res[0] === undefined) return
        let currentApps = res[0].value
        let newApps = res[1]?.value ?? []

        for (let fullPath in allApps)
          if (
            currentApps[fullPath] === undefined ||
            currentApps[fullPath].version < allApps[fullPath].version
          )
            newApps.push(fullPath)

        console.log(allApps, currentApps, newApps)
        this.newApps = newApps.filter(v => v != this.$route.fullPath)
      })

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        this.systemTheme = event.matches
        this.refreshTheme()
      })
    this.refreshTheme()
  },
  methods: {
    initDB() {
      this.db = new Dexie('mysbery')
      this.db.version(1).stores({
        drafts: '++id, path',
        data: 'key',
      })
    },
    filterNewApp(fullPath) {
      this.newApps = this.newApps.filter(v => v != fullPath)
    },
    isAppNew(fullPath) {
      if (fullPath == '/apps') return this.newApps.length > 0
      return this.newApps.includes(fullPath)
    },
    isAppFavor(fullPath) {
      return (
        fullPath?.lastIndexOf('/') == 0 ||
        this.favorApps.indexOf(fullPath) != -1
      )
    },
    hasCateFavorApp(cate) {
      return (
        cate === '' ||
        this.favorApps.filter(v => v.startsWith(`/${cate}`)).length > 0
      )
    },
    toggleAppFavor(fullPath) {
      if (!this.favorApps.includes(fullPath)) this.favorApps.push(fullPath)
      else this.favorApps = this.favorApps.filter(v => v != fullPath)
    },
    isWidgetFavor(name) {
      return this.unfavorWidgets.indexOf(name) == -1
    },
    toggleWidgetFavor(name) {
      if (!this.unfavorWidgets.includes(name)) this.unfavorWidgets.push(name)
      else this.unfavorWidgets = this.unfavorWidgets.filter(v => v != name)
    },
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
    getTitle(path) {
      if (!path) return ''
      if (path == '/') return this.$t('route.home')
      return this.$t('route' + path.replaceAll('/', '.'))
    },
  },
}).$mount('#app')
