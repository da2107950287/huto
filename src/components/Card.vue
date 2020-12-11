<template>
  <div class="home">
    <div class="index">
      <div class="top">
        <div class="left">
          <div class="exit pointer" @click="exit">Exit</div>
          <div class="left-bottom">
            <div class="exit pointer" style="margin-left: 44px" @click="standup">Standup</div>
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
                  <div v-if="item.positions" class="player-name">
                    <div>{{item.nickname}}</div>
                    <div></div>
                  </div>
                  <div v-else class="iconfont icon-jiahaocu icon pointer" @click="handleLogin(index+1)"></div>
                  <div class="tab">{{index+1}}</div>
                </div>
                <div v-if="state==2 && !showWait" class="item-score">
                  <select v-if="describeUid == item.uid && uid!=item.uid && hasPlayer" v-model="value1">
                    <option value="">select a picture</option>
                    <option v-show="index!=0" v-for="(item1,index) in pictures" :value="item1.picId">{{index}}</option>
                  </select>
                  <div v-else-if="describeUid != item.uid && hasPlayer" class="img">
                    <div v-if="uid==item.uid && counterHit.length!=0"
                      style="display: flex;align-items: center;height: 31px;">
                      <img src="~assets/img/correct.png" alt=""
                        style="display: inline-block;width: 24px;height: 17px;"><span
                        style="display: inline;">{{rightCount.length}}</span>
                    </div>
                    <div class="img">
                      <img v-if="item.correct=='1'" src="~assets/img/correct.png" alt="">
                      <img v-else-if="item.correct=='0'" src="../assets/img/error.png" alt="">
                    </div>
                  </div>
                  <div v-else style="height: 31px;"></div>
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
            <img class="wh icon pointer" @click="showExplain=true" src="../assets/img/wh.png" alt="">
            <img class="fx icon pointer" @click="showShare=true" src="~assets/img/fx.png">
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
          <div class="items" style="position: relative;">
            <div class="item" v-for="(item,index) in pictures" :style="{backgroundImage:'url('+item.picUrl+')'}">
              <div :style="{'opacity':uid == item.uid?1:0}" class="tip">It'is your picture. Please describe it to other
                playe</div>
              <div :style="{'opacity':uid == item.uid?1:0}" class="content">{{prepareTime}}</div>
              <div :style="{'opacity':uid == item.uid?1:0}" class="dec">YOUR PICTURE</div>
              <div :style="{'opacity':uid == item.uid?0:1}" class="tab">{{index}}</div>
            </div>
          </div>
        </div>
        <div v-if="state==1" class="items">
          <div class="item" v-for="item in 8" style="background-color: #fff;">
            <div class="tab">{{item}}</div>
          </div>
        </div>
      </div>
      <div class="popup">
        <LoginForm v-if="showLogin" @handleCancel="showLogin=false" @handleSitDown="handleSitDown">
        </LoginForm>
        <Explain v-if="showExplain" :playDescribe="playDescribe" @handleOk="showExplain=false"></Explain>
        <Share v-if="showShare" @handleOk="showShare=false"></Share>
        <div v-if="isRight=='0'" class="counts">
          <div>FAILED</div>
          <div>Hit counts +0</div>
          <div class="iconfont icon-cuowu icon-close" @click="isRight=''"></div>
        </div>
        <div v-else-if="isRight=='1'" class="counts">
          <div>SUCCEED</div>
          <div>Hit counts +1</div>
          <div class="iconfont icon-cuowu icon-close" @click="isRight=''"></div>
        </div>
        <CounterHit v-if="showCounterHit" @closeCounterHit="showCounterHit=false" :counterHit="counterHit"></CounterHit>
        <Result v-if="showResult" :result="result" :uid="uid" :currentfrequency="currentfrequency" @exit="exit"
          :frequency="frequency" :abnormalExit="abnormalExit" @closeResult="showResult=false;currentfrequency++">
        </Result>
        <!-- <div v-if="show" style=" background: #FA6400;padding: 30px;font-size: 22px;color:#fff">{{msg}}</div> -->

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
  import { createUniqueId, setStore, getStore, removeStore, shuffle } from "assets/js/utils.js"
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
        entryMode: "",//进入房间的方式 1 url/2 roomID
        totalTime: '',
        query: {},
        nickname: "",
        rlNumber: '',//房间号
        levels: '',//等级
        positions: '',
        userinfoList: [],//玩家信息
        playNumber: '',//最大玩家数量
        user: [],
        pictures: [],
        mypicture: {},
        currentfrequency: 0,//当前小节
        describeUid: '',
        number: 1,
        value1: '',
        isRight: '',//是否猜中
        counterHit: [],//自己描述结束
        prepareTime: '',//准备时间
        rightCount: [],
        correct: '',
        index: '',
        abnormalExit: false,
        show: false,
        msg: "",
        socketEvents: {
          open(res) {
            if (res.code == 200) {
              this.state = res.data.state;
              this.levels = res.data.levels;
              this.rlNumber = res.data.rlNumber;
              this.playNumber = res.data.playNumber;
              this.rlId = res.data.rlId;
              var arr = res.data.userinfoList;
              //初始化位置
              for (let i = 1; i <= this.playNumber; i++) {
                this.userinfoList.push({})
              }
              this.getUser(arr);
            } else if (res.code == 500) {//游戏结束
              this.show = true;
              this.msg = res.msg;
              this.$router.push("/login")
            }
          },
          sitDown(res) {//坐下
            if (res.code == 200) {//坐下成功
              this.showLogin = false;
              for (let i = 0; i < this.playNumber; i++) {
                this.userinfoList.push({})
              }
              this.getUser(res.data)
            } else if (res.code == 500) {//坐下失败

            }
          },
          // start(res) {//开始游戏

          //   this.userinfoList.forEach((item) => {//将用户上一节的选择清除
          //     this.$delete(item, 'correct')
          //   })
          //   setStore("userinfoList", this.userinfoList)
          //   this.counterHit = [];
          //   this.showWait = true;
          //   this.state = 2;
          //   var mypicture, pictures = res.data;

          //   this.pictures = [];

          //   mypicture = pictures.splice(pictures.findIndex(item => uid == item.uid), 1)
          //   // pictures.forEach((item) => {
          //   //   if (item.uid == getStore("uid")) {
          //   //     mypicture = item;
          //   //   } else {
          //   //     this.pictures.push(item)
          //   //   }
          //   // })
          //   // this.pictures = shuffle(this.pictures);//打乱图片顺序
          //   this.pictures=[mypicture,shuffle(this.pictures)]
          //   if (JSON.stringify(mypicture) != '{}') {
          //     this.pictures.unshift(mypicture)
          //   }
          //   setStore('pictures', this.pictures)
          //   //等待30秒
          //   this.getPraperTime()
          //   setTimeout(() => {
          //     this.showWait = false;
          //     this.ws.send(JSON.stringify({
          //       "method": "beginDescribe",
          //       "data": {
          //         "rlId": this.query.roomId,//房间ID
          //         "uid": getStore("uid"),//用户uid
          //         "number": this.number//第几个开始描述
          //       }
          //     }))
          //   }, this.describeTime * 1000)
          // }

        },
        events: []
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
      hasPlayer() {
        return this.userinfoList.some((item) => {
          return item.uid == getStore("uid")
        })
      }

    },

    beforeRouteEnter(to, from, next) {
      var entryMode;
      if (from.name == 'CreateRoom' || from.name == "Login") {
        entryMode = 2;
      } else {
        entryMode = 1;
      }
      next(vm => {
        vm.getEnteryMod(entryMode)
      })
    },
    // mounted() {
    //   this.showConfig()
    //   let uid = createUniqueId();
    //   this.query = this.$route.query;
    //   let cip = returnCitySN["cip"];
    //   //建立连接
    //   setStore("uid", uid);
    //   this.ws = new WebSocket(`ws://47.111.244.224:8080/webSocket/${this.query.roomId}/${uid}/${cip}/${this.entryMode}`);
    //   this.ws.onopen = (e) => {
    //     console.log("连接成功")
    //   }
    //   this.ws.onmessage = (e) => {
    //     let res = JSON.parse(e.data);
    //     let that = this;
    //     console.log(res)
    //     switch (res.method) {
    //       case 'open':
    //         if (res.code == 200) {
    //           this.state = res.data.state;
    //           this.levels = res.data.levels;
    //           this.rlNumber = res.data.rlNumber;
    //           this.rlId=res.data.rlId;
    //           var arr = res.data.userinfoList;
    //           this.playNumber = res.data.playNumber
    //           for (let i = 0; i < this.playNumber; i++) {
    //             this.userinfoList.push({})
    //           }
    //           this.getUser(arr)
    //         } else if (res.code == 500) {
    //           this.show = true;
    //           this.msg = res.msg;
    //           this.$router.push("/login")
    //         }
    //         break;
    //       case 'sitDown':
    //         if (res.code == 200) {
    //           this.showLogin = false;
    //           this.userinfoList = []
    //           for (let i = 0; i < this.playNumber; i++) {
    //             this.userinfoList.push({})
    //           }
    //           this.getUser(res.data)
    //           // this.show = true;
    //           // this.msg = res.msg;
    //           // setTimeout(() => {
    //           //   this.show = false;
    //           //   this.msg = ''
    //           // }, 1 * 1000)
    //           // console.log("坐下成功")
    //         } else if (res.code == 500) {
    //           // this.show = true;
    //           // this.msg = res.msg;
    //           // setTimeout(() => {
    //           //   this.show = false;
    //           //   this.msg = ''
    //           // }, 1 * 1000)
    //           // console.log("坐下失败")
    //         }
    //         break;
    //       case 'standUp':
    //         if (res.code == 200) {
    //           this.userinfoList.splice(res.data - 1, 1, {})
    //           // this.userinfoList[res.data - 1] = {};
    //           console.log(this.userinfoList)
    //           setStore("userinfoList", this.userinfoList)
    //           console.log("站起成功")
    //         } else if (res.code == 500) {
    //           console.log("站起失败")
    //         }
    //         break;
    //       case 'start': {
    //         //全部坐满，游戏开始
    //         console.log("游戏开始")
    //         if (!this.showResult) {
    //           this.currentfrequency++;

    //         }
    //         this.userinfoList.forEach((item) => {
    //           this.$delete(item, 'correct')
    //         })
    //         setStore("userinfoList", this.userinfoList)
    //         this.counterHit = [];
    //         this.showWait = true;
    //         this.state = 2;
    //         var pictures = res.data;
    //         this.pictures = [];
    //         pictures.forEach((item) => {
    //           if (item.uid == getStore("uid")) {
    //             this.mypicture = item;
    //             setStore('mypicture', this.mypicture)
    //           } else {
    //             this.pictures.push(item)
    //           }
    //         })
    //         this.pictures = shuffle(this.pictures)
    //         if (JSON.stringify(this.mypicture) != '{}') {
    //           this.pictures.unshift(this.mypicture)
    //         }
    //         setStore('pictures', this.pictures)
    //         //等待30秒
    //         this.getPraperTime()
    //         setTimeout(() => {
    //           this.showWait = false;
    //           this.ws.send(JSON.stringify({
    //             "method": "beginDescribe",
    //             "data": {
    //               "rlId": this.query.roomId,//房间ID
    //               "uid": getStore("uid"),//用户uid
    //               "number": this.number//第几个开始描述
    //             }
    //           }))
    //         }, this.describeTime * 1000)
    //       }
    //         break;
    //       case 'beginDescribe':
    //         //获取第几个在描述
    //         if (res.code == 200) {
    //           if (!this.abnormalExit) {
    //             this.describeUid = res.data.uid;
    //             setStore("describeUid", res.data.uid);
    //             this.timer()
    //             setTimeout(() => {
    //               this.number++;
    //               this.ws.send(JSON.stringify({
    //                 "method": "beginDescribe",
    //                 "data": {
    //                   "rlId": this.query.roomId,//房间ID
    //                   "uid": getStore("uid"),//用户uid
    //                   "number": this.number//第几个开始描述
    //                 }
    //               }))
    //             }, this.speakTime * 1000);
    //           }
    //         } else if (res.code == 201) {//最后描述用户
    //           this.describeUid = res.data.uid;
    //           setStore("describeUid", res.data.uid);
    //           this.timer()
    //           setTimeout(() => {
    //             this.number = 1;
    //           }, this.speakTime * 1000);
    //         }
    //         break;
    //       case 'submitResults':
    //         if (res.code == 201) {
    //           this.isRight = res.data.number;
    //           this.correct = res.data.number;
    //           this.index = res.data.positions - 1;


    //         } else if (res.code == 202) {
    //           this.counterHit = res.data;
    //           this.showCounterHit = true;
    //           this.rightCount = this.counterHit.filter((item) => {
    //             return item.state == 1
    //           })
    //           console.log("自己描述结束")
    //         } else if (res.code == 203) {//小节结果
    //           this.result = res.data;
    //           this.abnormalExit = false;
    //           this.showResult = true;

    //         } else if (res.code == 204) {
    //           this.userinfoList = res.data;
    //           if (getStore("userinfoList")) {
    //             getStore("userinfoList").forEach((item) => {
    //               this.userinfoList.forEach((val) => {
    //                 if (val.uid == item.uid) {
    //                   if (item.hasOwnProperty('correct')) {
    //                     this.$set(val, 'correct', item.correct)
    //                   }
    //                 }
    //               })
    //             })
    //           }

    //           if (this.index !== "" && this.correct !== "" && this.uid != this.describeUid) {
    //             console.log("添加correct属性" + this.index + "----" + this.correct)
    //             this.$set(this.userinfoList[this.index], 'correct', this.correct)
    //             setStore('userinfoList', this.userinfoList)
    //           }
    //         }
    //         break;

    //       case 'end':
    //         if (res.code == 200) {//游戏结束
    //           this.result = res.data;
    //           this.showResult = true;
    //           if (this.currentfrequency == this.frequency) {
    //             this.abnormalExit = false;
    //           } else {
    //             this.abnormalExit = true;
    //           }
    //           console.log("游戏结束")

    //         }
    //         break;
    //       case 'deleteUser':
    //         if (res.code == 200) {
    //           if (this.userinfoList[res.data - 1].uid == getStore("uid")) {
    //             removeStore("uid");
    //           }
    //           this.userinfoList.splice(res.data - 1, 1, {})
    //           setStore("userinfoList", this.userinfoList)
    //         }
    //         break;
    //       default:
    //         break;
    //     }


    //   }
    //   console.log(this.ws.readyState)
    //   if (this.ws.readyState != this.ws.OPEN) {
    //     console.log("连接已中断!")

    //     return false;
    //   }
    //   this.ws.onerror = (e) => {
    //     console.log("连接错误")
    //     console.log(e)
    //   }
    //   this.ws.onclose = (e) => {
    //     console.log(e)
    //     console.log("连接关闭")
    //   }


    // },

    created() {
      // const events = this.socketEvents
      // if (events) {
      //   Object.keys(events).forEach(k => {
      //     this.on(k, events[k].bind(this))
      //   })
      // }

    },
    mounted() {
      this.initWebSocket();
      const events = this.socketEvents
      if (events) {
        Object.keys(events).forEach(k => {
          this.on(k, events[k].bind(this))
        })
      }

    },
    methods: {
      event(name, data) {
        let eventsArray = this.events[name]
        eventsArray && eventsArray.forEach(fn => {
          fn(data);
        })
      },
      on(name, fn) {
        if (typeof fn === 'function') {
          if (!this.events[name]) this.events[name] = []
          this.events[name].push(fn)
        }
      },
      initWebSocket() {//初始化websoket
        let uid = createUniqueId(),
          cip = returnCitySN["cip"],
          wsUrl = `ws://47.111.244.224:8080/webSocket/${this.$route.query.roomId}/${uid}/${cip}/${this.entryMode}`
        this.ws = new WebSocket(wsUrl);
        this.ws.onopen = this.websocketonopen;
        // this.ws.onerror = this.websocketonerror;
        this.ws.onmessage = e=>{
          const res = JSON.parse(e.data);
        // 接收数据
        console.log(res)
        switch (res.method) {
          case 'open':
            if (res.code == 200) {
              this.state = res.data.state;
              this.levels = res.data.levels;
              this.rlNumber = res.data.rlNumber;
              this.rlId=res.data.rlId;
              var arr = res.data.userinfoList;
              this.playNumber = res.data.playNumber
              for (let i = 0; i < this.playNumber; i++) {
                this.userinfoList.push({})
              }
              this.getUser(arr)
            } else if (res.code == 500) {
              this.show = true;
              this.msg = res.msg;
              this.$router.push("/login")
            }
            break;
          case 'sitDown':
            if (res.code == 200) {
              this.showLogin = false;
              this.userinfoList = []
              for (let i = 0; i < this.playNumber; i++) {
                this.userinfoList.push({})
              }
              this.getUser(res.data)
              console.log("坐下成功")
            } else if (res.code == 500) {
              console.log("坐下失败")
            }
            break;
          case 'standUp':
            if (res.code == 200) {
              this.userinfoList.splice(res.data - 1, 1, {})
              setStore("userinfoList", this.userinfoList)
              console.log("站起成功")
            } else if (res.code == 500) {
              console.log("站起失败")
            }
            break;
          case 'start': {
            //全部坐满，游戏开始
            console.log("游戏开始")
            if (!this.showResult) {
              this.currentfrequency++;
            }
            this.userinfoList.forEach((item) => {
              this.$delete(item, 'correct')
            })
            setStore("userinfoList", this.userinfoList)
            this.counterHit = [];
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
            if (JSON.stringify(this.mypicture) != '{}') {
              this.pictures.unshift(this.mypicture)
            }
            setStore('pictures', this.pictures)
            //等待30秒
            this.getPraperTime()
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
            }, this.describeTime * 1000)
          }
            break;
          case 'beginDescribe':
            //获取第几个在描述
            if (res.code == 200) {
              if (!this.abnormalExit) {
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
                }, this.speakTime * 1000);
              }
            } else if (res.code == 201) {//最后描述用户
              this.describeUid = res.data.uid;
              setStore("describeUid", res.data.uid);
              this.timer()
              setTimeout(() => {
                this.number = 1;
              }, this.speakTime * 1000);
            }
            break;
          case 'submitResults':
            if (res.code == 201) {
              this.isRight = res.data.number;
              this.correct = res.data.number;
              this.index = res.data.positions - 1;


            } else if (res.code == 202) {
              this.counterHit = res.data;
              this.showCounterHit = true;
              this.rightCount = this.counterHit.filter((item) => {
                return item.state == 1
              })
              console.log("自己描述结束")
            } else if (res.code == 203) {//小节结果
              this.result = res.data;
              this.abnormalExit = false;
              this.showResult = true;

            } else if (res.code == 204) {
              this.userinfoList = res.data;
              if (getStore("userinfoList")) {
                getStore("userinfoList").forEach((item) => {
                  this.userinfoList.forEach((val) => {
                    if (val.uid == item.uid) {
                      if (item.hasOwnProperty('correct')) {
                        this.$set(val, 'correct', item.correct)
                      }
                    }
                  })
                })
              }

              if (this.index !== "" && this.correct !== "" && this.uid != this.describeUid) {
                console.log("添加correct属性" + this.index + "----" + this.correct)
                this.$set(this.userinfoList[this.index], 'correct', this.correct)
                setStore('userinfoList', this.userinfoList)
              }
            }
            break;

          case 'end':
            if (res.code == 200) {//游戏结束
              this.result = res.data;
              this.showResult = true;
              if (this.currentfrequency == this.frequency) {
                this.abnormalExit = false;
              } else {
                this.abnormalExit = true;
              }
              console.log("游戏结束")

            }
            break;
          case 'deleteUser':
            if (res.code == 200) {
              if (this.userinfoList[res.data - 1].uid == getStore("uid")) {
                removeStore("uid");
              }
              this.userinfoList.splice(res.data - 1, 1, {})
              setStore("userinfoList", this.userinfoList)
            }
            break;
          default:
            break;
        }

        };
        // this.ws.onclose = this.websocketclose;
      },
      websocketonopen() {//连接成功
        console.log("WebSocket连接成功");
      },
      websocketonerror(e) { //连接失败
        console.log("WebSocket连接发生错误");
      },
      websocketonmessage(e) { //数据接收 
        const res = JSON.parse(e.data);
        // 接收数据
        console.log(res)
        switch (res.method) {
          case 'open':
            if (res.code == 200) {
              this.state = res.data.state;
              this.levels = res.data.levels;
              this.rlNumber = res.data.rlNumber;
              this.rlId=res.data.rlId;
              var arr = res.data.userinfoList;
              this.playNumber = res.data.playNumber
              for (let i = 0; i < this.playNumber; i++) {
                this.userinfoList.push({})
              }
              this.getUser(arr)
            } else if (res.code == 500) {
              this.show = true;
              this.msg = res.msg;
              this.$router.push("/login")
            }
            break;
          case 'sitDown':
            if (res.code == 200) {
              this.showLogin = false;
              this.userinfoList = []
              for (let i = 0; i < this.playNumber; i++) {
                this.userinfoList.push({})
              }
              this.getUser(res.data)
              console.log("坐下成功")
            } else if (res.code == 500) {
              console.log("坐下失败")
            }
            break;
          case 'standUp':
            if (res.code == 200) {
              this.userinfoList.splice(res.data - 1, 1, {})
              setStore("userinfoList", this.userinfoList)
              console.log("站起成功")
            } else if (res.code == 500) {
              console.log("站起失败")
            }
            break;
          case 'start': {
            //全部坐满，游戏开始
            console.log("游戏开始")
            if (!this.showResult) {
              this.currentfrequency++;
            }
            this.userinfoList.forEach((item) => {
              this.$delete(item, 'correct')
            })
            setStore("userinfoList", this.userinfoList)
            this.counterHit = [];
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
            if (JSON.stringify(this.mypicture) != '{}') {
              this.pictures.unshift(this.mypicture)
            }
            setStore('pictures', this.pictures)
            //等待30秒
            this.getPraperTime()
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
            }, this.describeTime * 1000)
          }
            break;
          case 'beginDescribe':
            //获取第几个在描述
            if (res.code == 200) {
              if (!this.abnormalExit) {
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
                }, this.speakTime * 1000);
              }
            } else if (res.code == 201) {//最后描述用户
              this.describeUid = res.data.uid;
              setStore("describeUid", res.data.uid);
              this.timer()
              setTimeout(() => {
                this.number = 1;
              }, this.speakTime * 1000);
            }
            break;
          case 'submitResults':
            if (res.code == 201) {
              this.isRight = res.data.number;
              this.correct = res.data.number;
              this.index = res.data.positions - 1;


            } else if (res.code == 202) {
              this.counterHit = res.data;
              this.showCounterHit = true;
              this.rightCount = this.counterHit.filter((item) => {
                return item.state == 1
              })
              console.log("自己描述结束")
            } else if (res.code == 203) {//小节结果
              this.result = res.data;
              this.abnormalExit = false;
              this.showResult = true;

            } else if (res.code == 204) {
              this.userinfoList = res.data;
              if (getStore("userinfoList")) {
                getStore("userinfoList").forEach((item) => {
                  this.userinfoList.forEach((val) => {
                    if (val.uid == item.uid) {
                      if (item.hasOwnProperty('correct')) {
                        this.$set(val, 'correct', item.correct)
                      }
                    }
                  })
                })
              }

              if (this.index !== "" && this.correct !== "" && this.uid != this.describeUid) {
                console.log("添加correct属性" + this.index + "----" + this.correct)
                this.$set(this.userinfoList[this.index], 'correct', this.correct)
                setStore('userinfoList', this.userinfoList)
              }
            }
            break;

          case 'end':
            if (res.code == 200) {//游戏结束
              this.result = res.data;
              this.showResult = true;
              if (this.currentfrequency == this.frequency) {
                this.abnormalExit = false;
              } else {
                this.abnormalExit = true;
              }
              console.log("游戏结束")

            }
            break;
          case 'deleteUser':
            if (res.code == 200) {
              if (this.userinfoList[res.data - 1].uid == getStore("uid")) {
                removeStore("uid");
              }
              this.userinfoList.splice(res.data - 1, 1, {})
              setStore("userinfoList", this.userinfoList)
            }
            break;
          default:
            break;
        }


        // this.event(res.method, res);
      },

      websocketsend(agentData) {//数据发送 
        this.ws.send(agentData);
      },

      websocketclose(e) { //关闭连接
        console.log("connection closed (" + e.code + ")");
      },
      getEnteryMod(entryMode) {
        this.entryMode = entryMode
      },
      exit() {
        this.showResult = false;
        removeStore('userinfoList');
        removeStore('uid')
        this.$router.push('/login')
        console.log("退出房间")
      },
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
        //显示登录框
        if (this.state != 2) {
          this.positions = index;
          this.showLogin = true
        }

      },
      //坐下
      handleSitDown(params) {
        this.ws.send(JSON.stringify({
          "method": 'sitDown',
          "data": {
            "rlId": this.rlId,//房间ID
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
      getPraperTime() {
        let time = this.describeTime;
        this.prepareTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
        let timer = window.setInterval(() => {
          time--;
          this.prepareTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
          if (this.abnormalExit) {
            window.clearInterval(timer)
            console.log("异常结束")

          }
          if (time <= 0) {
            this.prepareTime = "";
            window.clearInterval(timer)
          }
        }, 1000);

      },
      //倒计时1分钟
      timer() {
        let time = this.speakTime;
        this.totalTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
        let timer = window.setInterval(() => {
          time--;
          this.totalTime = parseInt((time / 60)).toString().padStart(2, 0) + ":" + (time % 60).toString().padStart(2, 0);
          if (this.abnormalExit) {
            window.clearInterval(timer)
            console.log("异常结束")
          }
          if (time <= 0) {
            this.totalTime = "";
            if (getStore("uid") && getStore("uid") != getStore("describeUid") && this.hasPlayer) {
              console.log("提交结果")
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
            }

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
      this.exit()
    }

  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .pointer {
    cursor: pointer;
  }

  .pointer:active {
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

      .exit:active {
        opacity: .6;
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
                width: 100%;
                text-align: center;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #000;

                div:first-child {
                  font-size: 1.26rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;

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

        .prepareTime {
          position: absolute;
          top: 12px;
          right: 12px;
        }
      }

      .items {
        @include fj();
        flex-wrap: wrap;

      }

      .item {
        @include wh(230px, 230px);
        position: relative;
        margin-bottom: 18px;
        /* background: $fc; */
        box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
        border-radius: 4px;
        background-repeat: no-repeat;
        background-size: 100% 100%;

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

        .tip {
          @include sc(12px, #000) padding: 4px 6px 2px;
          font-family: PingFangSC-Regular, PingFang SC;
          background: #CBCBCB;

        }

        .content {
          @include wh(100%, 150px);

          font-size: 32px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #000000;
          line-height: 150px;
          text-align: center;
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
    }

    .popup {
      @include center();

      .counts {
        width: 260px;
        height: 130px;
        position: relative;
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