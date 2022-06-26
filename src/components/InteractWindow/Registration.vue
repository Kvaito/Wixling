<template>
  <div id="registrationWindow">
    <h3>Sign up</h3>
    <form name="signupForm">
      <br><span>Name</span><br>
      <input v-model="nickname" type="text" name="nickname" class="RegularInput">
      <br><span>Login</span><br>
      <input v-model="login" type="text" name="login" class="RegularInput">
      <br><span>Email</span><br>
      <input v-model="email" type="text" name="email" class="RegularInput">
      <br><span>Password</span><br>
      <input v-model="password1" type="password" name="password1" class="RegularInput">
      <br><span>Confirmation</span><br>
      <input v-model="password2" type="password" name="password2" class="RegularInput">
      <div v-on:click="RegisterUser" id="registerButton">Register</div>
    </form>
    <br>
    <div>{{ message }}</div>
  </div>
</template>

<script>
import {getDatabase, ref, child, get} from "firebase/database";

export default {
  name: "Registration",
  data() {
    return {
      newId: 0,
      nickname: '',
      login: '',
      email: '',
      password1: '',
      password2: '',
      message: '',
    }
  },
  methods:
      {
        async RegisterUser() {
          if (this.password1 === this.password2) {
            //получение последнего пользователя
            const dbRef = ref(getDatabase());
            get(child(dbRef, `users`))
                .then((snapshot) => {
                  if (snapshot.exists()) {
                    let users = snapshot.val();
                    let usersArr = Object.values(users)
                    let loginValidation = true
                    //проверка, что пользователя с таким логином не существует
                    for (let i = 0; i < usersArr.length; i++) {
                      if (usersArr[i].personData.login === this.login) {
                        loginValidation = false
                      }
                    }
                    if (loginValidation) {
                      let lastUser = users[Object.keys(users).sort().pop()];
                      console.log('Last user ', lastUser)
                      this.newId = lastUser.personData.id + 1
                      console.log('ID нового пользователя', this.newId)
                      //формирование пачки данных
                      const personData = {
                        id: this.newId,
                        nickname: this.nickname,
                        login: this.login,
                        password: this.password1,
                        email: this.email,
                      };
                      this.$store.dispatch("registerUser", personData);
                      this.message='Вы успешно зарегистрированы'
                    }
                    else{
                      this.message='Такой логин уже занят'
                    }

                  }
                })
          } else {
            this.message = 'Пароли должны совпадать';
          }
        },
      }
}
</script>

<style scoped>
#registrationWindow {
  margin-left: 35%;
  margin-top: 30px;
  position: absolute;
  width: 300px;
  height: 500px;
  background-color: rgba(215, 216, 229, 0.2);
  border-radius: 10px;
}

#registerButton {
  margin-top: 10px;
  width: 200px;
  margin-left: 15%;
  color: white;
  background-color: #2c3e50;
  border-radius: 10px;
}

#registerButton:hover {
  cursor: pointer;
  outline: solid 3px aqua;
}
</style>