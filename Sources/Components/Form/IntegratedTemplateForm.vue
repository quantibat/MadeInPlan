<template>
    <div class="form-container">
        <div class="start-survey" v-show="!isStarted && progress == 0">
            <button @click="getStarted">Configurer mon plan</button>
        </div>
        <el-container>
            <el-main id="q-active" class="st-scroll" style="flex:2;">
                <el-row type="flex">
                    <el-col :xs="0" :sm="0" :md="0" :lg="2" :xl="2">
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="20">
                        <div v-for="(question, index) in questions" class="question" :class="(currentQuestion === index)?'active':'transparent'" @click="handleQuestionClick(index)">
                            <el-row>
                                <el-col :span="24">
                                    <h1 class="question-title"><span class="question-number">{{index + 1}} →</span> {{question.title}}</h1>
                                    <div class="question-subtitle" v-html="question.subtitle"></div>
                                </el-col>
                            </el-row>
                            <multibutton-form v-if="question.type === 'multibutton'" crowded :active="currentQuestion === index" :multi="question.multipleAnswer" :validate="() => nextQuestion(currentQuestion)" :selected="results[question.resultName]" :select="(answer) => selectAnswer(answer, question.resultName, question.multipleAnswer)" :answers="question.answers" />

                            <range-form v-if="question.type === 'range'" :ref="'slider'+index" :suffix="question.options.suffix" :active="currentQuestion === index" :validate="() => nextQuestion(currentQuestion)" :value-range="results[question.resultName]" :select="(answer) => selectAnswer(answer, question.resultName, true)" :min-range="question.options.minRange" :step-size="question.options.stepSize" :max-range="question.options.maxRange" />

                            <tile-form v-if="question.type === 'tile'" :active="currentQuestion === index" :multi="question.multipleAnswer" :validate="() => nextQuestion(currentQuestion)" :selected="results[question.resultName]" :select="(answer) => selectAnswer(answer, question.resultName, question.multipleAnswer)" :tiles="question.answers" />

                            <icon-button v-if="question.type === 'iconbutton'" :active="currentQuestion === index" :multi="question.multipleAnswer" :validate="() => nextQuestion(currentQuestion)" :selected="results[question.resultName]" :select="(answer) => selectAnswer(answer, question.resultName, question.multipleAnswer)" :tiles="question.answers" />

                            <minitile-form v-if="question.type === 'minitile'" :active="currentQuestion === index" :multi="question.multipleAnswer" :validate="() => nextQuestion(currentQuestion)" :selected="results[question.resultName]" :select="(answer) => selectAnswer(answer, question.resultName, question.multipleAnswer)" :tiles="question.answers" />

                            <text-form v-if="question.type === 'text'" :ref="'text'+index" :active="currentQuestion === index" :validate="() => nextQuestion(currentQuestion)" v-model="results[question.resultName]" :placeholder="question.options.placeholder" />
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
            <nav v-if="questions.length == currentQuestion" id="pieces" style="overflow: hidden;  " class="recap-container full">
                <h3>{{recap.name}}</h3>
                <ul id="pieces-container" style="overflow: auto;">
                    <li v-for="(answer, index) in generatedRecap" :id="'document' + index" :key="index">
                        <i class="el-icon-check"></i> {{answer}}
                    </li>
                    <div id="scroll-me"></div>
                    <!-- <el-button size="small" type="primary" class="update" @click="emitDone()">Générer un plan</el-button> -->
                </ul>
            </nav>
            <form-footer :progress="progress" :current-question="currentQuestion" :total-questions="questions.length" :next-question="() => nextQuestion(currentQuestion)" :prev-question="() => previousQuestion(currentQuestion)" :first-question="() => firstQuestion(currentQuestion)"/>
        </el-container>
    </div>
</template>

