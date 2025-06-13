<template id="FindTerrain">
 <div v-if="visible" class="terrain-container">
        <div class="start-survey" v-show="!isStarted && answeredQuestions === 0">
            <button @click="start">Trouver mon terrain</button>
        </div>
        <el-container :style="(currentQuestion === questions.length)?'justify-content: center; align-items: center;':''">
            <el-main id="q-active" class="st-scroll" v-if="currentQuestion !== questions.length">
                <div v-for="(question, index) in questions" :key="index" class="question" :class="(currentQuestion === index)?'active':'transparent'" @click="handleQuestionClick(index)">
                    <el-row>
                        <el-col :offset="0" :span="18">
                            <h1 class="question-title"><span class="question-number">{{index + 1}} <span style="font-size: .9rem; vertical-align: middle;">→ </span> </span>{{question.title}} </h1>
                        </el-col>
                    </el-row>
                    <el-col :offset="0" :span="18">
                        
                        <range-form
                            v-if="question.type === 'range'"
                            :ref="'slider'+index"
                            :active="currentQuestion === index"
                            :validate="() => nextQuestion(currentQuestion)"
                            :value-range="finalForm[question.resultName]"
                            :select="(item) => selectItem(item, true)"
                            :min-range="question.options.minRange"
                            :suffix="question.options.answerSuffix"
                            :step-size="question.options.stepSize"
                            :max-range="question.options.maxRange" />
                        <text-form
                            v-else-if="question.type === 'text'"
                            :ref="'text'+index"
                            :active="currentQuestion === index"
                            :validate="() => nextQuestion(currentQuestion)"
                            v-model="finalForm[question.resultName]"
                            :placeholder="question.options.placeholder" />
                        <minitile-form
                            v-if="question.type === 'minitile'"
                            :active="currentQuestion === index"
                            :multi="question.multipleAnswer"
                            :validate="() => nextQuestion(currentQuestion)"
                            :selected="finalForm[question.resultName]"
                            :select="(item) => selectItem(item, false)"
                            :tiles="question.answers" />
                        <multi-input-form :ref="'text-input'+index" v-else-if="question.type == 'input'"
                        :inputs="question.inputs" :rejection="question.rejection" :validate="() => nextQuestion(currentQuestion)" :selected="finalForm[question.resultName]" :select="(item, type) => selectItem(item, true, type)"/>
                        <multibutton-form v-else-if="question.type == 'multibutton'"
                        :answers="question.answers" :validate="() => nextQuestion(currentQuestion)" :selected="finalForm[question.resultName]" :select="(item) => selectItem(item, false)" />
                    </el-col>
                </div>
            </el-main>
            <nav v-if="questions.length != currentQuestion" id="pieces" class="liste-pieces aside" style="overflow: hidden;">
                <h3>Récapitulatif</h3>
                <ul id="pieces-container" style="overflow: auto;">
                    <li v-for="(cDocument, index) in getAnswers()" :id="'document' + index" :key="index">
                        <i class="el-icon-check"></i> <span class="text-overflow">{{cDocument}}</span>
                    </li>
                    <div id="scroll-me"></div>
                </ul>

            </nav>
            <nav v-if="questions.length == currentQuestion" id="pieces" style="overflow: hidden;" class="liste-pieces download">
                <h3>Récapitulatif</h3>
                <ul id="pieces-container" style="overflow: auto;">
                    <li v-for="(cDocument, index) in getAnswers()" :id="'document' + index" :key="index">
                        <i class="el-icon-check"></i> <span class="text-overflow">{{cDocument}}</span>
                    </li>
                    <div id="scroll-me"></div>
                </ul>
                <router-link :to="{ name: 'Todolist'}"  class="recap-btn">
                    <span class="recap-btn-name">Continuer vers la liste des tâches</span>
                </router-link>
            </nav>

             <form-footer :first-question="firstQuestion" :progress="answeredQuestions" :prev-question="previousQuestion" :next-question="() => nextQuestion(currentQuestion)" :current-question="currentQuestion" :total-questions="questions.length"/>
            </el-container>
