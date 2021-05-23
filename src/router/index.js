import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { trickle } from 'nprogress'

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
    roles:['teacher','student'],
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    roles:['teacher','student','admin'],
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    roles:['teacher','student','admin'],
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/my',
    component: Layout,
    roles:['student','teacher','admin'],
    children: [
      {
        path: 'index',
        name: 'My',
        roles:['student','teacher','admin'],
        component: () => import('@/views/My/index'),
        meta: { title: '个人中心', icon: 'el-icon-user-solid' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    roles:['admin'],
    open:true,
    children: [
      {
        path: 'index',
        name: 'Role',
        roles:['admin'],
        component: () => import('@/views/role/index'),
        meta: { title: '角色管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/lab',
    component: Layout,
    roles:['admin'],
    children: [
      {
        path: 'index',
        name: 'Lab',
        roles:['admin'],
        component: () => import('@/views/Lab/index'),
        meta: { title: '实验室管理', icon: 'el-icon-copy-document' }
      }
    ]
  },
  {
    path: '/device',
    roles:['teacher','student','admin'],
    component: Layout,
    redirect: '/device/index',
    name: 'device',
    index:['1'],
    meta: { title: '设施管理', icon: 'el-icon-s-help'},
    children: [
      {
        path: 'index',
        name: 'device',
        roles:['teacher','student','admin'],
        component: () => import('@/views/device/index'),
        meta: { title: '设备管理', icon: 'el-icon-s-operation' }
      },
      {
        path: 'record',
        name: 'record',
        roles:['teacher','student','admin'],
        component: () => import('@/views/record/index'),
        meta: { title: '租借记录', icon: 'tree' }
      }
    ]
  },
  {
    path: '/table',
    component: Layout,
    roles:['teacher','student','admin'],
    redirect: '/table/index',
    index:['2'],
    name: 'Table',
    meta: { title: '图表统计', icon: 'table' },
    children: [
      {
        path: 'index',
        roles:['teacher','student','admin'],
        name: 'complexTable',
        component: () => import('@/views/table/index'),
        meta: { title: '柱状图表', icon: 'el-icon-s-data' }
      },
      {
        path: 'dragTable',
        roles:['teacher','student','admin'],
        name: 'dragTable',
        component: () => import('@/views/table/dragTable'),
        meta: { title: '混合图表', icon: 'el-icon-data-line' }
      },
    ]
  },
  {
    path: '/verify',
    component: Layout,
    redirect: '/verify/index',
    name: 'Verify',
    index:['3'],
    roles:['teacher','admin'],
    meta: { title: '审核管理', icon: 'el-icon-s-tools'},
    children: [
      {
        path: 'deviceVerify',
        name: 'DeviceVerify',
        roles:['teacher','admin'],
        open:true,
        active:true,
        component: () => import('@/views/verify/deviceVerify'),
        meta: { title: '购买审核', icon: 'el-icon-s-opportunity' }
      },
      {
        path: 'borrowVerify',
        name: 'BorrowVerify',
        roles:['teacher','admin'],
        open:true,
        component: () => import('@/views/verify/borrowVerify'),
        meta: { title: '租借审核', icon: 'el-icon-s-check' }
      },
    ]
  },




  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

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
