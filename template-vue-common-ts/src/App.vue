<template>
<el-container :class="$style.main">
    <router-view name="sidemenu" @change="menuChange"></router-view>
    <el-container :class="(show === true) ? $style.open : $style.close">
      <el-header height="60px">
        <router-view name="header"></router-view>
      </el-header>
      <router-view v-slot="{ Component }">
        <component ref="page" :is="Component"></component>
      </router-view>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  const page: any = ref(null)
  const show: Ref<boolean> = ref(false)
  const commonStore = useCommonStore()

  const menuChange = (value:boolean) => {
    show.value = value
  }

  onMounted(() => {
    commonStore.setClientWidth(document.body.clientWidth)
    window.onresize = () => {
      commonStore.setClientWidth(document.body.clientWidth)
    }
  })

  provide(reloadInjectKey, () => {
    if(page.value) {
      page.value.backToList(true)
    }
  })
</script>

<style module>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

body {
  margin: 0px;
}
</style>
