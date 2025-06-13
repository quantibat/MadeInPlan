<template>
    <div>
        <el-dialog class="terrain-container2 add-terrain" custom-class="modal-container" style="padding-top: 0rem; top: 0;background: rgba(255, 255, 255, .99);" :visible.sync="showEdit" :fullscreen="true" :width="(isMobile())?'100vw':'70vw'" @close="resetNewTerrain()">
            <el-row style="margin-top: -2rem;">
                <h1>Editer un terrain</h1>
                <div style="text-align: right; float: right; width: 70%;">
                    <el-input class="select-name" onClick="this.select()" :maxlength="20" type="text" v-model="editTerrain.landlord" placeholder="Nom du propriétaire"></el-input>
                    <el-input class="select-name" onClick="this.select()" :maxlength="20" type="text" v-model="editTerrain.number" placeholder="Numéro de parcelle"></el-input>
                </div>
                <span slot="label">Crédit</span>

                <el-row class="modal-row" :gutter="120">
                    <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 12}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">
                        <div class="label-input">
                            <label class="label">Prix
                            </label>
                            <el-input onClick="this.select()" @change="formatNumbers" onkeypress="return event.charCode >= 48 && event.charCode <= 57" :maxlength="20" v-model="editTerrain.price" type="text">
                                <template slot="append">€</template>
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Frais d'agence
                            </label>
                            <el-input onClick="this.select()" @change="formatNumbers" onkeypress="return event.charCode >= 48 && event.charCode <= 57" :maxlength="20" v-model="editTerrain.fees" type="text">
                                <template slot="append">€</template>
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Surface
                            </label>
                            <el-input onClick="this.select()" @change="formatNumbers" onkeypress="return event.charCode >= 48 && event.charCode <= 57" :maxlength="20" v-model="editTerrain.surface" type="text">
                                <template slot="append">m2</template>
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Localisation
                            </label>
                            <el-input onClick="this.select()"  :maxlength="20" v-model="editTerrain.localisation" type="text">
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Nature du sol</label>
                            <el-select class="base-select" v-model="editTerrain.groundType">
                                <el-option label="Terre" value="Terre">Terre</el-option>
                                <el-option label="Argile" value="Argile">Argile</el-option>
                                <el-option label="Roche" value="Roche">Roche</el-option>
                                <el-option label="Autre" value="Autre">Autre</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Situation</label>
                            <el-select class="base-select" v-model="editTerrain.situation">
                                <el-option label="Lotissement" value="Lotissement">Lotissement</el-option>
                                <el-option label="Isolé" value="Isolé">Isolé</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Viabilisé</label>
                            <el-select class="base-select" v-model="editTerrain.viable">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                    </el-col>
                    <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 12}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">

                        <div class="label-input">
                            <label class="label">Borné</label>
                            <el-select class="base-select" v-model="editTerrain.borne">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Assainissement</label>
                            <el-select class="base-select" v-model="editTerrain.sanitation">
                                <el-option label="Tout à l’égout" value="Tout à l’égout">Tout à l’égout</el-option>
                                <el-option label="Fosse septique" value="Fosse septique">Fosse septique</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Risque inondation</label>
                            <el-select class="base-select" v-model="editTerrain.waterRisk">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Risque sismique</label>
                            <el-select class="base-select" v-model="editTerrain.seismalRisk">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Parking</label>
                            <el-select class="base-select" v-model="editTerrain.parking">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Possibilité Piscine</label>
                            <el-select class="base-select" v-model="editTerrain.pool">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </el-row>
            <el-button class="custom-btn" @click="saveTerrain()">Enregistrer le terrain</el-button>
        </el-dialog>

        <el-dialog class="terrain-container2 add-terrain" custom-class="modal-container" style="padding-top: 0rem; top: 0;background: rgba(255, 255, 255, .99);" :visible.sync="showAdd" :fullscreen="true" :width="(isMobile())?'100vw':'70vw'" @close="resetNewTerrain()">
            <el-row style="margin-top: -2rem;">
                <h1>Nouveau terrain</h1>
                <div style="text-align: right; float: right; width: 70%;">
                    <el-input class="select-name" onClick="this.select()" :maxlength="20" type="text" v-model="newTerrain.landlord" placeholder="Nom du propriétaire"></el-input>
                    <el-input class="select-name" onClick="this.select()" :maxlength="20" type="text" v-model="newTerrain.number" placeholder="Numéro de parcelle"></el-input>
                </div>
                <span slot="label">Crédit</span>

                <el-row class="modal-row" :gutter="120">
                    <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 12}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">
                        <div class="label-input">
                            <label class="label">Prix
                            </label>
                            <el-input onClick="this.select()" @change="formatNumbers" onkeypress="return event.charCode >= 48 && event.charCode <= 57" :maxlength="20" type="text" v-model="newTerrain.price">
                                <template slot="append">€</template>
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Frais d'agence
                            </label>
                            <el-input onClick="this.select()" @change="formatNumbers" onkeypress="return event.charCode >= 48 && event.charCode <= 57" :maxlength="20" v-model="newTerrain.fees" type="text">
                                <template slot="append">€</template>
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Surface
                            </label>
                            <el-input onClick="this.select()" @change="formatNumbers"  onkeypress="return event.charCode >= 48 && event.charCode <= 57" :maxlength="20" v-model="newTerrain.surface" type="text">
                                <template slot="append">m2</template>
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Localisation
                            </label>
                            <el-input onClick="this.select()" :maxlength="20" v-model="newTerrain.localisation" type="text">
                            </el-input>
                        </div>

                        <div class="label-input">
                            <label class="label">Nature du sol</label>
                            <el-select class="base-select" v-model="newTerrain.groundType">
                                <el-option label="Terre" value="Terre">Terre</el-option>
                                <el-option label="Argile" value="Argile">Argile</el-option>
                                <el-option label="Roche" value="Roche">Roche</el-option>
                                <el-option label="Autre" value="Autre">Autre</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Situation</label>
                            <el-select class="base-select" v-model="newTerrain.situation">
                                <el-option label="Lotissement" value="Lotissement">Lotissement</el-option>
                                <el-option label="Isolé" value="Isolé">Isolé</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Viabilisé</label>
                            <el-select class="base-select" v-model="newTerrain.viable">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                    </el-col>
                    <el-col :xs="{offset: 0, span: 23}" :sm="{offset: 0, span: 23}" :md="{ offset: 0, span: 12}" :lg="{ offset: 0, span: 12}" :xl="{ offset: 0, span: 12}">

                        <div class="label-input">
                            <label class="label">Borné</label>
                            <el-select class="base-select" v-model="newTerrain.borne">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Assainissement</label>
                            <el-select class="base-select" v-model="newTerrain.sanitation">
                                <el-option label="Tout à l’égout" value="Tout à l’égout">Tout à l’égout</el-option>
                                <el-option label="Fosse septique" value="Fosse septique">Fosse septique</el-option>
                            </el-select>
                        </div>


                        <div class="base-select label-input">
                            <label class="label">Risque inondation</label>
                            <el-select class="" v-model="newTerrain.waterRisk">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Risque sismique</label>
                            <el-select class="base-select" v-model="newTerrain.seismalRisk">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Parking</label>
                            <el-select class="base-select" v-model="newTerrain.parking">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                        <div class="label-input">
                            <label class="label">Possibilité Piscine</label>
                            <el-select class="base-select" v-model="newTerrain.pool">
                                <el-option label="Oui" value="Oui">Oui</el-option>
                                <el-option label="Non" value="Non">Non</el-option>
                            </el-select>
                        </div>

                    </el-col>
                </el-row>
            </el-row>
            <el-button class="custom-btn" @click="addTerrain()">Enregistrer le terrain</el-button>
        </el-dialog>

        <div class="terrain-tables" id="hover-table">
            <table class="terrain-table-item labels">
                <thead>
                    <tr><th @click="showAddDialog()" class="terrain-table-add"><i class="budicon budicon-plus-ui"></i>
                        Ajouter terrain</th></tr>
                </thead>
                    <tbody style="width: 250px;">
                        <tr>
                            <td>Prix</td>
                            <td class="help-row"><el-button v-tooltip="'Prix d’achat « net vendeur » du terrain'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Frais d’agence</td>
                            <td class="help-row"><el-button v-tooltip="'Frais qui devront être payé à une agence immobilière ou un agent immobilier indépendant'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Surface</td>
                            <td class="help-row"><el-button v-tooltip="'Surface totale du terrain'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Localisation</td>
                            <td class="help-row"><el-button v-tooltip="'Lieu de situation du terrain (Commune)'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Nature du sol</td>
                            <td class="help-row"><el-button v-tooltip="'Le terrain est-il composé de terre, d’argile, de roche… ?'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Situation</td>
                            <td class="help-row"><el-button v-tooltip="'Le terrain est-il en lotissement, ou est-il isolé (hors lotissement) ?'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Viabilisé</td>
                            <td class="help-row"><el-button v-tooltip="'Le terrain a-t-il fait l’objet des aménagements nécessaires à la construction tels que les raccordements aux réseaux... ?'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Assainissement</td>
                            <td class="help-row"><el-button v-tooltip="'Le terrain est-il raccordé au tout-à-l’égout où doit-il être équipé d’un assainissement autonome en raison de son isolement ?'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Risque inondation</td>
                            <td class="help-row"><el-button v-tooltip="'Qu’indiquent les documents d’urbanisme ? Le Plan de prévention des risques inondation (PPRi) notamment ? Rendez-vous sur géorisques.gouv.fr pour en savoir plus !'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>
                        <tr>
                            <td>Risque sismique</td>
                            <td class="help-row"><el-button v-tooltip="'Qu’indiquent les documents d’urbanisme ? Rendez-vous sur géorisques.gouv.fr pour en savoir plus !'" class="help" @click="onboardDialog = true">?</el-button></td>
                        </tr>

                        <!-- <tr><td>+ de critères</td></tr> -->
                </tbody>
            </table>
            <div class="terrain-data-container">
                <table v-for="(terrain, index) in terrains" :key="terrain._id" :class="'terrain-table-item infos '">
                    <thead>
                        <tr @click="viewEditTerrain(terrain, $event)">
                            <th class="terrain-table--banque">
                                <div class="terrain-table--banque-info">
                                    <span class="">{{terrain.localisation}}</span>
                                    <span class="terrain-table--banque-agence">{{terrain.landlord}}</span>
                                    <span class="terrain-table--banque-agence">{{terrain.number}}</span>
                                </div>
                                <el-popover id="offer" placement="top" trigger="click" v-model="terrain._showDelCred">
                                    <el-row type="flex" justify="center">
                                        <span class="remove-title">Êtes-vous sûr ?</span>
                                    </el-row>
                                    <el-row type="flex" justify="center">
                                        <el-button type="secondary" size="mini" style="button-remove" @click="terrain._showDelCred = false">Annuler</el-button>
                                        <el-button type="danger" size="mini" class="button-remove" @click="removeTerrain(terrain._id, index, 'terrain')">Supprimer</el-button>
                                    </el-row>
                                    <div slot="reference" id="offer" class="terrain-table--banque-delete" @click="terrain._showDelCred = true;">
                                        <i id="offer" class="el-icon-close"></i>
                                    </div>
                                </el-popover>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>{{ parseInt(terrain.price.replace(/ /g, '')).formatMoney(0) }} €</td></tr>
                        <tr><td>{{ parseInt(terrain.fees.replace(/ /g, '')).formatMoney(0) }} €</td></tr>
                        <tr><td>{{ parseInt(terrain.surface.replace(/ /g, '')).formatMoney(0) }} m2</td></tr>
                        <tr><td>{{ terrain.localisation }} </td></tr>
                        <tr><td>{{ terrain.groundType }} </td></tr>
                        <tr><td>{{ terrain.situation }} </td></tr>
                        <tr><td>{{ terrain.viable }}</td></tr>
                        <tr><td>{{ terrain.sanitation }}</td></tr>
                        <tr><td>{{ terrain.waterRisk }} </td></tr>
                        <tr><td>{{ terrain.seismalRisk }} </td></tr>
                        <!-- <tr><td>{{ offer.money.montantRembourse }} €</td></tr> -->
                    </tbody>
                </table>
                <table class="terrain-table-item infos new">
                    <thead>
                        <tr>
                            <th class="terrain-table--banque">
                                <div class="terrain-table--banque-info">
                                    <span class="terrain-table--banque-name">Pignan</span>
                                    <span class="terrain-table--banque-agence">Przybyla</span>
                                    <span class="terrain-table--banque-agence">260</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td> 250 000 €</td></tr>
                        <tr><td> 60 €</td></tr>
                        <tr><td> 200 m2</td></tr>
                        <tr><td> Pignan </td></tr>
                        <tr><td>Terre</td></tr>
                        <tr><td>Isolé</td></tr>
                        <tr><td>Oui</td></tr>
                        <tr><td> Fosse septique</td></tr>
                        <tr><td>Non</td></tr>
                        <tr><td>Non</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'CompareTerrain',
    components : {
    },
    data() {
        return {
            loading: true,
            terrains: [],
            newTerrain: {
                price: "",
                fees: "",
                surface: "",
                localisation: "",
                groundType: "Terre",
                situation: "Lotissement",
                viable: "Non",
                sanitation: "Tout à l’égout",
                waterRisk: "Non",
                seismalRisk: "Non",
                pool: "Non",
                borne: "Non",
                parking: "Non",
                comments: ""
            },
            showAdd: false,
            showEdit: false,
            editTerrain: {},
        }
    },
    created() {
        this.$http.get(this.$root.URL + '/terrain/get').then(res => {
            this.terrains = res.data.terrains;
        }, err => {});
    },
    methods: {
        formatNumbers(number) {
            this.newTerrain.price = Number(this.newTerrain.price.split(' ').join('')).formatMoney(0)
            this.newTerrain.fees = Number(this.newTerrain.fees.split(' ').join('')).formatMoney(0)
            this.newTerrain.surface = Number(this.newTerrain.surface.split(' ').join('')).formatMoney(0)
            if (this.editTerrain.price) this.editTerrain.price = Number(this.editTerrain.price.split(' ').join('')).formatMoney(0)
            if (this.editTerrain.fees) this.editTerrain.fees = Number(this.editTerrain.fees.split(' ').join('')).formatMoney(0)
            if (this.editTerrain.surface) this.editTerrain.surface = Number(this.editTerrain.surface.split(' ').join('')).formatMoney(0)
            return number
        },
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
            this.$http.post(this.$root.URL + '/terrain/edit-key-value', { id: this.offers[index]._id, key: 'agence', value: $modifiedContent.textContent.replace('\n', '')}).then(res => {
            }, err => {});
        },
        onPaymentSimulationsChange(simulations) {
            this.paymentSimulations = simulations;
        },
        onLoanCapacitySimulationsChange(simulations) {
            this.loanCapacitySimulations = simulations;
        },
        addTerrain() {
            if (this.newTerrain.localisation === "")
                return this.$message.error("Merci de remplir la localisation");
            this.$http.post(this.$root.URL + '/terrain/add-terrain', { terrain: this.newTerrain }).then(res => {
                this.newTerrain._id = res.data.id;
                this.$message.success("Votre terrain a bien été ajouté")
                this.terrains.push(this.newTerrain);
                this.showAdd = false;
                this.resetNewTerrain();
            }, err => {});
        },
        removeTerrain(id, index, type) {
            this.$http.post(this.$root.URL + '/terrain/remove-terrain', { id: id }).then(res => {
                this.terrains.splice(index, 1);
            }, err => {});
        },
        viewEditTerrain(offer, event) {
            if (event.target.id == 'offer' || event.target.id.startsWith("offer")) return;
            this.editTerrain = offer;
            this.showEdit = true;
        },
        showAddDialog() {
            this.showAdd = true;
        },
        saveTerrain() {
            this.$http.post(this.$root.URL + '/terrain/edit-terrain', { terrain: this.editTerrain }).then(res => {
                this.newTerrain._id = res.data.id;
                this.$message.success("Votre terrain a bien été modifié");
                this.showEdit = false;
                this.resetNewTerrain();
            }, err => {});
        },
        resetNewTerrain() {
            this.newTerrain = {
                price: "",
                fees: "",
                surface: "",
                localisation: "",
                groundType: "",
                situation: "",
                viable: "",
                sanitation: "",
                waterRisk: "",
                seismalRisk: "",
                pool: "",
                borne: "",
                parking: "",
                comments: ""
            };
        },
        booleanToString(value) {
            return value == true ? 'Oui' : 'Non';
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
.select-name { width: 18rem !important; z-index: 10; }
.option-bank { height: 50px; }
table { color: rgba(35, 49, 88, 1); border-collapse: collapse; margin-top: 1rem; margin-left: .2rem; margin-bottom: .2rem; box-sizing: border-box; }
tbody { box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 ); border-radius: 4px; display: flex; flex-direction: column; align-items: center; align-content: center; }
.terrain-data-container {
    display: inline-flex;
    overflow-x: auto;
    overflow-y: hidden;
}
.modal-row { margin-top: 150px }
.terrain-table-item.infos tbody tr {
    width: 100%;
    margin: 0 auto;
    display: flex;
    border-bottom: 1px solid rgba(255, 255, 255, .08 );
    box-sizing: border-box;
}
.terrain-table-item.infos tbody td {
    text-align: center !important;
    width: 100%;
}
.terrain-table-item.infos tbody tr:hover {
    background: rgba(255, 255, 255, .1);
}
        .terrain-table-item.infos {
            min-width: 250px;
            flex: 1 0 22%;
        }
