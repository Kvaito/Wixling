<template>
<div id="wixTrading" class="window">
  <div id="titleDiv" style="position: absolute;justify-content: center; width: 100%"><span><b>Wix Trading</b></span></div>
   <div class="closeWindow" v-on:click="closeWindow">x</div>
  <div v-if="wixLoaded" id="wixShop" >
    <div v-for="wix in wixGoods" v-bind:key="wix.id">
      <div class="wixTamerGood">
        <div>{{ wix.name }}</div>
        <div><img :src="require(`../../../../public/assets/Wixlings/`+wix.name+`Png.png`)"></div>
        <div>{{wix.price}}ฟ</div>
        <div class="buyButton" style="margin-left: 30%;margin-top: 10px;margin-bottom: 10px" v-on:click="buyWix(wix.id)">Buy</div>
      </div>
    </div>
  </div>
  <div id="wixTrader"><img src="../../../../public/assets/Characters/Tamer.png"></div>
</div>
</template>
<script>
import {child, get} from "firebase/database";
export default {
name: "WixTrading",
  props:['db'],
  data(){
  return{
    wixGoods:[],
    allowedWixId:[1,4,6,9,11],
    wixLoaded:false,
  }
  },
  methods:{
   closeWindow(){
        this.$emit('closeWindow')
    },
    shuffle(arr){
	let j, temp;
	for(let i = arr.length - 1; i > 0; i--){
		j = Math.floor(Math.random()*(i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
},
    async buyWix(idWix) {
     let wixId=1
      let chosenWix = ''
      await get(child(this.db, 'wixlings/wix' + idWix))
          .then((snapshot) => {
            if (snapshot.exists()) {
              chosenWix = snapshot.val();
            }
          })
      if (this.$store.getters.getCharacter.money < chosenWix.price) {
        alert('No money :D Sorry for alert')
      } else {
        let character=this.$store.getters.getCharacter
        if(Object.prototype.hasOwnProperty.call(character,'caughtWixling'))
        {
          wixId = Object.values(this.$store.getters.getCharacter.caughtWixling).length + 1
        }
        const boughtWix = {
          idInDex: idWix,
          nickname: chosenWix.name,
          hp: chosenWix.baseStats.hp,
          status: '',
          attacksId: {},
          implantsId: {},
          id: wixId
        }
        //ставим викса в сейф игрока
        await this.$store.dispatch('setWixInSafe', boughtWix)
        // //уменьшаем баланс игрока
        let newMoney = this.$store.getters.getCharacter.money - chosenWix.price;
        await this.$store.dispatch('setCharacterMoney', newMoney)
        //обновляем персонажа
        await this.$store.dispatch('setCharacter')
        this.$emit('closeWindow')
      }
    },
    async uploadWixInShowcase(){
     //проверка, что айди не повторяются
     let idWixToFound=this.shuffle(this.allowedWixId)
     for(let i=0;i<3;i++){
       this.setWixInShowcase(idWixToFound,i)
     }
    },
    async setWixInShowcase(idWixToFound,i){
     await get(child(this.db,'wixlings/wix'+this.allowedWixId[i]))
      .then((snapshot)=>{
        this.wixGoods[i]=snapshot.val()
        if(i===2){
          this.wixLoaded=true
        }
      })
    }
  },
  mounted() {
    //добавление новых виксов в зависимости от побеждённых соперников
    if(Object.prototype.hasOwnProperty.call(this.$store.getters.getCharacter, 'gameEnded')){
      this.allowedWixId.push(15)
    }
    if(Object.prototype.hasOwnProperty.call(this.$store.getters.getCharacter, 'atherOpened')){
      this.allowedWixId.push(14)
    }
    this.uploadWixInShowcase()
  }
}
</script>

<style scoped>
 #wixTrading{
   position: absolute;
   margin: 1%;
  max-height: 70vh;
   max-width: 100%;
   background-color: #777B98;
   display: flex;
   flex-direction: row;
   padding-bottom: 30px;
 }

 .buyButton{
   margin-bottom: 10px;
 }

 #titleDiv
{
  width: 100%;
  height: 30px;
  background-color: #2c3e50;
  color: white;
}

 #wixShop{
   margin-left: 50px;
   margin-top: 50px;
   display: flex;
   flex-direction: row;
 }
 #wixTrader{
   margin-top: 80px;
    margin-left: 2%;
 }
 .wixTamerGood
 {
   padding-bottom: 5px;
   background-color: #b9bddb;
   border-radius: 10px;
   margin-left: 20px;
 }
</style>