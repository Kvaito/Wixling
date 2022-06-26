<template>
<div id="Container">
  <div class="flexElem">{{user.nickname}}</div>
  <div class="flexElem">
    <img id="characterImage" src="https://i.pinimg.com/736x/e6/e3/3d/e6e33dda4f48925cd9a3666889539b1a.jpg">
  </div>
  <div class="flexElem"><router-link to="/game"><button id="continueButton">Продолжить</button></router-link></div>
  <div class="flexElem"><button id="changeCharacterButton">Сменить персонажа</button></div>
</div>
</template>

<script>
import { getDatabase, ref,child, get } from "firebase/database";

export default {
  name: "CharacterMainPage",
  data() {
    return {
      user:{
        nickname:'',
      }
    }
  },
  methods: {


    },
  mounted() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/user1`))
          .then((snapshot) => {
        if (snapshot.exists()) {
          this.user=snapshot.val();
        }
        else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
        });
  }
}


</script>

<style scoped>
  #Container
  {
    width: 300px;
    height: 80%;
    background-color: rgba(144,148,217,0.61);
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
    .flexElem
    {
      margin-top: 20px;
      margin-left: 0;
    }
  #characterImage
  {
    justify-content: stretch;
    width: 90%;
    height: 100%;
  }
  #continueButton
  {
    width: 250px;
    height: 50px;
    background-color: #42b983;
  }
</style>