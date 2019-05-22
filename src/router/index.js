/**
 * 路由器对象模块
 */
// 路由组件映射成路由，标签组件映射成标签
import Vue from 'vue'
import VueRouter from 'vue-router'
import MSite from '../pages/MSite/MSite.vue'
import Search from '../pages/Search/Search.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'
import Login from '../pages/Login/Login.vue'
import Shop from '../pages/Shop/Shop.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods.vue'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings.vue'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue'

//声明使用插件
Vue.use(VueRouter)

export default new VueRouter({
    //所有路由
    routes: [
        {
            path: '/msite',
            component: MSite,
            // meta可以在路由时作为参数传入，此处为控制显示与否
            meta: {
                showFooter: true
            }
        },
        {
            path: '/order',
            component: Order,
            meta: {
                showFooter: true
            }
        },
        {
            path: '/search',
            component: Search,
            meta: {
                showFooter: true
            }
        },
        {
            path: '/profile',
            component: Profile,
            meta: {
                showFooter: true
            }
        },
        {
            path: '/login',
            component: Login,
            meta: {
                showFooter: false
            }
        },
        {
            path: '/shop',
            component: Shop,
            children: [
                {
                    path: '/shop/goods',
                    component: ShopGoods,
                },
                {
                    path: '/shop/info',
                    component: ShopInfo,
                },
                {
                    path: '/shop/ratings',
                    component: ShopRatings,
                },
                {
                    path: '/',
                    redirect: '/shop/goods'
                }
            ]
        },
        {
            path: '/',
            redirect: '/msite'
        }
    ]
})