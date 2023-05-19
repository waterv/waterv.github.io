<template>
  <div
    v-if="value !== null"
    class="eleven-nimmt-card no-select"
    :style="{
      boxShadow: `0 ${2 * depth - 2}px 0 #444`,
      marginBottom: `${2 * depth}px`,
      opacity: disabled ? 0.4 : 1,
      filter:
        (disabled ? 'grayscale(0.6)' : '') +
        (selected ? 'drop-shadow(0 10px 4px rgba(0, 0, 0, 0.5))' : ''),
      transform: selected ? 'translateY(-10px)' : '',
    }"
    :class="`cow-${score}`"
    @click="$emit('click')"
  >
    <template v-if="value != -1">
      <div class="score">
        {{ score }}
        <v-icon v-text="'mdi-cow'" />
      </div>
      <div class="inner">
        {{ value }}
      </div>
    </template>
    <template v-else>
      <div class="inner">
        <v-icon v-text="'mdi-plus-circle'" />
      </div>
    </template>
  </div>
  <div v-else class="eleven-nimmt-card-placeholder no-select" />
</template>

<script>
export default {
  name: 'NimmtPile',
  props: {
    value: Number,
    depth: Number,
    disabled: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
  },
  computed: {
    score() {
      let primes = [
        2, 5, 7, 11, 17, 19, 29, 31, 37, 41, 47, 59, 61, 67, 71, 79, 89, 97,
      ]
      if (this.value == -1) return 0
      if ([33, 63, 93].includes(this.value)) return 7
      if (this.value % 10 == 3) return 5
      if (primes.includes(this.value)) return 3
      return 1
    },
  },
}
</script>

<style scoped>
.eleven-nimmt-card {
  position: relative;
  display: inline-block;
  margin: 2px;
  width: 80px;
  height: 120px;
  border: solid 2px #444;
  border-radius: 8px;
  padding: 8px;
  background-color: #fff;
  transition: all 0.5s;
  vertical-align: bottom;
}

.eleven-nimmt-card-placeholder {
  position: relative;
  display: inline-block;
  margin: 2px;
  width: 80px;
  height: 120px;
  border: dotted 2px #666;
  border-radius: 8px;
  vertical-align: bottom;
}

.eleven-nimmt-card .inner {
  width: 100%;
  height: 100%;
  border-radius: 6px;
  line-height: 100px;
  text-align: center;
  text-shadow: 2px 2px #fff;
  font-size: 2em;
  font-weight: bold;
}

.eleven-nimmt-card.cow-1 .inner {
  color: #479edf;
  background-color: #8bc8ef;
}

.eleven-nimmt-card.cow-1 .score {
  color: #000000;
}

.eleven-nimmt-card.cow-3 .inner {
  color: #9accf2;
  background-color: #f9d94c;
}

.eleven-nimmt-card.cow-3 .score {
  color: #7c3a7f;
}

.eleven-nimmt-card.cow-5 .inner {
  color: #b6cd51;
  background-color: #71bfc4;
}

.eleven-nimmt-card.cow-5 .score {
  color: #326fa5;
}

.eleven-nimmt-card.cow-7 .inner {
  color: #b23725;
  background-color: #040404;
}

.eleven-nimmt-card.cow-7 .score {
  color: #b23725;
}

.eleven-nimmt-card.cow-0 .inner {
  color: #000;
  background-color: #eee;
}

.eleven-nimmt-card .score {
  position: absolute;
  top: 8px;
  width: 64px;
  text-align: center;
}

.eleven-nimmt-card .inner .v-icon,
.eleven-nimmt-card .score .v-icon {
  color: inherit;
}
</style>
