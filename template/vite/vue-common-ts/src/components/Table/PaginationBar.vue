<template>
  <el-pagination
    :class="$style.page"
    :layout="(pageCount === 5) ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
    background
    @size-change="sizeChange"
    @current-change="currentChange"
    :current-page="currentPageValue"
    :page-sizes="pageSizes"
    :page-size="pageSizeValue"
    :total="totalCount"
    :pager-count="pageCount"
  >
  </el-pagination>
</template>

<script setup lang="ts">
  const emit = defineEmits([ 'handlePageChange', 'update:pageSize', 'update:currentPage' ])
  const props = withDefaults(defineProps<PageProp & {
    pageSizes: Array<number>
  }>(), {
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: () => [ 10, 20, 30, 40 ]
  })
  
  const commonStore = useCommonStore()
  const pageSizeValue = useVModel(props, 'pageSize')
  const currentPageValue = useVModel(props, 'currentPage')
  const pageCount = computed(() => {
    let clientWidth = commonStore.clientWidth
    if(clientWidth != null) {
      if(clientWidth >= 1440) return 9
      else if(clientWidth >= 1024 && clientWidth < 1440) return 7
      else return 5
    }
  })

  /**
   * 資料數變更函數
   * @param size 每頁資料數
   */
  const sizeChange = (size:number) => {
    pageSizeValue.value = size
    emit('handlePageChange', { page: currentPageValue.value, size: size, isChange: false })
  }

  /**
   * 頁面變更函數
   * @param page 頁數
   */
  const currentChange = (page:number) => {
    currentPageValue.value = page
    emit('handlePageChange', { page: page, size: pageSizeValue.value, isChange: true })
  }
</script>

<style lang="scss" module>
  .page {
    display: inline-flex;
    text-align: center;
    margin-top: 15px;

    :global {
      .el-pagination__total, .el-input__inner, .el-pagination__jump {
        @include font-setting(14px, unset, $font-color-1);
      }
      
      @include input-setting($font-color-1, $white-color, $border-color-1);

      .el-select .el-input__inner,
      .el-select .el-input__inner:focus, 
      .el-pagination__sizes .el-input .el-input__inner:hover, 
      .el-pagination__editor.el-input .el-input__inner,
      .el-pagination__editor.el-input .el-input__inner:hover:focus, 
      .el-pagination__editor.el-input .el-input__inner:hover:hover {
        border-color: $border-color-1;
      }

      .el-pager li, .btn-prev, .btn-next{
        @include pager-color-setting($font-color-3, $white-color, $border-color-1);
      }

      .el-pager li.active{
        @include pager-color-setting($white-color, $border-color-1, $border-color-1);
      }

      .el-input--mini .el-input__inner {
        height: 28px;
        line-height: 28px;
      }

      .el-pagination__jump .el-input__inner {
        padding: 0 3px;
      }
    }
  }

</style>
