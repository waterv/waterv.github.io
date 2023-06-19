<template>
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
</template>

<script>
export default {
  name: 'LocaleSetting',
  data: () => ({
    locales: [
      { text: '简体中文', value: 'zh-CN' },
      { text: 'English', value: 'en-US' },
    ],
  }),
}
</script>
