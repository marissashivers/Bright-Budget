<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <AddPurchase></AddPurchase>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import AddPurchase from '@/components/AddPurchase.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld,
    AddPurchase
  }
}
</script>
