<template>
    <div class="container">

        <!-- Add purchase category button-->
        <form>
            <b-form-group>
                <label>Add purchase category</label>
                <b-form-input type="text" v-model="categoryInput" />
                <b-button type="submit"  @click.prevent="addCategory()" class="btn btn-primary">Add</b-button>
            </b-form-group>
        </form>

        <!-- BOOTSTRAP VUE MODAL -->
        <b-modal 
            id="edit-purchase-modal" 
            title="EditPurchase"
            @ok="handleOk"
        >
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group>
                    <label>Purchase Location</label>
                    <b-form-input v-model="purchasedAt" :placeholder="currentlyEditing.purchasedAt" type="text" />
                </b-form-group>
                <b-form-group>
                    <label>Purchase Amount</label>
                    <b-form-input v-model="purchaseAmount" :placeholder="currentlyEditing.purchaseAmount" type="number" />
                </b-form-group>
                <b-form-group>
                    <label>Purchase Category</label>
                    <select class="form-control" v-model="purchaseCategory">
                        <option v-for="(item, key) in categories" :key="key">
                            {{item}}
                        </option>
                    </select>
                </b-form-group>
                <b-form-group>
                    <datepicker v-model="createdAt" class="form-control"></datepicker>
                </b-form-group>
            </form>
            <p>{{ currentlyEditing.purchasedAt }}</p>
        </b-modal>

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
                        <!-- <option v-for="(item, key) in categories" :key="key">
                            {{item}}
                        </option> -->
                        <option v-for="item in categories" :key="item.id">
                            {{ item.category }}
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
                            <button 
                                class="btn btn-primary" 
                                v-b-modal.edit-purchase-modal 
                                @click="sendInfo(purchase)"
                            >
                                Edit
                            </button>
                            <button class="btn btn-secondary" @click="test(purchase)">Test</button>
                            <button @click="deletePurchase(purchase)" class="btn btn-danger">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Data Table -->
        <!-- to be added soon -->
        
        <button type="button" class="btn btn-primary" @click="showModal">Open Modal</button>

        <!-- total purchases -->
        <h2>Total Purchases: ${{ getTotalPurchases.toFixed(2) }}</h2>

    </div>
</template>

<script>
    import { purchaseCollection } from '../firebase';
    import { categoryCollection } from '../firebase';
    import moment from 'moment';
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: "AddPurchase",
        components: {
            Datepicker,
        },
        data() {
            return {
                purchase: null,
                category: null,
                categories: [],
                purchases: [],
                purchasedAt: null,
                purchaseAmount: null,
                purchaseCategory: null,
                createdAt: new Date(),
                currentlyEditing: '',
                isModalVisible: false,
                totalPurchases: 0,
                categoryInput: '',
            }
        },
        computed: {
            getTotalPurchases: function() {
                let sum = 0;
                this.purchases.forEach(purchase => sum += Number(purchase.purchaseAmount));
                return sum;
            }
        },
        firestore() {
            return {
                purchases: purchaseCollection.orderBy('createdAt', 'desc'),
                categories: categoryCollection,
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
            addCategory() {
                categoryCollection.add({
                    category: this.categoryInput,
                    createdAt: new Date(),
                })
                .then(function(docRef) {
                    console.log("Category written with ID: ", docRef.id);
                })
                .catch(function(error) {
                    console.error("Error adding category document: ", error);
                });
            },
            deletePurchase(purchase) {
                purchaseCollection.doc(purchase.id).delete()
                .then(function() {
                    console.log("Document deleted");
                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });
            },
            formatDate(date) {
                return moment(date).format('MMM Do, YYYY');
            },

            // EditPurchase Popup
            showModal() {
                this.isModalVisible = true;
            },
            closeModal() {
                this.isModalVisible = false;
            },
            test(purchase) {
                console.log(purchase.purchasedAt)
            },
            sendInfo(purchase) {
                this.currentlyEditing = purchase;
            },
            handleOk(bvModalEvt) {
                bvModalEvt.preventDefault()
                this.handleSubmit()
            },
            handleSubmit() {
                purchaseCollection.doc(this.currentlyEditing.id).update({
                    createdAt: this.createdAt,
                    purchaseAmount: this.purchaseAmount,
                    purchasedAt: this.purchasedAt,
                    purchaseCategory: this.purchaseCategory
                })
                .then(function() {
                    console.log("Updated document!");
                    // Reset the data properties to empty so the last entry doesn't persist after being submitted
                    this.createdAt = null;
                    this.purchaseAmount = null;
                    this.purchasedAt = '';
                })
                .catch(function(error){
                    console.error("Error updating document text: ", error);
                });

                this.$nextTick(() => {
                    this.$bvModal.hide('edit-purchase-modal')
                })
            },
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
    .btn-primary {
        margin-right: 12px;
    }
</style>