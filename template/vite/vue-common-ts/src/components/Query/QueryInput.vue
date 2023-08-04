<template>
  <div :class="[$style['query-item']]">
    <label style="display:inline-block;" :style="(titleWidth !== undefined && titleWidth !== '') ? `width: ${titleWidth}` : ''">{{ title }}</label>
    <el-input v-model="bindValue" placeholder="" clearable :style="`width: ${width}`"></el-input>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<QueryCommonProp & {
    modelValue: string,
  }>(), {
    width: '160px',
    value: ''
  })

  const emit = defineEmits([ 'update:modelValue' ])

  const bindValue = useVModel(props, 'modelValue')
</script>

<style lang="scss" module>

</style>
