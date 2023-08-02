<template>
  <div :class="[$style['query-item']]">
    <el-button :class="[$style['btn-B'], $style.radius]" icon="Search" v-if="show[0]" @click="getList"> 搜尋</el-button>
    <el-button :class="[$style['btn-A'], $style.radius]" icon="DocumentAdd" v-if="show[1]" @click="createData"> 新增</el-button>
    <el-button :class="[$style['btn-B'], $style.radius]" v-if="show[2]" @click="exportList" >匯　出</el-button>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits([ 'export', 'add', 'getData' ])
  const props = defineProps({
    show: {
      type: Array,
      default: () => { return [ true, true, false ] }
    }
  })

  /**
   * 匯出資料
   */
  const exportList = () => {
    emit('export')
  }

  /**
   * 新增資料
   */
  const createData = () => {
    emit('add', null)
  }

  /**
   * 取得列表資料
   */
  const getList = () => {
    emit('getData', false)
  }
</script>

<style lang="scss" module>
  .radius {
    border-radius: 36px !important;
    font-size: $font-size-1 !important;
    font-weight: $font-weight-1 !important;
  }

  .query-item {
    :global {
      @include button-padding-setting(9px 19px !important);
    }
    
  }
</style>
