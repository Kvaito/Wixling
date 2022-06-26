<template>
  <div id="wixUpgradeWindow" class="window">
    <div id="upgradableThings">
      <div id="iconAndImplants" v-if="implantsLoaded">
        <div style="background-color: #2c3e50;border-radius: 15px;width: 80px;height: 80px">
          <img :src="require(`../../../public/assets/Icons/WixIcons/`+wix.dexInfo.name +`Icon.png`)">
        </div>
        <div v-for="implant in implantList" v-bind:key="implant.id">
          <div v-on:click="checkImplant(implant,'busy')" class="implantItem" v-if="implant.busy==='true'">
            <img class="implantIcon"
                 :src="require(`../../../public/assets/Icons/ImplantIcons/`+implant.implantInfo.title +`Icon.png`)">
          </div>
          <div class="implantItem" v-if="implant.busy==='false'" v-on:click="checkImplant(implant,'empty')">
          </div>
        </div>
        <div>
          <ImplantManage @closeImplantWindow="implantChecked=false" v-if="implantChecked" v-bind:slotDesc="slotDesc"
                         v-bind:implant="currentImplant" v-bind:wix="wix"></ImplantManage>
        </div>
      </div>
      <div v-if="!attacksLoaded">
        Attacks are loading
      </div>
      <div id="attacksAndEvolve" v-if="attacksLoaded">
