<template>
    <el-row v-loading="loading" class="main-container">
        <objectif-completed v-if="showObjectifCompleted" :show.sync="showObjectifCompleted"></objectif-completed>
        <print-todo v-if="showPrintDialog" :show.sync="showPrintDialog"></print-todo>
        <el-row type="flex" align="bottom" class="header">
            <h1>Mes tâches</h1>
            <el-button class="help" @click="onboardDialog = true">?</el-button>
            <div class="print hidden-md-and-down" @click="handlePrint()">
                <i class="budicon budicon-print-a"></i> Imprimer
            </div>
        </el-row>

        <el-dialog style="background: rgba(255, 255, 255, .92)" :visible.sync="onboardDialog" top="6vh" :fullscreen="false" width="85%" :before-close="handleClose">
            <el-carousel arrow="never" v-if="onboardDialog" :interval="90000" indicator-position="outside" trigger="click" height="65vh" :autoplay="false" ref="carousel" @change="handleChangeCarrouselIndex">
                <el-carousel-item>
                    <header class="avancement">
                        <h1 class="carousel-title">Accomplissez vos tâches à votre rythme</h1>
                        <p class="carousel-desc">Grâce à la To-do List, avancez dans la réalisation de votre projet sereinement.</p>
                    </header>
                    <img class="onboard-img" src="../../Assets/onboard-todo-1.gif">
                </el-carousel-item>

                <el-carousel-item>
                    <header class="todolist">
                        <h1 class="carousel-title">Suivez votre avancement</h1>
                        <p class="carousel-desc">Des récompenses vous attendent à chaque étape.</p>
                    </header>
                    <img class="onboard-img" src="../../Assets/onboard-todo-2.gif">
                </el-carousel-item>

                <el-carousel-item>
                    <header class="budget">
                        <h1 class="carousel-title">Personnalisez votre To-do List</h1>
                        <p class="carousel-desc">Ajoutez autant de tâche que vous le souhaitez en personnalisant à votre guise votre liste.</p>
                    </header>
                    <img class="onboard-img" src="../../Assets/onboard-todo-3.gif">
                </el-carousel-item>
            </el-carousel>
            <el-row type="flex" style="align-content: center; align-items: center; width: 260px; margin: auto;">
                <el-button @click="$refs.carousel.prev()" style="flex: 0 1 100%; width: 130px;"><i class="budicon budicon-arrow-left"></i> Précédent</el-button>
                <el-button v-if="carrouselIndex < 2" @click="$refs.carousel.next()" style="flex: 0 1 100%; width: 130px;" type="primary">Suivant <i class="budicon budicon-arrow-right"></i></el-button>
                <el-button v-else @click="onboardDialog = false" style="flex: 0 1 100%; width: 130px;" type="primary">J’ai compris</el-button>
            </el-row>
        </el-dialog>

        <el-row :gutter="42">
            <el-col :md="6" :lg="6" :xl="5" :span="5" class="hidden-sm-and-down">
                <search-bar></search-bar>
                <timeline></timeline>
            </el-col>
            <el-col :xs="24" :sm="24" :md="18" :lg="12" :xl="14">
                <add-task v-click-outside="outside"></add-task>
                <tasklist></tasklist>
            </el-col>
            <el-col class="hidden-md-and-down" :md="5" :lg="6" :xl="5" :span="5">
                <div class="progression" v-if="!loading">
                    <div class="title">Ma progression</div>
                    <div class="progression-img">
                        <img src="/Assets/taskBoard.svg">
                    </div>

                    <objectif-progress class="objectif-progress" :tooltip="true"></objectif-progress>
                    <!-- <div class="text">
                        {{ currentObjectif.totalTask - currentObjectif.completeTask }} tâche{{ currentObjectif.totalTask - currentObjectif.completeTask > 1 ? 's' : '' }}
                      pour <span class="bold" style="color: #00BBFF;">{{ nextObjectif.name }}</span>
                    </div> -->

                    <div class="progression-total">
                        <div class="progression-total-item">
                            <h5>{{ currentObjectif.totalTask - currentObjectif.completeTask }}</h5>
                            <p>Tâches</p>
                        </div>

                        <div class="progression-total-item">
                            <i class="budicon budicon-arrow-right"></i>
                        </div>

                        <div class="progression-total-item">Objectif suivant</div>
                    </div>
                </div>
            </el-col>
            <div class="hidden-lg-and-up responsive-progress">
                <div class="title"><span style="font-weight: 500; color: #00BBFF">{{currentObjectif.name}} → </span> {{currentObjectif.completeTask}} tâches réalisées sur {{currentObjectif.totalTask}}</div>
                <div class="objectif-progress-container">
                    <objectif-progress class="objectif-progress" :tooltip="false"></objectif-progress>
                </div>
                <div class="progression-total hidden-sm-and-up">
                    <div class="progression-total-item">
                        <h5 style="margin-right: .5rem;">{{ currentObjectif.totalTask - currentObjectif.completeTask }}</h5>
                        <p>Tâches</p>
                    </div>

                    <div class="progression-total-item">
                        <i class="budicon budicon-arrow-right"></i>
                    </div>

                    <div class="progression-total-item">Objectif suivant</div>
                </div>
            </div>
        </el-row>
    </el-row>
