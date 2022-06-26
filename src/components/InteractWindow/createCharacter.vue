<template>
<div id="createForm">
  <div class="closeWindow" v-on:click="closeWindow">x</div>
  <form>
    <span style="font-size: 20px" class="boldText">Create character</span><br>
      <label><span class="boldText">Nickname</span><br><input id="nicknameInput" type="text" v-model="nickname" name="nickname"></label><br>
    <label><span class="boldText">Look</span><br></label>
<!--    Слайдер-->
    <div class="slideshow-container">
      <div class="mySlides fade">
        <img src="../../../public/assets/CharCustomize/Skin1.png">
      </div>
      <div class="mySlides fade">
        <img src="../../../public/assets/CharCustomize/Skin2.png">
      </div>
      <div class="mySlides fade">
        <img src="../../../public/assets/CharCustomize/Skin3.png">
      </div>
      <a class="prev" v-on:click="plusSlides(-1)">&#10094;</a>
      <a class="next" v-on:click="plusSlides(1)">&#10095;</a>
    </div>
    <br>
    <div style="text-align:center">
      <span class="dot" v-on:click="currentSlide(1)"></span>
      <span class="dot" v-on:click="currentSlide(2)"></span>
      <span class="dot" v-on:click="currentSlide(3)"></span>
    </div>
<!--   Конец слайдера-->
    <div v-on:click="createCharacterFunc" class="windowButton" id="letsGoButton">Let's GO!</div>
  </form>
</div>
</template>

<script>
import {child, get, getDatabase, ref} from "firebase/database";

export default {
  props:['charSlot'],
name: "createCharacter",
  data(){
  return{
    id:'',
    nickname:'',
    lastId:'',
    slideIndex:1,
    sex:''
  }
  },
  methods:{
    closeWindow(){
        this.$emit('closeWindow')
    },
  async createCharacterFunc(){
         //получение последнего пользователя
            const dbRef = ref(getDatabase());
          await get(child(dbRef, `users`))
          .then((snapshot) => {
          if (snapshot.exists()) {
          let users=snapshot.val();
          let lastUser = users[ Object.keys(users).sort().pop()];
          this.lastId=lastUser.personData.id
            this.id=this.lastId*3+this.charSlot
            console.log(this.id)
        }})
        const characterData = {
              id:this.id,
              nickname: this.nickname,
              look:this.slideIndex,
              charSlot:this.charSlot,
              sex:this.sex,
            };
            await this.$store.dispatch("createCharacter", characterData)
            .then(window.location.replace('/'))
  },
      plusSlides(n) {
        this.showSlides(this.slideIndex += n);
      },

      currentSlide(n) {
        this.showSlides(this.slideIndex = n);
      },

      showSlides(n) {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        let dots = document.getElementsByClassName("dot");
        if (n > slides.length) {this.slideIndex = 1}
        if (n < 1) {this.slideIndex = slides.length}
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[this.slideIndex-1].style.display = "block";
        dots[this.slideIndex-1].className += " active";
      }
  },
  mounted() {
    this.showSlides(this.slideIndex)
  }
}
</script>

<style scoped>
#nicknameInput
{
  border-radius: 10px;
}
   #createForm
  {
     border-radius: 10px;
     position: absolute;
    margin-left: 35%;
    margin-top: 30px;
    width: 300px;
    height: 500px;
    background-color:rgba(215,216,229,0.2);
  }
   #letsGoButton
   {
   background-color: #2c3e50;
     color: white;
     border-radius: 10px;
     height: 25px;
   }
   #letsGoButton:hover{
     outline: 3px solid aqua;
   }
   * {box-sizing: border-box}
      body {
      font-family: Verdana, sans-serif;
      margin:0}
      .mySlides {display: none}
      img {vertical-align: middle;}
      .slideshow-container {
      max-width: 1000px;
      position: relative;
      margin: auto;
      }
      /* Кнопки next & previous*/
      .prev, .next {
      cursor: pointer;
      position: absolute;
      top: 40%;
      width: auto;
      padding: 16px;
      margin-top: -22px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 0 3px 3px 0;
      user-select: none;
      }
      .prev{
        left:0;
        border-radius: 3px 0 0 3px;
      }
      /* Измените положение "next button" */
      .next {
      right: 0;
      border-radius: 3px 0 0 3px;
      }
      /* Добавьте черный фоновый цвет с небольшой прозрачностью*/
      .prev:hover, .next:hover {
      background-color: rgba(0,0,0,0.8);
      }
      /* Точки/маркеры/указатели */
      .dot {
      cursor: pointer;
      height: 15px;
      width: 15px;
      margin: 0 2px;
      background-color: #999999;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.6s ease;
      }
      .active, .dot:hover {
      background-color: #111111;
      }
      /* Для маленьких экранов увеличьте размер текста */
      @media only screen and (max-width: 300px) {
      .prev, .next,.text {font-size: 11px}
      }
</style>