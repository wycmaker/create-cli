#!/usr/bin/env node
import child_process from 'child_process'
import fs from 'fs'
import gunzip from 'gunzip-maybe'
import ora from 'ora'
import path from 'path'
import tar from 'tar-fs';
import { fileURLToPath } from 'url'
import prompts from './lib/prompts.js'

const cwd = process.cwd()

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
  const templateTar = path.resolve(
    fileURLToPath(import.meta.url),
    (environment === 'cli' ? '../template/cli' : '../template/vite'),
    `vue-${template}-${language}.tar.gz`
  )

  // 解壓縮範例檔案
  const stream = fs.createReadStream(templateTar).pipe(gunzip()).pipe(tar.extract(root))
  await stream.once('finish', async () => {
    // 更改專案的Package Name
    const pkgPath = path.join(root, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    pkg.name = projectName
    fs.writeFileSync(pkgPath, JSON.stringify(pkg), { encoding: 'utf-8' })

    // 下載所需的Package
    const spinner = ora(`download package...`).start();
    let dependenciesCMD = getPkgInfo(pkg, 'dependencies')
    await install(dependenciesCMD)
    let devDependenciesCMD = getPkgInfo(pkg, 'devDependencies')
    await install(devDependenciesCMD)
    spinner.stop()

    notice()
  })
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

function notice() {
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
}

init().catch((e) => {
  console.error(e)
})