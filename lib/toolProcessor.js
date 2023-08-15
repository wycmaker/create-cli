import child_process from 'child_process'
import fs from 'fs'
import path from 'path'

/* #region SignalR Tool */

/**
 * 加入SignalR工具
 * @param {string} root 專案根目錄
 * @param {string} environment 建立架構
 * @param {string} language 專案語言
 */
const addSignalrTool = async (root, environment, language) => {
  await install(`npm install -D signalr-no-jquery@0.2.0 --prefix ${root}`)

  switch (environment) {
    case 'vite':
      processSignalRByVite(root, language)
      break
    case 'cli':
      processSignalRByCli(root, language)
      break
  }
}

/**
 * 處理SignalR相關配置(vite)
 * @param {string} root 專案根目錄
 * @param {string} language 使用語言 
 */
const processSignalRByVite = (root, language) => {
  /* #region main.js/main.ts */

  const mainPath = path.join(root, `./src/main.${language}`)
  let content = fs.readFileSync(mainPath, { encoding: 'utf-8' })
  content += '\n\ninit()'
  fs.writeFileSync(mainPath, content, { encoding: 'utf-8' })

  /* #endregion */

  /* #region env files */

  let files = fs.readdirSync(root)
  files.forEach(file => {
    if (file.includes('.env')) {
      let filePath = path.join(root, file)
      let fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
      fileContent += `\nVITE_SIGNALR_HUB='NoticeHub'`
      fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' })
    }
  })

  /* #endregion */

  /* #region vite.config.js or vite.config.ts */

  const configPath = path.join(root, `vite.config.${language}`)
  content = fs.readFileSync(configPath, { encoding: 'utf-8' })
  let originLines = content.split(/\r?\n/g)

  let index = originLines.findIndex(line => line.includes('dirs: ['))
  if (index !== -1) {
    originLines[index - 2] += `,
          {
            '@/services/signalr': [
              'init', 'addEvent', 'close'
            ]
          },
          {
            'signalr-no-jquery': [
              'hubConnection'
            ]
          }`
  }

  index = originLines.findIndex(line => line.includes('proxy: {'))
  if (index !== -1) {
    originLines[index] += `
      '/signalr': {
        target: process.env.VITE_SERVER_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\\/signalr/, '/signalr'),
      },`
  }

  content = originLines.join('\n')
  fs.writeFileSync(configPath, content, { encoding: 'utf-8' })

  /* #endregion */
}

/**
 * 處理SignalR相關配置(vue-cli)
 * @param {string} root 專案根目錄
 * @param {string} language 使用語言
 */
const processSignalRByCli = (root, language) => {
  /* #region main.js/main.ts */

  const mainPath = path.join(root, `./src/main.${language}`)

  let content = fs.readFileSync(mainPath, { encoding: 'utf-8' })
  let originLines = content.split(/\r?\n/g)

  let index = originLines.findIndex(line => line.includes(`createApp`))
  if (index !== -1) {
    originLines[index - 1] += `\ninit()\n\nstore.registerModule('signalr', signalr)\n`
  }

  content = originLines.join('\n')
  fs.writeFileSync(mainPath, content, { encoding: 'utf-8' })

  /* #endregion */

  /* #region env files */

  let files = fs.readdirSync(root)
  files.forEach(file => {
    if (file.includes('.env')) {
      let filePath = path.join(root, file)
      let fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' })
      fileContent += `\nVUE_APP_SIGNALR_HUB='NoticeHub'`
      fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' })
    }
  })

  /* #endregion */

  /* #region vue.config.js */

  const configPath = path.join(root, `vue.config.js`)
  content = fs.readFileSync(configPath, { encoding: 'utf-8' })
  originLines = content.split(/\r?\n/g)

  index = originLines.findIndex(line => line.includes('dirs: ['))
  if (index !== -1) {
    originLines[index - 2] += `,
          {
            '@/services/signalr': [
              'init', 'addEvent', 'close'
            ]
          },
          {
            'signalr-no-jquery': [
              'hubConnection'
            ]
          }`
  }

  index = originLines.findIndex(line => line.includes('proxy: {'))
  if (index !== -1) {
    originLines[index] += `
      '/signalr': {
        target: process.env.VUE_APP_DEV_PROXY,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/signalr': '/signalr'
        }
      },`
  }

  content = originLines.join('\n')
  fs.writeFileSync(configPath, content, { encoding: 'utf-8' })

  /* #endregion */
}

