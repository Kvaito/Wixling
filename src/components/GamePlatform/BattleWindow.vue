<template>
  <div id="battleWindow">
    <div id="field" v-if="teamsLoaded&&attacksLoaded">
      <div id="congratulations" v-if="finishMessage!==''">{{ finishMessage }}
        <img
            alt="LeviataSmile" style="width: 100%"
            :src="require(`../../../public/assets/Icons/Smile.png`)"></div>
      <div id="wix1">
        <div class="name">
          {{ teamUser[teamUserCurrentMember][1].nickname }}
        </div>
        <div class="HP">
          <div class="captionInHpBar"><span>{{ $store.getters.getUserHp }}/
         {{ teamUser[teamUserCurrentMember][2].baseStats.hp }}</span></div>
          <div id="hpBarUser"></div>
        </div>
        <div class="statusEffect">
          <div v-if="Object.prototype.hasOwnProperty.call(teamUser[teamUserCurrentMember], 'status')">
            <img alt="statusEffect"
                 :src="require(`../../../public/assets/Icons/InterfaceIcons/`+teamUser[teamUserCurrentMember].status+`Icon.png`)">
          </div>
        </div>
        <div class="wixImg" id="wix1Image">
          <img
              alt="teamUserWixImage"
              :src="require(`../../../public/assets/Wixlings/`+teamUser[teamUserCurrentMember][2].name+`Png.png`)">
        </div>
      </div>
      <div id="battleLog">
        <div id="battleLogList">
          <div v-for="(turn,index) in battleLogMessage" v-bind:key="index">
            <div class="battleLogMessage"><span>{{ turn }}</span></div>
          </div>
        </div>
        <div style="bottom: 0">
          <div v-on:click="openBattleLog('open')" v-if="!battleLogOpen" class="arrowButton">▼</div>
          <div v-on:click="openBattleLog('close')" v-if="battleLogOpen" class="arrowButton">▲</div>
        </div>
      </div>
      <div id="wix2">
        <div class="name">
          {{ teamEnemy[teamEnemyCurrentMember].wixInfo.name }}
        </div>
        <div class="HP">
          <div class="captionInHpBar"><span>{{ $store.getters.getEnemyHp }}/
            {{ teamEnemy[teamEnemyCurrentMember].wixInfo.baseStats.hp }}</span></div>
          <div id="hpBarEnemy"></div>
        </div>
        <div class="statusEffect">
          <div v-if="Object.prototype.hasOwnProperty.call(teamEnemy[teamEnemyCurrentMember], 'status')">
            <img alt="statusEffect"
                 :src="require(`../../../public/assets/Icons/InterfaceIcons/`+teamEnemy[teamEnemyCurrentMember].status+`Icon.png`)">
          </div>
        </div>
        <div class="wixImg" id="wix2Image">
          <img alt="teamEnemyWixImage"
               :src="require(`../../../public/assets/Wixlings/`+teamEnemy[teamEnemyCurrentMember].wixInfo.name+`Png.png`)">
        </div>
      </div>
    </div>
    <div id="attackBlock" v-if="attacksLoaded&&($store.getters.getUserHp>0)&&!battleEnded">
      <div id="attack1" class="attack" v-on:click="battleLogic(teamUser[teamUserCurrentMember].attacks[0])"
           v-if="teamUser[teamUserCurrentMember].attacks[0].busy"
           :style="{backgroundColor:teamUser[teamUserCurrentMember].attacks[0].backColor,color:teamUser[teamUserCurrentMember].attacks[0].fontColor}">
        <span>{{ teamUser[teamUserCurrentMember].attacks[0].attackInfo.name }}</span>
        <div class="modalInfo">{{ teamUser[teamUserCurrentMember].attacks[0].attackInfo.name }}<br>
          {{ teamUser[teamUserCurrentMember].attacks[0].attackInfo.description }}<br>
          Power {{ teamUser[teamUserCurrentMember].attacks[0].attackInfo.power }}<br>
          Type {{ teamUser[teamUserCurrentMember].attacks[0].attackInfo.type }}
        </div>
      </div>
      <div id="attack2" class="attack" v-on:click="battleLogic(teamUser[teamUserCurrentMember].attacks[1])"
           :style="{backgroundColor:teamUser[teamUserCurrentMember].attacks[1].backColor,color:teamUser[teamUserCurrentMember].attacks[1].fontColor}"
           v-if="teamUser[teamUserCurrentMember].attacks[1].busy">
        <span>{{ teamUser[teamUserCurrentMember].attacks[1].attackInfo.name }}</span>
        <div class="modalInfo">{{ teamUser[teamUserCurrentMember].attacks[1].attackInfo.name }}<br>
          {{ teamUser[teamUserCurrentMember].attacks[1].attackInfo.description }}<br>
          Power {{ teamUser[teamUserCurrentMember].attacks[1].attackInfo.power }}<br>
          Type {{ teamUser[teamUserCurrentMember].attacks[1].attackInfo.type }}
        </div>
      </div>
      <div id="attack3" class="attack" v-on:click="battleLogic(teamUser[teamUserCurrentMember].attacks[2])"
           :style="{backgroundColor:teamUser[teamUserCurrentMember].attacks[2].backColor,color:teamUser[teamUserCurrentMember].attacks[2].fontColor}"
           v-if="teamUser[teamUserCurrentMember].attacks[2].busy">
        <span>{{ teamUser[teamUserCurrentMember].attacks[2].attackInfo.name }}</span>
        <div class="modalInfo">{{ teamUser[teamUserCurrentMember].attacks[1].attackInfo.name }}<br>
          {{ teamUser[teamUserCurrentMember].attacks[2].attackInfo.description }}<br>
          Power {{ teamUser[teamUserCurrentMember].attacks[2].attackInfo.power }}<br>
          Type {{ teamUser[teamUserCurrentMember].attacks[2].attackInfo.type }}
        </div>
      </div>
      <div id="attack4" class="attack" v-on:click="battleLogic(teamUser[teamUserCurrentMember].attacks[3])"
           v-if="teamUser[teamUserCurrentMember].attacks[3]">
        <span>{{ teamUser[teamUserCurrentMember].attacks[3].attackInfo.name }}</span>
        <div class="modalInfo">{{ teamUser[teamUserCurrentMember].attacks[3].attackInfo.name }}<br>
          {{ teamUser[teamUserCurrentMember].attacks[3].attackInfo.description }}<br>
          Power {{ teamUser[teamUserCurrentMember].attacks[3].attackInfo.power }}<br>
          Type {{ teamUser[teamUserCurrentMember].attacks[3].attackInfo.type }}
        </div>
      </div>
      <div id="runButton" class="attack" v-on:click="runFromBattle" style="background-color: #58586e">Run</div>
    </div>
    <div v-if="battleEnded">
      <div id="leaveFromBattle" v-on:click="runFromBattle">
        Exit from battle
      </div>
    </div>
    <div id="changeTeam" v-if="teamsLoaded">
      <div id="changeTeamIcon">
        <div v-for="(teamMember,index) in teamUser" v-bind:key="index">
          <div v-if="teamMember.busy==='true'">
            <div class="changeTeamIconItem" v-if="teamUserCurrentMember===index&&(teamMember[1].hp>0)"
                 style="background-color: aqua"></div>
            <div class="changeTeamIconItem" v-if="teamUserCurrentMember!==index&&(teamMember[1].hp>0)"
                 v-on:click="changeTeamMember(index)"></div>
            <div class="changeTeamIconItem" v-if="teamMember[1].hp<=0" style="background-color: #6e1a17"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {child, get, getDatabase, ref, update} from "firebase/database";