</template>

<script>
import Timeline from '../../Components/Todolist/Timeline.vue';
import AddTask from '../../Components/Todolist/AddTask.vue';
import ObjectifCompleted from '../../Components/Todolist/ObjectifCompleted.vue';
import SearchBar from '../../Components/Todolist/SearchBar.vue';
import Tasklist from '../../Components/Todolist/Tasklist.vue';
import PrintTodo from '../../Components/Todolist/PrintTodo.vue';
import ObjectifProgress from '../../Components/Todolist/ObjectifProgress.vue';

export default {
    name: 'Todolist',
    components: {
        'timeline': Timeline,
        'add-task': AddTask,
        'objectif-completed': ObjectifCompleted,
        'search-bar': SearchBar,
        'tasklist': Tasklist,
        'print-todo': PrintTodo,
        'objectif-progress': ObjectifProgress
    },
    data() {
        return {
            loading: true,
            carrouselIndex: 0,
            showObjectifCompleted: false,
            showPrintDialog: false,
            onboardDialog: false,
            objectivesCompleted: undefined,
        }
    },
    computed: {
        currentObjectif() {
            return this.$store.state.currentObjectif;
        },
        prevObjectif() {
            return this.$store.getters.prevObjectif;
        },
        nextObjectif() {
            return this.$store.getters.nextObjectif;
        },
        tasklist() {
            return this.$store.state.tasklist;
        },
        objectifs() {
            return this.$store.state.todolist.objectifs;
        }
    },
    created() {
        if (this.tasklist.length == 0) {
            this.$http.get(this.$root.URL + '/todolist/get').then(res => {
                var todolist = res.data.todolist;

                todolist.nbTasksDone = 0;
                todolist.nbTasksFavori = 0;
                todolist.nbTasksTotal = todolist.tasks.length;
                for (var i = 0; i < todolist.tasks.length; i++) {
                    todolist.tasks[i]._showDel = false;
                    if (todolist.tasks[i].done == true) todolist.nbTasksDone += 1;
                    if (todolist.tasks[i].favori == true) todolist.nbTasksFavori += 1;
                }

                todolist.objectifs.forEach(objectif => {
                    var nb = 0;
                    todolist.tasks.forEach(task => {
                        if (task.objectif == objectif.name && task.done) nb += 1;
                    })
                    objectif.completeTask = nb;
                });

                this.$store.commit('setTasklist', todolist.tasks);
                this.$store.commit('setTodolist', todolist);

                for (var i = 0; i < todolist.objectifs.length; i++) {
                    if (todolist.objectifs[i].completeTask < todolist.objectifs[i].totalTask) {
                        this.$store.commit('setCurrentObjectif', i);
                        break;
                    }
                }
                this.loading = false;
            }, error => {

            });
        } else {
            this.loading = false;
        }
    },
    mounted() {
        var self = this;
        window.addEventListener('keyup', (e) => {
            if (e.keyCode == 37 && self.onboardDialog == true) this.$refs.carousel.prev(); // LEFT
            else if (e.keyCode == 39 && self.onboardDialog == true) this.$refs.carousel.next(); // RIGHT
        });
    },
    destroyed() {
        window.removeEventListener('keyup', (e) => {
            if (e.keyCode == 37 && self.onboardDialog == true) this.$refs.carousel.prev(); // LEFT
            else if (e.keyCode == 39 && self.onboardDialog == true) this.$refs.carousel.next(); // RIGHT
        });
    },
    watch: {
        objectifs: {
            handler: function (objectifs) {
                if (!this.objectivesCompleted) {
                    this.objectivesCompleted = 0;
                    this.$store.state.todolist.objectifs.forEach(objectif => {
                        if (objectif.completeTask == objectif.totalTask) this.objectivesCompleted += 1;
                    });
                }
                var completed = 0;
                    this.$store.state.todolist.objectifs.forEach(objectif => {
                        if (objectif.completeTask == objectif.totalTask) completed += 1;
                });
                if (this.objectivesCompleted < completed) {
                    this.showObjectifCompleted = true;
                    this.objectivesCompleted = completed;
                }
                this.objectivesCompleted = completed;
            },
            deep: true
        },
        currentObjectif: {
            handler: function (newObj) {
                if (newObj.completeTask == newObj.totalTask) this.showObjectifCompleted = true;
            },
            deep: true
        }
    },
    methods: {
        handleChangeCarrouselIndex(newIndex, oldIndex) {
            this.carrouselIndex = newIndex;
        },
        outside(e) {
            this.$store.commit('setTaskAddStatus', false);
        },
        handlePrint() {
            this.showPrintDialog = true;
        }
    },
    directives: {
        'click-outside': {
            bind: function(el, binding, vNode) {
                if (typeof binding.value !== 'function') {
                    const compName = vNode.context.name
                    let warn = `[Vue-click-outside:] provided expression '${binding.expression}' is not a function, but has to be`
                    if (compName) { warn += `Found in component '${compName}'` }

                    console.warn(warn)
                }
                const bubble = binding.modifiers.bubble
                const handler = (e) => {
                    if (bubble || (!el.contains(e.target) && el !== e.target)) {
                        binding.value(e)
                    }
                }
                el.__vueClickOutside__ = handler
                document.addEventListener('click', handler)
            },

            unbind: function(el, binding) {
                document.removeEventListener('click', el.__vueClickOutside__)
                el.__vueClickOutside__ = null

            }
        }
    }
}
</script>

