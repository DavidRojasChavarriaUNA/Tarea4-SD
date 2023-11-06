<template>
  <div id="app" class="container">
    <div class="row" style="margin-top: 15px">
      <router-link class="three columns button button-primary" to="/">Home</router-link>
      <router-link class="three columns button button-primary" to="/book">Books</router-link>
      <router-link class="three columns button button-primary" to="/author">Authors</router-link>
      <router-link class="three columns button button-primary" to="/publisher">Publishers</router-link>
    </div>
    <div class="row" style="text-align: right" v-if="userLogged">
      <span style="margin-right: 5px">{{userLogged}}</span>
      <button class="button" v-on:click="salir">Salir</button>
    </div>
    <router-view v-on:logged="logged" />
    <div class="row">
      <button disabled="disabled" class="twelve columns button-primary">
        Tarea 3 David Rojas Chavarria - Sistemas distribuidos Universidad Nacional 2023
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "App",
    data() {
      return {
        userLogged: null,
        interval: null
      };
    },
    methods: {
      logged(userLogged) {
        if (userLogged && userLogged.userid)
          this.userLogged = userLogged.userid;
        else
          this.userLogged = null;
      },
      async salir() {
        try {
          const httpResponse = await fetch(`${this.url}/user/logout`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });
          if (httpResponse.status === 200){
            this.$router.push('/');
            this.logged(null);
          }
          alert(await httpResponse.text());
        } catch (error) {
          console.error(error);
          alert(`An error ocurred exiting.`);
        }
      }
    },
  };
</script>