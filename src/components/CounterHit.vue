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
    <div class="iconfont icon-cuowu icon-close" @click="closeCounterHit"></div>

  </div>
</template>
<script>
  export default {
   
    props: ["counterHit"],
    computed:{
      rightCount(){
        return this.counterHit.filter(item => {
          return item.state == 1;
        }).length
        
      }
    },
    methods:{
      closeCounterHit(){
        this.$emit("closeCounterHit")
      }
    }
  
  }
</script>
<style lang="scss" scoped>
  @import '~assets/css/mixin.scss';
  .icon-close {
    color:#fff;
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .icon-close:hover {
    opacity: .5;
  }
  .counter {
    position: relative;
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
        line-height: 38px;
        align-items: center;
        font-family: PingFangSC-Regular, PingFang SC;

      }
    }
  }
</style>