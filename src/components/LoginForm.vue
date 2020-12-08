<template>
  <div class="login-form">
    <div class="title">Please input your name</div>
    <input class="input" v-model="name" type="text" placeholder="Name">
    <input class="input" v-model="email" type="text" placeholder="Email">
    <div class="btns">
      <div class="cancel btn" @click="handleCancel">Cancel</div>
      <div class="ok btn" @click="sitDown">OK</div>
    </div>
  </div>
</template>
<script>
  import { isEmail } from "assets/js/utils.js"

  export default {
  
    data() {
      return {
        name: '',
        email: ''
      }
    },
    methods: {
      handleCancel() {
        this.$emit('handleCancel')
      },
      sitDown() {
        var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        console.log(reg.test(this.email))
        if (this.name !== '' && this.email !== '') {
          if (reg.test(this.email)) {
            
            this.$emit('sitDown', { name: this.name, emial: this.email })
          }
        }
      },

    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .login-form {
    @include wh(380px, 260px);
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
      margin-top: 30px;

      .btn {
        @include wh(110px, 40px);
        line-height: 40px;
        border-radius: 4px;
        color: $fc;
        cursor: pointer;
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