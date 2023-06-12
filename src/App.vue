<template>
  <v-app id="v-app" class="safe-top" @touchstart.stop.prevent>
    <v-app-bar
      class="app-bar padding-safe-left"
      color="primary"
      clipped-left
      app
      dark
    >
      <v-app-bar-nav-icon @click="drawer = !drawer">
        <v-badge :value="$root.isAppNew('/apps')" color="white" dot>
          <v-icon v-text="'mdi-menu'" />
        </v-badge>
      </v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$root.toggleAppFavor($route.fullPath)">
        <v-icon
          v-if="$route.fullPath.lastIndexOf('/') != 0"
          v-text="
            $root.isAppFavor($route.fullPath) ? 'mdi-star' : 'mdi-star-outline'
          "
        />
      </v-btn>
    </v-app-bar>

    <v-main
      :class="{
        'app-main': ['xs', 'sm', 'md'].includes($vuetify.breakpoint.name),
      }"
    >
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-fab-transition>
      <v-btn v-show="vConsole" v-bind="fabButton" @click="vConsole.show()">
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
        <v-list-item
          class="random-slogan"
          :class="{
            'random-slogan-disabled': !$root.isWidgetFavor('randomSlogan'),
          }"
          @click="randomSlogan"
        >
          <v-list-item-content class="random-slogan-content">
            <v-list-item-title class="text-h6 random-slogan-title">
              <v-icon v-text="'mdi-wrench'" />
              {{ sloganTitle }}
            </v-list-item-title>
            <v-list-item-subtitle class="random-slogan-subtitle">
              {{ slogan[sloganNo] }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
      </template>

      <!-- Navigation -->
      <v-list nav dense>
        <template v-for="cate in $root.sortedApps">
          <v-subheader v-if="cate.name != ''" :key="cate.name">
            {{ $t(`route.${cate.name}._`) }}
          </v-subheader>

          <template v-for="app in cate.apps">
            <v-list-item
              color="primary"
              :key="app.fullPath"
              :to="app.fullPath"
              replace
            >
              <v-list-item-icon>
                <v-badge :value="$root.isAppNew(app.fullPath)" dot overlap>
                  <v-icon v-text="app.icon" />
                </v-badge>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $root.getTitle(app.fullPath) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
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
          v-show="$root.isWidgetFavor('dice')"
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
              <v-btn
                v-show="$root.isWidgetFavor('dice')"
                icon
                v-bind="attrs"
                v-on="on"
              >
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
                <v-number-field
                  v-model="diceMin"
                  :label="$t('_.min')"
                  :disabled="!diceCustom"
                  dense
                />
                <v-number-field
                  v-model="diceMax"
                  :label="$t('_.max')"
                  :disabled="!diceCustom"
                  dense
                  hide-details
                />
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text @click="diceMenu = false">
                  {{ $t('_.confirm') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>

          <v-tooltip top :open-on-focus="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-show="$root.isWidgetFavor('dice')"
                icon
                v-bind="attrs"
                v-on="on"
                @click="random"
              >
                <v-icon v-text="'mdi-dice-5'" />
              </v-btn>
            </template>
            <span v-text="dice ?? '-'" />
          </v-tooltip>

          <!-- Cyber Wooden Fish -->
          <v-tooltip top :open-on-focus="false">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-show="$root.isWidgetFavor('woodenFish')"
                icon
                v-bind="attrs"
                v-on="on"
                @click="addMerit"
              >
                <v-icon v-text="'mdi-fish'" />
              </v-btn>
            </template>
            {{ $t('settings.merit') }}{{ merit }}<br />
            {{ $t('settings.cps') }}{{ cps.toFixed(1) }}
          </v-tooltip>

          <!-- Locale Settings -->
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-show="$root.isWidgetFavor('locale')"
                icon
                v-bind="attrs"
                v-on="on"
              >
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
              <v-btn
                v-show="$root.isWidgetFavor('theme')"
                icon
                v-bind="attrs"
                v-on="on"
              >
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
              <v-btn
                v-show="$root.isWidgetFavor('palette')"
                icon
                v-bind="attrs"
                v-on="on"
              >
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

          <!-- Clear Web Storage -->
          <v-menu v-model="localStorageMenu" offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                v-show="$root.isWidgetFavor('clear')"
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon v-text="'mdi-broom'" />
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-list>
                  <v-list-item @click="clearLocalStorage">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t('settings.clear', ['localStorage']) }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ $t('settings.clearLocalStorageHint') }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="clearIndexedDB">
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t('settings.clear', ['IndexedDB']) }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ $t('settings.clearIndexedDBHint') }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-menu>

          <!-- VConsole -->
          <v-btn
            v-show="$root.isWidgetFavor('vconsole')"
            icon
            @click="toggleVConsole"
          >
            <v-icon v-text="'mdi-console'" :color="vConsole ? 'primary' : ''" />
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-snackbar v-model="sloganSnackbar" class="safe-bottom">
      {{
        $t(
          `settings.sloganSnackbar.${sloganSnackbarNo}`,
          sloganData[sloganSnackbarNo]
        )
      }}
    </v-snackbar>

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
import VNumberField from '@/components/VNumberField.vue'
let slogan = require('@/data/slogan.json')

