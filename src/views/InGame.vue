<template>
<div>
    <div v-if="checkingUser" v-on:click="checkUser" id="stepOnMe">
      Нажми на меня, чтобы снова авторизоваться
    </div>
  <nav id="navInGame">
    <div class="navButton" v-on:click="profileOpen=!profileOpen;" id="profileButton"><a>Character</a></div>
    <router-link to="/" style="text-decoration: none; color:black"><div class="navButton">
      <a>Home Page</a></div></router-link>
    <div class="navButton" v-on:click="settingsOpen=!settingsOpen" id="settingsButton" style="background-color: #2c3e50;color: #5f6279"><a>Achievements</a></div>
     <div class="navButton" v-on:click="libraryOpen=!libraryOpen" id="dexButton"><a>Dex</a></div>
  </nav>
  <div>
    <div id="profileBlock">
      <ProfileInfo v-if="profileOpen&&!checkingUser"
                 v-bind:character="character" v-bind:absMargin="getProfButtonMargin" @wixManageOpened="wixManageWindow=!wixManageWindow"></ProfileInfo>
    </div>
    <Settings v-if="settingsOpen&&!checkingUser"></Settings>
    <Dex v-if="libraryOpen&&!checkingUser"
                 v-bind:character="character" v-bind:absMargin="getDexButtonMargin" v-bind:db="db"></Dex>
    <yourWixManage v-if="wixManageWindow&&profileOpen"
     v-bind:absMargin="getWixManageMargin" v-bind:db="db" @closeWindow="wixManageWindow=!wixManageWindow"></yourWixManage>
  </div>
  <main id="workarea">
    <div id="gamePlatform">
      <GamePlatform v-if="!checkingUser" v-bind:db="db"></GamePlatform>
    </div>
    <div id="teamAndInventory">
        <WixTeam v-if="!checkingUser" v-bind:db="db" v-bind:character="character"></WixTeam>
        <WixInventory v-if="!checkingUser" v-bind:db="db" v-bind:character="character"></WixInventory>
    </div>
  </main>
</div>
</template>

<script>
import WixInventory from "@/components/WixInventory";
import WixTeam from "@/components/WixTeam";
import GamePlatform from "@/components/GamePlatform/GamePlatform";
import ProfileInfo from "@/components/InteractWindow/ProfileInfo";
import Settings from "@/components/InteractWindow/Settings";
import Dex from "@/components/InteractWindow/Dex";
import yourWixManage from "@/components/InteractWindow/yourWixManage";
import {child, get, getDatabase, ref} from "firebase/database";
export default {
name: "InGame",
  components: {GamePlatform, WixTeam, WixInventory,ProfileInfo,Settings,Dex,yourWixManage},
  data(){
  return{
    profileOpen:false,
    settingsOpen:false,
    libraryOpen:false,
    db:'',
    user:'',
    character:'',
    checkingUser:true,
    wixManageWindow:false,
    attackList:''
  }
  },
  methods: {
    async checkUser() {
      if (localStorage.currentUser !== '') {
        //получение пользователя по никнэйму
        const dbRef = ref(getDatabase());
        await get(child(dbRef, `users`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                this.allUsers = snapshot.val();
              }
            })
        this.allUsers = Object.values(this.allUsers)
        for (let item of this.allUsers) {
          if (item.personData.nickname === localStorage.currentUser) {
            this.user = item;
            await this.$store.dispatch('setCurrentUser', item)
            this.userAuthenticated = !this.userAuthenticated;
            break;
          }
        }
      }
      this.checkingUser = !this.checkingUser
      this.db = ref(getDatabase());
      this.user = this.$store.getters.getCurrentUser;

      switch (localStorage.activeCharacter) {
        case "1":
          this.character = this.user.characterData.character1
          break;
        case "2":
          this.character = this.user.characterData.character2
          break;
        case "3":
          this.character = this.user.characterData.character3
          break;
        default:
          break;
      }
      this.$store.dispatch('setCharacter')
    },
    async attackListLoading() {
      await get(child(this.db, `attacks`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.attackList = snapshot.val();
              this.$store.dispatch('setAttackList', this.attackList)
            }
          })
    }
  },
  mounted() {
  //загрузка персонажа
  this.user=this.$store.getters.getCurrentUser;
  if(this.user){
     switch (localStorage.activeCharacter){
    case "1":
      this.character = this.user.characterData.character1
      break;
    case "2":
      this.character = this.user.characterData.character2
      break;
    case "3":
      this.character = this.user.characterData.character3
      break;
    default:
      break;
  }
  this.$store.dispatch('setCharacter')
    this.checkingUser=false;
  }
  else{
    this.checkingUser=true;
  }
  //вызов сохранения декса
    this.$store.dispatch('setDex')
  //сохранение базы данных
  this.db = ref(getDatabase());
  //загрузка атак
  this.attackListLoading()
  },
  computed:{
  getProfButtonMargin:function (){
    return document.getElementById('profileButton').getBoundingClientRect().x
  },
    getDexButtonMargin:function (){
    return document.getElementById('dexButton').getBoundingClientRect().right
    },
    getWixManageMargin:function (){
    return document.getElementById('profileButton').getBoundingClientRect().x
    }
  }
}
</script>

<style scoped>
#navInGame
{
    width: 100%;
    height: 7vh;
    background-color: #777B98;
    display: flex;
  padding-top: 10px;
  flex-direction: row;
  justify-content: space-around;
}
  .navButton
  {
    background-color: #2c3e50;
    color:white;
    width: 120px;
    height: 30px;
  }
#workarea
{
    display: flex;
    flex-direction: row;
    margin: 30px;
  height: 80vh;
}
#gamePlatform
{
  margin-right: 20px;
  width: 75%;
}

#teamAndInventory
{
  width: 25%;
}
#teamAndInventory>div:nth-child(2)
{
  margin-top: 4%;
}
  #stepOnMe
  {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color:rgba(215,216,229,0.8);
    z-index: 100;
  }
  .window
  {
    border-radius: 5px;
    outline: 3px solid #2c3e50;
  }
</style>