<style>

@keyframes float {
    0% {
        box-shadow: 0 1px 25px 0px rgba(0,0,0,0.1);
        transform: translatey(0px);
    }
    50% {
        box-shadow: 0 15px 25px 0px rgba(0,0,0,0.2);
        transform: translatey(-3px);
    }
    100% {
        box-shadow: 0 1px 25px 0px rgba(0,0,0,0.1);
        transform: translatey(0px);
    }
}


.bold { font-weight: 600; }
.header { margin-bottom: 20px; }
.header .print {height: 23px; font-size: .9em; color: #212D59;border: 1px solid transparent; position: absolute; top: 3rem; right:21%; left: auto; padding: 5px 7px; bottom: 0px; }
.header .print:hover { cursor: pointer; border: 1px solid rgba(33, 45, 89, .2); border-radius: 4px;}

.progression { background: rgba(33, 45, 89, .015);text-align: center;  border: 1px solid rgba(33, 45, 89, .08); border-radius: 5px; padding: 30px; }
.progression .title {     color:  rgba(33, 45, 89, .5);
    font-weight: 400;
    font-size: 1.2rem; margin-bottom: 30px; }
    /* .progression img { margin-bottom: 50px; } */
    .progression .objectif-progress { width: 90%; }
    .progression .text { color: rgba(33, 45, 89, .8); font-size: 16px; margin-top: 30px; font-weight: 300; }


    .progression-img {
        display: flex;
        align-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        box-sizing: border-box;
        border: 5px white solid;
        border-radius: 50%;
        overflow: hidden;
        /* box-shadow: 0 2px 15px 0px rgba(0, 0, 0, 0.2); */
        animation: float 2s ease-in-out infinite;
        position: relative;
        margin: 0 auto 4.5rem;
    }

    .progression-img img {
        width: 60%; height: auto;
        position: absolute;
        left: 20%;

    }

    .help {
        margin-left: 1rem !important;
        position: relative;
        top: 1px;
        color: #00BBFF;
        border: 1px solid #00BBFF; font-weight: 400; border-radius:50%; padding: 0; margin: 0; height: 22px; line-height: 22px;
        width: 22px;
        position: relative;
        top: -11px;
        left: -6px;
        font-weight: 300;
        font-size: .9rem;
    }

    .help:hover, .help:focus, .help:active  {
        border: 1px solid #00BBFF;
        color: #fff;
        background: #00BBFF;
    }

    .el-carousel__item h3 {
        color: #475669;
        font-size: 14px;
        opacity: 0.75;
        line-height: 150px;
        margin: 0;
    }

    .el-carousel__item {
        /* background-color: #99a9bf; */
        display: flex;
        flex-direction: row;
        align-content: flex-start;
        align-items: center;
    }

    .el-carousel__item header {
        /* text-align: center; */
        flex: 2;
        margin: 3rem;
        /* padding-right: 5rem; */
        position: relative;
    }

    .el-carousel__item header::after {
        content: '';
        position: absolute;
        bottom: -5rem ;
        right: -2rem;
        width: 40%;
        opacity: .04;
    }

    .el-carousel__item header.todolist::after {
        /* content: url('../../Assets/bg-todolist.svg'); */

    }
    .el-carousel__item header.budget::after {
        /* content: url('../../Assets/bg-budget.svg'); */
    }

    .carousel-title {
        margin: 0;
        font-weight: 400;
        line-height: 1.3;
        margin-bottom: 1.2rem;
        font-size: 2.1rem;
        letter-spacing: -1px;
    }

    .carousel-desc {
        margin: 0;
        padding: 0;
        margin-bottom: 2.7rem;
        color: rgba(33, 45, 89, .6);
        font-size: 1.3rem;
        font-weight: 300;
    }

    .el-carousel__item img {
        /* border: 1px solid rgba(0, 0, 0, .1); */
        border-radius: 4px;
        /* padding: 2px; */
        width: 100%;
        /* height: 100%; */
        /* object-fit:fill; */
        box-shadow: 0px 0px 22px 3px rgba(0, 0, 0, .15);
        /* padding-bottom: 4rem; */
        overflow: hidden;
        flex: 4;
        background: #fff;
        padding: .5rem 0;
        margin: 3rem;
        /* margin-left: 7rem; */
    }

    .el-carousel__item:nth-of-type(2) header {
        order: 2;
    }


.progression-total {
    display: flex;
    align-items: center;
    margin-top: 2rem;
}

.progression-total-item {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.progression-total-item h5 {
    margin: 0;
    color: rgba(33, 45, 89, .9);
    font-weight: 500;
    font-size: 1rem;
    line-height: 1.2;
}

.progression-total-item p {
    margin: 0;
    color: rgba(33, 45, 89, .4);
    font-weight: 400;
    font-size: .8rem;
}

.progression-total-item:nth-of-type(2) i {
    color: rgba(33, 45, 89, .2);
    font-weight: 900;
    font-size: 1.2rem;
}

.progression-total-item:nth-of-type(3) {
    color: #00BBFF;
    font-size: .8rem;
}

.responsive-progress {
    position: fixed;
    width: 100vw;
    bottom: 0px;
    left: 0px;
    padding: .5rem 0;

    z-index: 10000;
    background: rgba(252, 252, 252, 1);
    border: 1px solid rgba(33, 45, 89, .08);
    border-radius: 5px;
}

.responsive-progress .title {
    color:  rgba(33, 45, 89, .5);
    font-weight: 400;
    font-size: .9rem;
    margin-left: 3rem;
    margin-top: .5rem;
}

.responsive-progress .objectif-progress { width: 90%; }
.responsive-progress .objectif-progress-container {
    width: 50%;
    margin-top: .8rem;
    margin-left: 2rem;
    display: inline-block;
}
.responsive-progress .progression-total {
    margin-top: 0;
    display: inline-flex;
}
.responsive-progress .progression-total-item {
    flex-direction: row;
    flex: auto;
    margin: 0 1rem;
}

</style>
