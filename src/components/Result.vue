<template>
  <div class="result">

    <!-- <div v-if="frequency!=currentfrequency && !abnormalExit" class="title">Result（{{currentfrequency}}/{{frequency}}）</div>
    <div v-else class="title">Game Over</div> -->
    <div class="title">Game Over</div>
    <table class="table">
      <tr class="tr">
        <th>Num</th>
        <th>Name</th>
        <th>Total</th>
        <th>Hit counts</th>
        <th>Counter hit counts</th>
      </tr>
      <tr class="tr" v-for="(item) in result" :class="{'active':item.uid==uid?true:false}">
        <td>{{item.positions}}</td>
        <td>{{item.nickname}}</td>
        <td>{{item.number1}}</td>
        <td>{{item.number2}}</td>
        <td>{{item.number3}}</td>
      </tr>
    </table>
    <div class="exit pointer" @click="exit">Exit</div>
    <!-- <div v-if="frequency==currentfrequency || abnormalExit" class="exit pointer" @click="exit">Exit</div>
    <div v-if="frequency==currentfrequency || abnormalExit" class="iconfont icon-cuowu icon-close" @click="exit"></div>
    <div v-if="frequency!=currentfrequency && !abnormalExit" class="iconfont icon-cuowu icon-close" @click="closeResult"></div> -->
    
  </div>
</template>
<script>
  export default{
    props:["result","frequency","currentfrequency","uid","abnormalExit"],
    methods:{
      exit(){
        this.$emit('exit')
      },
      closeResult(){
        this.$emit("closeResult")
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
    color: #fff;
    position: absolute;
    top: 20px;
    right: 20px;
  }

  .icon-close:hover {
    opacity: .5;
  }
  .result {
    width: 560px;
    position: relative;
    text-align: center;
    padding: 32px 37px 13px;
    background: #FA6400;
    box-shadow: 0px 0px 8px 0px rgba(176, 176, 176, 0.3);
    border-radius: 4px;

    .title {
      @include sc(24px, $fc);
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
    }

    .table {

      width: 100%;

      .tr {

        margin-bottom: 7px;

        th {
          line-height: 49px;
        }



        td {
          @include sc(18px, #cfcfcf);
          line-height: 42px;
          font-family: PingFangSC-Regular, PingFang SC;
        }

        th,
        &.active td {
          @include sc(18px, $fc);
          font-weight: 500;
          font-family: PingFangSC-Medium, PingFang SC;
        }
      }
    }

    .exit {
      @include sc(24px, $fc);
      margin-top: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;

    }
  }
</style>