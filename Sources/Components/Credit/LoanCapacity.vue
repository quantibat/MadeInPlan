<template>
    <el-dialog class="monthly-calculation-dialog" fullscreen :visible="open" @close="close" style="margin-top: -2rem; padding-top: 0rem; top: 0;background: rgba(255, 255, 255, .99);" width="85vw">
        <el-row>
            <h1>Capacité d'emprunt</h1>
        </el-row>
        <el-row>
             <el-tabs type="card" :value="editableTabsValue" @tab-remove="removeTab" @tab-click="handleClick">
                 <el-tab-pane v-for="(simulation, index) in simulations" :closable="simulations.length > 1" :name="simulation.id">
                     <span slot="label">Simulation {{(index + 1).toString()}}</span>
                     <el-row style="width: 100%">
                         <el-col :xs="{span: 24, offset: 0}" :sm="{span: 24, offset: 0}" :md="{span: 12, offset: 0}" :lg="{span: 12, offset: 0}" :xl="{span: 12, offset: 0}" class="form-container">
                             <el-row class="case-title">Mensualité souhaitée</el-row>
                             <el-row class="case-body">
                                   <el-input class="case-input-number" autocomplete="off" onClick="this.select()" placeholder="1 000" type="text" v-model="simulation.monthlyAmount" @change="formatAmount">
                                        <template slot="append">€</template>
                                    </el-input>
                             </el-row>
                             <el-row class="case-title">Durée du crédit</el-row>
                             <el-row class="case-body">
                                   <el-input class="case-input-number" autocomplete="off" onClick="this.select()" :placeholder="10" type="number" v-model="simulation.loanDuration">
                                        <template slot="append">ans</template>
                                    </el-input>
                                    <vue-slider
                                        ref="slider1"
                                        piecewiseLabel
                                        style="display: inline-block"
                                        v-model="simulation.loanDuration"
                                        :bg-style="{backgroundColor:'#DEF3FE'}"
                                        :process-style="{backgroundColor: '#31bdfc'}"
                                        :slider-style="{backgroundColor: '#FFF', borderStyle: 'solid', borderColor: '#31bdfc', top: '-7px'}"
                                        :tooltip="false"
                                        width="80%"
                                        :max="30">
                                            <template slot="label" slot-scope="{ label }">
                                                <span class="custom-label-first" v-if="label === 0">
                                                    {{ label }}
                                                </span>
                                                <span class="custom-label" v-if="(label % 5) === 0 && label !== 0 && label !== 30">
                                                    {{ label }}
                                                </span>
                                                <span class="custom-label-last" v-if="label === 30">
                                                    {{ label }}
                                                </span>
                                            </template>
                                        </vue-slider>
                                        <span class="custom-legend">années</span>
                             </el-row>
                             <el-row class="case-title">Taux d’intérêt (hors assurance)</el-row>
                             <el-row class="case-body">
                                   <el-input class="case-input-number" onClick="this.select()" autocomplete="off" :placeholder="1" type="number" v-model="simulation.interestRate">
                                        <template slot="append">%</template>
                                    </el-input>
                                    <vue-slider
                                        ref="slider2"
                                        piecewiseLabel
                                        v-model="simulation.interestRate"
                                        :bg-style="{backgroundColor:'#DEF3FE'}"
                                        :interval="0.01"
                                        :process-style="{backgroundColor: '#31bdfc'}"
                                        :slider-style="{backgroundColor: '#FFF', borderStyle: 'solid', borderColor: '#31bdfc', top: '-7px'}"
                                        :tooltip="false"
                                        width="80%"
                                        :max="5">
                                            <template slot="label" slot-scope="{ label }">
                                                <span class="custom-label-first" v-if="label === 0">
                                                    {{ label }} %
                                                </span>
                                                <span class="custom-label" v-if="(label % 1) === 0 && label !== 0 && label !== 5">
                                                    {{ label }} %
                                                </span>
                                                <span class="custom-label-last" v-if="label === 5">
                                                    {{ label }} %
                                                </span>
                                            </template>
                                        </vue-slider>
                             </el-row>
                             <el-row class="case-title">Taux d’assurance</el-row>
                             <el-row class="case-body">
                                   <el-input class="case-input-number" autocomplete="off" onClick="this.select()" :placeholder="1" type="number" v-model="simulation.insuranceRate">
                                        <template slot="append">%</template>
                                    </el-input>
                                    <vue-slider
                                        ref="slider3"
                                        piecewiseLabel
                                        :interval="0.01"
                                        v-model="simulation.insuranceRate"
                                        :bg-style="{backgroundColor:'#DEF3FE'}"
                                        :process-style="{backgroundColor: '#31bdfc'}"
                                        :slider-style="{backgroundColor: '#FFF', borderStyle: 'solid', borderColor: '#31bdfc', top: '-7px'}"
                                        :tooltip="false"
                                        width="80%"
                                        :max="5">
                                            <template slot="label" slot-scope="{ label }">
                                                <span class="custom-label-first" v-if="label === 0">
                                                    {{ label }} %
                                                </span>
                                                <span class="custom-label" v-if="(label % 1) === 0 && label !== 0 && label !== 5">
                                                    {{ label }} %
                                                </span>
                                                <span class="custom-label-last" v-if="label === 5">
                                                    {{ label }} %
                                                </span>
                                            </template>
                                        </vue-slider>
                             </el-row>
                         </el-col>
                         <el-col :xs="{span: 20, offset: 0}" :sm="{span: 20, offset: 0}" :md="{span: 12, offset: 0}" :lg="{span: 12, offset: 0}" :xl="{span: 12, offset: 0}" class="chart-container">
                            <el-row :class="'chart-blur-'+simulationProgress.toString() + ' chart'">
                                 <el-col :span="10" :offset="2">
                                    <el-row class="loan-legend">
                                         <div class="loan-legend-color" />
                                         <div>
                                            Montant du prêt
                                            <div class="loan-price">{{ Number(totalChartData.datasets[0].data[0]).formatMoney(0) }} €</div>
                                         </div>
                                    </el-row>
                                    <el-row class="insurance-legend">
                                         <div class="insurance-legend-color" />
                                         <div>
                                             Coût du prêt
                                            <div class="loan-price">{{ (Number(totalChartData.datasets[0].data[1]).formatMoney(0) === '1')?'0':Number(totalChartData.datasets[0].data[1]).formatMoney(0) }} €</div>
                                         </div>
                                        </el-row>
                                 </el-col>
                                <el-col :span="10" :offset="2">
                                     <el-row>
                                         <doughnut-chart :data="totalChartData" :options="chartOptions" />
                                     </el-row>
                                 </el-col>
                            </el-row>
                            <el-row type="flex" justify="center">
                                <el-col :span="18">
                                    <el-button @click="validate" class="validate">Sauvegarder ma simulation</el-button>
                                </el-col>
                            </el-row>
                         </el-col>
                     </el-row>
                 </el-tab-pane>
                <el-tab-pane name="add tab">
                     <span slot="label"><i class="el-icon-plus"></i>  Simulation</span>
                 </el-tab-pane>
             </el-tabs>
        </el-row>
    </el-dialog>
