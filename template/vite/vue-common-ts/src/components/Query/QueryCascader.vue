<template>
  <div :class="[$style['query-item']]">
    <label style="display:inline-block;" :style="(titleWidth !== undefined && titleWidth !== '') ? `width: ${titleWidth}` : ''">{{ title }}</label>
    <custom-cascader
      :options="options"
      v-model="bindValue"
      :clearable="clearable"
      :disabled="disabled"
      :collapse-tags="collapseTags"
      :style="`width: ${width}`"
      @change="handleChange"
    ></custom-cascader>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(defineProps<QueryCommonProp & SelectProp>(), {
    width: '160px',
    options: () => { return [] as Array<any> },
    clearable: true,
    disabled: false,
    collapseTags: false
  })
  const emit = defineEmits([ 'update:modelValue', 'change' ])
  const bindValue = useVModel(props, 'modelValue')

  const handleChange = (val:Array<any>|Number|String|Boolean) => {
    emit('change', val)
  }
  
</script>

<style lang="scss" module>

</style>
