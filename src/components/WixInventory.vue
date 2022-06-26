<template>
  <div id="mainblock">
    <div id="resourceBlock">Money {{ $store.getters.getCharacter.money }}ฟ
      <span style="color: aqua">Essence {{ $store.getters.getCharacter.essence }}</span></div>
    <div v-for="item in inventory" :key="item[1].id" class="inventory">
      <div class="inventoryItem" v-if="item[1].active==='false'">
        <img :src="require(`../../public/assets/Icons/ImplantIcons/`+item[1].title+`Icon.png`)" alt="icon" class="icon">
        <div class="name"><span>{{ item[1].title }}</span></div>
        <div class="count"><span>{{ item[1].count }}</span></div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "wixInventory",
  props: ['db', 'character'],
  data() {
    return {
      inventory: '',
    }
  },
  methods: {},
  mounted() {
       this.$store.subscribe((mutation) => {
        switch(mutation.type) {
          case 'setCharacter':
            this.inventory=this.$store.getters.getCharacter.inventory
            this.inventory = Object.entries(this.inventory)
          break;
        }
     })
  }
}
</script>

<style scoped>
#mainblock {
  height: 64%;
  width: 100%;
  background-color: rgba(215, 216, 229, 0.2);
  border-radius: 10px 10px 0 0;
}

.inventoryItem {
  display: flex;
  flex-direction: row;
  height: 15%;
  margin: 5px;
  border-radius: 5px;
}

.inventoryItem:hover {
  outline: solid 5px aqua;
  cursor: pointer;
}

.icon {
  height: 40px;
  width: 40px;
}

.name {
  width: 70%;
  padding-top: 5px;
}

.count {
  padding-top: 5px;
  width: 10%;
}

 #resourceBlock
{
  width: 100%;
  height: 30px;
  background-color: #2c3e50;
  color: white;
   border-radius: 10px 10px 0 0;
}

</style>