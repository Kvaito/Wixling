<template>
  <div id="implantManage">
    <div v-if="slotDesc==='busy'">
      <div>{{ implant.implantInfo.title }}</div>
      <div>{{ implant.implantInfo.bonusDesc }}</div>
      <div v-on:click="takeOffImplant" id="takeOffButton">Снять имплант</div>
    </div>
    <div v-if="slotDesc==='empty'">
      <div>Установить имплант</div>
      <div class="allImplants">
        <div v-for="implant in inventory" :key="implant[1].itemId">
          <div class="inventoryItem" v-if="implant[1].active==='false'" v-on:click="installImplant(implant)">
            <img :src="require(`../../../public/assets/Icons/ImplantIcons/`+implant[1].title+`Icon.png`)" alt="icon"
                 class="icon">
            <div class="name"><span>{{ implant[1].title }}</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getDatabase, ref, update} from "firebase/database";

export default {
  name: "implantManage",
  props: ['slotDesc', 'implant', 'wix'],
  data() {
    return {
      inventory: []
    }
  },
  methods: {
    async installImplant(item) {
      const db = getDatabase();
      //установка импланта в викса
      await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id +
          '/characterData/character' + localStorage.activeCharacter + '/caughtWixling/wixInSafe_' + this.wix.id + '/implantsId/implant'
          + this.implant.id),
          {
            busy: 'true',
            implantId: item[1].itemId,
            idInInventory: item[1].id
          })
      //скрытие импланта из инвентаря
      await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id +
          '/characterData/character' + localStorage.activeCharacter + '/inventory/item' + item[1].id),
          {active: 'true'})
      //обновление персонажа
      this.$store.dispatch('setCharacter')
      this.$emit('closeImplantWindow')
    },
    async takeOffImplant() {
      const db = getDatabase();
      //вернуть предмет в инвентарь
      await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id +
          '/characterData/character' + localStorage.activeCharacter + '/inventory/item' + this.implant.idInInventory),
          {active: 'false'})
      //снять с викса
      await update(ref(db, 'users/user' + this.$store.getters.getCurrentUser.personData.id +
          '/characterData/character' + localStorage.activeCharacter + '/caughtWixling/wixInSafe_' + this.wix.id + '/implantsId/implant'
          + this.implant.id),
          {busy: 'false'})
      this.$store.dispatch('setCharacter')
      this.$emit('closeImplantWindow')
    }
  },
  mounted() {
    if (this.slotDesc === 'empty') {
      this.inventory = Object.entries(this.$store.getters.getCharacter.inventory)
    }
  }
}
</script>

<style scoped>
#implantManage {
  width: 150px;
  outline: 3px solid #2c3e50;
  background-color: #b9bddb;
  border-radius: 10px;
  position: absolute;
  z-index: 13;
  margin-left: 70px;
  top: 120px;
  max-height: 500px;
}

#takeOffButton {
  background-color: #2c3e50;
  border-radius: 10px;
  margin: 10px;
}

.allImplants {
  overflow-y: scroll;
}

#takeOffButton:hover {
  cursor: pointer;
  color: white;
  outline: 1px solid aqua;
}

.inventoryItem {
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  margin: 5px;
  margin-top: 10px;
  background-color: #2c3e50;
}

.inventoryItem:hover {
  cursor: pointer;
  background-color: #5fd4f8;
}

.icon {
  height: 40px;
  width: 40px;
}

.name {
  width: 70%;
  padding-top: 5px;
}
</style>