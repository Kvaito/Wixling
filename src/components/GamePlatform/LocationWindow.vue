<template>
<div id="locationWindow">
  <div class="person1" id='WixTamer' v-on:click='getWix'>
  </div>
    <div class="person3" id="BattleTrainer" v-on:click="battleTrain">
  </div>
  <div class="person2" id='ImplantTrader' v-on:click='tradeImplants'>
  </div>
  <ImplantTrading @closeWindow="ImplantTraderWindowOn=!ImplantTraderWindowOn" v-if="ImplantTraderWindowOn" v-bind:db="db"></ImplantTrading>
  <WixTrading @closeWindow="WixTraderWindowOn=!WixTraderWindowOn" v-if="WixTraderWindowOn" v-bind:db="db"></WixTrading>
  <BattleTrainer @closeWindow="BattleTrainerWindowOn=!BattleTrainerWindowOn" v-if="BattleTrainerWindowOn"
  @battleStarted="startBattle" v-bind:db="db"></BattleTrainer>
</div>
</template>

<script>
import ImplantTrading from "@/components/InteractWindow/NPCwindows/ImplantTrading";
import WixTrading from "@/components/InteractWindow/NPCwindows/WixTrading";
import BattleTrainer from "@/components/InteractWindow/NPCwindows/BattleTrainer";
export default {
  components:{
    BattleTrainer,
    ImplantTrading,WixTrading
  },
  props:['db'],
name: "LocationWindow",
  data(){
  return{
    ImplantTraderWindowOn:false,
    WixTraderWindowOn:false,
    BattleTrainerWindowOn:false,
  }
  },
  methods:
      {
        startBattle(){
          this.$emit('battleStarted')
        },
        tradeImplants(){
          this.ImplantTraderWindowOn=!this.ImplantTraderWindowOn;
          this.WixTraderWindowOn=false;
          this.BattleTrainerWindowOn=false;
        },
        getWix(){
          this.WixTraderWindowOn=!this.WixTraderWindowOn;
          this.BattleTrainerWindowOn=false;
          this.ImplantTraderWindowOn=false;
        },
        battleTrain(){
          this.BattleTrainerWindowOn=!this.BattleTrainerWindowOn;
          this.ImplantTraderWindowOn=false;
          this.WixTraderWindowOn=false;
        }
      },
  mounted() {

  }
}
</script>

<style scoped>
html{
  background-image: url("../../../public/assets/LocationBack/SewerVault.jpg");
}
.person1{
  margin-left: 10%;
  margin-top: 10%;
  position: absolute;
  width: 200px;
  height: 300px;
  background-image: url("../../../public/assets/Characters/Tamer.png");
}
.person2{
  margin-left: 30%;
  margin-top: 10%;
  position: absolute;
  width: 200px;
  height: 300px;
  background-image: url("../../../public/assets/Characters/ImplantTrader.png");
  background-size: 100%;
}
.person3{
  margin-left: 50%;
  margin-top: 10%;
  position: absolute;
  width: 200px;
  height: 300px;
  background-image: url("../../../public/assets/Characters/BattleTrainer.png");
}
#locationWindow>div:hover{
  cursor: pointer;
}

  .window
  {
    border-radius: 5px;
    outline: 3px solid #2c3e50;
  }
</style>