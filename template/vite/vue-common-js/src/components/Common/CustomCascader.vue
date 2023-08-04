<template>
  <el-cascader
    v-model="chooseValue"
    :options="optionsValue"
    :props="{ multiple: true }"
    placeholder=""
    :clearable="clearable"
    :disabled="disabled"
    :collapse-tags="collapseTags"
    @change="handleChange"
  >
  </el-cascader>
</template>

<script setup>
  const emit = defineEmits([ 'change', 'update:modelValue', 'update:options' ])
  const props = defineProps({
    ...selectProp
  })

  const chooseValue = useVModel(props, 'modelValue')
  const optionsValue = useVModel(props, 'options')


  /**
   * @description: 選項變更函數
   * @param val
   */  
  const handleChange = (val) => {
    emit('change', val)
  }
</script>

<style lang="scss" module>

</style>
