import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import VueClipboard from 'vue-clipboard2'
import { Dexie } from 'dexie'
import axios from 'axios'

import '@mdi/font/css/materialdesignicons.css'
import 'katex/dist/katex.min.css'

Vue.config.productionTip = false
Vue.use(VueClipboard)
Vue.prototype.$day = require('dayjs')
Vue.prototype.$axios = axios
Vue.prototype.$range = cnt => new Array(cnt).fill(0).map((v, i) => i)
Vue.prototype.$ls = {
  data: (type, key, defaultValue) => {
    switch (type) {
      case 'number':
        return Number(localStorage?.getItem(key) ?? defaultValue)
      case 'boolean':
        if (defaultValue) return localStorage?.getItem(key) != 'false'
        else return localStorage?.getItem(key) == 'true'
      case 'object':
        return JSON.parse(localStorage?.getItem(key) ?? defaultValue)
      default:
        return localStorage?.getItem(key) ?? defaultValue
    }
  },
  watch: (type, key, value) => {
    switch (type) {
      case 'object':
        return localStorage?.setItem(key, JSON.stringify(value))
      default:
        return localStorage?.setItem(key, value)
    }
  },
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
    selectTheme: that.$ls.data('string', 'theme', 'system'),
    primaryColor: that.$ls.data('string', 'primary', '#1976D2'),

    sloganApiName: that.$ls.data('string', 'sloganApiName', ''),
    sloganApiUrl: that.$ls.data('string', 'sloganApiUrl', ''),
    sloganApiFormat: that.$ls.data('string', 'sloganApiFormat', ''),

    copyError: false,
    copySuccess: false,

    editorValue: '',
    currentDraft: 0,
  }),
  computed: {
    sortedApps() {
      return this.apps
        .filter(
          cate =>
            cate.name === '' ||
            this.favorApps.filter(v => v.startsWith(`/${cate.name}`)).length > 0
        )
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
      this.newApps = this.newApps.filter(v => v != to.path)
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
      this.$ls.watch('string', 'locale', v)
    },
    systemTheme() {
      this.refreshTheme()
    },
    selectTheme(v) {
      this.refreshTheme()
      this.$ls.watch('string', 'theme', v)
    },
    primaryColor(v) {
      this.refreshTheme()
      this.$ls.watch('string', 'primary', v)
    },

    sloganApiName(v) {
      this.$ls.watch('string', 'sloganApiName', v)
    },
    sloganApiUrl(v) {
      this.$ls.watch('string', 'sloganApiUrl', v)
    },
    sloganApiFormat(v) {
      this.$ls.watch('string', 'sloganApiFormat', v)
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
