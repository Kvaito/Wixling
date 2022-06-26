<template>
  <div class="window" id="implantTrading">
    <div id="titleDiv"><b>Implant Trading</b></div>
    <div class="closeWindow" v-on:click="closeWindow">x</div>
    <div style="display: flex;
  flex-direction: row;">
      <div id="itemShowcase" v-if="itemsLoaded">
        <div class="slideshow-container">
          <div v-for="(shelf,index) in shelves" v-bind:key="index">
            <div class="mySlides fade">
              <div class="shelf">
                <div v-for="item in shelf" v-bind:key="item.id">
                  <div class="item" v-on:click="checkItem(item)">
                    <img class="implantIcon"
                         :src="require(`../../../../public/assets/Icons/ImplantIcons/`+item.title+`Icon.png`)">
                  </div>
                </div>
              </div>
            </div>
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
      </div>
      <div id="itemInfo" v-if="itemsLoaded">
        <div><img :src="require(`../../../../public/assets/Icons/ImplantIcons/`+itemChecked.title+`Icon.png`)"
                  alt="itemIcon"
                  class="itemIcon"></div>
        <div style="background-color: #8a90c1;border-radius: 10px">
          <div id="itemName" style="margin-top: 10px">{{ itemChecked.title }}</div>
          <div id="itemDescription" style="margin-top: 10px">{{ itemChecked.description }}
          </div>
          <div style="margin-top: 10px">Бонус: {{ itemChecked.bonusDesc }}</div>
          <div style="margin-top: 10px">{{ itemChecked.price }} ฟ</div>
        </div>
        <div class="buyButton" v-on:click="buyItem(itemChecked)">Buy</div>
        <div>{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {child, get} from "firebase/database";

export default {
  name: "ImplantTrading",
  props: ['db'],
  data() {
    return {
      slideIndex: 2,
      allItems: '',
      itemsLoaded: false,
      shelves: [],
      itemChecked: '',
      message: '',
    }
  },
  methods: {
    closeWindow() {
      this.$emit('closeWindow')
    },
    plusSlides(n) {
      this.showSlides(this.slideIndex += n);
    },
    currentSlide(n) {
      this.showSlides(this.slideIndex = n);
    },
    showSlides(n) {
      if (document.getElementsByClassName("mySlides")) {
        let i;
        let slides = document.getElementsByClassName("mySlides");
        if (n > slides.length) {
          this.slideIndex = 1
        }
        if (n < 1) {
          this.slideIndex = slides.length
        }
        for (i = 0; i < slides.length; i++) {
          slides[i].style.display = "none";
        }
        slides[this.slideIndex - 1].style.display = "block";
      } else {
        setTimeout(this.showSlides(1), 1000)
      }
    },
    async loadItems() {
      await get(child(this.db, 'allItems'))
          .then((snapshot) => {
            this.allItems = snapshot.val()
          })
      this.allItems = Object.values(this.allItems)
      //раскладывание вещей по полкам
      let currentItem = 1;
      let shelvesCount = Math.ceil(this.allItems.length / 6)
      for (let i = 0; i < shelvesCount; i++) {
        if (currentItem === this.allItems.length) {
          break;
        } else {
          this.shelves[i] = []
        }
        for (let j = 0; j < 6; j++) {
          if (currentItem === this.allItems.length) {
            break;
          } else {
            this.shelves[i][j] = this.allItems[currentItem]
            currentItem++;
          }
        }
      }
      this.itemChecked = this.allItems[1]
      this.itemsLoaded = true
      this.showSlides(this.slideIndex)
    },
    checkItem(item) {
      this.itemChecked = item
    },
    async buyItem(item) {
      if (this.$store.getters.getCharacter.money < item.price) {
        this.message = 'Недостаточно средств'
        return 0;
      }
      if (Object.values(this.$store.getters.getCharacter.caughtWixling).length < 1) {
        this.message = 'У вас ещё нет виксов'
      } else {
        const itemInInvId = Object.values(this.$store.getters.getCharacter.inventory).length + 1
        const itemInInv = {
          itemId: item.id,
          count: 1,
          id: itemInInvId,
          title: item.title,
          active: 'false'
        }
        //кладём предмет в инвентарь игрока
        await this.$store.dispatch('setItemInInventory', itemInInv)
        //уменьшаем баланс игрока
        let newMoney = this.$store.getters.getCharacter.money - item.price;
        await this.$store.dispatch('setCharacterMoney', newMoney)
        //обновляем персонажа
        await this.$store.dispatch('setCharacter')
      }
    }
  },
  mounted() {
    this.loadItems()
  }
}
</script>

<style scoped>
#implantTrading {
  position: absolute;
  margin: 1%;
  width: 60%;
  height: 70%;
  background-color: #777B98;
}

#titleDiv
{
  width: 100%;
  height: 30px;
  background-color: #2c3e50;
  color: white;
}

#itemShowcase {
  width: 60%;
  margin: 20px;
}

#itemInfo {
  width: 30%;
  margin-top: 20px;
}

.item {
  width: 90px;
  height: 90px;
  background-color: #2c3e50;
  border-radius: 10px;
  color: white;
  margin-top: 10px;
}

.item:hover {
  cursor: pointer;
  background-color: #46607a;
}

.itemIcon {
  width: 150px;
  height: 150px;
}

.shelf {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 30px;
  width: 250px;
  flex-wrap: wrap;
  margin-left: 20%;
  margin-right: 30%;
}

* {
  box-sizing: border-box
}

body {
  font-family: Verdana, sans-serif;
  margin: 0
}

.mySlides {
  display: none
}

img {
  vertical-align: middle;
}

.slideshow-container {
  max-width: 1000px;
  position: relative;
  margin: auto;
}

.buyButton {
  margin-top: 10px;
  width: 100%;
  text-align: center;
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
  border-radius: 0 10px 10px 0;
  user-select: none;
}

.prev {
  left: 0;
  border-radius: 3px 0 0 3px;
}

/* Измените положение "next button" */
.next {
  right: 10%;
  border-radius: 3px 0 0 3px;
}

/* Добавьте черный фоновый цвет с небольшой прозрачностью*/
.prev:hover, .next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

.implantIcon {
  width: 100%;
  height: 100%;
}
</style>