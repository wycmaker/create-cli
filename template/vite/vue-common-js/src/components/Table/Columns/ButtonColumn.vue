<template>
  <el-table-column :label="label" :width="width" :align="align" :prop="prop" :fixed="fix" :class-name="className">
    <template #header>
      <slot name="header"></slot>
    </template>
    <template #default="scope">
      <!-- <label>{{ scope.row }}</label> -->
      <template v-if="!isCustom">
        <table-button-group 
          :scope="scope" 
          :show="show"
          :disable="[scope.row.editable, scope.row.watchable, scope.row.deleteable]"
          :isDelete="isDelete"
          @update="updateItem"
          @delete="deleteItem"
          @watch="watchItem"
        ></table-button-group>
      </template>
      <template v-else>
        <slot name="content" :row="scope.row" :index="scope.$index"></slot>
      </template>
    </template>
  </el-table-column>
</template>

<script setup>
  const emit = defineEmits([ 'update', 'delete', 'watch' ])
  const props = defineProps({
    ...tableColumnProp,
    show: {
      type: Array,
      default: () => [true, false, false]
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    isCustom: {
      type: Boolean,
      default: false
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

<style>

</style>
