// src/store/__mocks__/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const getters = {
};

export const mutations = {
    toggleTask: jest.fn()
};

export const actions = {
};

export const state = {
    tasklist: [
        {
            "_id" : "5b2cbec81bf7c95808afe93f",
            "id" : "ac7a758514e87136a17c",
            "name" : "Déterminer mes Besoins/Désirs",
            "desc" : "",
            "objectif" : "Définir mon projet",
            "category" : "Plans",
            "favori" : false,
            "ressources" : [],
            "dateTime" : "",
            "budget" : "",
            "note" : "",
            "checklist" : [],
            "done" : false,
            "_edit" : false
        }, 
        {
            "_id" : "5b2cbec81bf7c95808afe940",
            "id" : "008a6f0df546c59d6cd3",
            "name" : "Déterminer mes Contraintes",
            "desc" : "",
            "objectif" : "Définir mon projet",
            "category" : "Plans",
            "favori" : false,
            "ressources" : [],
            "dateTime" : "",
            "budget" : "",
            "note" : "",
            "checklist" : [],
            "done" : true,
            "_edit" : false
        }, 
        {
            "_id" : "5b2cbec81bf7c95808afe941",
            "id" : "a77e503d7b5f0d885f69",
            "name" : "Réfléchir à mes Plans / Avant projet sommaire",
            "desc" : "",
            "objectif" : "Définir mon projet",
            "category" : "Plans",
            "favori" : false,
            "ressources" : [],
            "dateTime" : "",
            "budget" : "",
            "note" : "",
            "checklist" : [],
            "done" : true,
            "_edit" : false
        },
    ],
    "__v" : 354,
    "lastToggled" : [
    ],
    todolist: {
        "categories" : [ 
            {
                "_id" : "5b2cbebeeb903f5af43a9ab0",
                "name" : "Budget",
                "totalTask" : 11,
                "completeTask" : 11
            }, 
            {
                "_id" : "5b2cbebeeb903f5af43a9ab1",
                "name" : "Crédit",
                "totalTask" : 17,
                "completeTask" : 17
            }, 
            {
                "_id" : "5b2cbebeeb903f5af43a9ab2",
                "name" : "Terrain",
                "totalTask" : 12,
                "completeTask" : 12
            }
        ],
        "objectifs" : [ 
            {
                "_id" : "5b2cbebeeb903f5af43a9ab9",
                "name" : "Définir mon projet",
                "totalTask" : 19,
                "completeTask" : 19
            }, 
            {
                "_id" : "5b2cbebeeb903f5af43a9aba",
                "name" : "Estimer mon budget",
                "totalTask" : 9,
                "completeTask" : 9
            }, 
            {
                "_id" : "5b2cbebeeb903f5af43a9abb",
                "name" : "Obtenir une offre de financement",
                "totalTask" : 15,
                "completeTask" : 15
            }
        ],
    },
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = { getters: {}, mutations: {}, actions: {}, state: {} }) {
    const mockGetters = Object.assign({}, getters, custom.getters);
    const mockMutations = Object.assign({}, mutations, custom.mutations);
    const mockActions = Object.assign({}, actions, custom.actions);
    const mockState = Object.assign({}, state, custom.state);
    
    return {
        getters: mockGetters,
        mutations: mockMutations,
        actions: mockActions,
        state: mockState,
        store: new Vuex.Store({
            getters: mockGetters,
            mutations: mockMutations,
            actions: mockActions,
            state: mockState,
        }),
    };
}

export const store = __createMocks().store;

export const mockRequest = {
    post: (url, id) => {
        return new Promise((resolve, reject) => {
            process.nextTick(() => (id != undefined)? resolve(id) : reject(id));
        });
    }
};