</div>
    
</template>

<script>
import MultiButtonForm from '../Form/MultiButtonForm.vue'
import MultiInputForm from '../Form/MultiInputForm.vue'
import RangeForm from '../Form/RangeForm.vue'
import FormFooter from '../Form/FormFooter.vue'
import TextForm from '../Form/TextForm.vue'
import MiniTileForm from '../Form/MiniTileForm.vue'
import VueScrollTo from 'vue-scrollto'

export default {
    name: 'FindTerrain',
    props: {
    },
    components: {
        'multibutton-form': MultiButtonForm,
        'multi-input-form': MultiInputForm,
        'form-footer': FormFooter,
        'text-form': TextForm,
        "range-form": RangeForm,
        "minitile-form": MiniTileForm
    },
    mounted() {
        this.$http.get(this.$root.URL + '/form/get?name=FindField').then(res => {
            this.fillForm(res.data.result);
            if (this.answeredQuestions > 0) this.isStarted = true;
            this.currentQuestion = this.answeredQuestions;
            if (this.currentQuestion < this.answeredQuestions) this.currentQuestion += 1;
        }, err => {
            const basis = {
                size: [0, 5000],
                budget: [20000, 300000],
                location: ['', '', ''],
                type: null,
                parkingPlaces: null,
                poolSize: [0, 0],
                poolRejected: false,
                comments: null
            };
            this.fillForm(basis);
            if (this.answeredQuestions > 0) this.isStarted = true;
        });
    },
    data() {
        return {
            isStarted: false,
            questions: [
                {
                    type: "range",
                    title: "Quelle serait pour vous la surface idéale de votre terrain ?",
                    resultName: 'size',
                    multipleAnswer: true,
                    isRequired: true,
                    options: {
                        range: [0, 1200],
                        maxRange: 5000,
                        minRange: 0,
                        stepSize: 20,
                        answerPreffix: 'Surface de',
                        answerSuffix: 'm2',
                    }
                },
                {
                    type: "range",
                    title: "Quel budget souhaitez-vous allouer à l’achat de votre terrain ?",
                    resultName: 'budget',
                    multipleAnswer: true,
                    isRequired: true,
                    options: {
                        range: [50000, 100000],
                        maxRange: 300000,
                        minRange: 20000,
                        stepSize: 500,
                        answerPreffix: 'Budget de',
                        answerSuffix: '€'
                    }
                },
                {
                    type: "input",
                    title: "Quelle serait pour vous la localisation idéale de votre terrain ?",
                    resultName: 'location',
                    isRequired: true,
                    multipleAnswer: false,
                    inputs: [{
                        type: "gMaps",
                        index: 2,
                        name: 'Commune',
                        required: true,
                    },
                    {
                        index: 2,
                        name: 'Code postal',
                        required: true,
                    },
                    {
                        index: 2,
                        name: 'Quartier',
                        placeholder: 'Facultatif'
                    }]
                },
                {
                    type: 'multibutton',
                    title: "Préférez-vous un terrain en lotissement et déjà aménagé ?",
                    resultName: 'type',
                    isRequired: true,
                    multipleAnswer: false,
                    answers: [{
                        name: 'Oui',
                        answer: 'Terrain en lotissement'
                    },
                    {
                        name: 'Non',
                        answer: 'Terrain en diffus'
                    },
                    {
                        name: 'Pas de préférence',
                        answer: 'Terrain en lotissement ou en diffus'
                    }]
                },
                {
                    type: "minitile",
                    title: "Souhaitez-vous bénéficier d’une ou plusieurs places de parking ?",
                    resultName: 'parkingPlaces',
                    isRequired: true,
                    multipleAnswer: false,
                    answers: [{
                        title: '0',
                        answer: 'Je ne souhaite pas de place de parking',
                    },
                    {
                        title: '1',
                        answer: 'Je souhaite 1 place de parking',
                    },
                    {
                        title: '2',
                        answer: 'Je souhaite 2 places de parking',
                    },
                    {
                        title: '3',
                        answer: 'Je souhaite 3 places de parking',
                    },
                    {
                        title: '4',
                        answer: 'Je souhaite 4 places de parking',
                    },]
                },
                {
                    type: "input",
                    title: "Souhaiteriez-vous faire construire une piscine ?",
                    resultName: 'poolSize',
                    isRequired: true,
                    multipleAnswer: false,
                    inputs: [{
                        index: 5,
                        name: 'Longueur de la piscine',
                        type: "slider",
                        required: true,
                    },
                    {
                        index: 5,
                        name: 'Largeur de la piscine',
                        type: "slider",
                        required: true,
                    }],
                    rejection: {
                       name : "Je ne souhaite pas construire de piscine",
                       value: [-1,-1],
                       function: this.onPoolReject
                    }
                },
                {
                    type: "text",
                    title: "Avez-vous des remarques et précisions supplémentaires à exprimer ?",
                    resultName: 'comments',
                    isRequired: false,
                    multipleAnswer: false,
                    options: {
                        placeholder: 'Vos commentaires'
                    }
                },
            ],
            visible: true,
            currentQuestion: 0,
            'finalForm': {
                size: [0, 5000],
                budget: [20000, 300000],
                location: ['', '', ''],
                type: null,
                parkingPlaces: null,
                poolSize: [0, 0],
                poolRejected: false,
                comments: null
            },
        }
    },
    watch: {
        currentQuestion: function (newQuestion, oldQuestion) {
            const scrollLength = newQuestion * 30;
            let qActive = document.getElementById('q-active');
            if (qActive !== null) {
                qActive.style.WebkitTransform = 'translateY(-' + scrollLength + 'rem)';
                // Code for IE9
                qActive.style.msTransform = 'translateY(-' + scrollLength + 'rem)';
                // Standard syntax
                qActive.style.transform = 'translateY(-' + scrollLength + 'rem)';
            }
        }
    },
    computed: {
            answeredQuestions: function() {
             let p = 0;
             for (var i=0; i< this.questions.length; i++) {
                 let question = this.questions[i];
                 if (i == 5 && this.finalForm.poolRejected === true) {
                     p++
                }
                else if (question.type === 'range') {
                    if (this.finalForm[question.resultName][0] !== question.options.minRange || this.finalForm[question.resultName][1] !== question.options.maxRange)
                        p++;
                } else if (question.type === 'input') {
                    if (i === 5 && (this.finalForm[question.resultName][0] !== 0 && this.finalForm[question.resultName][1] !== 0)) {
                        p++;
                    }
                    else if (i !== 5 && (this.finalForm[question.resultName][0] !== '' && this.finalForm[question.resultName][1] !== '')) {
                        p++;
                    }
                } else if (question.isRequired) {
                    if (question.multipleAnswer && this.finalForm[question.resultName].length > 0)
                        p++;
                     else if (!question.multipleAnswer && this.finalForm[question.resultName] !== null)
                         p++;
                } else if (question.type == 'text') {
                    if (this.finalForm[question.resultName] != null) p++
                } else {
                     if (this.currentQuestion >= i || this.finalForm[question.resultName] !== '')
                         p++;
                 }
             }
             return p;
         },
        user() {
            return this.$localStorage.get('user');
        }
    },
    created() {
        if (this.answeredQuestions > 0) this.isStarted = true; 
        window.addEventListener('keydown', this.handleEvents);
        this.$root.$el.offsetParent.style.overflow= 'hidden';
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleEvents);
        this.$root.$el.offsetParent.style.overflow= 'auto';
    },
    methods: {
        firstQuestion(questionNbr)  {
            this.isDone = false;
            this.currentQuestion = 0;
        },
        start() {
            this.isStarted = true;
        },
        onPoolReject(value) {
            this.finalForm.poolRejected = true;
        },
        handleEvents(event) {
            if (event.which == 40 || event.keyCode == 40) {
                this.nextQuestion(this.currentQuestion);
            } else if (event.which == 38 || event.keyCode == 38) {
                if (this.currentQuestion > 0)
                    this.previousQuestion(this.currentQuestion);
            } else if (event.which == 13 || event.keyCode == 13) {
                if (this.currentQuestion !== 7 && this.currentQuestion !== 8)
                    this.nextQuestion(this.currentQuestion);
            }
        },
        fillForm(base) {
            const basis = {
                size: [0, 5000],
                budget: [20000, 300000],
                location: ['', '', ''],
                type: null,
                parkingPlaces: null,
                poolSize: [0, 0],
                poolRejected: false,
                comments: null
            };
            this.finalForm = basis;
            for (var key in base) 
                this.finalForm[key] = base[key];
            for (var i=0; i< this.questions.length; i++) {
                if (this.questions[i].type === 'range') {
                    let slider = this.$refs['slider'+i][0];
                    if (slider !== undefined)
                       slider.refresh(this.finalForm[this.questions[i].resultName]);
                } else if(this.questions[i].type === 'input') {
                    let textInput = this.$refs['text-input'+i][0];
                    if (textInput !== undefined)
                        textInput.refresh(this.finalForm[this.questions[i].resultName]);
                }
            }
        },
        handleQuestionClick(questionNumber) {
            if (questionNumber !== this.currentQuestion) {
                if (questionNumber > this.currentQuestion) {
                    this.nextQuestion(this.currentQuestion);
                }
            }
        },
        getAnswers() {
            let documents = [];
            var answerTemplate = [
                `Surface de `,
                `Budget de `,
                `Situé de préférence au `,
                null,
                null,
                null,
                null,
                ""]

            this.questions.forEach((question, index) => {
                let answer = this.finalForm[question.resultName];
                if (answer && answer.answer) {
                        documents.push(answer.answer);
                } else if (answer) {
                    switch (index) {
                        case 0:
                            if (answer[0] !== question.options.minRange || answer[1] !== question.options.maxRange)
                                documents.push(answerTemplate[index] + answer[0] + " - " + answer[1] + "m2");
                            break;
                        case 1:
                            if (answer[0] !== question.options.minRange || answer[1] !== question.options.maxRange)
                                documents.push(answerTemplate[index] + answer[0] + " - " + answer[1] + "€");
                            break;
                        case 2:
                            if (answer[1] !== '' && answer[0] !== '')
                                documents.push(answerTemplate[index] + answer[1] + ' ' + answer[0]);
                            break;
                        case 5:
                            if (this.finalForm.poolRejected) documents.push("Pas de construction de piscine");
                            else if (answer[0] && answer[1]) documents.push("Construction d’une piscine de " + answer[0] + " x " + answer[1] + " mètres de dimension");
                            break;
                        case 6:
                            documents.push('Commentaires : '+ answer);
                            break;
                        default:
                            break;
                    }
                }
            })
            return (documents)
        },
        handleClose() {
            this.visible = false;
        },
        selectItem(item, multi, type) {
            if (item == null) return;
            if (this.currentQuestion === 5)
                this.finalForm.poolRejected = false;
            if (type == "autocomplete") {
                this.finalForm[this.questions[this.currentQuestion].resultName][0] = `${item.locality} (${item.departement})`;
                if (item.postal_code) this.finalForm[this.questions[this.currentQuestion].resultName][1] = item.postal_code;
            } else {
                this.finalForm[this.questions[this.currentQuestion].resultName] = item;
            }
            if (!multi)
                window.setTimeout(() => this.nextQuestion(this.currentQuestion), 100);
        },
        saveForm() {
            this.$http.post(this.$root.URL + '/form/save?name=FindField', this.finalForm).then(res => {
                this.fillForm(res.data.result);
            });
        },
        forgotQuestionMessage() {
            this.$message.error('Vous n\'avez pas répondu à la question 🙂 !');
        },
        nextQuestion(questionNbr) {
            const question = this.questions[questionNbr];
            let validate = false;
            if (this.finalForm[question.resultName] === undefined)
                this.forgotQuestionMessage();
            else {
                if (question.type === 'range') {
                    if (this.finalForm[question.resultName][0] === question.options.minRange && this.finalForm[question.resultName][1] === question.options.maxRange)
                        this.forgotQuestionMessage();
                    else
                        validate = true;
                }
                else if (question.isRequired) {
                    if (question.type == "input" && this.finalForm.poolRejected === false) {
                        for (var i = 0; i <this.finalForm[question.resultName].length; i++) {
                            if (this.finalForm[question.resultName][i] == "" && question.inputs[i].required) 
                                return (this.$message.error("Merci de renseigner les champs doté d'une étoile"))
                         }
                         validate = true;
                    }
                    else if (question.multipleAnswer && this.finalForm[question.resultName].length > 0)
                        validate = true;
                    else if (!question.multipleAnswer && this.finalForm[question.resultName] !== null)
                        validate = true;
                    else
                        this.forgotQuestionMessage();
                } else
                    validate = true;

            }
            if (validate) {
                this.currentQuestion = questionNbr + 1;
                if (this.currentQuestion === this.questions.length) {
                    this.$message.success('Nous allons tenter de vous trouver quelque chose 🙂 ! ');
                }
                this.saveForm();
            }
        },
        previousQuestion() {
            if (this.currentQuestion === this.questions.length) {
                this.currentQuestion = 0;
                this.$nextTick(this.fillForm(this.finalForm));
            } else {
                this.currentQuestion -= 1;
            }
        }
    },
}
</script>

