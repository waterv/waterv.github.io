import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { NavBar, Button, Empty } from 'vant'
import { ConfigProvider } from 'vant'
import '@vant/touch-emulator'

let app = createApp(App)
app.use(router)

app.use(NavBar)
app.use(Button)
app.use(Empty)
app.use(ConfigProvider)

app.mount('#app')
