<template>
    <el-row v-loading="false" class="main-container hidden-xs-only">
        <div class="main-container23">
            <el-row type="flex" align="bottom" class="header">
                <h1>Mon tableau de bord</h1>
                <el-button class="help" @click="onboardDialog = true">?</el-button>
            </el-row>

            <objectif-completed v-if="showObjectifCompleted" :show.sync="showObjectifCompleted"></objectif-completed>

            <el-dialog style="background: rgba(255, 255, 255, 1);" :visible.sync="onboardDialog" top="6vh" :fullscreen="false" width="90%" :before-close="handleClose">
                <el-carousel arrow="never" v-if="onboardDialog" :interval="90000" indicator-position="outside" trigger="click" height="65vh" :autoplay="false" ref="carousel" @change="handleChangeCarrouselIndex">

                    <el-carousel-item class="welcome" v-if="$route.params.first">
                        <h1>Bienvenue chez Made in <span style="color: #00BBFF;">Plan</span>
                            <p class="carousel-desc">Nous allons vous guider pas à pas pour prendre en main l’application</p>
                            <p><span>😇</span></p>
                        </h1>
                    </el-carousel-item>

                    <el-carousel-item>
                        <header class="avancement">
                            <h1 class="carousel-title">Gardez un oeil sur votre avancement</h1>
                            <p class="carousel-desc">Vous avancez à votre rythme et nous mesurons vos progrès.</p>
                        </header>
                        <img class="onboard-img" src="../../Assets/onboard-resume-1.png">
                    </el-carousel-item>

                    <el-carousel-item>
                        <header class="todolist">
                            <h1 class="carousel-title">Vos prochaines tâches en un coup d’oeil</h1>
                            <p class="carousel-desc">Avancez toujours dans la bonne direction.</p>
                        </header>
                        <img class="onboard-img" src="../../Assets/onboard-resume-2.png">
                    </el-carousel-item>

                    <el-carousel-item>
                        <header class="budget">
                            <h1 class="carousel-title">Maîtrisez votre budget</h1>
                            <p class="carousel-desc">Une synthèse claire de votre prévisionnel et de vos dépenses réalisées.</p>
                        </header>
                        <img class="onboard-img" src="../../Assets/onboard-resume-3.png">
                    </el-carousel-item>
                </el-carousel>

                <el-row type="flex" style="align-content: center; align-items: center; width: 260px; margin: auto;">
                    <el-button @click="$refs.carousel.prev()" style="flex: 0 1 100%; width: 130px;"><i class="budicon budicon-arrow-left"></i> Précédent</el-button>
                    <el-button v-if="carrouselIndex < 3" @click="$refs.carousel.next()" style="flex: 0 1 100%; width: 130px;" type="primary">Suivant <i class="budicon budicon-arrow-right"></i></el-button>
                    <el-button v-else @click="onboardDialog = false" style="flex: 0 1 100%; width: 130px;" type="primary">J’ai compris</el-button>
                </el-row>
            </el-dialog>

            <!-- SI des tâches sont disponibles -->
            <el-row v-if="todolist.tasks && todolist.tasks.length > 0" type="flex" class="projet-container">
                <el-col :xl="18" :lg="18" :md="24" :sm="24">
                    <el-card class="tasks box-card">
                        <header>
                            <div class="task-link">
                                <router-link :to="{ name: 'Todolist' }"><a>Toutes mes tâches</a></router-link>
                            </div>
                            <h2 class="box-title">Tâches à venir</h2>
                        </header>
                        <ul class="task-list">
                            <el-row v-for="task in tasks" v-if="task" :key="task.id" class="task-item" :class="{ 'is-active': task.done }" @click.native="handleDetailView(task, $event)">
                                <task-checkbox class="task-check" :id="task.id" :done="task.done" :cb="getTheFive"></task-checkbox>
                                <div class="task-info">
                                    <div class="task-name">{{ task.name }}</div>
                                    <div class="task-category">{{ task.category }}</div>
                                </div>
                            </el-row>
                        </ul>
                    </el-card>
                </el-col>
            </el-row>

            <!-- Sinon fallback si pas de tâches -->
            <el-row v-else style="text-align:center; margin-top:3rem;">
                <el-col :span="24">
                    <h2>Aucune tâche à afficher pour le moment ✅</h2>
                </el-col>
            </el-row>
        </div>
    </el-row>
</template>


<script>
import Checkbox from '../../Components/Todolist/Checkbox.vue';
import ObjectifCompleted from '../../Components/Todolist/ObjectifCompleted.vue';

