<template>
  <div id="wixEvolveWindow">
    Wix Evolving
    <div v-if="loaded">
      <div style="height: 20px">{{ message }}</div>
      <div id="evolveLine">
        <div>
          <img class="wixImage" :src="require(`../../../public/assets/Wixlings/`+wix.dexInfo.name+`Png.png`)">
        </div>
        <div style="width: 30px;color: white;font-size: 30px;padding-top: 100px;text-shadow: 1px 1px 1px 1px #000;">
          →
        </div>
        <div>
          <img class="wixImage" :src="require(`../../../public/assets/Wixlings/`+nextWixStage.name+`Png.png`)">
        </div>
      </div>
      <div>Essence Cost: {{ wix.dexInfo.essenceToEvolve }}</div>
      <div id="evolutionButton" v-on:click="evolve">Evolve</div>
    </div>
    <div v-if="!loaded">
        The maximum wix stage has been reached
    </div>
  </div>
</template>

<script>
import {child, get, getDatabase, ref, update} from "firebase/database";

export default {
  name: "wixEvolving",
  props: ['wix', 'db'],
  data() {
    return {
      nextWixStage: '',
      loaded: false,
      message: ' ',
      costModifier:0.5
    }
  },
  methods: {
    async getNextStage() {
      if (this.wix.dexInfo.nextEvolutionId !== -1) {
        await get(child(this.db, `wixlings/wix` + this.wix.dexInfo.nextEvolutionId))
            .then((snapshot) => {
              if (snapshot.exists()) {
                this.nextWixStage = snapshot.val();
              }
            })
        console.log(this.nextWixStage)
        this.loaded = true
      }
    },
    async evolve() {
      if (this.wix.dexInfo.essenceToEvolve*this.costModifier > this.$store.getters.getCharacter.essence) {
        this.message = 'Not enough essence'
      } else {
        //Смена вида викса
        const db = getDatabase();
        await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id + '/characterData/character' +
            localStorage.activeCharacter + '/caughtWixling/wixInSafe_' + this.wix.id), {
         idInDex: this.nextWixStage.id,
          nickname:this.nextWixStage.name,
          hp:this.nextWixStage.baseStats.hp
        })
        //Зобираим исенцийю
        let newEssence=this.$store.getters.getCharacter.essence-this.wix.dexInfo.essenceToEvolve*this.costModifier
        this.$store.dispatch('setCharacterEssence',newEssence)
        this.$store.dispatch('setCharacter')
      }
    }
  },
  mounted() {
    this.getNextStage()
  }
}
</script>

<style scoped>
#wixEvolveWindow {
  margin-top: 40px;
  border-radius: 10px;
  position: absolute;
  outline: 3px solid #2c3e50;
  background-color: #b9bddb;
  width: 320px;
  height: 320px;
  z-index: 112;
}

.wixImage {
  width: 100%;
}

#evolveLine {
  display: flex;
  flex-direction: row;
}

#evolutionButton {
  width: 120px;
  height: 30px;
  background-color: aquamarine;
  outline: 1px solid black;
  border-radius: 10px;
  margin-left: 30%;
  margin-top: 5px;
}

#evolutionButton:hover {
  background-color: aqua;
  cursor: pointer;
}
</style>