<style scoped>
    .recap-btn {
        border: none;
        box-shadow: 0 4px 5px 1px rgba(35, 49, 88, .1);
        font-weight: 500;
        font-size: 1.4rem;
        background: #31bdfc;
        color: #31bdfc !important;
        transition: .1s linear;
        padding: .5rem 1rem;
        cursor: pointer;
        box-sizing: border-box;
        border-radius: 4px;
        text-align: center;
        text-decoration: none;
    }
    .recap-btn:hover {
        box-shadow: 0 4px 12px 4px rgba(35, 49, 88, .15);
        transition: .1s linear;
    }
    .recap-btn-name {
        color: #fff !important ;
        font-weight: 500;
        font-size: 1rem;
    }
    .text-overflow {
        overflow-x: auto; /* Use horizontal scroller if needed */
        white-space: pre-wrap; /* css-3 */
        white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
        word-wrap: break-word; /* Internet Explorer 5.5+ */
        white-space : normal;
    }
    /* html, body {margin: 0; height: 100%; overflow: hidden} */
    .button-container {
        position: absolute;
        width: 100vw;
        text-align: center;
        top: 30vh;
    }

    .blurred {
    -webkit-filter: blur(4px);
    -moz-filter: blur(4px);
    -ms-filter: blur(4px);
    -o-filter: blur(4px);
    filter: blur(4px);
    }

    .el-button.start {
         z-index: 99;
        position: relative;
        border: 1px #E7E9ED;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        background-color: #31BDFC;
        color: white;
        font-weight: 300;
        /* width: 100%; */
        font-size: 25px;
        padding: 20px 15px;
        margin-bottom: 15px;
    }

    nav {
        margin-right: 8rem;
    }
    nav ul{ width:380px;}
    /* nav ul{overflow:hidden; overflow-y:scroll;} */

    .terrain-container {
        margin: 0;
        height: 100%;
        overflow: hidden;
    }
    .question-title {
        font-size: 9rem;
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
        overflow: hidden;
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
        left:0;
    }
    .el-main {
        color: #333;
        margin-top: 2rem;
    }
        #q1-active > .st-scroll {
	    transform: translateY(0%);
    }
    #q2-active > .st-scroll {
	    transform: translateY(-30rem);
    }
    #q3-active > .st-scroll {
	    transform: translateY(-60rem);
    }
    #q4-active > .st-scroll {
	    transform: translateY(-90rem);
    }
    #q5-active > .st-scroll {
	    transform: translateY(-120rem);
    }
    #q6-active > .st-scroll {
	    transform: translateY(-150rem);
    }
    #q7-active > .st-scroll {
	    transform: translateY(-180rem);
    }
    #q8-active > .st-scroll {
	    transform: translateY(-210rem);
    }
    #q9-active > .st-scroll {
	    transform: translateY(-240rem);
    }
    #q10-active > .st-scroll {
	    transform: translateY(-270rem);
    }
    #q11-active > .st-scroll {
	    transform: translateY(-300rem);
    }
    #q12-active > .st-scroll {
	    transform: translateY(-330rem);
    }





