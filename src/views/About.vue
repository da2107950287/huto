<template>
<div class="home">
  <div class="index">
    <div class="top">
      <div class="left">
        <div class="exit">Exit</div>
        <div class="left-bottom">
          <div class="exit" style="margin-right: 30px">Standup</div>
          <div class="title">
            <div>Total</div>
            <div>Make it clear to others</div>
            <div>Understand what others sa</div>
          </div>

        </div>

      </div>
      <div class="center">
        <div>
          <div class="location">
            <div v-for="(item,index) in [1,2,3,4,5,6]">
              <div class="countdown">01:00</div>
              <div class="item" @click="showLogin=true">
                <div class="iconfont icon-jiahaocu icon"></div>
                <div class="tab">{{index+1}}</div>
              </div>
              <div class="item-score">

                <div class="img">
                  <!-- <img src="~assets/img/correct.png" alt=""> -->
                  <img src="~assets/img/error.png" alt="">
                </div>
                <div class="total">35</div>
                <div>12</div>
                <div>23</div>
              </div>
            </div>
          </div>
          <!-- <div class="wait">Wait for the players to sit down and start the game....</div> -->
          <!-- <div class="wait">You have 30 seconds to think about how to describe your picture</div> -->

        </div>

      </div>
      <div class="right">
        <div class="icons">
          <img class="wh icon" @click="showExplain=true" src="../assets/img/wh.png" alt="">
          <img class="fx icon" @click="showShare=true" src="~assets/img/fx.png">
        </div>
        <div class="box">
          <div class="room-id">Room ID：9879</div>
          <div class="level common">Level：Hard</div>
          <div class="num common">2/5</div>
          <div class="countdown">02:00</div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <!-- <Card v-for="item in 8"></Card> -->
      <div class="item">
        <div class="tab">1</div>
      </div>
    </div>
    <div class="popup">
      <LoginForm v-if="showLogin" @handleCancel="showLogin=false"></LoginForm>
      <Explain v-if="showExplain" @handleOk="showExplain=false"></Explain>
      <Share v-if="showShare" @handleOk="showShare=false"></Share>
    </div>

  </div>
</div>
</template>
<script>
  import Result from "components/Result.vue";
  import Share from "components/Share.vue";
  import LoginForm from "components/LoginForm.vue"
  import CounterHit from "components/CounterHit.vue";
  import Explain from "components/Explain.vue";
  import Card from "components/Card.vue"
  export default {
    data() {
      return {
        isShowShare: false,
        showLogin: false,
        showExplain:false,
        showShare:false,
      }
    },
    methods: {
      handleShare() {
        this.isShowShare = true;
      },
      
    },
    components: {
      Result,
      Share,
      LoginForm,
      CounterHit,
      Explain,
      Card
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';
.home{
  @include wh(100%,100%);
  background: #F4EDE4;
}
  .index {
    width: 1366px;
    height: 100%;
    margin: 0 auto;
    padding: 20px 60px 0;


    .top {
      @include fj();


      .exit {
        @include wh(127px, 50px);
        @include sc(24px, #000);
        text-align: center;
        line-height: 50px;
        font-family: PingFangSC-Regular, PingFang SC;
        background: $fc;
        box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
        border-radius: 4px;
      }

      .left-bottom {
        @include wh(227px, 155px);
        @include fj();
        margin-top: 13px;
        flex-direction: column;
        align-items: flex-end;

        .title {
          >div {
            @include sc(16px, #353535);
            margin-top: 4px;
            text-align: right;

            font-family: PingFangSC-Regular, PingFang SC;


          }
        }
      }

      .center {
        .location {
          @include fj();
.countdown{
  @include sc(16px,#000);
  width: 98px;
  text-align: center;
font-family: PingFangSC-Medium, PingFang SC;
font-weight: 500;

line-height: 22px;
}
          .item {
            @include wh(98px, 70px);
            margin-right: 18px;
            position: relative;
            background: $fc;
            box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
            border-radius: 4px;

            .icon {
              @include sc(31px, #e3e3e3);
              @include center();
            }

            .tab {
              @include wh(18px, 18px);
              @include sc(16px, $fc);
              position: absolute;
              bottom: 4px;
              right: 4px;
              text-align: center;
              line-height: 18px;
              border-radius: 50%;
              background: #CBCBCB;
              font-family: PingFangSC-Regular, PingFang SC;

            }
          }

          .item-score {
            @include fj();
            margin-top: 15px;
            flex-direction: column;
            align-items: center;

            .img {
              @include wh(31px, 31px);
           
              text-align: center;
            }

            div {
              @include sc(18px, #353535);
              font-family: PingFangSC-Regular, PingFang SC;
              line-height: 25px;

            }

            .total {
              @include sc(22px, #000);
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              line-height: 30px;

            }

          }
        }

        .wait {
          @include wh(678px, 66px);
          @include sc(20px, #000) margin-top: 52px;
          text-align: center;
          line-height: 66px;

          background: $fc;
          box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
          border-radius: 4px;

          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;

        }



      }

      .right {
        text-align: right;

        .icons {

          .icon {
            @include wh(40px, 40px);
          }

          .fx {
            margin-left: 35px;
          }
        }

        .box {
          margin-right: 70px;
          text-align: center;
          font-family: PingFangSC-Regular, PingFang SC;

          .room-id {
            @include sc(20px, #5A646E);
            margin-top: 10px;


          }

          .common {
            @includec sc(20px, #000);
            margin-top: 4px;



          }

          .countdown {
            @include sc(36px, #000);

            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;

          }
        }
      }

    }

    .bottom {
      @include fj();
      flex-wrap: wrap;
      width: 974px;
      margin: 12px auto;

      .item {
        @include wh(230px, 230px);
        position: relative;

        background: $fc;
        box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
        border-radius: 4px;

        .tab {
          @include wh(30px, 30px);
          @include sc(20px, $fc);
          position: absolute;
          top: 12px;
          right: 12px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #CBCBCB;

          font-family: PingFangSC-Regular, PingFang SC;

        }
      }
    }

    .popup {
      @include center();
    }
  }
</style>