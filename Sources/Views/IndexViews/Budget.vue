<template>
    <div v-loading="loading" class="main-container">
        <div class="noprint">
            <el-row type="flex"  class="header">
                <el-col :span="16">
                    <h1>Mon budget<el-button class="help" @click="onboardDialog = true">?</el-button> </h1>
                </el-col>
                <!-- <el-col :span="0">
                    <transition name="el-fade-in">
                        <div v-show="isExpended()" class="reduce-button" @click="reduce()"><img src="https://image.flaticon.com/icons/svg/54/54860.svg" style="height: 12px; margin-right: .3rem;"> Tout condenser</div>
                    </transition>
                </el-col> -->
                <el-col :span="4">
                    <el-popover
                        width="250"
                        class="shareButton"
                        trigger="click">
                        <div class="budget-share-container">
                            <div class="social-share">
                                <img title="Partager sur Facebook" @click="facebookShare" class="social-logo" src="../../Assets/facebook-social.svg" />
                                <img title="Partager via Messenger" @click="messengerShare" class="social-logo" src="../../Assets/messenger.svg" />
                            </div>
                            <div>
                                <span class="budget-share-link">Copier le lien directement</span>
                                <div @click="copySharedLink">
                                    <!-- <i class="share-link budicon budicon-anchor-link"/> -->
                                    <el-input
                                        size="small"
                                        class="share-link"
                                        prefix-icon="budicon budicon-clipboard"
                                        :value="this.$root.URL+'/preview/budget/'+this.user._id"
                                        id="copyLinkInput" readonly>
                                    </el-input>
                                </div>
                            </div>
                        </div>
                        <el-button class="budget-share" size="small" slot="reference">
                            <!-- <i class="budget-share-icon el-icon-share"/>  -->
                            <img title="Partager via Messenger" class="budget-share-icon2" src="../../Assets/share-icon.svg" />
                            Partager mon budget
                            </el-button>
                    </el-popover>
                                        <!-- <div class="print hidden-md-and-down" @click="handlePrint()">
                        <span style='text-decoration: none;'>
                            <i class="budicon budicon-print-a"></i> Imprimer
                        </span>
                    </div> -->
                </el-col>
            </el-row>

            <el-dialog style="background: rgba(255, 255, 255, .92)" :visible.sync="onboardDialog" top="6vh" :fullscreen="false" width="85%" :before-close="handleClose">
                <el-carousel arrow="never" v-if="onboardDialog" :interval="90000" indicator-position="outside" trigger="click" height="65vh" :autoplay="false" ref="carousel" @change="handleChangeCarrouselIndex">
                    <el-carousel-item>
                        <header class="avancement">
                            <h1 class="carousel-title">Le détail de toutes vos dépenses</h1>
                            <p class="carousel-desc">Concevez votre prévisionnel de dépenses et suivez les paiements au fur et à mesure.</p>
                        </header>
                        <img class="onboard-img" src="../../Assets/onboard-budget-1.gif">
                    </el-carousel-item>

                    <el-carousel-item>
                        <header class="todolist">
                            <h1 class="carousel-title">Une synthèse claire</h1>
                            <p class="carousel-desc">Contrôlez le respect de votre prévisionnel tout au long de la réalisation de votre projet.</p>
                        </header>
                        <img class="onboard-img" src="../../Assets/onboard-budget-2.gif">
                    </el-carousel-item>

                    <el-carousel-item>
                        <header class="budget">
                            <h1 class="carousel-title">Vos dépenses classées par catégories</h1>
                            <p class="carousel-desc">Vos dépenses sont organisées, et la compréhension est simplifiée.</p>
                        </header>
                        <img class="onboard-img" src="../../Assets/onboard-budget-3.gif">
                    </el-carousel-item>
                </el-carousel>
                <el-row type="flex" style="align-content: center; align-items: center; width: 260px; margin: auto;">
                    <el-button @click="$refs.carousel.prev()" style="flex: 0 1 100%; width: 130px;"><i class="budicon budicon-arrow-left"></i> Précédent</el-button>
                    <el-button v-if="carrouselIndex < 2" @click="$refs.carousel.next()" style="flex: 0 1 100%; width: 130px;" type="primary">Suivant <i class="budicon budicon-arrow-right"></i></el-button>
                    <el-button v-else @click="onboardDialog = false" style="flex: 0 1 100%; width: 130px;" type="primary">J’ai compris</el-button>
                </el-row>
            </el-dialog>

            <el-row v-if="!loading" :gutter="42">
                <el-col :md="6" :lg="5" :xl="5" :span="5" class="hidden-sm-and-down">
                    <div class="search">
                        <i class="budicon budicon-search" :style="{ color: isFocus ? '#48BEFE' : '#C8CBD6' }" @click="handleSearch()"></i>
                        <input type="text" v-model="searchInput" placeholder="Rechercher">
                        <i v-if="searchInput != ''" class="budicon budicon-cross-ui" @click="searchInput = ''"></i>
                    </div>

                    <div v-if="selectedCategory">
                        <span @click="closeFilter()" class="reset">Réinitialiser</span>
                        <h5 class="menu-title">Filtres</h5>
                        <el-tag type="info" closable @close="closeFilter()">{{selectedCategory}}</el-tag>
                    </div>

                    <h5 class="menu-title">Catégories</h5>
                    <div class="el-menu-vertical">
                        <span v-for="category in categories"  class="menu-item" v-bind:class="{ 'selected': selectedCategory == category.name}" index="1" @click="setCategory(category.name)">
                            <div class="category">{{category.name}}</div>
                        </span>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="18" :lg="14 " :xl="14">
                    <table class="depense-table toggle-off"></table>
                    <div v-if="this.budgets().length == 0" class="no-result">
                        <el-row>
                            <img src="/Assets/search-no-results.svg">
                            <p class="title">Oups ...</p>
                            <p class="text">Aucun résultat pour votre recherche</p>
                        </el-row>
                    </div>
                    <table v-for="(budget, iterator) in this.budgets()" class="depense-table toggle-off">
                        <thead v-if="!budget.expended" @click="budget.expended = !budget.expended">
                            <tr>
                                <th v-bind:class="'depense-table-category ' + getBudgetClass(budget.name)" v-html="$options.filters.highlight(budget.name, searchInput)"></th>

                                <th>
                                    <div class="depense-table-amount">{{getTotalMoney('estimateValue', budget).formatMoney(0)}} €</div>
                                    <div class="depense-table-type">Estimé</div>
                                </th>
                                <th>
                                    <div class="depense-table-amount">{{getTotalMoney('paid', budget).formatMoney(0)}} €</div>
                                    <div class="depense-table-type">Payé</div>
                                </th>
                                <th>
                                    <div class="depense-table-amount">{{getTotalMoney('waiting', budget).formatMoney(0)}} €</div>
                                    <div class="depense-table-type">En attente</div>
                                </th>
                                <th>
                                    </th>
                                <th class="depense-table-toggle"><i class="el-icon-arrow-right"></i></th>
                            </tr>
                        </thead>
                        <thead v-if="budget.expended" @click="budget.expended = !budget.expended">
                            <tr>
                                <th v-bind:class="'depense-table-category ' + getBudgetClass(budget.name)" v-html="$options.filters.highlight(budget.name, searchInput)"></th>
                                <th>
                                    <div class="depense-table-amount">{{getTotalMoney('estimateValue', budget).formatMoney(0)}} €</div>
                                </th>
                                <th>
                                    <div class="depense-table-amount">{{getTotalMoney('paid', budget).formatMoney(0)}} €</div>
                                </th>
                                <th>
                                    <div class="depense-table-amount">{{getTotalMoney('waiting', budget).formatMoney(0)}} €</div>
                                </th>
                                <th/>
                                <th class="depense-table-toggle"><i class="el-icon-arrow-down"></i></th>
                            </tr>
                        </thead>

                        <tbody v-if="budget.expended">

                            <tr>
                                <th style="text-align: left; padding-left: 1.2rem; color: #00BBFF; cursor: pointer;" @click="pushItem(budget._id)"><i class="el-icon-plus"></i> Nouvelle dépense</th>
                                <th>Estimé</th>
                                <th>Payé</th>
                                <th>En attente</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </tbody>

                            <draggable v-if="budget.expended" v-model="budget.items" element="tbody" @end="changeIndex($event, budget)" :options="{ chosenClass: 'chosen-expense',delay: (isMobile())?150:50, filter: 'input',  touchStartThreshold: 3 }">
                                <tr class="depense-table-row" v-for="(item, index) in budget.items">
                                    <!-- <td style="width: 2px !important; padding: 0; margin: 0; position: absolute;">
                                    </td> -->
                                    <td class="depense-table-label noufel">
                                        <div style="cursor: text" v-if="item._editable == false" v-bind:ref="'contenteditable' + index + iterator" v-bind:id="'contenteditable' + index + iterator"
                                        class="table-input" v-html="$options.filters.highlight(item.name, searchInput)"></div>
                                        <div style="cursor: text" v-else onclick="document.execCommand('selectAll',false,null)" v-on:keyup.enter="handleEnter(index, iterator)"
                                        v-bind:ref="'contenteditable' + index + iterator" contenteditable v-bind:id="'contenteditable' + index + iterator"
                                        class="table-input" v-html="$options.filters.highlight(item.name, searchInput)" @blur="editKeyValue('items', items, index, iterator)"></div>
                                    </td>
                                    <td class="depense-table-detail-amount"><vue-numeric separator="space" onkeydown="javascript: return event.keyCode == 69 ? false : true" onClick="this.select();" step="0.01" @change="getWaiting(item)" @blur="item.estimateValue = (Math.round(item.estimateValue * 100) / 100);getWaiting(item);  editKeyValue('items', items)" class="table-input" v-model="item.estimateValue"/>€</td>
                                    <td class="depense-table-detail-amount"><vue-numeric separator="space" onkeydown="javascript: return event.keyCode == 69 ? false : true" onClick="this.select();" step="0.01" @change="getWaiting(item)" @blur="item.paid = (Math.round(item.paid * 100) / 100); getWaiting(item);  editKeyValue('items', items)" class="table-input" v-model="item.paid"/>€</td>
                                    <td class="depense-table-detail-amount">{{showWaiting(item).formatMoney(0)}} €</td>

                                    <td style="position: relative; right: 1rem;">
                                        <div class="depense-table-delete" style="float: right;">
                                        <el-popover v-if="item._deletable == true" placement="top" trigger="click" v-model="item._showDel">
                                            <el-row type="flex" justify="center">
                                                <span class="remove-title">Êtes-vous sûr ?</span>
                                            </el-row>
                                            <el-row type="flex" justify="center">
                                                <el-button type="secondary" size="mini" class="remove-cancel" @click="dismissItem(item)">Annuler</el-button>
                                                <el-button type="danger" size="mini" class="remove-validate" @click="deleteItem(item)">Supprimer</el-button>
                                            </el-row>
                                            <!-- <i slot="reference" @click="openPopOver(item)" class="el-icon-delete"></i>   -->
                                            <i slot="reference" @click="openPopOver(item)" class="budicon budicon-trash"></i>
                                        </el-popover>
                                            <i slot="reference" v-else style="visibility:hidden;" class="budicon budicon-trash"></i>
                                        </div>

                                        <div v-if="!item.note" class="depense-table-note" style="float: right">
                                            <el-popover
                                            placement="top"
                                            style=""
                                            width="400"
                                            trigger="click">
                                                <el-input
                                                autofocus
                                                class="depense-table-note--textarea"
                                                type="textarea"
                                                :autosize="{ minRows: 6, maxRows: 20 }"
                                                placeholder="Saisissez votre note"
                                                v-model="item.note"
                                                @blur="editKeyValue('items', items)">
                                                </el-input>
                                                <i v-if="item.note" style="font-weight: 700;" slot="reference" class="budicon budicon-note-tick"></i>
                                                <i v-else slot="reference" class="budicon budicon-note-tick"></i>
                                            </el-popover>
                                        </div>
                                        <div v-else class="depense-table-note-written" style="float: right">
                                            <el-popover
                                            placement="top"
                                            width="400"
                                            trigger="click">
                                                <el-input
                                                class="depense-table-note--textarea"
                                                type="textarea"
                                                :autosize="{ minRows: 2, maxRows: 4}"
                                                placeholder="Saisissez votre note"
                                                v-model="item.note"
                                                @blur="editKeyValue('items', items)">
                                                </el-input>
                                                <i slot="reference" style="font-size:17px" class="budicon budicon-note-tick"></i>
                                            </el-popover>
                                        </div>
                                    </td>
                                    <td class="">
                                    </td>
                                </tr>
                            </draggable>

                    </table>
                </el-col>


                <el-col class="hidden-md-and-down" :md="5" :lg="5" :xl="5" :span="5">
                    <aside class="summary">
                        <h4>Total</h4>

                        <div class="summary-item">
                            <div class="summary-detail">
                                <div class="summary-amount">{{ getTotal() }}€</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-icon">
                                <img src="/Assets/Budget/icone-emprunt.svg">
                            </div>
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <vue-numeric separator="space" style="backgroundColor: rgba(33, 45, 89, 0); width: 60%" onkeydown="javascript: return event.keyCode == 69 ? false : true" onClick="this.select();" step="0.01" class="table-input" v-model="fullBudget.loan" @blur="fullBudget.loan = (Math.round(fullBudget.loan * 100) / 100); editKeyValue('loan', fullBudget.loan)" />€
                                </div>
                                <div class="summary-name">Emprunt</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-icon">
                                <img src="/Assets/Budget/icone-apport.svg">
                            </div>
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <vue-numeric separator="space"  style="backgroundColor: rgba(33, 45, 89, 0); width: 60%" onkeydown="javascript: return event.keyCode == 69 ? false : true" onClick="this.select();" step="0.01" class="table-input" v-model="fullBudget.inflow" @blur="fullBudget.inflow = (Math.round(fullBudget.inflow * 100) / 100); editKeyValue('inflow', fullBudget.inflow)" />€
                                </div>
                                <div class="summary-name">Apport</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-icon">
                                <img src="/Assets/Budget/icone-estime.svg">
                            </div>
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <span style="float:left;width: 78px">{{getAbsoluteTotalMoney('estimateValue').formatMoney(0)}}</span> <span style="float: right">€</span>
                                </div>
                                <div class="summary-name">Estimé</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-icon">
                                <img src="/Assets/Budget/icone-paye.svg">
                            </div>
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <span style="float:left;width: 78px">{{getAbsoluteTotalMoney('paid').formatMoney(0)}}</span> <span style="float: right">€</span>
                                </div>
                                <div class="summary-name">Payé</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-icon">
                                <img src="/Assets/Budget/icone-attente.svg">
                            </div>
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <span style="float:left;width: 78px">{{getAbsoluteTotalMoney('waiting').formatMoney(0)}}</span> <span style="float: right">€</span>
                                </div>
                                <div class="summary-name">En attente</div>
                            </div>
                        </div>
                    </aside>
                </el-col>
                <div class="hidden-lg-and-up responsive-summary-container">
                    <div class="responsive-summary">
                         <div class="summary-item">
                            <h4>Total</h4>

                            <div class="summary-detail">
                                <div class="summary-amount">{{ getTotal() }}€</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <vue-numeric separator="space" style="backgroundColor: rgba(33, 45, 89, 0); width: 60%; padding-left: 0px; margin-bottom: 0px; padding-bottom: 0px;" onkeydown="javascript: return event.keyCode == 69 ? false : true" onClick="this.select();" step="0.01" class="table-input" v-model="fullBudget.loan" @blur="fullBudget.loan = (Math.round(fullBudget.loan * 100) / 100); editKeyValue('loan', fullBudget.loan)" />€
                                </div>
                                <div class="summary-name">Emprunt</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <vue-numeric separator="space"  style="backgroundColor: rgba(33, 45, 89, 0); width: 60%; padding-left: 0px; margin-bottom: 0px; padding-bottom: 0px;" onkeydown="javascript: return event.keyCode == 69 ? false : true" onClick="this.select();" step="0.01" class="table-input" v-model="fullBudget.inflow" @blur="fullBudget.inflow = (Math.round(fullBudget.inflow * 100) / 100); editKeyValue('inflow', fullBudget.inflow)" />€
                                </div>
                                <div class="summary-name">Apport</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <span>{{getAbsoluteTotalMoney('estimateValue').formatMoney(0)}} €</span>
                                </div>
                                <div class="summary-name">Estimé</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <span>{{getAbsoluteTotalMoney('paid').formatMoney(0)}} €</span>
                                </div>
                                <div class="summary-name">Payé</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    <span>{{getAbsoluteTotalMoney('waiting').formatMoney(0)}} €</span>
                                </div>
                                <div class="summary-name">En attente</div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-row>
        </div>
        <print-budget/>
    </div>
