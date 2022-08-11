<template>
  <div class="string">
    <v-editor
      v-model="value"
      ref="editor"
      :label="$t('regexp.name')"
      allow-move
      allow-jump
      allow-select
      allow-copy
      :copy="copyValue"
    >
      <v-menu
        v-model="metacharMenu"
        :close-on-content-click="false"
        max-width="90%"
        offset-y
      >
        <template #activator="{ on, attrs }">
          <v-btn class="mr-2" color="primary" dark v-bind="attrs" v-on="on">
            {{ $t('regexp.metachar') }}
          </v-btn>
        </template>
        <v-card class="pa-4">
          <v-tabs class="ml-0" v-model="metacharCate" center-active show-arrows>
            <v-tab v-for="(cate, i) in metachars" :key="i">
              {{ $t(`regexp.cates[${i}]`) }}
            </v-tab>
            <v-tab v-text="$t('regexp.inlineFlag.name')" />
          </v-tabs>

          <v-tabs-items v-model="metacharCate">
            <!-- Metachars -->
            <v-tab-item v-for="(cate, i) in metachars" :key="i">
              <v-chip-group column>
                <v-chip
                  v-for="(metachar, j) in cate"
                  :key="metachar"
                  label
                  @click="append(metachar)"
                >
                  <span
                    v-if="metacharTips"
                    v-text="$t(`regexp.metachars[${i}][${j}]`)"
                  />
                  <pre class="ml-1 mr-1"><code v-text="metachar" /></pre>
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

          <v-card-actions v-if="metacharCate == metachars.length">
            <v-btn color="primary" text @click="appendInlineFlag">
              {{ $t('_.insert') }}
            </v-btn>
            <v-btn color="primary" text @click="appendInlineFlag(true)">
              {{ $t('regexp.inlineFlagGroup') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-editor>

    <v-expansion-panels v-model="panel" class="mt-2">
      <!-- Settings -->
      <v-expansion-panel>
        <v-expansion-panel-header v-text="$t('_.settings')" />
        <v-expansion-panel-content>
          <v-switch v-model="metacharTips" :label="$t('regexp.metacharTips')" />
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
        <v-expansion-panel-header v-text="$t('regexp.flag')" />
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

    <v-divider class="mt-4 mb-4" />

    <ul>
      <li v-for="i in range(3)" :key="i">
        <v-link
          :href="$t(`regexp.tutorials[${i}][1]`)"
          target="_blank"
          external
        >
          {{ $t(`regexp.tutorials[${i}][0]`) }}
        </v-link>
      </li>
    </ul>
  </div>
</template>

<script>
import VLink from '@/components/VLink.vue'
import VEditor from '@/components/VEditor.vue'
let regexp = require('@/data/regexp.json')

export default {
  name: 'RegexpEditor',
  components: {
    VLink,
    VEditor,
  },
  data() {
    return {
      ...regexp,
      value: '',

      metacharMenu: false,
      metacharTips: true,
      metacharCate: null,

      inlineFlagAlu: '',
      inlineFlagIdmsuxu: [],
      inlineFlagIdmsuxuNeg: [],
      flagsSelected: [],
      copyType: 0,
      copyTypes: this.range(6).map(value => ({
        text: this.$t(`regexp.copyTypes[${value}]`),
        value,
      })),
      langs: ['javascript', 'python', 'java', 'inline'],
      panel: 0,

      selector: {
        class: 'mt-4',
        outlined: true,
        'hide-details': true,
      },
    }
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
    copyValue() {
      let prefix = 're.compile'
      let lang = 'python'
      switch (this.copyType) {
        default:
          return this.value
        case 0: // Javascript RegExp
          return `/${this.value}/${this.flagsSelected
            .map(i => this.flags.javascript[i])
            .join('')}`
        case 2: // Python / Java String
          return `"(?${this.flagsSelected
            .map(i => this.flags.inline[i])
            .join('')})${this.value.replaceAll('\\', '\\\\')}"`
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
      return `${prefix}("${this.value.replaceAll('\\', '\\\\')}"${
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
    range(cnt) {
      let arr = []
      for (let i = 0; i < cnt; i++) arr.push(i)
      return arr
    },
    metacharChip(i, j) {
      return `${
        this.metacharTips ? this.$t(`regexp.metachars[${i}][${j}]`) : ''
      } ${this.metachars[i][j]}`
    },
    append(str) {
      this.$refs.editor.append(str, '_')
      this.metacharMenu = false
    },
    appendInlineFlag(inlineFlagGroup) {
      let str = '(?'
      str += this.inlineFlagAlu + this.inlineFlagIdmsuxu.join('')
      if (this.inlineFlagIdmsuxuNeg.length)
        str += `-${this.inlineFlagIdmsuxuNeg.join('')}`
      if (inlineFlagGroup) str += ':_'
      str += ')'
      this.$refs.editor.append(str, '_')
      this.metacharMenu = false
    },
  },
}
</script>
