<template>
  <div class="result">

    <div class="title">Result（2/5）</div>
    <!-- <div class="title">Game Over</div> -->
    <table class="table">
      <tr class="tr">
        <th>Num</th>
        <th>Name</th>
        <th>Total</th>
        <th>Hit counts</th>
        <th>Counter hit counts</th>
      </tr>
      <tr class="tr" v-for="(index,item) in result">
        <td>{{item.positions}}</td>
        <td>{{item.nickname}}</td>
        <td>{{item.number1}}</td>
        <td>{{item.number2}}</td>
        <td>{{item.number3}}</td>
      </tr>
      <!-- <tr class="tr active">
        <td>1</td>
        <td>Name</td>
        <td>12</td>
        <td>22</td>
        <td>43</td>
      </tr> -->
    </table>
    <!-- <div class="exit">Exit</div> -->
  </div>
</template>
<script>
  export default{
    props:["result"],
  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';

  .result {
    width: 560px;
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