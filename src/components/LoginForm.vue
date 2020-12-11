<template>
  <div class="login-form">
    <div class="title">Please input your name</div>
    <input class="input" v-model="name" type="text" placeholder="Name">
    <input class="input" v-model="email" type="text" placeholder="Email">
    <div class="tip" :style="{'opacity':right ?0:1}">Please confirm email</div>
    <div class="btns">
      <div class="cancel btn pointer" @click="handleCancel">Cancel</div>
      <div class="ok btn pointer" @click="handleSitDown">OK</div>
    </div>
    <div class="iconfont icon-cuowu icon-close" @click="handleCancel"></div>
  </div>
</template>
<script>
  import { isEmail } from "assets/js/utils.js"

  export default {

    data() {
      return {
        name: '',
        email: '',
        right: true
      }
    },
    methods: {
      handleCancel() {
        this.$emit('handleCancel')
      },
      handleSitDown() {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        this.right = reg.test(this.email);
        if (this.name !== '' && this.email !== '') {
          if (reg.test(this.email)) {
            this.$emit('handleSitDown', { name: this.name, emial: this.email })
          }
        }
      },

    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .pointer:active {
    opacity: .5;
  }

  .pointer {
    cursor: pointer;
  }

  .icon-close {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .icon-close:hover {
    opacity: .5;
  }

  .tip {
    color: red;
    text-align: left;
    font-size: 12px;
  }

  .login-form {
    @include wh(380px, 260px);
    position: relative;
    text-align: center;
    background: $fc;
    box-shadow: 0px 0px 8px 0px #B0B0B0;
    border-radius: 4px;
    padding: 20px 50px;

    .title {
      @include sc(20px, #000);
      font-family: PingFangSC-Regular, PingFang SC;

    }

    .input {
      @include wh(280px, 40px);
      @include sc(18px, #9B9B9B);
      padding-left: 13px;
      margin-top: 21px;
      background: #E7E7E7;
      border-radius: 4px;
      outline: none;

      font-family: PingFangSC-Regular, PingFang SC;

    }

    .btns {

      @include fj();
      margin-top: 14px;

      .btn {
        @include wh(110px, 40px);
        line-height: 40px;
        border-radius: 4px;
        color: $fc;

      }

      .cancel {
        background: #bbb;
      }

      .ok {
        background: #FA6400;
      }
    }
  }
</style>