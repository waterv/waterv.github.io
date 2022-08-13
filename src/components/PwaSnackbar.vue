<template>
  <v-app style="position: fixed; left: 0; top: 0">
    <v-snackbar v-model="value" class="safe-bottom">
      {{ $t(message) }}
      <template #action="{ attrs }">
        <v-btn
          v-if="button"
          color="primary"
          text
          v-bind="attrs"
          @click="$emit('confirm')"
        >
          {{ $t(buttonMessage || '_.confirm') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'PwaSnackbar',
  props: {
    message: String,
    buttonMessage: String,
    button: Boolean,
  },
  data: () => ({
    value: false,
  }),
}
</script>
