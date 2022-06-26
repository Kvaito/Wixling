<template>
  <div class="home">
<!--    <div v-if="checkingUser" v-on:click="checkUser" id="stepOnMe">-->
<!--      Нажми на меня, чтобы снова авторизоваться-->
<!--    </div>-->
<!--    <img alt="Vue logo" src="../assets/logo.png">-->
      <nav>
        <div v-if="userAuthenticated" class="navButton"><router-link to="/" style="text-decoration: none; color:white"> {{user.personData.nickname}}</router-link> </div>
        <div v-if="!userAuthenticated" class="navButton" v-on:click="authorizationWindowOn">Sign in</div>
        <div v-if="!userAuthenticated" class="navButton" v-on:click="registerWindowOn">Sign up</div>
        <div v-if="userAuthenticated" class="navButton" v-on:click="logout"> Exit </div>
        <div class="navButton">News</div>
      </nav>
    <createCharacter v-if="createCharacterOn" v-bind:charSlot="chosenSlot" @characterCreated="createCharacterOn=false;
    characterSlotsWindow=true;" @closeWindow="createCharacterOn=false;
    characterSlotsWindow=true;"></createCharacter>
    <div  v-if="userAuthenticated">
      <div id="slots" v-if="characterSlotsWindow">
        <div class="characterSlot" id="slot1">
        <characterSlot v-bind:character="user.characterData.character1" v-bind:slotActive="1"
        @createCharacter="createCharacterWindow(1)"></characterSlot></div>
      <div class="characterSlot" id="slot2">
        <characterSlot v-bind:character="user.characterData.character2" v-bind:slotActive="2"
        @createCharacter="createCharacterWindow(2)"></characterSlot></div>
      <div class="characterSlot" id="slot3">
        <characterSlot v-bind:character="user.characterData.character3" v-bind:slotActive="3"
        @createCharacter="createCharacterWindow(3)"></characterSlot></div>
      </div>
    </div>
    <Authorization v-if="authorizationWindow" @userSignedIn="authenticateUser"></Authorization>
    <Registration v-if="registerWindow"></Registration>
    <News v-if="!userAuthenticated&&NewsOpen"></News>
  </div>
</template>
<script>
// @ is an alias to /src
import Registration from "@/components/InteractWindow/Registration";
import Authorization from "@/components/InteractWindow/Authorization";
import characterSlot from "@/components/InteractWindow/characterSlot";
import createCharacter from "@/components/InteractWindow/createCharacter";
import News from "@/components/News";
import {child, get, getDatabase, ref} from "firebase/database";
export default {
  name: 'Home',
  components: {
    Registration,Authorization,characterSlot,createCharacter,News
  },
  data(){
    return{
      user:'',
      allUsers:'',
      checkingUser:true,
      registerWindow:false,
      createCharacterOn:false,
      characterSlotsWindow:true,
      chosenSlot:'',
      authorizationWindow:false,
      signInWindow:false,
      userAuthenticated:false,
      NewsOpen:true,
    }
  },
  methods:{
    closeAllWindows(){
      this.registerWindow=false;
      this.createCharacterOn=false;
      this.authorizationWindow=false;
      this.signInWindow=false;
      this.characterSlotsWindow=false;
      this.NewsOpen=false
    },
    createCharacterWindow(charSlot)
    {
      this.closeAllWindows()
      this.createCharacterOn=!this.createCharacterOn
      this.chosenSlot=charSlot
    },
    registerWindowOn(){
      this.closeAllWindows()
      this.registerWindow=!this.registerWindow
    },
    authorizationWindowOn(){
      this.closeAllWindows()
      this.authorizationWindow=!this.authorizationWindow
    },
    logout(){
      localStorage.currentUser='';
      window.location.href = "/";
    },
    authenticateUser(){
      this.authorizationWindow=!this.authorizationWindow;
      this.userAuthenticated=!this.userAuthenticated;
      console.log(this.$store.getters.getCurrentUser)
      this.user=this.$store.getters.getCurrentUser;
      this.characterSlotsWindow=true;
    },
    async checkUser(){
      if(localStorage.currentUser!=='')
    {
      //получение пользователя по никнэйму
       const dbRef = ref(getDatabase());
         await get(child(dbRef, `users`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.allUsers = snapshot.val();
            }
          })
      this.allUsers=Object.values(this.allUsers)
      for(let item of this.allUsers) {
          if(item.personData.nickname===localStorage.currentUser)
          {
            this.user=item;
            await this.$store.dispatch('setCurrentUser',item)
            this.userAuthenticated=!this.userAuthenticated;
            break;
          }
      }
    }
      this.checkingUser=!this.checkingUser
  },
}

}
</script>

<style>
  nav{
    display: flex;
    flex-direction: row;
  }
  .navButton
  {
    background-color:rgba(215,216,229,0.2);
    color:white;
    width: 120px;
    height: 30px;
    margin-left: 20px;
  }
  .navButton:hover{
    cursor: pointer;
  }
  #slots
  {
    margin-top: 20px;
    display: flex;
    flex-direction: row;
  }
  .characterSlot
  {
    border-radius: 10px;
    width: 300px;
    height: 500px;
    margin-left: 20px;
    background-color:rgba(215,216,229,0.2);
  }
  #stepOnMe
  {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color:rgba(215,216,229,0.8);
  }
  .windowButton
  {
    margin-left:35%;
    height: 20px;
    width: 100px;
    background-color: rgb(144, 147, 190);
  }
  .windowButton:hover
  {
    cursor: pointer;
    background-color: rgb(192, 194, 231);
  }
</style>
