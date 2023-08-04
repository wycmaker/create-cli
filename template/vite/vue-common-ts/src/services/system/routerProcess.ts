/**
 * 分頁處理
 */
const pageProcess = () => {
  // 判斷是否有其他分頁存在
  const alreadyExist = sessionStorage.getItem('alreadyExist')
  let page = localStorage.getItem('page')
  let count = 0
  if(page != null) count = +page

  if ((count < 1 || isNaN(count)) && !alreadyExist) userDataManager.clearData()

  // 重新整理後，如alreadyExist不存在 => 設定alreadyExist的值
  if (!alreadyExist) sessionStorage.setItem('alreadyExist', '1')

  // 設定當前分頁數目
  let setCount = isNaN(count) ? 1 : count + 1
  localStorage.setItem('page', setCount.toString())

  // 關閉分頁處理
  window.onunload = () => {
    if(page != null) count = +page
    localStorage.setItem('page', count.toString())
  }
}

/**
 * 設定使用者資訊
 */
const setStore = () => {
  const userStore = useUserStore()
  const data = userDataManager.getUserData()

  /**
   * 取得使用者資訊
   * 1. 可以取得 => 判斷token是否過期作相對應的動作
   * 2. 無法取得 => 清空localstorage，並將使用者導向登入頁
   */
  if (data) {
    /**
     * 可以取得使用者資訊
     * 1. token未過期 => 將使用者資訊記錄到Vuex中
     * 2. token過期 => 清空localstorage，並將使用者導向登入頁
     */
    const expiryDate = new Date(data.expiryDate)
    const now = new Date()
    if (now < expiryDate && data.token) {
      userStore.setUserInfo(data)
      userStore.authenticate()
    }
    else clearUserData()
  } else clearUserData()
}

/**
 * 清空使用者資訊，並導向登入頁
 */
const clearUserData = () => {
  router.push('/login')
  userDataManager.clearData()
}

/**
 * localStorage變更事件
 */
const storageChange = () => {
  window.addEventListener("storage", (e) => {
    setStore()
  })
}

/**
 * 實際路由跳轉規則
 */
const pathProcess = () => {
  router.beforeEach((to, from, next) => {
    // 取得使用者資訊
    const data = userDataManager.getUserData()

    // 取得欲前往的頁面
    const path = to.path.toUpperCase()

    /**
     * 1. 已登入，前往登入頁面 => 自動導向首頁
     * 2. 已登入，不是前往登入頁 => 前往目標頁面
     * 3. 未登入，前往登入頁面 => 前往目標頁面(登入頁)
     * 4. 未登入，不是前往登入頁 => 自動導向登入頁
     */
    if (data && path === '/LOGIN') next({ path: '/' })
    else if (data && path !== '/LOGIN') next()
    else if (!data && path === '/LOGIN') next()
    else next({ path: '/login' })
  })
}

export const setRoute = (authorityLList:Array<number>) => {
  // 依權限塞入路由
}

export default function() {
  // 分頁處理
  pageProcess()

  // 設定使用者資訊
  setStore()

  // localhostStorage 的監聽事件
  storageChange()

  // 路由跳轉處理
  pathProcess()
}