/* #endregion */

/* #region Electron Tool */

/**
 * 加入Electron工具
 * @param {string} root 專案根目錄
 * @param {string} environment 建立架構
 * @param {string} language 專案語言
 */
const addElectronTool = async (root, environment, language) => {
  await install(`npm install -D electron@26.0.0 electron-builder@24.6.3 --prefix ${root}`)

  switch (environment) {
    case 'vite':
      await install(`npm install -D @wycmaker/vite-plugin-electron-builder --prefix ${root}`)
      processElectronByVite(root, language)
      break
    case 'cli':
      await install(`npm install -D @wycmaker/vue-cli-plugin-electron-builder --prefix ${root}`)
      processElectronByCli(root)
      break
  }
}

/**
 * 處理Electron相關配置(Vite)
 * @param {string} root 專案根目錄
 * @param {string} language 專案語言
 */
const processElectronByVite = (root, language) => {
  /* #region package.json */

  const pkgPath = path.join(root, './package.json')
  const pkg = fs.readFileSync(pkgPath, 'utf-8')
  let pkgInfo = JSON.parse(pkg)
  pkgInfo.main = 'electron/background.js'
  pkgInfo.scripts['electron:serve'] = 'vite --mode dev.electron'
  pkgInfo.scripts['electron:build'] = 'vite build --mode prod.electron --emptyOutDir'
  delete pkgInfo.type

  fs.writeFileSync(pkgPath, JSON.stringify(pkgInfo, null, 2), 'utf-8')

  /* #endregion */

  /* #region vite.config.js or vite.config.ts */

  const configPath = path.join(root, `vite.config.${language}`)
  let content = fs.readFileSync(configPath, { encoding: 'utf-8' })
  let originLines = content.split(/\r?\n/g)

  let index = originLines.findIndex(line => line.includes('export default'))
  if (index !== -1) {
    originLines[index - 1] += `import Electron from '@wycmaker/vite-plugin-electron-builder'\n`
  }

  index = originLines.findIndex(line => line.includes('loadEnv('))
  if (index !== -1) {
    originLines[index] = `process.env = { ...process.env, ...loadEnv(mode.split('.')[0], process.cwd()) }`
  }

  index = originLines.findIndex(line => line.includes('server: {'))
  if (index !== -1) {
    originLines[index - 2] += `,
      mode.includes('electron') ? Electron() : {}`
  }

  content = originLines.join('\n')
  fs.writeFileSync(configPath, content, 'utf-8')

  /* #endregion */
}

/**
 * 處理Electron相關配置(Vue)
 * @param {string} root 專案根目錄
 */
const processElectronByCli = (root) => {
  /* #region package.json */

  const pkgPath = path.join(root, './package.json')
  const pkg = fs.readFileSync(pkgPath, 'utf-8')
  let pkgInfo = JSON.parse(pkg)
  pkgInfo.main = 'electron/background.js'
  pkgInfo.scripts['electron:serve'] = 'vue-cli-service electron:serve --mode dev'
  pkgInfo.scripts['electron:build'] = 'vue-cli-service electron:build --mode prod'

  fs.writeFileSync(pkgPath, JSON.stringify(pkgInfo, null, 2), 'utf-8')

  /* #endregion */
}

/* #endregion */

/**
 * 安裝pageage.json的NPM Package
 * @param {string} cmd 安裝指令
 */
const install = (cmd) => {
  return new Promise((resolve, rejects) => {
    child_process.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(error)
        rejects()
      }
      else resolve()
    })
  })
}

export { install, addSignalrTool, addElectronTool }