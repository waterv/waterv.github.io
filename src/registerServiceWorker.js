/* eslint-disable no-console */

import { register } from 'register-service-worker'
import Vue from 'vue'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import Snackbar from './components/PwaSnackbar.vue'

let snackbar = new Vue({ vuetify, i18n, ...Snackbar })
document.body.appendChild(snackbar.$mount().$el)

let showSnackbar = (params, onConfirm) => {
  Object.assign(snackbar, {
    timeout: 5000,
    value: true,
    ...params,
  })
  snackbar.$on('confirm', onConfirm)
}

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
      showSnackbar({ message: 'pwa.cached' })
    },
    updatefound() {
      console.log('New content is downloading.')
      showSnackbar({ message: 'pwa.updatefound' })
    },
    updated(reg) {
      console.log('New content is available; please refresh.')
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
      showSnackbar(
        {
          message: 'pwa.updated',
          timeout: -1,
          button: true,
        },
        () => {
          reg.waiting?.postMessage({ type: 'SKIP_WAITING' })
        }
      )
    },
    offline() {
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
}
