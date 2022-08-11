const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  publicPath: './',

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = '神必工具箱'
      return args
    })
  },

  pwa: {
    workboxPluginMode: 'GenerateSW',
    name: '神必工具箱',
    themeColor: '#212121',
    msTileColor: '#212121',
    appleMobileWebAppStatusBarStyle: 'black',
  },

  pluginOptions: {
    i18n: {
      locale: 'zh-CN',
      fallbackLocale: 'zh-CN',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false,
    },
  },
})
