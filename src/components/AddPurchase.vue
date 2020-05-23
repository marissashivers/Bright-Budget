<template>
    <div class="container">
        <!-- Form to input a new purchase, using Bootstrap forms -->
        <form class="form-inline">
            <div class="form-row align-items-center">
                <div class="col-auto">
                    <label>Purchase Amount</label>
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">$</div>
                        </div>
                        <input v-model="purchaseAmount" class="form-control" type="number" placeholder="9.99" />
                    </div>
                </div>
                <div class="col-auto">
                    <label>Purchased location</label>
                    <input v-model="purchasedAt" class="form-control" type="text" placeholder="Supermarket" />
                </div>
                <div class="col-auto">
                    <label>Category</label>
                    <select class="form-control">
                        <option>Test1</option>
                        <option>Test2</option>
                    </select>
                </div>
                <div class="col-auto">
                     <button type="submit" @click.prevent="addPurchase()" class="btn btn-primary">Add</button>
                </div>
            </div>
        </form>

        <!-- Bullet list displaying all purchases -->
        <!-- 
        <ul>
            <li v-for="purchase in purchases" :key="purchase.id">
                {{purchase.purchasedAt}} {{purchase.purchaseAmount}}
                <button @click="deletePurchase(purchase)">Delete</button>
            </li>
        </ul>
        -->

        <!-- Bootstrap table... -->
        <div class="col-md-12">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Location</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="purchase in purchases" :key="purchase.id">
                        <td>{{ purchase.purchasedAt }}</td>
                        <td>${{ purchase.purchaseAmount }}</td>
                        <td>{{ formatDate(purchase.createdAt.toDate()) }}</td>
                        <td>
                            <button class="btn btn-primary">Edit</button>
                            <button @click="deletePurchase(purchase)" class="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { purchaseCollection } from '../firebase';
import moment from 'moment';

export default {
    name: "AddPurchase",
    data() {
        return {
            purchaseAmount: '',
            purchasedAt: '',
            purchases: []
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
                createdAt: new Date(),
                purchaseAmount: this.purchaseAmount,
                purchasedAt: this.purchasedAt
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

            // Reset the data properties to empty so the last entry doesn't persist after being submitted
            this.purchaseAmount = 0;
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
    ul {
        list-style: none;
        position: flex;
    }
    .btn-primary {
        margin-right: 12px;
    }
</style>