<template>
  <div class="window" id="profileWindow">
    <div v-if="characterLoaded">
      <div id="titleDiv" class="flexElem"><b>{{ character.nickname }}</b></div>
      <div class="flexElem" id='charLook'>
        <img :src="require(`../../../public/assets/CharCustomize/Skin`+character.look+`.png`)"></div>
    </div>
    <div id="myWixButton" v-on:click="openWixManage">My Wixes</div>
  </div>
</template>

<script>
export default {
  name: "ProfileInfo",
  props: ['absMargin'],
  data() {
    return {
      character: '',
      characterLoaded: false,
    }
  },
  methods: {
    openWixManage() {
      this.$emit('wixManageOpened')
    }
  },
  mounted() {
    this.character = this.$store.getters.getCharacter
    document.getElementById('profileWindow').style.marginLeft = this.absMargin + 'px'
    this.characterLoaded = true
  }
}
</script>

<style scoped>
#profileWindow {
  margin-top: 5px;
  position: absolute;
  width: 250px;
  height: 420px;
  background-color: #777B98;
  z-index: 10;
}

#titleDiv {
  width: 100%;
  height: 30px;
  background-color: #2c3e50;
  color: white;
}

#charLook {
  margin-left: 20px;
  margin-top: 20px;
}

#myWixButton {
  width: 80%;
  border-radius: 10px;
  background-color: #2c3e50;
  color: white;
  height: 35px;
  margin-left: 10%;
  margin-right: 10%;
}

#myWixButton:hover {
  cursor: pointer;
  outline: 3px solid aqua;
}
</style>