<template>
  <div class="counter">
    <div class="title">
      <span>Counter hit counts</span>
      <span>+3</span>
    </div>
    <div class="content">
      <div>
        <span>2 Andrew lon</span>
       <span class="iconfont icon-zhengque"></span>
      </div>
      <div>
        <span>2 Andrew lon</span>
       <span class="iconfont icon-cuowu"></span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .counter {
    width: 260px;
    padding: 30px 39px;
    background: #FA6400;
    box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
    border-radius: 4px;

    .title {
      @include sc(17px, $fc);
      @include fj();
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;

    }

    .content {
      padding: 0 28px;
      >div {
        @include sc(16px, $fc);
        @include fj();
        line-height:38px;
        align-items:center;
        font-family: PingFangSC-Regular, PingFang SC;

      }
    }
  }
</style>