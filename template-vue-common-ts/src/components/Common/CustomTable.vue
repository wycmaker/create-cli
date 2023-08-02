<template>
  <el-table
    :data="list"
    :border="border"
    :stripe="stripe"
    :class="classes"
    :max-height="height"
    v-table-loadmore="loadMore()"
    class="loading"
    ref="scrollDom"
    v-loading="load"
    element-loading-background="#FFFFFF"
  >
    <slot name="data"></slot>
  </el-table>
</template>

<script setup lang="ts">
  const vTableLoadmore = {
    mounted(el:any, binding:any) {
      const wapper = el.querySelector('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap');
      wapper?.addEventListener('scroll', function () {
        binding.value()
      })
    },
    beforeUnmount(el:any) {
      el.removeEventListener("scroll", el.__handleClick__);
    }
  }

  const emit = defineEmits([ 'update:data' ])
  const props = withDefaults(defineProps<TableProp & {
    isInitial: boolean
  }>(), {
    data: () => { return [] as Array<any> },
    classes: () => { return [] as Array<any> },
    border: false,
    stripe: false,
    isInitial: true
  })

  // 元素的Ref
  const scrollDom = ref()

  // 定義變數
  const list:Ref<Array<any>> = ref([])
  const startIndex = ref(0)
  const totalHeight = ref(0)
  const averageHeight = ref(0)
  const load = ref(false)
  
  const { height, isInitial, stripe, border, classes } = props
  const stashList = useVModel(props, 'data')
  const limitCount = computed(() => {
    return Math.ceil(height/averageHeight.value) + 2
  })
  const top = computed(() => {
    return startIndex.value * averageHeight.value
  })

  /**
   * @description: scrollBar下拉加載更多資料
   */  
  const loadMore = () => {
    if(height !== null) {
      return () => {
        // 計算當前卷軸位置
        getDisplayList()
      }
    }
    else return () => {}
  }

  /**
   * @description: 初始化列表
   */  
  const initialList = async () => {
    if(height !== null) 
    { // 指定高度 => 產生虛擬表格
      load.value = true
      const tableBody = <HTMLElement>scrollDom.value.$el.querySelector('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view .el-table__body')
      const warp = <HTMLElement>scrollDom.value.$el.querySelector('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view')
      if(warp) warp.style.display = 'block'
      const width = tableBody?.clientWidth

      // 將Table Body中的元素設為Relative，以便透過控制Top實現虛擬表格的作用
      let el = scrollDom.value.$el as HTMLDivElement
      let bodys = el.querySelectorAll<HTMLElement>('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view .el-table__body')
      bodys?.forEach(item => {
        item.style.position = 'relative'
        item.style.maxWidth = width + 'px'
      })

      totalHeight.value = 0

      // 建立虛擬Div撐開Table Body的高度
      const vEle = document.createElement('div')
      vEle.style.width = totalHeight.value > height ? `${width - 9}px` : `${width}px`
      vEle.id = 'vEle'

      // 設定元素寬度(有Scrollbar寬度需減少)
      const nodes = tableBody.childNodes
      let length = nodes.length
      for(var j=0; j<length; j++) {
        let node = nodes[j] as HTMLElement
        if(node.style) node.style.width =  totalHeight.value > height ? `${width - 9}px` : `${width}px`
      }

      // 塞入vEle虛擬元素
      const wapper = scrollDom.value.$el.querySelector('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap')
      const target = wapper?.querySelector('#vEle')
      if(target === null) wapper?.appendChild(vEle)

      // 批次塞入資料並計算Table Body的高度加總形成總高度
      let i=0
      let step = Math.ceil(stashList.value.length / 50)
      list.value = []
      while(i < step) {
        let start = i*50
        list.value = [ ...JSON.parse(JSON.stringify(stashList.value.slice(start, start+50))) ]

        // 需用await等待元素反應才能正確取得高度
        await nextTick(() => {
          let el = scrollDom.value.$el as HTMLElement
          const tableBody = el.querySelector<HTMLElement>('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view .el-table__body tbody')
          if(tableBody) {
            setTimeout(() => {
              const height = tableBody?.clientHeight
              if(height) totalHeight.value += height
            }, 10)
          }
        })
        i++
      }

      // 使用setTimeout確保批次計算元素高度完成後才執行資料處理
      setTimeout(() => {
        // 計算每一行的平均高度
        averageHeight.value = Math.ceil(totalHeight.value / stashList.value.length)

        list.value = [ ...JSON.parse(JSON.stringify(stashList.value.slice(0, limitCount.value))) ]
        // 設定vEle高度
        const vEle = <HTMLElement>document.querySelector('#vEle')
        vEle.style.height = totalHeight.value + 'px'

        // 判斷是否隱藏vEle區塊
        const header = scrollDom.value.$el.querySelector('.el-table__header-wrapper')
        const headerHeight = header?.clientHeight
        if(headerHeight) {
          const contentHeight = height - headerHeight
          const minCount = Math.ceil(contentHeight / averageHeight.value)
          vEle.style.display = stashList.value.length < minCount ? 'none' : 'block'
        }
        load.value = false
      }, 10)
    }
    else getCurrentList()
  }

  /**
   * @description: 取得當前表格顯示的資料
   * @return {*}
   */  
  const getCurrentList = () => {
    list.value = [ ...JSON.parse(JSON.stringify(stashList.value)) ]
  }

  /**
   * @description: 取得表格顯示資料(完成載入後)
   */  
  const getDisplayList = () => {
    const wapper = scrollDom.value.$el.querySelector('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap')
    let el = scrollDom.value.$el as HTMLDivElement
    const tableBody = el.querySelectorAll<HTMLElement>('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view .el-table__body')

    if(wapper) {
      // 計算目前顯示的陣列開始索引值
      startIndex.value = Math.floor(wapper.scrollTop / averageHeight.value)
    }

    /**
     * 取得顯示的列表
     * 1. 結束位置不等於原始資料長度 => 依條件取得陣列
     * 2. 結束位置等於原始資料長度 => 從最後往前取指定個數的陣列
     */
    list.value = startIndex.value + limitCount.value <= stashList.value.length ? [ ...stashList.value.slice(startIndex.value, startIndex.value + limitCount.value) ]
                                                                    : [ ...stashList.value.slice(stashList.value.length - 1 - limitCount.value, stashList.value.length) ]
    
    /**
     * 設定元素top的偏移量
     * 1. top計算值<=總高度 => top計算值
     * 2. top計算值>總高度 => 總高度
     */
    tableBody?.forEach(item => {
      item.style.top = (top.value <= totalHeight.value) ? top.value + 'px' : `${totalHeight.value}px`
    })
  }

  onMounted(() => {
    nextTick(() => {
      if(isInitial === true) initialList()
    })
  })

  watch(() => stashList.value.length, (newValue, oldValue) => {
    initialList()
    // 將table的scrollbar位置指向1(更新陣列會自動跳到最上方)，需使用setTimeout確保列表已經初始化完成再進行跳轉
    setTimeout(() => {
      const el = scrollDom.value.$el.querySelector('.el-table__body-wrapper .el-scrollbar .el-scrollbar__wrap')
      if(el) el.scrollTop = 1
    }, 10)
  })
</script>

<style lang="scss" module>

</style>
