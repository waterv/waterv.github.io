<template>
  <div class="font-converter">
    <v-editor v-model="$root.editorValue" ref="editor" no-readonly no-jump>
      <v-dialog v-model="dialog">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            {{ $t('font.convert') }}
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            {{ $t('font.result') }}
          </v-card-title>
          <v-card-text>
            <v-textarea
              v-model="converted"
              ref="result"
              outlined
              hide-details
            />
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="dialog = false">
              {{ $t('_.confirm') }}
            </v-btn>
            <v-btn text @click="$root.doCopy(converted)">
              {{ $t('clipboard.tooltip') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-editor>

    <v-expansion-panels v-model="panel" class="mt-4">
      <!-- Settings -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('_.settings') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row v-for="lang in langs" :key="lang.key" no-gutters>
            <v-col cols="12" sm="6">
              <v-select
                v-model="lang.from"
                :items="_self[`${lang.key}Fonts`]"
                :hint="hint(lang.key, lang.from)"
                :prepend-icon="lang.icon"
                persistent-hint
                outlined
              />
            </v-col>
            <v-spacer />
            <v-col cols="12" sm="6">
              <v-select
                v-model="lang.to"
                :items="_self[`${lang.key}Fonts`]"
                :hint="hint(lang.key, lang.to)"
                prepend-icon="mdi-arrow-right-thick"
                @click:prepend=";[lang.from, lang.to] = [lang.to, lang.from]"
                persistent-hint
                outlined
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'
let font = require('@/data/font.json')

export default {
  name: 'FontConverter',
  components: {
    VEditor,
  },
  data: () => ({
    ...font,
    converted: '',

    dialog: false,
    panel: 0,

    langs: [
      { icon: 'mdi-alphabet-latin', key: 'latin', from: 0, to: 1 },
      { icon: 'mdi-numeric', key: 'digit', from: 0, to: 1 },
      { icon: 'mdi-alphabet-greek', key: 'greek', from: 0, to: 1 },
    ],
  }),
  computed: {
    latinFonts() {
      return this.getFonts('latin', [0, 1, 2, 26, 27, 28])
    },
    digitFonts() {
      return this.getFonts('digit', this.$range(6))
    },
    greekFonts() {
      return this.getFonts('greek', [0, 1, 2, 26, 27, 28])
    },
  },
  watch: {
    dialog(v) {
      if (!v) return
      let value = this.$root.editorValue
      let converted = ''
      for (let lang of this.langs) {
        let origin = this[lang.key][lang.from]
        let dest = this[lang.key][lang.to]
        for (let char of value) {
          let index = origin.indexOf(char)
          converted += index != -1 ? dest[index] : char
        }
        ;[value, converted] = [converted, '']
      }
      this.converted = value
      this.$nextTick(() => {
        this.$refs.result.$refs.input.setSelectionRange(0, value.length)
      })
    },
  },
  methods: {
    getFonts(key, sampleIndices) {
      return this.$range(this[key].length).map(value => ({
        text:
          this.$t(`font.${key}s[${value}]`) +
          ` (${sampleIndices.map(i => this[key][value][i]).join('')})`,
        value,
      }))
    },
    hint(key, index) {
      let hint = []
      let font = this[key][index]
      let info = font[font.length - 1]
      if (info.capital) hint.push(this.$t('font.capital'))
      if (info.rtl) hint.push(this.$t('font.rtl'))
      if (info.without) hint.push(this.$t('font.without', [info.without]))
      return hint.join(' / ')
    },
  },
}
</script>
