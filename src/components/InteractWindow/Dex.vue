<template>
  <div class="window" id="dexWindow">
    <div id="dex">
      <div id="wixList">
        <div v-for="(wix,key) in dex" :key="wix.id">
          <div class="wixInList" v-on:click="chooseWix(key)" v-if="wix.id!==0">
            <div>{{ wix.id }}</div>
            <div>{{ wix.name }}</div>
          </div>
        </div>
      </div>
      <div id="wixDescription" v-if="chosenWix">
        <div><b>{{ chosenWix.name }}</b></div>
        <div id="mainInfoBlock">
          <div id="wixImage">
            <img :src="require(`../../../public/assets/Wixlings/`+chosenWix.name+`Png.png`)">
          </div>
          <div style="display: flex;flex-direction: column">
            <div id="wixTypes" style="height: 50px">
              <div
                  :style="{backgroundColor:chosenWix.backColor1,color:chosenWix.fontColor1}">
                {{ chosenWix.type1 }}
              </div>
              <div v-if="chosenWix.type2!=='none'"
                   :style="{backgroundColor:chosenWix.backColor2,color:chosenWix.fontColor2}">
                {{ chosenWix.type2 }}
              </div>
            </div>
            <div id="stats">
              <div class="stat">HP {{ chosenWix.baseStats.hp }}</div>
              <div class="stat">Attack {{ chosenWix.baseStats.attack }}</div>
              <div class="stat">Defence {{ chosenWix.baseStats.defense }}</div>
              <div class="stat">Speed {{ chosenWix.baseStats.speed }}</div>
            </div>
            <div>Essence Value: {{ chosenWix.essenceInside }}</div>
            <div id="description">{{ chosenWix.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {child, get} from "firebase/database";

export default {
  name: "Dex",
  props: ['character', 'absMargin', 'db'],
  data() {
    return {
      dex: '',
      chosenWix: ''
    }
  },
  methods: {
    async getDex() {
      await get(child(this.db, `wixlings`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.dex = snapshot.val();
            }
          })
      this.dex = Object.values(this.dex)
      this.chosenWix = this.dex[1];
      this.dex.sort(this.sortWix)
    },
    chooseWix(chosenWixId) {
      this.chosenWix = this.dex[chosenWixId];
      switch (this.chosenWix.type1) {
        case('none'):
          this.chosenWix.backColor1 = '#d0d0d0'
          this.chosenWix.fontColor1 = '#000000'
          break;
        case('void'):
          this.chosenWix.backColor1 = '#1c1c2f'
          this.chosenWix.fontColor1 = '#ffffff'
          break;
        case('water'):
          this.chosenWix.backColor1 = '#3893bf'
          this.chosenWix.fontColor1 = '#ffffff'
          break;
        case('fire'):
          this.chosenWix.backColor1 = '#be4747'
          this.chosenWix.fontColor1 = '#ffffff'
          break;
        case('grass'):
          this.chosenWix.backColor1 = '#518c4b'
          this.chosenWix.fontColor1 = '#ffffff'
          break;
        case('ancient'):
          this.chosenWix.backColor1 = '#584a40'
          this.chosenWix.fontColor1 = '#ffffff'
          break;
        case('mystic'):
          this.chosenWix.backColor1 = '#db98de'
          this.chosenWix.fontColor1 = '#140c40'
          break;
        case('electric'):
          this.chosenWix.backColor1 = '#d4d36d'
          this.chosenWix.fontColor1 = '#292932'
          break;
        case('toxic'):
          this.chosenWix.backColor1 = '#64329b'
          this.chosenWix.fontColor1 = '#ffffff'
          break;
        case('mecha'):
          this.chosenWix.backColor1 = '#686f77'
          this.chosenWix.fontColor1 = '#ffffff'
          break;

      }
      switch (this.chosenWix.type2) {
        case('none'):
          this.chosenWix.backColor2 = '#d0d0d0'
          this.chosenWix.fontColor2 = '#000000'
          break;
        case('void'):
          this.chosenWix.backColor2 = '#1c1c2f'
          this.chosenWix.fontColor2 = '#ffffff'
          break;
        case('water'):
          this.chosenWix.backColor2 = '#3893bf'
          this.chosenWix.fontColor2 = '#ffffff'
          break;
        case('fire'):
          this.chosenWix.backColor2 = '#be4747'
          this.chosenWix.fontColor2 = '#ffffff'
          break;
        case('grass'):
          this.chosenWix.backColor2 = '#518c4b'
          this.chosenWix.fontColor2 = '#ffffff'
          break;
        case('ancient'):
          this.chosenWix.backColor2 = '#584a40'
          this.chosenWix.fontColor2 = '#ffffff'
          break;
        case('mystic'):
          this.chosenWix.backColor2 = '#db98de'
          this.chosenWix.fontColor2 = '#140c40'
          break;
        case('electric'):
          this.chosenWix.backColor2 = '#d4d36d'
          this.chosenWix.fontColor2 = '#292932'
          break;
        case('toxic'):
          this.chosenWix.backColor2 = '#64329b'
          this.chosenWix.fontColor2 = '#ffffff'
          break;
        case('mecha'):
          this.chosenWix.backColor2 = '#686f77'
          this.chosenWix.fontColor2 = '#ffffff'
          break;

      }
    },
    sortWix(a, b) {
      if (a.id > b.id) return 1; // если первое значение больше второго
      if (a.id === b.id) return 0; // если равны
      if (a.id < b.id) return -1; // если первое значение меньше второго
    }
  },
  mounted() {
    document.getElementById('dexWindow').style.right = window.innerWidth - this.absMargin + 'px'
    this.getDex()
  }
}
</script>

<style scoped>
#dexWindow {
  position: absolute;
  width: 700px;
  height: 360px;
  background-color: #777B98;
  z-index: 9;
}

#dex {
  display: flex;
  flex-direction: row;
  margin: 20px;
  height: 360px;
}

#wixList {
  /*background-color: #b9bddb;*/
  width: 30%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll; /* прокрутка по вертикали */
  height: 90%;
  padding-right: 10px;
}

.wixInList {
  background-color: #2c3e50;
  height: 25px;
  color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 5px;
  padding-left: 5px;
  padding-right: 10px;
  border-radius: 5px;
}

.wixInList:hover {
  cursor: pointer;
  outline: solid 3px aqua;
}

#wixDescription {
  outline: 3px solid #2c3e50;
  border-radius: 10px;
  background-color: #b9bddb;
  margin-left: 3%;
  width: 65%;
  display: flex;
  flex-direction: column;
  height: 90%;
}

#wixImage {
  height: 80%;
  width: 60%;
}

#mainInfoBlock {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 20px;
}

#stats {
  right: 0;
  display: flex;
  flex-direction: column;
  color: white;
}

.stat {
  height: 30px;
  background-color: #2c3e50;
  border-radius: 10px;
  margin-bottom: 5px;
}

#description {
  width: 120px;;
}

#wixTypes>div{
  border-radius: 10px;
  height: 20px;
}
#wixTypes>div:nth-child(2)
{
  margin-top:5px
}
/*.stat{*/
/*  width: 70px;*/
/*  display: flex;*/
/*  justify-content: space-between;*/
/*}*/
</style>