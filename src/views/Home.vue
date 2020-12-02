<template>
  <div class="login">
    <img src="~assets/img/logo.png" alt="">
    <div class="login-form">
      <div class="logo">You Say I Guess</div>
      <div v-if="isShow==1">
        <div class="input-box">
          <input type="text" v-model="roomId" placeholder="Room ID" class="input">
          <div class="enter common" @click="enterRoom">Enter</div>
        </div>
        <div class="new-room common" @click="isShow=2">Create a new room</div>
      </div>
      <div class="create-room-box" v-else-if="isShow==2">
        <div class="box">
          <div>Select the number of the player</div>
          <select v-model="num">
            <option v-for="item in [1,2,3,4,5,6]" :value="item">{{item}}</option>
          </select>
        </div>
        <div class="box level-box">
          <div>Choose the level of the game</div>
          <select v-model="level">
            <option v-for="item in ['easy','medium','hard']" :value="item">{{item}}</option>
          </select>
        </div>
        <div class="btns">
          <div class="btn cancel" @click="isShow=1">Cancel</div>
          <div class="btn ok" >OK</div>
        </div>
      </div>
      <div class="error" v-else-if="isShow==3">
        <div class="title">Error</div>
        <div v-if="isOver" class="dec"  style="margin-bottom: 50px;">The room ID is error. Please check it.</div>
        <div  v-else  class="dec" style="margin-bottom: 28px;">The game has been over, You can create a new game room</div>
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
        num: null,
        level: null,
        roomId:null,
        isOver:null,
      }
    },
    methods: {
      enterRoom(){
        if(this.roomId==1 ){
          
          this.$router.push('/about')
          
        }else if(this.roomId==2){
          this.isShow=3;
          this.isOver=true
        }else{
          this.isShow=3;
          this.isOver=false
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

      .input-box {
        @include fj();
        @include wh(380px, 50px);
        margin-top: 173px;

        .input {
          @include wh(260px, 46px);
          @include sc(24px, #97999A)
          text-indent: 1rem;
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