<!-- doesn't work -->

<template>
<!-- 
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            default header
                        </slot>
                    </div>
                    <div class="modal-body">
                        <slot name="body">
                            default body
                            <form>
                                <div class="form-group">
                                    <label class="col-form-label">Edit Location</label>
                                    <input type="text" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label">Edit Price</label>
                                    <input type="number" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label">Edit Category</label>
                                    <select class="form-control" required>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label class="col-form-label">Edit Date</label>
                                    <datepicker class="form-control"></datepicker>
                                </div>
                            </form>
                        </slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer">
                            <button type="button" class="btn btn-secondary" @click="$emit('close')">Close</button>
                            <button type="button" class="btn btn-primary" @click="update()">Save changes</button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
    -->

    <div>
        <b-modal title="Edit Purchase">
            <p class="my-4">Hello.</p>
        </b-modal>
    </div>

</template>


<script>
/*
    import moment from 'moment';
    import Datepicker from 'vuejs-datepicker';

    export default {
        name: 'EditPurchase',
        props: ['editPurchase'],
        components: {
            //moment,
            Datepicker,
        },
        data() {
            return {
                purchase: this.editPurchase
            }
        },
        methods: {
            update() {
                this.$emit('close');
            },
            close() {
                this.$emit('close');
            },
            formatDate(date) {
                return moment(date).format('MMM Do, YYYY');
            }
        }
    }
    */
</script>


<style>
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: table;
    }

    .modal-wrapper {
        display: table-cell;
    }

    .modal-container {
        width: 300px;
        margin: 0px auto;
        padding: 20px 30px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        /* transition: all 0.3s ease; */
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
    margin: 20px 0;
    }
</style>