<template>
  <div class="inventory-global-container">
    <div class="inventory-container">
      <InventoryItem v-for="item in inventory" :item-data="item"/>
    </div>
  </div>
</template>

<script>
import InventoryItem from "~/src/UI/Inventory/InventoryItem.vue";
import {usePlayerStore} from "~/src/stores/storePlayer.ts";

export default {
  name: 'Inventory',
  components: {InventoryItem},
  setup(){
    const player=usePlayerStore();
    return {
      player
    }
  },
  computed:{
    inventory(){
      return this.player.getInventory;
    }
  }
}
</script>


<style scoped>
.inventory-global-container {
  position: absolute;
  pointer-events: none;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.inventory-container{
  padding: 5px;
  pointer-events: all;
  width: 50px;
  display: flex;
  flex-direction: column;
  gap:10px;
  align-items: center;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  box-sizing: border-box;
}
</style>