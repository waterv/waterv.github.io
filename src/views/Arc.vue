<template>
  <div class="arc-helper">
    <v-expansion-panels v-model="panel" class="mt-4">
      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('arc.constScoreTo') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <tbody>
              <tr>
                <td>{{ $t('arc.chartConstant') }}</td>
                <td>
                  <v-number-field v-model="chartConst" dense hide-details />
                </td>
              </tr>
              <tr>
                <td>{{ $t('arc.chartScore') }}</td>
                <td>
                  <v-number-field v-model="chartScore" dense hide-details />
                </td>
              </tr>
              <tr>
                <td>{{ $t('arc.chartPotential') }}</td>
                <td>{{ chartPotential.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.stepExperience') }}</td>
                <td>{{ stepExperience.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.overExperience') }}</td>
                <td>{{ overExperience.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.stepResult') }}</td>
                <td>{{ stepResult.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.overResult') }}</td>
                <td>{{ overResult.toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>{{ $t('arc.beyondResult') }}</td>
                <td>{{ beyondBoostProgress.toFixed(2) }}%</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('arc.step') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <thead>
              <tr>
                <th v-for="i in $range(3)" :key="i">
                  {{ $t(`arc.theads[${i}]`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="2">{{ $t('arc.stepPlay') }}</td>
                <td>{{ stepPlay.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.stepPartner') }}</td>
                <td>
                  <v-number-field
                    class="my-3"
                    v-model="step"
                    :label="$t('arc.property', ['STEP'])"
                    hide-details
                  />
                </td>
                <td>{{ factor(step).toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.stepStamina') }}</td>
                <td>
                  <v-radio-group v-model="stepStamina" row>
                    <v-radio
                      v-for="v in staminas"
                      :key="v"
                      :label="`x${v}`"
                      :value="v"
                    />
                  </v-radio-group>
                </td>
                <td>{{ stepStamina }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.stepFragment') }}</td>
                <td>
                  <v-radio-group v-model="stepFrag" row>
                    <v-radio
                      v-for="v in frags"
                      :key="v"
                      :label="`${v}`"
                      :value="v"
                    />
                  </v-radio-group>
                </td>
                <td>{{ fragBuff(stepFrag) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.memoryBoost') }}</td>
                <td><v-switch v-model="stepBoost" /></td>
                <td>{{ stepBoostFactor }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.range') }}</td>
                <td>
                  <v-number-field
                    class="mt-3"
                    v-model="stepMin"
                    :label="$t('_.min')"
                    hide-details
                  />
                  <v-number-field
                    class="mb-3"
                    v-model="stepMax"
                    :label="$t('_.max')"
                    hide-details
                  />
                </td>
                <td />
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('arc.over') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table>
            <thead>
              <tr>
                <th v-for="i in $range(3)" :key="i">
                  {{ $t(`arc.theads[${i}]`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $t('arc.fantastic') }}</td>
                <td>
                  <v-number-field
                    class="my-3"
                    v-model="mapFactor"
                    :label="$t('arc.mapFactor')"
                    hide-details
                  />
                  <v-switch
                    v-model="beyondChallenge"
                    :label="$t('arc.beyondChallenge')"
                  />
                </td>
                <td>{{ overPlay.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.overPartner') }}</td>
                <td>
                  <v-number-field
                    class="my-3"
                    v-model="over"
                    :label="$t('arc.property', ['OVER'])"
                    hide-details
                  />
                </td>
                <td>{{ factor(over).toFixed(2) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.affinity') }}</td>
                <td><v-number-field v-model="affinity" /></td>
                <td>{{ affinity }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.overFragment') }}</td>
                <td>
                  <v-radio-group v-model="overFrag" row>
                    <v-radio
                      v-for="v in frags"
                      :key="v"
                      :label="`${v}`"
                      :value="v"
                    />
                  </v-radio-group>
                </td>
                <td>{{ fragBuff(overFrag) }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.memoryBoost') }}</td>
                <td><v-switch v-model="overBoost" /></td>
                <td />
              </tr>
              <tr>
                <td>{{ $t('arc.beyondBoost') }}</td>
                <td>
                  <v-radio-group v-model="beyondBoost" row>
                    <v-radio
                      v-for="v in beyondBoosts"
                      :key="v"
                      :label="`x${v}`"
                      :value="v"
                    />
                  </v-radio-group>
                </td>
                <td>{{ overBoostFactor }}</td>
              </tr>
              <tr>
                <td>{{ $t('arc.range') }}</td>
                <td>
                  <v-number-field
                    class="mt-3"
                    v-model="overMin"
                    :label="$t('_.min')"
                    hide-details
                  />
                  <v-number-field
                    class="mb-3"
                    v-model="overMax"
                    :label="$t('_.max')"
                    hide-details
                  />
                </td>
                <td />
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('arc.stepToConstScore') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table fixed-header height="300px">
            <thead>
              <tr>
                <th v-for="i in $range(3)" :key="i">
                  {{ $t(`arc.rangeTheads[${i}]`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v, i) in stepTargetConstScores.low" :key="i">
                <td>{{ v.constant }}</td>
                <td>{{ v.min }}</td>
                <td>{{ v.max }}</td>
              </tr>
              <tr v-if="isFinite(stepTargetConstScores.exMinConst)">
                <td>
                  {{ stepTargetConstScores.exMinConst }} ~
                  {{ stepTargetConstScores.exMaxConst }}
                </td>
                <td>EX</td>
                <td>PM</td>
              </tr>
              <tr v-for="(v, i) in stepTargetConstScores.high" :key="120 + i">
                <td>{{ v.constant }}</td>
                <td>{{ v.min }}</td>
                <td>{{ v.max }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          {{ $t('arc.overToConstScore') }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-simple-table fixed-header height="300px">
            <thead>
              <tr>
                <th v-for="i in $range(3)" :key="i">
                  {{ $t(`arc.rangeTheads[${i}]`) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(v, i) in overTargetConstScores.low" :key="i">
                <td>{{ v.constant }}</td>
                <td>{{ v.min }}</td>
                <td>{{ v.max }}</td>
              </tr>
              <tr v-if="isFinite(overTargetConstScores.exMinConst)">
                <td>
                  {{ overTargetConstScores.exMinConst }} ~
                  {{ overTargetConstScores.exMaxConst }}
                </td>
                <td>EX</td>
                <td>PM</td>
              </tr>
              <tr v-for="(v, i) in overTargetConstScores.high" :key="120 + i">
                <td>{{ v.constant }}</td>
                <td>{{ v.min }}</td>
                <td>{{ v.max }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <tutorial-list :tutorials="tutorials" />
  </div>
</template>

<script>
import VNumberField from '@/components/VNumberField.vue'
import TutorialList from '@/components/TutorialList.vue'
let arc = require('@/data/arc.json')

export default {
  name: 'ArcHelper',
  components: { VNumberField, TutorialList },
  data: () => ({
    ...arc,
    panel: 0,

    chartConst: null,
    chartScore: null,

    step: 50,
    stepStamina: 1,
    stepFrag: 0,
    stepBoost: false,
    stepMin: null,
    stepMax: null,

    beyondChallenge: true,
    over: 50,
    affinity: 1,
    overFrag: 0,
    beyondBoost: 1,
    overBoost: false,
    overMin: null,
    overMax: null,

    staminas: [1, 2, 4, 6],
    frags: [0, 100, 250, 500],
    beyondBoosts: [1, 2, 3],
    mapFactor: 2.8,
  }),
  computed: {
    chartPotential() {
      if (this.chartScore >= 10_000_000) return this.chartConst + 2
      if (this.chartScore >= 9_800_000)
        return this.chartConst + 1 + (this.chartScore - 9_800_000) / 200_000
      return Math.max(
        this.chartConst + (this.chartScore - 9_500_000) / 300_000,
        0
      )
    },
    stepExperience() {
      return (
        6 * this.chartPotential * this.stepStamina * (this.stepBoost ? 4 : 1)
      )
    },
    overExperience() {
      return 6 * this.chartPotential * (this.overBoost ? 4 : 1)
    },
    stepPlay() {
      return 2.5 + 2.45 * Math.sqrt(this.chartPotential)
    },
    stepBoostFactor() {
      return this.stepBoost ? 4 : 1
    },
    stepResult() {
      return (
        this.stepPlay *
        this.factor(this.step) *
        this.stepStamina *
        this.fragBuff(this.stepFrag) *
        this.stepBoostFactor
      )
    },
    overPlay() {
      return (
        (2.5 * (this.beyondChallenge ? 3 : 1) +
          2.45 * Math.sqrt(this.chartPotential)) /
        this.mapFactor
      )
    },
    overBoostFactor() {
      return (this.overBoost ? 2 : 0) + this.beyondBoost
    },
    overResult() {
      return (
        this.overPlay *
        this.factor(this.over) *
        this.affinity *
        this.fragBuff(this.overFrag) *
        this.overBoostFactor
      )
    },
    beyondBoostProgress() {
      return 27 + 2.45 * Math.sqrt(this.chartPotential)
    },
    stepTargetConstScores() {
      return this.targetConstScoresBetween(
        this.stepPtt(this.stepMin),
        this.stepPtt(this.stepMax)
      )
    },
    overTargetConstScores() {
      return this.targetConstScoresBetween(
        this.overPtt(this.overMin),
        this.overPtt(this.overMax)
      )
    },
  },
  methods: {
    factor(property) {
      return property / 50
    },
    fragBuff(frag) {
      if (frag == 500) return 1.5
      if (frag == 250) return 1.25
      if (frag == 100) return 1.1
      return 1
    },
    stepPtt(step) {
      return Math.pow(
        (step /
          (this.factor(this.step) *
            this.stepStamina *
            this.fragBuff(this.stepFrag) *
            this.stepBoostFactor) -
          2.5) /
          2.45,
        2
      )
    },
    overPtt(over) {
      return Math.pow(
        ((this.mapFactor * over) /
          (this.factor(this.over) *
            this.affinity *
            this.fragBuff(this.overFrag) *
            this.overBoostFactor) -
          2.5 * (this.beyondChallenge ? 3 : 1)) /
          2.45,
        2
      )
    },
    score(ptt, constant) {
      let dist = ptt - constant
      if (dist >= 2) return 10_000_000
      if (dist >= 1) return 9_800_000 + (dist - 1) * 200_000
      return 9_500_000 + dist * 300_000
    },
    targetConstScoreOf(ptt) {
      let upper = Math.floor(ptt * 10 + 0.5)
      let lower = Math.floor(ptt * 10)
      let min = Math.max(upper - 20, 10)
      let max = Math.min(lower - 10, 120)
      let result = { min, max }
      for (let constant = min; constant <= max; constant += 1)
        result[constant] = this.score(ptt, constant / 10)
      return result
    },
    targetConstScoresBetween(pttMin, pttMax) {
      let min = this.targetConstScoreOf(pttMin)
      let max = this.targetConstScoreOf(pttMax)
      let result = {
        exMinConst: Infinity,
        exMaxConst: 0,
        low: [],
        high: [],
      }
      let split = num =>
        `${num}`
          .split('')
          .reverse()
          .join('')
          .match(/\d{1,3}/g)
          .join(',')
          .split('')
          .reverse()
          .join('')
      for (let constant = min.min; constant <= max.max; constant += 1) {
        let range = {
          constant: (constant / 10).toFixed(1),
          min: Math.ceil(min[constant] ?? 9_800_000),
          max: Math.floor(max[constant] ?? 10_000_000),
        }
        if (range.min > range.max) continue
        if (constant < 80 && constant % 5 != 0) continue // 8 级以下谱面按 0.5 细分定数
        if (range.min == 9_800_000 && range.max == 10_000_000) {
          result.exMinConst = Math.min(result.exMinConst, constant)
          result.exMaxConst = Math.max(result.exMaxConst, constant)
          continue
        }
        if (range.min == 9_800_000) range.min = 'EX'
        else if (range.min == 10_000_000) range.min = 'PM'
        else range.min = split(range.min)
        if (range.max == 10_000_000) range.max = 'PM'
        else range.max = split(range.max)
        if (constant < result.exMinConst) result.low.push(range)
        else if (constant > result.exMaxConst) result.high.push(range)
      }
      result.exMinConst = (result.exMinConst / 10).toFixed(1)
      result.exMaxConst = (result.exMaxConst / 10).toFixed(1)
      return result
    },
  },
}
</script>
