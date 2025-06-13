<template>
    <div :class="(active)?'btn-container':'btn-container disabled'">
        <el-row v-for="(input, index) in inputs" :key="index" :class="(input.type === 'slider')?'btn-row slider-container':'btn-row'">
            <el-col :span="(input.type === 'slider')?16:10">
                    {{input.name}} <span v-if="input.required">*</span>
                <div  v-if="input.type === 'slider'">
                    <vue-slider
                        class="slider-offset"
                        ref="slider"
                        v-model="answers[index]"
                        @callback="sendData"
                        :height="10"
                        :interval="0.5"
                        :formatter="(value) => getValueString(value)"
                        :min="0"
                        :bg-style="{backgroundColor:'#DEF3FE'}"
                        :process-style="{backgroundColor: '#31bdfc'}"
                        :slider-style="{backgroundColor: '#FFF', borderStyle: 'solid', borderColor: '#31bdfc', top: '-7px', cursor: 'pointer'}"
                        :tooltip-style="{backgroundColor: 'rgba(255, 255, 255, 0)', color: '#31bdfc', borderStyle: 'unset'}"
                        :max="20"/>
                    <el-input style="width: 30%;" type="number" @change="sendData" v-model="answers[index]"><template slot="append">m</template></el-input>
                </div>
                <maps-input v-else-if="input.type == 'gMaps'" @input="sendData" :placeholder="input.placeholder" v-model="answers[index]" @select="selectData"/>
                <el-input v-else :type="input.type" @change="sendData" :placeholder="input.placeholder" v-model="answers[index]" ></el-input>
            </el-col>
        </el-row>
        <el-row class="validate-row" align="bottom">
            <el-col :span="6">
                <el-button @click="checkRequired" class="validate">Valider</el-button>
            </el-col>
            <el-col :span="6">
                <el-button v-if="rejection" @click="reject" class="reject">{{rejection.name}}</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import MapsInput from '../MapsInput.vue'
import vueSlider from 'vue-slider-component'
export default {
    name: 'MultiInputForm',
    components: {
        "maps-input": MapsInput,
        vueSlider
    },
    props: {
        'inputs': Array,
        'selected': [Object, Array, String],
        'select': Function,
        'multi': {
            default: false,
            type: Boolean
        },
        rejection: {
            name: String,
            value: String,
        },
        'validate': Function,
        'active': {
            default: true,
            type: Boolean
        }
    },
    data () {
        return {
            answers: this.selected,
        }
    },
    beforeMount() {
        // this.inputs.forEach(input => {
        //     this.answers.push("")
        // })
    },
    computed : {
    },
    methods: {
        getValueString(value) {
            if (value !== undefined && value !== null && value != "") {
                return (value.toString() + ' m');
            } else {
                return ("0 m")
            }
            return (value)
        },
        refresh(newAnswers) {
            this.answers = newAnswers;
        },
        reject() {
            this.rejection.function(this.rejection.value)
            this.validate()
        },
        selectData(data) {
            this.select(data, "autocomplete")
        },
        sendData() {
            this.select(this.answers)
        },
        checkRequired() {
            for (var i = 0; i < this.answers.length; i++) {
                if (this.answers[i] == "" && this.inputs[i].required) return (this.$message.error("Merci de renseigner les champs dotés d'une étoile"))
            }
            this.validate()
        },
        selectAnswer(answer) {
            if (!this.multi && JSON.stringify(answer) === JSON.stringify(this.selected)) {
                this.select(null);
            } else if (this.multi) {
                const index = this.selected.findIndex((item) => JSON.stringify(item) === JSON.stringify(answer));
                var selectedArray = this.selected;
                if (index !== -1) {
                    selectedArray.splice(index, 1);
                } else {
                    selectedArray.push(answer);
                }
                this.select(selectedArray);
            } else {
                this.select(answer);
            }
        }
    }
}
</script>

<style scoped> 
    .slider-offset {
        display: inline-table;
        width: 65% !important;
        margin-right: 1rem;
        margin-top: 2rem;
    }
    .slider-container:first-of-type{
        margin-bottom: 2rem;
    }
    .reject {
        margin-left: 50px;
        width: auto;
        border: 1px #E7E9ED;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        background-color: #31BDFC;
        color: white;
        font-weight: 300;
        /* width: 100%; */
        font-size: 15px;
        padding: 15px 15px;
        margin-bottom: 15px;
    }
    .validate-row {
        margin-top: 3rem;
    }
    .btn-container {
        padding-top: 3rem;
    }
    .btn-row {
        margin-top: 0.1rem;
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
    .el-button.pending {
        border: 1px #E7E9ED;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        background-color: white;
        color: #31BDFC;
        font-weight: 300;
        /* width: 100%; */
        font-size: 15px;
        padding: 15px 15px;
        margin-bottom: 15px;
    }
    .el-button:hover {
        opacity: 0.8;
    }
    .el-button:focus, .el-button:active {
          border: solid 1px #31BDFC;
        transition: border-width 0.6s linear;
        animation: flash .6s linear;
    }
    .disabled {
        pointer-events: none;
    }
</style>