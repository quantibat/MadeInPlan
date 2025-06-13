<template>
    <div>
       <button type="button" aria-label="Close" class="el-dialog__headerbtn btn-close" @click="$router.go(-1)">
           <i class="el-dialog__close el-icon-close"/>
       </button>
        <el-container>
            <el-main id="q-active" class="st-scroll">
                <el-row type="flex"  v-if="currentQuestion < questions.length">
                    <el-col :xs="1" :sm="2" :md="4" :lg="6" :xl="6">
                        <div style="width: 100%; height: 100%" @click="$router.go(-1)"/>
                    </el-col>
                    <el-col :xs="21" :sm="20" :md="18" :lg="16" :xl="16">
                        <div style="width: 100%; height: 20rem;" @click="$router.go(-1)" />
                        <div v-for="(question, index) in questions" :key="index" class="question" :class="(currentQuestion === index)?'active':'transparent'" @click="handleQuestionClick(index)">
                            <el-row>
                                <el-col :span="24">
                                    <h1 class="question-title"><span class="question-number">{{index + 1}} →</span> {{question.title}}</h1>
                                </el-col>
                            </el-row>
                            <multibutton-form
                                v-if="question.type === 'multibutton'"
                                :active="currentQuestion === index"
                                :multi="question.multipleAnswer"
                                :validate="() => nextQuestion(currentQuestion)"
                                :selected="results[question.resultName]"
                                :select="(answer) => selectAnswer(answer, question.resultName, question.multipleAnswer)"
                                :answers="question.answers" />
                            <range-form
                                v-if="question.type === 'range'"
                                :ref="'slider'+index"
                                :active="currentQuestion === index"
                                :validate="() => nextQuestion(currentQuestion)"
                                :value-range="results[question.resultName]"
                                :select="(answer) => selectAnswer(answer, question.resultName, true)"
                                :min-range="question.options.minRange"
                                :step-size="question.options.stepSize"
                                :max-range="question.options.maxRange" />
                            <tile-form
                                v-if="question.type === 'tile'"
                                :active="currentQuestion === index"
                                :multi="question.multipleAnswer"
                                :validate="() => nextQuestion(currentQuestion)"
                                :selected="results[question.resultName]"
                                :select="(answer) => selectAnswer(answer, question.resultName, question.multipleAnswer)"
                                :tiles="question.answers" />
                            <minitile-form
                                v-if="question.type === 'minitile'"
                                :active="currentQuestion === index"
                                :multi="question.multipleAnswer"
                                :validate="() => nextQuestion(currentQuestion)"
                                :selected="results[question.resultName]"
                                :select="(answer) => selectAnswer(answer, question.resultName, question.multipleAnswer)"
                                :tiles="question.answers" />
                            <text-form
                                v-if="question.type === 'text'"
                                :ref="'text'+index"
                                :active="currentQuestion === index"
                                :validate="() => nextQuestion(currentQuestion)"
                                v-model="results[question.resultName]"
                                :placeholder="question.options.placeholder" />
                        </div>
                    </el-col>
                </el-row>
            </el-main>
            <nav v-if="questions.length != currentQuestion" id="pieces" class="recap-container aside" style="overflow: hidden;" :class="!isDone?'':'done'">
                <h3>{{recap.name}}</h3>
                <ul id="pieces-container" style="overflow: auto;">
                    <li v-for="(answer, index) in generatedRecap" :id="'document' + index" :key="index">
                        <i class="el-icon-check"></i> {{answer}}
                    </li>
                    <div id="scroll-me"></div>
                </ul>

            </nav>
            <nav v-if="questions.length == currentQuestion" id="pieces" style="overflow: hidden;" class="recap-container full">
                <h3>{{recap.name}}</h3>
                <ul id="pieces-container" style="overflow: auto;">
                    <li v-for="(answer, index) in generatedRecap" :id="'document' + index" :key="index">
                        <i class="el-icon-check"></i> {{answer}}
                    </li>
                    <div id="scroll-me"></div>
                </ul>
            </nav>
            <form-footer
                :first-question="firstQuestion"
                :progress="progress"
                :current-question="currentQuestion"
                :total-questions="questions.length"
                :next-question="() => nextQuestion(currentQuestion)"
                :prev-question="() => previousQuestion(currentQuestion)" />
        </el-container>
    </div>
</template>

