<template>
    <nav class="site-nav navbar navbar-expand bg-primary navbar-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">PurchaseViz</router-link>
            <div class="navbar-nav ml-auto">
                <router-link class="nav-item nav-link" to="/purchases" v-if="userLoggedIn">purchases</router-link>
                <router-link class="nav-item nav-link" to="/visualize" v-if="userLoggedIn">visualize</router-link>
                <!-- <router-link class="nav-item nav-link" to="/meetings" v-if="userLoggedIn">meetings</router-link> -->
                <router-link class="nav-item nav-link" to="/budgets" v-if="user">budgets</router-link>
                <router-link class="nav-item nav-link" to="/login" v-if="!userLoggedIn">login</router-link>
                <router-link class="nav-item nav-link" to="/register" v-if="!userLoggedIn">register</router-link>
                
                <!-- logout link -->
                <!-- <button 
                    class="nav-item nav-link btn btn-link" 
                    @click="$emit('logout')"
                    v-if="userLoggedIn"
                >logout
                </button> -->
                <button class="nav-item nav-link btn btn-link"
                @click="logout()" v-if="userLoggedIn"
                >logout</button>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navigation",
    computed: {
        userLoggedIn() {
            return this.$store.getters.user;
        }
    },
    methods: {
        logout() {
            this.$store.dispatch("signOutAction")
            .then(() => {
                this.$router.push({path: '/login'});
            }, error => {
                console.log(error.message);
            });
        }
    }
}
</script>