<template>
  <div class="regexp-editor">
    <v-editor
      v-model="$root.editorValue"
      font="monospace"
      ref="editor"
      :copy="copyValue"
      @focus="focused = true"
    />

    <v-expand-transition>
      <v-card v-show="focused" class="elevation-2">
        <v-card-text>
          <v-tabs v-model="tab" center-active show-arrows>
            <v-tab v-for="(cate, i) in metachars" :key="i">
              {{ $t(`regexp.cates[${i}]`) }}
            </v-tab>
            <v-tab v-text="$t('regexp.inlineFlag.name')" />
          </v-tabs>

          <v-tabs-items v-model="tab">
            <!-- Metachars -->
            <v-tab-item v-for="(cate, i) in metachars" :key="i">
              <v-chip-group column mandatory>
                <v-chip
                  v-for="(metachar, j) in cate"
                  :key="metachar"
                  label
                  outlined
                  @click="append(metachar)"
                >
                  <span
                    v-show="tips && $t(`regexp.metachars[${i}][${j}]`)"
                    class="mr-1"
                    v-text="$t(`regexp.metachars[${i}][${j}]`)"
                  />
                  <pre><code v-text="metachar" /></pre>
                  <v-icon
                    v-for="lang in metacharsLang[i][j]"
                    :key="lang"
                    right
                    small
                    v-text="`$${lang}`"
                  />
                </v-chip>
              </v-chip-group>
            </v-tab-item>

            <!-- Inline Flags -->
            <v-tab-item>
              <v-select
                v-bind="selector"
                v-model="inlineFlagAlu"
                :items="aLu"
                label="aLu"
              />
              <v-select
                v-bind="selector"
                v-model="inlineFlagIdmsuxu"
                :items="idmsuxU"
                label="idmsuxU"
                multiple
                chips
              >
                <template #selection="{ item }">
                  <v-chip label v-text="item.value" />
                </template>
              </v-select>
              <v-select
                v-bind="selector"
                v-model="inlineFlagIdmsuxuNeg"
                :items="idmsuxU"
                label="-idmsuxU"
                multiple
                chips
              >
                <template #selection="{ item }">
                  <v-chip label v-text="item.value" />
                </template>
              </v-select>
            </v-tab-item>
          </v-tabs-items>

          <v-card-actions v-if="tab == metachars.length">
            <v-btn color="primary" text @click="appendInlineFlag">
              {{ $t('_.insert') }}
            </v-btn>
            <v-btn color="primary" text @click="appendInlineFlag(true)">
              {{ $t('regexp.inlineFlagGroup') }}
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <v-expansion-panels v-model="panel" class="mt-4">
      <!-- Settings -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('_.settings') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-switch v-model="tips" :label="$t('regexp.tips')" />
          <v-select
            v-bind="selector"
            v-model="copyType"
            :items="copyTypes"
            :label="$t('regexp.copyType')"
            :hint="$t('regexp.copyTypeHint')"
            persistent-hint
            :hide-details="false"
            :append-icon="`$${copyTypesLang[copyType]}`"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Flags -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('regexp.flag') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row no-gutters>
            <v-col v-for="(v, i) in flags.py" :key="i" cols="12" sm="6" lg="4">
              <v-checkbox v-model="flagsSelected" :value="i" hide-details>
                <template #label>
                  {{ $t(`regexp.flags[${i}]`) }}
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-if="$t(`regexp.flagTips[${i}]`)"
                        right
                        dense
                        v-text="'mdi-information-outline'"
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    {{ $t(`regexp.flagTips[${i}]`) }}
                  </v-tooltip>
                </template>
                <template #append>
                  <v-icon
                    v-for="lang in langs"
                    :key="lang"
                    v-show="flags[lang][i]"
                    class="mr-2"
                    :color="
                      lang == copyTypesLang[copyType] ? 'primary' : 'grey'
                    "
                    dense
                    v-text="`$${lang}`"
                  />
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <tutorial-list :tutorials="tutorials" />
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'
import TutorialList from '@/components/TutorialList.vue'
let regexp = require('@/data/regexp.json')

export default {
  name: 'RegexpEditor',
  components: {
    VEditor,
    TutorialList,
  },
  data: () => ({
    ...regexp,
    focused: false,

    tab: null,
    panel: 0,

    tips: localStorage.getItem('regexpTips') != 'false',
    copyType: 0,

    inlineFlagAlu: '',
    inlineFlagIdmsuxu: [],
    inlineFlagIdmsuxuNeg: [],
    flagsSelected: [],

    langs: ['javascript', 'python', 'java', 'inline'],
    selector: {
      class: 'mt-4',
      outlined: true,
      'hide-details': true,
    },
  }),
  watch: {
    tips(v) {
      localStorage.setItem('regexpTips', v)
    },
  },
  computed: {
    aLu() {
      return regexp.inlineFlags.aLu.map((flag, i) => ({
        text: `${flag ? `[${flag}] ` : ''}
        ${this.$t(`regexp.inlineFlag.aLu[${i}]`)}`,
        value: flag,
      }))
    },
    idmsuxU() {
      return regexp.inlineFlags.idmsuxU.map((flag, i) => ({
        text: `[${flag}] ${this.$t(`regexp.inlineFlag.idmsuxU[${i}]`)}`,
        value: flag,
      }))
    },
    copyTypes() {
      return this.$range(6).map(value => ({
        text: this.$t(`regexp.copyTypes[${value}]`),
        value,
      }))
    },
    copyValue() {
      let prefix = 're.compile'
      let lang = 'python'
      switch (this.copyType) {
        default:
          return this.$root.editorValue
        case 0: // Javascript RegExp
          return `/${this.$root.editorValue}/${this.flagsSelected
            .map(i => this.flags.javascript[i])
            .join('')}`
        case 2: // Python / Java String
          return `"(?${this.flagsSelected
            .map(i => this.flags.inline[i])
            .join('')})${this.$root.editorValue.replaceAll('\\', '\\\\')}"`
        case 3: // Python re.compile()
          break
        case 4: // Java Pattern.compile() Simplified
          lang = 'py'
          break
        case 5: // Java Pattern.compile()
          prefix = 'Pattern.compile'
          lang = 'java'
          break
      }
      return `${prefix}("${this.$root.editorValue.replaceAll('\\', '\\\\')}"${
        this.flagsSelected.length
          ? ', ' +
            this.flagsSelected
              .map(i => this.flags[lang][i])
              .filter(Boolean)
              .join(' | ')
          : ''
      })`
    },
  },
  methods: {
    metacharChip(i, j) {
      return `${this.tips ? this.$t(`regexp.metachars[${i}][${j}]`) : ''} ${
        this.metachars[i][j]
      }`
    },
    append(str) {
      this.$refs.editor.replace(str, '_')
    },
    appendInlineFlag(inlineFlagGroup) {
      let str = '(?'
      str += this.inlineFlagAlu + this.inlineFlagIdmsuxu.join('')
      if (this.inlineFlagIdmsuxuNeg.length)
        str += `-${this.inlineFlagIdmsuxuNeg.join('')}`
      if (inlineFlagGroup) str += ':_'
      str += ')'
      this.$refs.editor.append(str, '_')
    },
  },
}
</script>
