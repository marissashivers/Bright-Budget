<template>
    <div>
        <h2>Hello!</h2>
    </div>
</template>

<script>
    export default {
        name: 'PurchaseViz'
    }
    module.exports = {
        props: ['purchases']
    }
</script>

<style scoped>
    h2 {
        font-size: 40px;
        color: seagreen;
    }
</style>