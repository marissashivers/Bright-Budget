<template>
  <div class="purchases">
    <p>Using the PersonGreeter in components folder...</p>
    <PersonGreeter personName="Travis" />

    <ul> Souces
      <li>https://www.positronx.io/vue-js-firebase-build-vue-crud-app-with-cloud-firestore/</li>
      <li>Bootstrap table layout</li>
      <li>Vuetify</li>
      <li>Datepicker</li>
      <li>Bootstrap Vue, Modal, forms</li>
    </ul>

    <AddPurchase></AddPurchase>
  </div>
</template>

<script>
  import PersonGreeter from '../components/PersonGreeter.vue'
  import AddPurchase from '@/components/AddPurchase.vue'

  export default {
    name: 'purchases',
    components: {
      PersonGreeter,
      AddPurchase
    }
  }
</script>