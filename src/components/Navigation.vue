<template>
    <nav class="site-nav navbar navbar-expand bg-primary navbar-dark">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">Awesome Budget Tool</router-link>
            <div class="navbar-nav ml-auto">
                <router-link class="nav-item nav-link" to="/">Home</router-link>
                <router-link class="nav-item nav-link" to="/purchases">Purchases</router-link>
                <router-link class="nav-item nav-link" to="/visualize">Visualize</router-link>
            </div>
        </div>
    </nav>
</template>