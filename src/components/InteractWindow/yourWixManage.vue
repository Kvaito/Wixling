<template>
<div class="window" id="wixManageWindow">
   <div class="closeWindow" v-on:click="closeWindow">x</div>
  <div id="titleDiv"><b>Wix Safe</b></div>
  <div v-if="!wixSafeLoaded">
    {{ message }}
  </div>
  <div v-if="wixSafeLoaded" style="height: 400px;">
    <div id="wixSafeList">
        <div v-for="wix in wixSafe" v-bind:key="wix.id">
      <div v-on:click="chooseWix(wix)" class="safeItem">
        <div><img class="wixIcon" :src="require(`../../../public/assets/Icons/WixIcons/`+wix.dexInfo.name +`Icon.png`)"></div>
        <div class="nickAndEssence">
          <div class="nickname" style="padding-left: 10px;padding-top: 15px">{{wix.nickname}}</div>
        </div>
      </div>
    </div>
    </div>
  </div>
  <WixUpgrade v-if="upgradeWindow" v-bind:wix="this.chosenWix" v-bind:db="db"></WixUpgrade>
</div>
</template>

<script>
import {ref} from "firebase/database";
import WixUpgrade from "./wixUpgrade";
import {getDatabase} from "@firebase/database";

export default {
name: "yourWixManage",
  components: {WixUpgrade},
  props:['absMargin'],
  data(){
  return{
    wixSafe:'',
    wixSafeLoaded:false,
    upgradeWindow:false,
    chosenWix:'',
    character:'',
    db:'',
    message:'Your wix are loading'
  }
  },
  methods:{
    async getWixDataInDex(){
      let dex = Object.values(this.$store.getters.getDex)
      if(Object.prototype.hasOwnProperty.call(this.character,'caughtWixling')){
          this.wixSafe=Object.values(this.character.caughtWixling)
        for (let i = 0; i < this.wixSafe.length; i++) {
          for (let dexId = 0; dexId < dex.length; dexId++) {
            if (this.wixSafe[i].idInDex===dex[dexId].id) {
              this.wixSafe[i]['dexInfo'] = dex[dexId]
            }
          }
      }
      this.wixSafeLoaded=!this.wixSafeLoaded
      }
      else{
        this.message='There is no wix :('
      }

    },
    chooseWix(wix){
        this.chosenWix=wix
      this.upgradeWindow=!this.upgradeWindow
    },
    closeWindow() {
      this.$emit('closeWindow')
    },
  },
  mounted() {
  this.db=ref(getDatabase())
  this.character=this.$store.getters.getCharacter
  document.getElementById('wixManageWindow').style.marginLeft=this.absMargin+'px';
    this.getWixDataInDex()
  }
}
</script>

<style scoped>
 #wixManageWindow
 {
   margin-top: 5px;
  width: 250px;
  height: 490px;
    position: absolute;
    background-color: #777B98;
    z-index: 11;
 }
 #wixSafeList{
   margin-top: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll; /* прокрутка по вертикали */
  height: 100%;
 }

 #titleDiv {
  width: 100%;
  height: 30px;
  background-color: #2c3e50;
  color: white;
}

 .safeItem
 {
   margin-left: 20px;
   width: 80%;
   background-color: #2c3e50;
   border-radius: 15px;
   margin-top: 10px;
   display: flex;
   flex-direction: row;
 }
 .safeItem:hover{
   cursor: pointer;
   outline: solid 3px aqua;
 }
 .nickAndEssence
 {
   display: flex;
   flex-direction: column;
 }
 .wixIcon
 {
   margin-left: 10px;
   width: 50px;
   height: 50px;
 }
 .nickname
 {
   color: white;
 }
 .essenceBar{
   margin-left: 10px;
   width: 100px;
   background-color:aqua;
   border-radius: 15px;
 }
</style>