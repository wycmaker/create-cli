<template>
  <el-table-column :label="label" :min-width="width" :prop="prop" :align="align" :class-name="className">
    <template #default="scope">
      <el-input 
        v-model="scope.row[prop]" 
        :disabled="scope.row.disable" 
        type="textarea" 
        :rows="rows" 
      ></el-input>
    </template>
  </el-table-column>
</template>

<script setup>
  const props = defineProps({
    ...tableColumnProp,
    rows: {
      type: Number,
      default: 2
    }
  })
</script>

<style lang="scss" module>

</style>
