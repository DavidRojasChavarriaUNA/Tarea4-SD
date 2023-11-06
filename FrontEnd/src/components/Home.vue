<!-- Home.vue -->
<template>
  <main>
  </main>
</template>

<script>

  export default {
    mounted() {
      this.GetUserLogged()
    },
    methods: {
      async GetUserLogged() {
        try {
          const httpResponse = await fetch(`${this.url}/user/getUser`, {
            headers: {
              'Accept': 'application/json'
            },
            credentials: 'include'
          });
          if (httpResponse.status === 200) {
            const user = await httpResponse.json();
            this.$emit('logged', user);
            this.$router.push('/home');
          }
          if (httpResponse.status === 401) {
            this.$emit('logged', null);
            this.$router.push('/login');
          }
        } catch (error) {
          console.error(error);
          alert(`An error ocurred geting the user.`);
        }
      }
    }
  };
</script>