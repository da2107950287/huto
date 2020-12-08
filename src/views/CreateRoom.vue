<template>
  <div class="login">
    <img src="~assets/img/logo.png" alt="">
    <div class="login-form">
      <div class="logo">You Say I Guess</div>
      <div v-if="isShow==1" class="create-room-box">
        <div class="box">
          <div>Select the number of the player</div>
          <select v-model="number">
            <option v-for="item in [2,3,4,5,6]" :value="item">{{item}}</option>
          </select>
        </div>
        <div class="box level-box">
          <div>Choose the level of the game</div>
          <select v-model="level">
            <option v-for="item in ['Easy','Medium','Hard']" :value="item">{{item}}</option>
          </select>
        </div>
        <div class="btns">
          <router-link tag="div" class="btn cancel" to="/login">Cancel</router-link>
          <div class="btn ok" @click="createRoom">OK</div>
        </div>
      </div>
      <div v-else-if="isShow==2" class="error">
        <div class="title">Error</div>
        <div class="dec" style="margin-bottom: 20px;">{{message}}</div>
        <div class="ok" @click="isShow=1">OK</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        number: '',
        level: '',
        rNum: '',
        isShow: 1,
        message: ""
      }
    },
    mounted() {
      this.showConfig();
      this.rNum = this.$route.query.rNum;
    },
    methods: {
      showConfig() {
        this.$http('/showConfig').then(res => {
          if (res.code == 200) {
            this.number = res.data.defaultPlayerNumber;
            this.level = res.data.defaultLevel;
          }
        })
      },
      createRoom() {
        this.$http('insertRoomList', {
          rlNumber: this.rNum,
          levels: this.level,
          playNumber: this.number,
        }).then(res => {
          if (res.code == 200) {
            this.$router.push({path:'/index',query: { roomId: res.data.rlId,rNum: this.rNum,level:this.level} })
          } else if (res.code == 500) {

            this.isShow = 2;
            this.message = res.msg;
          }
        })

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