<template>
  <div :class="[$style['query-item']]">
    <label style="display:inline-block;" :style="(titleWidth !== null && titleWidth !== '') ? `width: ${titleWidth}` : ''">{{ title }}</label>
    <custom-date-range v-model:startDate="startDateValue" v-model:endDate="endDateValue" @change="dateChange"></custom-date-range>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits([ 'change', 'update:startDate', 'update:endDate' ])
  const props = withDefaults(defineProps<QueryCommonProp & DateRangeProp>(), {
    startDate: '',
    endDate: ''
  })

  const startDateValue = useVModel(props, 'startDate')
  const endDateValue = useVModel(props, 'endDate')

  const dateChange = () => {
    emit('change')
  }
</script>

<style lang="scss" module>

</style>
