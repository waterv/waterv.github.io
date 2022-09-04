<!--
  mazes 字段中:
  - 迷宫编号格式为 xyxy (1 <= x, y <= 6).
  - 迷宫格子用 2 位整数表示, 高位表示能否向右, 低位表示能否向下.
-->

<template>
  <div class="keep-talking">
    <v-expansion-panels v-model="panel" class="mt-4">
      <!-- Morse -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('kt.morse') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            class="mt-2"
            :label="$t('kt.morseCode')"
            :hint="$t('kt.morseCodeHint')"
            outlined
            v-model="morse"
            :rules="morseRule"
            clearable
          />
          {{ morseTranslation }}
          <v-divider class="my-4" />
          <v-row no-gutters>
            <v-col
              v-for="(freq, word) in kt.morseWords"
              :key="freq"
              cols="6"
              sm="4"
              lg="3"
            >
              <span
                :class="{
                  'text--disabled': !morseResult[word].valid,
                  'font-weight-bold': morseResult[word].valid,
                }"
              >
                <span
                  v-for="(char, j) in word"
                  :key="j"
                  class="monospace"
                  :class="morseResult[word].value[j]"
                  v-text="char"
                />
                <small v-text="` - 3.${freq} MHz`" />
              </span>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Complicated Wires -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('kt.comp') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- I hate Karnaugh maps -->
          <v-row no-gutters class="justify-center">
            <v-tooltip v-for="i in $range(4)" :key="i" top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :color="compState[compIndices[i]] ? compColors[i] : 'grey'"
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="toggleCompState(i)"
                >
                  <v-icon v-text="compIcons[i]" />
                </v-btn>
              </template>
              <span v-t="`kt.compState[${i}]`" />
            </v-tooltip>
          </v-row>
          <v-divider />

          <v-row no-gutters class="justify-center">
            <v-btn icon disabled />
            <v-btn icon disabled />
            <v-btn icon disabled><v-icon v-text="compIcons[2]" /></v-btn>
            <v-btn icon disabled><v-icon v-text="compIcons[0]" /></v-btn>
          </v-row>

          <v-row
            v-for="i in $range(4)"
            :key="i"
            no-gutters
            class="justify-center"
          >
            <v-btn v-if="i == 2" icon disabled class="pb-9">
              <v-icon v-text="compIcons[1]" />
            </v-btn>
            <v-btn v-else-if="i == 3" icon disabled class="pb-9">
              <v-icon v-text="compIcons[3]" />
            </v-btn>
            <v-btn v-else icon disabled />
            <v-tooltip v-for="j in $range(4)" :key="j" top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  :color="
                    i == compCellActiveRow && j == compCellActiveCol
                      ? 'primary'
                      : 'grey'
                  "
                  icon
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon>
                    {{ `mdi-alpha-${kt.comp[i][j].toLowerCase()}-box` }}
                  </v-icon>
                </v-btn>
              </template>
              <span v-t="`kt.compInst.${kt.comp[i][j]}`" />
            </v-tooltip>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Wire Sequences -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('kt.seq') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row no-gutters>
            <v-col v-for="i in $range(3)" :key="i" cols="4">
              <v-list dense nav class="text-center">
                <v-icon :color="seqColors[i]" v-text="seqIcons[i]" />
                <v-divider class="my-2" />
                <v-list-item-group v-model="seqState[i]" color="primary">
                  <v-list-item v-for="(v, j) in kt.seq[i]" :key="j">
                    <v-list-item-content>
                      <v-row no-gutters class="justify-center">
                        <span
                          v-for="k in ['A', 'B', 'C']"
                          :key="k"
                          class="monospace mx-1"
                          :class="{
                            'text--placeholder': v.indexOf(k) == -1,
                          }"
                        >
                          {{ k }}
                        </span>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Maze -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('kt.maze') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-stepper v-model="step" class="mb-4" flat non-linear>
            <v-stepper-header>
              <template v-for="i in $range(4)">
                <v-stepper-step :key="2 * i" :step="i + 1" editable>
                  {{ $t(`kt.pos[${i}]`) }}
                  <small>{{ $t(`kt.posHint[${i}]`) }}</small>
                </v-stepper-step>
                <v-divider :key="2 * i + 1" v-if="i != 3" />
              </template>
            </v-stepper-header>
          </v-stepper>

          <v-row
            v-for="(row, i) in maze"
            :key="i"
            no-gutters
            class="justify-center"
          >
            <div
              v-for="(col, j) in row"
              :key="j"
              :class="{
                'primary lighten-4':
                  path.indexOf(`${j}${i}`) != -1 && !$root.theme,
                'primary darken-2':
                  path.indexOf(`${j}${i}`) != -1 && $root.theme,
              }"
            >
              <div
                v-ripple
                class="maze-cell"
                :class="{
                  'border-top': !i,
                  'border-bottom': !(col & 1),
                  'border-left': !j,
                  'border-right': !(col & 2),
                }"
                @click="setPos(j, i)"
              >
                <div v-for="p in [`${j}${i}`]" :key="p">
                  <v-icon
                    v-if="p == pos[0]"
                    v-text="'mdi-numeric-1-circle-outline'"
                  />
                  <v-icon
                    v-else-if="p == pos[1]"
                    v-text="'mdi-numeric-2-circle-outline'"
                  />
                  <v-icon
                    v-else-if="p == pos[2]"
                    v-text="'mdi-checkbox-blank'"
                  />
                  <v-icon v-else-if="p == pos[3]" v-text="'mdi-triangle'" />
                  <v-icon
                    v-else-if="path.indexOf(`${j}${i}`) != -1"
                    v-text="`mdi-arrow-${dirs[path.indexOf(`${j}${i}`)]}`"
                    class="text--disabled"
                  />
                </div>
              </div>
            </div>
          </v-row>

          <v-divider class="mt-4 mb-2" />
          <v-btn v-for="(dir, i) in dirs" :key="'dir-' + i" icon>
            <v-icon v-text="`mdi-arrow-${dir}`" />
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Password -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('kt.password') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            class="mt-2"
            :label="$t('kt.chars')"
            :hint="$t('kt.charsHint')"
            outlined
            v-model="chars"
            :rules="charsRule"
            clearable
          />
          <v-row no-gutters>
            <v-col
              v-for="(word, i) in kt.passwords"
              :key="i"
              :class="{
                monospace: true,
                'text--disabled': !passwordsResult[i].valid,
                'font-weight-bold': passwordsResult[i].valid,
              }"
              cols="4"
              sm="3"
              lg="2"
            >
              <span
                v-for="(char, j) in word"
                :key="j"
                :class="passwordsResult[i].value[j]"
                v-text="char"
              />
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <tutorial-list :tutorials="kt.tutorials" />
  </div>
