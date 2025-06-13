<template>
    <div :class="(active)?'':'disabled'">
        <el-row class="question-body">
            <el-col :span="20">
                <vue-slider
                    ref="slider"
                    v-model="value"
                    @callback="select"
                    :height="10"
                    :interval="stepSize"
                    :formatter="value => ((value)?value.formatMoney(0):'0') + ' ' + name"
                    :min="minRange"
                    :bg-style="{backgroundColor:'#DEF3FE'}"
                    :process-style="{backgroundColor: '#31bdfc'}"
                    :slider-style="{backgroundColor: '#FFF', borderStyle: 'solid', borderColor: '#31bdfc', top: '-7px'}"
                    :tooltip-style="{backgroundColor: 'rgba(255, 255, 255, 0)', color: '#31bdfc', borderStyle: 'unset'}"
                    :max="maxRange"/>
            </el-col>
        </el-row>
        <el-row v-if="active" class="validate-row" align="bottom">
            <el-col :span="6">
                <el-button @click="validate" class="validate">Validez</el-button>
            </el-col>
        </el-row>
    </div> 
</template>

<script>
import vueSlider from 'vue-slider-component'
export default {
    name: 'RangeForm',
    components: {
        vueSlider
    },
    props: {
        'suffix' : String,
        'stepSize': Number,
        'minRange': Number,
        'maxRange': Number,
        'valueRange': [Array, Number],
        'select': Function,
        'validate': Function,
        'active': {
            default: true,
            type: Boolean
        },
    },
    data() {
        return {
            value: this.valueRange,
            name: "m2"
        };
    },
    methods: {
        refresh(valueRange) {
            this.value = valueRange
            this.$refs.slider.refresh();
        }
    },
    created() {
        if (this.suffix) this.name = this.suffix;
    }
}
</script>

<style scoped>
    .validate-row {
        margin-top: 5rem;
    }
    .el-button.validate {
        border: 1px #E7E9ED;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        background-color: #31BDFC;
        color: white;
        font-weight: 300;
        width: 100%;
        font-size: 15px;
        padding: 15px 15px;
        margin-bottom: 15px;
    }
    .el-button:hover {
        opacity: 0.8;
    }
    .question-body {
        margin-top: 4rem;
    }
    .disabled {
        pointer-events: none;
    }
</style>