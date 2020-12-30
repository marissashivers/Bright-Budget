<template>
    <nav class="site-nav navbar navbar-expand bg-primary navbar-dark">
        <div class="container-fluid">
            <span style="color:white; padding: 0 10px;">
                <font-awesome-icon class="fa-lg" icon="dollar-sign" />
            </span>
            <router-link class="navbar-brand" to="/">PurchaseViz</router-link>
            <div class="navbar-nav ml-auto">
                <!-- links to show if user is NOT logged in -->
                <template v-if="!isUserAuth">
                    <router-link 
                        class="nav-item nav-link"
                        v-for="item of navItems"
                        :key="item.name"
                        :to="item.to"
                    >
                        {{ item.name }}
                    </router-link>
                </template>

                <!-- links to show if user IS logged in -->
                <template v-if="isUserAuth">
                    <router-link 
                        class="nav-item nav-link"
                        v-for="item of navItemsLoggedIn"
                        :key="item.name"
                        :to="item.to"
                    >
                        {{ item.name }}
                    </router-link>
                    <div class="nav-item nav-link" @click="signOut">
                        logout
                    </div>
                </template>
            </div>
        </div>
    </nav>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
    data() {
        return {
            navItems: [
                { name: "login", to: "/login" },
                { name: "register", to: "/register"}
            ],
            navItemsLoggedIn: [
                { name: "purchases", to: "/purchases" },
                { name: "visualize", to: "/visualize" },
                { name: "budgets", to: "/budgets" },
            ]
        };
    },
    name: "Navigation",
    computed: {
        ...mapGetters(["getUser", "isUserAuth"])
    },
    methods: {
        ...mapActions(["signOutAction"]),
        signOut() {
            this.signOutAction();
        }
    }
}
</script>