export default {
  name: "BattleWindow",
  props: ['db'],
  data() {
    return {
      teamsLoaded: false,
      attacksLoaded: false,
      battleLogOpen: false,
      turnEnded: true,
      battleEnded: false,
      teamUser: [],
      teamUserCurrentMember: 0,
      teamEnemy: [],
      teamEnemyCurrentMember: 0,
      attackList: '',
      turn: 0,
      finishMessage: '',
      endBattleMessage: '',
      wixHpToRegenAfterBattle: [],
      typeEffectiveness: {
        strongTo: {
          fire: ["grass", "mecha"],
          water: ["fire", "ancient"],
          grass: ["water", "ancient"],
          mecha: [""],
          electric: ['water', "mecha"],
          toxic: ["grass"],
          void: ["ancient", "electric"],
          ancient: ["mecha", "toxic"],
          mystic: ["toxic", "void"]
        },
        ineffectiveTo: {
          fire: ["fire", "water"],
          water: ["water", "grass"],
          grass: ["grass", "fire"],
          mecha: ["ancient"],
          toxic: ["toxic", "mystic"],
          void: ["toxic"],
          electric: ["grass"],
          ancient: [""],
          mystic: ["mecha", "ancient"],
        },
        senselessly: {
          void: ["void"],
          ancient: ["ancient", "mystic"]
        }

      },
      battleLogMessage: ['Battle Started!'],
      countedEffectiveness: '',
      addAccuracy: 0,
      addCritChance: 0,
      damageInfo: {
        userDamage: 0,
        enemyDamage: 0,
      }
    }
  },
  methods: {
    openBattleLog(action) {
      this.battleLogOpen = !this.battleLogOpen
      if (action === 'open') {
        document.getElementById('battleLog').style.height = 50 + 'vh'
      }
      if (action === 'close') {
        document.getElementById('battleLog').style.height = 70 + 'px'
      }
    },
    changeTeamMember(teamMemberIndex) {
      let switchAfterDefeat = false
      if (this.$store.getters.getUserHp <= 0) {
        switchAfterDefeat = true
      }
      this.$store.dispatch('setUserHp', this.teamUser[teamMemberIndex][1].hp)
      this.teamUserCurrentMember = teamMemberIndex
      this.turn++
      this.battleLogMessage.push('Turn ' + this.turn)
      this.battleLogMessage.push("Let's go, " + this.teamUser[this.teamUserCurrentMember][1].nickname + "!")
      document.getElementById('hpBarUser').style.width = this.$store.getters.getUserHp / this.teamUser[this.teamUserCurrentMember][2].baseStats.hp * 100 + '%'
      //ход соперника после смены игрока
      if (!switchAfterDefeat) {
        this.enemyAttack(this.enemyChooseAttack())
        if (this.$store.getters.getUserHp <= 0) {
          this.wixDefeated('user')
        }
      }

    },
    healTeamUserWix() {
      for (let i = 0; i < this.teamUser.length; i++) {
        if (this.teamUser[i].busy === "true") {
          this.teamUser[i][1].hp = this.wixHpToRegenAfterBattle[i]
          delete this.teamUser[i].status
        }
      }
    },
    runFromBattle() {
      this.healTeamUserWix()
      this.$emit('runFromBattle')
    },
    async getEnemyTeamFromDex() {
      for (let i = 0; i < this.teamEnemy.length; i++) {
        await get(child(this.db, `wixlings/wix` + this.teamEnemy[i].DexId))
            .then((snapshot) => {
              if (snapshot.exists()) {
                this.teamEnemy[i]['wixInfo'] = snapshot.val();
                this.teamEnemy[i]['hp'] = this.teamEnemy[i].wixInfo.baseStats.hp
                this.teamEnemy[i]['itsTurn'] = 1
                this.teamsLoaded = true
              }
            })
      }
      this.$store.dispatch('setEnemyHp', this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp)
    },
    attackInBattleLoading() {
      //получение списка ВСЕХ существующих атак
      this.attackList = this.$store.getters.getAttackList
      //сборка атак игрока
      //Обращаемся к каждому виксу, смотрим на каждую атаку в каждой линии. Если найдена неизученная атака,
      // то цикл прерывается и происходит переход на следующую линию. Если первая атака на линии не изучена, то слот
      //атаки остаётся пустым.
      for (let teamMemberNumber = 0; teamMemberNumber < 3; teamMemberNumber++) {
        if (this.teamUser[teamMemberNumber].busy === 'true') {
          this.teamUser[teamMemberNumber].attacks = [
            {busy: false}, {busy: false}, {busy: false}
          ]
          for (let currentLine = 0; currentLine < 3; currentLine++) {
            //превращение линий в атаках в массив для возможности обращения
            this.teamUser[teamMemberNumber][1].learnedAttack = Object.values(this.teamUser[teamMemberNumber][1].learnedAttack)
            this.teamUser[teamMemberNumber][2].mayAttackId = Object.values(this.teamUser[teamMemberNumber][2].mayAttackId)
            for (let currentAttack = 0; currentAttack < 4; currentAttack++) {
              //превращение атак в массив для возможности обращения
              this.teamUser[teamMemberNumber][1].learnedAttack[currentLine] = Object.values(this.teamUser[teamMemberNumber][1].learnedAttack[currentLine])
              this.teamUser[teamMemberNumber][2].mayAttackId[currentLine] = Object.values(this.teamUser[teamMemberNumber][2].mayAttackId[currentLine])
              //Если атака изучена, то мы пробегаемся по всем атакам и приписываем её данной атаке
              if (this.teamUser[teamMemberNumber][1].learnedAttack[currentLine][currentAttack].learned === true) {
                for (let i = 0; i < this.attackList.length; i++) {
                  if (this.teamUser[teamMemberNumber][2].mayAttackId[currentLine][currentAttack].id === this.attackList[i].id) {
                    //определение, какой цвет применить к атаке
                    this.teamUser[teamMemberNumber].attacks[currentLine] = {
                      attackInfo: this.attackList[i],
                      busy: true
                    }
                    switch (this.attackList[i].type) {
                      case('none'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#d0d0d0'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#000000'
                        break;
                      case('void'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#1c1c2f'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#ffffff'
                        break;
                      case('water'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#3893bf'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#ffffff'
                        break;
                      case('fire'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#be4747'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#ffffff'
                        break;
                      case('grass'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#518c4b'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#ffffff'
                        break;
                      case('ancient'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#584a40'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#ffffff'
                        break;
                      case('mystic'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#db98de'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#140c40'
                        break;
                      case('electric'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#d4d36d'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#292932'
                        break;
                      case('toxic'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#64329b'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#ffffff'
                        break;
                      case('mecha'):
                        this.teamUser[teamMemberNumber].attacks[currentLine].backColor = '#686f77'
                        this.teamUser[teamMemberNumber].attacks[currentLine].fontColor = '#292932'
                        break;

                    }
                  }
                }
              }
            }
          }
        }
      }
      //сборка атак соперника
      for (let teamMemberNumber = 0; teamMemberNumber < this.teamEnemy.length; teamMemberNumber++) {
        this.teamEnemy[teamMemberNumber].attacks = Object.values(this.teamEnemy[teamMemberNumber].attacks)
        for (let enemyAttackIndex = 0; enemyAttackIndex < this.teamEnemy[teamMemberNumber].attacks.length; enemyAttackIndex++) {
          for (let attackInListId = 0; attackInListId < this.attackList.length; attackInListId++) {
            if (this.teamEnemy[teamMemberNumber].attacks[enemyAttackIndex].attackId === this.attackList[attackInListId].id) {
              this.teamEnemy[teamMemberNumber].attacks[enemyAttackIndex]['attackInfo'] = this.attackList[attackInListId]
            }
          }
        }

      }
      this.attacksLoaded = true
    },
    battleLogic(chosenAttack) {
      this.turn++;
      this.battleLogMessage.push('Turn ' + this.turn)
      if (this.turnEnded) {
        this.turnEnded = false
        let firstAttack;
        let secondAttack;
        this.performStatus()
        //если игрок быстрее соперника
        if (this.teamUser[this.teamUserCurrentMember][2].baseStats.speed > this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed) {
          firstAttack = chosenAttack
          secondAttack = this.enemyChooseAttack()
          if (!this.checkParalysis('user')) {
            this.userAttack(firstAttack)
          }
          if (this.$store.getters.getEnemyHp > 0) {
            if (!this.checkParalysis('enemy')) {
              this.enemyAttack(secondAttack)
            }
            if (this.$store.getters.getUserHp <= 0) {
              this.wixDefeated('user')
            }
          } else {
            console.log(2)
            this.wixDefeated('enemy')
          }
        }
        //если соперник быстрее игрока или одной скорости с ним
        else {
          firstAttack = this.enemyChooseAttack()
          secondAttack = chosenAttack
          if (!this.checkParalysis('enemy')) {
            this.enemyAttack(firstAttack)
          }
          if (this.$store.getters.getUserHp > 0) {
            //атака игрока
            if (!this.checkParalysis('user')) {
              this.userAttack(secondAttack)
            }
            if (this.$store.getters.getEnemyHp <= 0) {
              this.wixDefeated('enemy')
            }
          } else {
            this.wixDefeated('user')
          }
        }
        this.turnEnded = true
      }
    },
    async enemyAttack(attack) {
      let damage = Math.floor(this.countDamage(attack, 'enemy'))
      if (damage > this.$store.getters.getUserHp) {
        damage = this.$store.getters.getUserHp
      }
      this.damageInfo.enemyDamage = damage
      // document.getElementById('wix2Image').style.marginLeft = -90 + '%'
      // await setTimeout(() => document.getElementById('wix2Image').style.marginLeft = 0 + '%', 1000)
      this.$store.dispatch('setUserHp', this.teamUser[this.teamUserCurrentMember][1].hp - this.damageInfo.enemyDamage)
      this.teamUser[this.teamUserCurrentMember][1].hp = this.teamUser[this.teamUserCurrentMember][1].hp - this.damageInfo.enemyDamage
      //уменьшение строки здоровья игрока
      document.getElementById('hpBarUser').style.width = this.$store.getters.getUserHp / this.teamUser[this.teamUserCurrentMember][2].baseStats.hp * 100 + '%'
    },
    async userAttack(attack) {
      let damage = Math.floor(this.countDamage(attack, 'user', attack.attackInfo.accuracy))
      if (damage > this.$store.getters.getEnemyHp) {
        damage = this.$store.getters.getEnemyHp
      }
      this.damageInfo.userDamage = damage
      //анимация викса
      // document.getElementById('wix1Image').style.marginLeft = 90 + '%'
      // await setTimeout(() => document.getElementById('wix1Image').style.marginLeft = 0 + '%', 1000)
      //уменьшение здоровья соперника
      this.$store.dispatch('setEnemyHp', this.teamEnemy[this.teamEnemyCurrentMember].hp - this.damageInfo.userDamage)
      this.teamEnemy[this.teamEnemyCurrentMember].hp = this.teamEnemy[this.teamEnemyCurrentMember].hp - this.damageInfo.userDamage
      document.getElementById('hpBarEnemy').style.width = this.$store.getters.getEnemyHp / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp * 100 + '%'
    },
    enemyChooseAttack() {
      //Если это первый ход викса соперника, то он предпочтёт изменить статы, чьи бы они ни были.
      //В дальнейшем он предпочтёт использовать атаки, наносящие урон, так что не будет ошибки, что соперник весь бой только усиляется и не наносит урона
      let countedEffectivenessArr = [];
      for (let i = 0; i < this.teamEnemy[this.teamEnemyCurrentMember].attacks.length; i++) {
        if (this.teamEnemy[this.teamEnemyCurrentMember].attacks[i].busy === true) {
          if (this.teamEnemy[this.teamEnemyCurrentMember].itsTurn === 1) {
            if (this.teamEnemy[this.teamEnemyCurrentMember].attacks[i].attackInfo.bonusName === 'statChange') {
              this.teamEnemy[this.teamEnemyCurrentMember].itsTurn++
              return this.teamEnemy[this.teamEnemyCurrentMember].attacks[i]
            }
            if (this.teamEnemy[this.teamEnemyCurrentMember].attacks[i].attackInfo.bonusName === 'specialAttack') {
              if (['Parasite Seed'].includes(this.teamEnemy[this.teamEnemyCurrentMember].attacks[i].attackInfo.name)) {
                this.teamEnemy[this.teamEnemyCurrentMember].itsTurn++
                return this.teamEnemy[this.teamEnemyCurrentMember].attacks[i]
              }
            }
          }
          if (this.teamEnemy[this.teamEnemyCurrentMember].attacks[i].attackInfo.power > 0 &&
              //атаки, запрещённые для использования соперником после первого хода
              !(['Parasite Seed'].includes(this.teamEnemy[this.teamEnemyCurrentMember].attacks[i].attackInfo.name))
          ) {
            ['Parasite Seed'].includes(this.teamEnemy[this.teamEnemyCurrentMember].attacks[i].attackInfo.name)
            countedEffectivenessArr[i] = this.countTypeEffectiveness(this.teamEnemy[this.teamEnemyCurrentMember].attacks[i], this.teamUser[this.teamUserCurrentMember][2].type1, this.teamUser[this.teamUserCurrentMember][2].type2)
          } else {
            countedEffectivenessArr[i] = 0
          }
        }
      }
      let maxEffectiveness = Math.max.apply(null, countedEffectivenessArr)
      let bestAttackIndex = 0
      for (let i = 0; i < countedEffectivenessArr.length; i++) {
        if (countedEffectivenessArr[i] === maxEffectiveness) {
          bestAttackIndex = i;
        }
      }
      this.teamEnemy[this.teamEnemyCurrentMember].itsTurn++
      return this.teamEnemy[this.teamEnemyCurrentMember].attacks[bestAttackIndex]
    },
    countDamage(attack, side, accuracy) {
      if (side === 'user') {
        this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' used ' + attack.attackInfo.name)
        if (this.rollChance() < accuracy) {
          this.countedEffectiveness = this.countTypeEffectiveness(attack, this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.type1, this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.type2)
          if (this.countedEffectiveness > 1) {
            this.battleLogMessage.push('Super effective!')
          }
          if (this.countedEffectiveness < 1) {
            this.battleLogMessage.push('Not effective...')
          }
          if (this.countedEffectiveness === 0) {
            this.battleLogMessage.push('Nothing happened')
          }
          this.attackAnalysisCentre(attack, side)
          return (attack.attackInfo.power * this.criticalHit('user') * this.countedEffectiveness * this.teamUser[this.teamUserCurrentMember][2].baseStats.attack / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense)
        } else {
          this.battleLogMessage.push('And it missed')
          return 0
        }
      }
      if (side === 'enemy') {
        this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' used ' + attack.attackInfo.name)
        this.countedEffectiveness = this.countTypeEffectiveness(attack, this.teamUser[this.teamUserCurrentMember][2].type1, this.teamUser[this.teamUserCurrentMember][2].type2)
        if (this.countedEffectiveness > 1) {
          this.battleLogMessage.push('Super effective!')
        }
        if (this.countedEffectiveness < 1) {
          this.battleLogMessage.push('Not effective...')
        }
        if (this.countedEffectiveness === 0) {
          this.battleLogMessage.push('Nothing happened')
        }
        this.attackAnalysisCentre(attack, side)
        return (attack.attackInfo.power * this.criticalHit('enemy') * this.countedEffectiveness * this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack / this.teamUser[this.teamUserCurrentMember][2].baseStats.defense)
      }
    },
    countTypeEffectiveness(attack, enemyType1, enemyType2) {
      let damageModifier = 1;
      //проверка суперэфеективности
      let strongToTable = Object.entries(this.typeEffectiveness.strongTo)
      for (let i = 0; i < strongToTable.length; i++) {
        if (attack.attackInfo.type === strongToTable[i][0]) {
          for (let verifiableTypeIndex = 0; verifiableTypeIndex < strongToTable[i].length; verifiableTypeIndex++) {
            if (strongToTable[i][1][verifiableTypeIndex] === enemyType1) {
              damageModifier = damageModifier * 2
            }
            if (strongToTable[i][1][verifiableTypeIndex] === enemyType2) {
              damageModifier = damageModifier * 2
            }
          }

        }
      }
      //проверка неэффективности
      let ineffectiveTo = Object.entries(this.typeEffectiveness.ineffectiveTo)
      for (let i = 0; i < ineffectiveTo.length; i++) {
        if (attack.attackInfo.type === ineffectiveTo[i][0]) {
          for (let verifiableTypeIndex = 0; verifiableTypeIndex < ineffectiveTo[i].length; verifiableTypeIndex++) {
            if (ineffectiveTo[i][1][verifiableTypeIndex] === enemyType1) {
              damageModifier = damageModifier / 2
            }
            if (ineffectiveTo[i][1][verifiableTypeIndex] === enemyType2) {
              damageModifier = damageModifier / 2
            }
          }

        }
      }
      //проверка иммунитета
      let immuneTable = Object.entries(this.typeEffectiveness.senselessly)
      for (let i = 0; i < immuneTable.length; i++) {
        if (attack.attackInfo.type === immuneTable[i][0]) {
          for (let verifiableTypeIndex = 0; verifiableTypeIndex < immuneTable[i].length; verifiableTypeIndex++) {
            if (immuneTable[i][1][verifiableTypeIndex] === enemyType1) {
              damageModifier = 0
            }
            if (immuneTable[i][1][verifiableTypeIndex] === enemyType2) {
              damageModifier = 0
            }
          }
        }
      }
      return damageModifier;
    },
    criticalHit(side) {
      let critChance = 97;
      if (side === 'user') {
        critChance = critChance - critChance * this.addCritChance
      }
      let randomNumber = this.rollChance()
      if (randomNumber > critChance) {
        this.battleLogMessage.push('CRITICAL HIT')
        return 2
      } else {
        return 1
      }
    },
    rollChance() {
      let min = 1
      let max = 101
      return Math.floor(Math.random() * (max - min)) + min;
    },
    async wixDefeated(side) {
      let newEssence = 1
      let newMoney = 1
      switch (side) {
        case 'user':
          if (this.$store.getters.getCharacter.essence > 0) {
            if (this.teamUser[this.teamUserCurrentMember][2].essenceInside > this.$store.getters.getCharacter.essence) {
              newEssence = 0
            } else {
              newEssence = this.$store.getters.getCharacter.essence - this.teamUser[this.teamUserCurrentMember][2].essenceInside
            }
          }
          this.$store.dispatch('setCharacterEssence', newEssence)
          this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' defeated')
          if (!this.checkUserHasAliveWix()) {
            this.battleEnded = true
            let moneyLost = this.$store.getters.getCharacter.money * 0.05
            newMoney = this.$store.getters.getCharacter.money - moneyLost
            this.$store.dispatch('setCharacterMoney', newMoney)
            this.battleLogMessage.push('You defeated \n Lost money ' + moneyLost + 'ฟ')
          }
          break;
        case 'enemy':
          console.log('Викс повержен')
          newEssence = this.$store.getters.getCharacter.essence + this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.essenceInside
          this.$store.dispatch('setCharacterEssence', newEssence)
          if (!this.checkEnemyHasAliveWix()) {
            this.battleEnded = true
            newMoney = this.$store.getters.getCharacter.money + this.$store.getters.getEnemy.moneyForWin
            this.$store.dispatch('setCharacterMoney', newMoney)
            const db = getDatabase();
            //Если побеждена Хексана
            if (this.$store.getters.getEnemy.name === 'Hexana') {
              if (!Object.prototype.hasOwnProperty.call(this.$store.getters.getCharacter, 'gameEnded')) {
                this.finishMessage = 'Oh, you really beat her. Congratulations! Thank you for your attention to this demo. This version shows only the basic functions. I hope this project will become something more :3'
              }
              await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id + '/characterData/character' +
                  localStorage.activeCharacter), {
                gameEnded: true
              })
            }
            //Если побеждён Викулюс
            if (this.$store.getters.getEnemy.name === 'Viculus') {
              await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id + '/characterData/character' +
                  localStorage.activeCharacter), {
                atherOpened: true
              })
            }
            this.battleLogMessage.push('Opponent defeated\n You earn ' + this.$store.getters.getEnemy.moneyForWin + 'ฟ')
          } else {
            console.log('Викс повержен')
            this.teamEnemyCurrentMember++
            this.$store.dispatch('setEnemyHp', this.teamEnemy[this.teamEnemyCurrentMember].hp)
            this.battleLogMessage.push("Opponent changed to " + this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name)
            document.getElementById('hpBarEnemy').style.width = this.$store.getters.getEnemyHp / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp * 100 + '%'
          }
          this.$store.dispatch('setCharacter')
          break;
      }
    },
    enemyChangeWix() {
      return 1;
    },
    checkEnemyHasAliveWix() {
      for (let i = 0; i < this.teamEnemy.length; i++) {
        if (this.teamEnemy[i].hp > 0) {
          return true
        }
      }
      return false
    },
    checkUserHasAliveWix() {
      for (let i = 0; i < this.teamUser.length; i++) {
        if (this.teamUser[i].busy === 'true') {
          if (this.teamUser[i][1].hp > 0) {
            return true
          }
        }
      }
      return false
    },
    loadUserTeam() {
      this.teamUser = this.$store.getters.getUserTeam
      for (let i = 0; i < this.teamUser.length; i++) {
        if (this.teamUser[i].busy === "true") {
          this.wixHpToRegenAfterBattle[i] = this.teamUser[i][1].hp
        }
      }
      this.$store.dispatch('setUserHp', this.teamUser[this.teamUserCurrentMember][1].hp)
      this.teamUserCurrentMember = 0;
    },
    async loadImplants() {
      //загрузка имплантов игрока
      for (let teamUserMember = 0; teamUserMember < this.teamUser.length; teamUserMember++) {
        if (this.teamUser[teamUserMember].busy === 'true') {
          this.teamUser[teamUserMember][1].implantsId = Object.values(this.teamUser[teamUserMember][1].implantsId)
          for (let implantNumber = 0; implantNumber < this.teamUser[teamUserMember][1].implantsId.length; implantNumber++) {
            //нахождение информации об импланте, что он делает
            if (this.teamUser[teamUserMember][1].implantsId[implantNumber].busy === "true") {
              await get(child(this.db, `allItems/item` + this.teamUser[teamUserMember][1].implantsId[implantNumber].implantId))
                  .then((snapshot) => {
                    if (snapshot.exists()) {
                      this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo = snapshot.val();
                    }
                  })
              //активация имплантов
              switch (this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.bonusType) {
                  //включение имплант-атаки
                case ('implantAttack'):
                  switch (this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.title) {
                    case('CyberJaw'):
                      this.teamUser[teamUserMember].attacks[3] =
                          {
                            attackInfo: {
                              name: "Poison Bite",
                              type: "toxic",
                              power: 25,
                              statusName: "poisoning",
                              statusChance: 30,
                              accuracy: 100,
                              bonusName: "status",
                              description: "Wix's venomous Furious bite can poison an opponent",
                              id: 2,
                            },
                            busy: true
                          }
                      break;
                    case('Eye Laser'):
                      this.teamUser[teamUserMember].attacks[3] =
                          {
                            attackInfo: {
                              name: "Laser",
                              type: "electric",
                              power: 40,
                              accuracy: 80,
                              bonusName: "",
                              description: "Emitting a powerful striking beam",
                              id: 51,
                            },
                            busy: true
                          }
                      break;
                  }
                  break;
                  //изменение стат викса
                case('statBoost'):
                  switch (this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.statType) {
                    case('attack'):
                      this.teamUser[teamUserMember][2].baseStats.attack = this.teamUser[teamUserMember][2].baseStats.attack + this.teamUser[teamUserMember][2].baseStats.attack / this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.statBoostPercent
                      break;
                    case('defense'):
                      this.teamUser[teamUserMember][2].baseStats.defense = this.teamUser[teamUserMember][2].baseStats.defense + this.teamUser[teamUserMember][2].baseStats.defense / this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.statBoostPercent
                      break;
                    case('speed'):
                      this.teamUser[teamUserMember][2].baseStats.speed = this.teamUser[teamUserMember][2].baseStats.speed + this.teamUser[teamUserMember][2].baseStats.speed / this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.statBoostPercent
                      break;
                    case('hp'):
                      this.teamUser[teamUserMember][2].baseStats.hp = this.teamUser[teamUserMember][2].baseStats.hp + this.teamUser[teamUserMember][2].baseStats.hp / this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.statBoostPercent
                      break;
                  }
                  break;
                case('attackBoost'):
                  switch (this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.boostType) {
                    case('accuracy'): {
                      this.addAccuracy = this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.boostAmount
                      break;
                    }
                    case('critChance'): {
                      this.addCritChance = this.teamUser[teamUserMember][1].implantsId[implantNumber].implantInfo.boostAmount
                      break;
                    }
                  }
                  break;
              }
            }
          }
        }
      }
    },
    attackAnalysisCentre(attack, side) {
      switch (attack.attackInfo.bonusName) {
        case('statChange'):
          this.performStatChange(attack, side)
          break;
        case('specialAttack'):
          this.performSpecialAttack(attack, side)
          break;
        case('status'):
          if (this.rollChance() < attack.attackInfo.statusChance) {
            if (side === 'user') {
              if (!Object.prototype.hasOwnProperty.call(this.teamEnemy[this.teamEnemyCurrentMember], 'status')) {
                switch (attack.attackInfo.statusName) {
                  case('ignition'):
                    this.teamEnemy[this.teamEnemyCurrentMember].status = 'Burn'
                    this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is set on fire')
                    break;
                  case('poisoning'):
                    this.teamEnemy[this.teamEnemyCurrentMember].status = 'Poison'
                    this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is poisoned')
                    break;
                  case('paralysis'):
                    this.teamEnemy[this.teamEnemyCurrentMember].status = 'Paralysis'
                    this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is paralyzed')
                    break;
                }
              }
            }
            if (side === 'enemy') {
              if (!Object.prototype.hasOwnProperty.call(this.teamUser[this.teamUserCurrentMember], 'status')) {
                switch (attack.attackInfo.statusName) {
                  case('ignition'):
                    this.teamUser[this.teamUserCurrentMember].status = 'Burn'
                    this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is set on fire')
                    break;
                  case('poisoning'):
                    this.teamUser[this.teamUserCurrentMember].status = 'Poison'
                    this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is poisoned')
                    break;
                  case('paralysis'):
                    this.teamUser[this.teamUserCurrentMember].status = 'Paralysis'
                    this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is paralyzed')
                    break;
                }
              }
            }
          }
          break;
      }
    },
    performSpecialAttack(attack, side) {
      if (side === 'user') {
        let newUserHp = 1;
        let absorbed = 0;
        switch (attack.attackInfo.name) {
          case('Pack Bite'):
            this.damageInfo.userDamage = attack.attackInfo.power * this.teamUser.length
            break;
          case('Tongue Wrapping'):
            this.teamEnemy[this.teamEnemyCurrentMember].hideStatus = 'Wrapped'
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is wrapped')
            break;
          case('Devouring'):
            if (this.teamUser[this.teamUserCurrentMember][2].baseStats.attack / 1.8 > this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense) {
              //насыщаем викса игрока
              newUserHp = this.teamUser[this.teamUserCurrentMember][1].hp + this.teamEnemy[this.teamEnemyCurrentMember].hp
              this.teamUser[this.teamUserCurrentMember][1].hp = newUserHp
              this.$store.dispatch('setUserHp', newUserHp)
              //сжираем соперника
              this.teamEnemy[this.teamEnemyCurrentMember].hp = 0;
              this.$store.dispatch('setEnemyHp', 0)
              document.getElementById('hpBarEnemy').style.width = this.$store.getters.getEnemyHp / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp * 100 + '%'
              this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' devoured ' + this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name)
            } else {
              newUserHp = this.teamUser[this.teamUserCurrentMember][1].hp / 2
              this.teamUser[this.teamUserCurrentMember][1].hp = newUserHp
              this.$store.dispatch('setUserHp', newUserHp)
            }
            break;
          case('Pinwheel'):
            this.teamUser[this.teamUserCurrentMember].hideStatus = 'Transformed'
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is transformed!')
            break;
          case('Shark Power'):
            this.teamUser[this.teamUserCurrentMember].hideStatus = 'Mad'
            this.teamUser[this.teamUserCurrentMember][2].baseStats.attack = this.teamUser[this.teamUserCurrentMember][2].baseStats.attack * 1.5
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is getting mad!')
            break;
          case('Absorb'):
            absorbed = Math.floor(attack.attackInfo.power * this.teamUser[this.teamUserCurrentMember][2].baseStats.attack / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense * 0.3)
            newUserHp = this.$store.getters.getUserHp + absorbed
            this.teamUser[this.teamUserCurrentMember][1].hp = newUserHp
            this.$store.dispatch('setUserHp', newUserHp)
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' absorbed ' + absorbed + ' HP')
            break;
          case('Biting Root'):
            absorbed = Math.floor(attack.attackInfo.power * this.teamUser[this.teamUserCurrentMember][2].baseStats.attack / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense * 0.4)
            newUserHp = this.$store.getters.getUserHp + absorbed
            this.teamUser[this.teamUserCurrentMember][1].hp = newUserHp
            this.$store.dispatch('setUserHp', newUserHp)
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' absorbed ' + absorbed + ' HP')
            break;
          case('Parasite Seed'):
            this.teamEnemy[this.teamEnemyCurrentMember].hideStatus = 'Seeded'
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is seeded')
            break;
          case('Burrow'):
            break;
          case('Shell Broke'):
            this.teamUser[this.teamUserCurrentMember][2].baseStats.defense = this.teamUser[this.teamUserCurrentMember][2].baseStats.defense * 0.5
            this.teamUser[this.teamUserCurrentMember][2].baseStats.speed = this.teamUser[this.teamUserCurrentMember][2].baseStats.speed + 60
            break;
          case('Short Circuit'):
            newUserHp = this.$store.getters.getUserHp - this.$store.getters.getUserHp * 0.1
            this.teamEnemy[this.teamEnemyCurrentMember].status = 'Paralysis'
            this.teamUser[this.teamUserCurrentMember][1].hp = newUserHp
            this.$store.dispatch('setUserHp', newUserHp)
            break;
          case('Reflection'):
            break;
          case('Amnesia'):
            break;
          case('?'):
            break;
        }
      }
      if (side === 'enemy') {
        let newEnemyHp = 1;
        let absorbed = 0;
        switch (attack.attackInfo.name) {
          case('Pack Bite'):
            attack.attackInfo.power = attack.attackInfo.power * this.teamUser.length
            break;
          case('Tongue Wrapping'):
            this.teamUser[this.teamUserCurrentMember].hideStatus = 'Wrapped'
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is wrapped')
            break;
          case('Devouring'):
            if (this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack / 1.8 > this.teamUser[this.teamUserCurrentMember][2].baseStats.defense) {
              //насыщаем викса соперника
              newEnemyHp = this.teamEnemy[this.teamEnemyCurrentMember].hp + this.teamUser[this.teamUserCurrentMember].hp
              this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
              this.$store.dispatch('setEnemyHp', newEnemyHp)
              //сжираем игрока
              this.teamEnemy[this.teamEnemyCurrentMember].hp = 0;
              this.$store.dispatch('setEnemyHp', 0)
              document.getElementById('hpBarUser').style.width = 0 + '%'
              this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' devoured ' + this.teamUser[this.teamUserCurrentMember][1].nickname)
            } else {
              newEnemyHp = this.teamEnemy[this.teamEnemyCurrentMember].hp / 2
              this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
              this.$store.dispatch('setEnemyHp', newEnemyHp)
            }
            break;
          case('Pinwheel'):
            this.teamEnemy[this.teamEnemyCurrentMember].hideStatus = 'Transformed'
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is transformed!')
            break;
          case('Shark Power'):
            this.teamEnemy[this.teamEnemyCurrentMember].hideStatus = 'Mad'
            this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack = this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack * 1.5
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is getting mad!')
            break;
          case('Absorb'):
            absorbed = Math.floor(attack.attackInfo.power * this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack / this.teamUser[this.teamUserCurrentMember][2].baseStats.defense * 0.15)
            newEnemyHp = this.$store.getters.getEnemyHp + absorbed
            this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
            this.$store.dispatch('setEnemyHp', newEnemyHp)
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' absorbed ' + absorbed + ' HP')
            break;
          case('Biting Root'):
            absorbed = Math.floor(attack.attackInfo.power * this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack / this.teamUser[this.teamUserCurrentMember][2].baseStats.defense * 0.3)
            newEnemyHp = this.$store.getters.getEnemyHp + absorbed
            this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
            this.$store.dispatch('setEnemyHp', newEnemyHp)
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' absorbed ' + absorbed + ' HP')
            break;
          case('Parasite Seed'):
            this.teamUser[this.teamUserCurrentMember].hideStatus = 'Seeded'
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is seeded')
            break;
          case('Burrow'):
            break;
          case('Shell Broke'):
            this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense = this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense * 0.5
            this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed = this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed + 60
            break;
          case('Short Circuit'):
            newEnemyHp = this.$store.getters.getEnemyHp - this.$store.getters.getEnemyHp * 0.1
            this.teamUser[this.teamUserCurrentMember].status = 'Paralysis'
            this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
            this.$store.dispatch('setEnemyHp', newEnemyHp)
            break;
          case('Reflection'):
            break;
          case('Amnesia'):
            break;
          case('?'):
            break;
        }
      }
    },
    performStatChange(attack, side) {
      let userStats = this.teamUser[this.teamUserCurrentMember][2].baseStats
      let enemyStats = this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats
      if (this.rollChance() < attack.attackInfo.statChange.changeChance) {
        if (side === 'user') {
          switch (attack.attackInfo.statChange.objective) {
            case ('self'):
              switch (attack.attackInfo.statChange.changeType) {
                case('increase'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      if (this.teamUser[this.teamUserCurrentMember][2].baseStats.attack < 400) {
                        this.teamUser[this.teamUserCurrentMember][2].baseStats.attack = userStats.attack + userStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      }
                      this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + 's' + attack.attackInfo.statChange.changeStat1 + ' ' + attack.attackInfo.statChange.changeType + 'd')
                      break;
                    case('defense'):
                      if (this.teamUser[this.teamUserCurrentMember][2].baseStats.defense < 400) {
                        this.teamUser[this.teamUserCurrentMember][2].baseStats.defense = userStats.defense + userStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      }
                      this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + 's' + attack.attackInfo.statChange.changeStat1 + ' ' + attack.attackInfo.statChange.changeType + 'd')
                      break;
                    case('speed'):
                      if (this.teamUser[this.teamUserCurrentMember][2].baseStats.speed < 400) {
                        this.teamUser[this.teamUserCurrentMember][2].baseStats.speed = userStats.speed + userStats.speed * (attack.attackInfo.statChange.changePercent / 100)

                      }
                      this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + 's' + attack.attackInfo.statChange.changeStat1 + ' ' + attack.attackInfo.statChange.changeType + 'd')

                      break;
                  }
                  break;
                case('decrease'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.attack = userStats.attack - userStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + 's' + attack.attackInfo.statChange.changeStat1 + ' ' + attack.attackInfo.statChange.changeType + 'd')

                      break;
                    case('defense'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.defense = userStats.defense - userStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + 's' + attack.attackInfo.statChange.changeStat1 + ' ' + attack.attackInfo.statChange.changeType + 'd')

                      break;
                    case('speed'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.speed = userStats.speed - userStats.speed * (attack.attackInfo.statChange.changePercent / 100)
                      this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + 's' + attack.attackInfo.statChange.changeStat1 + ' ' + attack.attackInfo.statChange.changeType + 'd')
                      break;
                  }
                  break;
              }
              break;
            case('opposite'):
              switch (attack.attackInfo.statChange.changeType) {
                case('increase'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack = enemyStats.attack + enemyStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('defense'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense = enemyStats.defense + enemyStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('speed'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed = enemyStats.speed + enemyStats.speed * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                  }
                  break;
                case('decrease'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack = enemyStats.attack - enemyStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('defense'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense = enemyStats.defense - enemyStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('speed'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed = enemyStats.speed - enemyStats.speed * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                  }
                  break;
              }
              break;
          }
        }
        if (side === 'enemy') {
          switch (attack.attackInfo.statChange.objective) {
            case ('self'):
              switch (attack.attackInfo.statChange.changeType) {
                case('increase'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack = enemyStats.attack + enemyStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('defense'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense = enemyStats.defense + enemyStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('speed'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed = enemyStats.speed + enemyStats.speed * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                  }
                  break;
                case('decrease'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.attack = enemyStats.attack - enemyStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('defense'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.defense = enemyStats.defense - enemyStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('speed'):
                      this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed = enemyStats.speed - enemyStats.speed * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                  }
                  break;
              }
              break;
            case ('opposite'):
              switch (attack.attackInfo.statChange.changeType) {
                case('increase'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.attack = userStats.attack + userStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('defense'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.defense = userStats.defense + userStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('speed'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.speed = userStats.speed + userStats.speed * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                  }
                  break;
                case('decrease'):
                  switch (attack.attackInfo.statChange.changeStat1) {
                    case('attack'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.attack = userStats.attack - userStats.attack * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('defense'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.defense = userStats.defense - userStats.defense * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                    case('speed'):
                      this.teamUser[this.teamUserCurrentMember][2].baseStats.speed = userStats.speed - userStats.speed * (attack.attackInfo.statChange.changePercent / 100)
                      break;
                  }
                  break;
              }
              break;
          }
        }
      }
    },
    performStatus() {
      let absorbed = 0
      //статус игрока
      if (Object.prototype.hasOwnProperty.call(this.teamUser[this.teamUserCurrentMember], 'status') && (this.$store.getters.getUserHp > 0)) {
        let newUserHp = this.$store.getters.getUserHp
        switch (this.teamUser[this.teamUserCurrentMember].status) {
          case('Poison'):
            newUserHp = Math.floor(newUserHp - newUserHp * 0.17)
            this.teamUser[this.teamUserCurrentMember].hp = newUserHp
            this.$store.dispatch('setUserHp', newUserHp)
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is hurt by poison')
            document.getElementById('hpBarUser').style.width = this.$store.getters.getUserHp / this.teamUser[this.teamUserCurrentMember][2].baseStats.hp * 100 + '%'
            break;
          case('Burn'):
            newUserHp = Math.floor(newUserHp - newUserHp * 0.125)
            this.teamUser[this.teamUserCurrentMember].hp = newUserHp
            this.$store.dispatch('setUserHp', newUserHp)
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + ' is hurt by fire')
            document.getElementById('hpBarUser').style.width = this.$store.getters.getUserHp / this.teamUser[this.teamUserCurrentMember][2].baseStats.hp * 100 + '%'
            break;
        }
      }
      //статус соперника
      let newEnemyHp = this.$store.getters.getEnemyHp
      if (Object.prototype.hasOwnProperty.call(this.teamEnemy[this.teamEnemyCurrentMember], 'status') && (this.$store.getters.getEnemyHp > 0)) {
        switch (this.teamEnemy[this.teamEnemyCurrentMember].status) {
          case('Poison'):
            newEnemyHp = Math.floor(newEnemyHp - newEnemyHp * 0.125)
            this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
            this.$store.dispatch('setEnemyHp', newEnemyHp)
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is hurt by poison')
            document.getElementById('hpBarEnemy').style.width = this.$store.getters.getEnemyHp / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp * 100 + '%'
            break;
          case('Burn'):
            newEnemyHp = Math.floor(newEnemyHp - newEnemyHp * 0.125)
            this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
            this.$store.dispatch('setEnemyHp', newEnemyHp)
            this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember].wixInfo.name + ' is hurt by fire')
            document.getElementById('hpBarEnemy').style.width = this.$store.getters.getEnemyHp / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp * 100 + '%'
            break;
        }
      }
      if (Object.prototype.hasOwnProperty.call(this.teamEnemy[this.teamEnemyCurrentMember], 'hideStatus') && (this.$store.getters.getEnemyHp > 0)) {
        switch (this.teamEnemy[this.teamEnemyCurrentMember].hideStatus) {
          case('Wrapped'):
            newEnemyHp = Math.floor(newEnemyHp - newEnemyHp * 0.1)
            this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
            this.$store.dispatch('setEnemyHp', newEnemyHp)
            this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed = this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.speed * 0.9
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is hurt by tongue')
            document.getElementById('hpBarEnemy').style.width = this.$store.getters.getEnemyHp / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp * 100 + '%'
            break;
          case('Seeded'):
            newEnemyHp = Math.floor(newEnemyHp - newEnemyHp * 0.2)
            absorbed = Math.floor(newEnemyHp * 0.1)
            this.teamEnemy[this.teamEnemyCurrentMember].hp = newEnemyHp
            this.$store.dispatch('setEnemyHp', newEnemyHp)
            //лечим игрока
            // this.teamUser[this.teamUserCurrentMember][1].hp =this.teamUser[this.teamUserCurrentMember][1].hp + absorbed
            // this.$store.dispatch('setEnemyHp',  this.teamUser[this.teamUserCurrentMember][1].hp)
            this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + ' is hurt by parasite seed and ' + this.teamUser[this.teamUserCurrentMember][1].nickname + ' absorbed ' + absorbed + ' HP')
            document.getElementById('hpBarEnemy').style.width = this.$store.getters.getEnemyHp / this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.baseStats.hp * 100 + '%'
            break;
          default:
            break;
        }
      }
    },
    checkParalysis(side) {
      if (side === 'user') {
        if (this.teamUser[this.teamUserCurrentMember].status === 'Paralysis' && (this.rollChance() < 25)) {
          this.battleLogMessage.push(this.teamUser[this.teamUserCurrentMember][1].nickname + " can't move because of paralysis")
          return true
        }
      }
      if (side === 'enemy') {
        if (this.teamEnemy[this.teamEnemyCurrentMember].status === 'Paralysis' && (this.rollChance() < 25)) {
          this.battleLogMessage.push(this.teamEnemy[this.teamEnemyCurrentMember].wixInfo.name + " can't move because of paralysis")
          return true
        }
      }
      return false
    }
  }
  ,
  mounted() {
    //включение команды игрока
    this.loadUserTeam()
    //включение команды соперника
    this.teamEnemy = Object.values(this.$store.getters.getEnemy.team)
    this.getEnemyTeamFromDex()
    //прогрузка атак
    this.attackInBattleLoading()
    this.loadImplants()
  }
  ,
  watch:
      {
        battleLogMessage: function () {
          let battleLog = document.querySelector('#battleLogList')
          battleLog.scrollTop = battleLog.scrollHeight - battleLog.clientHeight
        }
        ,
      }
}
</script>

<style scoped>
#battleLog {
  background-color: #8a90c1;
  width: 35%;
  height: 70px;
  border-radius: 0 0 10px 10px;
  transition: height 1s ease;
}