td {
    padding: .7rem 1.2rem;
    font-size: .9rem;
    width: 100%;
    text-align: left;
    position: relative;
}
.terrain-tables {
    display: flex;
}
.terrain-table-item {
    margin-right: 1rem;
    position: relative;
}
.terrain-table-item:last-of-type {
    margin-right: none;
}
.terrain-table--banque.off {
    visibility: hidden;
}
.terrain-table-add {
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
.terrain-table-add i {
    font-size: 1.5rem;
}
.terrain-table--banque {
    cursor: pointer;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 );
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: .5rem;
    height: 80px;
    box-sizing: border-box;
}
.terrain-table--banque-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.terrain-table--banque-agence {
    text-align: center;
    font-weight: 300;
    font-size: .8rem;
}
.terrain-table-item.labels tr {
    font-weight: 500;
    color: rgba(35, 49, 88, .95 );
    align-self: stretch;
    border-bottom: 1px solid rgba(35, 49, 88, .08 );
}
.terrain-table-item.labels thead tr:first-of-type {
    border-bottom: none;
}
.terrain-table-item.new::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, .95);
    width: 100%;
    height: 99%;
    border-radius: 4px;
    top: 0;
    left: 0;
    border: 2px dashed #31bcfc4e;
    transition: all .2s ease-in-out;
}

