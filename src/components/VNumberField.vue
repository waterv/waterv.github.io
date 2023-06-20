<template>
  <v-text-field
    v-model="str"
    type="number"
    :label="label"
    :disabled="disabled"
    :outlined="outlined"
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
    label: String,
    disabled: Boolean,
    outlined: Boolean,
    dense: Boolean,
    hideDetails: Boolean,
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
