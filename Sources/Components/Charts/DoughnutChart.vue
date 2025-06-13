<script>
import { Doughnut } from 'vue-chartjs'

export default {
    name: 'DoughnutChart',
    extends: Doughnut,
    props: ['data', 'options'],
    mounted () {
        this.renderChart(this.data, this.options);
    },
    watch: {
        data: function() {
            this.renderChart(this.data, this.options);
        }
    }
}
</script>