<script>
import FormFooter from './Form/FormFooter.vue'
import TileForm from './Form/TileForm.vue'
import RangeForm from './Form/RangeForm.vue'
import MultiButtonForm from './Form/MultiButtonForm.vue'
import MiniTileForm from './Form/MiniTileForm.vue'
import TextForm from './Form/TextForm.vue'
export default {
    name: 'TemplateForm',
    components: {
        'form-footer': FormFooter,
        'tile-form': TileForm,
        'range-form': RangeForm,
        'multibutton-form': MultiButtonForm,
        'minitile-form': MiniTileForm,
        'text-form': TextForm
    },
    props: {
        'name': String,
        'questions': Array,
        'recap': Object
    },
    data() {
        const basis = {};
        this.questions.forEach((question) => {
            basis[question.resultName] = question.baseResult;
        });
        return {
            currentQuestion: 0,
            results: basis
        }
    },
    mounted() {
        window.addEventListener('keydown', this.handleEvents);
        this.$root.$el.offsetParent.style.overflow= 'hidden';
        this.$http.get(this.$root.URL + '/form/get?name='+this.name).then(res => {
             this.fillForm(res.data.result);
        }, err => {
            const basis = {};
            this.questions.forEach((question) => {
                basis[question.resultName] = question.baseResult;
            });
            this.fillForm(basis);
        });
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleEvents);
        this.$root.$el.offsetParent.style.overflow= 'auto';
    },
    computed: {
        generatedRecap: function() {
            let recap = [];
            for (var i=0; i<this.questions.length;i++) {
                const question = this.questions[i];
                if (question.type === 'range') {
                    if (this.results[question.resultName][0] !== question.options.minRange || this.results[question.resultName][1] !== question.options.maxRange)
                        recap.push(question.options.answerPreffix + ' ' + this.results[question.resultName][0] + '-' + this.results[question.resultName][1] + ' ' + question.options.answerSuffix);
                } else if (question.type === 'text') {
                    if (this.currentQuestion > i)
                        recap.push((this.results[question.resultName] === '')?'Champ vide':'Champ rempli');
                } else {
                    if (question.multipleAnswer && this.results[question.resultName].length > 0)
                         recap.push(question.options.answerPreffix + ' ' + this.results[question.resultName].length + ' ' + question.options.answerSuffix);
                    else if (!question.multipleAnswer && this.results[question.resultName] !== null)
                        recap.push(this.results[question.resultName].answer);
                }
            }
            return recap;
        },
        progress: function() {
            let p = 0;
            for (var i=0; i< this.questions.length; i++) {
                let question = this.questions[i];
                if (question.type === 'range') {
                    if (this.results[question.resultName][0] !== question.options.minRange || this.results[question.resultName][1] !== question.options.maxRange)
                        p++;
                } else if (question.isRequired) {
                    if (question.multipleAnswer && this.results[question.resultName].length > 0)
                        p++;
                    else if (!question.multipleAnswer && this.results[question.resultName] !== null)
                        p++;
                } else {
                    if (this.currentQuestion >= i || this.results[question.resultName] !== '')
                        p++;
                }
            }
            return p;
        }
    },
    watch: {
        currentQuestion: function (newQuestion, oldQuestion) {
            const scrollLength = newQuestion * 30;
            document.getElementById('q-active').style.WebkitTransform = 'translateY(-' + scrollLength + 'rem)';
            // Code for IE9
            document.getElementById('q-active').style.msTransform = 'translateY(-' + scrollLength + 'rem)';
            // Standard syntax
            document.getElementById('q-active').style.transform = 'translateY(-' + scrollLength + 'rem)';
        }
    },
    methods: {
        firstQuestion(questionNbr)  {
            this.currentQuestion = 0;
        },
        fillForm(base) {
            const basis = {};
            this.questions.forEach((question) => {
                basis[question.resultName] = question.baseResult;
            });
            this.results = basis;
            for (var key in base)
                this.results[key] = base[key];
            for (var i=0; i< this.questions.length; i++) {
                if (this.questions[i].type === 'range')
                    this.$refs['slider'+i][0].refresh(this.results[this.questions[i].resultName]);
            }
        },
        handleEvents(event) {
            if (event.which == 40 || event.keyCode == 40) {
                this.nextQuestion(this.currentQuestion);
            } else if (event.which == 38 || event.keyCode == 38) {
                if (this.currentQuestion > 0)
                    this.previousQuestion(this.currentQuestion);
            } else if (event.which === 27 || event.keyCode === 27) {
                this.$router.go(-1);
            } else if (event.which == 13 || event.keyCode == 13) {
                if (this.currentQuestion !== 7 && this.currentQuestion !== 8)
                    this.nextQuestion(this.currentQuestion);
            }
        },
        handleQuestionClick(questionNumber) {
            if (questionNumber !== this.currentQuestion) {
                if (questionNumber > this.currentQuestion) {
                    this.nextQuestion(this.currentQuestion);
                }
            }
        },
        selectAnswer(answer, field, multi) {
            this.results[field] = answer;
            if (!multi && answer !== null)
               window.setTimeout(() => this.nextQuestion(this.currentQuestion), 500);
        },
        saveForm() {
            this.$http.post(this.$root.URL + '/form/save?name='+this.name, this.results).then(res => {
                this.fillForm(res.data.result);
            });
        },
        forgotQuestionMessage() {
            this.$message.error('Vous n\'avez pas répondu à la question 🙂 !');
        },
        nextQuestion(questionNbr) {
            const question = this.questions[questionNbr];
            let validate = false;
            if (this.results[question.resultName] === undefined)
                this.forgotQuestionMessage();
            else {
                if (question.type === 'range') {
                    if (this.results[question.resultName][0] === question.options.minRange && this.results[question.resultName][1] === question.options.maxRange)
                        this.forgotQuestionMessage();
                    else
                        validate = true;
                }
                else if (question.isRequired) {
                    if (question.multipleAnswer && this.results[question.resultName].length > 0)
                        validate = true;
                    else if (!question.multipleAnswer && this.results[question.resultName] !== null)
                        validate = true;
                    else
                        this.forgotQuestionMessage();
                } else
                    validate = true;

            }
            if (validate) {
                this.currentQuestion = questionNbr + 1;
                this.saveForm();
            }
        },
        previousQuestion(questionNbr) {
            this.currentQuestion = questionNbr - 1;
        }
    }
}
</script>

