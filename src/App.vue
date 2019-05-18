<template>
    <div id="app">
        <!-- 承载主页面显示内容 -->
        <router-view/>
        <FooterGuide v-show="$route.meta.showFooter"/>
    </div>
</template>
<script>
    import FooterGuide from './components/FooterGuide/FooterGuide.vue'

    export default {
        components: {
            FooterGuide
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
#app
  width 100%
  height 100%
  background #f5f5f5
</style>