</template>

<script>
import vueSlider from 'vue-slider-component'
import DoughnutChart from '../Charts/DoughnutChart.vue'
export default {
    name: 'LoanCapacity',
    components: {
        vueSlider,
        DoughnutChart
    },
    props: {
        'open': Boolean,
        'close': Function,
        'simulations': Array,
        'change': Function
    },
    data() {
        return {
            editableTabsValue: '1',
            chartOptions: {
                tooltips: {
                    enabled: false
                },
                 animation: {
                    duration: 0
                },
                cutoutPercentage: 85,
                legend: {
                    display: false,
                },
            }
        };
    },
    computed: {
        simulationProgress: function() {
            const simulation = this.simulations.find((elem) => elem.id === this.editableTabsValue);
            let progress = 0;
            if (simulation.monthlyAmount !== "")
                progress++;
            if (simulation.loanDuration !== "")
                progress++;
            if (simulation.interestRate !== "")
                progress++;
            if (simulation.insuranceRate !== "")
                progress++;
            return progress;
        },
        totalChartData: function() {
            const simulation = this.simulations.find((elem) => elem.id === this.editableTabsValue);
            if (Number(simulation.monthlyAmount.split(' ').join('')) === 0 || simulation.loanDuration === '0' | simulation.interestRate === '0') {
                return {
                    labels: ['Montant du prêt', 'Coût du prêt'],
                    datasets: [
                        {
                            backgroundColor: ['#212D59', 'rgba(71,81,117,0.45)'],
                            data: [0, 1],
                            borderWidth: [2, 2]
                        }
                    ]
                };
            } else {
                let loanAmount = (Number(simulation.monthlyAmount.split(' ').join('')) * (1 - Math.pow(1 + ((simulation.interestRate / 100) / 12), -(simulation.loanDuration * 12)))) / ((simulation.interestRate / 100) / 12);
                let tmp = loanAmount;
                let interestCost = 0;
                while (tmp > 0) {
                    let cost = tmp * ((simulation.interestRate / 100) / 12);
                    interestCost += cost;
                    tmp -= Number(simulation.monthlyAmount.split(' ').join('')) - cost;
                }
                return {
                    labels: ['Montant du prêt', 'Coût du prêt'],
                    datasets: [
                        {
                            backgroundColor: ['#212D59', 'rgba(71,81,117,0.45)'],
                            data: [loanAmount.toFixed(0), interestCost.toFixed(0)],
                            borderWidth: [2, 2]
                        }
                    ]
                };
            }
        }
    },
    methods: {
        formatAmount(value) {
            const index = this.simulations.findIndex((item) => item.id === this.editableTabsValue);
            this.simulations[index].monthlyAmount = Number(value.split(' ').join('')).formatMoney(0);
        },
        validate() {
            const simulationToSave = this.simulations.find((elem) => elem.id === this.editableTabsValue);
            const simulationIndex = this.simulations.indexOf(simulationToSave);
            var tmpSimulations = this.simulations;
            const requestBody = { 
                created: simulationToSave.created,
                id: simulationToSave._id,
                monthlyAmount: Number(simulationToSave.monthlyAmount.split(' ').join('')),
                loanDuration: Number(simulationToSave.loanDuration),
                interestRate: Number(simulationToSave.interestRate),
                insuranceRate: Number(simulationToSave.insuranceRate)
                };
            this.$http.post(this.$root.URL + '/credit/save-loan-capacity', requestBody).then(res => {
                tmpSimulations[simulationIndex]._id = res.data._id;
                tmpSimulations[simulationIndex].created = false;
                this.$message({
                    message: 'Simulation sauvegardée',
                    type: 'success'
                });
                this.change(tmpSimulations);
            });
        },
        addTab(targetName) {
            let newTabName = 1;
            let tmpSimulations = this.simulations;
            tmpSimulations.forEach((simulation) => {
                if (newTabName <= Number(simulation.id)) {
                    newTabName = Number(simulation.id) + 1;
                }
            });
            tmpSimulations.push({
                    created: true,
                    id: newTabName.toString(),
                    monthlyAmount: "0",
                    loanDuration: "0",
                    interestRate: "0",
                    insuranceRate: "0"
            });
            this.change(tmpSimulations);
            this.editableTabsValue = newTabName.toString();
        },
        handleClick(simulation) {
            if (simulation.name !== 'add tab') {
                this.editableTabsValue = simulation.name;
                const selectedIndex = this.simulations.findIndex((item) => item.id === simulation.name);
                this.$nextTick(() => this.$refs.slider1[selectedIndex].refresh());
                this.$nextTick(() => this.$refs.slider2[selectedIndex].refresh());
                this.$nextTick(() => this.$refs.slider3[selectedIndex].refresh());
            } else {
                this.addTab('newTab');
            }
        },
        removeTab(targetName) {
            if(this.simulations.length > 1) {
                let tabs = this.simulations;
                let activeName = this.editableTabsValue;
                let removedTab = tabs.find((item) => targetName === item.id);
                if (!removedTab.created) {
                    this.$http.post(this.$root.URL + '/credit/remove-loan-capacity', { id: removedTab._id }).then(res => {
                        if (res.data.success) {
                            if (activeName === targetName) {
                                tabs.forEach((tab, index) => {
                                    if (tab.id === targetName) {
                                        let nextTab = tabs[index + 1] || tabs[index - 1];
                                        if (nextTab) {
                                            activeName = nextTab.id;
                                        }
                                    }
                                });
                            }
                            const tmpSimulations = tabs.filter(tab => tab.id !== targetName);
                            this.change(tmpSimulations);
                            this.editableTabsValue = activeName;
                        } else {
                            this.$message.error('Erreur lors de la suppréssion');
                        }
                    });
                } else {
                    if (activeName === targetName) {
                        tabs.forEach((tab, index) => {
                            if (tab.id === targetName) {
                                let nextTab = tabs[index + 1] || tabs[index - 1];
                                if (nextTab) {
                                    activeName = nextTab.id;
                                }
                            }
                        });
                    }
                    
                    const tmpSimulations = tabs.filter(tab => tab.id !== targetName);
                    this.change(tmpSimulations);
                    this.editableTabsValue = activeName;
                }
            }
        }
    }
}
</script>

