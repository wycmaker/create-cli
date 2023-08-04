const Header = () => import('@/layouts/Header.vue')
const Sidemenu = () => import('@/layouts/Sidemenu.vue')
const HelloWorld = () => import("../components/HelloWorld.vue")

const routes = [
  {
    path: '/Login',
    components: {
      header:Header,
      sidemenu: Sidemenu,
      default: HelloWorld
    }
  },
  {
    path: '/',
    components: {
      header:Header,
      sidemenu: Sidemenu,
      default: HelloWorld
    }
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})