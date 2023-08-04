import App from './App.vue'
import 'vue-toastification/dist/index.css'
import './extensions'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

console.log(import.meta.env.VITE_APP_MODE)

const app = createApp(App)

app.use(store)
app.use(router)
app.use(Toast)

// 註冊Element Plus的icon物件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')

routerProcess()
