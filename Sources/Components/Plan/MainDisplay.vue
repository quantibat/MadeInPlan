<template id="MainDisplay">
    <el-dialog title="Chiffrage de votre plan" :visible="show" width="80%" top="50px" class="dialog" center append-to-body @close="close">
        <div class="no-print">
            <el-button class="print" @click="handlePrint">
                <i class="budicon budicon-print-a"/> Imprimer
            </el-button>
            <table v-for="(titleDevis, iterator) in title" :key="titleDevis.ref" class="title-row toggle-off">
                <thead style="height: 50px;" @click="($event) => toggleReduce(titleDevis, $event)" id="">
                    <td v-bind:class="'label-category ' + getClass(titleDevis.label)">{{titleDevis.label}}</td>
                    <td class="label-row"></td>
                    <td class="label-row" v-if="!titleDevis._expanded"></td>
                    <td class="label-row"></td>
                    <td class="label-row"></td>
                    <td class="label-row">
                        <div class="label-total">{{getTotal('PHT', titleDevis.ref).formatMoney(0)}}€</div>
                        <div class="label-table" v-if="!titleDevis._expanded">P.H.T</div>
                    </td>
                    <td class="label-row">
                        <th v-if="titleDevis._expanded" class="arrow-expanded"><i class="el-icon-arrow-right"></i></th>
                        <th v-else class="arrow-expanded"><i class="el-icon-arrow-down"></i></th>
                    </td>
                </thead>
                <tbody id="tbody" v-if="titleDevis._expanded">
                    <tr>
                        <th colspan="1" class="label-desc">Désignation</th>
                        <th class="label-row">Unité</th>
                        <th class="label-row">Quantité</th>
                        <th class="label-row">P.U</th>
                        <th class="label-row">P.H.T</th>
                        <th class="label-row"></th>
                    </tr>
                </tbody>
                <tbody id="tbody" @click="($event) => handleReduce(rDevis, $event)" v-for="rDevis in devisShown" :key="rDevis._id" v-if="isInside(titleDevis, rDevis) && titleDevis._expanded" :class="tableRowClassName(rDevis, undefined)">
                    <td class="label-desc">{{rDevis.label}}</td>
                    <td class="label-row">{{rDevis.unit}}</td>
                    <td class="label-row">{{rDevis.quantity}}</td>
                    <td class="label-row">{{rDevis.PU}}</td>
                    <td class="label-row">{{rDevis.PHT}}</td>
                    <td class="label-row"></td>
                </tbody>
            </table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="emitUpdate(false)">Fermer</el-button>
            </span>
        </div>
        <print-display :data="devis" :price="price" />
    </el-dialog>
</template>

<script>
import PrintDisplay from './PrintChiffrage.vue'

export default {
    name: 'MainDisplay',
    components: {
        'print-display': PrintDisplay
    },
    props: {
        'show': Boolean,
        'obj': Object,
        'close': Function
    },
    data() {
        return {
            devis: [],
            devisShown: [],
            price: [],
            reducedDevis: [],
            descWidth: "auto",
            designWidth: "auto"
        }
    },
    computed: {
        title() {
            return (this.devisShown.filter(e => {
                if (e.hasOwnProperty('PHT') && !e.hasOwnProperty('PU')) return true;
                else if (e.hasOwnProperty('ref') && e.ref == '') return true;
            }))
        }
    },
    methods: {
        toggleReduce(tDevis, $event) {
            if (!tDevis._expanded) tDevis._expanded = true;
            else tDevis._expanded = false;
            this.$forceUpdate();
        },
        getTotal(key, ref) {
            var total = 0;
            this.devis.forEach(devis => {
                if ((this.tableRowClassName(devis) == "table-element") && devis.ref.startsWith(ref) && devis[key]) total += parseInt(devis[key].replace(/[^0-9.,]/g, ""));
            })
            return (total)
        },
        isInside(tDevis, rDevis) {
            if (rDevis.hasOwnProperty('PHT') && !rDevis.hasOwnProperty('PU')) return false;
            else if (rDevis.hasOwnProperty('ref') && rDevis.ref == '') return false;
            if (rDevis.ref.startsWith(tDevis.ref) && tDevis.ref != rDevis.ref) return true;
            return false;
        },
        handleReduce(row, el) {
            let elementClass = el.currentTarget.getAttribute("class");
            if (elementClass == "title-row" || elementClass == "subtitle-row") {
                var index = this.reducedDevis.findIndex(e => {
                    if (row.ref == e) return true;
                    return false;
                })
                if (index != -1) this.reducedDevis.splice(index, 1);
                else this.reducedDevis.push(row.ref)
                this.devisShown  = this.devis.filter(e => {
                    for (var i = 0; i < this.reducedDevis.length; i++) {
                        if (e.ref.startsWith(this.reducedDevis[i]) && e.ref != this.reducedDevis[i]) return false
                    }
                    return true;
                })
            }
        },
        handlePrint() {
            window.print();
        },
        emitUpdate(bool) {
            this.$emit('update:show', bool);
        },
        getClass(name) {
            var parsedName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-").toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");
            return (parsedName)
        },
        explore(obj, array) {
            var item = { 'ref': '', 'label': '', 'unit': '', 'quantity': 0.00, 'PU': 0.00, 'PHT': 0.00 };
            for (p in obj) {
                if (p != 'price') {
                    if (typeof obj[p] != 'object') {
                        item[p] = obj[p];
                    } else {
                        array = this.explore(obj[p], array);
                    }
                }
            }
            if (item.PU == 0) {
                if (item.quantity == 0) delete item.quantity;
                if (item.PU == 0) delete item.PU;
                if (item.PHT == 0) delete item.PHT;
            }
            if (item.ref != '' && (!item.hasOwnProperty('quantity') || item.quantity > 0)) {
                if (item.hasOwnProperty('PHT')) item.PHT = item.PHT.formatMoney(2) + ' €';
                if (item.hasOwnProperty('PU')) item.PU = item.PU.formatMoney(2) + ' €';
                array.push(item);
            }
            return array;
        },
        sortReference(a, b) {
            var iA = a.ref.split('.');
            var iB = b.ref.split('.');

            for (var i = 0; i < Math.min(iA.length, iB.length); i++) {
                if (parseInt(iA[i]) < parseInt(iB[i])) return -1;
                else if (parseInt(iA[i]) > parseInt(iB[i])) return 1;
            }
            return (iA.length - iB.length > 0 ? 1 : -1);
        },
        tableRowClassName(row) {
            if (row == undefined) return;
            if (row.hasOwnProperty('PHT') && !row.hasOwnProperty('PU')) return 'title-row';
            else if (row.hasOwnProperty('ref') && row.ref == '') return 'title-row';
            else if (!row.hasOwnProperty('PHT') && !row.hasOwnProperty('PU')) {
                return 'subtitle-row';
            }
            return 'table-element';
        }
    },
    beforeMount() {
        this.devis = this.explore(this.obj, this.devis);
        this.devisShown = this.devis;
        this.price = [
            { 'ref': '', 'label': '', 'unit': '', 'quantity': '', 'PU': 'HT', 'PHT': this.obj.price.HT.formatMoney(2) + ' €' },
            { 'ref': '', 'label': '', 'unit': '', 'quantity': '', 'PU': 'TVA', 'PHT': this.obj.price.TVA.formatMoney(2) + ' €' },
            { 'ref': '', 'label': '', 'unit': '', 'quantity': '', 'PU': 'TTC', 'PHT': this.obj.price.TTC.formatMoney(2) + ' €' }
        ]
    }
}
</script>

