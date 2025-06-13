<template>
    <el-row v-bind:class="'add-task ' + (isExpend ? 'expend' : '')" type="flex" align="middle">
        <el-row class="no-expend" v-if="!isExpend" type="flex" align="middle" @click.native="toogleExpend()">
            <i class="budicon budicon-plus-ui"></i>
            <button>Ajouter une nouvelle tâche</button>
        </el-row>
        <el-row class="expend" v-if="isExpend">
            <el-row class="content">
                <el-col :span="2">
                    <div :class="'switch ' + (newTask.done ? 'true' : 'false' )" @click="newTask.done = !newTask.done">
                        <span></span>
                    </div>
                </el-col>
                <el-col :span="22" class="content-input">
                    <input placeholder="Ajouter une nouvelle tâche" v-model="newTask.name" autofocus></input>
                    <hr :class="error.input ? 'error' : ''">
                    <p v-if="error.input" class="error-input">Pensez à donner un <span style="font-weight: 600;">nom</span> à votre tâche</p>
                    <textarea placeholder="Description" v-model="newTask.desc"></textarea>
                </el-col>
            </el-row>
            <el-row class="footer" type="flex" justify="space-between" align="middle">
                <div style="display: inline-block; text-align: left;">
                    <el-select v-model="newTask.objectif" :class="'select-objectif ' + (error.select == true ? 'error' : '')" placeholder="Objectif">
                        <el-option v-for="(objectif, index) in todolist.objectifs" :key="objectif.name" :label="index + 1 + '. ' + objectif.name" :value="objectif.name"></el-option>
                    </el-select>
                    <el-select v-model="newTask.category" :class="'select-category ' + (error.select == true ? 'error' : '')" placeholder="Catégorie">
                        <el-option v-for="category in todolist.categories" :key="category.name" :label="category.name" :value="category.name"></el-option>
                    </el-select>
                </div>
                <div style="display: inline; text-align: right;">
                    <el-button type="text" @click="handleCancel()">Annuler</el-button>
                    <el-button type="primary" @click="handleAddTask()">Ajouter</el-button>
                </div>
            </el-row>
        </el-row>
        <p v-if="error.select" class="error-select">Pensez à attribuer un <span style="font-weight: 600;">objectif</span> et une <span style="font-weight: 600;">catégorie</span> à votre tâche</p>
    </el-row>
</template>

<script>

export default {
    name: 'AddTask',
    data() {
        return {
            newTask: {
                name: '',
                desc: '',
                category: '',
                objectif: '',
                done: false
            },
            error: {
                input: false,
                select: false
            }
        }
    },
    computed: {
        todolist() {
            return this.$store.state.todolist;
        },
        isExpend() {
            return (this.$store.state.isExpend)
        }
    },
    created() {
    },
    methods: {
        toogleExpend() {
            this.$store.commit('setTaskAddStatus', !this.$store.state.isExpend)
        },
        handleCancel() {
            this.newTask.id = undefined;
            this.newTask.name = '';
            this.newTask.desc = '';
            this.newTask.objectif = '';
            this.newTask.category = '';
            this.newTask.dateTime = '';
            this.newTask.budget = '';
            this.newTask.note = '';
            this.newTask.done = false;

            this.error.input = false;
            this.error.select = false;
            this.$store.commit('setTaskAddStatus', false)
        },
        handleAddTask() {
            if (this.newTask.name == '') {
                this.error.input = true;
            } else this.error.input = false;
            if (this.newTask.category == '' || this.newTask.objectif == '') {
                this.error.select = true;
            } else this.error.select = false;
            if (this.error.input == false && this.error.select == false) {

                this.newTask.favori = false;
                this.newTask.ressources = [];
                this.newTask._edit = true;

                this.$http.post(this.$root.URL + '/todolist/add-task', { task: this.newTask }).then(res => {
                    this.error.input = false;
                    this.error.select = false;

                    this.newTask.id = res.data.id;
                    this.newTask.dateTime = '';
                    this.newTask.budget = '';
                    this.newTask.note = '';
                    this.newTask.checklist = [];

                    this.$store.commit('addTask', Object.assign({}, this.newTask));
                    this.$nextTick(() => {
                        this.$scrollTo('#ex-' + res.data.id, 1000, { container: 'body'});
                    });
                    this.$store.commit('setFilter', {});

                    this.$message({
                        title: 'Création',
                        message: 'Votre tâche a bien été ajoutée',
                        type: 'success',
                        center: true,
                        showClose: false,
                        customClass: 'toogle-checkbox-message-class'
                    });
                    this.handleCancel();
                }, res => {
                    console.log('ERROR addTask Server');
                });
            }
        }
    }
}
</script>

<style>

