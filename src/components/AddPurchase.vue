<template>
    <div class="container">

        <!-- Form to input a new purchase, using Bootstrap forms -->
        <form>
            <div class="row">
                <div class="col">
                    <label>Purchase Amount</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">$</div>
                        </div>
                        <input v-model.number="purchaseAmount" class="form-control" type="number" placeholder="9.99" />
                    </div>
                </div>
                <div class="col">
                    <label>Purchased location</label>
                    <input v-model="purchasedAt" class="form-control" type="text" placeholder="Supermarket" />
                </div>
                <div class="col">
                    <label>Date</label>
                    <datepicker v-model="createdAt" class="form-control" placeholder="Select Date"></datepicker>
                </div>
                <div class="col">
                    <label>Category</label>
                    <select class="form-control" v-model="purchaseCategory">
                        <option v-for="(item, key) in categories" :key="key">
                            {{item}}
                        </option>
                    </select>
                </div>
                <button type="submit" @click.prevent="addPurchase()" class="btn btn-primary my-auto">Add</button>
            </div>
        </form>

        <!-- Bootstrap table... -->
        <div class="col-md-12">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="purchase in purchases" :key="purchase.id">
                        <td>{{ purchase.purchasedAt }}</td>
                        <td>${{ purchase.purchaseAmount }}</td>
                        <td>{{ purchase.purchaseCategory }}</td>
                        <td>{{ formatDate(purchase.createdAt.toDate()) }}</td>
                        <td>
                            <button class="btn btn-primary">Edit</button>
                            <button @click="deletePurchase(purchase)" class="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Data Table -->
        <!-- to be added soon --> 

    </div>
</template>

<script>
    import { purchaseCollection } from '../firebase';
    import moment from 'moment';
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: "AddPurchase",
        components: {
            Datepicker,
        },
        data() {
            return {
                purchases: [],
                createdAt: new Date(),
                categories: {
                    "select1": "Food",
                    "select2": "Shopping",
                    "select3": "Clothing"
                }
            }
        },
        firestore() {
            return {
                purchases: purchaseCollection.orderBy('createdAt', 'desc')
            }
        },
        methods: {
            addPurchase() {
                purchaseCollection.add({
                    createdAt: this.createdAt,
                    purchaseAmount: this.purchaseAmount,
                    purchasedAt: this.purchasedAt,
                    purchaseCategory: this.purchaseCategory
                })
                .then(function(docRef) {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });

                // Reset the data properties to empty so the last entry doesn't persist after being submitted
                this.createdAt = null;
                this.purchaseAmount = null;
                this.purchasedAt = '';
            },
            deletePurchase(purchase) {
                purchaseCollection.doc(purchase.id).delete()
                .then(function(docRef) {
                    console.log("Document deleted that had ID: ", docRef.id);
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            },
            formatDate(date) {
                return moment(date).format('MMM Do, YYYY');
            }
        }
    }
</script>

<style scoped>
    h3 {
        margin: 40px 0 0;
    }
    ul {
        list-style: none;
        position: flex;
        padding: 0;
    }
    li {
        margin: 0 10px;
    }
    .container {
        padding-left: 300px;
        padding-right: 300px;
    }
    .btn-primary {
        margin-right: 12px;
    }
</style>