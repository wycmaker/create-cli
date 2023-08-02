<template>
  <el-table-column :label="label" :min-width="width" :prop="prop" :align="align" :class-name="className">
    <template #default="scope">
      <custom-switch 
        v-model="scope.row[prop]"
        :disabled="scope.row.disable" 
        @change="(val:any) => switchChange(scope.row)" 
      ></custom-switch>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<TableColumnProp>(), {
    label: '',
    width: '',
    align: '',
    prop: '',
    fix: '',
    className: ''
  })
  const emit = defineEmits([ 'switch-change' ])

  /**
   * switch變更函數
   * @param {object} data 使用者資料
   */
  const switchChange = (val:any) => {
    emit('switch-change', val)
  }
</script>

<style lang="scss" module>

</style>