</template>

<script>
import TutorialList from '@/components/TutorialList.vue'
let kt = require('@/data/keeptalking.json')
kt.passwords = kt.passwords.map(word => Array.from(word))

export default {
  name: 'KeepTalking',
  components: {
    TutorialList,
  },
  data: () => ({
    kt,
    panel: 0,

    morse: '',

    compState: [false, false, false, false],
    compStateInteger: 0,
    compIcons: [
      'mdi-alarm-light',
      'mdi-alpha-r-circle',
      'mdi-alpha-b-circle',
      'mdi-star',
    ],
    compColors: ['primary', 'red', 'blue', 'primary'],
    compIndices: [2, 1, 3, 0],

    seqState: [0, 0, 0],
    seqIcons: ['mdi-alpha-r-circle', 'mdi-alpha-b-circle', 'mdi-circle'],
    seqColors: ['red', 'blue', ''],

    step: 1,
    pos: ['01', '52', '44', '45'],
    maze: kt.mazes[1263],
    path: [],
    dirs: [],

    chars: '',
  }),
  mounted() {
    let bfsResult = this.bfs([4, 4, 4, 5])
    this.path = bfsResult.path
    this.dirs = bfsResult.dirs
  },
  computed: {
    morseRule() {
      return [
        v =>
          Array.from(v).every(c => '.-/ '.indexOf(c) != -1) ||
          this.$t('kt.rule.notmorse'),
      ]
    },
    morseTranslation() {
      return this.morse
        .split(/[ /]/)
        .map(v => this.kt.morses[v] ?? '◻︎')
        .join('')
    },
    morseResult() {
      let result = {}
      Object.keys(this.kt.morseWords).forEach(word => {
        let morseTranslation = this.morseTranslation.toLowerCase()
        let letterCount = [...new Set(Array.from(morseTranslation))].length
        let wordResult = []
        let matchTime = 0
        Array.from(word).forEach(char => {
          if (morseTranslation.indexOf(char) != -1) {
            wordResult.push('primary--text')
            matchTime += 1
          } else wordResult.push('')
        })
        result[word] = {
          value: wordResult,
          valid: matchTime && matchTime >= letterCount,
        }
      })
      return result
    },
    compCellActiveRow() {
      return [0, 1, 3, 2][Math.floor(this.compStateInteger / 4)]
    },
    compCellActiveCol() {
      return [0, 1, 3, 2][this.compStateInteger % 4]
    },
    charsRule() {
      return [
        v =>
          Array.from(v).every(c => ('A' <= c && c <= 'z') || c == ' ') ||
          this.$t('kt.rule.notchar'),
      ]
    },
    charsArray() {
      return this.chars.toLowerCase().split(' ')
    },
    passwordsResult() {
      return this.kt.passwords.map(word => {
        let wordResult = Array.from(word).map((char, j) =>
          this.charsArray[j] // 不用 ?. 因为 charsArray[j] == ' ' 时也不应触发颜色
            ? this.charsArray[j].indexOf(char) == -1
              ? 'red--text'
              : 'primary--text'
            : ''
        )
        return {
          value: wordResult,
          valid:
            wordResult.indexOf('red--text') == -1 &&
            wordResult.indexOf('primary--text') != -1,
        }
      })
    },
  },
  watch: {
    step() {
      this.maze =
        this.kt.mazes[
          this.pos
            .slice(0, 2)
            .sort()
            .map(v => Number(v) + 11)
            .join('')
        ] || this.kt.mazes.default
      let bfsResult = this.bfs(
        Array.from(this.pos.slice(2, 4).join('')).map(Number)
      )
      this.path = bfsResult.path
      this.dirs = bfsResult.dirs
    },
  },
  methods: {
    toggleCompState(i) {
      this.compState[this.compIndices[i]] = !this.compState[this.compIndices[i]]
      this.compStateInteger = eval('0b' + this.compState.map(Number).join(''))
    },
    seqNext(i) {
      this.seqState[i] = (this.seqState[i] + 1) % 9
    },
    bfs(args) {
      let [x0, y0, x1, y1] = args
      let maze = this.maze.map(row =>
        row.map(col => ({
          right: col & 2,
          bottom: col & 1,
          visited: false,
        }))
      )
      let memos = [{ x: x0, y: y0, path: [`${x0}${y0}`], dirs: [] }]
      let d = [
        { xOffset: 1, yOffset: 0, dir: 'right' },
        { xOffset: 0, yOffset: 1, dir: 'down' },
        { xOffset: -1, yOffset: 0, dir: 'left' },
        { xOffset: 0, yOffset: -1, dir: 'up' },
      ]
      let pushMemo = (memo, mode) => {
        let { xOffset, yOffset, dir } = d[mode]
        let x = memo.x + xOffset
        let y = memo.y + yOffset
        if (maze[y][x].visited) return
        maze[y][x].visited = true
        memos.push({
          x,
          y,
          path: memo.path.concat([`${x}${y}`]),
          dirs: memo.dirs.concat([dir]),
        })
      }
      let bfs = memo => {
        let { x, y } = memo
        if (x == x1 && y1 == y) return memo
        if (maze[y][x].right) pushMemo(memo, 0)
        if (maze[y][x].bottom) pushMemo(memo, 1)
        if (maze[y][x - 1]?.right) pushMemo(memo, 2)
        if (maze[y - 1]?.[x].bottom) pushMemo(memo, 3)
      }
      let result
      while (!(result = bfs(memos.shift())));
      return result
    },
    setPos(x, y) {
      if (this.pos.indexOf(`${x}${y}`) != -1) return
      this.pos[this.step - 1] = `${x}${y}`
      this.step = (this.step % 4) + 1
    },
  },
}
</script>

<style scoped>
.text--placeholder {
  opacity: 0;
}

.maze-cell {
  width: 36px;
  height: 36px;
  padding: 6px;
  cursor: pointer;
  border-width: 0;
  border-style: solid;
  border-color: #757575;
}

.theme--dark .maze-cell {
  border-color: white;
}

.border-left {
  border-left-width: 2px;
}

.border-right {
  border-right-width: 2px;
}

.border-top {
  border-top-width: 2px;
}

.border-bottom {
  border-bottom-width: 2px;
}
</style>
