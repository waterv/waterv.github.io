<template>
  <div :class="font">
    <v-textarea
      outlined
      :label="label"
      :value="value"
      :hint="hint"
      :persistent-hint="!!hint"
      :hide-details="!hint"
      :readonly="readonly"
      @blur="onBlur"
      @focus="onFocus"
      @change="update"
      @input="update"
    >
      <template #append>
        <slot name="append" />
      </template>
    </v-textarea>
    <v-expand-transition>
      <div class="mt-2 pb-2 overflow-x-auto no-wrap" v-show="dom">
        <slot />

        <v-tooltip top v-if="!noReadonly">
          <template #activator="{ on, attrs }">
            <v-btn icon @click="readonly = !readonly" v-on="on" v-bind="attrs">
              <v-icon v-text="`mdi-keyboard${readonly ? '-off' : ''}`" />
            </v-btn>
          </template>
          {{ $t('editor.readonly') }}
        </v-tooltip>

        <template v-if="!noMove">
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

        <template v-if="!noJump">
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

        <template v-if="!noSelect">
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
                :color="selectionSource !== null ? 'primary' : ''"
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

        <v-tooltip v-if="!noSelectAll" top>
          <template #activator="{ on, attrs }">
            <v-btn icon @click="selectAll()" v-bind="attrs" v-on="on">
              <v-icon v-text="'mdi-select-all'" />
            </v-btn>
          </template>
          <span v-text="$t('editor.selectAll')" />
        </v-tooltip>

        <v-tooltip v-if="!noCopy" top>
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              @click="$root.doCopy(copyValue)"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon v-text="'mdi-content-copy'" />
            </v-btn>
          </template>
          <span v-text="$t('clipboard.tooltip')" />
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn icon @click="deleteAll" v-bind="attrs" v-on="on">
              <v-icon v-text="'mdi-delete'" />
            </v-btn>
          </template>
          <span v-text="$t('editor.deleteAll')" />
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              :disabled="value == ''"
              @click="addDraft"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon v-text="'mdi-inbox-arrow-down'" />
            </v-btn>
          </template>
          <span v-text="$t('editor.addDraft')" />
        </v-tooltip>

        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              :disabled="$root.currentDraft == 0 || value == ''"
              @click="saveDraft"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon v-text="'mdi-content-save'" />
            </v-btn>
          </template>
          <span v-text="$t('editor.saveDraft')" />
        </v-tooltip>
      </div>
    </v-expand-transition>
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
    noReadonly: { type: Boolean, default: false },
    noMove: { type: Boolean, default: false },
    noJump: { type: Boolean, default: false },
    noSelect: { type: Boolean, default: false },
    noCopy: { type: Boolean, default: false },
    noSelectAll: { type: Boolean, default: false },
    copy: { type: String, default: '' },
    font: String,
  },
  model: {
    prop: 'value',
    event: 'update-value',
  },
  data() {
    return {
      selectionStart: this.value.length,
      selectionEnd: this.value.length,
      selectionSource: null,
      selectionSink: null,
      dom: undefined,
      readonly: false,
    }
  },
  computed: {
    left() {
      return Math.min(this.selectionStart, this.selectionEnd)
    },
    right() {
      return Math.max(this.selectionStart, this.selectionEnd)
    },
    copyValue() {
      let { value, left, right } = this
      let selection = value.slice(left, right)
      return this.copy || selection || this.value
    },
  },
  methods: {
    onBlur(e) {
      let { selectionStart, selectionEnd } = e.srcElement
      Object.assign(this, { selectionStart, selectionEnd })
    },
    onFocus(e) {
      if (!this.dom) this.dom = e.target
      this.$emit('focus')
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
    replace(str, target) {
      let { value, left, right } = this
      let selection = value.slice(left, right)
      if (selection == '' || str == target) return this.append(str, target)
      this.append(str.replace(target, selection), target)
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
    selectAll() {
      this.selectionStart = 0
      this.selectionEnd = this.value.length
      this.dom.focus()
    },
    update(str) {
      this.toggleSelect(true)
      this.$emit('update-value', str)
    },
    deleteAll() {
      this.$emit('update-value', '')
      this.dom.focus()
    },
    async addDraft() {
      await this.$root.db.drafts
        .add({
          text: this.value,
          time: new Date().getTime(),
          path: this.$route.fullPath,
          font: this.font,
        })
        .then(id => {
          this.$root.currentDraft = id
        })
      this.$emit('save')
    },
    async saveDraft() {
      await this.$root.db.drafts.put({
        id: this.$root.currentDraft,
        text: this.value,
        time: new Date().getTime(),
        path: this.$route.fullPath,
        font: this.font,
      })
      this.$emit('save')
    },
  },
}
</script>
