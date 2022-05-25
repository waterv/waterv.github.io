<template>
  <van-config-provider :theme="theme">
    <router-view />
  </van-config-provider>
</template>

<script>
export default {
  data() {
    let theme = ''
    if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      theme = 'dark'
    return {
      theme,
    }
  },

  mounted() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        if (event.matches) {
          this.theme = 'dark'
        } else {
          this.theme = ''
        }
      })
  },
}
</script>

<style>
body {
  min-width: 100vw;
  margin: 0;
  padding-bottom: 20px;
  overflow-x: auto;
  color: #323233;
  font-size: 14px;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
    Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui,
    'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  background-color: #f7f8fa;
  -webkit-font-smoothing: antialiased;
}

body.van-theme-dark {
  color: rgba(255, 255, 255, 0.75);
  background-color: #202124;
}

.content {
  margin: 5px 16px;
}
</style>