<style scoped>
nav ul{ width:380px;}
    .recap-container.full {
        width: 40%;
        height: 50vh;
        margin-right: 32%;
        border: none;
        border-radius: 5px;
        box-shadow: 0 0 8px 4px rgba(0, 0, 0, .05);
        margin-top: 15rem;
    }
    .recap-container.aside {
        width: 500px;
    }
    .recap-container {
        margin-top: 20rem;
        margin-right: 10%;
        border: 1px solid rgba(33, 45, 89, 0.1);
        overflow: auto;
        max-height: 50vh;
        width: 500px;
        box-shadow: 0 4px 4px rgba(0, 0, 0, .05);
    }
    .recap-container h3 {
        color: rgba(33, 45, 89, 0.3);
        font-weight: 500;
        text-align: center;
        font-size: 1.2rem;
    }
    .recap-container ul {
        width: auto;
        list-style: none;
        padding: 0 1.4rem;
        color: rgba(33, 45, 89, .8);
        font-size: .85rem;
        height: 75%;
    }
    .recap-container i {
        color: #00BBFF;
    }
    .recap-container li {
        transition: all .4s linear;
        padding-bottom: .5em;
    }
    .btn-close {
        right: 10%;
        top: 2rem;
        z-index: 9999;
    }
    .question-title {
        font-size: 2rem;
        letter-spacing: normal;
    }
    .question-number {
        color: #31bdfc;
    }
    .active {
        opacity: 1;
    }
    .transparent {
        opacity: 0.2;
    }
    .st-scroll {
        top: 0;
        left: 0;
        transition: all 0.6s ease-in-out;
        
        /* Let's enforce some hardware acceleration */
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
    }
    .last-question {
        height: 30rem;
        margin-bottom: 30rem;
    }
    .question {
        height: 30rem;
    }
    .el-main {
        color: #333;
        
    }
    /* 
  ##Device = Laptops, Desktops
  ##Screen = B/w 1025px to 1280px
*/

@media (min-width: 1025px) and (max-width: 1280px) {
  
  /* .recap-container {
      margin-right: 5rem;
  } */
  
}

/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {
  
  .recap-container {
      margin-right: 2rem;
  }

  .recap-container.aside {
        width: 800px;
    }

    .recap-container.full {
        width: 60%;
        margin-right: 20%;
    }
    .question-title {
        font-size: 1.5rem;
    }
  
}

/* 
  ##Device = Tablets, Ipads (landscape)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  
    .recap-container {
        margin-right: 2rem;
    }

    .recap-container.aside {
        width: 500px;
    }

    .recap-container.full {
        margin-top: 10rem;
        width: 40%;
        margin-right: 32%;
    }
    .question-title {
        font-size: 1.5rem;
    }
  
}
</style>