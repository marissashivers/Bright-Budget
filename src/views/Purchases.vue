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
      <li>Chart.js wrapper for Vue</li>
    </ul>

    <AddPurchase></AddPurchase>
    <p>==========================</p>

    <h2>Testing Purchase List Test:</h2>
    <p v-for="purchase in db" :key="purchase.id">
      {{ purchase.purchasedAt }}
    </p>
  </div>
</template>

<script>
  import PersonGreeter from '../components/PersonGreeter.vue'
  import AddPurchase from '@/components/AddPurchase.vue'

  import { purchaseCollection } from '../firebase';

  export default {
    name: 'purchases',
    components: {
      PersonGreeter,
      AddPurchase,
    },
    data() {
      return {
        purchase: null,
        db: []
      }
    },
    firestore() {
      return {
        db: purchaseCollection.orderBy('createdAt', 'desc')
      }
    }
  }
</script>