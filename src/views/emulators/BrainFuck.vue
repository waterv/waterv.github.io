<template>
  <div class="brainfuck">
    <v-editor
      v-model="$root.editorValue"
      font="monospace"
      ref="editor"
      :label="$t('bf.code')"
      no-jump
      @focus="focused = true"
    >
      <v-btn icon @click="parse">
        <v-icon v-text="'mdi-console-line'" />
      </v-btn>
      <v-btn icon :disabled="!operations.length || !!timer" @click="step">
        <v-icon v-text="'mdi-step-forward'" />
      </v-btn>
      <v-btn icon v-if="!timer" :disabled="!operations.length" @click="run">
        <v-icon v-text="'mdi-play'" />
      </v-btn>
      <v-btn icon v-else :disabled="!timer" @click="stop">
        <v-icon v-text="'mdi-pause'" />
      </v-btn>
    </v-editor>

    <v-text-field
      v-model="input"
      :label="$t('bf.input')"
      class="my-2"
      outlined
      hide-details
    />

    <v-expand-transition>
      <v-expansion-panels v-show="focused" v-model="panel" class="mt-4">
        <!-- Symbols -->
        <v-expansion-panel>
          <v-expansion-panel-header>
            {{ $t('bf.symbols') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container>
              <v-row justify="start">
                <v-col
                  v-for="symbol in symbols"
                  :key="symbol"
                  class="d-flex flex-column align-center"
                  cols="3"
                  sm="2"
                  lg="1"
                >
                  <v-btn
                    class="d-flex monospace"
                    fab
                    large
                    elevation="0"
                    @click="$refs.editor.append(symbol)"
                  >
                    {{ symbol }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Memory -->
        <v-expansion-panel v-show="operations.length">
          <v-expansion-panel-header>
            {{ $t('bf.memory') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-container class="pa-0">
              <v-row no-gutters class="py-2">
                <v-col cols="auto" class="mr-8">
                  <v-icon v-text="'mdi-application-array'" />
                </v-col>
                <v-col style="line-break: anywhere">
                  <span
                    v-for="v in operations.flat(Infinity)"
                    :key="v.index"
                    class="monospace"
                    :class="pc == v.index ? 'primary white--text' : ''"
                    v-text="v.symbol"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="py-2">
                <v-col cols="auto" class="mr-8">
                  <v-icon v-text="'mdi-login-variant'" />
                </v-col>
                <v-col style="line-break: anywhere">
                  <span
                    v-for="(v, i) in stdin"
                    :key="i"
                    class="monospace"
                    :class="reader - 1 == i ? 'primary white--text' : ''"
                    v-text="v"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters class="py-2">
                <v-col cols="auto" class="mr-8">
                  <v-icon v-text="'mdi-logout-variant'" />
                </v-col>
                <v-col
                  class="monospace"
                  style="line-break: anywhere"
                  v-text="output"
                />
              </v-row>
              <v-divider class="my-4" />
            </v-container>

            <v-container class="pa-0 mb-8">
              <v-row no-gutters>
                <v-col v-for="(cell, i) in displayCells" :key="i" xs="2" sm="1">
                  <div class="cell">
                    <div
                      class="cell-value"
                      :class="cell.current ? 'primary white--text' : ''"
                    >
                      {{ cell.value }}
                    </div>
                    <div
                      class="cell-index"
                      :class="cell.current ? 'primary--text' : ''"
                    >
                      #{{ cell.index }}
                    </div>
                    <div
                      class="cell-char"
                      :class="cell.current ? 'primary--text' : ''"
                    >
                      {{ cell.char }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
            <v-pagination
              v-model="cellPage"
              :length="cellPages"
              total-visible="7"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Output -->
        <v-expansion-panel v-show="operations.length">
          <v-expansion-panel-header>
            {{ $t('bf.output') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-textarea :value="output" outlined readonly hide-details />
          </v-expansion-panel-content>
        </v-expansion-panel>

        <!-- Settings -->
        <v-expansion-panel>
          <v-expansion-panel-header>
            {{ $t('_.settings') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-number-field
              v-model="maxCell"
              :label="$t('bf.maxCell')"
              outlined
            />
            <v-number-field
              v-model="maxLoop"
              :label="$t('bf.maxLoop')"
              outlined
            />
            <v-slider
              v-model="speedIndex"
              :tick-labels="speeds"
              :label="$t('bf.speed')"
              :max="speeds.length - 1"
            />
            <v-switch v-model="byte" :label="$t('bf.byte')" />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-expand-transition>

    <tutorial-list :tutorials="tutorials" />

    <v-snackbar v-model="bracketError" class="safe-bottom">
      {{ $t('bf.bracketError') }}
    </v-snackbar>

    <v-snackbar v-model="infiniteLoop" class="safe-bottom">
      {{ $t('bf.infiniteLoop') }}
    </v-snackbar>

    <v-snackbar v-model="programEnd" class="safe-bottom">
      {{ $t('bf.programEnd') }}
    </v-snackbar>
  </div>
</template>

<script>
import VEditor from '@/components/VEditor.vue'
import VNumberField from '@/components/VNumberField.vue'
import TutorialList from '@/components/TutorialList.vue'

export default {
  name: 'BrainFuck',
  components: { VEditor, VNumberField, TutorialList },
  data: that => ({
    panel: 0,
    focused: false,
    cellPage: 1,
    timer: undefined,

    input: '',
    bracketError: false,
    infiniteLoop: false,
    programEnd: false,

    symbols: ['+', '-', '<', '>', ',', '.', '[', ']'],
    operators: {
      '+': that =>
        that.$set(that.cells, that.pointer, that.cells[that.pointer] + 1),
      '-': that =>
        that.$set(that.cells, that.pointer, that.cells[that.pointer] - 1),
      '<': that => {
        that.pointer = Math.max(0, that.pointer - 1)
      },
      '>': that => {
        that.pointer = Math.min(that.maxCell - 1, that.pointer + 1)
      },
      ',': that =>
        that.$set(
          that.cells,
          that.pointer,
          that.stdin[that.reader++]?.codePointAt(0) ?? 0
        ),
      '.': that => {
        let cell = that.currentValue
        if (cell >= 0 && cell <= 0x10ffff)
          that.stdout.push(String.fromCodePoint(cell))
      },
    },

    pc: -1,
    pointer: 0,
    reader: 0,
    stack: [],
    operations: [],
    cells: [],
    stdin: [],
    stdout: [],

    maxCell: that.$ls.data('number', 'brainfuckMaxCell', 100),
    maxLoop: that.$ls.data('number', 'brainfuckMaxLoop', 1000),
    speedIndex: that.$ls.data('number', 'brainfuckSpeedIndex', 2),
    byte: that.$ls.data('boolean', 'brainfuckByte', false),
    speeds: [1, 10, 50, 100, 250, 500, '∞'],

    tutorials: [['Some Brainfuck Fluff', 'http://brainfuck.org', '']],
  }),
  computed: {
    cellsPerPage() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 6
        default:
          return 12
      }
    },
    cellPages() {
      return Math.ceil(this.cells.length / this.cellsPerPage)
    },
    displayCells() {
      return this.cells
        .slice(
          this.cellsPerPage * (this.cellPage - 1),
          this.cellsPerPage * this.cellPage
        )
        .map((v, i) => ({
          index: this.cellsPerPage * (this.cellPage - 1) + i,
          value: this.cellValue(v),
          char: v >= 0 && v <= 0x10ffff ? String.fromCodePoint(v) : '',
          current: this.pointer == this.cellsPerPage * (this.cellPage - 1) + i,
        }))
    },
    currentValue() {
      return this.cellValue(this.cells[this.pointer])
    },
    output() {
      return this.stdout.join('')
    },
    current() {
      return this.stack[this.stack.length - 1]
    },
  },
  watch: {
    maxCell(v) {
      this.$ls.watch('number', 'brainfuckMaxCell', v)
      this.reset()
    },
    maxLoop(v) {
      this.$ls.watch('number', 'brainfuckMaxLoop', v)
    },
    speedIndex(v) {
      this.$ls.watch('number', 'brainfuckSpeedIndex', v)
      this.stop()
    },
    byte(v) {
      this.$ls.watch('boolean', 'brainfuckByte', v)
      this.reset()
    },
  },
  mounted() {
    this.cells = new Array(this.maxCell).fill(0)
  },
  methods: {
    cellValue(v) {
      if (this.byte) return v & 0xff
      return v
    },
    reset() {
      this.pc = -1
      this.reader = 0
      this.pointer = 0
      this.stack = []
      this.operations = []
      this.cells = new Array(this.maxCell).fill(0)
      this.stdin = Array.from(this.input)
      this.stdout = []
      this.stop()
    },
    parse() {
      this.panel = 1
      this.reset()

      let operations = []
      let index = 0
      let stack = [operations]
      let current = () => stack[stack.length - 1]

      for (let symbol of this.$root.editorValue) {
        if (this.operators[symbol]) {
          current().push({
            symbol,
            index,
            operation: this.operators[symbol],
          })
        } else if (symbol == '[') {
          let newLevel = []
          current().push(newLevel)
          stack.push(newLevel)
          current().push({ symbol, index })
        } else if (symbol == ']') {
          if (stack.length > 1) stack.pop().push({ symbol, index })
          else return void (this.bracketError = true)
        }
        index += 1
      }

      if (stack.length != 1) return void (this.bracketError = true)
      this.operations = operations
      this.stack.push({ operations, pc: 0 })
    },
    step() {
      if (this.current.loop >= this.maxLoop)
        return void (this.infiniteLoop = true)
      let operation = this.current.operations[this.current.pc]
      if (operation instanceof Array) {
        this.stack.push({ operations: operation, pc: 0, loop: 0 })
        operation = this.current.operations[this.current.pc]
      }
      if (operation === undefined) return void (this.programEnd = true)
      switch (operation?.symbol) {
        default:
          operation.operation(this)
          break
        case '[':
          if (this.currentValue == 0) this.stack.pop()
          break
        case ']':
          if (this.currentValue == 0) {
            this.stack.pop()
          } else {
            this.current.pc = 0
            this.current.loop += 1
          }
          break
      }
      this.pc = operation?.index
      this.current.pc += 1
    },
    run() {
      if (this.speedIndex == this.speeds.length - 1) {
        while (!this.programEnd && !this.infiniteLoop) this.step()
      } else {
        this.timer = setInterval(() => {
          if (!this.programEnd && !this.infiniteLoop) this.step()
          else this.stop()
        }, 1000 / this.speeds[this.speedIndex])
      }
    },
    stop() {
      clearInterval(this.timer)
      this.timer = undefined
    },
  },
}
</script>

<style scoped>
.cell {
  width: 100%;
  position: relative;
  padding-left: 4px;
  padding-right: 4px;
}

.cell-value {
  text-align: center;
  line-height: 36px;
  background-color: rgba(128, 128, 128, 0.1);
  border-radius: 4px !important;
}

.cell-index {
  position: absolute;
  left: 4px;
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 1rem;
}

.cell-char {
  position: absolute;
  right: 4px;
  font-size: 0.75rem;
  font-weight: 300;
  line-height: 1rem;
}
</style>
