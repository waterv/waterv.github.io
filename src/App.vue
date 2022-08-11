<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = true" />
      <v-toolbar-title v-text="title" />
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
      style="user-select: none"
    >
      <v-list-item class="pt-8" three-line @click="randomSlogan">
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            <v-icon v-text="'mdi-wrench'" />
            {{ $t('app.name') }}
          </v-list-item-title>
          <v-list-item-subtitle v-text="slogan[sloganNo]" />
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list nav dense>
        <template v-for="item in items">
          <v-list-item
            v-if="item.icon"
            color="primary"
            :key="item.name"
            :to="item.to || `/${item.name}`"
            replace
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$t(`route.${item.name}`)" />
            </v-list-item-content>
          </v-list-item>

          <v-subheader
            v-else
            :key="item.name"
            v-text="$t(`route.${item.name}._`)"
          />

          <v-list-item
            v-for="child in item.children"
            color="primary"
            :key="child.name"
            :to="child.to || `/${item.name}/${child.name}`"
            replace
          >
            <v-list-item-icon>
              <v-icon v-text="child.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="$t(`route.${item.name}.${child.name}`)"
              />
            </v-list-item-content>
          </v-list-item>
        </template>

        <v-divider />

        <v-subheader
          v-text="
            $t('settings.version', [
              dayjs(version.time).format('YYYY-MM-DD HH:mm:ss'),
            ])
          "
        />
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
let slogan = require('@/data/slogan.json')
export default {
  name: 'App',
  data: () => ({
    dayjs: require('dayjs'),
    version: require('@/data/time.json'),
    drawer: false,
    items: [
      { icon: 'mdi-home', name: 'home', to: '/' },
      { name: 'editor', children: [{ icon: 'mdi-regex', name: 'regexp' }] },
    ],
    slogan,
    sloganNo: 0,
  }),
  computed: {
    title() {
      if (this.$route.fullPath == '/') return this.$t('app.name')
      return this.$t('route' + this.$route.fullPath.replaceAll('/', '.'))
    },
  },
  mounted() {
    this.randomSlogan()
  },
  methods: {
    randomSlogan() {
      this.sloganNo = Math.floor(Math.random() * slogan.length)
    },
  },
}
</script>

<style>
body {
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
    Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui,
    'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}
</style>
