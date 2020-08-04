<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <!-- top row -->
    <b-row>
      <b-col>
        <!-- SORT BY CATEGORY -->
        <b-form-group
          label="Sort"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="sortBySelect"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-select
              v-model="sortBy"
              id="sortBySelect"
              :options="sortOptions"
              class="w-75"
            >
              <template v-slot:first>
                <option value="">-- none --</option>
              </template>
            </b-form-select>
            <b-form-select
              v-model="sortDesc"
              size="sm"
              :disabled="!sortBy"
              class="w-25"
            >
              <option :value="false">Asc</option>
              <option :value="true">Desc</option>
            </b-form-select>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col>
        <!-- SORTING DIRECTION -->
        <b-form-group
          label="Initial sort"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="initialSortSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="sortDirection"
            id="initialSortSelect"
            size="sm"
            :options="['asc', 'desc', 'last']"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col>
        <!-- search/filter -->
        <b-form-group
          label="Filter"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="filter"
              type="search"
              id="filterInput"
              placeholder="Type to Search"
            ></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''"
                >Clear</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- bottom row -->
    <b-row>
      <b-col>
        <b-form-group
          label="Filter On"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          description="Leave all unchecked to filter on all data"
          class="mb-0"
        >
          <b-form-checkbox-group v-model="filterOn" class="mt-1">
            <b-form-checkbox value="name">Name</b-form-checkbox>
            <b-form-checkbox value="age">Age</b-form-checkbox>
            <b-form-checkbox value="isActive">Active</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>

      <b-col>
        <b-form-group
          label="Per page"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col>
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <!-- TODO: fix date sorting -->
    <b-table
      show-empty
      small
      stacked="md"
      ref="table"
      :items="purchases"
      :fields="fields"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
    >
      <template v-slot:cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template v-slot:cell(actions)="row">
        <b-button
          size="sm"
          @click="info(row.item, row.index, $event.target)"
          class="mr-1"
        >
          Info modal
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
        <!-- added by me from old table -->
        <section
          class="btn-group align-self-center"
          role="group"
          aria-label="Purchase Options"
        >
          <button
            class="btn btn-sm btn-outline-secondary view"
            @click="editPurchase(item)"
          >
            <font-awesome-icon icon="pencil-alt" />
          </button>
          <button
            class="btn btn-sm btn-outline-secondary edit"
            @click="handleSavePurchase(item)"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>
          </button>
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="handleDeletePurchase(row.item)"
          >
            <font-awesome-icon icon="trash" />
          </button>
        </section>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">
              {{ key }}: {{ value }}
            </li>
          </ul>
        </b-card>
      </template>
    </b-table>

    <!-- Info modal -->
    <b-modal
      :id="infoModal.id"
      :title="infoModal.title"
      ok-only
      @hide="resetInfoModal"
    >
      <pre>{{ infoModal.content }}</pre>
    </b-modal>
  </b-container>
</template>

<script>
import moment from "moment";
export default {
  name: "DisplayPurchases",
  props: ["categories"],
  computed: {
    purchases() {
      return this.$store.getters.purchases;
    },
    sortOptions() {
    // Create an options list from our fields
    return this.fields
      .filter((f) => f.sortable)
      .map((f) => {
        return { text: f.label, value: f.key };
      });
    },
  },
  watch: {
    purchases: function() {
      console.log("purchases changed");
    }
  },
  data() {
    return {
      items: this.$store.getters.purchases,
      fields: [
        {
          key: "createdAt",
          label: "Date",
          sortable: true,
          sortDirection: "desc",
          formatter: (value) => {
            return this.formatDate(value.toDate());
          },
        },
        {
          key: "purchaseLocation",
          label: "Location",
          sortable: true,
          class: "text-center",
        },
        {
          key: "purchaseAmount",
          label: "Amount",
          sortable: true,
          sortByFormatted: true,
          filterByFormatted: true,
          formatter: (value) => {
            return "$" + Number(value).toFixed(2)
          }
        },
        {
          key: "purchaseCategory",
          label: "Category",
          sortable: true,
          sortDirection: "desc",
        },
        { key: "actions", label: "Actions" },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15],
      sortBy: "",
      sortDesc: false,
      sortDirection: "desc",
      filter: null,
      filterOn: [],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
    };
  },
  mounted() {
    //Set the initial number of items
    this.totalRows = this.$store.getters.purchases.length;
  },
  methods: {
    // @click="info(row.item, row.index, $event.target)"
    info(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    // added by me
    formatDate(date) {
      return moment(date).format("MM-DD-YYYY");
    },
    handleDeletePurchase(item) {
      console.log(item);
      this.$store.dispatch("deletePurchase", item);
    }
  },
};
</script>