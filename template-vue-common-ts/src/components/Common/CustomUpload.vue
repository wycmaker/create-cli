<template>
  <div>
    <el-upload
      action=""
      :auto-upload="false"
      v-model:file-list="data.fileList"
      list-type="picture-card"
      :on-change="handleChange"
      accept=".pdf, .docx, .doc, .odt, .txt, .csv, .ods, .xls, .xlsx, .mp4, .mpeg, .mp3, .wav, .jpg, .png"
      :class="[$style.upload, (data.fileList.length === limit) ? $style.hiddenAdd : null]"
      :limit="limit"
      :multiple="true"
      :disabled="disabled"
      class="loading">
      <el-icon><Plus /></el-icon>
      <template #file="{file}">
        <template v-if="file.name.split('.').pop() !== 'jpg' && file.name.split('.').pop() !== 'png'">
          <p style="margin: 14px auto">
            <el-icon style="font-size: 80px;margin: 0 auto"><Document /></el-icon>
            <br/>
            <label style="font-size:12px;margin: 0px">{{ file.name }}</label>
          </p>
        </template>
        <template v-else>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        </template>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handleDownload(file)">
            <el-icon v-if="file.name.split('.').pop() !== 'jpg' && file.name.split('.').pop() !== 'png'"><Download /></el-icon>
            <el-icon v-else><ZoomIn /></el-icon>
          </span>
          <span class="el-upload-list__item-delete">
            <el-icon @click="fileRemove(file)"><Delete /></el-icon>
          </span>
        </span>
      </template>
    </el-upload>

    <el-dialog v-model="showPicture" append-to-body :close-on-click-modal="false" :class="[ $style.dialog, $style['picture-dialog']]">
      <img :src="imgSrc" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits([ 'delete', 'update:dataAttr' ])
const props = defineProps({
  dataAttr: {
    type: Object,
    default: () => { return {} }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 5
  }
})

const data = useVModel(props, 'dataAttr')
const showPicture = ref(false)
const imgSrc = ref('')

/**
 * 上傳檔案變更
 * @param file 檔案物件
 * @param fileList 檔案列表
 * @return
 */  
const handleChange = (file:File, fileList:Array<File>) => {
  // 1024 * 1024 = 1MB
  if(file.size > 5 * 1024 * 1024) {
    info.warning('檔案不可大於5MB')
    fileList.splice(fileList.length-1, 1)
  }
  else {
    data.value.fileList.push(file)
  }
}

/**
 * 移除上傳檔案
 * @param file 檔案物件
 */  
const fileRemove = (file:any) => {
  info.confirm('您確定要刪除此檔案?').then(() => {
    let uid = file.uid
    let fileList = data.value.fileList as Array<any>
    let index = fileList.findIndex(item => item.uid === uid)
    if(index !== -1) {
      let target = data.value.fileList[index]
      if(target.actualFileName === undefined) {
        data.value.fileList.splice(index, 1)
        info.success('刪除檔案成功')
      }
      else {
        emit('delete')
      }
    }
  }).catch(() => {})
}

/**
 * @description: 下載檔案
 * @param {File} file 檔案物件
 */  
const handleDownload = (file:any) => {
  let name = file.name
  let arr = name.split('.')
  let length = arr.length
  let extension = arr[length - 1]
  if(extension === 'jpg' || extension === 'png') {
    showPicture.value = true
    imgSrc.value = file.url
  }
  else {
    let a = document.createElement('a')
    a.style.display = 'none'
    a.href = file.url
    a.download = file.name
    a.click()
  }
}

</script>

<style lang="scss" module>

.upload {
  :global(.el-upload--picture-card) {
    background-color: #fafafa;
    border-color: #cccccc;

    i {
      color: #b3b3b3;
    }
  }
}

.hiddenAdd {
  :global {
    .el-upload--picture-card {
      display: none !important;
    }
  }
}

.picture-dialog {
  width: 50%;

  @media (max-width: 1180px) {
    width: 75%;
  }

  :global {
    .el-dialog__body {
      text-align: center;
      padding: 15px;

      & img {
        margin-top: 15px;
        width: 100%;
      }
    }
  }
}
</style>
