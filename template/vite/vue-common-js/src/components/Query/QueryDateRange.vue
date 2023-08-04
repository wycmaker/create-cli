<template>
  <div :class="[$style['query-item']]">
    <label style="display:inline-block;" :style="(titleWidth !== null && titleWidth !== '') ? `width: ${titleWidth}` : ''">{{ title }}</label>
    <custom-date-range v-model:startDate="startDateValue" v-model:endDate="endDateValue" @change="dateChange"></custom-date-range>
  </div>
</template>

<script setup>
  const emit = defineEmits([ 'change', 'update:startDate', 'update:endDate' ])
  const props = defineProps({
    ...queryCommonProp,
    ...dateRangeProp
  })

  const startDateValue = useVModel(props, 'startDate')
  const endDateValue = useVModel(props, 'endDate')

  const dateChange = () => {
    emit('change')
  }
</script>

<style lang="scss" module>

</style>