</template>

<script>
import accentFolding from 'accent-folding';
import PrintBudget from '../../Components/PrintBudget.vue';
import draggable from 'vuedraggable'

export default {
    name: 'Budget',
    components: {
        draggable,
        'print-budget': PrintBudget
    },
    data() {
        return {
            loading: true,
            isToggle: false,
            carrouselIndex: 0,
            searchInput: '',
            fullBudget: {
                loan    : '',
                inflow  : '',
            },
            onboardDialog: false,
            showPrintDialog: false
        }
    },
    computed: {
        items() {
            return (this.$store.state.budgets.items)
        },
        selectedCategory() {
            return this.$store.state.budgetCategory;
        },
        budgetSearch() {
            return this.$store.state.budgetSearch;
        },
        categories() {
            return this.$store.state.budgets.categories;
        },
        user() {
            return this.$store.state.user;
        }
    },
    created() {
        this.$http.get(this.$root.URL + '/budget/get').then(res => {
            var budgets = res.data;
            this.fullBudget.loan = res.data.loan;
            this.fullBudget.inflow = res.data.inflow;
            budgets.items.forEach(e => { e._showDel = false; });
            budgets.categories.forEach(e => { e.expended = false; });
            this.$store.commit('setBudgets', budgets);
            this.loading = false;
        }).catch(error => console.log(error));
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
    filters: {
        highlight: function (words, query) {
            if (!this.searchInput) this.searchInput = '';
            if (!words || query == '.' || query == '. ' || query == ' ') return '';
            if (query.length > 0) {
                return accentFolding(words, query, 'mark');
            } else {
                return words;
            }
        }
    },
    methods: {
        isMobile() {
            var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

            return x <= 1024;
        },
        changeIndex(e, budget) {
            const category = budget.items[0].category;
            var items = this.$store.state.budgets.items.filter(item => {
                if (item.category == category) return true;
                return false;
            })
            var index = this.$store.state.budgets.items.findIndex(item => {
                if (item._id == items[e.oldIndex]._id) return true;
                return false;
            })
            if (index == -1) return;
            var newIndex = this.$store.state.budgets.items.findIndex(item => {
                if (item._id == items[e.newIndex]._id) return true;
                return false;
            })
            var item = this.$store.state.budgets.items.splice(index, 1)[0];
            this.$store.state.budgets.items.splice(newIndex, 0, item);
            this.editKeyValue('items', this.$store.state.budgets.items)
        },
        editKeyValue(key, value, id, iterator) {
            if (id !== undefined) {
                var $modifiedContent = this.$el.querySelector('#contenteditable' + id + iterator);
                if ($modifiedContent && this.$store.state.budgets.categories[iterator].items.length > 0) this.$store.state.budgets.categories[iterator].items[id].name = $modifiedContent.textContent.replace('\n', '');
            }
            this.$http.post('/budget/edit-key-value', {key: key, value: value}).then((res) => {
                this.$store.state.budgets.items = res.data.items;
            })
        },
        handleChangeCarrouselIndex(newIndex, oldIndex) {
            this.carrouselIndex = newIndex;
        },
        getAbsoluteTotalMoney(key) {
            var items = this.$store.state.budgets.items;
            if (!items) return;
            var total = items.reduce((accumulator, item) => {
                if (!item[key]) return parseInt(accumulator);
                return parseInt(accumulator) + parseInt(item[key])
            }, 0);
            return (total)
        },
        getTotalMoney(key, budget) {
            var total = budget.items.reduce((accumulator, item) => {
                if (!item[key]) return parseInt(accumulator);
                return parseInt(accumulator) + parseInt(item[key])
            }, 0);
            return (total);
        },
        showWaiting(item) {
            if ((item.estimateValue - item.paid) < 0) return (0)
            return (item.estimateValue - item.paid);
        },
        getWaiting(item) {
            item.waiting = item.estimateValue - item.paid;
            if (item.waiting < 0) item.waiting = 0;
            return (item.waiting)
        },
        getBudgetClass(name) {
            var parsedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
            return (parsedName)
        },
        getTotal() {
            var loan =  Math.round(this.fullBudget.loan);
            var inflow = Math.round(this.fullBudget.inflow)
            return ((loan + inflow).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
        },
        openPopOver(item) {
            item._showDel = true;
        },
        dismissItem(item) {
            item._showDel = false;
        },
        deleteItem(itemToDelete) {
            if (!itemToDelete._id) return this.$message.error('Impossible de supprimer la dépense.');
            var index = this.$store.state.budgets.items.findIndex(item => {
                if (item._id == itemToDelete._id) return (true);
                return (false);
            });
            if (index != -1) this.$store.state.budgets.items.splice(index, 1);
            itemToDelete._showDel = false
            this.editKeyValue("items", this.$store.state.budgets.items)
                this.$message({
                    title: 'Suppression',
                    message: 'Cette dépense a bien été supprimée',
                    type: 'success',
                    center: true,
                    duration: 5000
                });        },
        handleEnter(id, iterator) {
            var $modifiedContent = this.$el.querySelector('#contenteditable' + id + iterator);
            $modifiedContent.blur();
            $modifiedContent.textContent = $modifiedContent.textContent.replace('\n', '');
            this.$store.state.budgets[iterator].items[id].name = $modifiedContent.textContent.replace('\n', '');
        },
        pushItem(id) {
            var index = this.$store.state.budgets.categories.findIndex(category => {
                if (category._id == id) return (true);
                return (false);
            })
            if (index == -1) return;
            this.$store.state.budgets.items.unshift({estimateValue: 0, paid: 0, waiting: 0, name: 'Nom de la dépense', category: this.$store.state.budgets.categories[index].name, _deletable: true, _editable: true});
            this.editKeyValue("items", this.$store.state.budgets.items)
        },
        getBudget(name) {
            var found = this.$store.state.budgets.find(budget => {
                if (budget.name == name) return true;
                return false;
            })
            if (!found) return 0;
            if (found.items) {
                var result = found.items.reduce((accumulator, item) => {
                    return accumulator + item.estimateValue;
                }, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                return result;
            }
        },
        closeFilter() {
            this.$store.commit('setBudgetCategory', undefined)
            this.categories.forEach(e => {
                e.expended = false;
            });
        },
        expand() {
            this.categories.forEach(e => {
                e.expended = true;
            });
        },
        reduce() {
            this.categories.forEach(e => {
                e.expended = false;
            });
        },
        budgets() {
            if (!this.$store.state.budgets) return undefined;
            this.categories.forEach(category => {
                category.items = this.$store.state.budgets.items.filter(item => {
                    if (item.category == category.name) return true;
                });
            });
            var budgets = this.$store.state.budgets.categories;

            if (this.$store.state.budgetCategory != undefined || this.searchInput != "") {
                return this.$store.state.budgets.categories.filter(budget => {
                    if (this.searchInput != "" && (budget.name == this.$store.state.budgetCategory || this.$store.state.budgetCategory == undefined) && (budget.name.contains(this.searchInput) || budget.items.find(e => e.name.contains(this.searchInput)) != undefined)) {
                        budget.expended = true;
                        return true
                    }
                    if (this.searchInput == "" && (budget.name == this.$store.state.budgetCategory || this.$store.state.budgetCategory == undefined)) {
                        budget.expended = true;
                        return true;
                    }
                    budget.expended = false;
                    return false;
                });
            }
            return this.$store.state.budgets.categories
        },
        isExpended() {
            var isExpended = false;
            if (!this.$store.state.budgets || !this.$store.state.budgets.categories) return false;
            this.$store.state.budgets.categories.forEach(category => {
                if (category.expended) isExpended = true;
            })
            return (isExpended)
        },
        handleSearch() {
            this.$store.commit('setBudgetSearch', this.searchInput)
        },
        setCategory(category) {
            if (this.$store.state.budgetCategory == category) {
                this.closeFilter()
            }
            else this.$store.commit('setBudgetCategory', category)
        },
        // saveItem(id, iterator) {
        //     this.$http.post(this.$root.URL + '/budget/save', {budgets: this.$store.state.budgets, loan: this.fullBudget.loan, inflow: this.fullBudget.inflow}).then(res => {
        //     })
        // },
        toggleDepense() {
            this.isToggle = !this.isToggle
        },
        handlePrint() {
            window.print()
        },
        facebookShare() {
            const uri = `https://www.facebook.com/sharer.php?u=${this.$root.URL}/preview/budget/${this.user._id}`;
            window.open(encodeURI(uri),'_blank','width=500,height=400');
            // FB.ui({
            // method: 'share',
            // href: this.$root.URL + '/preview/budget/'+this.user._id,
            // }, function(response){});
        },
        messengerShare() {
            FB.ui({
            method: 'send',
            link: this.$root.URL + '/preview/budget/'+this.user._id,
            }, function(response){});
        },
        copySharedLink() {
             var copyText = document.getElementById("copyLinkInput");

            /* Select the text field */
            copyText.select();

            /* Copy the text inside the text field */
            document.execCommand("copy");
            this.$message({message: 'Lien copié', type: 'success'});
        }
    }
}
</script>

<style scoped>

    @media print {
        .noprint {display: none;}
    }

    .search { width: 100%; border: solid 1px #E3E4E9; border-radius: 5px; align-items: center; display: flex; font-size: 15px; box-shadow: 0px 0px 0px #CECECE; transition: box-shadow 0.1s; }
    .search:hover { box-shadow: 0px 3px 6px #CECECE; }

    .search .budicon:hover { cursor: pointer; }
    .search .budicon-search { font-size: 20px; padding: 14px 10px 14px 14px; }
    .search .budicon-cross-ui { font-size: 25px; color: #DFE1E7; position: relative; right: 16px; }
    .search .budicon-cross-ui:hover { color: #FF5252; }

    .search input { border: none; outline: none; font-size: 15px; color: #212D59; flex-grow: 1; height: 40px; width: 100%; }
    .search input::placeholder { font-size: 15px; color: #C8CBD6; }

    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
    }

    .reduce-button {
        cursor: pointer;
        font-size: 14px;
        /* margin-left: 35px */
        color: #212D59;
        position: relative;
        top: 44px;
    }
    .menu-title {
        text-transform: uppercase;
        color: #212D59;
        letter-spacing: 1px;
        margin-top: 30px;
        margin-bottom: 4px;
    }

    .el-menu-vertical {
        margin-left: 10px;
        border-right: none;
    }

    .shareButton {
        margin-top: 2.3rem;
        display: block;
    }

    .social-share {
        display: flex;
        /* justify-content: center; */
    }

    .social-logo {
        height: 1.5rem;
        margin-right: .8rem;
        cursor: pointer;
    }

    .social-logo:hover {
        opacity: .9;
    }

    .share-link {
        width: 100%;
        cursor: copy;
        font-size: .7rem;
    }

    .el-menu-item {
        display: flex;
        padding-left: 0 !important;
        color: #212D59;
        /* border-bottom: 1px solid rgba(33, 45, 89, .05); */
        font-size: 0.9rem;
        height: 42px;
        line-height: 42px;
    }

    .el-menu-item:hover {
        font-weight: 500;
    }

    .el-menu-item.is-active {
        /* border-left: 3px solid #00BBFF; */
        /* padding-left: 12px !important; */
        background: none;
        font-weight: 600;
    }

    .el-menu-item .price {
        font-size: .9em;
        color: rgba(33, 45, 89, .5);
        margin-left: auto;
    }

    .el-menu-item .price i {
        font-size: .9rem;
    }

    .el-menu-item:hover {
        background: none;
    }

    .summary {
        display: flex;
        flex-direction: column;
        background: rgba(33, 45, 89, .015);
        border: 1px solid rgba(33, 45, 89, .08);
        border-radius: 6px;
        padding-bottom: 10px;
    }

    .summary h4 {
        text-align: center;
        color:  rgba(33, 45, 89, .5);
        font-weight: 300;
        text-transform: uppercase;
        font-size: 1.2rem;
        margin-bottom: -5px;
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
        font-weight: 300;
        font-size: .9em;
    }
    .summary-amount {
        width: auto;
        color:rgba(33, 45, 89, 1);
        font-weight: 400;
    }

    .el-table {
        box-shadow: 0 2px 5px 3px rgba(0, 0, 0, .025);
        border-radius: 6px;
    }

    .depense-title {
        margin: 0 0 8px;
        font-weight: 600;
        font-size: 1.5rem;
        color:  rgba(33, 45, 89, 1);
    }

    .depense {
        margin-bottom: 32px;
    }

    .depense a {
        text-decoration: none;
        color:rgba(33, 45, 89, 1);
    }

    .depense-head {
    }
    .depense-toggle {
        margin-left: auto;
        font-size: 1.5rem;
    }

    .depense-table {
        width: 100%;
        margin-bottom: 16px;
        text-align: left;
        color:rgba(33, 45, 89, 1);
        border: 1px solid rgba(33, 45, 89, .06);
        border-collapse: collapse;
        table-layout: fixed;
    }

    .depense-table:first-child {
        margin-bottom: 0;
    }

    .depense-table thead {
        box-shadow: 0 3px 6px rgba(0, 0, 0, .04);
        cursor: pointer;
    }

    .depense-table thead:hover {
        box-shadow: 0 6px 6px rgba(0, 0, 0, .06);
    }

    .depense-table .terrain {
        border-color: #cf815f;
        color:rgba(33, 45, 89, 1) !important;
    }
    .depense-table .credit {
        border-color: #d980fa;
        color:rgba(33, 45, 89, 1) !important;
    }
    .depense-table .assurances {
        border-color: #FF5252;
        /* color: #ff5252; */
    }



    .depense-table .terrain {border-color: #CF815F !important;}
    .depense-table .credit {border-color: #D980FA !important;}
    .depense-table .assurances {border-color: #FF5252 !important;}
    .depense-table .taxes {border-color: #00258F !important;}
    .depense-table .urbanisme {border-color: #00D390 !important;}
    .depense-table .construction {border-color: #FEA47F !important;}
    .depense-table .travaux-reserves {border-color: #FEDC57 !important;}
    .depense-table .economie-denergie {border-color: #B2DA93 !important;}
    .depense-table .interieur {border-color: #7F8FFF !important;}
    .depense-table .exterieur {border-color: #7F8FC6 !important;}
    .depense-table .divers {border-color: rgba(33, 45, 89, 0.393) !important;}

    .depense-table tbody {
        /* background: rgba(33, 45, 89, .025); */
        border-top: 1px solid rgba(33, 45, 89, .03);
        /* border-bottom: 1px solid rgba(33, 45, 89, .08); */
    }

    .depense-table tbody tr {
        border-bottom: 1px solid rgba(33, 45, 89, .07);
    }
    .depense-table tbody tr:last-of-type {
        border-bottom: none;
    }

    .depense-table tbody th{
        color: rgba(33, 45, 89, .5);
        font-weight: 400;
        font-size: .9em;
        background: rgba(33, 45, 89, .02);
        /* padding-top: 1.3em; */
        padding-bottom: 0;
        /* border-bottom: 2px solid  rgba(33, 45, 89, .5);; */
    }

    .depense-table th {
        padding: .6rem 0 .4em;
        height: 3rem;
    }

    .depense-table td {
        padding: 1.5rem 0 1.2rem;
        font-size: .9em;
    }

    .depense-table-label, .depense-table-category, .depense-table-toggle {
        padding-left: 1.4rem !important;
        padding-right: 1.4rem !important;
    }

    .depense-table-label {
        padding-left: 1.8rem !important;
    }

    .depense-table-category {
        font-size: 1.2rem;
        font-weight: 500;
        width: 20vw;
        line-height: 1.35;
        border-left: 2px solid #31BDFC;
    }


    .depense-table-amount {
        font-size: 1rem;
        font-weight: 600;
        /* padding-right: 2rem; */
        /* width: 120%; */
    }

    .depense-table-type {
        font-weight: 300;
        font-size: .8rem;
        opacity: .5;
        /* width: 120%; */
    }

    .depense-table-toggle {
        text-align: right;
        color: #31BDFC;
        font-weight: 300;
        font-size: 1.2rem;
        width: 0%;
        position: relative;
        right: 4rem;
    }

    .depense-new {
        border-bottom: 1px solid rgba(33, 45, 89, .03);
        color: #00BBFF;
        text-align: center;
        cursor: pointer;
        /* background: rgba(33, 45, 89, .02); */
        /* box-shadow: 0px 0px 8px 6px rgba(0, 0, 0, .05); */
    }

    .depense-new td {
        padding-left: 1rem;
    }

    .depense-new:hover {
        background: rgba(33, 45, 89, .02);
    }

    .depense-new i {
        font-size: 1.3rem;
        vertical-align: middle;
    }

    .depense-table-note {
        text-align: right;
        color: rgba(33, 45, 89, .4);
        cursor: pointer;
        position: relative;
        /* right: 3rem; */
        z-index: 1;
    }

    .depense-table-note--textarea .el-textarea__inner {
        border: none;
        height: 500px;
        padding: 1rem !important;
    }

    .depense-table-note textarea {
        height: 500px;
        padding: 9rem;
    }
    .depense-table-note .disabled {
        text-align: right;
        color:  rgba(33, 45, 89, .4);
    }

    .depense-table-note i:hover {
        color: #ffce00;
    }

    .depense-table tr .depense-table-note i {
        font-size: 0;
    }
    .depense-table tr:hover .depense-table-note i,  .depense-table-note i.is-active{
        font-size: 1.2em;
    }

    .depense-table-note-written {
        text-align: right;
        color: rgba(33, 45, 89, .4);
        cursor: pointer;
        position: relative;
        /* right: 3rem; */
        z-index: 1;
    }

    .depense-table-note-written--textarea .el-textarea__inner {
        border: none;
        padding: 1rem !important;
    }

    .depense-table-note-written  textarea {
        padding: 9rem;
    }
    .depense-table-note-written  .disabled {
        text-align: right;
        color:  rgba(33, 45, 89, .4);
    }

    .depense-table-note-written  i:hover {

        color: #ffce00;
    }

    .depense-table-note i .depense-table-note i.is-active {
        font-size: 19px;
    }

    .depense-table-delete {
        text-align: right;
        color: rgba(33, 45, 89, .4);
        position: relative;
        /* right: 1rem; */
        /* z-index: -1; */
        /* margin-left: -3rem; */
    }

    .depense-table-delete .disabled {
        text-align: right;
        color:  rgba(33, 45, 89, .4);
    }

    .depense-table-delete i:hover,  .depense-table-delete i:focus, .depense-table-delete i:active{
        font-size: 1.2em;
        color: red !important;
        outline: none;
        border: none;
    }

    .depense-table-note-written i:hover,  .depense-table-note-written i:focus, .depense-table-note-written i:active {
        outline: none;
        border: none;
        font-size: 1.2em;
        color: #ffce00 !important;
    }

    .depense-table-delete i {
        padding: 0 .8em;
        cursor: pointer;
    }

    .depense-table tr .depense-table-delete i {
        color: white;
        font-size: 1.2em;
    }
    .depense-table tr:hover .depense-table-delete i {
        font-size: 1.2em;
        color: #BBBBBB;
    }


    .depense-table tbody th,
    .depense-table-detail-amount,
    .depense-table-amount,
    .depense-table-type,
    .depense-table input
    {
        text-align: right;
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

    table .table-input {
        font-weight: 400;
        background: transparent;
    }


    .table-contenteditable {
        border: none;
        border-bottom-style: hidden;
        padding-bottom: 0px;
        width: 80%;
    }

    .table-contenteditable:active, .table-contenteditable:focus {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        /* padding-bottom: 1px; */
        border-bottom: 1px solid rgba(33, 45, 89, .1);
        width: 80%;
    }
    .table-contenteditable:hover {
        border-top: none;
        border-right: none;
        border-left: none;
        outline: none;
        /* padding-bottom: 5px;    */
        border-collapse: separate;
        border-spacing: 1px 1px 1px 1px;
        border-width: 80%;
        border-bottom: 1px solid rgba(33, 45, 89, .1);;
        width: 80%;
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

    .depense-table-label .table-input {
        width: 105% !important;
    }

    .el-icon-check {
        position: absolute;
        top: 25%;
    }

    .el-tag--info { background-color: #FFFFFF; margin-top: 4px; margin-right: 2px; }

    .menu-item {
        display: flex;
        padding-left: 0 !important;
        color: #212D59;
        /* border-bottom: 1px solid rgba(33, 45, 89, .05); */
        font-size: 0.9rem;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
        font-size: .9rem;
    }

    .menu-item:hover {
        font-weight: 500;
    }

    .menu-item.selected {
        font-size: 0.97rem;
        font-weight:700;
    }

    .no-result { color: #212D59; text-align: center; margin-top: 15%; }
    .no-result img { height: 122px; width: 122px; }
    .no-result .title { font-weight: 600; font-size: 28px; margin-bottom: 0; }
    .no-result .text { font-weight: 500; font-size: 18px; margin-top: 0; opacity: 0.7; }

    .reset { font-size: 12px; color: #4BC0FD; float: right; position: relative; top: 5px; }
    .reset:hover { cursor: pointer; }


    .remove-title {
        margin-bottom: .4rem;
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
        padding: 0;
        margin: 3rem;
        /* margin-left: 7rem; */
    }

    .el-carousel__item:nth-of-type(2) header {
        order: 2;
    }

.noufel {
    position: relative;
    cursor: grab;
}
.noufel::before {
        content: '↕';
        float: left;
        position: absolute;
        left: .5rem;
        top: 35%;
        font-size: 1rem;
        cursor: move;
        cursor: grab;
        cursor: -webkit-grab; cursor:-moz-grab;
        opacity: .18;
        height: 2rem;
        width: 2rem;
    }

    .noufel::before:focus, .noufel::before:active {
       cursor: grabbing;
       cursor: -webkit-grabbing; cursor:-moz-grabbing;
    }


.depense-table-row:hover {
    background:rgba(33, 45, 89, .02);
    transition: .1s linear;
}

.responsive-summary-container {
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
.responsive-summary {
    display: flex;
    flex-direction: row;
    width: 85vw;
}

.responsive-summary .summary-item:first-of-type {
        font-size: 1rem;
        margin: 0 1.2rem auto 0;
        display: flex;
        width: 13rem;
        flex-direction: column;
        justify-content: center;
        align-items: start;
        border-right: 1px solid rgba(33, 45, 89, .1);
    }

.responsive-summary .summary-item {
        border-bottom: none;
        width: 16rem;
    }

    .responsive-summary h4 {
        text-align: flex-start;
        color:  rgba(33, 45, 89, .5);
        font-weight: 300;
        font-size: 1.2rem;
        margin: 0;
    }
    .chosen-expense {
        border: 3px dashed rgba(33, 45, 89, .08);
        box-shadow: 0 0 22px 6px rgba(0, 0, 0, .15)
    }
    /*
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {

  .noufel::before {
       display: none;
    }

}

/*
  ##Device = Tablets, Ipads (landscape)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
    .noufel::before {
       display: none;
    }
}


.budget-share {
    /* border-color: #00BBFF; */
    border: 1px solid #fff;
    color: #00BBFF;
    /* font-size: 1. */
    font-size: .9rem;
    font-weight: 400;
}

.budget-share:hover, .budget-share:focus, .budget-share:active {
    border: 1px solid #00BBFF;
    background: transparent;
}


.social-share {
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(33, 45, 89, .1);
}

.budget-share-icon {
    font-weight: 600;
    font-size: 1.05rem;
    margin-right: .2rem;
    vertical-align: middle;
}
.budget-share-icon2 {
    height: 1rem;
    margin-right: .5rem;
    vertical-align: middle;
}

.budget-share-link {
    padding-top: 1rem;
    padding-bottom: .5rem;
    display: block;
    color: rgba(33, 45, 89, .6);
    font-size: .8rem;
}

.budget-share-container {
    padding: .5rem;
}
</style>
