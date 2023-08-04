<template>
  <el-table-column :label="label" type="index" :index="configIndex" :width="width" :class-name="className" align="center"></el-table-column>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<TableColumnProp & PageProp>(), {
    label: '',
    width: '',
    align: '',
    prop: '',
    fix: '',
    className: '',
    currentPage: 0,
    pageSize: 0
  })

  const { currentPage, pageSize } = props
  const configIndex = (index:number) => {
    return currentPage === 0 ? index+1 : (currentPage-1) * pageSize + index + 1
  }
</script>

<style lang="scss" module>

</style>
