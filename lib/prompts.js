import fs from 'fs'
import { reset, red } from 'kolorist'
import prompts from "prompts";
import { ENVIRONMENTS, LANGUAGES, TEMPLATES, TOOLS } from './templateOption.js'

// 預設資料夾
const defaultTargetDir = 'wycmaker-vite'
// 專案目錄名稱
let targetDir

export default prompts(
  [
    { // 確認專案名稱
      type: targetDir ? null : 'text',
      name: 'projectName',
      message: reset('Project name:'),
      initial: defaultTargetDir,
      validate: (dir) => isValidPackageName(dir) || 'Invalid package.json name',
      onState: (state) => {
        targetDir = toValidPackageName(formatTargetDir(state.value) || defaultTargetDir)
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
    { // 選擇範本並確認範本是否存在
      type: 'select',
      name: 'environment',
      message: reset('Select a framework:'),
      initial: 0,
      choices: getChoices(ENVIRONMENTS)
    },
    {
      type: 'select',
      name: 'language',
      message: reset('Select a development language:'),
      choices: getChoices(LANGUAGES)
    },
    {
      type: 'select',
      name: 'template',
      message: reset('Select a template:'),
      choices: getChoices(TEMPLATES)
    },
    {
      type: 'multiselect',
      name: 'tools',
      message: reset('Select external tools:'),
      choices: getChoices(TOOLS),
      hint: '- Space to select. Enter to next step.',
      instructions: false
    }
  ],
  { // 使用者中斷操作
    onCancel: () => {
      throw new Error(red('✖') + ' Operation cancelled')
    }
  }
)

/**
 * 格式化專案資料夾名稱(去除反斜線)
 * @param {string | undefined} targetDir 資料夾名稱
 */
function formatTargetDir(targetDir) {
  console.log
  return targetDir?.trim().replace(/\/+$/g, '')
}

/**
 * 取得prompt的選項
 * @param {Array} array 選項列表
 * @returns
 */
function getChoices(array) {
  return array.map(item => {
    return {
      title: item.color(item.title),
      value: item.value
    }
  })
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