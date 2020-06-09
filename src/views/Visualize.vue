<template>
  <div class="container">
    <Chart></Chart>

    <hr />

    <h2>Purchases...</h2>
    <b-input-group class="w-25">
        <label>Filter by month</label>
        <datepicker class="form-control" v-model="selectedDate" placeholder="select date" :minimumView="'month'" :maximumView="'month'" >Select Date</datepicker>
    </b-input-group>

    <h3>Your purchases for {{ formatDate(selectedDate) }}:</h3>
    <div v-for="purchase in db" :key="purchase.id">
        <div v-if="formatDate(purchase.createdAt.toDate()) == formatDate(selectedDate)"> {{ purchase.purchasedAt }} @ {{ moment(purchase.createdAt.toDate()).format('MMM Do YYYY') }}</div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import Chart from '@/components/Chart.vue';
import Datepicker from 'vuejs-datepicker';
import { purchaseCollection } from '../firebase';
import moment from 'moment';

export default {
    name: 'visualize',
    components: {
        Chart,
        Datepicker,
    },
    computed: {
    },
    data() {
        return {
            purchase: null,
            db: [],
            dbToDisplay: [],
            selectedDate: new Date(),
        }
    },
    firestore() {
        return {
            db: purchaseCollection.orderBy('createdAt', 'desc'),
            dbToDisplay: purchaseCollection.where('createdAt', '==', 'selectedDateFormatted')
        }
    },
    methods: {
        formatDate(date) {
            return moment(date).format('MMM YYYY');
        }
    }
}
</script>

<style scoped>
    .container {
        padding-left: 300px;
        padding-right: 300px;
    }
</style>