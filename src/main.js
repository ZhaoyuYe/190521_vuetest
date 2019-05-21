/**
 * 入口js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 注册
new Vue({
    el: '#app',
    render: h => h(App),
    router,//使用vue-router
    store//使用vuex
})