import { ToastOptions } from "vue-toastification/dist/types/types"
import { POSITION } from "vue-toastification"

const toast = useToast()

const options:ToastOptions = {
  timeout: 1500,
  position: POSITION.BOTTOM_CENTER,
  draggable: false,
  showCloseButtonOnHover: true
}

const option = Object.assign({}, options, { type: undefined })

/**
 * 提醒訊息(成功)
 * @param message 訊息
 */
const success = (message:string) => {
  toast.success(message, option)
}

/**
 * 提醒訊息(失敗)
 * @param message 訊息
 */
const error = (message:string) => {
  toast.error(message, option)
}

/**
 * 提醒訊息(一般)
 * @param message 訊息
 */
const info = (message:string) => {
  toast.info(message, option)
}

/**
 * 提醒訊息(警告)
 * @param message 訊息
 */
const warning = (message:string) => {
  toast.warning(message, option)
}

/**
 * 警告視窗
 * @param message 訊息
 * @returns 
 */
const alert = (message:string) => {
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
const confirm = (message:string) => {
  return ElMessageBox.confirm(message, '',
  {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: false,
  })
}

export default { alert, confirm, success, error, info, warning }