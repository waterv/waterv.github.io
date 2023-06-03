<template>
  <div class="spent-bill-calc">
    <v-card class="elevation-2">
      <v-card-text>
        <v-simple-table fixed-header>
          <thead>
            <tr>
              <th class="text-left">{{ $t('split.item') }}</th>
              <th class="text-left">{{ $t('split.original') }}</th>
              <th class="text-left">{{ $t('split.actual') }}</th>
              <th>
                <v-btn icon @click="appendItem">
                  <v-icon v-text="'mdi-plus'" />
                </v-btn>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(v, i) in items" :key="i">
              <td>
                <v-text-field v-model="items[i].name" dense hide-details />
              </td>
              <td>
                <v-number-field v-model="items[i].cost" dense hide-details />
              </td>
              <td class="monospace">{{ actualCost(v.cost).toFixed(2) }}</td>
              <td>
                <v-btn v-if="items.length > 1" icon @click="deleteItem(i)">
                  <v-icon v-text="'mdi-delete'" />
                </v-btn>
              </td>
            </tr>

            <tr>
              <td>{{ $t('split.sum') }}</td>
              <td class="monospace">{{ sum.toFixed(2) }}</td>
              <td>
                <v-number-field v-model="actualSum" dense hide-details />
              </td>
              <td>
                <v-btn icon @click="clearItems">
                  <v-icon v-text="'mdi-broom'" />
                </v-btn>
              </td>
            </tr>

            <tr>
              <td>{{ $t('split.average') }}</td>
              <td class="monospace">{{ average.toFixed(2) }}</td>
              <td class="monospace">{{ actualAverage.toFixed(2) }}</td>
              <td />
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import VNumberField from '@/components/VNumberField.vue'

export default {
  name: 'SpentBillCalc',
  components: { VNumberField },
  data: () => ({
    items: [{ name: '', cost: null }],
    actualSum: null,
  }),
  computed: {
    sum() {
      return this.items.reduce(
        (prev, curr) => prev + parseFloat(`0${curr.cost}`),
        0
      )
    },
    average() {
      return this.sum / this.items.length
    },
    actualAverage() {
      return parseFloat(`0${this.actualSum}`) / this.items.length
    },
  },
  methods: {
    appendItem() {
      this.items.push({ name: '', cost: null })
    },
    deleteItem(index) {
      this.items.splice(index, 1)
    },
    clearItems() {
      this.items = [{ name: '', cost: null }]
      this.actualSum = null
    },
    actualCost(originalCost) {
      return (
        (parseFloat(`0${originalCost}`) / this.sum) *
        parseFloat(`0${this.actualSum}`)
      )
    },
  },
}
</script>