<style scoped>

@media print {
    .el-dialog { margin-top: 0px }
    .dialog { position: relative; }
    .no-print { display: none }
    .el-dialog__header { display: none }
}

.label-total {
    font-size: 0.9rem;
    font-weight: 600;
}

.arrow-expanded {
    text-align: right;
    color: #31BDFC;
    font-weight: 300;
    font-size: 1.2rem;
    width: 0%;
    position: relative;
}


.label-desc {
    padding-left: 1.4rem !important;
}

.title-row {
    width: 75%;
    margin: 0px auto;
    margin-bottom: 16px;
    text-align: left;
    color:rgba(33, 45, 89, 1);
    border: 1px solid rgba(33, 45, 89, .06);
    border-collapse: collapse;
}

.label-row {
    padding-left: 1.4rem !important;
    width: 80px;
}

.label-category {
    padding-left: 1.4rem !important;
    padding-right: 1.4rem !important;
    font-size: 1.2rem;
    font-weight: 600;
    height: 50px;
    margin-left: 30px;
    width: 20vw;
    margin-top: 50px;
    line-height: 1.99;
    border-left: 3px solid #31BDFC;
}

.terrassement { border-color: #212D59 !important; }
.maconnerie { border-color: #212D59 !important; }
.charpente--couverture { border-color: #212D59 !important; }
.menuiseries-exterieurs { border-color: #E97956 !important; }
.platrerie--isolation { border-color: #E97956 !important; }
.menuiseries-interieurs { border-color: #E97956 !important; }
.plomberie--sanitaire { border-color: #E15F6C !important; }
.chauffage--production-deau-chaude { border-color: #E15F6C !important; }
.electricite--vmc { border-color: #E15F6C !important; }
.ravalement-crepis { border-color: #C69C6D !important; }
.revetement-de-sol { border-color: #C69C6D !important; }
.peinture--finitions { border-color: #C69C6D !important; }

.title-row:first-child {
    margin-bottom: 0;
}

.title-row thead {
    box-shadow: 0 3px 6px rgba(0, 0, 0, .04);
    cursor: pointer;
}

.title-row thead:hover {
    box-shadow: 0 6px 6px rgba(0, 0, 0, .06);
}


.title-row tbody {
    border-top: 1px solid rgba(33, 45, 89, .03);
}

.title-row tbody tr {
    border-bottom: 1px solid rgba(33, 45, 89, .07);
}
.title-row tbody tr:last-of-type {
    border-bottom: none;
}

.title-row tbody th{
    color: rgba(33, 45, 89, .5);
    font-weight: 400;
    font-size: .9em;
    background: rgba(33, 45, 89, .02);
    padding-bottom: 0;
}

.title-row th {
    padding: .6rem 0 .4em;
    height: 3rem;
}

.title-row td {
    padding: 0.3rem 0 0.3rem;
    font-size: .9em;
}


.label-table {
    font-weight: 300;
    font-size: .8rem;
    opacity: .5;
}

.print { margin-left: 150px; margin-bottom: 20px; }
.subtitle-row { background: #DAE5F0; font-weight: 700; cursor: pointer;}
</style>
