<template>
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
</template>

<script>
export default {
  name: 'ThemeSetting',
  computed: {
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
  },
}
</script>
