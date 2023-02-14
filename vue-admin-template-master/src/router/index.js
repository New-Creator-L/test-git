import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
//整个项目的框架结构，其余所有路由组件都是放置在layout下展示
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',//重定向(也就是访问“/”时立马跳转到children中的路由)
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }//title(侧边栏展示的信息)
    }]
  },
  {
    path:"/product",
    component:Layout,// 因为所有路由都是在layout下，故每一个一级路由都要写此配置项
    name:'Product',
    meta:{title:'商品管理',icon:'el-icon-goods'},
    children:[
      {
        path:'trademarke',
        name:'Trademark',
        component:()=>import('@/views/product/tradeMark'),//路由懒加载
        meta:{title:'品牌管理'}
      },
      {
        path:'sku',
        name:'Sku',
        component:()=>import('@/views/product/SKU'),
        meta:{title:'sku管理'}
      },
      {
        path:'spu',
        name:'Spu',
        component:()=>import('@/views/product/SPU'),
        meta:{title:'spu管理'}
      },
      {
        path:'attr',
        name:'Attr',
        component:()=>import('@/views/product/attr'),
        meta:{title:'平台属性管理'}
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
