<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on: loginWay}" @click="loginWay=true">短信登录</a>
            <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="login">
            <div :class="{on: loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <!-- 凡是在form表单中点击任意按钮，都会出发提交事件，此处禁止默认提交事件 -->
                <button :disabled="!rightPhone" class="get_verification" :class="{right_phone: rightPhone}" @click.prevent="getCode">
                  {{computeTime?'已发送('+computeTime+'s)':'获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on: !loginWay}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="tel" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-if="!showPwd" v-model="pwd">
                  <div class="switch_button" @click="showPwd=!showPwd" :class="{off: !showPwd, on: showPwd}">
                    <div class="switch_circle" :class="{right: showPwd}"></div>
                    <span class="switch_text" v-if="!showPwd">...</span>
                    <span class="switch_text" v-else>abc</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="updateCode" ref="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back">
          <i class="iconfont icon-jiantou2" @click="$router.back()"></i>
        </a>
      </div>
      <AlertTip :alertText="alertText" v-show="showAlert" @closeTip="closeTip"/>
    </section>
</template>
<script>
  import AlertTip from '../../components/AlertTip/AlertTip.vue'
  import {reqPwdLogin, reqSendCode, reqSmsLogin} from '../../api'
    export default {
      components: {
        AlertTip
      },
      data (){
        return {
          loginWay: true,//true代表短信登录,false代表密码登录
          showPwd: false,//是否显示密码
          phone: '',//手机号
          code: '',//短信验证码
          computeTime: 0,//计时
          pwd: '',//密码
          name: '',//手机号/邮箱/用户名
          captcha: '',//字符验证码
          alertText: '',//提示文本
          showAlert: false,//是否显示提示框
        }
      },
      methods: {
        // 异步获取短信验证码
        async getCode (){
          // 如果当前没有计时才启动计时
          if(this.computeTime==0){
            // 启动倒计时
            this.computeTime = 30;
            this.intervalId = setInterval(()=>{
              this.computeTime--;
              if(this.computeTime<=0){
                //停止计时
                clearInterval(this.intervalId)
              }
            },1000)
            // 发送ajax请求（向制定手机号发送验证码短信）
            const result = await reqSendCode(this.phone)
            if(result.code===1){
              // 显示提示
              this.showAlert1(result.msg);
              // 停止倒计时
              if(this.computeTime){
                this.computeTime = 0;
                clearInterval(this.intervalId);
                this.intervalId = 0;
              }
            }
          }
        },
        showAlert1 (alertText){
          this.showAlert = true;
          this.alertText = alertText+',请重新输入！'
        },
        // 实现异步登录
        async login (){
          let result
          // 前台表单验证
          if(this.loginWay){//短信登录
            const {rightPhone, phone, code} = this
            if(!this.rightPhone) {
              //手机号不正确
              this.showAlert1('手机号不正确')
            }else if(!/^\d{6}$/.test(code)){
              this.showAlert1('验证码不正确')
              return
            }
            // 发送ajax请求短信登录
            result = await reqSmsLogin(phone, code)
            
          }else {//密码登录
            const {name, pwd, captcha} = this
            if(!this.name){
              // 用户名必须指定
              this.showAlert1('用户名不正确')
              return
            }else if(!this.pwd){
              // 密码必须指定
              this.showAlert1('密码不正确')
              return
            }else if(!this.captcha){
              // 验证码必须指定
              this.showAlert1('验证码不正确')
              return
            }
            // 发送ajax请求密码登录
            result = await reqPwdLogin({name, pwd, captcha})
          }

          // 停止倒计时
          if(this.computeTime){
            this.computeTime = 0;
            clearInterval(this.intervalId);
            this.intervalId = 0;
          }
          // 根据结果数据进行处理
          if(result.code===0){
            // 成功
            const user = result.data
            // 将user保存到vuex的state中
            this.$store.dispatch('recordUser', user)
            // 跳转路由，到个人中心界面
            this.$router.replace('/profile')
          }else {
            // 失败
            const msg = result.msg;
            this.showAlert1(msg);
            // 显示新的图片验证码
            this.updateCode();
          }
        },
        // 点击更换验证码
        updateCode (){
          // 每次指定的src需要不同，前半部分不可变化，于是加上时间值
          this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
        },
        // 关闭提醒框
        closeTip (){
          this.showAlert = false;
          this.alertText = ''
        }
      },
      computed: {
        rightPhone (){
          return /^1\d{10}$/.test(this.phone)
        }
      }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixins.styl"
.loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone
                    color #000
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform translateX(28px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>