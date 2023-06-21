<template>
  <div class="keep-talking">
    <v-expansion-panels v-model="panel" class="mt-4">
      <!-- Wire -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('kt.wire') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row
            v-for="i in $range(6)"
            :key="i"
            no-gutters
            class="justify-center mb-2"
          >
            <v-btn-toggle v-model="wires[i]" mandatory dense borderless>
              <v-btn v-for="j in $range(6)" :key="j" :value="wireValues[j]">
                <v-icon :color="wireColors[j]" v-text="wireIcons[j]" />
              </v-btn>
            </v-btn-toggle>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  class="ml-2"
                  :disabled="!wireResult[i]"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon v-text="wireResult[i].icon" />
                </v-btn>
              </template>
              <span v-text="wireResult[i].hint" />
            </v-tooltip>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <!-- Memory -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('kt.memory') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field
            class="mt-2"
            :label="$t('kt.digits')"
            :hint="$t('kt.digitsHint')"
            outlined
            v-model="digits"
            :rules="digitsRule"
            clearable
          />

          <v-row
            v-for="(v, i) in digitsResult"
            :key="i"
            no-gutters
            class="justify-center mb-2"
          >
            <template v-if="v.button.length == 4">
              <v-btn-toggle dense borderless>
                <v-btn disabled>
                  <v-icon v-text="`mdi-numeric-${v.screen + 1}-box`" />
                </v-btn>
                <v-btn v-for="(n, j) in v.button" :key="j">
                  <v-icon
                    v-text="`mdi-numeric-${n}-box-outline`"
                    :color="v.pos == j ? 'primary' : ''"
                  />
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>

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

          <v-divider class="my-2" />

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

    wires: ['red', 'red', 'red', undefined, undefined, undefined],
    wireValues: [undefined, 'red', 'blue', 'yellow', 'white', 'black'],
    wireIcons: [
      'mdi-circle-off-outline',
      'mdi-alpha-r-circle',
      'mdi-alpha-b-circle',
      'mdi-alpha-y-circle',
      'mdi-alpha-w-circle-outline',
      'mdi-alpha-b-circle',
    ],
    wireColors: ['', 'red', 'blue', 'orange', '', ''],

    digits: '',

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
    seqIcons: [
      'mdi-alpha-r-circle',
      'mdi-alpha-b-circle',
      'mdi-alpha-b-circle',
    ],
    seqColors: ['red', 'blue', ''],

    step: 1,
    pos: ['01', '52', '44', '45'],
    maze: kt.mazes[1263],
    // mazes 字段中:
    // - 迷宫编号格式为 xyxy (1 <= x, y <= 6).
    // - 迷宫格子用 2 位整数表示, 高位表示能否向右, 低位表示能否向下.
    path: [],
    dirs: [],
    mazeDirs: [
      { xOffset: 1, yOffset: 0, dir: 'right' },
      { xOffset: 0, yOffset: 1, dir: 'down' },
      { xOffset: -1, yOffset: 0, dir: 'left' },
      { xOffset: 0, yOffset: -1, dir: 'up' },
    ],

    chars: '',
  }),
  mounted() {
    let bfsResult = this.bfs([4, 4, 4, 5])
    this.path = bfsResult.path
    this.dirs = bfsResult.dirs
  },
  computed: {
    wireResult() {
      let arr = this.wires.filter(v => v)
      let [even, odd] = [false, true].map(v => this.wireResults(arr, v))
      let result = ['', '', '', '', '', '', '']
      let map = [...this.wires.entries()].filter(v => v[1]) // 过滤掉 falsy 值的 arr 下标到 this.wires 下标的映射
      result[map[odd]?.[0] ?? 6] = {
        icon: 'mdi-tag',
        hint: this.$t('kt.wireInst[1]'),
      }
      result[map[even]?.[0] ?? 6] = {
        icon: 'mdi-content-cut',
        hint: this.$t('kt.wireInst[0]'),
      }
      return result
    },
    digitsRule() {
      return [
        v =>
          Array.from(v).every(c => '1' <= c && c <= '4') ||
          this.$t('kt.rule.notdigits'),
        v =>
          v
            .match(/[1-4]{0,5}/g) // 量词会贪心, 尽可能匹配长度为 5 的子串
            .every(
              str =>
                [...new Set(Array.from(str.slice(1)))].length ==
                str.slice(1).length // 去重和不去重长度相同, 即无重复元素
            ) || this.$t('kt.rule.notpermutation'),
      ]
    },
    digitsResult() {
      if (!this.digitsRule.every(f => f(this.digits) === true)) return {}
      let data = this.digits.match(/[1-4]{0,5}/g).map(str => ({
        screen: Number(str.slice(0, 1)) - 1,
        button: str.slice(1),
      }))
      let choose = ({ i, num, pos, sameNumStage, samePosStage }) => {
        Object.assign(data[i], {
          num:
            num ??
            data[i].button[pos] ??
            data[sameNumStage]?.num ??
            data[i].button[data[samePosStage]?.pos],
          pos:
            (num && data[i].button.indexOf(num)) ??
            pos ??
            (data[sameNumStage]?.num &&
              data[i].button.indexOf(data[sameNumStage]?.num)) ??
            data[samePosStage]?.pos,
        })
      }
      for (let [i, v] of data.entries()) {
        if (v.button.length < 4) break
        switch (i) {
          case 0:
            choose({ i, pos: [1, 1, 2, 3][v.screen] })
            break
          case 1:
            switch (v.screen) {
              case 0:
                choose({ i, num: '4' })
                break
              case 2:
                choose({ i, pos: 0 })
                break
              default:
                choose({ i, samePosStage: 0 })
                break
            }
            break
          case 2:
            switch (v.screen) {
              case 2:
                choose({ i, pos: 2 })
                break
              case 3:
                choose({ i, num: '4' })
                break
              default:
                choose({ i, sameNumStage: [1, 0][v.screen] })
            }
            break
          case 3:
            if (v.screen == 1) choose({ i, pos: 0 })
            else choose({ i, samePosStage: [0, 0, 1, 1][v.screen] })
            break
          case 4:
            choose({ i, sameNumStage: [0, 1, 3, 2][v.screen] })
        }
      }
      return data
    },
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
        let matches = {}
        let matchTime = 0
        Array.from(word).forEach(char => {
          if (morseTranslation.indexOf(char) != -1) {
            wordResult.push('primary--text')
            if (!matches[char]) {
              matches[char] = true
              matchTime += 1
            }
          } else wordResult.push('')
        })
        result[word] = {
          value: wordResult,
          valid: matchTime && matchTime == letterCount,
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
    wireResults(arr, isOdd) {
      let count = color => arr.filter(v => v == color).length
      let last = color => arr[arr.length - 1] == color
      switch (arr.length) {
        case 3:
          if (count('red') == 0) return 1
          if (last('white')) return 2
          if (count('blue') > 1) return arr.lastIndexOf('blue')
          return 2
        case 4:
          if (count('red') > 1 && isOdd) return arr.lastIndexOf('red')
          if (count('red') == 0 && last('yellow')) return 0
          if (count('blue') == 1) return 0
          if (count('yellow') > 1) return 3
          return 1
        case 5:
          if (last('black') && isOdd) return 3
          if (count('red') == 1 && count('yellow') > 1) return 0
          if (count('black') == 0) return 1
          return 0
        case 6:
          if (count('yellow') == 0 && isOdd) return 2
          if (count('yellow') == 1 && count('white') > 1) return 3
          if (count('red') == 0) return 5
          return 3
      }
    },
    toggleCompState(i) {
      this.compState[this.compIndices[i]] = !this.compState[this.compIndices[i]]
      // this.compStateInteger = eval('0b' + this.compState.map(Number).join(''))
      this.compStateInteger = parseInt(this.compState.map(Number).join(''), 2)
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
      let pushMemo = (memo, mode) => {
        let { xOffset, yOffset, dir } = this.mazeDirs[mode]
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
      for (; !result; result = bfs(memos.shift()));
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