.liste-pieces {
    margin-top: 2rem;
    border: 1px solid rgba(33, 45, 89, 0.1);
    overflow: auto;
    max-height: 50vh;
    width: 300px;
    animation: float 2.5s ease-in-out infinite;
    border-radius: 7px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
}

.liste-pieces::after {
    content: url(../../Assets/bg-terrain.svg);
    position: absolute;
    top: -2rem;
    right: -2rem;
    width: 40%;
    opacity: .05;
}



.liste-pieces h3 {
    color: rgba(33, 45, 89, .9);
    font-weight: 500;
    text-align: center;
    font-size: 1.2rem;
    display: inline-block;
    position: relative;
}

.liste-pieces h3::after {
    display: block;
    content: '';
    width: 20%;
    /* margin: auto; */
    height: 3px;
    background: #00BBFF;
    border-radius: 500px;
}

.pieces-container {
    width: 300px;
}

.liste-pieces ul {
    width: auto;
    list-style: none;
    padding: 0 1.4rem;
    color: rgba(33, 45, 89, .8);
    font-size: .85rem;
    height: 75%;
}

.liste-pieces li {
    transition: all .4s linear;
    padding-bottom: .5em;
    
}

.liste-pieces.download {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    margin-top: 7vh !important;
    min-height: 40vh;
    z-index: 9999;
    margin-top: 0;
    width: 450px;
    height: auto;
    border: none;
    border-radius: 5px;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, .05);
    margin-bottom:2rem;
    padding-bottom:2rem;

}

.done {
    
    -webkit-transition: width 2s; /* Safari */
    transition: width 2s;
}

.liste-pieces i {
        color: #2ECC71;
    padding-right: .2rem;
}

.pieces-download.el-button {
    color: #fff;
    background: #31BDFC;
    background: linear-gradient(5deg,#31BDFC,#00D3F7);
    border-radius: 4px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 1.5rem 0rem;
    cursor: pointer;
    transition: .2s ease-in-out;
    border: none;
     margin-top: -13px;
}

.liste-pieces.aside {
    width: 300px;
}

    .btn-close {
        right: 10%;
        top: 2rem;
        z-index: 9999;
    }
    .question-title {
    font-size: 1.3rem;
    letter-spacing: normal;
    font-weight: 400;
    line-height: 1.3rem;
    color: rgba(33, 45, 89, 1);

    }
    .question-number {
        color: #31bdfc;
        font-size: 1rem;
        vertical-align: middle;
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

.start-survey {
    background: rgba(255, 255, 255, 0.7);
    z-index: 1;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
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
    margin-top: 20vh;
    box-shadow: 0 0 69px 0px rgba(0, 0, 0, .2);
    cursor: pointer;
}

</style>
