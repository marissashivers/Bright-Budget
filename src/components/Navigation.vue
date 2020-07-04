<template>
    <nav class="site-nav navbar navbar-expand bg-primary navbar-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">Awesome Budget Tool</router-link>
            <div class="navbar-nav ml-auto">
                <router-link class="nav-item nav-link" to="/purchases" v-if="user">purchases</router-link>
                <router-link class="nav-item nav-link" to="/visualize" v-if="user">visualize</router-link>
                <router-link class="nav-item nav-link" to="/meetings" v-if="user">meetings</router-link>
                <router-link class="nav-item nav-link" to="/login" v-if="!user">login</router-link>
                <router-link class="nav-item nav-link" to="/register" v-if="!user">register</router-link>
                
                <!-- logout link -->
                <button 
                    class="nav-item nav-link btn btn-link" 
                    @click="$emit('logout')"
                    v-if="user"
                >logout
                </button>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: "Navigation",
    props: ["user"]
}
</script>