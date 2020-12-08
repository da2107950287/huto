<template>
  <div class="home">
    <div class="index">
      <div class="top">
        <div class="left">
          <div class="exit">Exit</div>
          <div class="left-bottom">
            <div class="exit" style="margin-left: 44px" @click="standup">Standup</div>
            <div class="title">
              <div>Total</div>
              <div>hit counts</div>
              <div>counter hit counts</div>
            </div>
          </div>
        </div>
        <div class="center">
          <div>
            <div class="location">
              <div class="item" v-for="(item,index) in userinfoList">
                <div :style="{'opacity':describeUid == item.uid?1:0}" class="countdown">{{totalTime}}</div>

                <div class="item-tab">
                  <div v-if="!item.positions" class="iconfont icon-jiahaocu icon" @click="handleLogin(index+1)"></div>
                  <div v-else class="player-name">
                    <div>{{item.nickname}}</div>
                    <div>Cortez</div>
                  </div>
                  <div class="tab">{{index+1}}</div>
                </div>
                <div v-if="state==2 && !showWait" class="item-score">

                  <select v-if="uid!=item.uid && describeUid == item.uid " v-model="value1">
                    <option v-for="(item1,index) in pictures" :value="item1.picId">{{index+1}}
                    </option>
                  </select>
                  <!-- <div v-if="uid==item.uid" class="img">
                    <img v-if="isRight=='1'" src="~assets/img/correct.png" alt="">
                    <img v-else-if="isRight=='0'" src="~assets/img/error.png" alt="">
                  </div> -->
                  <div class="total">{{item.number1}}</div>
                  <div>{{item.number2}}</div>
                  <div>{{item.number3}}</div>
                </div>
              </div>
            </div>
            <div v-if="state==1" class="wait">Wait for the players to sit down and start the game....</div>
            <div v-if="showWait" class="wait">You have {{describeTime}} seconds to think about how to describe your
              picture</div>
          </div>
        </div>
        <div class="right">
          <div class="icons">
            <img class="wh icon" @click="showExplain=true" src="../assets/img/wh.png" alt="">
            <img class="fx icon" @click="showShare=true" src="~assets/img/fx.png">
          </div>
          <div class="box">
            <div class="room-id">Room ID：{{rlNumber}}</div>
            <div class="level common">Level：{{levels}}</div>
            <div class="num common">{{currentfrequency}}/{{frequency}}</div>
            <!-- <div class="countdown">02:00</div> -->
          </div>
        </div>
      </div>
      <div class="bottom">
        <div v-if="state==2" class="pictures">
          <!-- {{pictures}}
          {{mypicture}} -->
          <!-- <Card :style="{backgroundImage:'url('+mypicture.picUrl+')'}">
            <div></div>
          </Card> -->
          <Card v-for="item in pictures" class="pictures" :style="{backgroundImage:'url('+item.picUrl+')'}">
            <div class="tab">{{item}}</div>
            <div>{{prepareTime}}</div>
          </Card>
        </div>
        <div v-if="state==1" class="items">
          <div class="item" v-for="item in 8">
            <div class="tab">{{item}}</div>
          </div>
        </div>
      </div>
      <div class="popup">
        <LoginForm v-if="showLogin" @handleCancel="showLogin=false" @sitDown="sitDown">
        </LoginForm>
        <Explain :playDescribe="playDescribe" v-if="showExplain" @handleOk="showExplain=false"></Explain>
        <Share v-if="showShare" @handleOk="showShare=false"></Share>
        <Result v-if="showResult" :result="result"></Result>
        <CounterHit v-if="showCounterHit" :counterHit="counterHit"></CounterHit>

        <div v-if="isRight=='0'" class="counts">
          <div>FAILED</div>
          <div>Hit counts +0</div>
        </div>
        <div v-else-if="isRight=='1'" class="counts">
          <div>SUCCEED</div>
          <div>Hit counts +1</div>
        </div>
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
  import { createUniqueId, setStore, getStore, shuffle } from "assets/js/utils.js"
  import WebSocketClient from "assets/js/WebSocketClient.js"

  export default {
    data() {
      return {
        showLogin: false,//是否显示登录弹窗
        showExplain: false,//是否显示游戏说明
        showShare: false,//是否显示分享游戏链接
        state: 0,//游戏状态 1未开始 2 进行中 3 已结束
        showResult: false,//是否显示游戏结束
        showCounterHit: false,//是否显示小节信息
        showWait: false,//是否显示等待30s
        frequency: '',//每局次数
        playDescribe: '',//玩法说明
        describeTime: '',//描述准备时间
        speakTime: '',//发言时间
        totalTime: '',
        webSocket: null,
        query: {},
        ws: {},
        nickname: "",
        socketEvents: {

        },
        rlNumber: '',
        levels: '',
        positions: '',
        userinfoList: [],//坐下玩家信息
        playNumber: '',//最大玩家数量
        user: [],
        pictures: [],
        mypicture: {},
        currentfrequency: 1,
        describeUid: '',
        number: 1,
        value1: '',
        isRight: '',//是否猜中
        counterHit: [],//自己描述结束
        prepareTime: '',//准备时间
      }
    },
    watch: {
      position() {
        this.position = this.position;
      },
      describeUid() {
        this.describeUid = getStore('describeUid')

      }
    },
    computed: {
      uid() {
        return getStore("uid")
      },

    },
    beforeRouteEnter(to, from, next) {

      next()
    },
    created() {
      this.showConfig()
      if (getStore("pictures")) {
        this.pictures = getStore("pictures")
      }
      let uid = createUniqueId();
      this.query = this.$route.query;
      // let cip = returnCitySN["cip"];
      //建立连接
      let cip = this.query.cip;
      let entryMode = 1;
      setStore("uid", uid);
      this.ws = new WebSocket(`ws://47.111.244.224:8080/webSocket/${this.query.roomId}/${uid}/${cip}/${entryMode}`);
      // this.ws = new WebSocket(`ws://47.111.244.224:8080/webSocket/${this.query.roomId}/${uid}/125.71.76.175/${entryMode}`);

      this.ws.onopen = (e) => {
        console.log("连接成功")
      }
      this.ws.onmessage = (e) => {
        let res = JSON.parse(e.data);
        let that = this;
        console.log(res)
        switch (res.method) {
          case 'open':
            if (res.code == 200) {
              this.state = res.data.state;
              this.levels = res.data.levels;
              this.rlNumber = res.data.rlNumber;
              var arr = res.data.userinfoList;
              this.playNumber = res.data.playNumber
              for (let i = 0; i < this.playNumber; i++) {
                this.userinfoList.push({})
              }
              this.getUser(arr)
            }
            break;
          case 'sitDown':
            if (res.code == 200) {
              this.showLogin = false;
              this.getUser(res.data)

            } else {

            }

            break;
          case 'standUp':
            if (res.code == 200) {
              this.userinfoList.splice(res.data - 1, 1, {})
            }
            break;
          case 'start': {
            //全部坐满，游戏开始
            console.log("游戏开始")
            this.showWait = true;
            this.state = 2;
            var pictures = res.data;
            this.pictures = [];
            pictures.forEach((item) => {
              if (item.uid == getStore("uid")) {
                this.mypicture = item;
                setStore('mypicture', this.mypicture)
              } else {
                this.pictures.push(item)
              }
            })
            this.pictures = shuffle(this.pictures)
            if (this.mypicture) {
              this.pictures.unshift(this.mypicture)
            }
            setStore('pictures', this.pictures)
            //等待30秒
            setTimeout(() => {
              this.showWait = false;
              this.ws.send(JSON.stringify({
                "method": "beginDescribe",
                "data": {
                  "rlId": this.query.roomId,//房间ID
                  "uid": getStore("uid"),//用户uid
                  "number": this.number//第几个开始描述
                }
              }))
            }, 30 * 1000)
          }
            break;
          case 'beginDescribe':
            //获取第几个在描述
            if (res.code == 200) {
              this.describeUid = res.data.uid;
              setStore("describeUid", res.data.uid);
              this.timer()
              setTimeout(() => {
                this.number++;
                this.ws.send(JSON.stringify({
                  "method": "beginDescribe",
                  "data": {
                    "rlId": this.query.roomId,//房间ID
                    "uid": getStore("uid"),//用户uid
                    "number": this.number//第几个开始描述
                  }
                }))
              }, 60 * 1000);

            } else if (res.code == 201) {//最后描述用户
              console.log("最后描述用户")
              this.describeUid = res.data.uid;
              setStore("describeUid", res.data.uid);

              this.timer()
              setTimeout(() => {
                this.currentfrequency++
                // this.ws.send(JSON.stringify({
                //   "method": "beginDescribe",
                //   "data": {
                //     "rlId": this.query.roomId,//房间ID
                //     "uid": getStore("uid"),//用户uid
                //     "number": this.number++//第几个开始描述
                //   }
                // }))
                this.number = 1;
              }, 60 * 1000);
            }

            break;
          case 'submitResults':
            if (res.code == 201) {
              this.isRight = res.data.number;
              console.log(this.isRight)
              setTimeout(() => {
                this.isRight = ''
              }, 3 * 1000)

            } else if (res.code == 202) {
              this.counterHit = res.data;
              this.showCounterHit = true;
              setTimeout(() => {
                this.showCounterHit = false;
              }, 3 * 1000)
              console.log("自己描述结束")
            } else if (res.code == 203) {//小节结果
              this.result = res.data
              this.showResult = true;
              setTimeout(() => {
                this.showResult = false;
              }, 3 * 1000)
              console.log("小节结果")
            } else if (res.code == 204) {
              this.userinfoList = res.data;
              console.log("更新用户竞猜记录")
            }
            break;

          case 'end':
            if (res.code == 200) {//游戏结束
              this.result = res.data;
              console.log("游戏结束")
              // this.showResult = true;
              // setTimeout(() => {
              //   this.showResult = false
              // }, 3 * 1000);
            }
            break;
          default:
            break;
        }


      }
      console.log(this.ws.readyState)
      if (this.ws.readyState != this.ws.OPEN) {
        console.log("连接已中断!")

        return false;
      }
      this.ws.onerror = (e) => {
        console.log("连接错误")
        console.log(e)
      }
      this.ws.onclose = (e) => {
        console.log(e)
        console.log("连接关闭")
      }


    },
    mounted() {
      this.showConfig()

    },
    methods: {

      getUser(arr) {
        for (let i = 1; i <= this.playNumber; i++) {
          arr.forEach(item => {
            if (i == item.positions) {
              this.userinfoList.splice(i - 1, 1, item)
            }
          })
        }
      },
      standup() {
        this.ws.send(JSON.stringify({
          "method": "standUp",
          "data": {
            "rlId": this.query.roomId,//房间ID
            "uid": getStore("uid"),//用户uid
            "positions": this.positions//位置
          }
        }))
      },
      handleLogin(index) {
        this.positions = index;
        this.showLogin = true
      },
      //坐下
      sitDown(params) {
        this.ws.send(JSON.stringify({
          "method": 'sitDown',
          "data": {
            "rlId": this.query.roomId,//房间ID
            "uid": getStore("uid"),//用户uid
            "positions": this.positions,//位置
            "nickname": params.name,//名称
            "mailbox": params.emial,//邮箱
          }
        })
        )
      },
      showConfig() {
        this.$http('/showConfig').then(res => {
          if (res.code == 200) {
            this.frequency = res.data.frequency;
            this.playDescribe = res.data.playDescribe;
            this.describeTime = res.data.describeTime;
            this.speakTime = res.data.speakTime;
          }
        })
      },
      // getPraperTime() {
      //   let time = this.describeTime;
      //   this.prepareTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
      //   let timer = window.setInterval(() => {
      //     time--;
      //     this.prepareTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
      //     if (time <= 0) {
      //       window.clearInterval(timer)
      //     }
      //   }, 1000);

      // },
      //倒计时1分钟
      timer() {
        console.log("倒计时1分钟")
        let time = this.speakTime;
        this.totalTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
        let timer = window.setInterval(() => {
          time--;
          this.totalTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
          if (time <= 0) {
            this.totalTime = "";
            this.ws.send(JSON.stringify({
              "method": "submitResults",
              "data": {
                "rlId": this.query.roomId,//房间ID
                "uid": getStore("uid"),//用户uid
                "frequency": this.currentfrequency,//当前小节
                "results": this.value1,//图片id
                "describeUid": getStore("describeUid")//描述人uid
              }
            }))
            this.value1 = ""
            window.clearInterval(timer)
          }
        }, 1000);
      }
    },
    components: {
      Result,
      Share,
      LoginForm,
      CounterHit,
      Explain,
      Card
    },
    beforeDestory() {
      // const events = this.socketEvents
      // if (events) {
      //   Object.keys(events).forEach(k => {
      //     this.webSocket.off(k, events[k].bind(this))
      //   })
      // }
    }

  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .home {
    @include wh(100%, 100%);
    background: #F4EDE4;
    overflow-y: scroll;
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
        position: relative;
        margin-top: 13px;


        .title {
          position: absolute;
          bottom: 0;

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
          @include fj(flex-start);
          width: 678px;


          .item {
            .countdown {
              @include sc(16px, #000);
              display: hidden;

              text-align: center;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;

              line-height: 22px;
            }

            width: 98px;
            margin-right: 18px;

            .item-tab {
              @include wh(100%, 70px);

              position: relative;
              background: $fc;
              box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
              border-radius: 4px;

              .icon {
                @include sc(31px, #e3e3e3);
                @include center();
              }

              .player-name {
                @include center();
                text-align: center;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #000;

                div:first-child {
                  font-size: 1.26rem;

                }

                div:last-child {
                  font-size: .72rem;

                }


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

              select {
                width: 98px;
                height: 30px;
                background: #FA6400;
                border-radius: 4px;
                outline: none;

                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 17px;
              }

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
        }

        .wait {
          @include wh(678px, 66px);
          @include sc(20px, #000);
          margin-top: 52px;
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

      .pictures {
        @include fj();
        flex-wrap: wrap;
      }

      .items {
        @include fj();
        flex-wrap: wrap;

      }

      .item {
        @include wh(230px, 230px);
        position: relative;
        margin-bottom: 18px;
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

      .counts {
        width: 260px;
        height: 130px;
        padding: 30px 0;
        text-align: center;
        background: #FA6400;
        box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
        border-radius: 4px;

        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;

        div:first-child {
          font-size: 24px;

        }

      }
    }
  }
</style>