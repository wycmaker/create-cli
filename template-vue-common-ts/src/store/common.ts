export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      clientWidth: null as number | null
    }
  },
  actions: {
    /**
     * 設定當前的clientWidth
     * @param width 
     */
    setClientWidth(width: number) {
      this.clientWidth = width
    }
  }
})