<!--        Список атак-->
        <div style="display: flex;flex-direction: row">
          <div id="evolveButton" v-on:click="evolveWix">Evolution</div>
          <wixEvolving v-if="evolveWindow" v-bind:wix="wix" v-bind:db="db"></wixEvolving>
          <div>Team Slots:</div>
          <div class="teamSlotActive" v-on:click="takeOffInTeam(1)" v-if="team[0].busy==='true'">1</div>
          <div class="teamSlotEmpty" v-on:click="setInTeam(1)" v-if="team[0].busy==='false'">1</div>

          <div class="teamSlotActive" v-on:click="takeOffInTeam(2)" v-if="team[1].busy==='true'">2</div>
          <div class="teamSlotEmpty" v-on:click="setInTeam(2)" v-if="team[1].busy==='false'">2</div>

          <div class="teamSlotActive" v-on:click="takeOffInTeam(3)" v-if="team[2].busy==='true'">3</div>
          <div class="teamSlotEmpty" v-on:click="setInTeam(3)" v-if="team[2].busy==='false'">3</div>
        </div>
        <div v-for="(line,index) in attackList" v-bind:key="index">
          <div class="attackLine">
            <div v-for="(attack,index) in line" v-bind:key="index">
              <div class="attackItem"
                   :style="{backgroundColor:attack.attackInfo.backColor,color:attack.attackInfo.fontColor}"
                   v-if="attack.attackInfo.busy"
                   v-on:click="checkAttack(attack)">
                <div v-if="attack.attackInfo.learned">
                  <div>{{ attack.attackInfo.name }}</div>
                </div>
                 <div v-if="!attack.attackInfo.learned" style="filter: brightness(60%)">
                  <div>{{ attack.attackInfo.name }}</div>
                   <div>Stage: {{ attack.attackInfo.stage }}</div>
                </div>
              </div>
              <div v-if="!attack.attackInfo.busy" style="width: 70px;margin: 5px">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<!--    Информация об атаке-->
    <div id="attackInfo" v-if="attackChecked&&attacksLoaded">
      <div :style="{backgroundColor:currentAttack.attackInfo.backColor,color:currentAttack.attackInfo.fontColor}"
           style="display: flex;flex-direction: row;margin: 20px;background-color: #b9bddb;border-radius: 10px;">
        <div>
          <div class="attackInfoMessage" id="learnButton" v-if="!currentAttack.attackInfo.learned&&currentAttack.attackInfo.stage<=wix.dexInfo.stage" v-on:click="learnAttack">Learn</div>
        </div>
        <div v-if="!currentAttack.attackInfo.learned&&!(currentAttack.attackInfo.stage<=wix.dexInfo.stage)" class="attackInfoMessage">
          <div>The Wix stage is too low</div>
        </div>
        <div v-if="currentAttack.attackInfo.learned" class="attackInfoMessage">
          <div>Learned</div>
          <div id="forgetButton" v-on:click="forgetAttack()">Forget</div>
        </div>
        <div class="attackInfoDesc">
          ID {{ currentAttack.attackInfo.id }} -
          {{ currentAttack.attackInfo.name }}<br>
          {{ currentAttack.attackInfo.type }}<br>
          Power {{ currentAttack.attackInfo.power }}
          Accuracy {{ currentAttack.attackInfo.accuracy }}<br>
          {{ currentAttack.attackInfo.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ImplantManage from "./implantManage";
import wixEvolving from "@/components/InteractWindow/wixEvolving";
import {child, get, getDatabase, ref, set, update} from "firebase/database";

export default {
  components: {ImplantManage,wixEvolving},
  props: ['wix', 'db'],
  name: "wixUpgrade",
  data() {
    return {
      implantList: [],
      attackList: [],
      learnedList:[],
      implantsLoaded: false,
      attacksLoaded: false,
      attackChecked: false,
      currentAttack: '',
      implantChecked: false,
      currentImplant: '',
      color: 'red',
      newNickname: '',
      slotDesc: 'empty',
      team: [],
      isFirstUpload:true,
      evolveWindow:false,
    }
  },
  methods: {
    async loadImplant(isUpdate) {
      if(!isUpdate)
      {
        this.implantList = Object.values(this.wix.implantsId)
      }
      for (let i = 0; i < this.implantList.length; i++) {
        await get(child(this.db, `allItems/item` + this.implantList[i].implantId))
            .then((snapshot) => {
              if (snapshot.exists()) {
                this.implantList[i]['implantInfo'] = snapshot.val();
              }
            })
      }
      this.implantsLoaded = !this.implantsLoaded
    },
    async forgetAttack(){
      const db = getDatabase();
      await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id + '/characterData/character' +
          localStorage.activeCharacter + '/caughtWixling/wixInSafe_' + this.wix.id + '/learnedAttack/line'+this.currentAttack.attackInfo.line+'/attack'+this.currentAttack.attackInfo.attackSlot), {
        learned:false
      })
      this.$store.dispatch('setCharacter')
    },
    async loadAttacks() {
      let wixAttackList = Object.values(this.wix.dexInfo.mayAttackId)
      //преобразование массива изученных атак викса
      this.learnedList=Object.values (this.wix.learnedAttack)
      for(let i=0;i<3;i++)
      {
        this.learnedList[i]=Object.values(this.learnedList[i])
      }
      //распаковка по линиям и связывание данных об атаке с атакой конкретного викса
      for (let i = 0; i < 3; i++) {
        wixAttackList[i] = Object.values(wixAttackList[i])
        this.attackList[i] = []
        for (let j = 0; j < 4; j++) {
          this.attackList[i][j] = {}
          if (wixAttackList[i][j].busy === 'true') {
            await get(child(this.db, `attacks/attack` + wixAttackList[i][j].id))
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    this.attackList[i][j].attackInfo = snapshot.val();
                    this.attackList[i][j].attackInfo.busy = true
                    this.attackList[i][j].attackInfo.learned=this.learnedList[i][j].learned
                    this.attackList[i][j].attackInfo.stage=wixAttackList[i][j].stage
                    //сохранение линии и позиции атаки на линии
                    this.attackList[i][j].attackInfo.line=i+1
                    this.attackList[i][j].attackInfo.attackSlot=j+1
                    //определение, какой цвет применить к атаке
                    switch (this.attackList[i][j].attackInfo.type) {
                      case('none'):
                        this.attackList[i][j].attackInfo.backColor = '#d0d0d0'
                        this.attackList[i][j].attackInfo.fontColor = '#000000'
                        break;
                      case('void'):
                        this.attackList[i][j].attackInfo.backColor = '#1c1c2f'
                        this.attackList[i][j].attackInfo.fontColor = '#ffffff'
                        break;
                      case('water'):
                        this.attackList[i][j].attackInfo.backColor = '#3893bf'
                        this.attackList[i][j].attackInfo.fontColor = '#ffffff'
                        break;
                      case('fire'):
                        this.attackList[i][j].attackInfo.backColor = '#be4747'
                        this.attackList[i][j].attackInfo.fontColor = '#ffffff'
                        break;
                      case('grass'):
                        this.attackList[i][j].attackInfo.backColor = '#518c4b'
                        this.attackList[i][j].attackInfo.fontColor = '#ffffff'
                        break;
                      case('ancient'):
                        this.attackList[i][j].attackInfo.backColor = '#584a40'
                        this.attackList[i][j].attackInfo.fontColor = '#ffffff'
                        break;
                      case('mystic'):
                        this.attackList[i][j].attackInfo.backColor = '#db98de'
                        this.attackList[i][j].attackInfo.fontColor = '#140c40'
                        break;
                      case('electric'):
                        this.attackList[i][j].attackInfo.backColor = '#d4d36d'
                        this.attackList[i][j].attackInfo.fontColor = '#292932'
                        break;
                      case('toxic'):
                        this.attackList[i][j].attackInfo.backColor = '#64329b'
                        this.attackList[i][j].attackInfo.fontColor = '#ffffff'
                        break;
                      case('mecha'):
                        this.attackList[i][j].attackInfo.backColor = '#686f77'
                        this.attackList[i][j].attackInfo.fontColor = '#000000'
                        break;

                    }
                  }
                })
          } else {
            this.attackList[i][j]['attackInfo'] = {
              busy: false
            }
          }
        }
      }
      this.attacksLoaded = !this.attacksLoaded
    },
    checkImplant(implant, slotDesc) {
      this.slotDesc = slotDesc
      this.currentImplant = implant
      this.implantChecked = !this.implantChecked
    },
    checkAttack(attack) {
      this.attackChecked = true;
      this.currentAttack = attack
    },
    async setInTeam(teamSlot) {
      const db = getDatabase();
      await set(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id + '/characterData/character' +
          localStorage.activeCharacter + '/teamWixling/' + teamSlot + '_MemberIdInSafe'), {
        id: this.wix.id,
        busy: 'true',
      })
      this.$store.dispatch('setCharacter')
    },
    async takeOffInTeam(teamSlot) {
      const db = getDatabase();
      await set(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id + '/characterData/character' +
          localStorage.activeCharacter + '/teamWixling/' + teamSlot + '_MemberIdInSafe'), {
        id: 0,
        busy: 'false',
      })
      this.$store.dispatch('setCharacter')
    },
    async learnAttack(){
      const db = getDatabase();
      await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id + '/characterData/character' +
          localStorage.activeCharacter + '/caughtWixling/wixInSafe_' + this.wix.id + '/learnedAttack/line'+this.currentAttack.attackInfo.line+'/attack'+this.currentAttack.attackInfo.attackSlot), {
        learned:true
      })
      //снятие эссенции с баланса игрока
      let newEssence=this.$store.getters.getCharacter.essence-100
      this.$store.dispatch('setCharacterEssence',newEssence)
      this.$store.dispatch('setCharacter')
    },
    async evolveWix(){
      this.evolveWindow=!this.evolveWindow
    }
  },
  mounted() {
    //для обновления имплантов и списка атак
    // this.$store.subscribe((mutation) => {
    //   let allWixling = Object.values(this.$store.getters.getCharacter.caughtWixling)
    //   this.team = Object.values(this.$store.getters.getCharacter.teamWixling)
    //   switch (mutation.type) {
    //     case 'setCharacter':
    //       //отключение модулей
    //       this.attacksLoaded = false
    //       this.implantsLoaded = false
    //         this.loadAttacks()
    //       //подключение
    //       for (let i = 0; i < allWixling.length; i++) {
    //         if (this.wix.id === allWixling[i].id) {
    //           this.implantList = allWixling[i].implantsId
    //           this.loadImplant(true)
    //         }
    //       }
    //       this.isFirstUpload=false
    //       break;
    //   }
    // })
    if(!this.attacksLoaded&&!this.implantsLoaded)
    {
      this.team = Object.values(this.$store.getters.getCharacter.teamWixling)
      this.loadAttacks()
      this.loadImplant(false)
    }
  }
}
</script>

