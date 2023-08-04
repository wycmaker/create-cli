<template>
  <div :class="[$style.block, (needBack === false) ? $style['title-normal'] : $style['title-back']]">
    <el-button v-if="needBack" @click="goBack" :class="[$style.btn]">
      <el-icon :size="18"><Back /></el-icon>
    </el-button>
    <h1 :class="$style.title">{{ title }}</h1>
  </div>
</template>
  
<script setup>
  const emit = defineEmits(['back'])

  const props = defineProps({
    title: {
      type: String,
      default: null
    },
    needBack: {
      type: Boolean,
      default: false
    }
  })

  const { title, needBack } = props

  /**
   * @description: 按下返回按鈕執行函數
   * @return {*}
   */  
  const goBack = () => {
    emit('back')
  }
</script>
  
<style lang="scss" module>
  .block {
    display: flex;

    & h1 {
      margin: 0px 0px 0px 15px;
    }
  }

  .btn {
    &:global(.el-button) {
      @include button-color-setting($white-color, $subtitle-color, $subtitle-color, $white-color, $subtitle-color, $subtitle-color, $hover-color-2);
      border-radius: 32px;
      padding: 12px;
      height: 32px;
      width: 32px;
    }
  }

  .title {
    @include font-setting(22px, unset, $subtitle-color, 36px);

    &-normal {
      margin-bottom: 0px;
    }

    &-back {
      margin-bottom: 20px;
    }
  }
</style>
