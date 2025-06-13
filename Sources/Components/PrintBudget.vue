<template>
    <body>
        <div class="print" v-if="!loading">
            <header class="doc-head">
                <img class="doc-logo" src="/Assets/mip-print.png" alt="">
                <h1 class="doc-title">Mon budget</h1>
                <span class="doc-desc">Résumé</span>
            </header>

            <main class="doc-content">
                <table class="doc-table">
                    <thead>
                        <tr>
                            <td></td>
                            <td>Estimé</td>
                            <td>Payé</td>
                            <td>En attente</td>
                        </tr>
                    </thead>
                </table>
                <table v-for="category in categories" :key="category.name" class="doc-table">
                    <tbody>
                        <tr>
                            <td :class="getClass(category.name)">{{category.name}}</td>
                            <td>{{getTotalKey(category, 'estimateValue')}} €</td>
                            <td>{{getTotalKey(category, 'paid')}} €</td>
                            <td>{{getTotalKey(category, 'waiting')}} €</td>
                        </tr>
                    </tbody>
                </table>
            </main>

            <header class="doc-head">
                <img class="doc-logo" src="/Assets/mip-print.png" alt="">
                <h1 class="doc-title">Mon budget</h1>
                <span class="doc-desc">Détail</span>
            </header>

            <main class="doc-content">
                <table class="doc-table">
                    <thead>
                        <tr>
                            <td></td>
                            <td>Estimé</td>
                            <td>Payé</td>
                            <td>En attente</td>
                        </tr>
                    </thead>
                </table>

                <table v-for="category in categories" :key="category.name" class="doc-table">
                    <tbody>
                        <tr>
                            <td :class="getClass(category.name)">{{category.name}}</td>
                            <td>{{getTotalKey(category, 'estimateValue')}} €</td>
                            <td>{{getTotalKey(category, 'paid')}} €</td>
                            <td>{{getTotalKey(category, 'waiting')}} €</td>
                        </tr>
                        <tr v-for="item in items" :key="item.id" v-if="item.category == category.name" class="doc-item">
                            <td>{{item.name}} </td>
                            <td>{{parseMoney(item.estimateValue)}} €</td>
                            <td>{{parseMoney(item.paid)}} €</td>
                            <td>{{parseMoney(item.waiting)}} €</td>
                        </tr>
                    </tbody>
                </table>

                <table class="doc-table total">
                    <tfoot>
                        <tr>
                            <td>Total</td>
                            <td>{{getTotal("estimateValue")}} €</td>
                            <td>{{getTotal("paid")}} €</td>
                            <td>{{getTotal("waiting")}} €</td>
                        </tr>
                    </tfoot>
                </table>
            </main>
        </div>
    </body>
</template>

<script>

export default {
    name: 'Budget',
    components: {
    },
    data() {
        return {
            fullBudget: {
                loan    : '',
                inflow  : '',
            },
            loading: true,
        }
    },
    computed: {
        items() {
            return (this.$store.state.budgets.items)
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
    methods: {
        getClass(name) {
            var parsedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
            return (parsedName)
        },
        getTotalKey(category, key) {
            let total = this.items.reduce((accumulator, item) => {
                if (item.category == category.name) {
                    if (!item[key]) return (accumulator);
                    return (item[key] + accumulator)
                }
                return (accumulator);
            }, 0)
            if (!total) return 0;
            return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        },
        parseMoney(money) {
            if (!money) return 0;
            return (money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "))
        },
        getTotal(key) {
            let total = this.items.reduce((accumulator, item) => {
                if (!item[key]) return accumulator;
                return (accumulator + item[key])
            }, 0);
            if (!total) return 0;
            return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
        }
    }
}
</script>

<style scoped>
@media print {
    @page {
        size: auto;
        margin-bottom: 50px;
        margin-top: 500px;
    }

    .doc-content {
        page-break-after: always;
    }
    .doc-table {
        width: 100%;
        page-break-inside: avoid;
    }
    .Header, .Footer { display: none ; }
}

@media screen {
    .print { display: none; }
}
.doc-head {
    clear: both;
    margin-top: 50px;
}
body {
    font-family: 'Poppins', sans-serif;
    margin: 2rem 4rem;
    color: rgba(55, 65, 105, 1);
}

header {
    display: flex;
    flex-direction: column;
}

.doc-head {
    clear: both;
}
.doc-logo {
    width: 400px;
    margin-top: -2rem;
    margin-left: -4rem;
    margin-bottom: 3rem;
}
.doc-title {
    margin-bottom: .5rem;
    font-weight: 600;
}
.doc-desc {
    color: rgba(55, 65, 105, .6);
    text-transform: uppercase;
    letter-spacing: 1px;
}
.doc-table:first-of-type {
    margin-bottom: 1rem;
}
.doc-table {
    width: 100%;
    margin-bottom: 2rem;
}
.doc-table td+td {
    width: 20%;
}
.doc-table td+td {
    text-align: right;
}

.doc-table thead td {
    color: rgba(55, 65, 105, .6);
    font-size: .9rem;
}
.doc-table tbody tr+tr td {
    color: rgba(55, 65, 105, .6);

    padding: 1rem 0 0rem 1.2rem;
    font-size: .9rem;
}
.doc-table tbody tr:first-of-type td:first-of-type {
    font-weight: 600;
    border-left: 4px solid red;
    padding-left: 1rem;
    box-sizing: border-box;
    color: rgba(55, 65, 105, 1);
    font-size: 1.2rem;
}
.doc-table.total {
    margin-top: 2rem;
}
.doc-table tfoot td { font-weight: 700; font-size: 1.2rem; }

.terrain {border-color: #CF815F !important;}
.credit {border-color: #D980FA !important;}
.assurances {border-color: #E15F6C !important;}
.taxes {border-color: #00BBFF !important;}
.urbanisme {border-color: #55E6C1 !important;}
.construction {border-color: #FEA47F !important;}
.travaux-reserves {border-color: #FEDC57 !important;}
.economie-denergie {border-color: #B2DA93 !important;}
.interieur {border-color: #7F8FFF !important;}
.exterieur {border-color: #7F8FC6 !important;}
.divers {border-color: rgba(33, 45, 89, 0.393) !important;}
</style>
