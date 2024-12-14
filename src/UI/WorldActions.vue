<template>
  <div class="world-actions-container">
    <div class="world-actions-item">
      <div>World time</div>
      <div>
        <input type="range"
               :value="worldTime"
               @change="(e)=>onTimeRangeInput(e.target.value)"
               min="0" :max="dayLength">
      </div>
    </div>
    <div class="world-actions-item">
      <div>
        Day Length
      </div>
      <div>
        <input class="world-actions-input"
               :value="dayLength"
               @input="(e)=>onDayLengthInput(e.target.value)"
               @keydown.stop @keyup.stop type="number">
      </div>
    </div>
  </div>
</template>

<script>
import {useGlobalConditionStore} from "~/src/stores/storeGlobalCondition.ts";

export default {
  name: 'WorldActions',
  setup() {
    const world = useGlobalConditionStore();
    return {
      world
    }
  },
  computed: {
    worldTime() {
      return this.world.getTime;
    },
    dayLength() {
      return this.world.getDayLength;
    }
  },
  methods: {
    onDayLengthInput(newLength) {
      this.world.setDayLength(newLength)
    },
    onTimeRangeInput(value) {
      if (value < 1) value = this.dayLength - 2
      if (value > (this.dayLength - 1)) value = 0
      this.world.setTime(value);
    }
  }
}
</script>

<style scoped>


.world-actions-container {
  padding: 5px;
  position: absolute;
  pointer-events: all;
  height: 30px;
  display: flex;
  right: 50px;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  box-sizing: border-box;
}

.world-actions-item {
  display: flex;
  flex-direction: row;
  gap: 10px
}

.world-actions-input {
  width: 90px;
}
</style>