<template>
  <div>
    <v-divider class="my-4" />
    <ul>
      <template v-for="item in tutorials">
        <li :key="item[0]" v-if="!item[2] || $root.locale == item[2]">
          <v-link :href="item[1]" target="_blank" external>
            {{ item[0] }}
          </v-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import VLink from '@/components/VLink.vue'

export default {
  name: 'TutorialList',
  components: {
    VLink,
  },
  props: {
    tutorials: Array,
  },
}
</script>
