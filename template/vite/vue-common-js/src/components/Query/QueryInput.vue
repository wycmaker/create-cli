<template>
  <div :class="[$style['query-item']]">
    <label style="display:inline-block;" :style="(titleWidth !== undefined && titleWidth !== '') ? `width: ${titleWidth}` : ''">{{ title }}</label>
    <el-input v-model="bindValue" placeholder="" clearable :style="`width: ${width}`"></el-input>
  </div>
</template>

<script setup>
  const props = defineProps({
    ...queryCommonProp,
    modelValue: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits([ 'update:modelValue' ])

  const bindValue = useVModel(props, 'modelValue')
</script>

<style lang="scss" module>

</style>
