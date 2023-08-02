<template>
  <div :class="$style.center">
    <el-button :class="$style['btn-B']" @click="confirm" v-if="show[0]">{{ confirmText }}</el-button>
    <el-button :class="$style['btn-C']" @click="cancel" v-if="show[1]">{{ cancelText }}</el-button>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits([ 'confirm', 'cancel' ])

  const props = defineProps({
    show: {
      type: Array<boolean>,
      default: () => { return [ true, true ] }
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '確定'
    }
  })

  const { show, cancelText, confirmText } = props

  /**
   * @description: 按下確定按鈕後執行函數
   */  
  const confirm = () => {
    emit('confirm')
  }

  /**
   * @description: 按下取消按鈕後執行函數
   * @return {*}
   */  
  const cancel = () => {
    emit('cancel')
  }
</script>

<style lang="scss" module>
  .center {
    margin-top: 10px;
  }
</style>
