#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ora from 'ora'
import child_process from 'child_process'
import prompts from './lib/prompts.js'

const cwd = process.cwd()

const renameFiles = { _gitignore: './gitignore' }

let root

async function init() {
  let result = {}

  try {
    // 進行專案建置的選擇
    result = await prompts
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  // 取得由命令列取得的建置參數
  const { projectName, environment, language, template, tools, overwrite } = result

  // 取得專案根目錄
  root = path.join(cwd, projectName)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  // 取得範本放置位置
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    (environment === 'cli' ? '../template/cli' : '../template/vite'),
    `template-vue-${template}-${language}`
  )

  const write = (file, content) => {
    const targetPath = renameFiles[file] ? path.join(root, renameFiles[file]) : path.join(root, file)
    if (content) {
      fs.writeFileSync(targetPath, content)
    } else {
      copy(path.join(templateDir, file), targetPath)
    }
  }

  // 寫入範本檔案
  const files = fs.readdirSync(templateDir)
  for (const file of files.filter((f) => f !== 'package.json')) {
    write(file)
  }

  // 讀取專案範本的package.json
  const pkg = JSON.parse(
    fs.readFileSync(path.join(templateDir, `package.json`), 'utf-8')
  )

  // 設定專案名稱
  pkg.name = projectName

  write('package.json', JSON.stringify(pkg, null, 2))

  // 下載所需的Package
  const spinner = ora(`download package...`).start();
  let dependenciesCMD = getPkgInfo(pkg, 'dependencies')
  await install(dependenciesCMD)
  let devDependenciesCMD = getPkgInfo(pkg, 'devDependencies')
  await install(devDependenciesCMD)
  spinner.stop()
}

/**
 * 將範本檔案複製到專案資料夾
 * @param {string} src 範本檔案位置
 * @param {string} dest 專案資料夾內的檔案位置
 */
function copy(src, dest) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}

/**
 * 複製資料夾
 * @param {string} srcDir 範本資料夾
 * @param {string} destDir 專案資料夾
 */
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

/**
 * 清空資料夾
 * @param {string} dir 資料夾名稱(實際位置)
 */
function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }
  for (const file of fs.readdirSync(dir)) {
    fs.rmSync(path.resolve(dir, file), { recursive: true, force: true })
  }
}

/**
 * @param {string | undefined} userAgent process.env.npm_config_user_agent
 * @returns object | undefined
 */
function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}

/**
 * 取得npm安裝指令
 * @param {object} pkg package.json物件 
 * @param {string} target 取得的部分 
 * @returns 
 */
function getPkgInfo(pkg, target) {
  let command = 'npm install '
  const pkgs = pkg[target]
  const pkgNames = Object.keys(pkgs)
  pkgNames.forEach(item => {
    command += `${item}@${pkgs[item].replace('^', '')} `
  })

  command += target === 'devDependencies' ? `-D --prefix ${root}` : `--prefix ${root}`
  return command
}

/**
 * 安裝pageage.json的NPM Package
 * @param {string} cmd 安裝指令
 */
function install(cmd) {
  return new Promise((resolve, rejects) => {
    child_process.exec(cmd, (error, stdout, stderr) => {
      if(error) {
        console.log(error)
        rejects()
      }
      else resolve()
    })
  })
}

init().then(() => {
  // 判斷Node Package Manager
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}).catch((e) => {
  console.error(e)
})