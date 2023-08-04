<template>
  <el-switch
    v-model="enable"
    active-color="#616AFE"
    inactive-color="#8686BC"
    :active-text="switchText[0]"
    :inactive-text="switchText[1]"
    @change="onChange"
    :disabled="disabled"
    :class="$style.switch"
  >
  </el-switch>
</template>

<script setup>
  const emit = defineEmits([ 'update:modelValue', 'change' ])
  const props = defineProps({
    modelValue: Boolean,
    disabled: {
      type: Boolean,
      default: false
    },
    switchText: {
      type: Array,
      default: () => { return [ '啟用', '停用' ] }
    }
  })

  /**
   * @description: 數值變更函數
   * @param val 變更的數值
   */  
  const onChange = (val) => {
    emit('change', val)
  }

  const enable = useVModel(props, 'modelValue')
</script>

<style lang="scss" module>
  @include switch-setting($switch-active, $switch-unactive, $switch-default);
</style>
