<template>
  <div class="card">
    <div class="tip">It'is your picture. Please describe it to other playe</div>
    <div class="content">
      <!-- <div class="right-num">
        <img src="../assets/img/correct.png" alt="">
        <span>3</span>
      </div>
      <div class="item" v-for="item in [1,2,3,4,5]">
        <span>2 Andrew lon</span>
        <img src="../assets/img/yes.png" alt="">
        <img src="../assets/img/no.png" alt="">
      </div> -->

    </div>
    <div class="dec">YOUR PICTURE</div>
  </div>
</template>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .card {
    @include wh(230px, 230px);
    position: relative;
    margin-bottom: 18px;

    /* background: #CBCBCB; */
    box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
    border-radius: 4px;

    .tip {
      @include sc(12px, #000) padding: 4px 6px 2px;
      font-family: PingFangSC-Regular, PingFang SC;
      background: #CBCBCB;

    }

    .content {
      @include wh(100%, 150px);
      /* background: $fc; */
      text-align: center;
      padding: 0 63px 9px;

      .right-num {
        span {
          @include sc(25px, #FA6400);
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          margin-left: 5px;
        }
      }

      .item {
        @include sc(12px, #828282);
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 22px;

        img {
          margin-left: 5px;
        }
      }


    }

    .dec {
      @include sc(16px, #FF8B00);
      display: block;
      width: 100%;
      background: #CBCBCB;
     
      height: 44px;
       text-align: center;
      line-height: 40px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;

    }
  }
</style>