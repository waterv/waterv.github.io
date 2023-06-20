<template>
  <v-btn
    :color="checked ? color : uncheckedColor"
    icon
    @click="$emit('change', !checked)"
  >
    <v-icon v-text="checked ? icon : uncheckedIcon ?? icon" />
  </v-btn>
</template>

<script>
export default {
  name: 'VToggle',
  props: {
    color: { type: String, default: 'primary' },
    uncheckedColor: String,
    icon: String,
    uncheckedIcon: String,
    checked: Boolean,
  },
  model: {
    prop: 'checked',
    event: 'change',
  },
}
</script>
