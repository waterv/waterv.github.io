<template>
  <v-tooltip top :open-on-focus="false">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="addMerit">
        <v-icon v-text="'mdi-fish'" />
      </v-btn>
    </template>
    {{ $t('settings.merit', [merit]) }}
    <br />
    {{ $t('settings.cps', [cps.toFixed(1)]) }}
  </v-tooltip>
</template>

<script>
export default {
  name: 'WoodenFish',
  data: that => ({
    merit: that.$ls.data('number', 'merit', 0),
    clicks: [],
  }),
  watch: {
    merit(v) {
      this.$ls.watch('number', 'merit', v)
    },
  },
  computed: {
    cps() {
      let clickTimes = this.clicks.length
      let clickPeriod = this.clicks[clickTimes - 1] - this.clicks[0]
      let cps = clickTimes / (clickPeriod / 1000)
      return isFinite(cps) ? cps : 0
    },
  },
  methods: {
    addMerit() {
      this.merit++
      let now = new Date().getTime()
      this.clicks.push(now)
      this.clicks = this.clicks.filter(time => time >= now - 10_000)
    },
  },
}
</script>
