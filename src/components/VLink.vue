<template>
  <a class="a" :class="`${color}--text`">
    <v-icon v-if="external || icon" small :color="color">
      {{ external ? 'mdi-link-variant' : icon }}
    </v-icon>
    <slot />
    <div class="underline" :class="color" />
  </a>
</template>

<script>
export default {
  name: 'VLink',
  props: {
    color: { type: String, default: 'primary' },
    icon: { type: String, default: '' },
    external: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
.a {
  position: relative;
  display: inline-block;
  overflow: hidden;
  text-decoration: none;
  vertical-align: top;
  outline: 0;
}

.a .underline {
  position: absolute;
  top: auto;
  bottom: 1px;
  left: 0;
  width: 100%;
  height: 1px;
  content: ' ';
  -webkit-transition: all 0.2s;
  transition: all 0.2s;
  -webkit-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

a:hover .underline {
  transform: scaleX(1);
}
</style>
