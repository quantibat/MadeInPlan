<template>
    <div v-loading="loading" class="main-containers">
        <div class="noprint">
            <el-row type="flex" align="space-around" class="header" v-if="owner !== null">
                <el-col :md="24" :sm="24" :xs="24" :lg="10" :xl="10">
                    <h1>Budget de {{owner.firstName}}</h1>
                </el-col>
            </el-row>
            <el-row  v-if="!loading" :gutter="42">
                <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="19">
                    <table class="depense-table toggle-off"></table>
                    <div v-if="budgets.categories.length == 0" class="no-result">
                        <el-row>
                            <img src="/Assets/search-no-results.svg">
                            <p class="title">Oups ...</p>
                            <p class="text">Aucun résultat pour votre recherche</p>
                        </el-row>
                    </div>
                    <table v-for="(budget, iterator) in budgets.categories" class="depense-table toggle-off">
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
                                <tr class="depense-table-row" v-for="(item, index) in budget.items">
                                    <td class="depense-table-label">
                                        <div v-html="$options.filters.highlight(item.name, searchInput)"></div>
                                    </td>
                                    <td class="depense-table-detail-amount">{{ (item.estimateValue !== undefined)?item.estimateValue.formatMoney(0):0 }} €</td>
                                    <td class="depense-table-detail-amount">{{ item.paid.formatMoney(0) }} €</td>
                                    <td class="depense-table-detail-amount">{{showWaiting(item).formatMoney(0)}} €</td>
                                    <td class="">
                                    </td>
                                </tr>
                            </tbody>

                    </table>
                </el-col>


                <el-col class="hidden-md-and-down" :md="5" :lg="6" :xl="5">
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
                                    {{fullBudget.loan}} €
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
                                    {{fullBudget.inflow}} €
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
                                    {{fullBudget.loan}} €
                                </div>
                                <div class="summary-name">Emprunt</div>
                            </div>
                        </div>

                        <div class="summary-item">
                            <div class="summary-detail">
                                <div class="summary-amount">
                                    {{fullBudget.inflow}} €
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
    </div>
</template>

<script>
import accentFolding from 'accent-folding';

export default {
    name: 'Budget',
    metaInfo() {
        return {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: this.owner.firstName,
      titleTemplate: 'Budget de construction de %s — Made in Plan'
      // all titles will be injected into this template
        } 
    },
    data() {
        return {
            loading: true,
            isToggle: false,
            carrouselIndex: 0,
            searchInput: '',
            budgets: {
                categories: []
            },
            owner: null,
            fullBudget: {
                loan    : '',
                inflow  : '',
            },
        }
    },
    computed: {
    },
    created() {
        this.$http.get(this.$root.URL + '/budget/get-preview/' + this.$route.params.id).then(res => {
            var budgets = res.data.budget;
            this.owner = res.data.info[0];
            this.fullBudget.loan = res.data.budget.loan;
            this.fullBudget.inflow = res.data.budget.inflow;
            budgets.items.forEach(e => { e._showDel = false; });
            budgets.categories.forEach(e => { e.expended = false; });
            budgets.categories.forEach(category => {
                category.items = budgets.items.filter(item => {
                    if (item.category == category.name) return true;
                });
            });
            this.budgets = budgets;
            this.loading = false;
        }).catch(error => console.log(error));
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
        getAbsoluteTotalMoney(key) {
            var items = this.budgets.items;
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
        getBudgetClass(name) {
            var parsedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
            return (parsedName)
        },
        getTotal() {
            var loan =  Math.round(this.fullBudget.loan);
            var inflow = Math.round(this.fullBudget.inflow)
            return ((loan + inflow).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
        },
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
        background: rgba(255, 255, 255, 0.742);
        border: 1px solid rgba(33, 45, 89, .08);
        border-radius: 6px;
        padding-bottom: 10px;
        box-shadow: 0 0px 69px 0 rgba(35,49,88,.1);
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
        background: white;
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
    background: #fff;
    border: 1px solid rgba(33, 45, 89, .08);
    border-radius: 5px;
    box-shadow: 0 -2px 22px 0 rgba(0, 0, 0,.15);
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

.header h1 {
    margin-top: 0;
    margin-bottom: 0px;
}
</style>
