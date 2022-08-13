<template>
  <div class="string">
    <v-editor
      v-model="value"
      ref="editor"
      class="ipa-editor"
      :label="$t('ipa.name')"
      :readonly="readonly"
      placeholder="◌"
      @focus="focused = true"
    >
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-btn icon @click="readonly = !readonly" v-on="on" v-bind="attrs">
            <v-icon v-if="readonly" v-text="'mdi-keyboard-off'" />
            <v-icon v-else v-text="'mdi-keyboard'" />
          </v-btn>
        </template>
        {{ $t('ipa.readonly') }}
      </v-tooltip>
    </v-editor>

    <v-expand-transition>
      <v-card v-show="focused" class="elevation-2">
        <v-card-text>
          <v-tabs v-model="tab" class="mt-2" center-active show-arrows>
            <v-tab
              v-for="cate in cates"
              :key="cate"
              v-text="$t(`ipa.${cate}`)"
            />
          </v-tabs>

          <v-tabs-items v-model="tab" touchless>
            <v-tab-item v-for="(cate, i) in cates" :key="cate">
              <v-simple-table
                v-if="catesType[i] == 'table'"
                dense
                class="no-select"
              >
                <thead>
                  <tr>
                    <th />
                    <th
                      v-for="i in $range($data[cate][0].length / 2)"
                      :key="i"
                      class="text-center no-wrap"
                      colspan="2"
                    >
                      {{ $t(`ipa.${cate}Col[${i}]`) }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="i in $range($data[cate].length)" :key="i">
                    <th class="no-wrap">
                      {{ $t(`ipa.${cate}Row[${i}]`) }}
                    </th>
                    <template v-for="(char, j) in $data[cate][i]">
                      <td
                        v-if="char == '/'"
                        :key="j"
                        class="grey"
                        :class="{
                          'lighten-4': !$root.theme,
                          'darken-3': $root.theme,
                        }"
                      />
                      <td v-else-if="char == ' '" :key="j" />
                      <td
                        v-else
                        :key="j"
                        v-ripple
                        class="ipa text-center"
                        :class="{
                          'grey--text': unicodeLength(char) > 1,
                        }"
                        style="cursor: pointer"
                        @click="append(char)"
                        v-text="char"
                      />
                    </template>
                  </tr>
                </tbody>
              </v-simple-table>

              <v-chip-group v-else column mandatory>
                <v-chip
                  v-for="(char, i) in $data[cate]"
                  :key="i"
                  label
                  :outlined="!!char"
                  :color="char ? '' : 'primary'"
                  @click="append(char)"
                >
                  <span v-show="tips || !char">
                    {{ $t(`ipa.${cate}s[${i}]`) }}
                  </span>
                  <span v-show="char" class="ipa ml-1" v-text="char" />
                </v-chip>
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
          <v-switch v-model="tips" :label="$t('ipa.tips')" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <tutorial-list :tutorials="tutorials" />
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'
import TutorialList from '@/components/TutorialList.vue'
let ipa = require('@/data/ipa.json')

export default {
  name: 'IpaEditor',
  components: {
    VEditor,
    TutorialList,
  },
  data: () => ({
    ...ipa,
    value: '',

    focused: false,
    readonly: false,

    tab: 0,
    panel: 0,

    tips: true,
  }),
  methods: {
    unicodeLength(str) {
      /* eslint-disable */
      let len = 0
      for (let char of str) len += 1
      return len
      /* eslint-disable */
    },
    append(str) {
      this.$refs.editor.replace(str, '◌')
    },
  },
}
</script>

<style>
.ipa,
.ipa-editor textarea {
  font-family: CharisSIL, sans-serif;
}
</style>
