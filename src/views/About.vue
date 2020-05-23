<template>
  <div class="about">
    <h1>This is an about page</h1>
    <br>
    <br>
    <p>Using the PersonGreeter in components folder...</p>
    <PersonGreeter personName="Travis" />

    <ul> Souces
      <li>https://www.positronx.io/vue-js-firebase-build-vue-crud-app-with-cloud-firestore/</li>
      <li>Bootstrap table layout</li>
    </ul>
  </div>
</template>

<script>
  import PersonGreeter from '../components/PersonGreeter.vue'

  export default {
    name: 'about',
    components: {
      PersonGreeter
    }
  }
</script>