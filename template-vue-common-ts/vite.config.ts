import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/css/custom.scss";'
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  plugins: [
    vue(),
    ElementPlus({}),
    AutoImport({
      resolvers: [
        ElementPlusResolver()
      ],
      imports: [
        'vue',
        {
          'vue-router': [
            'createRouter',
            'createWebHashHistory'
          ]
        },
        {
          'pinia': [
            'createPinia', 
            'defineStore'
          ]
        },
        {
          'axios': [
            [ 'default', 'axios' ]
          ]
        },
        {
          'vue-toastification': [
            'useToast',
            [ 'default', 'Toast' ]
          ]
        },
        {
          'crypto-js': [
            [ 'default', 'CryptoJS' ]
          ]
        }, 
        {
          from: 'vue-router',
          imports: [ 'RouteRecordRaw' ],
          type: true
        },
        {
          from: 'axios',
          imports: [ 'AxiosInstance', 'InternalAxiosRequestConfig' ],
          type: true
        }
      ],
      dirs: [
        './src/apiservices/',
        './src/apiservices/apis',
        './src/composables/',
        './src/router',
        './src/services/common/', 
        './src/services/system/',
        './src/store',
        './src/types/injectkeys/'
      ]
    }),
    Components({
      resolvers: [
        ElementPlusResolver()
      ]
    })
  ],

})
