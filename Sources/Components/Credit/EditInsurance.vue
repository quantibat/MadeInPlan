<template id="EditInsurance" v-loading="offer != undefined">
    <el-dialog class="credit-container2 add-offre" style="margin-top: -2rem; padding-top: 0rem; top: 0;background: rgba(255, 255, 255, .99);" :visible="show" :fullscreen="true" :width="(isMobile())?'100vw':'70vw'" @close="handleClose()">
                <el-row v-if="show" style="margin-top: -2rem;">
                    <h1>Editer une assurance</h1>
                    <div style="text-align: right; float: right; width: 70%;">
                        <el-select v-if="offer.money._is" placeholder="Choisir une banque" filterable class="select-bank" v-model="offer.bank" value-key="label">
                            <el-option v-for="bank in banks" class="option-bank" :key="bank.name" :label="bank.label" :value="bank">
                                <span style="float: left">{{ bank.label }}</span>
                                <img :src="bank.img" style="float: right; height: 40px; width: auto;"/>
                            </el-option>
                        </el-select>
                        <el-input  value-key="label" class="select-name" onClick="this.select()" v-model="offer.assurance.name" :maxlength="10" v-if="offer.assurance._is && !offer.money._is" label="Nom" placeholder="Nom de l'assureur ou du courtier"></el-input>
                        <el-input  class="select-name" onClick="this.select()" v-model="offer.agence" v-if="offer.money._is" type="text" :maxlength="15" placeholder="Nom de l'agence"></el-input>
                    </div>
                    <el-tabs type="card" v-model="offerDialog.pane" ref="tabs" @tab-remove="handleTabsRemove">
                        <el-tab-pane name="1" v-if="offer.money._is">
                            <span slot="label">Crédit</span>

                            <el-row :gutter="120">
                                <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">
                                    <div class="label-input">
                                        <label class="label">Montant emprunté</label>
                                        <el-button v-tooltip="'Somme que la banque est disposée à vous prêter'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.money.montantEmprunte" type="text">
                                            <template slot="append">€</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Taux du crédit</label>
                                        <el-button v-tooltip="'Coût du crédit ou valeur (en %) des intérêts qui devront être payés.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.money.tauxCredit" type="text">
                                            <template slot="append">%</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Durée de l'emprunt</label>
                                        <el-button v-tooltip="'Durée pendant laquelle le crédit doit être remboursé'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.money.duree" type="text">
                                            <template slot="append">mois</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Coût des intérêts</label>
                                        <el-button v-tooltip="'Somme totale des intérêts à payer.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.money.coutInteret" type="text">
                                            <template slot="append">€</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Frais de dossiers bancaires</label>
                                        <el-button v-tooltip="'Somme forfaitaire facturée par la banque ou le courtier pour l’étude du dossier'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.money.fraisDossier" type="text">
                                            <template slot="append">€</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Type de garantie</label>
                                        <el-button v-tooltip="'Somme payée par l’emprunteur entre le moment où la banque débloque les fonds et celui où a lieu le remboursement de la première mensualité'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-select v-model="offer.money.typeGarantie">
                                            <el-option label="Hypothèque" value="Hypothèque">Hypothèque</el-option>
                                            <el-option label="Privilège du prêteur" value="Privilège du prêteur">Privilège du prêteur</el-option>
                                            <el-option label="Caution mutuelle" value="Caution mutuelle">Caution mutuelle</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Coût de la garantie</label>
                                        <el-button v-tooltip="'Assurance souscrite par l’emprunteur pour certifier au prêteur que le crédit sera bien remboursé'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.money.coutGarantie" type="text">
                                            <template slot="append">€</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Montant remboursé</label>
                                        <el-button v-tooltip="'Somme payée par l’emprunteur pour la souscription d’une garantie de crédit'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.money.montantRembourse" type="text">
                                            <template slot="append">€</template>
                                        </el-input>
                                    </div>
                                </el-col>


                                <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">
                                    <div class="label-input">
                                        <label class="label">Frais intercalaires</label>
                                        <el-select v-model="offer.money.fraisIntercalaire">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Frais des intermédiaires</label>
                                        <el-select v-model="offer.money.fraisIntermediaire">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Frais d'examens de contrat</label>
                                        <el-select v-model="offer.money.fraisExamenContrat">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>


                                    <div class="label-input">
                                        <label class="label">Mode d’amortissement</label>
                                        <el-select v-model="offer.money.modeAmortisement">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>
                                    <div class="label-input">
                                        <label class="label">Transférabilité du prêt</label>
                                        <el-select v-model="offer.money.transfertPret">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>
                                    <div class="label-input">
                                        <label class="label">Remboursement anticipé</label>
                                        <el-select v-model="offer.money.remboursementAnticipe">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>


                                    <div class="label-input">
                                        <label class="label">Remboursement anticipé</label>
                                        <el-select v-model="offer.money.remboursementAnticipe">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Modularité du prêt</label>
                                        <el-select v-model="offer.money.modularitePret">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Différé de remboursement</label>
                                        <el-select v-model="offer.money.differeRemboursement">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Report de mensualités</label>
                                        <el-select v-model="offer.money.reportMensualite">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row style="margin-top: -2   rem;margin-bottom: 1rem;" type="flex">
                                <el-col :span="10" style="margin: 0 auto; text-align: center;">
                                    <span class="add-assurance" @click="offer.assurance._is = true; offerDialog.pane = '2'">+ Ajouter une offre d'assurance ?</span>
                                </el-col>
                            </el-row>
                            <el-row type="flex">
                                <el-col :span="10" style="margin: 0 auto;">
                                    <el-button @click="saveChanges">Enregistrer les modifications</el-button>
                                </el-col>
                            </el-row>
                        </el-tab-pane>

                        <el-tab-pane name="2" v-if="offer.assurance._is" :closable="offer.money._is">
                            <span slot="label">Assurance</span>

                            <el-row :gutter="64">
                                <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 11}" :xl="{ offset: 0, span: 11}">
                                    <div class="label-input">
                                        <label class="label">Taux de couverture</label>
                                        <el-button v-tooltip="'Ou quotité d’assurance, correspond à la répartition de la couverture proposée par l’assureur entre les emprunteurs.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.assurance.tauxCouverture" type="text">
                                            <template slot="append">%</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Couvertures / Risques exclus</label>
                                        <el-button v-tooltip="'Risques n’étant pas couverts par l’assurance-emprunteur.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-select v-model="offer.assurance.couvertureRisqueExclus">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Mode d’exécution des garanties</label>
                                        <el-button v-tooltip="'Procédure administrative à respecter afin d’obtenir le déclenchement de l’assurance-emprunteur.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-select v-model="offer.assurance.modeExecutionGarantie">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Délais de carence / Franchise</label>
                                        <el-button v-tooltip="'Période pendant laquelle un sinistre relevant de la garantie de l’assurance-emprunteur ne sera pas pris en charge.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-select v-model="offer.assurance.delaisCaranceFranchise">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>
                                </el-col>

                                <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 11}" :xl="{ offset: 0, span: 11}">
                                    <div class="label-input">
                                        <label class="label">Taux de l’assurance</label>
                                        <el-button v-tooltip="'Coût de l’assurance emprunteur, aussi appelé TAEA pour « taux annuel effectif d’assurance »'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.assurance.tauxAssurance" type="text">
                                            <template slot="append">%</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Mensualité de l’assurance</label>
                                        <el-button v-tooltip="'Somme à payer tous les mois au titre du paiement de la cotisation de l’assurance-emprunteur'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.assurance.mensualiteAssurance" type="text" style="">
                                            <template slot="append">€ / mois</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Coût de l’assurance</label>
                                        <el-button v-tooltip="'Somme totale à payer au titre des cotisations de l’assurance emprunteur'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-input onClick="this.select()" v-model="offer.assurance.coutAssurance" type="text">
                                            <template slot="append">€</template>
                                        </el-input>
                                    </div>

                                    <div class="label-input">
                                        <label class="label">Dates et motifs d’expiration des garanties</label>
                                        <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                        <el-select v-model="offer.assurance.dateMotifExpirationGarantie">
                                            <el-option label="Oui" :value="true">Oui</el-option>
                                            <el-option label="Non" :value="false">Non</el-option>
                                        </el-select>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row type="flex">
                                <el-col :span="10" style="margin: 2rem auto;">
                                    <el-button class="custom-btn" @click="saveChanges">Enregistrer l'offre</el-button>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-dialog>
