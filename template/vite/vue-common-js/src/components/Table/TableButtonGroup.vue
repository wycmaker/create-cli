<template>
  <div :class="$style.center">
    <el-button :class="[$style['btn-B'], $style['table-btn']]" icon="EditPen" :disabled="disable[0]" v-if="show[0]" @click="updateItem(scope?.$index)"></el-button>
    <el-button :class="[$style['btn-B'], $style['table-btn']]" icon="View" :disabled="disable[1]" v-if="show[1]" @click="watchItem(scope?.$index)"></el-button>
    <el-button :class="[(isDelete == true ? $style['btn-B'] : $style['btn-E']), $style['table-btn']]" :disabled="disable[2]" :icon="(isDelete == true) ? 'Delete' : 'Setting'" v-if="show[2]" @click="deleteItem(scope?.$index)"></el-button>
  </div>
</template>

<script setup>
  const emit = defineEmits([ 'update', 'delete', 'watch' ])
  const props = defineProps({
    scope: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Array,
      default: () => [ true, true, false ]
    },
    disable: {
      type: Array,
      default: () => [ false, false, false ]
    },
    isDelete : {
      type: Boolean,
      default: true
    }
  })

  /**
   * 按下修改按鈕
   * @param index 陣列索引值
   */
  const updateItem = (index) => {
    emit('update', index)
  }

  /**
   * 按下刪除按鈕
   * @param index 陣列索引值
   */
  const deleteItem = (index) => {
    emit('delete', index)
  }

  /**
   * 按下檢視按鈕
   * @param index 陣列索引值
   */
  const watchItem = (index) => {
    emit('watch', index)
  }
</script>

<style lang="scss" module>
  .table-btn {
    width: 32px;
  }
</style>
