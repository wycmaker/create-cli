<template>
  <el-select
    v-model="bindValue" 
    reserve-keyword
    filterable 
    placeholder=""
    :multiple="multiple"
    :clearable="clearable"
    :disabled="disabled"
    :filter-method="filterChange"
    :collapse-tags="collapseTags"
    v-select-loadmore:item="loadMore()" 
    @visible-change="visibleChange"
    @change="selectChange"
    popper-class="item test"
    placement="bottom"
  >
    <el-option
      v-for="item in list" 
      :key="item.value"
      :label="customLabel !== '' ? item.label + customLabel : item.label"
      :value="useLabel ? (customLabel !== '' ? item.label + customLabel : item.label) : item.value"
    >
    </el-option>
  </el-select>
</template>

<script setup>
  const emit = defineEmits([ 'change', 'update:modelValue', 'update:options' ])
  const props = defineProps({
    ...selectProp
  })

  /**
   * @description: 繼續載入下拉選單的Directive
   * @return {*}
   */  
  const vSelectLoadmore = {
    mounted(el, binding) {
      const select = document.querySelector(`.item .el-select-dropdown__wrap`);
      if(select) {
        select.addEventListener("scroll", function () {
          select.scrollHeight
          const condition = select.scrollHeight - Math.ceil(select.scrollTop) <= select.clientHeight;
          if (condition && select.scrollTop !== 0) {
            binding.value();
          }
        });
      }

    },
    beforeUnmount(el) {
      el.removeEventListener("scroll", el.__handleClick__);
    }
  }

  const { options } = props
  const bindValue = useVModel(props, 'modelValue')

  const list = ref([])
  const rangeNumber = ref(10)
  const search = ref('')
  const isShow = ref(false)

  /**
   * @description: scrollbar 下拉加載更多資料
   */  
  const loadMore = () => {
    return () => {
      rangeNumber.value += 5
      getCurrentList()
    }
  }

  /**
   * @description: 下拉框出現/隱藏時觸發
   * @param {boolean} show 是否顯示
   */  
  const visibleChange = (show) => {
    const select = document.querySelector(`.item .el-select-dropdown__wrap`);
    isShow.value = show
    if(!show) {
      if(select) {
        select.scrollTop = 0
        rangeNumber.value = 10
        search.value = ''
      }
    }
    getCurrentList()
  }

  /**
   * @description: 取得當前顯示的列表
   */  
  const getCurrentList = () => {
    let tempList = []
    if(search.value === '') tempList = [ ...options.slice(0, rangeNumber.value) ]
    else tempList = [ ...options.filter(r => r.label.includes(search.value)).slice(0, rangeNumber.value) ]

    if(bindValue.value instanceof Array) {
      bindValue.value.forEach(item => {
        const currentIndex = tempList.findIndex(r => r.value === item)
        const index = options.findIndex(r => r.value === item)
        if(currentIndex === -1 && index !== -1 && search.value === '') tempList.push(options[index])
      })
    }
    else {
      const currentIndex = tempList.findIndex(r => r.value === bindValue.value)
      const index = options.findIndex(r => r.value === bindValue.value)
      if(currentIndex === -1 && index !== -1 && search.value === '') tempList.push(options[index])
    }

    list.value = []
    tempList.forEach(item => {
      list.value.push({ ...item })
    })
  }

  /**
   * @description: 搜尋文字改變
   * @param searchText 搜尋文字
   */  
  const filterChange = (searchText) => {
    search.value = searchText
    rangeNumber.value = 10
    getCurrentList()
  }

  /**
   * @description: 選項改變
   * @param val 變更的數值
   */  
  const selectChange = (val) => {
    emit('change', val)
  }

  onMounted(() => {
    getCurrentList()
  })
</script>

<style lang="scss" module>

</style>