#congratulations {
  position: absolute;
  z-index: 15;
  width: 200px;
  padding: 20px;
  margin-top: 20px;
  margin-left: 25%;
  border-radius: 10px;
  outline: #2c3e50 solid 3px;
  background-color: #fff5b2;
}

#battleLogList {
  height: 100%;
  overflow-y: scroll;
}

.battleLogMessage {
  margin-top: 5px;
  width: 90%;
  margin-left: 5%;
  border-bottom: 3px solid #2c3e50;
}

.arrowButton {
  width: 30%;
  margin-left: 35%;
  background-color: #8a90c1;
  border-radius: 0 0 10px 10px;
  color: #2c3e50;
  font-size: 20px;
}

.arrowButton:hover {
  cursor: pointer;
}

#wix1 > div > img {
  transform: scale(-1, 1);
}

img {
  bottom: 0;
}

#battleWindow {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

#field {
  display: flex;
  flex-direction: row;
  height: 85%;
  justify-content: space-between;
}

.wixImg {
  bottom: 0;
  margin-top: 20px;
}

#wix1 {
  margin-left: 30px;
  width: 40%;
}

#wix2 {
  margin-right: 30px;
  width: 40%;
}

#wix1Image {
  transition: margin-left 2s ease;
}

#wix2Image {
  transition: margin-left 2s ease;

}