export default {
    name: "Projet",
    components: {
        'task-checkbox': Checkbox,
        'objectif-completed': ObjectifCompleted
    },
    data() {
        return {
            loading: true,
            showObjectifCompleted: false,
            tasks: [],
            todolist: {},
            carrouselIndex: 0,
            onboardDialog: false
        }
    },
    computed: {
        tasklist() {
            return this.$store.state.tasklist;
        },
        user() {
            return this.$store.state.user;
        },
        currentObjectif() {
            return this.$store.state.currentObjectif;
        },
        objectifs() {
            return this.$store.state.todolist && this.$store.state.todolist.objectifs ? this.$store.state.todolist.objectifs : [];
        }
    },
    created() {
        var self = this;
        if (this.$route.params.first) {
            setTimeout(() => {
                self.onboardDialog = true;
            }, 2500);
        }

        /* --- GET TODOLIST ---*/
 
        this.$http.get(this.$root.URL + '/todolist/get').then(res => {
           console.log('TODOLIST RESPONSE:', res.data);
    console.log('lastToggled:', res.data.todolist.lastToggled);
    console.log('tasks:', res.data.todolist.tasks);
            this.todolist = res.data.todolist;

            if (this.tasklist.length == 0) {
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
            }

            // PLACE TASKS IN LIST
            this.tasks = [];

                    if (this.todolist.lastToggled && this.todolist.lastToggled.length > 0) {
                var t1 = this.todolist.tasks.find(task => this.todolist.lastToggled[0] == task.id);
                if (t1) this.tasks.unshift(t1);

                if (this.todolist.lastToggled.length > 1) {
                    var t2 = this.todolist.tasks.find(task => this.todolist.lastToggled[1] == task.id);
                    if (t2) this.tasks.unshift(t2);
                }
            }

            for (var i = 0; i < this.todolist.tasks.length && this.tasks.length < 5; i++) {
                if (!this.todolist.tasks[i].done) this.tasks.push(this.todolist.tasks[i]);
            }

            if (this.tasks.length != 5) {
                var allCompleted = true;
                this.todolist.tasks.forEach(task => {
                    if (!task.done) allCompleted = false;
                });
                if (allCompleted == true) {
                    this.tasks = [];
                    for (var i = this.todolist.tasks.length - 5; i < this.todolist.tasks.length; i++) {
                        if (this.todolist.tasks[i]) this.tasks.push(this.todolist.tasks[i]);
                    }
                } else {
                    for (var i = 2; this.tasks.length < 5 && i < this.todolist.lastToggled.length; i++) {
                        var t = this.todolist.tasks.find(task => this.todolist.lastToggled[i] == task.id);
                        if (t) this.tasks.splice(2, 0, t);
                    }
                }
            }

            this.loading = false;
        }, error => {});
    },
    watch: {
        currentObjectif: {
            handler: function (newObj) {
                if (newObj && newObj.completeTask != undefined && newObj.totalTask != undefined && newObj.completeTask == newObj.totalTask) {
                    this.showObjectifCompleted = true;
                }
            },
            deep: true
        }
    },
    methods: {
        handleDetailView(task, event) {
            if (event.target.id == '') {
                this.$router.push({ name: 'TaskDetail', params: { id: task.id } });
            }
        },
        handleChangeCarrouselIndex(newIndex) {
            this.carrouselIndex = newIndex;
        },
        getTheFive(id) {
            this.$http.get(this.$root.URL + '/todolist/get').then(res => {
                this.todolist.lastToggled = res.data.todolist.lastToggled;
                var i = this.todolist.tasks.findIndex(item => item.id == id);
                if (this.$store.state.tasklist.find(item => item.id == id).done != this.todolist.tasks[i].done)
                    this.todolist.tasks[i].done = !this.todolist.tasks[i].done;
            });
        }
    }
};
</script>

<style scoped>

@media (min-width: 768px) and (max-width: 1023px) {
    .box-card.user-card {
        margin-right: 0 !important;
    }
    .box-card { margin-bottom: 2rem; }

}

@media (min-width: 1024px) and (max-width: 1188px) {
    .header h1 {
        letter-spacing: -9px;
        font-size: 2rem;
        margin-top: 2rem;
        margin-bottom: 0rem;
    }
    .box-card { margin-bottom: 0rem;}
    .box-card.tasks {
        margin-right: 0rem;
    }
    .box-card.ressources {
        margin-right: 0rem;
    }
}


