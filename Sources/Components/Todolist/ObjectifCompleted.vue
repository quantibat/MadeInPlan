<template>
    <el-dialog style="background: rgba(255, 255, 255, .95) !important;" class="objectif-completed" :visible.sync="show" width="40%" :before-close="handleClose" :close-on-click-modal="true" :close-on-press-escape="false" :show-close="false" :append-to-body="true">
       <div class="congrats">
        <div class="img">
            <img src="https://dl.dropboxusercontent.com/s/e1t2hhowjcrs7f5/100daysui_100icon.png">
        </div>
       </div>

        <div class="text">
            Félicitations
        </div>
        <div class="text-secondary">
            Vous avez accompli votre objectif avec succès
        </div>
        <!-- <objectif-progress class="objectif-progress" :tooltips="false"></objectif-progress> -->
        <el-button type="primary" @click="nextObjectif()">Passer à l'objectif suivant</el-button>
    </el-dialog>
</template>

<script>
import ObjectifProgress from './ObjectifProgress.vue';

export default {
    name: 'ObjectifCompleted',
    props: {
        show: {
            type: Boolean,
            required: true
        }
    },
    components: {
        'objectif-progress': ObjectifProgress
    },
    computed: {
        todolist() {
            return this.$store.state.todolist;
        },
        currentObjectif() {
            return this.$store.state.currentObjectif;
        }
    },
    data() {
        return {

        }
    },
    created () {
    },
    methods: {
        handleClose(done) {
            var currentObjectif = {};
            for (var i = 0; i < this.todolist.objectifs.length; i++) {
                if (this.todolist.objectifs[i].completeTask < this.todolist.objectifs[i].totalTask) {
                    this.$store.commit('setCurrentObjectif', i);
                    if (this.$store.state.filter.state == "En attente") this.$scrollTo('#top', 1000, { container: 'body'});
                    break;
                }
            }
            this.$emit('update:show', false);
            done();
        },
        nextObjectif() {
            var currentObjectif = {};
            for (var i = 0; i < this.todolist.objectifs.length; i++) {
                if (this.todolist.objectifs[i].completeTask < this.todolist.objectifs[i].totalTask) {
                    this.$store.commit('setCurrentObjectif', i);
                    if (this.$store.state.filter.state == "En attente") this.$scrollTo('#top', 1000, { container: 'body'});
                    break;
                }
            }
            this.$emit('update:show', false);
        }
    }
}
</script>

<style scoped>


.objectif-completed { text-align: center; }

.objectif-completed img { height: 120px; margin-bottom: 1rem; animation: tada .8s linear;}

.objectif-completed .text { margin: 1.8rem auto 0 auto; color: #212D59; font-weight: 400; font-size: 2rem; }

.objectif-completed .text-secondary {
    margin: 0 auto; color: rgba(33, 45, 89, .5); font-weight: 300; font-size: 1.2rem;
}

.objectif-completed .objectif-progress { margin: 0 auto; width: 40%; }

.objectif-completed .el-button { background-color: #4AC0FD; border: solid 1px #4AC0FD; margin: 30px auto 40px auto; }


</style>
