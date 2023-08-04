interface Pattern {
  [key: string]: RegExp
}

let pattern:Pattern = {
  notChinese: <RegExp>/^[^\u4e00-\u9fa5]*$/,
  cellphone: <RegExp>/(^[0-9]{0}$|^[0-9]{10})$/,
  email: <RegExp>/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  intOnly: <RegExp>/^[0-9]*$/,
  numberOnly: <RegExp>/^[0-9]*$|^[0-9]+\.[0-9]+$/
}

/**
* 密碼驗證函數
* @param rule 驗證規則 
* @param value 要驗證的數值 
* @param callback 驗證的callback function
* @param isRequired 欄位是否必填
* @param message 錯誤回傳訊息 
*/
const passwordValidator = (rule:any, value:string, callback:Function, isRequired:boolean, message:string) => {
  if(isRequired) {
    if(value !== null && value !== undefined && value.trim() !== '') callback()
    else callback(message + "不可為空")
  } else callback()
}

/**
* 確認密碼驗證函數
* @param rule 驗證規則 
* @param value 要驗證的數值 
* @param callback 驗證的callback function
* @param newPassword 對比的數值
*/
const confirmValidator = (rule:any, value:string, callback:Function, newPassword:string) => {
  if(value !== null && value !== undefined && value.trim() !== '' && value !== newPassword) callback('兩次密碼輸入不一致');
  else callback();
}

/**
* 正規表達式驗證函數
* @param {Object} rule 驗證規則 
* @param {String} value 要驗證的數值 
* @param {Function} callback 驗證的callback function
*/
function rexValidator(this:string, rule:any, value:string, callback:Function) {
  const reg = pattern[this];
  const match = reg.test(value);
  if(match || value == null) callback();
  else {
    switch(this) {
      case 'notChinese': 
        callback('不可輸入中文')
        break
      case 'cellphone':
        callback('手機號碼格式錯誤')
        break
      case 'email':
        callback('E-mail格式錯誤')
        break
      case 'numberOnly':
        callback('整數或小數格式輸入錯誤')
        break
      case 'intOnly':
        callback('僅能輸入正整數')
        break
      default:
        callback('輸入格式錯誤')
        break
    }
  }
}
  
/**
* 陣列驗證函數(內容不可為空)
* @param {Object} rule 驗證規則 
* @param {String} value 要驗證的數值 
* @param {Function} callback 驗證的callback function
* @param {String} message 錯誤回傳訊息 
*/
const arrayValidator = (rule:any, value:Array<any>, callback:Function, message:string) => {
  let empty = false
  value.forEach(item => {
    if(item === null || item.trim() === '') callback(`${message}不可有空值`)
  })
  if(empty === false) callback()
  else callback(`${message}不可有空值`)
}
  
/**
* 登入驗證
* @param {Object} data 登入物件
* @returns 
*/
const loginValidator = (data:any) => {
  const isAccount = typeof(data.account) === 'string' && data.account.length > 0
  const isPassword = typeof(data.password) === 'string' && data.password.length > 0
  
  if(!isAccount && !isPassword) return '請輸入帳號與密碼'
  else if(!isAccount && isPassword) return '請輸入帳號'
  else if(isAccount && !isPassword) return '請輸入密碼'
  else return 'success'
}
  
export default {
  password: passwordValidator,
  confirm: confirmValidator,
  reqularExperssion: rexValidator,
  notEmptyArray: arrayValidator,
  login: loginValidator
}