<style scoped>
#wixUpgradeWindow {
  padding-top: 20px;
  margin-left: 103%;
  width: 450px;
  height: 470px;
  position: absolute;
  background-color: #777B98;
  top: 0;
  z-index: 12;
  border-radius: 10px;
  outline: 3px solid #2c3e50;
}

#iconAndImplants {
  width: 100px;
  margin-left: 20px;

}

#upgradableThings {
  display: flex;
  flex-direction: row;
}

#essenceBar {
  background-color: #2c3e50;
  width: 150px;
  height: 30px;
  border-radius: 10px;
}

.implantIcon {
  width: 100%;
  height: 100%;
}

.implantItem {
  margin-top: 10px;
  background-color: #2c3e50;
  border-radius: 15px;
  width: 50px;
  height: 50px;
}

.implantItem:hover {
  background-color: #5fd4f8;
  cursor: pointer;
}
/*Атаки*/
.attackLine {
  display: flex;
  flex-direction: row;
}

.attackItem {
  width: 70px;
  height: 70px;
  background-color: #b9bddb;
  border-radius: 10px;
  margin: 5px;
}

.attackItem:hover {
  cursor: pointer;
  outline: 3px solid aqua;
}

#evolveButton {
  background-color: #2c3e50;
  border-radius: 10px;
  color: white;
  width: 80px;
  margin-right: 10px;
}

#evolveButton:hover {
  cursor: pointer;
  background-color: #5fd4f8;
}
/*Слоты команды*/
.teamSlotEmpty {
  width: 30px;
  height: 30px;
  background-color: #2c3e50;
  margin-right: 5px;
  border-radius: 20px;
  color: white;
}

.teamSlotEmpty:hover {
  color: black;
  background-color: #8a90c1;
  cursor: pointer;
  outline: 1px solid #2c3e50;
}

.teamSlotActive {
  width: 30px;
  height: 30px;
  margin-right: 5px;
  border-radius: 20px;
  color: #000000;
  background-color: aqua;
}

.teamSlotActive:hover {
  cursor: pointer;
  background-color: #cf2d2d;
}
/*Информация об атаке*/
#learnButton
{
width: 120px;
  height: 40px;
  border-radius: 10px;
  background-color: #ffffff;
  outline: 1px solid black;
  color: black;
  margin-left: 20px;
}
#learnButton:hover{
  cursor: pointer;
  background-color: #b9bddb;
}
.attackInfoMessage
{
  margin-left: 20px;
  width: 35%;
  margin-top: 20px;
  /*float: left;*/
}
.attackInfoDesc
{
  width: 70%;
  margin-left: 30px;
}
#forgetButton
{
  width: 120px;
  height: 30px;
  margin-top: 10px;
  border-radius: 10px;
  background-color: #ffffff;
  outline: 1px solid black;
  color: black;
}
#forgetButton:hover{
  cursor: pointer;
  background-color: #b9bddb;
}
</style>