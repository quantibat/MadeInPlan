<template>
    <div v-loading="loading" class="main-container">
        <el-row type="flex" align="bottom" class="header">
            <h1>Mon crédit</h1>
        </el-row>

        <edit-credit v-on:close="handleCloseEditCredit" :show="showEditCredit" :offer="offerEdit" />

        <edit-insurance v-on:close="handleCloseEditInsurance" :show="showEditInsurance" :offer="offerEdit" />

        <monthly-calculation :open="monthlyCalculationDialog" :close="closeMonthlyCalculationDialog" :simulations="paymentSimulations" :change="onPaymentSimulationsChange"/>

        <loan-capacity :open="loanCapacityDialog" :close="closeLoanCapacityDialog" :simulations="loanCapacitySimulations" :change="onLoanCapacitySimulationsChange"/>

        <el-dialog class="credit-container2 add-offre" style="margin-top: -2rem; padding-top: 0rem; top: 0;background: rgba(255, 255, 255, .99);" v-if="offerDialog.show" :visible.sync="offerDialog.show" :fullscreen="true" :width="(isMobile())?'100vw':'70vw'" @close="resetNewOffer()">
            <el-row style="margin-top: -2rem;">
                <h1>Ajouter une offre</h1>
                <div style="text-align: right; float: right; width: 70%;">
                    <el-select v-if="newOffer.money._is" filterable  placeholder="Choisir une banque" class="select-bank" v-model="newOffer.bank" value-key="label">
                        <el-option v-for="bank in banks" class="option-bank" :key="bank.name" :label="bank.label" :value="bank">
                            <span style="float: left">{{ bank.label }}</span>
                            <img :src="bank.img" style="float: right; height: 40px; width: auto;"/>
                        </el-option>
                    </el-select>
                    <el-input value-key="label" onClick="this.select()" class="select-name" v-model="newOffer.assurance.name" :maxlength="10" v-if="newOffer.assurance._is && !newOffer.money._is" label="Nom" placeholder="Nom de l'assureur ou du courtier"></el-input>
                    <el-input class="select-name" onClick="this.select()" v-model="newOffer.agence" :maxlength="15" v-if="newOffer.money._is" type="text" placeholder="Nom de l'agence"></el-input>
                </div>
                <el-tabs type="card" v-model="offerDialog.pane" ref="tabs" @tab-remove="handleTabsRemove">
                    <el-tab-pane name="1" v-if="newOffer.money._is">
                        <span slot="label">Crédit</span>

                        <el-row :gutter="120">
                            <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">
                                <div class="label-input">
                                    <label class="label">Montant emprunté</label>
                                    <el-button v-tooltip="'Somme que la banque est disposée à vous prêter'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.montantEmprunte" type="text">

                                        <template slot="append">€</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Taux du crédit</label>
                                    <el-button v-tooltip="'Coût du crédit ou valeur (en %) des intérêts qui devront être payés.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.tauxCredit" type="text">
                                        <template slot="append">%</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Durée</label>
                                    <el-button v-tooltip="'Durée pendant laquelle le crédit doit être remboursé'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.duree" type="text">
                                        <template slot="append">mois</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Mensualités du crédit</label>
                                    <el-button v-tooltip="'Somme à payer tous les mois au titre du remboursement du crédit'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.mensualiteMois" type="text">
                                        <template slot="append">€/mois</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Coût des intérêts</label>
                                    <el-button v-tooltip="'Somme totale des intérêts à payer.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.coutInteret" type="text">
                                        <template slot="append">€</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Frais de dossiers</label>
                                    <el-button v-tooltip="'Somme forfaitaire facturée par la banque ou le courtier pour l’étude du dossier'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.fraisDossier" type="text">
                                        <template slot="append">€</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Type de garantie</label>
                                    <el-button v-tooltip="'Somme payée par l’emprunteur entre le moment où la banque débloque les fonds et celui où a lieu le remboursement de la première mensualité'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.typeGarantie">
                                        <el-option label="Hypothèque" value="Hypothèque">Hypothèque</el-option>
                                        <el-option label="Privilège du prêteur" value="Privilège du prêteur">Privilège du prêteur</el-option>
                                        <el-option label="Caution mutuelle" value="Caution mutuelle">Caution mutuelle</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Coût de la garantie</label>
                                    <el-button v-tooltip="'Assurance souscrite par l’emprunteur pour certifier au prêteur que le crédit sera bien remboursé'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.coutGarantie" type="text">
                                        <template slot="append">€</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Montant à rembourser</label>
                                    <el-button v-tooltip="'Somme payée par l’emprunteur pour la souscription d’une garantie de crédit'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.money.montantRembourse" type="text">
                                        <template slot="append">€</template>
                                    </el-input>
                                </div>
                            </el-col>

                            <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">
                                <div class="label-input">
                                    <label class="label">Frais intercalaires</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.fraisIntercalaire">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Frais des intermédiaires</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.fraisIntermediaire">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Frais d'examens de contrat</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.fraisExamenContrat">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Mode d’amortissement</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.modeAmortisement">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Transférabilité du prêt</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.transfertPret">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Remboursement anticipé</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.remboursementAnticipe">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Modularité du prêt</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.modularitePret">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Différé de remboursement</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.differeRemboursement">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Report de mensualités</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.money.reportMensualite">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row type="flex">
                            <el-col :span="10" style="margin: 3rem auto 2rem; text-align: center; ">
                                <span class="add-assurance" @click="newOffer.assurance._is = true; offerDialog.pane = '2'">+ Ajouter une offre d'assurance ?</span>
                            </el-col>
                        </el-row>

                        <el-row type="flex">
                            <el-col :span="10" style="margin: 0 auto;">
                                <el-button class="custom-btn" @click="addOffer()">Enregistrer l'offre</el-button>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                    <el-tab-pane name="2" v-if="newOffer.assurance._is" :closable="newOffer.money._is">
                        <span slot="label">Assurance</span>

                        <el-row :gutter="64">
                            <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 11}" :xl="{ offset: 0, span: 11}">
                                <div class="label-input">
                                    <label class="label">Taux de couverture</label>
                                    <el-button v-tooltip="'Ou quotité d’assurance, correspond à la répartition de la couverture proposée par l’assureur entre les emprunteurs.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.assurance.tauxCouverture" type="text">
                                        <template slot="append">%</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Couvertures et risques exclus</label>
                                    <el-button v-tooltip="'Risques n’étant pas couverts par l’assurance-emprunteur.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.assurance.couvertureRisqueExclus">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Mode d’exécution des garanties</label>
                                    <el-button v-tooltip="'Procédure administrative à respecter afin d’obtenir le déclenchement de l’assurance-emprunteur.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.assurance.modeExecutionGarantie">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>

                                <div class="label-input">
                                    <label class="label">Délais de carence et franchise</label>
                                    <el-button v-tooltip="'Période pendant laquelle un sinistre relevant de la garantie de l’assurance-emprunteur ne sera pas pris en charge.'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.assurance.delaisCaranceFranchise">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>
                            </el-col>

                            <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 23}" :lg="{ offset: 0, span: 11}" :xl="{ offset: 0, span: 11}">
                                <div class="label-input">
                                    <label class="label">Taux de l’assurance</label>
                                    <el-button v-tooltip="'Coût de l’assurance emprunteur, aussi appelé TAEA pour « taux annuel effectif d’assurance »'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.assurance.tauxAssurance" type="text">
                                        <template slot="append">%</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Mensualité de l’assurance</label>
                                    <el-button v-tooltip="'Somme à payer tous les mois au titre du paiement de la cotisation de l’assurance-emprunteur'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.assurance.mensualiteAssurance" type="text" style="">
                                        <template slot="append">€ / mois</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Coût de l’assurance</label>
                                    <el-button v-tooltip="'Somme totale à payer au titre des cotisations de l’assurance emprunteur'" class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-input onkeypress="return event.charCode >= 48 && event.charCode <= 57" onClick="this.select()" v-model="newOffer.assurance.coutAssurance" type="text">
                                        <template slot="append">€</template>
                                    </el-input>
                                </div>

                                <div class="label-input">
                                    <label class="label">Expiration des garanties</label>
                                    <el-button class="help new-offer" @click="onboardDialog = true">?</el-button>
                                    <el-select v-model="newOffer.assurance.dateMotifExpirationGarantie">
                                        <el-option label="Oui" :value="true">Oui</el-option>
                                        <el-option label="Non" :value="false">Non</el-option>
                                    </el-select>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row type="flex">
                            <el-col :span="10" style="margin: 2rem auto;">
                                <el-button class="custom-btn" @click="addOffer()">Enregistrer l'offre</el-button>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-dialog>

        <el-row class="credit-container">
            <el-tabs type="card" value="1" :stretch="isMobile()">
                <el-tab-pane name="1">
                    <span slot="label">Simulateurs</span>
                    <div class="simulation-container">
                        <div class="simulation-tile calculation" @click="openMonthlyCalculationDialog">
                            <div class="tile-text">
                                <div class="simulation-name">Calcul des mensualités</div>
                                <div v-if="paymentSimulations.filter(elem => !elem.created).length < 2" class="accent-text">{{ paymentSimulations.filter(elem => !elem.created).length }} simulation enregistrée</div>
                                <div v-else class="accent-text">{{ paymentSimulations.filter(elem => !elem.created).length }} simulations enregistrées</div>
                            </div>
                        </div>

                        <div class="simulation-tile loan" @click="openLoanCapacityDialog">
                            <div class="tile-text">
                                <div class="simulation-name">Capacité d’emprunt</div>
                                <div v-if="loanCapacitySimulations.filter(elem => !elem.created).length < 2" class="accent-text">{{ loanCapacitySimulations.filter(elem => !elem.created).length }} simulation enregistrée</div>
                                <div v-else class="accent-text">{{ loanCapacitySimulations.filter(elem => !elem.created).length }} simulations enregistrées</div>
                            </div>
                        </div>

                        <div class="simulation-tile bientot">
                            <div class="tile-text">
                                <div class="simulation-name">Bientôt d'autres simulateurs</div>
                                <!-- <div v-if="loanCapacitySimulations.filter(elem => !elem.created).length < 2" class="accent-text">{{ loanCapacitySimulations.filter(elem => !elem.created).length }} simulation enregistrée</div>
                                <div v-else class="accent-text">{{ loanCapacitySimulations.filter(elem => !elem.created).length }} simulations enregistrées</div> -->
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <el-tab-pane name="2">
                    <span slot="label">Offres de crédit</span>
                    <div class="credit-tables" id="hover-table">
                        <table class="credit-table-item labels">
                            <thead>
                                <tr><th @click="showAddDialog('credit')" class="credit-table-add"><i class="budicon budicon-plus-ui"></i>
                                    Ajouter une offre</th></tr>
                                </thead>
                                <tbody style="width: 320px;">
                                    <tr>
                                        <td>Montant emprunté</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme que la banque est disposée à vous prêter'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Taux du crédit</td>
                                        <td class="help-row"><el-button v-tooltip="'Coût du crédit ou valeur (en %) des intérêts qui devront être payés.'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Durée</td>
                                        <td class="help-row"><el-button v-tooltip="'Durée pendant laquelle le crédit doit être remboursé'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Mensualités du crédit</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme à payer tous les mois au titre du remboursement du crédit'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Coût des intérêts</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme totale des intérêts à payer.'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Frais de dossier</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme forfaitaire facturée par la banque ou le courtier pour l’étude du dossier'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Intérêts intercalaires</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme payée par l’emprunteur entre le moment où la banque débloque les fonds et celui où a lieu le remboursement de la première mensualité'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Type de garantie</td>
                                        <td class="help-row"><el-button v-tooltip="'Assurance souscrite par l’emprunteur pour certifier au prêteur que le crédit sera bien remboursé'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr>
                                        <td>Coût de la garantie</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme payée par l’emprunteur pour la souscription d’une garantie de crédit'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="credit-offer-container">
                                <table v-for="(offer, index) in offers" v-if="offer.money._is && offer.bank" :key="offer._id" :class="'credit-table-item infos ' + offer.bank.name">
                                    <thead>
                                        <tr @click="editOffer(offer, $event)">
                                            <th class="credit-table--banque">
                                                <el-popover id="offer" placement="top" trigger="click" v-model="offer._showDelCred">
                                                    <el-row type="flex" justify="center">
                                                        <span class="remove-title">Êtes-vous sûr ?</span>
                                                    </el-row>
                                                    <el-row type="flex" justify="center">
                                                        <el-button type="secondary" size="mini" style="button-remove" @click="offer._showDelCred = false">Annuler</el-button>
                                                        <el-button type="danger" size="mini" class="button-remove" @click="removeOffer(offer._id, index, 'credit')">Supprimer</el-button>
                                                    </el-row>
                                                    <div slot="reference" id="offer" class="credit-table--banque-delete" @click="offer._showDelCred = true;">
                                                        <i id="offer" class="el-icon-close"></i>
                                                    </div>
                                                </el-popover>
                                                <span class="credit-table--banque-logo">
                                                    <img :src="offer.bank.img">
                                                </span>
                                                <div class="credit-table--banque-info">
                                                    <span v-if="offer.bank.label" class="credit-table--banque-name">{{ offer.bank.label }}</span>
                                                    <span class="credit-table--banque-agence" :id="'offer' + index">{{offer.agence || "Nom de l'agence"}}</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr><td>{{ offer.money.montantEmprunte }} €</td></tr>
                                        <tr><td>{{ offer.money.tauxCredit }} %</td></tr>
                                        <tr><td>{{ offer.money.duree }} mois</td></tr>
                                        <tr><td>{{ offer.money.mensualiteMois }} €</td></tr>
                                        <tr><td>{{ offer.money.coutInteret }} €</td></tr>
                                        <tr><td>{{ offer.money.fraisDossier }} €</td></tr>
                                        <tr><td>{{ booleanToString(offer.money.fraisIntercalaire) }}</td></tr>
                                        <tr><td>{{ offer.money.typeGarantie }}</td></tr>
                                        <tr><td>{{ offer.money.coutGarantie }} €</td></tr>
                                    </tbody>
                                </table>

                                <table class="credit-table-item infos new">
                                    <thead>
                                        <tr>
                                            <th class="credit-table--banque">
                                                <span class="credit-table--banque-logo">
                                                    <img src="https://particuliers.secure.lcl.fr/v_1.0/img/icon175x175.png">
                                                </span>
                                                <div class="credit-table--banque-info">
                                                    <span class="credit-table--banque-name">Banque XYZ</span>
                                                    <span class="credit-table--banque-agence">Agence ABC - Paris</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr><td>230 000 €</td></tr>
                                        <tr><td>2,35 %</td></tr>
                                        <tr><td>203 mois</td></tr>
                                        <tr><td>1010,20 €</td></tr>
                                        <tr><td>33 000 €</td></tr>
                                        <tr><td>800 €</td></tr>
                                        <tr><td>Caution mutuelle</td></tr>
                                        <tr><td>1092,53 €</td></tr>
                                        <tr><td>49 334 €</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane name="3">
                        <span slot="label">Assurance-emprunteur</span>
                        <div class="credit-tables">
                            <table class="credit-table-item labels">
                                <thead>
                                    <tr><th @click="showAddDialog('assurance')" class="credit-table-add"><i class="budicon budicon-plus-ui"></i>Ajouter une offre d’assurance emprunteur</th></tr>
                                </thead>
                                <tbody style="width: 320px;">
                                    <tr>
                                        <td style="text-align: left;">Taux de couverture</td>
                                        <td class="help-row"><el-button v-tooltip="'Ou quotité d’assurance, correspond à la répartition de la couverture proposée par l’assureur entre les emprunteurs.'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>

                                    <tr><td>Taux de l’assurance</td>
                                        <td class="help-row"><el-button v-tooltip="'Coût de l’assurance emprunteur, aussi appelé TAEA pour « taux annuel effectif d’assurance »'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                    <tr><td>Mensualités de l’assurance</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme à payer tous les mois au titre du paiement de la cotisation de l’assurance-emprunteur'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                    <tr><td>Coût de l’assurance</td>
                                        <td class="help-row"><el-button v-tooltip="'Somme totale à payer au titre des cotisations de l’assurance emprunteur'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                    <tr><td>Couvertures et risques exclus</td>
                                        <td class="help-row"><el-button v-tooltip="'Risques n’étant pas couverts par l’assurance-emprunteur'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                    <tr><td>Mode d’exécution des garanties</td>
                                        <td class="help-row"><el-button v-tooltip="'Procédure administrative à respecter afin d’obtenir le déclenchement de l’assurance-emprunteur'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                    <tr><td>Délais de carence et franchise</td>
                                        <td class="help-row"><el-button v-tooltip="'Période pendant laquelle un sinistre relevant de la garantie de l’assurance-emprunteur ne sera pas pris en charge'" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                    <tr><td>Expiration des garanties</td>
                                        <td class="help-row"><el-button v-tooltip="''" class="help" @click="onboardDialog = true">?</el-button></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="credit-offer-container">
                                <table v-for="(offer, index) in offers" v-if="offer.assurance._is" :key="offer._id" :class="'credit-table-item infos '">
                                    <thead>
                                        <tr @click="editOfferInsurance(offer, $event)">
                                            <th class="credit-table--banque">
                                                <el-popover id="offer" placement="top" trigger="click" v-model="offer._showDelIns">
                                                    <el-row type="flex" justify="center">
                                                        <span class="remove-title">Êtes-vous sûr ?</span>
                                                    </el-row>
                                                    <el-row type="flex" justify="center">
                                                        <el-button type="secondary" size="mini" @click="offer._showDelIns = false">Annuler</el-button>
                                                        <el-button type="danger" size="mini" @click="removeOffer(offer._id, index, 'assurance')">Supprimer</el-button>
                                                    </el-row>
                                                    <div slot="reference" id="offer" class="credit-table--banque-delete" @click="offer._showDelIns = true;">
                                                        <i id="offer" class="el-icon-close"></i>
                                                    </div>
                                                </el-popover>

                                                <span class="credit-table--banque-logo">
                                                    <img v-if="offer.bank" :src="offer.bank.img">
                                                </span>
                                                <div class="credit-table--banque-info">
                                                    <span v-if="offer.bank" class="credit-table--banque-name">{{ offer.bank.label }}</span>
                                                    <span v-if="offer.assurance.name" class="credit-table--banque-name">{{ offer.assurance.name }}</span>
                                                    <span class="credit-table--banque-agence" :id="'offer' + index">{{offer.agence || "Nom de l'agence"}}</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>{{ offer.assurance.tauxCouverture }} %</td></tr>
                                        <tr><td>{{ offer.assurance.tauxAssurance }} %</td></tr>
                                        <tr><td>{{ offer.assurance.mensualiteAssurance }} €</td></tr>
                                        <tr><td>{{ offer.assurance.coutAssurance }} €</td></tr>
                                        <tr><td>{{ booleanToString(offer.assurance.couvertureRisqueExclus) }}</td></tr>
                                        <tr><td>{{ booleanToString(offer.assurance.modeExecutionGarantie) }}</td></tr>
                                        <tr><td>{{ booleanToString(offer.assurance.delaisCaranceFranchise) }}</td></tr>
                                        <tr><td>{{ booleanToString(offer.assurance.dateMotifExpirationGarantie) }}</td></tr>
                                    </tbody>
                                </table>

                                <table class="credit-table-item infos new">
                                    <thead>
                                        <tr>
                                            <th class="credit-table--banque">
                                                <span class="credit-table--banque-logo">
                                                    <img src="https://particuliers.secure.lcl.fr/v_1.0/img/icon175x175.png">
                                                </span>
                                                <div class="credit-table--banque-info">
                                                    <span class="credit-table--banque-name">Banque XYZ</span>
                                                    <span class="credit-table--banque-agence">Agence ABC - Paris</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr><td>0.37 %</td></tr>
                                        <tr><td>0,35 %</td></tr>
                                        <tr><td>82,33 €</td></tr>
                                        <tr><td>1 840 €</td></tr>
                                        <tr><td>Oui</td></tr>
                                        <tr><td>Non</td></tr>
                                        <tr><td>Oui</td></tr>
                                        <tr><td>Oui</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="4">
                        <span slot="label">Dossier Financier</span>
                        <finance-files />
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </div>
    </template>

    <script>
    import EditCredit from '../../Components/Credit/EditCredit.vue'
    import EditInsurance from '../../Components/Credit/EditInsurance.vue'
    import MonthlyCalculation from '../../Components/Credit/MonthlyCalculation.vue'
    import LoanCapacity from '../../Components/Credit/LoanCapacity.vue'
    import FinanceFiles from '../../Components/Credit/FinanceFiles.vue'
    export default {
        name: 'Credit',
        components : {
            'edit-credit': EditCredit,
            'edit-insurance': EditInsurance,
            'monthly-calculation': MonthlyCalculation,
            'finance-files': FinanceFiles,
            'loan-capacity': LoanCapacity
        },
        data() {
            return {
                offerDialog: {
                    show: false,
                    pane: '1'
                },
                loading: true,
                monthlyCalculationDialog: false,
                loanCapacityDialog: false,
                offers: [],
                paymentSimulations: [],
                loanCapacitySimulations: [],
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
                newOffer: {
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
                    assurance: {
                        _is: false,
                        name: "",
                        tauxCouverture: 0,
                        tauxAssurance: 0,
                        mensualiteAssurance: 0,
                        coutAssurance: 0,
                        couvertureRisqueExclus: false,
                        modeExecutionGarantie: false,
                        delaisCaranceFranchise: false,
                        dateMotifExpirationGarantie: false
                    }
                },
                offerEdit: {},
                showEditCredit: false,
                showEditInsurance: false,
            }
        },
        created() {
            this.$http.get(this.$root.URL + '/credit/get').then(res => {
                this.offers = res.data.offers;
                this.offers.forEach(offer => {
                    if (!offer.bank) return;
                    if (!offer.bank.name) offer.bank.name = "";
                });
            }, err => {});
            this.$http.get(this.$root.URL + '/credit/payment-simulation').then(res => {
                if (res.data.simulations.length > 0) {
                    let tmpSimulations = res.data.simulations;
                    for (x = 0; x < tmpSimulations.length; x++) {
                        tmpSimulations[x].created = false;
                        tmpSimulations[x].loanAmount = tmpSimulations[x].loanAmount.formatMoney(0);
                        tmpSimulations[x].id = (x + 1).toString();
                    }
                    this.paymentSimulations = tmpSimulations;
                } else {
                    this.paymentSimulations = [{
                        created: true,
                        id: '1',
                        loanAmount: "0",
                        loanDuration: "0",
                        interestRate: "0",
                        insuranceRate: "0"
                    }];

                }
                this.loading = false;

            }, err => {});
            this.$http.get(this.$root.URL + '/credit/loan-capacity').then(res => {
                if (res.data.simulations.length > 0) {
                    let tmpSimulations = res.data.simulations;
                    for (x = 0; x < tmpSimulations.length; x++) {
                        tmpSimulations[x].created = false;
                        tmpSimulations[x].monthlyAmount = tmpSimulations[x].monthlyAmount.formatMoney(0);
                        tmpSimulations[x].id = (x + 1).toString();
                    }
                    this.loanCapacitySimulations = tmpSimulations;
                } else {
                    this.loanCapacitySimulations = [{
                        created: true,
                        id: '1',
                        monthlyAmount: "0",
                        loanDuration: "0",
                        interestRate: "0",
                        insuranceRate: "0"
                    }];
                }
                this.loading = false;
            }, err => {});
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
            getName(index) {
                var $modifiedContent = this.$el.querySelector('#offer' + index);
                this.offers[index].agence = $modifiedContent.textContent.replace('\n', '');
                this.$http.post(this.$root.URL + '/credit/edit-key-value', { id: this.offers[index]._id, key: 'agence', value: $modifiedContent.textContent.replace('\n', '')}).then(res => {
                }, err => {});
            },
            onPaymentSimulationsChange(simulations) {
                this.paymentSimulations = simulations;
            },
            onLoanCapacitySimulationsChange(simulations) {
                this.loanCapacitySimulations = simulations;
            },
            addOffer() {
                // if (!this.newOffer.bank.name) {
                //     this.$message.error('Vous devez sélectionner une banque');
                //     return;
                // }
                this.$http.post(this.$root.URL + '/credit/add-offer', { offer: this.newOffer }).then(res => {
                    this.newOffer._id = res.data.id;
                    this.offers.push(this.newOffer);
                    this.resetNewOffer();
                    this.offerDialog.show = false;
                }, err => {});
            },
            removeOffer(id, index, type) {
                if (type == 'credit') this.offers[index].money._is = false
                else if (type == 'assurance') this.offers[index].assurance._is = false
                if (this.offers[index].money._is == false && this.offers[index].assurance._is == false) {
                    this.$http.post(this.$root.URL + '/credit/remove-offer', { id: id }).then(res => {
                        this.offers.splice(index, 1);
                        this.$message.success('Votre offre à bien été supprimée');
                    }, err => {});
                } else {
                    this.$http.post(this.$root.URL + '/credit/edit-offer', { offer: this.offers[index] }).then(res => {
                        // this.$message.success('Votre offre à bien été supprimé');
                    }, err => {});
                }
            },
            editOfferInsurance(offer, event) {
                if (event.target.id == 'offer' || event.target.id.startsWith("offer")) return;
                this.offerEdit = offer;
                this.showEditInsurance = true;
            },
            editOffer(offer, event) {
                if (event.target.id == 'offer' || event.target.id.startsWith("offer")) return;
                this.offerEdit = offer;
                this.showEditCredit = true;
            },
            handleTabsRemove(targetName) {
                this.offerDialog.pane = '1';
                this.newOffer.assurance._is = false;
            },
            openLoanCapacityDialog() {
                this.loanCapacityDialog = true;
            },
            openMonthlyCalculationDialog() {
                this.monthlyCalculationDialog = true;
            },
            showAddDialog(type) {
                this.newOffer[(type == 'credit' ? 'money' : 'assurance')]._is = true;
                this.offerDialog.pane = (type == 'credit' ? '1' : '2');
                this.offerDialog.show = true;
            },
            resetNewOffer() {
                this.newOffer = {
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
                    assurance: {
                        _is: false,
                        tauxCouverture: 0,
                        tauxAssurance: 0,
                        mensualiteAssurance: 0,
                        coutAssurance: 0,
                        couvertureRisqueExclus: false,
                        modeExecutionGarantie: false,
                        delaisCaranceFranchise: false,
                        dateMotifExpirationGarantie: false
                    }
                };
            },
            booleanToString(value) {
                return value == true ? 'Oui' : 'Non';
            },
            handleCloseEditInsurance() {
                this.showEditInsurance = false;
            },
            handleCloseEditCredit() {
                this.showEditCredit = false;
            },
            closeLoanCapacityDialog() {
                this.loanCapacityDialog = false;
            },
            closeMonthlyCalculationDialog() {
                this.monthlyCalculationDialog = false;
            }
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
