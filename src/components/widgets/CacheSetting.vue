<template>
  <v-menu v-model="menu" offset-y>
    <template #activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
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
</template>

<script>
export default {
  name: 'CacheSetting',
  data: () => ({
    menu: false,
  }),
  methods: {
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
