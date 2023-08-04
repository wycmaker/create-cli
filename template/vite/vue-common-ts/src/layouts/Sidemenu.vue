<template>
  <div :class="[$style.background, (show === true) ? $style.open : $style.close]">
    <el-icon @click="collapse" :class="$style.collapse">
      <Fold />
    </el-icon>
    <!-- 多層Menu結構使用 -->
    <!-- <ul :class="[$style['menu-main']]">
      <li v-for="(item, index) in menuList" :key="index">
        <p @click="foldMenu(item.name)" style="margin: 10px 0px" :class="[$style['menu-item'], (item.subList.map(r => r.path).includes(nowActive)) ? $style.active : $style.notActive]">
          <el-icon>
            <SetUp v-if="item.name === 'accountManage'" />
            <Tickets v-else />
          </el-icon>
          <template v-if="show">&nbsp;&nbsp;{{item.label}}　</template>
          <el-icon :class="(fold === item.name) ? $style.up : $style.down" v-if="show">
            <ArrowUp />
          </el-icon>
        </p>
        <transition-group name="slide-fade" v-if="show">
          <ul :class="[$style['menu-sub']]" v-if="fold === item.name">
            <template v-for="(url, urlIndex) in item.subList">
              <a :key="urlIndex" @click="changePage(url.path)" v-if="url.show"><li :class="[(nowActive == url.path) ? $style.active : $style.notActive]">{{ url.name }}</li></a>
            </template>
          </ul>
        </transition-group>
      </li>
    </ul> -->
    <!-- 單層Menu結構使用 -->
    <ul :class="[$style['menu-main']]" v-if="show">
      <template v-for="(url, urlIndex) in menu">
        <a :key="urlIndex" @click="changePage(url.path)" v-if="url.show">
          <li :class="[(nowActive == url.path) ? $style.active : $style.notActive]">
            　{{ url.name }}
          </li>
        </a>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(['change'])
  const fold = ref('')
  const show = ref(false)
  const oldFold = ref('')
  const menu = reactive([
    {
      icon: '',
      name: '病歷清單',
      path: '',
      show: true
    },
    {
      icon: '',
      name: '病歷匯出管理',
      path: '1',
      show: true
    },
    {
      icon: '',
      name: '資料統計查詢',
      path: '2',
      show: true
    },
    {
      icon: '',
      name: '醫師班表管理',
      path: '3',
      show: true
    },
    {
      icon: '',
      name: '帳號權限管理',
      path: '4',
      show: true
    }
  ])
  const menuList = reactive([
    { 
      icon: 'el-icon-tickets', 
      name: 'reportSystem',
      label: '報告系統',
      subList: [
        { 
          name: '報告清單',
          path: '',
          show: true
        },
        { 
          name: '醫囑公式',
          path: 'doctororderformula',
          show: true
        },
        { 
          name: '報告紀錄查詢',
          path: 'importquery',
          show: true
        },
        { 
          name: '睡眠問卷查詢',
          path: 'questionnairelist',
          show: true
        },
        { 
          name: '匯出報表',
          path: 'chartexport',
          show: true
        },
      ]
    },
    { 
      icon: 'el-icon-setting', 
      name: 'accountManage',
      label: '帳號管理',
      subList: [
        { 
          name: '使用者維護',
          path: 'usermanage',
          show: true
        },
        { 
          name: '群組維護',
          path: 'groupmanage',
          show: true
        },
        { 
          name: '範本維護',
          path: 'templatemanage',
          show: true
        },
        { 
          name: '個人資料修改',
          path: 'personalpage',
          show: true
        },
      ]
    }
  ])

  const reload = inject(reloadInjectKey)

  /**
   * 收折Sidemenu(多層次Menu使用)
   * @param type 
   */
  const foldMenu = (type:string) => {
    if(show.value) {
      if(type === fold.value) fold.value = ''
      else fold.value = type
      oldFold.value = fold.value
    }
  }

  /**
   * 頁面跳轉
   * @param pagePath 頁面路徑
   */
  const changePage = (pagePath:string) => {
    let path = location.hash.toLowerCase().getPath()
    if(path === pagePath) {
      reload?.()
    } else {
      router.push('/' + pagePath)
    }
  }

  /**
   * 開合Sidemenu
   */
  const collapse = () => {
    show.value = !show.value
    emit('change', show.value)
    if(fold.value !== '') {
      oldFold.value = fold.value
      fold.value = ''
    } 
    else {
      fold.value = oldFold.value
    }
  }

  const nowActive = computed(() => {
    return location.hash.toLowerCase().getPath();
  })

  onMounted(() => {
    /* 多層Menu結構使用 */
    let pathName = location.hash.toLowerCase().getPath()
    menuList.forEach(item => {
      item.subList.forEach(url => {
        if(url.path === pathName) {
          oldFold.value = item.name
        }
      })
    })
  })
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

<style lang="scss" module>

  .background {
    @include font-setting(20px, bold, $white-color);
    @include block-size-setting(210px, 100vh, center, $sidemenu-background);
  }

  .down {
    & svg {
    transform: rotate(-180deg);
    transition:transform 0.4s linear;
    }
  }

  .up {
    & svg {
      transform: rotate(0deg);
      transition:transform 0.4s linear;
    }
  }

  .open {
    width: 210px;
    color: $icon-color;

    :global {
      .el-icon {
        right: -80px;
        transition: right 0.4s;
      }
    }

    transition: all 0.4s;
  }

  .close {
    width: 40px;
    color: $white-color;
    transition: width 0.4s;

    :global {
      .el-icon {
        left: 0px;
      }
    }
  }

  .show {
    width: 180px;
    opacity: 1;
    transition: all 0.4s ease-out;
  }

  .hide {
    width: 0px;
    opacity: 0;
    transition: all 0.4s ease-out;
  }

  .menu {

    &-main {
      @extend %menu-shared;
      cursor: default;
      @include block-size-setting(180px, unset, left, unset, unset, 50px 0 0 0);

      -webkit-user-select:none;
      -moz-user-select:none;
      -o-user-select:none; 
      user-select:none;

      :global {
        .el-icon {
          top: 2px;
          right: 0px;
        }
      }
    }

    &-main li {
      margin: 15px 0 15px 10px;
      cursor: pointer;
    }

    &-main a {
      text-decoration: none;
    }

    &-sub {
      @extend %menu-shared;
      margin-left: 30px;
      height: 100%;
      transition: height 2s;
      a {
        cursor: pointer;
      }

      &:hover {
        height: 0px;
      }
    }

    &-logo {
      margin-top: 25px;
    }

    &-picture {
      position: absolute;
      bottom: 20px;
      left: 10px;
      width: 180px;
      z-index: 2;
    }
  }

  .active {
    color: $menu-color-1;
  }

  .notActive {
    color: $white-color;
    &:hover {
      color: $hover-color-7;
    }
  }

  .collapse {
    top: 10px;
    font-size: 25px !important;
  }
</style>