export default {
  name: 'App',
  components: { VNumberField },
  data: () => ({
    dayjs: require('dayjs'),
    version: require('@/data/time.json'),

    drawer: false,

    slogan,
    sloganNo: 0,
    sloganCount: -1,
    sloganData: { 242: [0], 448: [0] },
    sloganSnackbar: false,
    sloganSnackbarNo: -1,

    diceMin: 1,
    diceMax: 6,
    diceCustom: false,
    diceToggle: 1,
    diceMenu: false,
    dice: undefined,
    diceHistory: [0],

    merit: Number(localStorage.getItem('merit')) || 0,
    clicks: [],

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
      color: 'primary',
    },
  }),
  computed: {
    sloganTitle() {
      switch (this.sloganNo) {
        default:
          return this.$t('app.name')
        // #458 "你的电脑遇到问题，需要重新启动。我们只收集某些错误信息，然后你可以重新启动。"
        case 458:
          return ':('
      }
    },
    title() {
      return this.$root.getTitle(this.$route.fullPath)
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
    cps() {
      let clickTimes = this.clicks.length
      let clickPeriod = this.clicks[clickTimes - 1] - this.clicks[0]
      let cps = clickTimes / (clickPeriod / 1000)
      return isFinite(cps) ? cps : 0
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
      this.sloganCount += 1
      if (!this.$root.isWidgetFavor('randomSlogan')) return
      let temp
      switch (this.sloganNo) {
        default:
          break
        // #242 "猜猜看，你还要点几次才能再看到这条标语？"
        case 242:
          temp = this.sloganData[242][0]
          this.sloganData[242][0] = this.sloganCount - temp
          if (temp == 0) break
          this.sloganSnackbar = true
          this.sloganSnackbarNo = 242
          break
        // #448 "你会记得你点过多少次随机语录吗？"
        case 448:
          if (this.sloganCount == 0) break
          this.sloganData[448][0] = this.sloganCount
          this.sloganSnackbar = true
          this.sloganSnackbarNo = 448
          break
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
    addMerit() {
      this.merit++
      let now = new Date().getTime()
      this.clicks.push(now)
      this.clicks = this.clicks.filter(time => time >= now - 10_000)
    },
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
      this.$router.go(0)
    },
    clearIndexedDB() {
      this.$root.db.delete()
      this.$router.go(0)
    },
  },
}
</script>

<style>
.random-slogan-content {
  height: 112px;
}

.random-slogan-disabled .random-slogan-content {
  height: calc(112px - calc(0.875rem * 1.2 * 3));
}

.random-slogan-title {
  align-self: first baseline;
}

.random-slogan-subtitle {
  height: calc(0.875rem * 1.2 * 3);
  line-clamp: 3 !important;
  -webkit-line-clamp: 3 !important;
  white-space: normal;
  align-self: first baseline;
}

.random-slogan-disabled .random-slogan-subtitle {
  display: none;
}
</style>
