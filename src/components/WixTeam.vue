<template>
  <div id="mainblock">
    <div v-if="!teamLoaded">Команда загружается</div>
    <div v-if="teamLoaded">
      <div v-for="teamMember in team" v-bind:key="teamMember.id">
        <div class="teamMember" v-if="teamMember.busy==='true'">
          <div class="portraitBlock"><img class="portraitImage"
                                          :src="require(`../../public/assets/Icons/WixIcons/`+teamMember[2].name +`Icon.png`)">
          </div>
          <div class="nameAndHPBlock">
            <div class="name">{{ teamMember[1].nickname }}</div>
            <div class="hitpoints">{{ teamMember[1].hp }}/
              {{ teamMember[2].baseStats.hp }}
            </div>
          </div>
        </div>
        <div class="teamMemberNon" v-if="teamMember.busy==='false'">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "wixTeam",
  props: ['db', 'character'],
  data() {
    return {
      teamLoaded: false,
      team: [],
      allWixlings: '',
    }
  },
  methods: {
    async getWixDataInDex() {
      let dex = Object.values(this.$store.getters.getDex)
      for (let i = 0; i < this.team.length; i++) {
        if (this.team[i].busy === 'true') {
          for (let dexId = 0; dexId < dex.length; dexId++) {
            if (this.team[i][1].idInDex === dex[dexId].id) {
              this.team[i][2] = dex[dexId]
            }
          }
        }
      }
      await this.$store.dispatch('setUserTeam', this.team)
      this.teamLoaded = !this.teamLoaded
    },
    teamLoading() {
      this.team = Object.values(this.$store.getters.getCharacter.teamWixling)
      let wixInSafeCount = 1
      //При появлении у игрока пустая команда и нет ни одного викса
      if (Object.prototype.hasOwnProperty.call(this.character, 'caughtWixling')) {
        this.allWixlings = this.character.caughtWixling
        this.allWixlingsArr = Object.values(this.allWixlings)
        wixInSafeCount = Object.keys(this.allWixlings).length
      }
      //ставим викса из сейфа в его ячейку в команде
      for (let i = 0; i < this.team.length; i++) {
        if (this.team[i].busy === 'true') {
          for (let j = 0; j < wixInSafeCount; j++) {
            if (this.team[i].id === this.allWixlingsArr[j].id) {
              this.team[i][1] = this.allWixlingsArr[j]
              break;
            }
          }
        }
      }

    }
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      switch (mutation.type) {
        case 'setCharacter':
          this.teamLoading()
          this.getWixDataInDex()
          break;
      }
    })
    if(!this.teamLoaded){
      this.teamLoading()
    this.getWixDataInDex()
    }

  }
}
</script>

<style scoped>
#mainblock {
  height: 34%;
  width: 100%;
  background-color: rgba(215, 216, 229, 0.2);
}

.teamMember {
  margin-top: 5px;
  height: 30%;
  display: flex;
  flex-direction: row;
  border-radius: 5px;
}

.teamMember:hover {
  outline: solid 5px aqua;
  cursor: pointer;
}

.teamMemberNon {
  margin-top: 5px;
  margin-left: 5px;
  background-color: rgba(215, 216, 229, 0.5);
  height: 50px;
  width: 95%;
  border-radius: 5px;
}

.portraitBlock {
  width: 25%;
  height: 100%;
}

.portraitImage {
  max-height: 50px;
}

.nameAndHPBlock {
  width: 70%;
  height: 100%;
}

.name {
  width: 100%;
  height: 38%;
  background-color: #2c3e50;
  color: white;
}

.hitpoints {
  width: 100%;
  height: 58%;
  background-color: #42b983;
}
</style>