<template>

    <div>
        <!-- SEARCH BAR -->
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>

        <!-- DATA TABLE -->
        <v-data-table
            :headers="headers"
            :items="db"
            :items-per-page="10"
            :search="search"
            class="elevation-1"
        >
            <template v-slot:item.createdAt="{ item }">{{ moment(item.createdAt.toDate()).format('MMMM Do, YYYY') }}</template>
            <template v-slot:item.purchaseAmount="{ item } ">{{ "$" + (Math.round(item.purchaseAmount*100)/100).toFixed(2) }}</template>
        </v-data-table>
    </div>

</template>

<script>
import { purchaseCollection } from '../firebase';

export default {
    name: "PurchaseList",
    components: {
    },
    data() {
        return {
            db: purchaseCollection.orderBy('createdAt', 'desc'),
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
}
</script>