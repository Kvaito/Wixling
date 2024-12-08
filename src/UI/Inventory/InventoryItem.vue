<template>
  <div class="inventory-item-container" :title="itemData.name">
    <img alt="item-image" class="inventory-item-image" :src="'/items/'+itemData.textureUrl" />
  </div>
</template>

<script>
export default {
  name: 'InventoryItem',
  props:[
      'itemData'
  ]
}
</script>

<style scoped>
.inventory-item-container{
  cursor: pointer;
  width: 40px;
  height: 40px;
}
.inventory-item-image{
  width: 100%;
  height: 100%;
}
</style>