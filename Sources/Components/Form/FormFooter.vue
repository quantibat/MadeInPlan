<template>
   <div>
        <el-footer>
            <el-row align="bottom" class="footer-text">
                <el-col :offset="6" :span="5">
                    {{ progress }} sur {{ totalQuestions }} répondues
                </el-col>
                    <el-col :offset="3" :span="8" style="margin-top: 8px;" v-if="currentQuestion < totalQuestions">
                        <el-button-group>
                            <el-button size="small" type="primary" :disabled="(currentQuestion <= 0)?true:false" icon="el-icon-arrow-up" v-on:click="prevQuestion()"></el-button>
                            <el-button size="small" type="primary" :disabled="(currentQuestion > totalQuestions)?true:false" v-on:click="nextQuestion()"><i class="el-icon-arrow-down el-icon-down"></i></el-button>
                        </el-button-group>
                    </el-col>
                    <el-col v-else :offset="3" :span="8" style="margin-top: 8px;">
                        <el-button size="small" type="primary" class="update" v-on:click="firstQuestion()">Modifier</el-button>
                    </el-col>
            </el-row>
            <el-row>
                    <el-col :offset="6" :span="5">
                        <el-progress style="position: relative; top: -.9rem;" :percentage="(progress/totalQuestions)*100" :stroke-width="10" color="#31bdfc" :show-text="false"></el-progress>
                    </el-col>
            </el-row>
        </el-footer>
   </div>
</template>

<script>
export default {
    name: 'FormFooter',
    props: {
        'progress': Number,
        'totalQuestions': Number,
        'currentQuestion': Number,
        'nextQuestion': Function,
        'prevQuestion': Function,
        'firstQuestion': Function
    },
}
</script>

<style scoped>
    .footer-text {
        margin-top: 10px;
        margin-bottom: 0;
        /* margin-bottom: -1rem; */
        font-size: .95rem;
        padding-left: 0.5rem;
        color: rgba(35, 49, 88, .6);
    }
    .el-footer {
        background-color: #fafbfc;
        border-top: #edeef1;
        border-top-width: 2px;
        border-top-style: solid;
        color: #525A7C;
        min-height: 3.5rem;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 90px !important;
        line-height: 45px;
        /* margin: 2rem 0 2.5rem; */
        /* paddings: .8rem; */
    }
    .el-button.update {
        width: auto;
        font-size: 1.2rem;
        padding: 0px 1.5rem;
    }
    .el-button   {
        font-size: 1.5rem;
        border-radius: 5px !important;
        background: linear-gradient(5deg,#31bdfc,#00d3f7);
        border: none;
        width: 55px;
        line-height: 25px;
        height: 50px;
        text-align: center;
        box-shadow: 0 2px 8px 2px rgba(0, 0, 0, .09);
        transition: .2s linear;
    }

      .el-button:hover {
          box-shadow: 0 5px 8px 0px rgba(0, 0, 0, .15);
          transform: scale(1.01);
          transition: .2s linear;
      }

      .el-button:focus, .el-button:active {
          box-shadow: 0 2px 1px 0px rgba(0, 0, 0, .15);
          transform: scale(1.01);
          transition: .2s linear;
      }

    .el-button.is-disabled {
        opacity: .2;
        background: linear-gradient(5deg,#31bdfc,#00d3f7);
    }
        .el-button.is-disabled:hover {
        opacity: .2;
        background: linear-gradient(5deg,#31bdfc,#00d3f7);
    }
</style>