.intro-input { margin-top: 130px; text-align: center; }
.intro-input .circles { position: absolute; height: 230px; width: auto; left: -100px; top: 190px; z-index: 1; }
.intro-input .text-top { color: #212D59; z-index: 100; line-height: 1.2; margin-bottom: .8rem; font-weight: 700; position: relative; }
.intro-input .text-bottom { color: #7C839C; font-weight: 300; }
.intro-input .searchbar { position: relative;  margin-top: 45px; z-index: 1000; }

.category-title { color: #212D59; opacity: 0.3; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; font-size: 18px; margin-top: 60px; margin-bottom: 10px; }
.question-title { color: #212D59; font-weight: 600; font-size: 38px; margin-top: 60px; margin-bottom: 20px; }

a.button { border: solid 1px #00BBFF; color: #00BBFF; padding: 20px 20px 20px 70px; margin-bottom: 200px; font-weight: 500; font-size: 22px; margin-top: 20px; }
a.button .budicon { margin-left: 30px; }

.list-items {
    margin-bottom: 80px;
}

.list .items { border: solid 1px #E5E7EB; box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1); border-radius: 4px;background-color: white; overflow: hidden; }
.list .category { border: 1px solid #212D59; border-radius: 4px; padding: 4px 6px 2px 6px; display: inline-block; font-size: .9rem !important; line-height: 1.5; font-weight: 300; margin-bottom: 10px; margin-right: 5px; }
.list .name { color: #212D59; line-height: 1.5; font-weight: 600; margin-bottom: 10px; }
.list .desc { color: #7C839C; font-weight: 300; line-height: 1.6; text-overflow: ellipsis; max-height: 2.8em; overflow: hidden; padding: 0; margin-bottom: 20px; }
.list .like { color: #00BBFF; font-size: 12px; font-weight: 400; }
.list .desc::after { content: ' ...'; display: inline-block; width: 20px; height: 20px; }

.item { transition: all 0.4s ease; }
.item:hover { transform: translate3D(0, -1px, 0) scale(1.05); transition: all 0.4s ease; }

.budget { border-color: #FECA57 !important; color: #FECA57; }
.credit { border-color: #D980FA !important; color: #D980FA; }
.terrain { border-color: #CF815F !important; color: #CF815F; }
.plan{ border-color: #00BBFF !important; color: #00BBFF }
.permis-de-construire { border-color: #55E6C1 !important; color: #55E6C1; }
.assurance { border-color: #FF5252 !important; color: #FF5252; }
.chantier { border-color: #FEA47F !important; color: #FEA47F; }
.chantier { border-color: #FEA47F !important; color: #FEA47F; }
.divers { border-color: #455A64 !important; color: #455A64; }





.header {
    display: flex;
    align-items: baseline;
}

.el-col { flex: 1 1 auto; }

.box-card { padding: 8px 8px;box-shadow: 0 5px 23px 0 rgba(0, 0, 0, .07) !important}
.box-title {color: rgba(33, 45, 89, 1); font-weight: 400; letter-spacing: -1px; margin-top: 0; margin-bottom: 0; position: relative; }
.box-title::after {
    display: block;
    bottom: .1rem;
    position: absolute;
    content: '';
    width: 18px;
    /* margin: auto; */
    height: 3px;
    background: #00BBFF;
    border-radius: 500px;
}

.user { text-align: center; }
.user:hover {  }

.user-info { margin-bottom: 4rem; }
.user-picture img { border: 2px solid rgba(255, 255, 255, 0.8) !important;padding: 0px; border-radius: 50%; width: 100px; height: 100px; right: -10px; position: relative; z-index: 1; opacity: 1; box-shadow: 0 0 22px 0 rgba(0, 0, 0, .1); }
.user-picture img + img { left: -10px; position: relative; z-index: 0; }
.user-name { font-weight: 400; margin-top: .5rem; margin-bottom: .1rem; color: #fff; }
.user-date { margin-top: 0; font-weight: 300; color: #fff; font-size: 0.9rem; }
.user-name p { font-weight: 300; font-style: italic; display: inline; }

.user-progress {
    margin-bottom: 1.2rem;
}

.user-progress-title {margin-bottom: .3rem; font-weight: 300;  font-size: .9rem;  color: #fff; }

.tooltip {box-shadow: 0 2px 22px 0 rgba(0, 0, 0, .1); min-width: 40px; position: relative; z-index: 1; width: auto; background-color: rgba(255, 255, 255, 0.9); color: #26C5FA; text-align: center; letter-spacing: -1px; font-weight: 500; font-size: 13px; padding: 5px 0; border-radius: 4px; bottom: 50px; float: right; left: 20px; }
.tooltip:after, .tooltip:before { top: 100%; left: 50%; border: solid transparent; content: " "; height: 0; width: 0; position: absolute; pointer-events: none; }
.tooltip:after { border-color: rgba(251, 251, 252, 0); border-top-color: #FBFBFC; border-width: 5px; margin-left: -5px; }
.tooltip:before { border-color: rgba(224, 226, 232, 0); border-top-color: #E0E2E8; border-width: 6px; margin-left: -6px; }
.user, .tasks {
    padding: .5rem 2rem .8rem 1rem;
    height: 500px;
    box-sizing: border-box;
}

.user {
    padding: 0rem 2rem .8rem;
}

.task-list { list-style: none; padding: 0;margin-top: -.3rem; margin-bottom: 0; }

.task-item { display: flex; align-items: flex-start; margin-bottom: 0em; position: relative; padding-top: 1.1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(33, 45, 89, 0.08); }
.task-item:hover {
    cursor: pointer;
}
.task-item:hover .task-name {
    color: rgba(33, 45, 89, 1);
    font-weight: 500;
}
.task-item:hover .task-category { color: rgba(33, 45, 89, 0.6);}
.task-item:last-child { margin-bottom: 0; border-bottom: none; }
.task-item.is-active .task-name { text-decoration: line-through; color: rgba(33, 45, 89, 0.7); }

.task-check { }
.task-check:hover { cursor: pointer; }
.task-info { margin-left: 3.5rem; }
.task-name { color: rgba(33, 45, 89, .85); font-weight: 400; font-size: 0.9rem; }

.task-category { color: rgba(33, 45, 89, 0.5); font-weight: 300; font-size: 0.8rem; }
.task-link {
    cursor: pointer;
    margin-top: .45rem;
    margin-right: -1.2rem;
    text-align: right;
    float: right;
    font-size: .8rem;
    position: relative;
    z-index: 1000;
}
.task-link a {
    text-decoration: none;
    color: #00BBFF;
}

.task-link.profile a {
    color: #fff;
}

.ressource-container { 
    overflow-x: hidden;
    max-height: 600px !important;
    overflow-y: scroll;
    overflow-y: overlay;
    margin-top: 1.4rem;
    display: flex;
    flex-direction: column;
    color: rgba(33, 45, 89, 1);
}
.ressource-container:hover {
    overflow-x: hidden; overflow-y: scroll; overflow-y: overlay; 
}
.ressource-container::-webkit-scrollbar {
    width: .5em;
    /* height: .4rem; */
    border-radius: 50%;
    transition: all .4s linear;
}

.ressource-item { position: relative; box-shadow: 0 4px 4px 0px rgba(0, 0, 0, .04); margin-bottom: 1rem; flex: 0 1 25%; background: #fff; border-radius: 6px; border: 1px solid rgba(33, 45, 89, 0.15); margin-right: 1rem; padding: .3rem 1rem 1rem; }
.ressource-item:hover { transition: .2s linear; cursor: pointer; background: #FBFBFC; box-shadow: 0 7px 10px 0px rgba(0, 0, 0, .1) }
.ressource-item:last-child { margin-bottom: 0;  }
.ressource-title { margin: 0; margin-bottom: 6px; font-size: 0.9rem; font-weight: 500; line-height: 1.4; color: rgba(33, 45, 89, 1) }
.ressource-tag {
    font-size: 0.7rem;
    margin-bottom: 1rem;
    margin-right: 1rem;
    display: inline-block;
    border: 1px solid #ccc;
    padding: .3rem .3rem .1rem;
    border-radius: 5px;
 }
.ressource-summary {color: rgba(35, 49, 88, .7); font-size: .8rem; line-height: 1.6; margin: 0; margin-bottom: 6px; font-weight: 300; }
.ressource-more { color: #4BC0FD; text-decoration: none; font-size: .75rem; font-weight: 500; }

.ressource-link {
    text-decoration: none;
    color: inherit;
}


.summary { display: flex; flex-direction: column; border: 1px solid rgba(33, 45, 89, .08); border-radius: 6px; padding-bottom: 0px; padding: inherit 0; }

.summary h4 {
    text-align: center;
    color: rgba(33, 45, 89, .5);
    font-weight: 300;
    font-size: 1rem;
    margin-bottom: -5px;
    text-transform: uppercase;
}

.summary-item {
    display: flex;
    align-items: center;
    align-content: center;
    width: 12em;
    margin: 0 auto;
    position: relative;
    left: 2%;
    border-bottom: 1px solid rgba(33, 45, 89, .1);
}

.summary-item:first-of-type {
    border: none;
    /* text-align: center; */
    width: auto;
    display: block;
    margin-bottom: 12px;
    font-size: 2rem;
}

.summary-item:last-of-type {
    border-bottom: none;
}

.summary-icon  {
    font-size: 3rem;
    width: .7em;
    color: #00BBFF;
    margin-right: .7em;
    margin-top: 8px;
    text-align: center;
}

.summary-icon img {
    height: 2.3rem;
}
.summary-detail {
    text-align: left;
}
.summary-name {
    color:rgba(33, 45, 89, .4);
    font-weight: 400;
    font-size: .85rem;
}
.summary-amount {
    /* width: auto; */
    color:rgba(33, 45, 89, 1);
    font-weight: 400;
}
.summary-amount::after {
    content: '€';
}
.apport, .emprunt {
    flex: 1;
}
.total {
    /* text-align: center; */
    flex: 1;
}
.total .summary-amount {
    font-size: 1.8rem;
    letter-spacing: -2px;
    text-align: center;
}
.total .summary-name {
    font-weight: 400;
    font-size: 1.5rem;
    margin-top: -.9rem;
}

.table-input {
    border: none;
    border-bottom-style: hidden;
    font-size: 1em;
    width: 57% !important;
    padding-right: .3rem;
    font-weight: 400;
    color:rgba(33, 45, 89, 1);
}

.table-input:active, .table-input:focus {
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    padding-bottom: 0px;
    border-bottom: 1px solid rgba(33, 45, 89, .3);
    width: 80%;
}
.table-input:hover {
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    padding-bottom: 0px;
    border-bottom: 1px solid rgba(33, 45, 89, .3);
    width: 80%;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
}
.progress-outer { padding: 3px; box-shadow: 0 0 22px 0 rgba(0, 0, 0, .1);background-color: rgba(255, 255, 255, 0.7); height: 14px; border-radius: 10px; flex-grow: 1; margin-left: 20px; margin-right: 20px; margin-bottom: 0rem; }
.progress-inner { background: #00D4F6;height: 100%; border-radius: 25px; transition: width 1s; }

.task-stats {
    display: flex;
    align-content: center;
    align-items: center;
}

.task-stat-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-content: center;
    align-items: center;
}

.task-stat-number {
    font-weight: 400;
    font-size: 1.6rem;
    margin-bottom: -.3rem;
    color: #fff;
}

.task-stat-label {
    font-size: .8rem;
    color: rgba(255, 255, 255, 0.705);
    line-height: 1.5em;
}

.tasks h2 {
    margin-bottom: 1rem;
}

.projet-container {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    align-items: stretch;
}

.box-card {
    margin-right: 2.5rem;
}

.box-card.summary, .box-card.chantiers, .box-card.permis, .box-card.ressources, .box-card.chiffrage-plan {
    margin-right: 0;
}

.chiffrage-plan-upload {
    padding: 1rem;
}

.chiffrage-plan-file:hover {
    background-color: rgba(0,0,0,.1);
}

.upload-success {
    color:rgb(92, 186, 51);
}

.chiffrage-plan-file {
    margin-bottom: .3rem;
    cursor: pointer;
}

.chiffrage-plan-file:last-of-type {
    margin-bottom: 0;
}

.chiffrage-plan-files {
    display: flex;
    flex-direction: column;
}

.user {
    flex: 2;
}

.tasks {
    flex: 3
}

.summary {
    flex: 2;
}

.ressources {
    /* flex: 8; */
}
.box-card {
    position: relative;
}

.tasks.box-card, .summary.box-card {
    position: relative;
}
.tasks.box-card::after {
    content: url('../../Assets/bg-todolist.svg');
    position: absolute;
    bottom: -3rem;
    right: -2rem;
    width: 30%;
    opacity: .05;
}

.summary.box-card::after {
    content: url('../../Assets/bg-budget.svg');
    position: absolute;
    top: -1.2rem;
    right: -2rem;
    width: 40%;
    opacity: .05;
}
.terrains.box-card::after {
    content: url('../../Assets/bg-terrain.svg');
    position: absolute;
    top: -2rem;
    left: -2rem;
    width: 25%;
    opacity: .05;
}
.credits.box-card::after {
    content: url('../../Assets/bg-credit.svg');
    position: absolute;
    top: 0rem;
    left: -3rem;
    width: 25%;
    opacity: .05;
}

.plans.box-card::after {
    content: url('../../Assets/bg-plans.svg');
    position: absolute;
    top: -2rem;
    left: -2rem;
    width: 30%;
    opacity: .05;
}

.prestataires.box-card::after {
    content: url('../../Assets/bg-prestataires.svg');
    position: absolute;
    top: 0rem;
    left: -1rem;
    width: 25%;
    opacity: .05;
}

.chantiers.box-card::after {
    content: url('../../Assets/bg-chantier.svg');
    position: absolute;
    top: 0rem;
    left: -2rem;
    width: 30%;
    opacity: .05;
}
.permis.box-card::after {
    content: url('../../Assets/bg-pc.svg');
    position: absolute;
    top: 0rem;
    left: -1rem;
    width: 25%;
    opacity: .05;
}

.budget { border-color: #FECA57 !important; color: #FECA57; }
.credit { border-color: #D980FA !important; color: #D980FA; }
.terrain { border-color: #CF815F !important; color: #CF815F; }
.plan { border-color: #00BBFF !important; color: #00BBFF }
.permis-de-construire { border-color: #55E6C1 !important; color: #55E6C1; }
.assurance { border-color: #FF5252 !important; color: #FF5252; }
.chantier { border-color: #FEA47F !important; color: #FEA47F; }

.help {
    color: #00BBFF;
    border: 1px solid #00BBFF; font-weight: 400; border-radius:50%; padding: 0; margin: 0; height: 22px; line-height: 22px;
    width: 22px;
    position: relative;
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
    display: flex;
    flex-direction: row;
    align-content: flex-start;
    align-items: center;
}

.el-carousel__item.welcome {
    display: flex;
    flex-direction: column;
}

.el-carousel__item.welcome h1 {
    margin-bottom: 0rem;
    margin-top: auto;
    margin-bottom: auto;
    text-align: center;
}
.el-carousel__item.welcome p {
    letter-spacing: 0;
    text-align: center;
}

.el-carousel__item header {
    flex: 2;
    margin: 3rem;
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
    border-radius: 4px;
    width: 100%;
    box-shadow: 0px 0px 22px 3px rgba(0, 0, 0, .15);
    overflow: hidden;
    flex: 4;
    background: #fff;
    padding: 0;
    margin: 3rem;
}

.el-carousel__item.welcome img {
    border-radius: 4px;
    overflow:visible;
    flex: 0;
    background: #fff;
    padding: 0;
    margin: 0;
}

.el-carousel__item:nth-of-type(2) header {
    order: 2;
}

.profile-overview {
    /* box-shadow: 0px 0px 22px 3px rgba(0, 0, 0, .15); */
    display: flex;
    border-radius: 6px;
    /* justify-content: space-around; */
    background-color: #FFF;
        background: linear-gradient(to bottom,rgba(0, 207, 249, 0.803),rgba(0, 187, 255, 0.925));
    flex-direction: column;
}

.terrains.box-card {
    position: relative;
}
.terrain-container, .credit-container, .plan-container {
    margin-top: 1rem;
}

.data-label {
    color: rgba(33, 45, 89, .4);
    font-size: .8rem;
}

.data-output {
    color: #31BDFC;
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 300;
    margin-bottom: 1.2rem;
}

/*
##Device = Laptops, Desktops
##Screen = B/w 1025px to 1280px
*/

@media (min-width: 1025px) and (max-width: 1280px) {

    .profile-overview {
        /* height: 640px; */
    }
    .user-picture img + img { left: initial }
    .user-picture img { width: 90px; height: 90px; }
}

/*
##Device = Tablets, Ipads (portrait)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {

    .profile-overview {
        /* height: 640px; */
    }

    .user-picture img + img { left: initial }
    .user-picture img { width: 90px; height: 90px; }
}

/*
##Device = Tablets, Ipads (landscape)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
    .profile-overview {
        /* height: 640px; */
    }
    .user-picture img + img { left: initial }
    .user-picture img { width: 90px; height: 90px; }
}

.no-recent-content a {
    text-align: center;
    border: 1px solid #31BDFC;
    border-radius: 4px;
    padding: 1.5em;
    color: #31BDFC;
    display: block;
    text-decoration: none;
}

</style>
