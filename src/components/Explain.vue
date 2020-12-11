<template>
  <div class="explain">
    <div class="title">Low to play the game "You Say I Guess"</div>
    <p v-html="playDescribe" class="content"></p>
    <div class="ok pointer" @click="handleOk">OK</div>
    <div class="iconfont icon-cuowu icon-close" @click="handleOk"></div>

  </div>
</template>
<script>
  export default{
    props:["playDescribe"],
    methods:{
      handleOk(){
        this.$emit('handleOk')
      }
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
  .explain {
    position: relative;
    width: 730px;
    background: $fc;
    box-shadow: 0px 0px 8px 0px #B0B0B0;
    border-radius: 4px;
    padding: 14px 35px 62px;

    .title {
      @include sc(24px, #000);
      text-align: center;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }

    .content {
      margin-top: 43px;
    }

    .ok {
      @include wh(110px, 40px);
      @include sc(20px, $fc);
      text-align: center;
      margin: auto;
      margin-top: 50px;
      line-height: 40px;
      background: #FA6400;
      border-radius: 4px;
    }
  }
</style>