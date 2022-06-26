<template>
  <div>
    <div id="newsContainer" v-if="newsLoaded">
      <div v-for="item in news" v-bind:key="item.id">
        <div class="newsItem">
          <div><span>{{ item.title }}</span></div>
          <div><span>{{ item.date }}</span></div>
          <div><span>{{ item.description }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {child, get, getDatabase, ref} from "firebase/database";

export default {
  name: "News",
  data() {
    return {
      news: [],
      newsLoaded: false
    }
  },
  methods: {
    async loadNews() {
      const dbRef = ref(getDatabase());
      await get(child(dbRef, `news`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.news = Object.values(snapshot.val());
            }
          })
      this.newsLoaded = true
    }
  },
  mounted() {
    this.loadNews()
  }
}
</script>

<style scoped>
#newsContainer {
  width: 700px;
  height: 80vh;
  margin-left: 20%;
  overflow-y: scroll;
}

.newsItem
{
  width: 90%;
  margin-top: 20px;
  justify-content: left;
  border-radius: 10px;
  background-color: rgba(215, 216, 229, 0.2);
}
</style>