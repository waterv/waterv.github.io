<template>
  <v-text-field
    v-model="str"
    type="number"
    :label="label"
    :disabled="disabled"
    :dense="dense"
    :hide-details="hideDetails"
    :rules="rules"
    @change="update"
    @input="update"
  />
</template>

<script>
export default {
  name: 'VNumberField',
  props: {
    dense: Boolean,
    disabled: Boolean,
    hideDetails: Boolean,
    label: String,
    value: Number,
  },
  model: {
    prop: 'value',
    event: 'update-value',
  },
  data: that => ({
    str:
      that.value === null || that.value === undefined
        ? undefined
        : `${that.value}`,
    rules: [() => !isNaN(parseFloat(that.str))],
  }),
  methods: {
    update(v) {
      this.$emit('update-value', parseFloat(v))
    },
  },
}
</script>
