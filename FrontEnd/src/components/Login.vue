<!-- Home.vue -->
<template>
    <div class="row">
        <div class="eleven column" style="margin-top: 5%">
            <h2>{{title}}</h2>
            <form>
                <div class="row">
                    <div class="offset-by-four four columns">
                        <label for="username">Username</label>
                        <input class="u-full-width" type="text" v-model="user.username" id="username"
                            placeholder="Enter Username">
                        <label for="password">Password</label>
                        <input class="u-full-width" type="password" v-model="user.password" id="password"
                            placeholder="Enter Password">
                        <input class="u-full-width" type="button" value="LogIn" v-on:click="loginUser">
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                title: 'Login',
                user: this.newUserLogin()
            };
        },
        mounted(){
            this.$emit('logged', null);
        },
        methods: {
            newUserLogin() {
                return {
                    username: '',
                    password: ''
                }
            },
            async loginUser() {
                try {
                    const httpResponse = await fetch(`${this.url}/user/login`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        method: 'POST',
                        body: JSON.stringify(this.user)
                    });
                    if (httpResponse.status === 200) {
                        const userLogged = await httpResponse.json();
                        this.user = this.newUserLogin();
                        this.$emit('logged', userLogged);
                        this.$router.push('/home');
                    }
                    else{
                        alert(await httpResponse.text());
                    }
                } catch (error) {
                    console.error(error);
                    alert(`An error ocurred login the user.`);
                }
            }
        }
    };
</script>