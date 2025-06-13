<template>
   <div :class="(active)?'':'disabled'">
       <el-row class="question-row">
           <el-col :span="20">
               <textarea :placeholder="placeholder" class="text-description" :value="value"  @input="$emit('input', $event.target.value)"></textarea>
           </el-col>
       </el-row>
        <el-row v-if="active" class="validate-row" align="bottom">
            <el-col :span="6">
                <el-button @click="doValidate" class="validate">Valider</el-button>
            </el-col>
        </el-row>
   </div>
</template>

<script>
export default {
    name: 'TextForm',
    props: {
        'value': {
        default: null,
        type: String
        },
        'placeholder': String,
        'validate': Function,
        'active': {
            default: true,
            type: Boolean
        }
    },
    methods: {
        doValidate() {
            if (this.value == null) this.$emit('input', "")
            this.validate()
        }
    }
}
</script>

<style scoped>
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
    .validate-row {
        margin-top: 3rem;
    }
    .question-row {
        margin-top: 3rem;
    }
    .text-description {
        border: none;
        box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 );
        border-radius: 4px;
        color: rgba(35, 49, 88, .9);
        padding: 1rem 1.5rem !important;
        position: relative;
        overflow: auto;
        width: 100%;
        font-size: 13px;
        height: 8rem;
    }
    textarea {
        resize: none;
        outline: none;
    }
    textarea::placeholder {
        color: rgba(35, 49, 88, .3);
    }
    .disabled {
        pointer-events: none;
    }
</style>