<script>
import { Line } from "vue-chartjs";
export default {
    extends: Line,
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