.add-task { background-color: #FFFFFF; width: 100%; border: solid 1px #E3E4E9; border-radius: 5px; text-align: left; margin-bottom: 20px; max-height: 58px; box-shadow: 0px 0px 0px #CECECE; }
.add-task:hover { box-shadow: 0px 3px 6px #CECECE; }

.add-task.expend { max-height: 300px; z-index: 0; }
.add-task .budicon { font-size: 36px; }
.add-task.expend .budicon { font-size: 45px; }

.add-task .no-expend { padding: 9px 22px; width: 100%; }
.add-task .no-expend:hover { cursor: pointer; box-shadow: 0px 3px 6px #CECECE; }

.add-task .no-expend button { color: #212D59; opacity: 0.32; font-size: 18px; font-weight: 300; margin-left: 20px; border: none; background-color: #FFFFFF; }
.add-task .no-expend button:hover { cursor: text; }
.add-task .no-expend button:focus { outline: transparent; opacity: 1; }

.add-task .no-expend .budicon-plus-ui { color: #4BC0FD; }


.add-task .expend { width: 100%;}
.add-task .expend .content { width: 100%; padding-top: 10px; left: 20px; }

.add-task .expend .content {  }

.add-task .expend .content .switch { position: absolute; width: 42px; height: 42px; text-align: center; margin: 0; background: #2ECC71; -webkit-transition: all 0.2s ease; -moz-transition: all 0.2s ease; -o-transition: all 0.2s ease; -ms-transition: all 0.2s ease; transition: all 0.2s ease; border-radius: 25px; }
.add-task .expend .content .switch span { position: absolute; width: 19px; height: 3px; top: 50%; left: 50%; margin: -2px 0px 0px -7px; background: #FFFFFF; display: block; -webkit-transform: rotate(-45deg); -moz-transform: rotate(-45deg); -o-transform: rotate(-45deg); -ms-transform: rotate(-45deg); transform: rotate(-45deg); -webkit-transition: all 0.2s ease; -moz-transition: all 0.2s ease; -o-transition: all 0.2s ease; -ms-transition: all 0.2s ease; transition: all 0.2s ease; border-radius: 25px; }
.add-task .expend .content .switch span:after { content: ""; display: block; position: absolute; width: 3px; height: 9px; margin: -6px 0px 0px 0px; background: #FFFFFF; -webkit-transition: all 0.2s ease; -moz-transition: all 0.2s ease; -o-transition: all 0.2s ease; -ms-transition: all 0.2s ease; transition: all 0.2s ease; border-radius: 25px; }
.add-task .expend .content .false { width: 38px; height: 38px; background: #FFFFFF; border: solid 2px #E0E0E0; }
.add-task .expend .content .false span { background: #E0E0E0; }
.add-task .expend .content .false span:after { background: #E0E0E0; }
.add-task .expend .content .false:hover { border-color: #2ECC71; }
.add-task .expend .content .false:hover span { background: #2ECC71; }
.add-task .expend .content .false:hover span::after { background: #2ECC71; }

.add-task .expend .content .content-input { margin-left: 46px; }

.add-task .expend .content .content-input input { color: #212D59; font-size: 18px; font-weight: 300; margin-left: 18px; border: none; width: 80%; height: 30px; outline: none; }
.add-task .expend .content .content-input input::placeholder { color: #212D59; opacity: 0.32; }
.add-task .expend .content .content-input input:focus { outline-color: transparent; opacity: 1; }

.add-task .expend .content .content-input hr { opacity: 0.10; width: 90%; position: relative; right: 10px; border: 0; border-bottom: solid 2px #212D59; }
.add-task .expend .content .content-input hr.error { border-color: #F44336; opacity: 1; }

.add-task .expend .content .content-input textarea { color: #212D59; font-size: 15px; font-weight: 300; margin-left: 20px; border: none; resize: none; height: 70px; width: 90%; outline: none; }
.add-task .expend .content .content-input textarea::placeholder { color: #212D59; opacity: 0.32; }
.add-task .expend .content .content-input textarea:focus { outline: none; opacity: 1; }

.add-task .expend .footer  { width: 100%; min-height: 50px; background-color: #F9FAFB; padding: 0px 5px; }

.add-task .expend .footer .el-select { color: #212D59; font-size: 13px; }
.add-task .expend .footer .el-select.select-objectif { width: 260px; }
.add-task .expend .footer .el-select.select-category { width: 210px; }
.add-task .expend .footer .el-select .el-input__inner { border: none; border-right: solid 1px #E3E4E9; background: #F9FAFB; border-radius: 0px; color: #212D59; font-size: 13px; text-align: center; }
.add-task .expend .footer .el-select .el-input__inner::placeholder { color: #212D59; font-size: 13px; }
.add-task .expend .footer .el-select.error .el-input__icon { color: #F44336; }

.error-input { color: #F44336; position: absolute; top: 50px; right: 30px; font-size: 11px; }
.error-select { color: #F44336; position: absolute; bottom: -35px; left: 10px; font-size: 11px; }

.expend-enter-active, .expend-leave-active {
    transition: height 0s ease-out;
}
.expend-enter, .expend-leave-to {
    height: auto;
}

.el-button+.el-button {
    margin-left: 22px !important;
}

.el-select-dropdown__wrap {
    /* max-height: 600px; */
}

.el-select-dropdown {
    position: relative;
}

.el-scrollbar {
    padding-bottom: .8rem;
}

.el-select-dropdown::after {
    content: url('https://image.flaticon.com/icons/svg/16/16895.svg');
    position: absolute;
    width: 12px;
    bottom: -.2rem;
    left: 50%;
    font-size: 1rem;
    font-weight: 300;
    opacity: .2;
    text-align: center;
    /* padding: 4rem; */
}

.base-select {

}


.el-select-dropdown__item {
    color: rgba(33, 45, 89, 0.7);
    border-bottom: 1px solid rgba(33, 45, 89, 0.08);
    height: 43px;
    line-height: 43px;
    font-size: .85rem;
}
.el-select-dropdown__item:last-of-type {
    border: none;
}

</style>