.terrain-table-item.new .new-offer i {
    font-size: 2rem;
}
.terrain-table-item.new .new-offer {
    position: absolute;
    text-align: center;
    top: 45%;
    left: 25%;
    z-index: 25;
    box-sizing: border-box;
    color: #31bcfc;
    font-size: 1rem;
    font-weight: 300;
    cursor: pointer;
}
.terrain-table-item.new:hover::after{
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
    margin-left: 1.4rem;
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1 );
    position: relative;
    padding: 1.8rem 0;
    color: #38436A;
    display: flex;
    flex-direction: column;
    width: 300px;
    box-sizing: border-box;
    margin-right: 1.4rem;
    margin-bottom: 1.4rem;
    border-radius: 5px;
    cursor: pointer;
    transition: .2s linear all;
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
.el-tabs__nav {
    float: right !important;
}
.terrain-container {
    margin-top: -4rem;
}
.terrain-table--banque .terrain-table--banque-delete {
    display: none;
}
.terrain-table--banque:hover .terrain-table--banque-delete {
    display: block;
    position: absolute;
    right: .4rem;
    top: .12rem;
    color: rgba(35, 49, 88, .6);
}
.terrain-table--banque .terrain-table--banque-delete:hover {
    cursor: pointer;
    color: #ed5f59;
}
.add-terrain {
    margin: auto;
}
.add-terrain h1 {
    margin-bottom: 2rem;
}
.label { width: 60%; text-transform: uppercase; margin-bottom: -15px; text-align: left; color: #2B396A; opacity: 0.5; letter-spacing: 1px; font-weight: 400; font-size: 14  px; }
.el-input { border-radius: 4px; margin-bottom: 11px; font-size: 18px; color: #2B396A; width: 50%; clear: both; }
.el-input:focus { box-shadow: 0 0 6px rgba(0, 0, 0, .16); }
.el-select { border-radius: 4px; margin-bottom: 11px; font-size: 18px; color: #2B396A;  clear: both; width: 50%;  margin-left: auto;}
.el-select:focus { box-shadow: 0 0 6px rgba(0, 0, 0, .16); }
.el-button.custom-btn { position: absolute; bottom: 0; margin-bottom: 150px; border: none;font-size: 21px; padding: 1rem 0; font-weight: 400; color: #FFFFFF; border-radius: 4px; background: linear-gradient(5deg,#31bdfc,#00d3f7); text-align: center; width: 100%; }
.el-button:hover { opacity: 0.8; }
.el-dialog__header {padding: 0;}
.add-assurance { color: #31BDFC; font-size: 1rem; }
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
    z-index: 30;
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

</style>
