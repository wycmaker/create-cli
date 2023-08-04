<template>
  <el-table-column :label="label" :min-width="width" :prop="prop" :align="align" :class-name="className">
    <template #default="scope">
      {{ scope.row[prop] }}
    </template>
  </el-table-column>
</template>

<script setup>
  const props = defineProps({
    ...tableColumnProp,
  })
</script>

<style lang="scss" module>

</style>
