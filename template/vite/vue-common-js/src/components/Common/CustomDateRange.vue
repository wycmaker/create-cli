<template>
  <div style="display:inline-block">
    <el-date-picker
      v-model="startDateValue"
      type="date"
      value-format="YYYY-MM-DD"
      :clearable="true"
      @change="startChange"
      placeholder="">
    </el-date-picker>
    <label>到</label>
    <el-date-picker
      v-model="endDateValue"
      type="date"
      value-format="YYYY-MM-DD"
      :clearable="false"
      @change="endChange"
      :disabled-date="disabledDate"
      placeholder="">
    </el-date-picker>
  </div>
</template>

<script setup>
  const emit = defineEmits([ 'change', 'update:startDate', 'update:endDate' ])
  const props = defineProps({
    ...dateRangeProp
  })

  const startDateValue = useVModel(props, 'startDate')

  const endDateValue = useVModel(props, 'endDate')

  /**
   * @description: 結束日期Date-Picker禁用日期判斷
   * @param {Date} time 比對的時間
   * @return {*}
   */  
  const disabledDate = (time) => {
    if(startDateValue.value === null) return null 
    else return new Date(startDateValue.value).getTime() > (time.getTime() + 86400000)
  }

  /**
   * @description: 開始日期改變
   * @param val 變更的數值
   */  
  const startChange = (val) => {
    if(val !== null) {
      if(endDateValue.value === null || endDateValue.value === '') {
        endDateValue.value = new Date(val).formatString('-')
      }
      else if(endDateValue.value !== null && new Date(val).getTime() > new Date(endDateValue.value).getTime()) {
        endDateValue.value = new Date(val).formatString('-')
      }
    } else endDateValue.value = null
    emit('change')
  }

  /**
   * @description: 結束日期變更
   * @param val 變更的數值
   */  
  const endChange = (val) => {
    if(val !== null && (startDateValue.value === null || startDateValue.value === '')) 
      startDateValue.value = new Date(val).formatString('-')
    emit('change')
  }
</script>

<style lang="scss" module>

</style>
