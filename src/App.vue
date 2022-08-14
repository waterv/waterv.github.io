<template>
  <v-app id="v-app" class="safe-top padding-safe-bottom">
    <v-app-bar
      class="app-bar padding-safe-left"
      color="primary"
      clipped-left
      app
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-main class="padding-safe-left padding-safe-right">
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-fab-transition>
      <v-btn
        v-show="vConsole"
        color="primary"
        v-bind="fabButton"
        @click="vConsole.show()"
      >
        <v-icon v-text="'mdi-console'" />
      </v-btn>
    </v-fab-transition>

    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      class="no-select padding-safe-left"
    >
      <!-- Random Slogan -->
      <v-list-item class="random-slogan" three-line @click="randomSlogan">
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <v-icon v-text="'mdi-wrench'" />
            {{ $t('app.name') }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ slogan[sloganNo] }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <!-- Navigation -->
      <v-list nav dense>
        <template v-for="item in items">
          <v-list-item
            v-if="item.icon"
            color="primary"
            :key="item.name"
            :to="item.to || `/${item.name}`"
            replace
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(`route.${item.name}`) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-subheader v-else :key="item.name">
            {{ $t(`route.${item.name}._`) }}
          </v-subheader>

          <v-list-item
            v-for="child in item.children"
            color="primary"
            :key="child.name"
            :to="child.to || `/${item.name}/${child.name}`"
            replace
          >
            <v-list-item-icon>
              <v-icon v-text="child.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ $t(`route.${item.name}.${child.name}`) }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider class="mt-auto" />

        <v-subheader>
          {{
            $t('settings.version', [
              dayjs(version.time).format('YYYY-MM-DD HH:mm:ss'),
            ])
          }}
        </v-subheader>

        <!-- Locale Settings -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon v-text="'mdi-translate'" />
            </v-btn>
          </template>
          <v-list nav dense>
            <v-list-item
              v-for="lang in locales"
              :key="lang.text"
              :input-value="$root.locale == lang.value"
              color="primary"
              @click="$root.locale = lang.value"
            >
              <v-list-item-title v-text="lang.text" />
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Theme Settings -->
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon v-text="themeIcon" />
            </v-btn>
          </template>
          <v-list nav dense>
            <v-list-item
              v-for="theme in themes"
              :key="theme.text"
              :input-value="$root.selectTheme == theme.value"
              color="primary"
              @click="$root.selectTheme = theme.value"
            >
              <v-list-item-title v-text="theme.text" />
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- VConsole -->
        <v-btn icon @click="toggleVConsole">
          <v-icon v-text="'mdi-console'" :color="vConsole ? 'primary' : ''" />
        </v-btn>

        <!-- Dice -->
        <v-menu v-model="diceMenu" offset-y :close-on-content-click="false">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon v-text="diceIcon" />
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-btn-toggle
                v-model="diceToggle"
                class="mb-8"
                mandatory
                rounded
                dense
                borderless
              >
                <v-btn
                  v-for="(v, i) in [4, 6, 10, 12, 20]"
                  :key="v"
                  @click="diceSelect(v, i)"
                >
                  <v-icon v-text="`mdi-dice-d${v}`" />
                </v-btn>
                <v-btn @click="diceSelect(0)">
                  <v-icon v-text="'mdi-help-circle'" />
                </v-btn>
              </v-btn-toggle>
              <v-text-field
                v-model="diceMin"
                :disabled="!diceCustom"
                :label="$t('dice.min')"
                type="number"
                dense
              />
              <v-text-field
                v-model="diceMax"
                :disabled="!diceCustom"
                :label="$t('dice.max')"
                type="number"
                dense
              />
            </v-card-text>
          </v-card>
        </v-menu>
        <v-btn text @click="random">{{ dice }}</v-btn>
      </v-list>

      <div id="placeholder" style="width: 100%; height: 96px" />
    </v-navigation-drawer>

    <v-snackbar v-model="$root.copyError" class="safe-bottom">
      {{ $t('clipboard.error') }}
    </v-snackbar>

    <v-snackbar v-model="$root.copySuccess" class="safe-bottom">
      {{ $t('clipboard.success') }}
    </v-snackbar>
  </v-app>
</template>

<script>
import VConsole from 'vconsole'
let slogan = require('@/data/slogan.json')

export default {
  name: 'App',
  data: () => ({
    dayjs: require('dayjs'),
    version: require('@/data/time.json'),
    drawer: false,
    slogan,
    sloganNo: 0,
    items: [
      { icon: 'mdi-home', name: 'home', to: '/' },
      {
        name: 'editor',
        children: [
          { icon: 'mdi-regex', name: 'regexp' },
          { icon: 'mdi-calculator-variant', name: 'tex' },
          { icon: 'mdi-code-array', name: 'ipa' },
        ],
      },
    ],
    locales: [
      { text: '简体中文', value: 'zh-CN' },
      { text: 'English', value: 'en-US' },
    ],
    diceMin: 1,
    diceMax: 6,
    diceCustom: false,
    diceToggle: 1,
    diceMenu: false,
    dice: Math.floor(Math.random() * 6) + 1,
    vConsole: undefined,
    fabButton: {
      fab: true,
      dark: true,
      fixed: true,
      bottom: true,
      right: true,
      id: 'fab',
      class: 'ma-4',
    },
  }),
  computed: {
    title() {
      if (this.$route.fullPath == '/') return this.$t('app.name')
      return this.$t('route' + this.$route.fullPath.replaceAll('/', '.'))
    },
    themes() {
      return ['system', 'light', 'dark'].map(value => ({
        text: this.$t(`settings.themes.${value}`),
        value,
      }))
    },
    themeIcon() {
      switch (this.$root.selectTheme) {
        case 'system':
          return 'mdi-brightness-auto'
        case 'light':
          return 'mdi-white-balance-sunny'
        default:
          return 'mdi-weather-night'
      }
    },
    diceIcon() {
      if (this.diceCustom) return 'mdi-help-circle'
      return `mdi-dice-d${this.diceMax}`
    },
  },
  mounted() {
    this.randomSlogan()
  },
  methods: {
    randomSlogan() {
      this.sloganNo = Math.floor(Math.random() * slogan.length)
    },
    toggleVConsole() {
      if (this.vConsole) {
        this.vConsole.destroy()
        this.vConsole = undefined
      } else {
        this.vConsole = new VConsole({
          theme: this.$root.theme ? 'dark' : 'light',
        })
        this.vConsole.hideSwitch()
      }
    },
    diceSelect(v, i) {
      if (!v)
        return Object.assign(this, {
          diceCustom: true,
          diceToggle: 5,
        })
      return Object.assign(this, {
        diceMin: 1,
        diceMax: v,
        diceCustom: false,
        diceToggle: i,
        diceMenu: false,
      })
    },
    random() {
      let min = Number(this.diceMin) || 0
      let max = Number(this.diceMax) || 0
      this.dice = Math.floor(min + Math.random() * (max - min + 1))
      console.log('[dice]', min, max, this.dice)
    },
  },
}
</script>

<style>
body,
body .v-application {
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
    Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui,
    'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}
</style>
