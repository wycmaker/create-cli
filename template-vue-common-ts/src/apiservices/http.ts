const userStore = useUserStore()

const instance:AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT,
})

const options = {
  lock: true,
  background: 'rgba(255, 255, 255, 0.7)',
  target: '#loading',
}

let loading: Array<any> = []

// Request Interceptors
instance.interceptors.request.use((config: InternalAxiosRequestConfig) : InternalAxiosRequestConfig => {
  // Add Request Header
  config.headers.Pragma = 'no-cache'
  if (!config.headers.Authorization && userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }

  // Add Timeout Setting
  if (!config.timeout) {
    config.timeout = 60000
  }

  startLoading()
  return config
})

// Response Interceptors
instance.interceptors.response.use(response => {
  endLoading()
  return response;

}, error => {
  endLoading()
  if (error && error.response) {
    const { status, config } = error.response
    const { url } = config
    let message = ''

    switch (status) {
      case 400:
        message = '程式發生錯誤'
        break
      case 401:
        message = '授權已過期，請重新登入'
        break
      case 403:
        message = '沒有權限進行此操作'
        break
      case 404:
        message = '請求的目標不存在'
        break
      case 405:
        message = '錯誤的Http Method'
        break
      case 500:
        message = '伺服器發生錯誤'
        break
      case 504:
        message = '伺服器無回應，請檢查Server'
        break
      default: 
        message = '程式或伺服器發生未知錯誤'
        break
    }

    message = (status === 401 || status === 504) ? message : `${message}\nAPI：${url}`
    info.error(message)
    if(status === 401) {
      userStore.clearUserInfo()
      router.push('/login')
    }
  } else return Promise.reject(error)
})

/**
 * 開始loading
 */
const startLoading = () => {
  loading.push(ElLoading.service(options))
}

/**
 * 結束loading
 */
const endLoading = () => {
    if(loading.length > 0) loading.shift().close()
}

const get = (url:string, data:any) => instance.get(url, {
  params: data
})
const post = (url:string, data:any) => instance.post(url, data)
const postForm = (url:string, data:FormData) => instance.post(url, data, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

export default { get, post, postForm }
