<template>
  <div class="window" id="battleTraining">
    <div id="titleDiv">Battle Tree</div>
    <div class="closeWindow" v-on:click="closeWindow">x</div>
    <div id="battleTree">
      <div class="battleTreeRankLine">
        <div class="battleTreeSlot" v-on:click="changeEnemy(6)">
          <img class="enemyIcon" alt="enemyIcon" src="../../../../public/assets/Characters/CharIcons/HexanaIcon.png">
        </div>
      </div>
      <div class="battleTreeRankLine">
        <div class="battleTreeSlot" v-on:click="changeEnemy(4)">
          <img class="enemyIcon" alt="enemyIcon" src="../../../../public/assets/Characters/CharIcons/ModelIcon.png">
        </div>
        <div class="battleTreeSlot" v-on:click="changeEnemy(5)">
          <img class="enemyIcon" alt="enemyIcon" src="../../../../public/assets/Characters/CharIcons/ViculusIcon.png">
        </div>
      </div>
      <div class="battleTreeRankLine">
        <div class="battleTreeSlot" v-on:click="changeEnemy(1)"><img class="enemyIcon" alt="enemyIcon"
                                                                     src="../../../../public/assets/Characters/CharIcons/BanditIcon.png">
        </div>
        <div class="battleTreeSlot" v-on:click="changeEnemy(2)"><img class="enemyIcon" alt="enemyIcon"
                                                                     src="../../../../public/assets/Characters/CharIcons/HexWorkerIcon.png">
        </div>
        <div class="battleTreeSlot" v-on:click="changeEnemy(3)"><img class="enemyIcon" alt="enemyIcon"
                                                                     src="../../../../public/assets/Characters/CharIcons/KidIcon.png">
        </div>
      </div>
    </div>
    <div id="chosenOpponent" v-if="enemyChosen">
      <img class="enemyIcon"
           :src="require(`../../../../public/assets/Characters/CharIcons/`+allEnemies[chosenEnemyId].name+`Icon.png`)">
      <div id="opponentInfo">
        <div>{{ allEnemies[chosenEnemyId].name }}</div>
        <div>Bet: {{ allEnemies[chosenEnemyId].moneyForWin }} ฟ</div>
        <div>Rank: {{ allEnemies[chosenEnemyId].rank }}</div>
        <div id="startBattle" v-on:click="startBattle">Battle!</div>
      </div>
      <div style="width: 170px">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import {child, get} from "firebase/database";

export default {
  name: "BattleTrainer",
  props: ['db'],
  data() {
    return {
      chosenEnemyId: 1,
      enemyChosen: false,
      enemy: '',
      allEnemies: [],
      message: ''
    }
  },
  methods: {
    async startBattle() {
      if (this.$store.getters.getCharacter.teamWixling["1_MemberIdInSafe"].busy === 'false') {
        this.message = 'Первый викс в команде не назначен'
        return 0
      }
      await get(child(this.db, `opponents/opponent` + this.chosenEnemyId))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.enemy = snapshot.val();
            }
          })
      this.$store.dispatch('setEnemyTeam', this.enemy)
      this.$emit('battleStarted')
    },
    closeWindow() {
      this.$emit('closeWindow')
    },
    changeEnemy(id) {
      this.chosenEnemyId = id
      this.enemyChosen = true
    },
    async getEnemies() {
      await get(child(this.db, `opponents`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.allEnemies = Object.values(snapshot.val());
            }
          })
    },

  },
  mounted() {
    this.getEnemies()
  }
}
</script>

<style scoped>
#battleTraining {
  position: absolute;
  margin: 1%;
  width: 900px;
  height: 65vh;
  background-color: #777B98;
  display: flex;
  flex-direction: row;
  padding-bottom: 20px;
}

#titleDiv {
  position: absolute;
  width: 100%;
  height: 30px;
  background-color: #2c3e50;
  color: white;
}

#battleTree {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 70%;
}

.battleTreeRankLine {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
}

.battleTreeSlot {
  /*width: 50px;*/
  /* height: 40px;*/
  padding-top: 10px;
  /*background-color: #2c3e50;*/
  color: white;
  border-radius: 10px;
}

.battleTreeSlot:hover {
  cursor: pointer;
  /*outline:solid 1px aquamarine;*/
}

#chosenOpponent {
  margin-top: 50px;
  margin-left: 50px;
}

#startBattle {
  margin-top: 10px;
  color: black;
  background-color: aqua;
  border-radius: 10px;
  height: 30px;
  width: 100px;
  margin-left: 20%;
}

#startBattle:hover {
  cursor: pointer;
  background-color: #9cffff;
}

.enemyIcon {
  width: 180px;
  height: 200px;
}

#opponentInfo {
  border-radius: 10px;
  background-color: #2c3e50;
  color: white;
  padding: 10px;
  margin-top: 10px;
}
</style>