<style scoped>
    .chart-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 70vh;
    }
    .case-input-number {
        width: 40%;
        text-align: center;
        margin-bottom: 0.8rem;
    }
    .label { width: 60%; text-transform: uppercase; margin-bottom: -15px; text-align: left; color: #2B396A; opacity: 0.5; letter-spacing: 1px; font-weight: 400; font-size: 14  px; }
    .monthly-calculation-dialog {
        margin: auto;
    }
    .case-title {
        color: #212D59;
        font-size: 1.2rem;
        margin-top: 2rem;
        font-weight: 500;
    }
    .case-body {
        margin-top: 1rem;
    }
    .monthly-calculation-dialog h1 {
        font-size: 2rem;
         margin-bottom: 2rem;
         font-weight: bold;
         letter-spacing: normal;
    }
    .custom-legend {
        position: relative;
        top: -1.4rem;
        font-size: 10px;
        color: #00BBFF;
    }
    .custom-label-first {
        position: absolute;
        bottom: -3.3rem;
        font-size: 14px;
        color: #00BBFF;
        left: 4px;
        transform: translate(-50%, -12px);
        margin-left: 3px;
        width: 40px;
        top: 1.6rem;
        text-align: center;
    }
    .custom-label-last {
        position: absolute;
        bottom: -3.3rem;
        font-size: 14px;
        color: #00BBFF;
        left: -2px;
        transform: translate(-50%, -12px);
        margin-left: 3px;
        width: 40px;
        top: 1.6rem;
        text-align: center;
    }
    .custom-label {
        position: absolute;
        bottom: -3.3rem;
        font-size: 14px;
        color: #00BBFF;
        left: 0.2rem;
        transform: translate(-50%, -12px);
        margin-left: 3px;
        width: 40px;
        top: 1.6rem;
        text-align: center;
    }
    .form-container {
        border-right: 1px solid rgba(33,45,89,0.05);
    }
    .loan-price {
        margin-top: .5rem;
        width: 100%;
        color: #00BBFF;
        font-size: 1.5rem;
        font-weight: 700;
    }
    .loan-legend {
        color: #212D59;
        font-size: 1.2rem;
        margin-top: 2rem;
        display: flex;
    }
    .loan-legend-color {
        margin-top: 0.3rem;
        margin-right: 1rem;
        background-color: #212D59;
        width: 49px;
        height: 1rem;
        border-radius: 4px;
    }
    .insurance-legend {
        color: rgba(71,81,117,0.45);
        font-size: 1.2rem;
        margin-top: 2rem;
        display: flex;
    }
    .insurance-legend-color {
        margin-top: 0.3rem;
        margin-right: 1rem;
        background-color: rgba(71,81,117,0.45);
        width: 49px;
        height: 1rem;
        border-radius: 4px;
    }
    .el-button.validate {
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border: none;
        background-color: #31BDFC;
        color: white;
        width: 100%;
        font-size: 1.2rem;
        padding: 1.4rem 1rem;
        margin-bottom: 1rem;
        font-weight: 500;
    }
    .el-button:hover {
        opacity: 0.8;
    }
    .validate-row {
        margin-top: 5rem;
    }
    .chart {
        margin-top: 2.5rem;
    }
    .chart-blur-0 {
        filter: blur(20px);
        transition: all .3s linear;
    }
    .chart-blur-1 {
        filter: blur(15px);
        transition: all .3s linear;
    }
    .chart-blur-2 {
        filter: blur(10px);
        transition: all .3s linear;
    }
    .chart-blur-3 {
        filter: blur(5px);
        transition: all .3s linear;
    }
    .chart-blur-4 {
        filter: blur(0px);
        transition: all .3s linear;
    }

    /* 
    ##Device = Tablets, Ipads (portrait)
    ##Screen = B/w 768px to 1024px
    */

    @media (min-width: 768px) and (max-width: 1024px) {
        .form-container {
            border-right: none;
            border-bottom: 1px solid rgba(33,45,89,0.05);
            padding-bottom: 2rem;
        }

        .loan-legend {
            font-size: 0.8rem;
        }
        .insurance-legend {
            font-size: 0.8rem;
        }
        .loan-legend-color {
            height: 0.8rem;
        }
        .insurance-legend-color {
            height: 0.8rem;
        }
        .case-title {
            font-size: 0.9rem;
        }
        .loan-price {
            font-size: 1.1rem;
        }
    }

    /* 
    ##Device = Tablets, Ipads (landscape)
    ##Screen = B/w 768px to 1024px
    */

    @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
        .form-container {
            border-right: 1px solid rgba(33,45,89,0.05);
            border-bottom: none;
        }

        .loan-legend {
            font-size: 0.8rem;
        }
        .insurance-legend {
            font-size: 0.8rem;
        }
        .loan-legend-color {
            height: 0.8rem;
        }
        .insurance-legend-color {
            height: 0.8rem;
        }
        .case-title {
            font-size: 0.9rem;
        }
        .loan-price {
            font-size: 1.1rem;
        }
    }
</style>