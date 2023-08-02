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

<script setup lang="ts">
  const emit = defineEmits([ 'update', 'delete', 'watch' ])
  const props = withDefaults(defineProps<TableColumnProp & {
    show: Array<boolean>,
    isDelete: boolean,
    isCustom: boolean,
  }>(), {
    show: () => { return [ true, false, false ] },
    isDelete: false,
    isCustom: false,
    label: '',
    width: '',
    align: '',
    prop: '',
    fix: '',
    className: ''
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

<style>

</style>
