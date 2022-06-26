<template>
  <div id="authorizationWindow">
    <h3>Sign in</h3>
    <form name="signupForm">
      <br><span>Логин</span><br>
      <input v-model="login" type="text" name="login" class="RegularInput">
      <br><span>Пароль</span><br>
      <input v-model="password" type="password" name="password" class="RegularInput">
      <div v-on:click="SignInUser" id="signInButton">Войти</div>
    </form>
    <br>
    <div>{{ message }}</div>
  </div>
</template>

<script>
import {getDatabase, ref, child, get} from "firebase/database";

export default {
  name: "Authorization",
  data() {
    return {
      login: '',
      password: '',
      allUsers: '',
      message: ''
    }
  },
  methods: {
    async SignInUser() {
      //получение всех пользователей
      const dbRef = ref(getDatabase());
      await get(child(dbRef, `users`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.allUsers = snapshot.val();
            }
          })
      //сверяем логин и пароль со всеми пользователями
      this.allUsers = Object.values(this.allUsers)
      for (let item of this.allUsers) {
        if (item.personData.login === this.login) {
          if (item.personData.password === this.password) {
            await this.$store.dispatch('setCurrentUser', item)
            this.$emit('userSignedIn')
            break;
          } else {
            this.message = 'Пароль не подходит'
          }
        } else {
          this.message = 'Пользователь не найден'
        }
      }
    }
  }
}
</script>

<style scoped>
#authorizationWindow {
  margin-left: 35%;
  margin-top: 30px;
  position: absolute;
  width: 300px;
  height: 500px;
  background-color: rgba(215, 216, 229, 0.2);
}

#signInButton {
  margin-top: 10px;
  width: 200px;
  margin-left: 15%;
  background-color: #8a90c1;
  border-radius: 10px;
}

#signInButton:hover {
  cursor: pointer;
  outline: solid 3px aqua;
}
</style>