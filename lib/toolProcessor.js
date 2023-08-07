import child_process from 'child_process'
import fs from 'fs'
import path from 'path'

/**
 * 加入SignalR工具
 * @param {string} root 專案根目錄
 * @param {string} language 專案語言
 */
const addSignalrTool = async (root, language, ) => {
  await install(`npm install -D signalr-no-jquery@0.2.0 --prefix ${root}`)

  /* #region main.js or main.ts */

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
  if(index !== -1) {
    originLines[index-2] += `,
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

export { install, addSignalrTool }