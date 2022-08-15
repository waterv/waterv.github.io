<template>
  <v-btn
    :color="checked ? 'primary' : 'grey'"
    icon
    @click="$emit('change', !checked)"
  >
    <v-icon v-text="`mdi-circle-${checked ? 'slice-8' : 'outline'}`" />
  </v-btn>
</template>

<script>
export default {
  name: 'BrailleKey',
  props: {
    checked: Boolean,
  },
  model: {
    prop: 'checked',
    event: 'change',
  },
}
</script>
