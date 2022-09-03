<!--
  mazes 字段中:
  - 迷宫编号格式为 xyxy (1 <= x, y <= 6).
  - 迷宫格子用 2 位整数表示, 高位表示能否向右, 低位表示能否向下.
-->

<template>
  <div class="keep-talking">
    <v-expansion-panels v-model="panel" class="mt-4">
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
          <v-icon
            v-for="(dir, i) in dirs"
            :key="i"
            v-text="`mdi-arrow-${dir}`"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

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
              >
                {{ char }}
              </span>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
let kt = require('@/data/keeptalking.json')
kt.passwords = kt.passwords.map(word => Array.from(word))

export default {
  name: 'KeepTalking',
  data: () => ({
    kt,
    panel: 0,

    chars: '',

    step: 1,
    pos: ['01', '52', '44', '45'],
    maze: kt.mazes[1263],
    path: [],
    dirs: [],
  }),
  mounted() {
    let bfsResult = this.bfs([4, 4, 4, 5])
    this.path = bfsResult.path
    this.dirs = bfsResult.dirs
  },
  computed: {
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
