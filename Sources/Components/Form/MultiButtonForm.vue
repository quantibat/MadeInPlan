<template>
    <div :class="getContainerClass()">
        <el-row v-for="answer in answers" :class="getRowClass()">
                <el-button v-tooltip="answer.tooltip" @click="selectAnswer(answer)" :class="getRightButtonClass(answer)">{{answer.name}}</el-button>
        </el-row>
        <el-row v-if="multi && active && requireValidation" class="validate-row" align="bottom">
            <el-col :span="6">
                <el-button @click="callValidate" class="validate">Validez</el-button>
            </el-col>
        </el-row>
    </div> 
</template>

<script>
export default {
    name: 'MultiButtonForm',
    props: {
        'answers': Array,
        'selected': [Object, Array],
        'select': Function,
        'multi': {
            default: false,
            type: Boolean
        },
        'validate': Function,
        'requireValidation': {
            default: true,
            type: Boolean
        },
        'crowded': {
            default: false,
            type: Boolean
        },
        'active': {
            default: true,
            type: Boolean
        }
    },
    methods: {
        callValidate() {
            if (!this.selected) this.select([])
            this.validate()
        },
        getRowClass() {
            if (this.crowded) return ("btn-row-crowded")
            return ("btn-row")
        },
        getContainerClass() {
            var className = "";
            if (this.crowded) className = "btn-container-crowded";
            else className = "btn-container"
            if (!this.active) className += " disabled"
            return (className)
        },
        selectAnswer(answer) {
            if (!this.selected) this.selected = [];
            if (this.selected && this.multi) {
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
        },
        getRightButtonClass(data) {
            if (!this.multi) {
                return ((JSON.stringify(data) === JSON.stringify(this.selected))?'validate':'pending');
            } else {
                if (!this.selected) return ('pending')
                return ((this.selected.findIndex((item) => JSON.stringify(item) === JSON.stringify(data)) !== -1)?'validate':'pending');
            }
        }
    }
}
</script>

<style scoped>
    .validate-row {
        margin-top: 2rem;
    }
    .btn-container {
        padding-top: 4rem;
        /* display: block; */
    }
    .btn-container-crowded {
        padding-top: 4rem;
        /* display: block; */
    }
    .btn-row {
        /* display: flex; */
        width: 55%;
        margin-right: 3%;
        margin-top: 0.3rem;
    }

    .btn-row-crowded {
        display: inline-block;
        width: 30%;
        margin-right: 3%;
        margin-top: 0.1rem;
    }
    .el-button.validate {
        border: 1px #E7E9ED;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        background-color: #31BDFC;
        color: white;
        font-weight: 400;
        font-size: .83rem;
        padding: 15px 15px;
        margin-bottom: 15px;
    }
    .el-button.pending {
        border: 1px #E7E9ED;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        background-color: white;
        color: #31BDFC;
        font-weight: 400;
        /* width: 100%; */
        font-size: .83rem;
        padding: 15px 15px;
        margin-bottom: 15px;
    }

    .el-button.validate, .el-button.pending {
            width: 103%;
    }
    .el-button:hover {
        opacity: 0.8;
    }
    .el-button:focus, .el-button:active {
          border: solid 1px #31BDFC;
        transition: border-width 0.6s linear;
        /* animation: flash .6s linear; */
    }
    .disabled {
        pointer-events: none;
    }
</style>