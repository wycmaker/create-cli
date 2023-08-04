<template>
  <el-table-column :label="label" :min-width="width" :prop="prop" :align="align" :class-name="className">
    <template #default="scope">
      <el-checkbox 
        :class="$style.checkbox"
        v-model="scope.row[prop]" 
        :disabled="scope.row.disable" 
        @change="(val:boolean) => checkboxChange(scope.row)" 
      ></el-checkbox>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
  const emit = defineEmits([ 'checkbox-change' ])
  const props = withDefaults(defineProps<TableColumnProp>(), {
    label: '',
    width: '',
    align: '',
    prop: '',
    fix: '',
    className: ''
  })

  /**
   * checkbox變更函數
   * @param val 變更的數值
   */
  const checkboxChange = (val:any) => {
    emit('checkbox-change', val)
  }
</script>

<style lang="scss" module>
  .checkbox {

    :global {
      @include checkbox-setting(18px, 18px, 0px, 5px, 6px, 10px, $button-color-2, $font-color);
    }
    
  }
</style>
