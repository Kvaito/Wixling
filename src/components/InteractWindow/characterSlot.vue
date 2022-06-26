<template>
<div id="characterSlot">
  <div>
    <div v-if="character.busy==='true'">
      <div class="flexElem">{{character.nickname}}</div>
      <div class="flexElem"><img :src="require(`../../../public/assets/CharCustomize/Skin`+character.look+`.png`)"></div>
      <div class="flexElem">Money: {{character.money}}ฟ</div>
      <div class="flexElem">Essence: {{character.essence}}</div>
       <div class="createCharacter" style="width: 100px;margin-left: 33%;margin-top: 20px"><router-link to="/game" style="text-decoration: none; color:white">
         <div v-on:click="saveActiveCharacter" >Continue</div></router-link></div>
    </div>
    <div v-if="character.busy==='false'">
      <div style="margin-top: 30px"><img :src="require(`../../../public/assets/CharCustomize/NoCharacter.png`)"></div>
      <div v-on:click="createCharacter" class="createCharacter" style="margin-top: 30px">Create character</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props:['character','slotActive'],
name: "characterSlot",
  data(){
  return{
  }
  },
  methods:{
    createCharacter(){
        this.$emit('createCharacter')
    },
    saveActiveCharacter(){
      localStorage.activeCharacter=this.slotActive;
    }
  },
}
</script>

<style scoped>
  #characterSlot{
    border-radius: 10px;
  }
  .createCharacter
  {
    width: 200px;
    height: 30px;
    margin-left: 15%;
    color: white;
    background-color: #2c3e50;
    border-radius: 10px;
    bottom: 20px;
  }
  .createCharacter:hover
  {
    cursor: pointer;
    outline: solid 3px aqua;
  }
</style>