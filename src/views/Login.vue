<template>
  <div class="login">
    <img src="~assets/img/logo.png" alt="">
    <div class="login-form">
      <div class="logo">You Say I Guess</div>
      <div v-if="isShow==1">
        <div class="input-box">
          <input type="text" v-model="rNum" placeholder="Room ID" class="input">
          <div class="enter common" @click="enterRoom">Enter</div>
        </div>
        <router-link tag="div" class="new-room common" :to="{path:'/createRoom'}">Create a new room
        </router-link>
      </div>
      <div class="error" v-else-if="isShow==2">
        <div class="title">Error</div>
        <div class="dec" style="margin-bottom: 50px;">{{message}}</div>
        <div class="ok" @click="isShow=1">OK</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        isShow: 1,
        rNum: '',//房间号
        roomId: '',//房间ID
        message: '',//错误提示消息
        level:'',//游戏等级
      }
    },
    mounted() {
      console.log(process.env)
    },
    methods: {


      enterRoom() {
        if (this.rNum!="") {
          this.$http('/showRoomList', {
            rlNumber: this.rNum
          }).then(res => {
            if (res.code == 200) {
              this.roomId = res.data.rlId;
              this.rNum=res.data.rlNumber;
              this.level=res.data.levels;
              console.log(999)
              this.$router.push({ path: '/index', query: { roomId: this.roomId,rNum: this.rNum,level:this.level} })
            } else if (res.code == 500) {
              this.message = res.msg;
              this.isShow = 2;
            }

          })
        }

      },

    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .login {
    @include fj(flex-start);
    @include center();
    box-shadow: 0 0 5px #333333;

    .login-form {
      @include fj(flex-start);
      flex-direction: column;
      align-items: center;
      width: 516px;
      background-color: #fff;



      .logo {
        margin-top: 100px;
        font-size: 54px;
        font-family: HanziPenSC-W5, HanziPenSC;
        font-weight: normal;
        color: #3C3D3C;
      }

      .common {
        @include sc(24px, $fc);
        text-align: center;
        line-height: 50px;
        background: #FA6400;
        border-radius: 4px;
        font-family: PingFangSC-Regular, PingFang SC;
      }
      .common:active{
        opacity: .6;
      }

      .input-box {
        @include fj();
        @include wh(380px, 50px);
        margin-top: 173px;

        .input {
          @include wh(260px, 50px);
          @include sc(24px, #97999A) text-indent: 1rem;
          outline: none;
          background: $fc;
          border-radius: 4px;
          border: 2px solid #FA6400;

          font-family: PingFangSC-Regular, PingFang SC;

        }

        .enter {
          @include wh(100px, 50px);
          cursor: pointer;

        }
      }

      .new-room {
        @include wh(380px, 50px);
        margin-top: 40px;
        cursor: pointer;
      }
    }

    .create-room-box {
      @include wh(380px, 300px);
      padding: 31px 69px;
      margin-top: 97px;

      box-shadow: 0px 0px 8px 0px #b0b0b0;
      border-radius: 4px;

      .box {
        div {

          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;

        }

        select {
          @include wh(240px, 26px);

          outline: none;
          margin-top: 20px;
          border-radius: 4px;
          border: 2px solid #FA6400;
        }
      }

      .level-box {
        margin-top: 32px;
      }

      .btns {
        @include fj();
        margin-top: 50px;

        .btn {
          @include wh(100px, 30px);
          text-align: center;
          line-height: 30px;
          color: $fc;
          border-radius: 4px;
          cursor: pointer;
        }

        .cancel {

          background: #BBBBBB;
        }

        .ok {

          background: #FA6400;
        }
      }
    }

    .error {
      @include wh(380px, 210px);
      @include fj();
      flex-direction: column;
      align-items: center;
      margin-top: 137px;
      padding: 20px 48px 24px;
      box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
      border-radius: 4px;

      .title {

        font-size: 28px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 40px;
      }

      .dec {
        text-align: center;
        margin-top: 24px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #000000;
        line-height: 22px;
      }

      .ok {
        @include wh(150px, 30px);

        text-align: center;
        line-height: 30px;
        color: $fc;
        background: #FA6400;
        border-radius: 4px;

      }
    }
  }
</style>