</template>

<script>

export default {
    name: 'EditInsurance',
    props: {
        'offer': {

        'default': {
                assurance: {
                    _is: false
                },
                bank: {},
                coutGlobalCredit: 0,
                taeg: 0,
                mensualiteTotal: 0,
                money: {
                    _is: false,
                    montantEmprunte: 0,
                    tauxCredit: 0,
                    duree: 0,
                    mensualiteMois: 0,
                    coutInteret: 0,
                    fraisDossier: 0,
                    typeGarantie: 'Caution mutuelle',
                    coutGarantie: 0,
                    montantRembourse: 0,
                    fraisIntercalaire: false,
                    fraisIntermediaire: false,
                    fraisExamenContrat: false,
                    modeAmortisement: false,
                    transfertPret: false,
                    remboursementAnticipe: false,
                    modularitePret: false,
                    differeRemboursement: false,
                    reportMensualite: false
                },
            },
            type: Object,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        }
    },
    components: {
    },
    data() {
        return {

        'editOffer': {
                assurance: {
                    _is: false
                },
                bank: {},
                coutGlobalCredit: 0,
                taeg: 0,
                mensualiteTotal: 0,
                money: {
                    _is: false,
                    montantEmprunte: 0,
                    tauxCredit: 0,
                    duree: 0,
                    mensualiteMois: 0,
                    coutInteret: 0,
                    fraisDossier: 0,
                    typeGarantie: 'Caution mutuelle',
                    coutGarantie: 0,
                    montantRembourse: 0,
                    fraisIntercalaire: false,
                    fraisIntermediaire: false,
                    fraisExamenContrat: false,
                    modeAmortisement: false,
                    transfertPret: false,
                    remboursementAnticipe: false,
                    modularitePret: false,
                    differeRemboursement: false,
                    reportMensualite: false
                },
        },
        offerDialog: {
                show: false,
                pane: '2'
            },
        banks: [
                    {
                        label: 'Allianz',
                        name: 'allianz',
                        img: '/Assets/Bank/allianz-banque.png'
                    }, {
                        label: 'AXA Banque',
                        name: 'axa-banque',
                        img: '/Assets/Bank/AXA_Banque.png'
                    }, {
                        label: 'LCL',
                        name: 'lcl',
                        img: '/Assets/Bank/lcl.png'
                    }, {
                        label: 'Banque Accord',
                        name: 'banque-accord',
                        img: '/Assets/Bank/banque-accord.jpg'
                    }, {
                        label: 'B For Bank',
                        name: 'b-for-bank',
                        img: '/Assets/Bank/b-for-bank.jpg'
                    }, {
                        label: 'Boursorama',
                        name: 'boursorama',
                        img: '/Assets/Bank/boursorama.jpg'
                    }, {
                        label: 'Banque De Savoie',
                        name: 'banque-de-savoie',
                        img: '/Assets/Bank/banque-de-savoie.jpg'
                    }, {
                        label: 'Barclays',
                        name: 'barclays',
                        img: '/Assets/Bank/barclays.png'
                    }, {
                        label: 'Banque Fédéral Mutualiste',
                        name: 'banque-federal-mutualiste',
                        img: '/Assets/Bank/BFM.jpg'
                    }, {
                        label: 'CCSO',
                        name: 'ccso',
                        img: '/Assets/Bank/ccso.jpg'
                    }, {
                        label: 'Caisse d\'Épargne',
                        name: 'caisse-epargne',
                        img: '/Assets/Bank/caisse_depargne.png'
                    }, {
                        label: 'Crédit Coopératif',
                        name: 'credit-cooperatif',
                        img: '/Assets/Bank/credit_cooperatif.png'
                    }, {
                        label: 'Crédit Du Nord',
                        name: 'credit-du-nord',
                        img: '/Assets/Bank/credit-du-nord.png'
                    }, {
                        label: 'Crédit Mutuel ARKEA',
                        name: 'credit-mutuel-arkea',
                        img: '/Assets/Bank/credit_mutuel_ARKEA.png'
                    }, {
                        label: 'La Banque Postale',
                        name: 'banque-postal',
                        img: '/Assets/Bank/LBP.png'
                    }, {
                        label: 'Crédit foncier',
                        name: 'credit-foncier',
                        img: '/Assets/Bank/credit-foncier.png'
                    }, {
                        label: 'Banque Populaire',
                        name: 'banque-populaire',
                        img: '/Assets/Bank/banque_populaire.png'
                    }, {
                        label: 'BNP Paris Bas',
                        name: 'bnp',
                        img: '/Assets/Bank/bnp.png'
                    }, {
                        label: 'Crédit Agricole',
                        name: 'credit-agricole',
                        img: '/Assets/Bank/credit_agricole.png'
                    }, {
                        label: 'Société Générale',
                        name: 'societe-generale',
                        img: '/Assets/Bank/societe-generale.png'
                    },{
                        label: 'CIC',
                        name: 'cic',
                        img: '/Assets/Bank/cic.png'
                    },  {
                        label: 'Crédit Mutuel',
                        name: 'credit-mutuel',
                        img: '/Assets/Bank/credit_mutuel.jpg'
                    }, {
                        label: 'Fortis Banque',
                        name: 'fortis-banque',
                        img: '/Assets/Bank/fortis.gif'
                    }, {
                        label: 'Fortuneo Banque',
                        name: 'fortuneo-banque',
                        img: '/Assets/Bank/fortuneo-black.png'
                    }, {
                        label: 'Groupama Banque',
                        name: 'groupama-banque',
                        img: '/Assets/Bank/groupama-banque.png'
                    }, {
                        label: 'Hello Bank',
                        name: 'hello-bank',
                        img: '/Assets/Bank/hello-bank.png'
                    }, {
                        label: 'Ing Direct',
                        name: 'ing-direct',
                        img: '/Assets/Bank/ing-direct.jpg'
                    }, {
                        label: 'HSBC',
                        name: 'hsbc',
                        img: '/Assets/Bank/hsbc.png'
                    }, {
                        label: 'Banque Palatine',
                        name: 'banque-palatine',
                        img: '/Assets/Bank/palatine.jpg'
                    }
                ],
        }
    },
    watch: {
        offer() {
            this.editOffer = this.offer;
        }
    },
    computed: {
        user() {
            return this.$localStorage.get('user');
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
        saveChanges() {
            // this.offer = this.editOffer;
            this.$http.post(this.$root.URL + '/credit/edit-offer', {offer: this.offer}).then((res) => {
                this.handleClose();
            });
        },
        handleClose() {
            this.$emit("close")
        },
        handleTabsRemove(targetName) {
            this.offerDialog.pane = '1';
            this.$http.post(this.$root.URL + '/credit/edit-offer', {offer: this.offer}, (res) => {
            });
            this.editOffer.assurance._is = false;
        },
    },
    mounted() {
        this.editOffer = this.offer;
    }
}
</script>

<style scoped>
        .select-bank { width: 18rem !important; z-index: 10; }
        .select-name { width: 18rem !important; z-index: 10; }
        .option-bank { height: 50px; }
        table { color: rgba(35, 49, 88, 1); border-collapse: collapse; margin-top: 1rem; margin-left: .2rem; box-sizing: border-box; }
        tbody { box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 ); border-radius: 4px; display: flex; flex-direction: column; align-items: center; align-content: center; }
        /* .credit-table-item.lcl tbody { background: linear-gradient(#0058A4, #1E3587); color: #FFFFFF; }
        .credit-table-item.credit-agricole tbody { background: linear-gradient(#409396 , #2C6850); color: #FFFFFF; }
        .credit-table-item.credit-mutuel tbody { background: linear-gradient(#409396 , #2C6850); color: #FFFFFF; }
        .credit-table-item.caisse-epargne tbody { background: linear-gradient(#409396 , #2C6850); color: #FFFFFF; }
        .credit-table-item.hsbc tbody { background: linear-gradient(#409396 , #2C6850); color: #FFFFFF; }
        .credit-table-item.societe-generale tbody { background: linear-gradient(#409396 , #2C6850); color: #FFFFFF; }
        .credit-table-item.bnp tbody { background: linear-gradient(#409396 , #2C6850); color: #FFFFFF; }
        .credit-table-item.banque-populaire tbody { background: linear-gradient(#409396 , #2C6850); color: #FFFFFF; } */
        .credit-table-item.infos tbody tr {
            width: 100%;
            margin: 0 auto;
            display: flex;
            border-bottom: 1px solid rgba(35, 49, 88, .07);
            box-sizing: border-box;
        }
        .credit-table-item.infos tbody td {
            text-align: center !important;
            width: 100%;
        }
        .credit-table-item.infos tbody tr:hover {
            background: rgba(255, 255, 255, .1);
        }
        td {
            padding: .7rem 1.2rem;
            font-size: .9rem;
            width: 100%;
            text-align: left;
            position: relative;
        }
        .credit-tables {
            display: flex;
        }
        .credit-table-item {
            margin-right: 1rem;
            /* min-width: 500px; */
            position: relative;
            /* flex: 1 0 20%; */
            /* width: %; */
        }

        .credit-table-item.infos {
            min-width: 250px;
            flex: 1 0 22%;
        }
        .credit-table-item:last-of-type {
            margin-right: none;
        }
        .credit-table-add {
            cursor: pointer;
            height: 80px;
            margin-bottom: .5rem;
            padding: 1rem;
            border: 2px dashed #31bcfc;
            border-radius: 4px;
            display: flex;
            box-sizing: border-box;
            transition: all .2s ease-in-out;
            justify-content: center;
            align-items: center;
            color: #31bcfc;
            font-size: 1rem;
            font-weight: 300;
        }
        .credit-table--banque {
            cursor: pointer;
            display: flex;
            align-items: center;
            box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 );
            border-radius: 4px;
            padding: 1rem;
            margin-bottom: .5rem;
            height: 80px;
            box-sizing: border-box;
        }
        .credit-table--banque-logo img {
            height: 2.5rem;
            width: 2.5rem;
            object-fit: contain;
            vertical-align: middle;
            margin-right: .6rem;
            border-radius: 3px;
            border: 1px solid rgba(35, 49, 88, .1 );
        }
        .credit-table--banque-info {
            display: flex;
            flex-direction: column;
            text-align: left;
        }
        .credit-table--banque-agence {
            font-weight: 300;
            font-size: .8rem;
        }
        .credit-table-item.labels tr {
            font-weight: 500;
            color: rgba(35, 49, 88, .95 );
            align-self: stretch;
            border-bottom: 1px solid rgba(35, 49, 88, .08 );
        }
        .credit-table-item.labels thead tr:first-of-type {
            border-bottom: none;
        }
        .credit-table-item.new::after {
            content: '';
            position: absolute;
            background: rgba(255, 255, 255, .95);
            width: 100%;
            height: 99%;
            border-radius: 4px;
            top: 0;
            left: 0;
            z-index: 0;
            border: 2px dashed #31bcfc4e;
            transition: all .2s ease-in-out;
        }

        .credit-table-item.new .new-offer i {
            font-size: 2rem;
        }
        .credit-table-item.new .new-offer {
            position: absolute;
            text-align: center;
            top: 45%;
            left: 25%;
            z-index: 2000;
            box-sizing: border-box;
            color: #31bcfc;
            font-size: 1rem;
            font-weight: 300;
            cursor: pointer;
        }
        .credit-table-item.new:hover::after{
            border: 2px dashed #31bcfcad;
            transition: all .2s ease-in-out;
        }
        .accent-text {
            color: #20BFFF;
            font-size: 14px;
            font-weight: 300;
        }
        .simulation-tile {
            overflow: hidden;
            margin-top: 2.4rem;
            margin-left: 1rem;
            box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 );
            position: relative;
            padding: 1.8rem 0;
            color: #38436A;
            display: flex;
            flex-direction: column;
            width: 300px;
            box-sizing: border-box;
            margin-right: 1rem;
            margin-bottom: 1.4rem;
            border-radius: 5px;
            cursor: pointer;
            transition: .2s linear all;
        }

        .simulation-tile.bientot {
            padding: 0;
            width: 350px;
        }

        .simulation-tile.bientot .tile-text {
            opacity: .5;
        }

        .simulation-tile:hover {
            box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .1);
            transition: .2s linear all;
        }
        .simulation-tile.calculation::after {
            content: url('../../Assets/bg-events.svg');
            position: absolute;
            bottom: -1.5rem;
            left: -1rem;
            width: 20%;
            opacity: .08;
            transform: rotate(-15deg);
        }
        .simulation-tile.loan::after {
            content: url('../../Assets/bg-loan.svg');
            position: absolute;
            bottom: -0.5rem;
            left: -0.2rem;
            width: 20%;
            opacity: .08;
            transform: rotate(-25deg);
        }
        .tile-text {
            padding-left: 65px;
            font-weight: 500;
            margin-top: auto;
            margin-bottom: auto;
        }
        .simulation-container {
            display: flex;
            flex-wrap: wrap;
            margin-left: 1.4rem;
        }
        .el-tab-pane {
            margin-bottom: 3rem;
        }
        .credit-container {
            margin-top: -4rem;
        }
        .credit-table--banque .credit-table--banque-delete {
            display: none;
        }
        .credit-table--banque:hover .credit-table--banque-delete {
            display: block;
            position: absolute;
            right: .4rem;
            top: .12rem;
            color: rgba(35, 49, 88, .6);
        }
        .credit-table--banque .credit-table--banque-delete:hover {
            cursor: pointer;
            color: #ed5f59;
        }
        .add-offre {
            margin: auto;
        }
        .add-offre h1 {
            margin-bottom: 2rem;
        }
        .label { width: 60%; text-transform: uppercase; margin-bottom: -15px; text-align: left; color: #2B396A; opacity: 0.5; letter-spacing: 1px; font-weight: 400; font-size: 14  px; }
        .el-input { border-radius: 4px; margin-bottom: 11px; font-size: 18px; color: #2B396A; width: 50%; clear: both; }
        .el-input:focus { box-shadow: 0 0 6px rgba(0, 0, 0, .16); }
        .el-select { border-radius: 4px; margin-bottom: 11px; font-size: 18px; color: #2B396A;  clear: both; width: 50%;  margin-left: auto;}
        .el-select:focus { box-shadow: 0 0 6px rgba(0, 0, 0, .16); }
        .el-button.custom-btn { border: none;font-size: 21px; padding: 1rem 0; font-weight: 400; color: #FFFFFF; border-radius: 4px; background: linear-gradient(5deg,#31bdfc,#00d3f7); text-align: center; width: 100%; }
        .el-button:hover { opacity: 0.8; }
        .el-dialog__header {padding: 0;}
        .add-assurance { color: #31BDFC; font-size: 1rem; border: 1px solid rgba(49, 188, 252, 0.564); padding: .5rem; border-radius: 5px; }
        .add-assurance:hover { cursor: pointer; }
        .label-input {
            display: flex;
            align-items: baseline;
            margin-bottom: .2rem;
        }



        tr:hover .help-row {
            visibility: visible;
            /* transition: .2s linear all; */
        }

        .help-row {
            visibility: hidden; padding: 0;position: relative; top: .7rem; right: .6rem;
        }

        .help {
            color: #00BBFF;
            border: 1px solid #00BBFF; background: #fff; font-weight: 400; border-radius:50%; padding: 0; margin: 0; height: 21px; line-height: 21px;
            width: 21px;
            font-weight: 500;
            font-size: .8rem;

        }

        .help:hover  {
            border: 1px solid #00BBFF;
            color: #00BBFF;
            background: #fff;
        }

        .help.new-offer {
            position:relative;
            top: -.2rem;
            /* left: -2rem; */
            visibility: hidden;
            margin: 0 1rem;
            width: 30px;
            height: 24px;
            line-height: 24px;
            font-size: .9rem;
            padding: 0;
            opacity: .6;
            /* border-radius: 100% !important; */

        }

        .label-input:hover .help.new-offer {
            visibility: visible;
        }

        .simulation-name {
            margin-bottom: .2rem;
            /* font-weight: 600; */
        }

        .credit-offer-container {
            display: inline-flex;
            overflow-x: auto;
            overflow-y: hidden;
            max-width: 100%;
        }

        .select-name {
            font-size: 14px;
        }

        /*
        ##Device = Tablets, Ipads (portrait)
        ##Screen = B/w 768px to 1024px
        */

        @media (min-width: 768px) and (max-width: 1024px) {

            .credit-container {
                margin-top: 1rem;
            }

            .select-name {
                margin-top: .7rem;
            }

            .label-input {
                width: 92%;
            }
        }

        /*
        ##Device = Tablets, Ipads (landscape)
        ##Screen = B/w 768px to 1024px
        */

        @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

            .credit-container {
                margin-top: 1rem;
            }

            .select-name {
                margin-top: .7rem;
            }
            .label-input {
                width: 100%;
            }
        }
    </style>