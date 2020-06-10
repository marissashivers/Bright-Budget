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

    <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
    ></v-text-field>
    <v-data-table
        :headers="headers"
        :items="db"
        :items-per-page="5"
        :search="search"
        class="elevation-1"
    >
        <template v-slot:item.createdAt="{ item }">{{ moment(item.createdAt.toDate()).format('MMMM Do, YYYY') }}</template>
        <template v-slot:item.purchaseAmount="{ item } ">{{ "$" + (Math.round(item.purchaseAmount*100)/100).toFixed(2) }}</template>
    </v-data-table>

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
            search: null,
            headers: [
                {
                    text: 'Date',
                    align: 'start',
                    sortable: true,
                    value: 'createdAt'
                },
                { text: 'Purchased At', value: 'purchasedAt'},
                { text: 'Amount', value: 'purchaseAmount'},
                { text: 'Category', value: 'purchaseCategory'}
            ],
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
        },
        getColor(price) {
            if (price > 50) return 'red'
            else if (price < 10) return 'yellow'
            else return 'green'
        },
    },
}
</script>

<style scoped>
    .container {
        padding-left: 300px;
        padding-right: 300px;
    }
</style>