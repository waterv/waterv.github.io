<template>
  <div class="home">
    <v-alert v-model="showLightandnight" color="green" outlined dismissible>
      <i18n path="tips.lightandnight">
        <v-link href="//waterv.github.io/lightandnight" external>
          {{ $t('_.here') }}
        </v-link>
      </i18n>
    </v-alert>

    <v-select
      v-model="locale"
      :items="locales"
      :label="$t('settings.locale')"
      outlined
    />

    <v-select
      v-model="$root.selectTheme"
      :items="themes"
      :label="$t('settings.theme')"
      outlined
    />

    <v-menu v-model="paletteMenu" :close-on-content-click="false" offset-y>
      <template #activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          <v-icon left v-text="'mdi-palette'" />
          {{ $t('settings.palette') }}
        </v-btn>
      </template>
      <v-card>
        <v-btn-toggle v-model="paletteMode" dense group>
          <v-btn
            v-for="mode in paletteModes"
            :key="mode"
            :value="mode"
            v-text="mode"
          />
        </v-btn-toggle>
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
        </v-card-actions>
      </v-card>
    </v-menu>

    <v-btn class="ml-4" color="error" dark @click="clearLocalStorage">
      <v-icon left v-text="'mdi-delete'" />
      {{ $t('settings.clearLocalStorage') }}
    </v-btn>
  </div>
</template>

<script>
import VLink from '@/components/VLink.vue'

export default {
  name: 'HomeView',
  components: {
    VLink,
  },
  data() {
    return {
      locales: [
        { text: '简体中文', value: 'zh-CN' },
        { text: 'English', value: 'en-US' },
      ],
      paletteMenu: false,
      paletteValue: this.$root.primaryColor + 'FF',
      paletteMode: 'rgba',
      paletteModes: ['rgba', 'hsla', 'hexa'],
    }
  },
  computed: {
    themes() {
      return ['system', 'light', 'dark'].map(value => ({
        text: this.$t(`settings.themes.${value}`),
        value,
      }))
    },
    showLightandnight: {
      get() {
        return !(localStorage?.getItem('showLightandnight') === 'false')
      },
      set(v) {
        localStorage?.setItem('showLightandnight', !!v)
      },
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
  methods: {
    setPrimaryColor() {
      this.$root.primaryColor = this.paletteValue.slice(0, 7)
      this.paletteMenu = false
    },
    clearLocalStorage() {
      localStorage.clear()
      this.locale = 'zh-CN'
      this.paletteValue = '#1976D2'
      this.setPrimaryColor()
    },
  },
}
</script>
