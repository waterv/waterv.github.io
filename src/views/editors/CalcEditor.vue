<template>
  <div class="calc-editor">
    <v-editor
      v-model="$root.editorValue"
      :font="models[model].class"
      ref="editor"
      no-jump
      @focus="focused = true"
    />

    <v-expand-transition>
      <v-card v-show="focused" class="elevation-2">
        <v-card-text>
          <v-select
            v-model="model"
            :items="Object.keys(models)"
            prepend-icon="mdi-calculator"
            outlined
          />
          <v-row
            v-for="(row, i) in keys"
            :key="i"
            no-gutters
            class="justify-center"
          >
            <v-btn
              v-for="(key, j) in row"
              :key="j"
              :class="models[model].class"
              :style="{ fontSize: key.length > 1 ? '0.6em' : '' }"
              icon
              large
              :disabled="!key"
              @click="press(i, j)"
            >
              {{ key }}
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <tutorial-list :tutorials="tutorials" />
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'
import TutorialList from '@/components/TutorialList.vue'
let calc = require('@/data/calc.json')

export default {
  name: 'CalcEditor',
  components: {
    VEditor,
    TutorialList,
  },
  data: () => ({
    ...calc,

    focused: false,
    shifted: false,
    alphaed: false,

    model: 'CASIO fx-991/999CN CW',
  }),
  computed: {
    keys() {
      let d = this.models[this.model]
      if (this.shifted) return d.shiftKeys
      if (this.alphaed) return d.alphaKeys
      return d.keys
    },
  },
  watch: {
    model() {
      this.shifted = this.alphaed = false
    },
  },
  methods: {
    press(i, j) {
      let d = this.models[this.model]
      let isShift = d.keys[i][j] == d.shiftKey
      let isAlpha = d.keys[i][j] == d.alphaKey
      if (!this.shifted && isShift) {
        this.shifted = true
        this.alphaed = false
      } else if (!this.alphaed && isAlpha) {
        this.shifted = false
        this.alphaed = true
      } else if (this.shifted) {
        this.shifted = false
        if (isShift) {
          this.$refs.editor.append(d.keys[i][j])
        } else {
          this.$refs.editor.append(
            d.shiftKey + d.keys[i][j] + d.shiftKeys[i][j]
          )
        }
      } else if (this.alphaed) {
        this.alphaed = false
        if (isAlpha) {
          this.$refs.editor.append(d.keys[i][j])
        } else {
          this.$refs.editor.append(
            d.alphaKey + d.keys[i][j] + d.alphaKeys[i][j]
          )
        }
      } else {
        this.$refs.editor.append(d.keys[i][j])
      }
    },
  },
}
</script>
