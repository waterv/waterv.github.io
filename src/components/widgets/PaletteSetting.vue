<template>
  <v-menu v-model="menu" :close-on-content-click="false" offset-y>
    <template #activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon v-text="'mdi-palette'" />
      </v-btn>
    </template>
    <v-card>
      <v-color-picker
        v-model="value"
        :mode="mode"
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
        <v-btn-toggle v-model="mode" dense group>
          <v-btn
            v-for="mode in modes"
            :key="mode"
            :value="mode"
            v-text="mode"
          />
        </v-btn-toggle>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'PaletteSetting',
  data: that => ({
    menu: false,
    value: that.$root.primaryColor + 'FF',
    mode: 'rgba',
    modes: ['rgba', 'hsla', 'hexa'],
  }),
  methods: {
    setPrimaryColor() {
      this.$root.primaryColor = this.value.slice(0, 7)
      this.menu = false
    },
  },
}
</script>
