<script>
import { Doughnut } from "vue-chartjs";
export default {
    extends: Doughnut,
    props: ["data", "options"],
    mounted() {
        this.renderChart(this.data, this.options)
    },
    computed: {
        chartData: function() {
            return this.data;
        }
    },
    methods: {
        renderLineChart: function() {
            
        }
    }
}
</script>

<style scoped>
</style>