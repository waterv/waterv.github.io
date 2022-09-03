<template>
  <div class="tex-editor">
    <v-card class="mb-4 elevation-2">
      <v-card-subtitle v-text="$t('tex.result')" />
      <v-card-text>
        <div id="katex" v-html="renderedValue" />
      </v-card-text>
    </v-card>
    <v-editor
      v-model="value"
      ref="editor"
      :label="$t('tex.name')"
      placeholder="¥"
      @focus="focused = true"
    />
    <v-expand-transition>
      <v-card v-show="focused" class="elevation-2">
        <v-card-text>
          <v-tabs v-model="tab" class="mt-2" center-active show-arrows>
            <v-tab v-text="$t('tex.search')" />
            <v-tab
              v-for="cate in cates"
              :key="cate"
              v-text="$t(`tex.${cate}`)"
            />
          </v-tabs>
          <v-tabs-items v-model="tab" touchless>
            <v-tab-item>
              <v-autocomplete
                v-model="func"
                :items="functions"
                class="mt-4"
                outlined
                hide-details
                append-outer-icon="mdi-arrow-up-bold-circle"
                @click:append-outer="appendFunc"
              />
              <v-chip-group column mandatory>
                <v-chip
                  v-for="(func, i) in recent"
                  :key="i"
                  v-bind="chip"
                  v-text="func"
                  @click="replace(func)"
                />
              </v-chip-group>
            </v-tab-item>

            <v-tab-item v-for="cate in cates" :key="cate">
              <v-chip-group column mandatory>
                <v-chip
                  v-for="(func, i) in $data[cate]"
                  :key="i"
                  v-bind="chip"
                  v-text="func"
                  @click="replace(func)"
                />
              </v-chip-group>
            </v-tab-item>
          </v-tabs-items>
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
          <v-switch v-model="displayMode" :label="$t('tex.displayMode')" />
          <v-slider
            v-model="recentMax"
            :label="$t('tex.recentMax')"
            color="primary"
            thumb-label
            always-dirty
            min="20"
            max="50"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Macros -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('tex.macros') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table fixed-header height="300px">
            <thead>
              <tr>
                <th class="text-left" v-text="$t('tex.macro')" />
                <th class="text-left" v-text="$t('tex.definition')" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v, i) in macros_" :key="i">
                <td>
                  <v-text-field v-model="macros_[i][0]" dense hide-details />
                </td>
                <td>
                  <v-text-field
                    v-model="macros_[i][1]"
                    dense
                    hide-details
                    append-outer-icon="mdi-delete"
                    @click:append-outer="removeMacro(i)"
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>

          <v-btn text color="primary" @click="addMacro">
            {{ $t('_.add') }}
          </v-btn>

          <v-dialog v-model="dialog">
            <template v-slot:activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on"> JSON </v-btn>
            </template>
            <v-card>
              <v-card-title> JSON </v-card-title>
              <v-card-text>
                <v-textarea v-model="macroJson" outlined hide-details />
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text @click="parseMacroJson">
                  {{ $t('_.save') }}
                </v-btn>
                <v-btn text @click="$root.doCopy(macroJson)">
                  {{ $t('clipboard.tooltip') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <tutorial-list :tutorials="tutorials" />
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'
import TutorialList from '@/components/TutorialList.vue'
import katex from 'katex'
let tex = require('@/data/tex.json')

export default {
  name: 'TexEditor',
  components: {
    VEditor,
    TutorialList,
  },
  data() {
    return {
      ...tex,
      value: '',

      func: '',
      recent: [],
      recentMax: 20,

      displayMode: true,
      macros_: [
        ['\\d', '\\mathrm d'],
        ['\\e', '\\mathrm e'],
      ],

      focused: false,
      tab: 0,
      panel: 0,
      dialog: false,
      macroJson: '',

      chip: {
        class: 'monospace',
        label: true,
      },
    }
  },
  computed: {
    renderedValue() {
      return katex.renderToString(this.value, {
        displayMode: this.displayMode,
        throwOnError: false,
        errorColor: this.$vuetify.theme.themes.light.error,
        macros: this.macros,
      })
    },
    macros() {
      return this.macros_.reduce((obj, item) => {
        obj[item[0]] = item[1]
        return obj
      }, {})
    },
  },
  watch: {
    recentMax(v) {
      let length = this.recent.length
      if (length > v) this.recent = this.recent.slice(length - v)
    },
    dialog(v) {
      if (v) this.macroJson = JSON.stringify(this.macros)
    },
  },
  methods: {
    appendFunc() {
      let func = '\\' + this.func
      this.$refs.editor.append(func)
      this.recent.push(func)
      this.recent = [...new Set(this.recent)]
      if (this.recent.length > this.recentMax) this.recent.shift()
      this.func = ''
    },
    replace(str) {
      this.$refs.editor.replace(str, '¥')
    },
    removeMacro(i) {
      this.macros_.splice(i, 1)
    },
    addMacro() {
      this.macros_.push(['', ''])
    },
    parseMacroJson() {
      try {
        let macros = []
        let json = JSON.parse(this.macroJson)
        for (let macro in json) macros.push([macro, json[macro]])
        this.macros_ = macros
      } catch (e) {
        console.warn(e)
        this.macros_ = []
      }
      this.dialog = false
    },
  },
}
</script>
