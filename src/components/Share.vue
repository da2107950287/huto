<template>
  <div class="share-form">
    <div class="title">Share the room URL</div>
    <div class="url-box">
      <div class="url">{{url}}</div>
      <div class="copy pointer" v-clipboard:copy="url">Copy</div>
    </div>
    <div class="ok pointer" @click="handleOk">OK</div>
    <div class="iconfont icon-cuowu icon-close" @click="handleOk"></div>

  </div>
</template>
<script>

  export default {
    data() {
      return {
        url: window.location.href
      }
    },
    methods: {
      handleOk() {
        this.$emit("handleOk")
      },

    }

  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';
.pointer{
  cursor: pointer;
}
.pointer:active{
  opacity: .5;
}
.icon-close {
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .icon-close:hover {
    opacity: .5;
  }
  .share-form {
    @include wh(600px, 260px);
    position: relative;
    text-align: center;
    padding: 14px 43px 0;
    background: $fc;
    box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.5);
    border-radius: 4px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;

    .title {
      @include sc(24px, #000);
    }

    .url-box {
      @include fj();
      margin-top: 41px;
      line-height: 40px;
      .url {
        @include wh(390px, 40px);
        @include sc(18px, #747474);
        text-align: left;
        padding-left: 10px;
        background: #E7E7E7;
        border-radius: 4px;
        font-weight: 400;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

      }

      .copy {
        @include wh(94px, 40px);
        @include sc(20px, $fc);
        background: #FA6400;
        border-radius: 4px;
        cursor: pointer;
      }
    }

    .ok {
      @include wh(110px, 40px);
      @include sc(20px, $fc);
      margin: auto;
      margin-top: 50px;
      line-height: 40px;
      background: #FA6400;
      border-radius: 4px;
      cursor: pointer;
    }
  }
</style>