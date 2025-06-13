<template>
    <div class="timeline">
        <div class="block">
            <div v-if="filter.state != null || filter.favori != null || filter.objectif != null || filter.category != null">
                <span class="title">Filtres</span>
                <span class="reset" @click="handleResetFilter()">Réinitialiser</span>
            </div>

            <el-tag v-for="(value, key, index) in filters" v-if="value != null" closable type="info" @close="setFilter(key, null)">{{ value }}</el-tag>
           
        </div>

        <div class="block">
            <div class="title">Tâches</div>
            <div class="state">
                <span class="tick"></span>
                <span :class="'filter state' + (filter.state == 'Réalisées' ? ' current' : '')" @click="setFilter('state', 'Réalisées')">Réalisées</span>
                <span :class="'total-task' + (filter.state == 'Réalisées' ? ' current' : '')">{{ todolist.nbTasksDone }}</span>
            </div>
            <div class="state">
                <span class="circle" style="background-color: #F39C12;"></span>
                <span :class="'filter state' + (filter.state == 'En attente' ? ' current' : '')" @click="setFilter('state', 'En attente')">En attente</span>
                <span :class="'total-task' + (filter.state == 'En attente' ? ' current' : '')">{{ todolist.nbTasksTotal - todolist.nbTasksDone }}</span>
            </div>
        </div>

        <div class="block">
            <div class="title">Objectifs</div>
            <div class="objectifs" v-for="(objectif, index) in todolist.objectifs">
                <span v-if="objectif.totalTask > 0 && objectif.totalTask == objectif.completeTask" class="tick"></span>
                <span v-else :class="'circle' + (currentObjectif.index == index ? ' current' : '')">
                    <span class="index">{{ index + 1 }}</span>
                </span>
                <span @click="setFilter('objectif', objectif.name)" :class="'filter' + (filter.objectif == objectif.name ? ' current' : '')">{{ objectif.name }}</span>
                <span :class="'total-task' + (filter.objectif == objectif.name ? ' current' : '')">{{ objectif.totalTask }}</span>
                <div v-if="index < todolist.objectifs.length - 1" :class="'v-line ' + (index >= currentObjectif.index ? '' : 'hide')"></div>
            </div>
        </div>

        <div class="block">
            <div class="title">Catégories</div>
            <div class="categories">
                <span :class="'filter' + (filter.favori == 'Essentielles' ? ' current' : '')" @click="setFilter('favori', 'Essentielles')">Essentielles</span>
                <span class=""><img src="/Assets/favori-on.svg" style="height: 15px; position: relative; top: 3px; left: 6px;"/></span>
                <span :class="'total-task' + (filter.favori == 'Essentielles' ? ' current' : '')">{{ todolist.nbTasksFavori }}</span>
            </div>
            <div class="categories" v-for="(category, index) in todolist.categories">
                <span @click="setFilter('category', category.name)" :class="'filter' + (filter.category == category.name ? ' current' : '')">{{ category.name }}</span>
                <span :class="'total-task' + (filter.category == category.name ? ' current' : '')">{{ category.totalTask }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Timeline',
    data() {
        return {
            filter: {
                state: null,
                favori: null,
                objectif: null,
                category: null
            }
        }
    },
    computed: {
        todolist() {
            return this.$store.state.todolist;
        },
        filters() {
            return this.$store.state.filter;
        },
        currentObjectif() {
            return this.$store.state.currentObjectif;
        },
        searchText() {
            return this.$store.state.searchText;
        }
    },
    created() {
        if (this.filters.hasOwnProperty('state')) {
            this.filter = Object.assign({}, this.filters);
            var tasklist = [];
            for (var i = 0; i < this.todolist.tasks.length; i++) {
                if (this.filters.objectif == null || this.todolist.tasks[i].objectif == this.filters.objectif) {
                    if (this.filters.category == null || this.todolist.tasks[i].category == this.filters.category) {
                        if (this.filters.state == null || (this.filters.state == 'Réalisées' && this.todolist.tasks[i].done) || (this.filters.state == 'En attente' && !this.todolist.tasks[i].done)) {
                            if (this.filters.favori == null || (this.filters.favori == 'Essentielles' && this.todolist.tasks[i].favori)) {
                                if (this.todolist.tasks[i].name.contains(this.searchText) || this.todolist.tasks[i].desc.contains(this.searchText) || this.todolist.tasks[i].category.contains(this.searchText) || this.todolist.tasks[i].desc.contains(this.searchText) || this.todolist.tasks[i].note.contains(this.searchText)) {
                                    if (this.searchText != '.' && this.searchText != '. ' && this.searchText != ' ') {
                                        tasklist.push(this.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.$store.commit('setTasklist', tasklist);
        }
    },
    methods: {
        setFilter(filter, name) {
            if (this.filter[filter] != name) this.filter[filter] = name;
            else this.filter[filter] = null;
            var tasklist = [];
            for (var i = 0; i < this.todolist.tasks.length; i++) {
                if (this.filter.objectif == null || this.todolist.tasks[i].objectif == this.filter.objectif) {
                    if (this.filter.category == null || this.todolist.tasks[i].category == this.filter.category) {
                        if (this.filter.state == null || (this.filter.state == 'Réalisées' && this.todolist.tasks[i].done) || (this.filter.state == 'En attente' && !this.todolist.tasks[i].done)) {
                            if (this.filter.favori == null || (this.filter.favori == 'Essentielles' && this.todolist.tasks[i].favori)) {
                                if (this.todolist.tasks[i].name.contains(this.searchText) || this.todolist.tasks[i].desc.contains(this.searchText) || this.todolist.tasks[i].category.contains(this.searchText) || this.todolist.tasks[i].desc.contains(this.searchText) || this.todolist.tasks[i].note.contains(this.searchText)) {
                                    if (this.searchText != '.' && this.searchText != '. ' && this.searchText != ' ') {
                                        tasklist.push(this.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.$store.commit('setTasklist', tasklist);
            this.$store.commit('setFilter', this.filter);
        },
        handleResetFilter() {
            this.filter.state = null;
            this.filter.favori = null;
            this.filter.objectif = null;
            this.filter.category = null;
            var tasklist = [];
            for (var i = 0; i < this.todolist.tasks.length; i++) {
                if (this.filter.objectif == null || this.todolist.tasks[i].objectif == this.filter.objectif) {
                    if (this.filter.category == null || this.todolist.tasks[i].category == this.filter.category) {
                        if (this.filter.state == null || (this.filter.state == 'Réalisées' && this.todolist.tasks[i].done) || (this.filter.state == 'En attente' && !this.todolist.tasks[i].done)) {
                            if (this.filter.favori == null || (this.filter.favori == 'Essentielles' && this.todolist.tasks[i].favori)) {
                                if (this.todolist.tasks[i].name.contains(this.searchText) || this.todolist.tasks[i].desc.contains(this.searchText) || this.todolist.tasks[i].category.contains(this.searchText) || this.todolist.tasks[i].desc.contains(this.searchText) || this.todolist.tasks[i].note.contains(this.searchText)) {
                                    if (this.searchText != '.' && this.searchText != '. ' && this.searchText != ' ') {
                                        tasklist.push(this.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            this.$store.commit('setTasklist', tasklist);
            this.$store.commit('setFilter', this.filter);
        }
    }
}
</script>
<style scoped>

.block { margin-bottom: 24px; }
.timeline { margin-top: 30px; }
.timeline .title { text-transform: uppercase; font-size: 13px; font-weight: 700; letter-spacing: 1px; color: #212D59; margin: 16px 0px 4px 0px; }
.timeline .reset { font-size: 12px; color: #4BC0FD; float: right; position: relative; top: 5px; }
.timeline .reset:hover { cursor: pointer; }

.timeline .el-tag--info { background-color: #FFFFFF; margin-top: 4px; margin-right: 2px; }

.timeline .filter { color: #212D59; font-size: 15px; }
.timeline .filter:hover { cursor: pointer; text-decoration: underline; }
.timeline .categories .filter { margin-left: 10px; }
.timeline .state, .timeline .categories { margin-bottom: 10px; }
.timeline .filter.current { font-weight: 600; }

.timeline .total-task { padding-top: 5px; float: right; color: #212D59; font-size: 12px; opacity: 0.7; }
.timeline .total-task.current { font-weight: 600; opacity: 1; }

.circle { top: 2px;margin-right: 6px; position: relative; left: 1px; bottom: 2px; background-color: #DADCE3; height: 16px; width: 16px; border-radius: 50%; display: inline-block; }
.circle.current { background-color: #4BC0FD; }
.circle .index { color: #fff; position: absolute; top: .032em; left: 25%; right: 25%; font-size: .7em; text-align: center; text-shadow: 1px 1px 1px rgba(0, 0, 0, .2); }

.state .circle { height: 8px; width: 8px; top: 0; left: 4px; margin-right: 12px; }

.tick::before { position: relative; bottom: 2px; left: 6px; content: ''; display: inline-block; margin-right: 15px; width: 4px; height: 8px; border: solid #02C701; border-width: 0 2px 2px 0; transform: rotate(45deg); }

.v-line { display: block; position: relative; left: 8px; width: 1px; background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(218,220,227,1) 26%,rgba(218,220,227,1) 49%,rgba(218,220,227,1) 80%,rgba(255,255,255,1) 100%); height: 20px; clear: both; bottom: 2px; margin-bottom: -6px; }
.v-line.hide { background-color: #2ECC71; background: linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(108,204,148,1) 37%,rgba(46,204,113,1) 49%,rgba(75,204,129,1) 62%,rgba(255,255,255,1) 100%);}

.el-tag .el-icon-close { background: red !important; }

.objectifs { margin: 4px 0; }

</style>
