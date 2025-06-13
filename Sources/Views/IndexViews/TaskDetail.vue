<template>
    <div class="main-container">
        <el-row type="flex" class="header">
            <span @click="goBack()" style="text-decoration: none">
                <h1><i class="back-page el-icon-back"></i> Mes tâches</h1>
            </span>
        </el-row>
        <el-row class="task-container" type="flex" :gutter="16">
            <el-col class="task-main" :xl="19" :lg="19" :md="24" :sm="24">
                <el-row class="task-head" type="flex">
                    <el-col class="task-check" :span="1" :sm="1" :md="1">
                        <checkbox :id="currentTask.id" :done="currentTask.done" :cb="getTaskStatus"/>
                    </el-col>
                    <el-col class="task-info" :span="22" :sm="20" :md="18">
                        <el-row class="task-name">
                            <h2>{{ currentTask.name }}</h2>
                        </el-row>
                        <el-row class="task-details" type="flex">
                            <el-col class="task-meta">
                                <el-dropdown v-if="currentTask._edit" @command="setObjectif" class="task-objectif">
                                    <span class="el-dropdown-link">
                                        {{ currentTask.objectif }}
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="objectif" v-for="objectif in objectifs" :value="objectif.name" :key="objectif.name">{{objectif.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <span v-else class="el-dropdown-link">{{currentTask.objectif}}</span>
                                <i class="task-separator el-icon-arrow-right"></i>
                                <el-dropdown  v-if="currentTask._edit" @command="setCategory" class="task-cateogy">
                                    <span class="el-dropdown-link">
                                        {{ currentTask.category }}
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item :command="category" v-for="category in categories" :key="category.name">{{category.name}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                                <span v-else class="el-dropdown-link">{{ currentTask.category }}</span>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row style="margin: 0 0rem 0 0; position: relative;" type="flex" :gutter="0">
                    <textarea v-if="currentTask._edit" ref="desc" placeholder="Ajouter une description" @keyup="saveDesc(); handleKeyupDesc()" class="task-description" v-model="currentTask.desc" :span="15"></textarea>
                    <span class="save-message" style="position: absolute; bottom: -5px; left: 10px;">{{ desc.saveMessage }}</span>

                    <el-col style="margin-right: 24px;" v-if="!currentTask._edit" ref="desc" v-html="currentTask.desc" :class="'task-description close ' + (readMore == true ? 'open' : '')" :xl="16" :lg="16" :md="16" :sm="2" :xs="24"></el-col>
                    <div class="read-more" v-if="!currentTask._edit && readMore != null" @click="readMore = !readMore">{{ readMore == true ? 'Lire moins ↑' : 'Lire plus ↓'}}</div>

                    <el-col class="task-plugins" :md="10" :xl="10" :lg="10" :sm="18" :xs="24">

                        <router-link v-if="currentTask.url" :to="{ name: currentTask.url}" style="margin-bottom: 1.8rem;"  class="task-plugin task-action-plan">
                            <!-- <i class="el-icon-check"></i> -->
                            <span class="task-plugin-name">C'est parti !</span>
                        </router-link>

                        <!-- <h3 style="font-weight: 400; font-size: .9rem; margin: 0; margin-top: .5rem;" class="title">Notes <span class="save-message">{{ note.saveMessage }}</span></h3> -->
                        <div class="task-note" style=" position: relative;">
                            <span class="save-message">{{ note.saveMessage }}</span>
                            <textarea ref="note" @keyup="saveNote(); handleKeyupNote()" placeholder="Notez ici tout ce qui vous passe par la tête ..." v-model="currentTask.note"></textarea>
                        </div>

                    </el-col>
                </el-row>
                <!-- <el-row class="task-notes" style="margin-top: 1rem; margin-bottom: 2rem;">
                    <el-col :span="14">
                        <h3 class="title">Notes <span class="save-message">{{ note.saveMessage }}</span></h3>
                        <div class="task-note">
                            <textarea ref="note" @keyup="saveNote(); handleKeyupNote()" placeholder="Exemple : téléphoner à Jacques pour lui demander des renseignements" v-model="currentTask.note"></textarea>
                        </div>
                    </el-col>
                </el-row> -->
            </el-col>
            <el-col style="margin-top: .6rem;" class="task-side" :xl="5" :lg="5" :md="24" :sm="24">
                <el-row class="ressources">
                    <h3 class="title" v-if="currentTask.ressources.length">Ressources suggérées</h3>
                    <div class="ressource-container">
                        <div v-for="ressource in currentTask.ressources" :key="ressource.name" class="ressource-item">
                            <a class="ressource-link" target="_blank" :href="getItemURL(ressource)">
                            <div v-for="category in ressource.category" :key="category.name" class="ressource-tag credit">
                                {{ category.name }}
                            </div>
                            <h3 class="ressource-title">
                                {{ ressource.name }}
                            </h3>
                            <p v-if="" class="ressource-summary">
                                {{ getRessource(ressource.html) }}
                            </p>
                            <span class="ressource-more">
                                En savoir plus
                            </span>
                            </a>
                        </div>
                    </div>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import Checkbox from '../../Components/Todolist/Checkbox.vue';
export default {
    name: 'TaskDetail2',
    components: {
        'checkbox': Checkbox,
    },
    computed : {
        todolist() {
            return this.$store.state.todolist;
        },
        currentObjectif() {
            return this.$store.state.currentObjectif;
        },
        tasklist() {
            return this.$store.state.tasklist;
        },
        categories() {
            return this.$store.state.todolist.categories;
        },
        objectifs() {
            return this.$store.state.todolist.objectifs;
        },
        user() {
            return this.$store.state.user;
        },
    },
    data() {
        return {
            currentTask: {
                id: '',
                url: '',
                name: '',
                desc: '',
                objectif: '',
                category: '',
                favori: false,
                dateTime: '',
                budget: '',
                note: '',
                checklist: [],
                ressources: [],
                date: {
                    create: null,
                    modify: null
                },
                done: false,
                _edit: false
            },
            readMore: false,
            note: {
                saveMessage: '',
                timeout: undefined,
            },
            desc: {
                saveMessage: '',
                timeout: undefined,
            }
        }
    },
    mounted() {
        if (this.tasklist.length == 0) {
            this.$http.get(this.$root.URL + '/todolist/get').then((res) => {
                var todolist = res.data.todolist;

                todolist.nbTasksDone = 0;
                todolist.nbTasksFavori = 0;
                todolist.nbTasksTotal = todolist.tasks.length;
                for (var i = 0; i < todolist.tasks.length; i++) {
                    todolist.tasks[i]._showDel = false;
                    if (todolist.tasks[i].done == true) todolist.nbTasksDone += 1;
                    if (todolist.tasks[i].favori == true) todolist.nbTasksFavori += 1;
                }

                this.$store.commit('setTasklist', todolist.tasks);
                this.$store.commit('setTodolist', todolist);
                for (var i = 0; i < todolist.objectifs.length; i++) {
                    if (todolist.objectifs[i].completeTask < todolist.objectifs[i].totalTask) {
                        this.$store.commit('setCurrentObjectif', i);
                        break;
                    }
                }
            }, (error) => {});
        }

        this.$http.get(this.$root.URL + '/todolist/get-task/' + this.$route.params.id).then((res) => {
            // if (this.user.money.hasPaid == false && res.data.task._edit == false) {
            //     this.$router.replace({ name: 'Todolist' });
            // }
            this.currentTask = res.data.task;
            if (this.currentTask._edit) {
                this.currentTask.desc = this.currentTask.desc.replace(/<[^>]*>/g, "");
            }
            this.currentTask.checklistInfo = {
                totalTask: res.data.task.checklist.length,
                completeTask: 0,
                newTask: ''
            }
            for (var i = 0; i < this.currentTask.checklist.length; i++) {
                if (this.currentTask.checklist[i].done == true) {
                    this.currentTask.checklistInfo.completeTask += 1;
                }
            }
            if (this.currentTask._edit == false) {
                this.$nextTick(() => {
                    if (this.$refs.desc.$el.scrollHeight == this.$refs.desc.$el.clientHeight) {
                        this.readMore = null;
                    }
                    this.$refs.desc.$el.style.overflow = 'hidden';
                });
            }
        }, (error) => {});
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        getItemURL(item) {
            if (item.formType == 'Question') {
                return item.url;
            } else {
                this.$root.MIP_URL + '/lexique/definition/' + item.url
            }
        },
        getRessource(html) {
            html = html.replace(/<[^>]*>/g, "");
            if (html.length > 80) {
                html = html.slice(0, 80)
                html += '...';
                return html;
            }
            return html
        },
        setObjectif(objectif) {
            this.currentTask.objectif = objectif.name
            this.$http.post('/todolist/edit-key-value', {id: this.currentTask.id, key: 'objectif', value: objectif.name}).then(response => {
                return (objectif.name);
            });
            return undefined;
        },
        setCategory(category) {
            this.currentTask.category = category.name
            this.$http.post('/todolist/edit-key-value', {id: this.currentTask.id, key: 'category', value: category.name}).then(response => {
                return (category.name);
            });
            return undefined;
        },
        saveNote() {
            this.note.saveMessage = "Sauvegarde en cours..."
            if (this.note.timeout) clearTimeout(this.note.timeout)
            this.$http.post('/todolist/edit-key-value', {id: this.currentTask.id, key: 'note', value: this.currentTask.note}).then(response => {
                this.note.timeout = setTimeout(() => {
                    this.note.saveMessage = "Sauvegardé !";
                }, 2000);
            });
        },
        saveDesc() {
            this.desc.saveMessage = "Sauvegarde en cours..."
            if (this.desc.timeout) clearTimeout(this.desc.timeout)
            this.$http.post('/todolist/edit-key-value', {id: this.currentTask.id, key: 'desc', value: this.currentTask.desc}).then(response => {
                this.desc.timeout = setTimeout(() => {
                    this.desc.saveMessage = "Sauvegardé !";
                }, 2000);
            });
        },
        handleKeyupDesc() {
            this.$refs.desc.style.minHeight = '305px';
            this.$refs.desc.style.height = '0px';
            this.$refs.desc.style.height = (this.$refs.note.scrollHeight - 13) + 'px';
        },
        handleKeyupNote() {
            this.$refs.note.style.minHeight = '150px';
            this.$refs.note.style.height = '0px';
            this.$refs.note.style.height = (this.$refs.note.scrollHeight - 13) + 'px';
        },
        getTaskStatus(id) {
            var i = this.todolist.tasks.findIndex(item => item.id == id);
            if (this.$store.state.tasklist.find(item => item.id == id).done != this.currentTask.done) {
                this.currentTask.done = !this.currentTask.done;
            }
        },
        showChat() {
            $crisp.push(["set", "session:event", ["task-1"]]);
        }
    }
}
</script>
<style scoped>


.task-container {
    margin-top: 3rem;
    flex-wrap: wrap;
}

.header h1::after {
    left: 23%;
}
.task-head {
    margin-bottom: 1rem;
}
.task-check {
    margin-right: .8rem;
    cursor: pointer;
}
.task-name h2 {
    margin: 0;
    font-size: 1.3rem;
    color: rgba(35, 49, 88, 1);
    font-weight: 500;
}
.task-details {
    display: flex;
}
.task-details .el-dropdown-link {
    color: rgba(35, 49, 88, .5);
}
.task-separator {
    font-size: .8rem;
    color: rgba(35, 49, 88, .3);
}
.task-plugins {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}
.task-plugin {
    margin-bottom: 1rem;
    cursor: pointer;
    box-sizing: border-box;
    /* padding: 2rem; */
    border: 1px dashed rgba(35, 49, 88, .2);
    border-radius: 4px;
    text-align: center;
    text-decoration: none;
}
.task-plugin:hover {
    border-color: #31bdfc;
}
.task-plugin:hover .task-plugin-name {
    color: #31bdfc;
}
.task-help {
    border: none;
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1);
    font-weight: 200;
    font-size: 1.4rem;
    background: linear-gradient(5deg, rgba(46,204,113,1) 0%, rgba(145,212,101,1) 100%);
    color: #31bdfc;
    text-decoration: none;
}
.task-action-plan {
    border: none;
    box-shadow: 0 4px 5px 1px rgba(35, 49, 88, .1);
    font-weight: 500;
    font-size: 1.4rem;
    background: #31bdfc ;
    color: #31bdfc !important;
    transition: .1s linear;
    padding: 1rem;
}
.task-action-plan:hover {
    box-shadow: 0 4px 12px 4px rgba(35, 49, 88, .15);
    transition: .1s linear;
}
.task-plugin:last-of-type {
    margin-bottom: 0;
}
.task-plugin-name {
    color: rgba(35, 49, 88, .6);
}
.task-plugin i {
    color: #4BC0FD;
}
.task-help i, .task-help .task-plugin-name, .task-action-plan i, .task-action-plan .task-plugin-name {
    color: #fff !important ;
}
textarea.task-description {
    border: none;
    resize: none;
    border-left: 2px solid #4BC0FD;
    outline: none;
    font-size: 1rem;
}

textarea::placeholder {
    color: rgba(35, 49, 88, .3);
}

.task-description {
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 );
    border-radius: 4px;
    color: rgba(35, 49, 88, .9);
    padding: 1rem 1.5rem !important;
    /* border-left: 2px solid #4BC0FD; */
    position: relative;
    overflow: scroll;
    width: 45rem;
    transition: .7s linear;
}
.task-description.close { height: 320px; transition: all .7s linear;}
.task-description.open { height: auto; transition: all 2s ease; }
.task-description:hover {
    background: white;
}

.read-more {
    color: #4BC0FD;
    position: absolute;
    background: #FFFFFF;
    box-shadow: 0 0 10px 2px rgba(0, 0, 0, .1);
    left: 25%;
    bottom: -.8rem;
    width: 100px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 20px;
    box-sizing: border-box;
    transition: .7s linear;
    z-index: 10;
    cursor: pointer;
    font-size: .85rem;
}

.task-description:hover after {
    cursor: pointer;
}

.task-note { background: linear-gradient(#FFFACD,#F7EAB1); border: solid 1px #E3E4E9; border-radius: 4px; }
.task-note textarea {
    padding: .8rem 2rem 1rem;
    border: none;
    outline: none;
    resize: none;
    background: transparent;
    overflow: hidden;
    color: #212D59;
    font-size: 14px;
    width: 91%;
    margin: 0 auto;
    height: 150px;
    margin-bottom: auto;
    margin-top: 10px;
    /* box-sizings  : border-box; */
}
.task-note textarea::placeholder { color: rgba(35, 49, 88, .3); font-size: .9rem; }

.ressources { margin-top: 1.2rem; height: 550px; width: 100%; position:relative; }
.ressources > h3, .task-notes h3, .save-message { color: rgba(35, 49, 88, .3); font-size: .9rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 500; padding-bottom: 0; margin-bottom: .5rem; }
.save-message {
    position: absolute;
    font-size: .65rem;
    bottom: 0rem;
    right: 1rem;
}
.ressource-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    color: rgba(33, 45, 89, 1)
}
.ressource-container:hover {
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
    width: 100%;
}

.ressource-container::-webkit-scrollbar {
    width: .25em;
    /* height: .4rem; */
    border-radius: 50%;
    transition: all .4s linear;
}

.ressource-container::before {
    content: '';
    background: linear-gradient(to bottom, rgba(255,255,255,0.19) 0%,rgba(255,255,255,0.92) 88%,rgba(255,255,255,1) 98%,rgba(255,255,255,1) 100%);
    width: 100%;
    height: 80px;
    position: absolute;
    bottom: -3rem;
    z-index: 1000;
}
.ressource-item { position: relative; box-shadow: 0 4px 4px 0px rgba(0, 0, 0, .04); margin-bottom: 1rem; flex: 0 1 25%; background: #fff; border-radius: 6px; border: 1px solid rgba(33, 45, 89, 0.15); margin-right: 1rem; padding: 1.2rem; }
.ressource-item:hover { transition: .2s linear; cursor: pointer; background: #FBFBFC; box-shadow: 0 7px 10px 0px rgba(0, 0, 0, .1) }
.ressource-item:last-child { margin-bottom: 0;  }
.ressource-title { margin: 0; margin-bottom: 6px; font-size: 0.9rem; font-weight: 700; line-height: 1.4; }
.ressource-tag {
    opacity: 0.6;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 1px;
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
    color: currentColor;
}
.budget { border-color: #FECA57 !important; color: #FECA57; }
.credit { border-color: #D980FA !important; color: #D980FA; }
.terrain { border-color: #CF815F !important; color: #CF815F; }
.plan{ border-color: #00BBFF !important; color: #00BBFF }
.permis-de-construire { border-color: #55E6C1 !important; color: #55E6C1; }
.assurance { border-color: #FF5252 !important; color: #FF5252; }
.chantier { border-color: #FEA47F !important; color: #FEA47F; }

.back-page {
    color: rgba(35, 49, 88, .3);
    font-size: 1.5rem;
    vertical-align: middle;
    cursor: pointer;
    border-radius: 4px;
    padding: .4rem .8rem;
    box-sizing: border-box;
    border: 1px dotted rgba(35, 49, 88, 0);
}

.back-page:hover {
    border: 1px solid rgba(35, 49, 88, .3);
}

@media (min-width: 768px) and (max-width: 1188px) {
    .ressources {  }
    .ressource-container {
        flex-direction: row;
    }
    .ressource-item {
        flex: 0 1 33%;
    }
    .ressource-item:last-child { margin-right: 0;  }

    .task-plugin-name {
        font-size: 1.1rem;
    }

    .task-check {
        margin-right: 1.4rem;
    }


    .task-name h2 {
        font-size: 1.1rem;
    }
    .task-description {
        font-size: .9rem;
        line-height: 1.8;
    }

}

@media (min-width: 1024px) and (max-width: 1188px) {

}
</style>