<script>
import FormFooter from './../Form/FormFooter.vue'
import TileForm from './../Form/TileForm.vue'
import IconButtonForm from './../Form/IconButtonForm.vue'
import RangeForm from './../Form/RangeForm.vue'
import MultiButtonForm from './../Form/MultiButtonForm.vue'
import MiniTileForm from './../Form/MiniTileForm.vue'
import TextForm from './../Form/TextForm.vue'
export default {
    name: 'TemplateForm',
    components: {
        'icon-button': IconButtonForm,
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
            results: basis,
            isStarted: false
        }
    },
    mounted() {
        window.addEventListener('keydown', this.handleEvents);
        this.$root.$el.offsetParent.style.overflow= 'hidden';
        this.$http.get(this.$root.URL + '/form/get?name='+this.name).then(res => {
            this.fillForm(res.data.result);
            this.currentQuestion = this.progress;
            if (this.currentQuestion < this.progress) this.currentQuestion += 1;
            this.isDone = true;
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
                    if (this.results[question.resultName][0] !== question.options.minRange || this.results[question.resultName][1] !== question.options.maxRange) {
                        recap.push(question.options.answerPreffix + ' ' + this.results[question.resultName][0] + question.options.answerSuffix + ' à ' + this.results[question.resultName][1] + ' ' + question.options.answerSuffix);
                    }
                } else if (question.type === 'text') {
                    if (this.currentQuestion > i) {
                        if (this.results[question.resultName] !== '') {
                            recap.push('Commentaire : ' + this.results[question.resultName])
                        }
                    }
                } else {
                    if (question.multipleAnswer && this.results[question.resultName] && this.results[question.resultName].length > 0) {
                        var completeAnswer = question.options.answerPreffix + ' ';
                        this.results[question.resultName].forEach((answer, index) => {
                            if (index == 0 && answer.firstAnswer && index != this.results[question.resultName].length - 1)
                            completeAnswer += answer.firstAnswer + question.options.answerSeparator;
                            else if (index == 0 && answer.firstAnswer && index == this.results[question.resultName].length - 1)
                            completeAnswer += answer.firstAnswer;
                            else if (index == this.results[question.resultName].length - 1)
                            completeAnswer += answer.answer;
                            else if (question.options.answerSeparator)
                            completeAnswer += answer.answer + question.options.answerSeparator;
                        })
                        if (question.options.answerSuffix) completeAnswer += question.options.answerSuffix;
                        recap.push(completeAnswer);
                    }
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
                    if (this.results[question.resultName][0] !== question.options.minRange || this.results[question.resultName][1] !== question.options.maxRange) {
                        p++;
                    }
                } else if (question.isRequired) {
                    if (question.multipleAnswer && this.results[question.resultName] && this.results[question.resultName].length > 0) {
                        p++;
                    }
                    else if (!question.multipleAnswer && this.results[question.resultName] && this.results[question.resultName] !== null) {
                        p++;
                    }
                } else if (question.type == 'text') {
                    if (this.results[question.resultName] != null) p++
                } else {
                    if (question.multipleAnswer && question.type == 'multibutton' && this.results[question.resultName]) {
                        p++;
                    }
                    else if (this.currentQuestion > i && question.multipleAnswer == true && !question.isRequired) {
                        p++
                    }
                    else if (this.currentQuestion >= i || this.results[question.resultName] !== '') {
                        if (question.multipleAnswer && this.results[question.resultName] && this.results[question.resultName].length > 0)
                        p++;
                        else if (!question.multipleAnswer)
                        p++;
                    }
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
        getStarted() {
            this.isStarted = true;
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
                    else validate = true;
                }
                else if (question.isRequired) {
                    if (question.multipleAnswer && this.results[question.resultName].length > 0)
                    validate = true;
                    else if (!question.multipleAnswer && this.results[question.resultName] !== null)
                    validate = true;
                    else
                    this.forgotQuestionMessage();
                } else validate = true;
            }
            if (validate) {
                this.currentQuestion = questionNbr + 1;
                if (this.currentQuestion == this.questions.length) {
                    this.$message.success('Bravo ! Nous revenons vers vous avec quelque chose de sympa 😉');
                    this.emitDone();
                }
                this.saveForm();
            }
        },
        emitDone() {
            this.$emit('done', this.results);
        },
        previousQuestion(questionNbr) {
            this.currentQuestion = questionNbr - 1;
        },
        firstQuestion(questionNbr)  {
            this.currentQuestion = 0;
        }
    }
}
</script>

<style scoped>
nav ul{ width:380px; }

.el-button.update {
    width: auto;
    font-size: 1.2rem;
    padding: 0px 1.5rem;
    font-size: 1.5rem;
    border-radius: 5px !important;
    background: linear-gradient(5deg,#31bdfc,#00d3f7);
    border: none;
    line-height: 25px;
    height: 50px;
    text-align: center;
    box-shadow: 0 2px 8px 2px rgba(0, 0, 0, .09);
    transition: .2s linear;
}

.el-button.update:hover {
    box-shadow: 0 5px 8px 0px rgba(0, 0, 0, .15);
    transform: scale(1.01);
    transition: .2s linear;
}

.start-survey button {
    position: absolute;
    left: calc(50% - 197px);
    background: #31BDFC;
    color: #fff;
    padding: 1rem 3rem;
    font-size: 1.5rem;
    border: none;
    border-radius: 5px;
    margin-top: 30vh;
    box-shadow: 0 0 69px 0px rgba(0, 0, 0, .2);
    cursor: pointer;
}

.start-survey {
    background: rgba(255, 255, 255, 0.7);
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
}

.recap-container.full {
    width: 35%;
    height: 50vh;
    margin-right: 34%;
    border: none;
    border-radius: 7px;
    animation: float 2.5s ease-in-out infinite;
    margin-top: 2rem;
}
.recap-container {
    width: 400px;
    margin-top: 2rem;
    margin-right: 10%;
    overflow: auto;
    max-height: 50vh;
    border-radius: 7px;
    padding: 1rem 1.5rem;
    animation: float 2.5s ease-in-out infinite;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}
.recap-container::after {
    content: url(../../Assets/bg-plans.svg);
    position: absolute;
    top: -2rem;
    right: -2rem;
    width: 50%;
    opacity: .05;
}
.recap-container h3 {
    color: rgba(33, 45, 89, .9);
    font-weight: 500;
    text-align: center;
    font-size: 1.2rem;
    display: inline-block;
    position: relative;
}

.recap-container h3::after {
    display: block;
    content: '';
    width: 20%;
    /* margin: auto; */
    height: 3px;
    background: #00BBFF;
    border-radius: 500px;
}
.recap-container.full ul { font-size: 1rem; }
.recap-container ul {
    width: auto;
    list-style: none;
    padding: 0 1.4rem;
    color: rgba(33, 45, 89, .8);
    font-size: .85rem;
    height: 75%;
}
.recap-container i {
    color: #2ECC71;
    padding-right: .2rem;
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
    font-size: 1.3rem;
    letter-spacing: normal;
    font-weight: 500;
    line-height: 1.5rem;
    color: rgba(33, 45, 89, .9);
}

.question-subtitle {
    margin-top: 1.7rem;
    font-size: 0.9rem;
    color: rgba(33, 45, 89, .5);
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
    overflow: hidden;
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
        margin-right: 0rem;
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
        margin-right: 0rem;
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
