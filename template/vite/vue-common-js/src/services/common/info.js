const toast = useToast()

const options = {
  timeout: 1500,
  position: 'bottom-center',
  draggable: false,
  showCloseButtonOnHover: true
}

/**
 * 提醒訊息(成功)
 * @param message 訊息
 */
const success = (message) => {
  toast.success(message, options)
}

/**
 * 提醒訊息(失敗)
 * @param message 訊息
 */
const error = (message) => {
  toast.error(message, options)
}

/**
 * 提醒訊息(一般)
 * @param message 訊息
 */
const info = (message) => {
  toast.info(message, options)
}

/**
 * 提醒訊息(警告)
 * @param message 訊息
 */
const warning = (message) => {
  toast.warning(message, options)
}

/**
 * 警告視窗
 * @param message 訊息
 * @returns 
 */
const alert = (message) => {
  return ElMessageBox.alert(message, '', {
    confirmButtonText: '確定',
    type: 'error',
    callback: () => { }
  })
}

/**
 * 確認視窗
 * @param message 訊息
 * @returns 
 */
const confirm = (message) => {
  return ElMessageBox.confirm(message, '',
  {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: false,
  })
}

export default { alert, confirm, success, error, info, warning }