.name {
  width: 90%;
  height: 20px;
  background-color: #2c3e50;
  color: white;
  margin-bottom: 5px;
  margin-top: 10px;
  border-radius: 10px 10px 0 0;
}

.HP {
  width: 90%;
  height: 20px;
  background-color: #1b2732;
  border-radius: 0 0 10px 10px;
}

#hpBarUser {
  width: 100%;
  height: 20px;
  background-color: #42b983;
  transition: width 2s ease;
  border-radius: 0 0 10px 10px;
}

#hpBarEnemy {
  width: 100%;
  height: 20px;
  background-color: #42b983;
  transition: width 2s ease;
  border-radius: 0 0 10px 10px;
}

.captionInHpBar {
  position: absolute;
  margin-left: 20px;
}

#wix2 > .name {
  float: right;
}

#wix2 > .HP {
  float: right;
}

.statusEffect {
  position: absolute;
  margin-left: 10px;
  margin-top: 50px;
}

#wix1 > .statusEffect {
  margin-top: 10px;
  margin-left: -10px;
}

.statusEffect > div > img {
  width: 50px;
  height: 50px;
}

#attackBlock {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  height: 10%;
  background-color: rgba(98, 98, 104, 0);
  /*background-color: #34343B;*/
}

.attack {
  width: 150px;
  height: 30px;
  padding-top: 10px;
  background-color: #777B98;
  margin-right: 10px;
  border-radius: 10px;
}

