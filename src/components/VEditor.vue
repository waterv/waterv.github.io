<template>
  <div class="editor">
    <v-textarea
      outlined
      :label="label"
      :value="value"
      :hint="hint"
      :persistent-hint="!!hint"
      :hide-details="!hint"
      @blur="onBlur"
      @focus="onFocus"
      @change="update"
    >
      <template #append>
        <slot name="append" />
      </template>
    </v-textarea>
    <v-expand-transition>
      <div
        class="mt-2 pb-2 overflow-x-auto"
        v-show="dom"
        style="white-space: nowrap"
      >
        <slot />

        <template v-if="allowMove">
          <v-btn icon @click="moveBy(-1)">
            <v-icon v-text="'mdi-arrow-left-thick'" />
          </v-btn>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-cursor-text'" />
              </v-btn>
            </template>
            <span v-text="$t('editor.cursor')" />
          </v-tooltip>
          <v-btn icon @click="moveBy(1)">
            <v-icon v-text="'mdi-arrow-right-thick'" />
          </v-btn>
        </template>

        <template v-if="allowJump">
          <v-btn icon @click="previous(placeholder)">
            <v-icon v-text="'mdi-arrow-left-thick'" />
          </v-btn>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-pencil-box-outline'" />
              </v-btn>
            </template>
            <span v-text="$t('editor.placeholder')" />
          </v-tooltip>
          <v-btn icon @click="next(placeholder)">
            <v-icon v-text="'mdi-arrow-right-thick'" />
          </v-btn>
        </template>

        <template v-if="allowSelect">
          <v-btn
            icon
            @click="selectMoveBy(-1)"
            :disabled="selectionSource === null"
          >
            <v-icon v-text="'mdi-arrow-left-thick'" />
          </v-btn>
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                :color="selectionSource !== null ? 'primary' : 'grey'"
                @click="toggleSelect(false)"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon v-text="'mdi-selection'" />
              </v-btn>
            </template>
            <span>{{ $t('editor.selection') }}</span>
          </v-tooltip>
          <v-btn
            icon
            @click="selectMoveBy(1)"
            :disabled="selectionSource === null"
          >
            <v-icon v-text="'mdi-arrow-right-thick'" />
          </v-btn>
        </template>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              v-if="allowCopy"
              icon
              v-clipboard:copy="copy || value"
              v-clipboard:success="() => (copySuccess = true)"
              v-clipboard:error="() => (copyError = true)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon v-text="'mdi-content-copy'" />
            </v-btn>
          </template>
          <span v-text="$t('clipboard.tooltip')" />
        </v-tooltip>
      </div>
    </v-expand-transition>
    <v-snackbar v-model="copySuccess">
      {{ $t('clipboard.success') }}
    </v-snackbar>
    <v-snackbar v-model="copyError">
      {{ $t('clipboard.error') }}
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'VEditor',
  props: {
    label: { type: String, default: '' },
    hint: { type: String, default: '' },
    value: String,
    placeholder: { type: String, default: '_' },
    allowMove: { type: Boolean, default: false },
    allowJump: { type: Boolean, default: false },
    allowSelect: { type: Boolean, default: false },
    allowCopy: { type: Boolean, default: false },
    copy: { type: String, default: '' },
  },
  model: {
    prop: 'value',
    event: 'updateValue',
  },
  data() {
    return {
      selectionStart: this.value.length,
      selectionEnd: this.value.length,
      selectionSource: null,
      selectionSink: null,
      dom: undefined,
      copySuccess: false,
      copyError: false,
    }
  },
  computed: {
    left() {
      return Math.min(this.selectionStart, this.selectionEnd)
    },
    right() {
      return Math.max(this.selectionStart, this.selectionEnd)
    },
  },
  methods: {
    onBlur(e) {
      let { selectionStart, selectionEnd } = e.srcElement
      Object.assign(this, { selectionStart, selectionEnd })
    },
    onFocus(e) {
      if (!this.dom) this.dom = e.target
      // 同时更改内容和光标位置的解决方法
      // https://stackoverflow.com/questions/48868075/
      this.$nextTick(() => {
        if (!this.selectionSource)
          e.target.setSelectionRange(this.left, this.right)
        else {
          let left = Math.min(this.selectionSource, this.selectionSink),
            right = Math.max(this.selectionSource, this.selectionSink)
          e.target.setSelectionRange(left, right)
        }
      })
    },
    append(str, target) {
      let { value, left, right } = this
      this.update(value.slice(0, left) + str + value.slice(right))
      this.$nextTick(() => {
        if (target && str.indexOf(target) != -1) {
          this.moveTo(left)
          this.next(target)
        } else this.moveBy(str.length)
      })
    },
    moveTo(pos) {
      this.toggleSelect(true)
      this.selectionEnd = this.selectionStart = pos
    },
    moveBy(dist) {
      this.moveTo(this.left + dist)
      this.dom.focus()
    },
    toggleSelect(disable) {
      this.selectionSource = this.selectionSink =
        disable || this.selectionSource !== null ? null : this.selectionStart
    },
    selectMoveBy(dist) {
      this.selectionSink += dist
      this.dom.focus()
    },
    next(target, fromHead) {
      this.toggleSelect(true)
      let position = this.value.indexOf(target, fromHead ? 0 : this.right)
      if (position != -1) {
        this.selectionStart = position
        this.selectionEnd = position + target.length
        this.dom.focus()
      } else if (fromHead) return this.dom.focus()
      else this.next(target, true)
    },
    previous(target, fromTail) {
      this.toggleSelect(true)
      let position = this.value.lastIndexOf(
        target,
        fromTail ? +Infinity : this.left - 1
      )
      if (position != -1) {
        this.selectionStart = position
        this.selectionEnd = position + target.length
        this.dom.focus()
      } else if (fromTail) return this.dom.focus()
      else this.previous(target, true)
    },
    update(str) {
      this.toggleSelect(true)
      this.$emit('updateValue', str)
    },
  },
}
</script>
