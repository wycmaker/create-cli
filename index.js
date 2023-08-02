#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import minimist from 'minimist'
import prompts from 'prompts'
import { blue, cyan, magenta, red, reset, yellow } from 'kolorist'
import ora from 'ora'

const argv = minimist(process.argv.slice(2), { string: [ '_' ] })
const cwd = process.cwd()

const FRAMEWORKS = [
  {
    name: 'vue-common',
    color: red,
    mutations: [
      {
        name: 'vue-common',
        display: 'Javascript',
        color: yellow
      },
      {
        name: 'vue-common-ts',
        display: 'TypeScript',
        color: blue
      }
    ]
  },
  {
    name: 'vue-signalr',
    color: cyan,
    mutations: [
      {
        name: 'vue-signalr',
        display: 'Javascript',
        color: yellow
      },
      {
        name: 'vue-signalr-ts',
        display: 'TypeScript',
        color: blue
      }
    ]
  },
  {
    name: 'vue-electron',
    color: magenta,
    mutations: [
      {
        name: 'vue-electron',
        display: 'Javascript',
        color: yellow
      },
      {
        name: 'vue-electron-ts',
        display: 'TypeScript',
        color: blue
      }
    ]
  },
]

const TEMPLATES = FRAMEWORKS.map(f => f.mutations && f.mutations.map(v => v.name) || [f.name])
                            .reduce((a, b) => a.concat(b), [])

const renameFiles = {
  _gitignore: './gitignore'
}

let spinner, root

async function init() {
  // 專案目錄名稱
  let targetDir = formatTargetDir(argv._[0])

  // 命令列的Template參數
  let template = argv.template || argv.t

  // 預設資料夾
  const defaultTargetDir = 'wycmaker-vite'

  // 取得專案名稱
  const getProjectName = () =>
    targetDir === '.' ? path.basename(path.resolve()) : targetDir

  let result = {}

  try {
    // 進行專案建置的選擇
    result = await prompts(
      [
        { // 確認專案名稱
          type: targetDir ? null : 'text',
          name: 'projectName',
          message: reset('Project name:'),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir
          }
        },
        { // 判斷資料夾使否為空，並提醒是否覆蓋資料夾
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
          name: 'overwrite',
          message: () =>
            (targetDir === '.'
              ? 'Current directory'
              : `Target directory "${targetDir}"`) +
            ` is not empty. Remove existing files and continue?`
        },
        { // 取得是否覆蓋的結果並進行對應處理
          type: (_, { overwrite } = {}) => {
            if (overwrite === false) {
              throw new Error(red('✖') + ' Operation cancelled')
            }
            return null
          },
          name: 'overwriteChecker'
        },
        { // 判斷專案明明是否合法
          type: () => (isValidPackageName(getProjectName()) ? null : 'text'),
          name: 'packageName',
          message: reset('Package name:'),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name'
        },
        { // 選擇範本並確認範本是否存在
          type: template && TEMPLATES.includes(template) ? null : 'select',
          name: 'framework',
          message:
            typeof template === 'string' && !TEMPLATES.includes(template)
              ? reset(
                  `"${template}" isn't a valid template. Please choose from below: `
                )
              : reset('Select a framework:'),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.name),
              value: framework
            }
          })
        },
        { // 若有其他選項則進行下一層選擇
          type: (framework) =>
            framework && framework.mutations ? 'select' : null,
          name: 'variant',
          message: reset('Select a mutation:'),
          // @ts-ignore
          choices: (framework) =>
            framework.mutations.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.name),
                value: variant.name
              }
            })
        }
      ],
      { // 使用者中斷操作
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled) {
    console.log(cancelled.message)
    return
  }

  // 取得由命令列取得的建置參數
  const { framework, overwrite, packageName, variant } = result

  // 取得專案根目錄
  root = path.join(cwd, targetDir)

  if (overwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root, { recursive: true })
  }

  // 判斷專案的來源
  template = variant || framework || template

  console.log('\n')
  spinner = ora(`Project is creat at ${root}...`).start()

  // 取得範本放置位置
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    '..',
    `template-${template}`
  )

  const write = (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file)
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
  pkg.name = packageName || getProjectName()

  write('package.json', JSON.stringify(pkg, null, 2))
}

/**
 * 格式化專案資料夾名稱(去除反斜線)
 * @param {string | undefined} targetDir 資料夾名稱
 */
function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, '')
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
 * 判斷專案名稱是否合法
 * @param {string} projectName 專案名稱
 */
function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

/**
 * 將專案名稱轉為合法名稱
 * @param {string} projectName 專案名稱
 */
function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
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
 * 判斷資料夾是否為空
 * @param {string} path 資料夾位置
 */
function isEmpty(path) {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === '.git')
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

init().then(() => {
  spinner.stop()
  // 判斷Node Package Manager
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  const pkgManager = pkgInfo ? pkgInfo.name : 'npm'

  console.log(`\nDone. Now run:\n`)
  if (root !== cwd) {
    console.log(`  cd ${path.relative(cwd, root)}`)
  }
  switch (pkgManager) {
    case 'yarn':
      console.log('  yarn')
      console.log('  yarn dev')
      break
    default:
      console.log(`  ${pkgManager} install`)
      console.log(`  ${pkgManager} run dev`)
      break
  }
  console.log()
}).catch((e) => {
  console.error(e)
})