.attack:hover {
  outline: solid 5px aqua;
  cursor: pointer;
}

/*всплывающие окна*/
#attack1 > .modalInfo {
  visibility: hidden;
}

#attack1 > span {
  visibility: visible
}

#attack1:hover > .modalInfo {
  visibility: visible
}

#attack2 > .modalInfo {
  visibility: hidden;
}

#attack2 > span {
  visibility: visible
}

#attack2:hover > .modalInfo {
  visibility: visible
}

#attack3 > .modalInfo {
  visibility: hidden;
}

#attack3 > span {
  visibility: visible
}

#attack3:hover > .modalInfo {
  visibility: visible
}

#attack4 > .modalInfo {
  visibility: hidden;
}

#attack4 > span {
  visibility: visible
}

#attack4:hover > .modalInfo {
  visibility: visible
}

.modalInfo {
  border-radius: 10px;
  position: absolute;
  background-color: #8a90c1;
  width: 200px;
  height: 100px;
  bottom: 20%;
}

#endBattleMessage {
  position: absolute;
  background-color: #8a90c1;
  width: 250px;
  height: 100px;
  font-size: 25px;
  border-radius: 15px;
  z-index: 15;
  padding-top: 30px;
}

#leaveFromBattle {
  font-size: 15px;
  border-radius: 10px;
  color: white;
  background-color: #2c3e50;
  width: 80%;
  margin-left: 10% ;
  height: 50px;
  margin-top: 10px;
}

#leaveFromBattle:hover {
  outline: solid 1px aqua;
  cursor: pointer;
}

#changeTeam {
  position: absolute;
  z-index: 101;
  background-color: #8a90c1;
  width: 30px;
  height: 80px;
  border-radius: 0 10px 10px 0;
  float: right;
  margin-top: 15%;
}

.changeTeamIconItem:hover {
  cursor: pointer;
  background-color: #fdfdfd;
}

#changeTeamIcon {
  display: flex;
  flex-direction: column;
}

.changeTeamIconItem {
  margin-left: 5px;
  width: 20px;
  height: 20px;
  margin-top: 5px;
  background-color: #2c3e50;
  border-radius: 5px;
}
</style>