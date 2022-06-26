<template>
<div id="mainblock">
  <div v-if="battleOn" id="battle" >
    <BattleWindow @runFromBattle="closeBattle" v-bind:db="db"></BattleWindow>
  </div>
    <div v-if="locationOn" id="location">
    <LocationWindow @battleStarted="startBattle" v-bind:db="db"></LocationWindow>
  </div>
</div>
</template>
<script>
import BattleWindow from "@/components/GamePlatform/BattleWindow";
import LocationWindow from "@/components/GamePlatform/LocationWindow";
export default {
  name: "GameFlatform",
  components:{BattleWindow,LocationWindow},
  props:['db'],
  data(){
    return{
      battleOn:false,
      locationOn:true,
    }
  },
  methods:{
    closeBattle(){
      this.battleOn=!this.battleOn;
      this.locationOn=!this.locationOn;
    },
    startBattle(){
      this.battleOn=!this.battleOn;
      this.locationOn=!this.locationOn;
    }
  }
}
</script>

<style scoped>
  #mainblock
  {
    background-color:rgba(215,216,229,0.2);
    height: 100%;
    width: 100%;

  }
  #battle
  {
    height: 100%;
    width: 100%;
  }
</style>