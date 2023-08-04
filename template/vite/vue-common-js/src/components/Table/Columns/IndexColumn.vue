<template>
  <el-table-column :label="label" type="index" :index="configIndex" :width="width" :class-name="className" align="center"></el-table-column>
</template>

<script setup>
  const props = defineProps({
    ...tableColumnProp,
    ...pageProp
  })

  const { currentPage, pageSize } = props
  const configIndex = (index) => {
    return currentPage === 0 ? index+1 : (currentPage-1) * pageSize + index + 1
  }
</script>

<style lang="scss" module>

</style>
