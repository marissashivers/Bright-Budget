<script>
import { Doughnut } from "vue-chartjs";
export default {
    extends: Doughnut,
    props: ["data", "options"],
    mounted() {
        this.renderChart(this.data, this.options)
    },
    watch: {
        data: function() {
            this.renderChart(this.data, this.options);
        }
    },
    computed: {
    },
    methods: {
    }
}
</script>

<style scoped>
</style>