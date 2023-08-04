<template>
  <el-table-column :label="label" :min-width="width" :prop="prop" :align="align" :class-name="className">
    <template #default="scope">
      <custom-select
        :options="optionValue"
        v-model="scope.row[prop]"
        :clearable="clearable"
        :multiple="multiple"
        :disabled="scope.row.editable"
        :use-label="useLabel"
        :custom-label="customLabel"
        :collapse-tags="collapseTags"
        @change="(val) => selectChange(scope.row)"
        v-if="load"
      ></custom-select>
    </template>
  </el-table-column>
</template>

<script setup>
  const props = defineProps({
    ...tableColumnProp,
    ...selectProp,
    load: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits([ 'select-change', 'update:options' ])
  
  const optionValue = useVModel(props, 'options')

  /**
   * selct change事件觸發函數
   * @param {Number} val 變更的數值
   */  
  const selectChange = (val) => {
    emit('select-change', val)
  }
</script>

<style lang="scss" module>

</style>
