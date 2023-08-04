export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      clientWidth: null
    }
  },
  actions: {
    /**
     * 設定當前的clientWidth
     * @param width 
     */
    setClientWidth(width) {
      this.clientWidth = width
    }
  }
})