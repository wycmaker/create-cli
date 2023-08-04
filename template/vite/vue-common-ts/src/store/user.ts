export const useUserStore = defineStore('user', {
  state: ():UserState => {
    return {
      userInfo: null,
      isAuthenticated: false
    }
  },
  getters: {
    token: state => {
      return state.userInfo?.token
    }
  },
  actions: {
    /**
     * 設定使用者資訊
     * @param info 使用者資訊
     */
    setUserInfo(info: UserInfo) {
      this.userInfo = info
    },
    /**
     * 將狀態設定為已授權
     */
    authenticate() {
      this.isAuthenticated = true
    },
    /**
     * 清除使用者資訊
     */
    clearUserInfo() {
      this.userInfo = null
      this.isAuthenticated = false
    }
  }
})