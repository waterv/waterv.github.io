<template>
  <v-app id="v-app" class="safe-top" @touchstart.stop.prevent>
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

    <v-main
      :class="{
        'app-main': 'xsmd'.indexOf($vuetify.breakpoint.name) != -1,
      }"
    >
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
      <template #prepend>
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
      </template>

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
              <v-list-item-subtitle v-if="child.desc">
                {{ $t(`route.${item.name}.${child.name}_`) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider />

        <v-subheader>
          {{
            $t('settings.version', [
              dayjs(version.time).format('YYYY-MM-DD HH:mm:ss'),
            ])
          }}
        </v-subheader>

        <v-sparkline
          :value="diceHistory"
          :color="$root.primaryColor"
          height="100"
          stroke-linecap="round"
          smooth
        >
          <template v-slot:label="item">
            {{ item.value }}
          </template>
        </v-sparkline>
      </v-list>

      <template #append>
        <v-divider />
        <div
          class="px-4 mt-3 overflow-x-auto overflow-y-hidden navigation-operations"
        >
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
              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  @click="diceMenu = false"
                  v-text="$t('_.confirm')"
                />
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-tooltip top :open-on-focus="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="random">
                <v-icon v-text="'mdi-dice-5'" />
              </v-btn>
            </template>
            <span v-text="dice || '-'" />
          </v-tooltip>

          <!-- Cyber Wooden Fish -->
          <v-tooltip top :open-on-focus="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="merit++">
                <v-icon v-text="'mdi-fish'" />
              </v-btn>
            </template>
            <span v-text="`${$t('settings.merit')}${merit}`" />
          </v-tooltip>

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

          <!-- Palette -->
          <v-menu
            v-model="paletteMenu"
            :close-on-content-click="false"
            offset-y
          >
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-palette'" />
              </v-btn>
            </template>
            <v-card>
              <v-color-picker
                v-model="paletteValue"
                :mode="paletteMode"
                show-swatches
                swatches-max-height="100"
              />
              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  @click="setPrimaryColor"
                  v-text="$t('_.confirm')"
                />
                <v-btn-toggle v-model="paletteMode" dense group>
                  <v-btn
                    v-for="mode in paletteModes"
                    :key="mode"
                    :value="mode"
                    v-text="mode"
                  />
                </v-btn-toggle>
              </v-card-actions>
            </v-card>
          </v-menu>

          <!-- Clear LocalStorage -->
          <v-menu v-model="localStorageMenu" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-broom'" />
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                {{ $t('settings.clearLocalStorageHint') }}
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  text
                  @click="clearLocalStorage"
                  v-text="$t('_.confirm')"
                />
              </v-card-actions>
            </v-card>
          </v-menu>

          <!-- VConsole -->
          <v-btn icon @click="toggleVConsole">
            <v-icon v-text="'mdi-console'" :color="vConsole ? 'primary' : ''" />
          </v-btn>
        </div>
      </template>
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
          { icon: 'mdi-calculator', name: 'calc' },
        ],
      },
      {
        name: 'converter',
        children: [{ icon: 'mdi-format-font', name: 'font' }],
      },
      {
        name: 'helper',
        children: [{ icon: 'mdi-bomb', name: 'keeptalking', desc: true }],
      },
      {
        name: 'emulator',
        children: [{ icon: 'mdi-cow', name: '11nimmt' }],
      },
    ],

    diceMin: 1,
    diceMax: 6,
    diceCustom: false,
    diceToggle: 1,
    diceMenu: false,
    dice: undefined,
    diceHistory: [0],

    merit: Number(localStorage.getItem('merit')) || 0,

    locales: [
      { text: '简体中文', value: 'zh-CN' },
      { text: 'English', value: 'en-US' },
    ],

    paletteMenu: false,
    paletteValue: undefined, // mounted
    paletteMode: 'rgba',
    paletteModes: ['rgba', 'hsla', 'hexa'],

    localStorageMenu: false,

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
  watch: {
    merit(v) {
      localStorage.setItem('merit', v)
    },
  },
  mounted() {
    this.randomSlogan()
    this.paletteValue = this.$root.primaryColor + 'FF'
  },
  methods: {
    randomSlogan() {
      this.sloganNo = Math.floor(Math.random() * slogan.length)
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
      })
    },
    random() {
      let min = Number(this.diceMin) || 0
      let max = Number(this.diceMax) || 0
      let value = Math.floor(min + Math.random() * (max - min + 1))
      this.dice = value
      this.diceHistory.push(value)
      if (this.diceHistory.length > 10) this.diceHistory.shift()
      console.log('[dice]', min, max, value)
    },
    increaseMerit() {},
    setPrimaryColor() {
      this.$root.primaryColor = this.paletteValue.slice(0, 7)
      this.paletteMenu = false
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
    clearLocalStorage() {
      localStorage.clear()
      this.$root.locale = 'zh-CN'
      this.$root.selectTheme = 'system'
      this.paletteValue = '#1976D2'
      this.setPrimaryColor()
    },
  },
}
</script>
