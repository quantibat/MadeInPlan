import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isExpend: false,
        // USER
        user: [
            {
                firstName: "",
                lastName: ""
            }, {
                firstName: "",
                lastName: ""
            }
        ],
        // BUDGET
        budgets: {
            loan: "",
            inflow: ""
        },
        budgetCategory: undefined,
        budgetSearch: "",
        // TODOLIST
        tasklist: [],
        todolist: {
            objectifs: [],
            categories: []
        },
        filter: {},
        currentObjectif: {},
        searchText: '',
        // PLAN
        plan: {
            show: false,
            data: {},
            devis: undefined
        },
        config: {
            show: false,
            data: {}
        },
        'financeFiles': [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ]
    },
    getters: {
        prevObjectif(state) {
            if (state.currentObjectif.index == 0) 
                return null;
            else 
                return state.todolist.objectifs[state.currentObjectif.index - 1]
        },
        nextObjectif(state) {
            if (state.currentObjectif.index == state.todolist.objectifs.length) 
                return null;
            else 
                return state.todolist.objectifs[state.currentObjectif.index + 1];
            }
        },
    mutations: {
        setFinanceFiles(state, files) {
            state.financeFiles = files;
        },
        setTaskAddStatus(state, bool) {
            state.isExpend = bool;
        },
        // PLAN
        setPlanShow(state, bool) {
            state.plan.show = bool;
        },
        setChiffrage(state, data) {
            state.plan.devis = data;
        },
        setPlanData(state, data) {
            state.plan.data = data;
        },
        setConfigShow(state, bool) {
            state.config.show = bool;
        },
        setConfigData(state, data) {
            state.config.data = data;
        },
        // TODOLIST
        toggleTask(state, id) {
            var iTask = state
                .todolist
                .tasks
                .findIndex(function (item) {
                    return item.id == id
                });
            var iObjectif = state
                .todolist
                .objectifs
                .findIndex(function (item) {
                    return item.name == state.todolist.tasks[iTask].objectif
                });
            var iCategory = state
                .todolist
                .categories
                .findIndex(function (item) {
                    return item.name == state.todolist.tasks[iTask].category
                });

            state.todolist.tasks[iTask].done = !state.todolist.tasks[iTask].done;
            state.todolist.objectifs[iObjectif].completeTask += (state.todolist.tasks[iTask].done
                ? 1
                : -1);
            state.todolist.categories[iCategory].completeTask += (state.todolist.tasks[iTask].done
                ? 1
                : -1);

            for (var i = 0; i < state.todolist.objectifs.length; i++) {
                if (state.todolist.objectifs[i].completeTask < state.todolist.objectifs[i].totalTask) {
                    if (state.currentObjectif.index > i) {
                        state.currentObjectif = state.todolist.objectifs[i];
                        state.currentObjectif.index = i;
                        break;
                    }
                }
            }

            state.todolist.nbTasksDone = 0;
            state.todolist.nbTasksFavori = 0;
            state.todolist.nbTasksTotal = state.todolist.tasks.length;
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.todolist.tasks[i].done) 
                    state.todolist.nbTasksDone += 1;
                if (state.todolist.tasks[i].favori) 
                    state.todolist.nbTasksFavori += 1;
                }
            
            state.tasklist = [];
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.filter.objectif == null || state.todolist.tasks[i].objectif == state.filter.objectif) {
                    if (state.filter.category == null || state.todolist.tasks[i].category == state.filter.category) {
                        if (state.filter.state == null || (state.filter.state == 'Réalisées' && state.todolist.tasks[i].done) || (state.filter.state == 'En attente' && !state.todolist.tasks[i].done)) {
                            if (state.filter.favori == null || (state.filter.favori == 'Essentielles' && state.todolist.tasks[i].favori)) {
                                if (state.todolist.tasks[i].name.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].category.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].note.contains(state.searchText)) {
                                    if (state.searchText != '.' && state.searchText != '. ' && state.searchText != ' ') {
                                        state
                                            .tasklist
                                            .push(state.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        toggleFavori(state, id) {
            var iTask = state
                .todolist
                .tasks
                .findIndex(function (item) {
                    return item.id == id
                });

            state.todolist.tasks[iTask].favori = !state.todolist.tasks[iTask].favori;
            state.todolist.nbTasksFavori += (state.todolist.tasks[iTask].favori
                ? 1
                : -1);

            state.tasklist = [];
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.filter.objectif == null || state.todolist.tasks[i].objectif == state.filter.objectif) {
                    if (state.filter.category == null || state.todolist.tasks[i].category == state.filter.category) {
                        if (state.filter.state == null || (state.filter.state == 'Réalisées' && state.todolist.tasks[i].done) || (state.filter.state == 'En attente' && !state.todolist.tasks[i].done)) {
                            if (state.filter.favori == null || (state.filter.favori == 'Essentielles' && state.todolist.tasks[i].favori)) {
                                if (state.todolist.tasks[i].name.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].category.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].note.contains(state.searchText)) {
                                    if (state.searchText != '.' && state.searchText != '. ' && state.searchText != ' ') {
                                        state
                                            .tasklist
                                            .push(state.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        setUser(state, user) {
            state.user = user;
        },
        setUserInfos(state, info) {
            state.user.info = info;
        },
        handleSearch(state, text) {
            state.searchText = text;
            state.tasklist = [];
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                var desc = state
                    .todolist
                    .tasks[i]
                    .desc
                    .replace(/&nbsp;/gi, '')
                if (state.filter.objectif == null || state.todolist.tasks[i].objectif == state.filter.objectif) {
                    if (state.filter.category == null || state.todolist.tasks[i].category == state.filter.category) {
                        if (state.filter.state == null || (state.filter.state == 'Réalisées' && state.todolist.tasks[i].done) || (state.filter.state == 'En attente' && !state.todolist.tasks[i].done)) {
                            if (state.filter.favori == null || (state.filter.favori == 'Essentielles' && state.todolist.tasks[i].favori)) {
                                if (state.todolist.tasks[i].name.contains(text) || desc.contains(text) || state.todolist.tasks[i].category.contains(text) || state.todolist.tasks[i].note.contains(text)) {
                                    if (text != '.' && text != '. ' && text != ' ') {
                                        state
                                            .tasklist
                                            .push(state.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        setBudgets(state, budgets) {
            state.budgets = budgets;
        },
        setBudgetCategory(state, category) {
            state.budgetCategory = category;
        },
        setBudgetSearch(state, input) {
            state.budgetSearch = input;
        },

        setTodolist(state, todolist) {
            state.todolist = todolist;
        },
        setTasklist(state, tasklist) {
            state.tasklist = tasklist;
        },
        setFilter(state, filter) {
            state.filter = filter;
        },
        setCurrentObjectif(state, i) {
            state.currentObjectif = state.todolist.objectifs[i];
            state.currentObjectif.index = i;
            if (state.filter.state != "En attente") 
                state.filter.state = null;
            state.filter.favori = null;
            state.filter.objectif = null;
            state.filter.category = null;

            state.tasklist = [];
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.filter.objectif == null || state.todolist.tasks[i].objectif == state.filter.objectif) {
                    if (state.filter.category == null || state.todolist.tasks[i].category == state.filter.category) {
                        if (state.filter.state == null || (state.filter.state == 'Réalisées' && state.todolist.tasks[i].done) || (state.filter.state == 'En attente' && !state.todolist.tasks[i].done)) {
                            if (state.filter.favori == null || (state.filter.favori == 'Essentielles' && state.todolist.tasks[i].favori)) {
                                if (state.todolist.tasks[i].name.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].category.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].note.contains(state.searchText)) {
                                    if (state.searchText != '.' && state.searchText != '. ' && state.searchText != ' ') {
                                        state
                                            .tasklist
                                            .push(state.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        addTask(state, task) {
            for (var i = state.todolist.tasks.length - 1; i >= 0; i--) {
                if (state.todolist.tasks[i].objectif == task.objectif) {
                    pos = i + 1;
                    break;
                }
            }
            state
                .todolist
                .tasks
                .splice(pos, 0, task);

            var iObjectif = state
                .todolist
                .objectifs
                .findIndex(function (item) {
                    return item.name == task.objectif
                });
            var iCategory = state
                .todolist
                .categories
                .findIndex(function (item) {
                    return item.name == task.category
                });

            state.todolist.objectifs[iObjectif].totalTask += 1;
            state.todolist.categories[iCategory].totalTask += 1;
            state.todolist.objectifs[iObjectif].completeTask += (task.done
                ? 1
                : 0);
            state.todolist.categories[iCategory].completeTask += (task.done
                ? 1
                : 0);

            for (var i = 0; i < state.todolist.objectifs.length; i++) {
                if (state.todolist.objectifs[i].completeTask < state.todolist.objectifs[i].totalTask) {
                    state.currentObjectif = state.todolist.objectifs[i];
                    state.currentObjectif.index = i;
                    break;
                }
            }

            state.todolist.nbTasksDone = 0;
            state.todolist.nbTasksFavori = 0;
            state.todolist.nbTasksTotal = state.todolist.tasks.length;
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.todolist.tasks[i].done) 
                    state.todolist.nbTasksDone += 1;
                if (state.todolist.tasks[i].favori) 
                    state.todolist.nbTasksFavori += 1;
                }
            
            state.tasklist = [];
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.filter.objectif == null || state.todolist.tasks[i].objectif == state.filter.objectif) {
                    if (state.filter.category == null || state.todolist.tasks[i].category == state.filter.category) {
                        if (state.filter.state == null || (state.filter.state == 'Réalisées' && state.todolist.tasks[i].done) || (state.filter.state == 'En attente' && !state.todolist.tasks[i].done)) {
                            if (state.filter.favori == null || (state.filter.favori == 'Essentielles' && state.todolist.tasks[i].favori)) {
                                if (state.todolist.tasks[i].name.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].category.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].note.contains(state.searchText)) {
                                    if (state.searchText != '.' && state.searchText != '. ' && state.searchText != ' ') {
                                        state
                                            .tasklist
                                            .push(state.todolist.tasks[i]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        removeTask(state, id) {
            var iTask = state
                .todolist
                .tasks
                .findIndex(function (item) {
                    return item.id == id
                });
            var iObjectif = state
                .todolist
                .objectifs
                .findIndex(function (item) {
                    return item.name == state.todolist.tasks[iTask].objectif
                });
            var iCategory = state
                .todolist
                .categories
                .findIndex(function (item) {
                    return item.name == state.todolist.tasks[iTask].category
                });

            state.todolist.objectifs[iObjectif].totalTask -= 1;
            state.todolist.categories[iCategory].totalTask -= 1;
            state.todolist.objectifs[iObjectif].completeTask -= (state.todolist.tasks[iTask].done
                ? 1
                : 0);
            state.todolist.categories[iCategory].completeTask -= (state.todolist.tasks[iTask].done
                ? 1
                : 0);
            state
                .todolist
                .tasks
                .splice(iTask, 1);

            for (var i = 0; i < state.todolist.objectifs.length; i++) {
                if (state.todolist.objectifs[i].completeTask < state.todolist.objectifs[i].totalTask) {
                    state.currentObjectif = state.todolist.objectifs[i];
                    state.currentObjectif.index = i;
                    break;
                }
            }

            state.todolist.nbTasksDone = 0;
            state.todolist.nbTasksFavori = 0;
            state.todolist.nbTasksTotal = state.todolist.tasks.length;
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.todolist.tasks[i].done) 
                    state.todolist.nbTasksDone += 1;
                if (state.todolist.tasks[i].favori) 
                    state.todolist.nbTasksFavori += 1;
                }
            
            state.tasklist = [];
            for (var i = 0; i < state.todolist.tasks.length; i++) {
                if (state.filter.objectif == null || state.todolist.tasks[i].objectif == state.filter.objectif) {
                    if (state.filter.category == null || state.todolist.tasks[i].category == state.filter.category) {
                        if (state.filter.state == null || (state.filter.state == 'Réalisées' && state.todolist.tasks[i].done) || (state.filter.state == 'En attente' && !state.todolist.tasks[i].done) || (state.filter.state == 'Essentielles' && state.todolist.tasks[i].favori)) {
                            if (state.todolist.tasks[i].name.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].category.contains(state.searchText) || state.todolist.tasks[i].desc.contains(state.searchText) || state.todolist.tasks[i].note.contains(state.searchText)) {
                                if (state.searchText != '.' && state.searchText != '. ' && state.searchText != ' ') {
                                    state
                                        .tasklist
                                        .push(state.todolist.tasks[i]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})

export default store;
