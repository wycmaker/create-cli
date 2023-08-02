<template>
  <el-table-column :label="label" :min-width="width" :prop="prop" :align="align" :class-name="className">
    <template #default="scope">
      <el-input 
        v-model="scope.row[prop]" 
        :disabled="scope.row.disable" 
        @blur="(val:any) => inputBlur(scope.row)" 
        @change="(val:any) => inputChange(scope.row)" 
      ></el-input>
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
  const emit = defineEmits([ 'input-blur', 'input-change' ])

  /**
   * input blur事件觸發函式
   * @param val 變更的數值
   */
  const inputBlur = (val:any) => {
    emit('input-blur', val)
  }

  /**
   * input change事件觸發函數
   * @param val 實際的數值
   */
  const inputChange = (val:any) => {
    emit('input-change', val)
  }
</script>

<style lang="scss" module>

</style>
