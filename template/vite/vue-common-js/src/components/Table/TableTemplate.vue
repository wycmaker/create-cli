<template>
  <div>
    <custom-table :data="dataList" :border="border" :stripe="stripe" :class="classes" :height="height">
      <template v-slot:data>
        <slot></slot>
      </template>
    </custom-table>
    <pagination-bar
      v-if="showPages"
      :totalCount="total"
      :current-page="current"
      :page-size="size"
      @handlePageChange="handlePageChange"
    ></pagination-bar>
  </div>
</template>

<script setup>
  const emit = defineEmits([ 'handlePageChange', 'update:data', 'update:totalCount', 'update:currentPage', 'update:pageSize' ])
  const props = defineProps({
    ...tableProp,
    ...pageProp,
    showPages: {
      type: Boolean,
      default: false
    }
  })

  const dataList = useVModel(props, 'data')
  const total = useVModel(props, 'totalCount')
  const current = useVModel(props, 'currentPage')
  const size = useVModel(props, 'pageSize')

  /**
   * 頁面變更處理
   * @param {object} val 查詢相關物件
   */
  const handlePageChange = (val) => {
    emit('handlePageChange', val)
  }
</script>

<style lang="scss" module>

</style>
