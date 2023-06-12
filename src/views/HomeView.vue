<template>
  <div class="home">
    <v-editor
      v-model="$root.editorValue"
      ref="editor"
      :label="$t('home.name')"
      no-jump
      @focus="focused = true"
    />

    <v-expand-transition>
      <v-card v-show="focused" class="elevation-2">
        <v-card-text>
          <v-tabs v-model="tab" center-active show-arrows>
            <v-tab v-for="cate in cates" :key="cate">
              {{ $t(`home.${cate}`) }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <!-- Unicode -->
            <v-tab-item>
              <v-text-field
                class="mt-2"
                :label="$t('home.codePoint')"
                prefix="U+"
                outlined
                counter
                maxlength="6"
                v-model="codePoint"
                :rules="codePointRule"
                append-outer-icon="mdi-send"
                @click:append-outer="appendUnicode"
              />
            </v-tab-item>

            <!-- Technical -->
            <v-tab-item>
              <v-chip-group column mandatory>
                <v-chip
                  v-for="char in tech"
                  :key="char"
                  label
                  outlined
                  @click="append(char)"
                >
                  <span v-text="char" />
                </v-chip>
              </v-chip-group>
            </v-tab-item>

            <!-- IDC -->
            <v-tab-item>
              <v-chip-group column mandatory>
                <v-chip
                  v-for="char in idc"
                  :key="char"
                  label
                  outlined
                  @click="append(char)"
                >
                  <span v-text="char" />
                </v-chip>
              </v-chip-group>
            </v-tab-item>

            <!-- Control -->
            <v-tab-item>
              <v-chip-group column mandatory>
                <v-chip
                  v-for="(char, i) in control"
                  :key="char"
                  label
                  outlined
                  @click="append(char)"
                >
                  <span v-text="$t(`home.controls[${i}]`)" />
                </v-chip>
              </v-chip-group>
            </v-tab-item>

            <!-- Braille -->
            <v-tab-item>
              <v-row
                v-for="(v, i) in brailles"
                :key="i"
                no-gutters
                class="justify-center"
              >
                <braille-key v-for="(u, j) in v" :key="j" v-model="v[j]" />
                <v-btn
                  v-if="i == 3"
                  icon
                  color="primary"
                  @click="appendBraille"
                >
                  <v-icon v-text="'mdi-send'" />
                </v-btn>
                <v-btn
                  v-else-if="i == 0"
                  icon
                  color="error"
                  @click="clearBraille"
                >
                  <v-icon v-text="'mdi-delete'" />
                </v-btn>
                <v-btn v-else icon disabled />
              </v-row>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'
import BrailleKey from '@/components/BrailleKey.vue'
let misc = require('@/data/misc.json')

export default {
  name: 'HomeView',
  components: {
    VEditor,
    BrailleKey,
  },
  data: () => ({
    ...misc,

    focused: false,
    tab: 0,
    codePoint: '',
    brailles: [
      [false, false],
      [false, false],
      [false, false],
      [false, false],
    ],
  }),
  computed: {
    codePointRule() {
      return [
        v => v.length <= 6 || this.$t('home.rule.long'),
        v =>
          Array.from(v).every(
            c =>
              ('0' <= c && c <= '9') ||
              ('a' <= c && c <= 'f') ||
              ('A' <= c && c <= 'F')
          ) || this.$t('home.rule.nothex'),
      ]
    },
  },
  methods: {
    append(str) {
      this.$refs.editor.append(str)
    },
    appendUnicode() {
      let code = this.codePoint

      if (!code.length) return
      for (let func of this.codePointRule) if (func(code) !== true) return

      code = `0000${code}`.slice(-Math.max(4, code.length))
      this.append(eval(`'\\u{${code}}'`))
    },
    clearBraille() {
      this.brailles = [
        [false, false],
        [false, false],
        [false, false],
        [false, false],
      ]
    },
    appendBraille() {
      let result = 0
      for (let i in this.brailles)
        for (let j in this.brailles[i])
          result |= Number(this.brailles[i][j]) << this.braille[i][j]
      this.append(eval(`'\\u${(0x2800 + result).toString(16)}'`))
    },
  },
}
</script>
