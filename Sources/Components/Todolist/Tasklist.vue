<template>
    <div id="tasklist">
        <div v-if="tasklist.length > 0" class="tasklist" v-for="(obj, index) in todolist.objectifs">
            <el-row v-if="isObjectifInTasklist(obj.name)" class="title" type="flex" align="middle">
                <span class="index">{{ index + 1 }} →</span>
                <span class="text">{{ obj.name }}</span>
            </el-row>
            <div id="top"></div>
            <div>
                <el-row v-for="(task, index) in tasklist" v-if="task.objectif == obj.name" :id="'ex-' + task.id" :class="'task' + (task.done ? ' done' : '')" type="flex" align="middle" @click.native="handleDetailView(task, $event)">
                    <img id="_prevent" :src="'/Assets/favori-' + (task.favori ? 'on' : 'off') + '.svg'" :class="'favori ' + (task.favori ? 'on' : 'off')" @click="handleToggleFavori(task.id, !task.favori)"/>

                    <el-col :span="24" style="padding: 1rem 1.5rem;">
                        <div class="checkbox">
                            <checkbox class="check" :id="task.id" :done="task.done"></checkbox>
                        </div>

                        <div class="task-item">
                            <div class="name">
                                <span v-html="$options.filters.highlight(sanitize(task.name), searchText)"></span>
                            </div>

                            <div class="desc" v-if="searchText.length > 0">
                                <span v-html="$options.filters.highlightDesc(task, searchText)"></span>
                            </div>

                            <div class="category">
                                <span :class="'category-tag ' + getCategoryClass(task.category)" v-html="$options.filters.highlight(task.category, searchText)"></span>
                                <span v-if="task.budget != ''"><i class="budicon budicon-euro"></i> {{ parseInt(task.budget).formatMoney(0) + ' €' }}</span>
                                <span v-if="task.dateTime != ''"><i class="budicon budicon-events"></i> {{ task.dateTime }}</span>
                                <span v-if="task.note.replace(/\s+/g, '').length != 0"><i class="budicon budicon-note-tick"></i> Notes</span>
                            </div>
                        </div>
                    </el-col>

                    <el-col style="z-index: 0;" :span="1" v-if="task._edit">
                        <el-popover placement="top" width="200" trigger="click" v-model="task._showDel">
                            <el-row type="flex" justify="center">
                                <span class="remove-title">Êtes-vous sûr ?</span>
                            </el-row>
                            <el-row type="flex" justify="center">
                                <el-button type="secondary" size="mini" class="remove-cancel" @click="task._showDel = false">Annuler</el-button>
                                <el-button type="primary" size="mini" class="remove-validate" @click="handleRemoveTask(task.id)">Supprimer</el-button>
                            </el-row>
                            <i id="_prevent" slot="reference" class="budicon budicon-trash" @click="task._showDel = true"></i>
                        </el-popover>
                    </el-col>
                </el-row>
            </div>
        </div>

        <div v-if="tasklist.length == 0" class="no-result">
            <el-row>
                <img src="/Assets/search-no-results.svg">
                <p class="title">Oups ...</p>
                <p class="text">Aucun résultat pour votre recherche</p>
            </el-row>
        </div>
    </div>
</template>

<script>
import Checkbox from '../../Components/Todolist/Checkbox.vue';
import accentFolding from 'accent-folding';
import sanitizeHtml from 'sanitize-html';

export default {
    name: 'TaskList',
    components: {
        'checkbox': Checkbox,
    },
    computed: {
        todolist() {
            return this.$store.state.todolist;
        },
        tasklist() {
            return this.$store.state.tasklist;
        },
        searchText() {
            return this.$store.state.searchText;
        },
        user() {
            return this.$localStorage.get('user');
        }
    },
    data() {
        return {
        }
    },
    filters: {
        highlight: function (words, query) {
            if (!words || query == '.' || query == '. ' || query == ' ') return ''
            if (query.length > 0) {
                return accentFolding(words, query, 'mark')
            } else {
                return words;
            }
        },
        highlightDesc: function (task, query) {
            if ((task.desc == '' && task.note == '') || query == '.' || query == '. ' || query == ' ') return ''

            if (task.note.contains(query)) {
                var res = task.note.replace(/<[^>]*>/g, '');
            } else if (task.desc.contains(query)) {
                var res = task.desc.replace(/<[^>]*>/g, '');
            } else return '';

            res = accentFolding(res, query, 'mark');
            var iStart = res.indexOf('<mark>');
            var iEnd = res.indexOf('</mark>');
            var arrayBefore = res.slice(0, iStart).split(' ');
            var highlight = res.slice(iStart, iEnd + 7);
            var arrayAfter = res.slice(iEnd + 7).split(' ');

            var begin = '';
            var end = '';
            for (var i = 0; i < 3; i++) {
                if (arrayBefore.length > 0) {
                    begin = arrayBefore.pop() + (begin != '' ? ' ' + begin : (res[iStart - 1] == ' ' ? ' ' : ''));
                } else {
                    break;
                }
            }
            for (var i = 0; i < 3; i++) {
                if (arrayAfter.length > 0) {
                    end += arrayAfter.shift() + ' ';
                } else {
                    break;
                }
            }
            if (arrayBefore.length > 0) begin = '... ' + begin;
            if (arrayAfter.length > 0) end += ' ...';

            return (begin + highlight + end);
        }
    },
    methods: {
        sanitize(str) {
            return sanitizeHtml(str);
        },
        getCategoryClass(c) {
            return c.toLowerCase().removeAccents().replace(/[^0-9a-zA-Z ]/mg, '').replace(/ /g, '-');
        },
        isObjectifInTasklist(objectif) {
            for (var i = 0; i < this.tasklist.length; i++) {
                if (this.tasklist[i].objectif == objectif) {
                    return true;
                }
            }
            return false;
        },
        handleDetailView(task, event) {
            if (event.target.id == '') {
                this.$router.push({ name: 'TaskDetail', params: { id: task.id }})
            }
        },
        handleToggleFavori(id, value) {
            this.$http.post(this.$root.URL + '/todolist/edit-key-value', { id: id, key: 'favori', value: value }).then(res => {
                this.$store.commit('toggleFavori', id);
            }, res => {
                console.log('ERROR toggleFavori Server');
            });
        },
        handleRemoveTask(id) {
            this.$http.post(this.$root.URL + '/todolist/remove-task', { id: id }).then(res => {
                this.$store.commit('removeTask', id);
                this.$message({
                    title: 'Suppression',
                    message: 'Cette tâche a bien été supprimée',
                    type: 'success',
                    center: true,
                    duration: 5000
                });
            }, res => {
                console.log('ERROR removeTask Server');
            });
        }
    }
}
</script>

