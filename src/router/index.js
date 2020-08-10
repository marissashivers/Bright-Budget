import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
    // each object is a route and within the object, we have settings
const routes = [{
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/purchases',
        name: 'Purchases',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ('../views/Purchases.vue')
    },
    {
        path: '/visualize',
        name: 'Visualize',
        component: () =>
            import ('../views/Visualize.vue')
    },
    {
        path: "/login",
        name: 'Login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: "/register",
        name: 'Register',
        component: () =>
            import ('../views/Register.vue')
    },
    {
        path: "/budgets",
        name: "Budgets",
        component: () => import('../views/Budgets.vue')
    },
    {
        path: "/about",
        name: "About",
        component: () => import('../views/About.vue')
    },
    {
        path: "/old",
        name: "Old",
        component: () =>
            import ('../views/Old.vue')
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router