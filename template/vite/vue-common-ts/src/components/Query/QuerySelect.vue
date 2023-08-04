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

<script setup lang="ts">
  const props = withDefaults(defineProps<QueryCommonProp & SelectProp>(), {
    width: '160px',
    options: () => { return [] as Array<any> },
    clearable: true,
    multiple: false,
    disabled: false,
    useLabel: false,
    customLabel: '',
    collapseTags: false
  })

  const emit = defineEmits([ 'change', 'update:modelValue' ])

  const bindValue = useVModel(props, 'modelValue')

  const selectChange = (val:Array<any>|Number|String|Boolean) => {
    emit('change', val)
  }
</script>

<style lang="scss" module>

</style>
