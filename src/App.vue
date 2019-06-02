<template>
    <div id="app">
        <!-- 承载主页面显示内容 -->
        <!-- 当路由匹配到某个组件时（如MSite），便会渲染该组件，此时router-view组件便会被替换，不一定需要router-link -->
        <router-view/>
        <!-- 此处放置底部内容，同时接受路由组件传来的参数控制显示隐藏 -->
        <FooterGuide v-show="$route.meta.showFooter"/>
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    import FooterGuide from './components/FooterGuide/FooterGuide.vue'

    export default {
        mounted (){
            // this.$store.dispatch('getAddress')
            this.getAddress()
            this.getUserInfo()
        },
        components: {
            FooterGuide
        },
        methods: {
            ...mapActions(['getAddress', 'getUserInfo'])
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
#app
  width 100%
  height 100%
  background #f5f5f5
</style>