<template>
  <div :class="[$style['query-item']]">
    <label style="display:inline-block;" :style="(titleWidth !== undefined && titleWidth !== '') ? `width: ${titleWidth}` : ''">{{ title }}</label>
    <custom-select
      :options="options"
      v-model="bindValue"
      :clearable="clearable"
      :multiple="multiple"
      :disabled="disabled"
      :use-label="useLabel"
      :custom-label="customLabel"
      :collapse-tags="collapseTags"
      @change="selectChange"
      :style="`width: ${width}`"
    ></custom-select>
  </div>
</template>

<script setup>
  const props = defineProps({
    ...queryCommonProp,
    ...selectProp
  })

  const emit = defineEmits([ 'change', 'update:modelValue' ])

  const bindValue = useVModel(props, 'modelValue')

  const selectChange = (val) => {
    emit('change', val)
  }
</script>

<style lang="scss" module>

</style>