<style scoped>

.tasklist {  }
.tasklist .title { margin-bottom: 4px; }
.tasklist .title .index { font-size: 26px; font-weight: 300; margin-top: 0px; color: #00BBFF; margin-right: 5px; }
.tasklist .title .text { font-size: 22px; font-weight: 500; color: #212D59; }

.tasklist {  }

.tasklist .task { border: solid 1px #E3E4E9; box-sizing: border-box; border-bottom: none; z-index: 1; }
.tasklist .task.done { background-color: #F9FAFB; z-index: 0;}
.tasklist .task:last-child { border-bottom: solid 1px #E3E4E9; border-radius: 0px 0px 4px 4px; margin-bottom: 30px; }
.tasklist .task:first-child { border-radius: 4px 4px 0px 0px; }
.tasklist .task:hover { cursor: pointer; box-shadow: 0px 3px 6px #CECECE; }

.tasklist .task .checkbox {  }
.tasklist .task .checkbox .check {  }
.tasklist .task .checkbox .check:hover { cursor: pointer; }
.tasklist .task .name { font-weight: 400; color: #212D59; font-size: 16px; position: relative !important; display: inline-block !important; }

.tasklist .task.done .name { position: relative !important; display: inline-block !important; }

.task .name:before, .task .name:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    height: 100%;
    width: 0%;
    margin: auto;
    transition: all .4s !important;
}

.task .name:before {
    opacity: .5;
    background: #F9FAFB;
}
.task .name:after {
    opacity: .5;
    height: 1px;
    background: #000;
}

.task.done .name:before, .task.done .name:after {
    width: 100%;
}



.tasklist .task .desc { color: #354682; font-size: 13px; margin-top: 4px; }
.tasklist .task .category { margin-top: .5rem; }
.tasklist .task .category > span { color: #9095AC; font-size: 13px; margin-left: 15px; }
.tasklist .task .category > span:first-child { margin-left: 0px; }
.tasklist .task .category > span > .budicon { font-size: 14px; position: relative; top: 1px; margin-right: 4px; }
.tasklist .task .favori { position: absolute; height: 32px; top: -1px; right: 10%; }
.tasklist .task .favori.off { visibility: hidden; }
.tasklist .task:hover .favori.off { visibility: visible; }
.tasklist .task .favori:hover { cursor: pointer; }

.tasklist .task .budicon-trash { visibility: hidden; font-size: 20px; position: absolute; right: 4.1%; top: 34%;  }
.tasklist .task:hover .budicon-trash { visibility: visible; color: #C4C8D4; }
.tasklist .task:hover .budicon-trash:hover { color: #FF5252; cursor: pointer; }

.task-item { margin-left: 64px; }

.remove-title { font-size: 18px; font-weight: 600; color: #212D59; margin-bottom: 10px; }
.tasklist .task .remove-validate { background-color: #4BC0FD; border: solid 1px #4BC0FD; }

.no-result { color: #212D59; text-align: center; margin-top: 15%; }
.no-result img { height: 122px; width: 122px; }
.no-result .title { font-weight: 600; font-size: 28px; margin-bottom: 0; }
.no-result .text { font-weight: 500; font-size: 18px; margin-top: 0; opacity: 0.7; }

.category-tag {
    border: 1px solid currentColor;
    padding: .07rem .4rem 0;
    border-radius: 4px;
    font-size: .8rem !important;
}

    .category-tag.terrain {
        border-color: #CF815F;
        color: #CF815F !important;
    }
    .category-tag.credit {
        border-color: #D980FA;
        color: #D980FA !important;
    }
    .category-tag.assurances {
        border-color: #FF5252;
        color: #FF5252 !important;
    }
    .category-tag.plans {
        border-color: #00BBFF;
        color: #00BBFF !important;
    }
    .category-tag.permis-de-construire {
        border-color: #00D390 ;
        color: #00D390!important;
    }
    .category-tag.chantier {
        border-color: #FEA47F;
        color: #FEA47F !important;
    }
    .category-tag.budget {
        border-color: #FECA57;
        color: #FECA57 !important;
    }
    .category-tag.travaux-reserves {border-color: #FEDC57 !important;}
    .category-tag.amenagements-interieurs {
        border-color: #7F8FFF;
        color: #7F8FFF !important;
    }
    .category-tag.amenagements-exterieurs {
        border-color: #7F8FC6;
        color: #7F8FC6 !important;
    }

</style>
