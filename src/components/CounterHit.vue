<template>
  <div class="counter">
    <div class="title">
      <span>Counter hit counts</span>
      <span>+{{rightCount}}</span>
    </div>
    <div class="content">
      <div v-for="(item,index) in counterHit">
        <span>{{item.positions}} {{item.name}}</span>
       <span v-if="item.state==1" class="iconfont icon-zhengque"></span>
       <span v-else class="iconfont icon-cuowu"></span>

      </div>
      <!-- <div>
        <span>2 Andrew lon</span>
      </div> -->
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
rightCount:''
      }
    },
    props:["counterHit"],
    watch:{
      counterHit(){
      let arr=  this.counterHit.filter(item=>{
          return item.state==1;
        })
        this.rightCount=arr.length;
      }
      
    }
  }
</script>
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