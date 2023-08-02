<template>
  <div :class="$style.center">
    <el-button :class="[$style['btn-B'], $style['table-btn']]" icon="EditPen" :disabled="disable[0]" v-if="show[0]" @click="updateItem(scope?.$index)"></el-button>
    <el-button :class="[$style['btn-B'], $style['table-btn']]" icon="View" :disabled="disable[1]" v-if="show[1]" @click="watchItem(scope?.$index)"></el-button>
    <el-button :class="[(isDelete == true ? $style['btn-B'] : $style['btn-E']), $style['table-btn']]" :disabled="disable[2]" :icon="(isDelete == true) ? 'Delete' : 'Setting'" v-if="show[2]" @click="deleteItem(scope?.$index)"></el-button>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits([ 'update', 'delete', 'watch' ])
  const props = withDefaults(defineProps<{
    scope: any,
    show: Array<boolean>,
    disable: Array<boolean>,
    isDelete: boolean
  }>(), {
    show: () => { return [true, true, false] },
    disable: () => { return [false, false, false] },
    isDelete: true
  })

  /**
   * 按下修改按鈕
   * @param index 陣列索引值
   */
  const updateItem = (index:number) => {
    emit('update', index)
  }

  /**
   * 按下刪除按鈕
   * @param index 陣列索引值
   */
  const deleteItem = (index:number) => {
    emit('delete', index)
  }

  /**
   * 按下檢視按鈕
   * @param index 陣列索引值
   */
  const watchItem = (index:number) => {
    emit('watch', index)
  }
</script>

<style lang="scss" module>
  .table-btn {
    width: 32px;
  }
</style>
