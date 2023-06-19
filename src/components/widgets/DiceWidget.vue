<template>
  <span class="d-flex">
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
  </span>
</template>

<script>
import VNumberField from '@/components/VNumberField.vue'

export default {
  name: 'DiceWidget',
  components: { VNumberField },
  data: () => ({
    diceMin: 1,
    diceMax: 6,
    diceCustom: false,
    diceToggle: 1,
    diceMenu: false,
    dice: undefined,
  }),
  computed: {
    diceIcon() {
      if (this.diceCustom) return 'mdi-help-circle'
      return `mdi-dice-d${this.diceMax}`
    },
  },
  methods: {
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
      console.log('[dice]', min, max, value)
    },
  },
}
</script>
