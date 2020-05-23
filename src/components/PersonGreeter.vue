<template>
    <h2>Hello, {{ personName }}!</h2>
</template>

<script>
    module.exports = {
        props: ['personName']
    }
</script>

<style scoped>
    h2 {
        font-size: 40px;
        color: seagreen;
    }
</style>