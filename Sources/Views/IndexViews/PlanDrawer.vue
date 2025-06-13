<template>
    <div class="main-container" v-if="plan != null && plan.calculate != null">
        <main-display v-if="showCalculate" :show="showCalculate" :close="handleCloseDevis" :obj="plan.calculate"></main-display>
        <el-row style="margin-bottom: 2rem;" type="flex" align="bottom" class="header">
            <el-col>
                <h1><i @click="$router.push({ name: 'Plan' })" class="back-page el-icon-back"></i> Mes plans</h1>
            </el-col>
        </el-row>

        <el-row class="summary" type="flex" justify="space-between" :gutter="32">
            <el-col :span="4">
                <div class="plan-summary">
                    <span class="plan-summary-edit" @click="$router.push({ name: 'PlanConfig' })">Modifier</span>
                    <div class="plan-summary-item">
                        <img class="plan-summary-item-icon" :src="'/Assets/Configurator/maison-' + plan.houseShape + '.svg'" alt="">
                        <h5 class="plan-summary-item-label">Forme</h5>
                    </div>
                    <div class="plan-summary-item">
                        <img class="plan-summary-item-icon" src="/Assets/Plans/icon-plan-surface.svg" alt="">
                        <h5 class="plan-summary-item-label">{{ plan.surfaceTotal }} m<sup>2</sup></h5>
                    </div>
                    <div class="plan-summary-item">
                        <img class="plan-summary-item-icon" src="/Assets/Plans/icon-plan-chambre.svg" alt="">
                        <h5 class="plan-summary-item-label">{{ plan.numberOfBedroom }} chambre{{ plan.numberOfBedroom < 2 ? '' : 's'}}</h5>
                    </div>
                    <div class="plan-summary-item">
                        <img class="plan-summary-item-icon" src="/Assets/Plans/icon-plan-pieces-opt.svg" alt="">
                        <h5 class="plan-summary-item-label">{{ getNumberOfOptionalRoom() }} pièce{{ getNumberOfOptionalRoom() < 2 ? '' : 's'}} optionnelle{{ getNumberOfOptionalRoom() < 2 ? '' : 's'}}</h5>
                    </div>
                </div>

                <div class="summary-size-container">
                    <div class="summary-size" v-for="room in sortedRoom">
                        <h5 class="plan-summary-item-label">{{ room.name }}</h5>
                        <div class="room-size-container">
                            <div class="item-size">{{ parseFloat(room.width).toFixed(2) + ' m' }}</div>
                            <div class="item-size">{{ parseFloat(room.height).toFixed(2) + ' m' }}</div>
                            <div class="item-size surface">{{ parseFloat(room.width * room.height).toFixed(2) }} m<sup>2</sup></div>
                        </div>
                    </div>
                </div>
            </el-col>

            <el-col :span="14" class="house">
                <el-row class="plan-toolbar" type="flex" justify="space-between">
                    <el-col :span="9" :class="'plan-toolbar--item ' + (plansID.length > 0 ? '' : 'disabled')" @click.native="reDraw()">
                        <i class="budicon budicon-reload-ui"></i><span class="plan-toolbar--label">Redessiner</span>
                    </el-col>
                    <el-col :span="3" class="plan-toolbar--item">
                        <i class="budicon budicon-like"></i>
                    </el-col>
                    <el-col :span="3" class="plan-toolbar--item">
                        <i class="budicon budicon-dislike"></i>
                    </el-col>
                    <el-col :span="9" class="plan-toolbar--item" @click.native="savePlan()">
                        <i class="budicon budicon-folder-tick"></i><span class="plan-toolbar--label">Sauvegarder</span>
                    </el-col>
                    <!-- <el-col :span="7" class="plan-toolbar--item">
                        <i class="budicon budicon-sending-message"></i><span class="plan-toolbar--label">Partager</span>
                    </el-col> -->
                </el-row>
                <el-row v-if="showPlan" class="drawnPlan">
                    <house-drawer v-if="plan.drawnPlan === false" ref="house" :house="plan.json"></house-drawer>
                    <img class="image-plan" v-else :src="'/upload/drawnPlan/' + plan.planUrl" />
                </el-row>
            </el-col>

            <el-col :span="6" class="container house-desc">
                <div class="plan-chiffrage">
                    <div class="plan-chiffrage-total">
                        <div class="plan-chiffrage-total-label">Prix<br> <span style="text-transform: uppercase; font-size: 1.2rem;">Estimé</span></div>
                        <div class="plan-chiffrage-total-amount">{{ plan.calculate.price.TTC.formatMoney() }} €</div>
                    </div>
                    <div class="plan-chiffrage-postes">
                        <el-collapse>
                            <el-collapse-item name="1">
                                <template slot="title">
                                    <div class="plan-chiffrage-poste go">
                                        <div class="plan-chiffrage-poste-label">Gros œuvre</div>
                                        <div class="plan-chiffrage-poste-amount">{{ getTTC(plan.calculate.T.PHT + plan.calculate.MA.PHT + plan.calculate.CC.PHT).formatMoney() }} €</div>
                                    </div>
                                </template>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Terassement</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.T.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Maçonnerie</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.MA.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Charpente</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.CC.PHT).formatMoney() }} €</div>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item name="2">
                                <template slot="title">
                                    <div class="plan-chiffrage-poste so">
                                        <div class="plan-chiffrage-poste-label">Second œuvre</div>
                                        <div class="plan-chiffrage-poste-amount">{{ getTTC(plan.calculate.ME.PHT + plan.calculate.PI.PHT + plan.calculate.MI.PHT).formatMoney() }} €</div>
                                    </div>
                                </template>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Menuiseries Extérieurs</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.ME.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Isolation</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.PI.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Menuiseries Intérieurs</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.MI.PHT).formatMoney() }} €</div>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item name="3">
                                <template slot="title">
                                    <div class="plan-chiffrage-poste lt">
                                        <div class="plan-chiffrage-poste-label">Lots techniques</div>
                                        <div class="plan-chiffrage-poste-amount">{{ getTTC(plan.calculate.PS.PHT + plan.calculate.CP.PHT + plan.calculate.EL.PHT).formatMoney() }} €</div>
                                    </div>
                                </template>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Plomberie</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.PS.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Chauffage</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.CP.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Electricité</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.EL.PHT).formatMoney() }} €</div>
                                </div>
                            </el-collapse-item>
                            <el-collapse-item name="4">
                                <template slot="title">
                                    <div class="plan-chiffrage-poste finitions">
                                        <div class="plan-chiffrage-poste-label">Finitions</div>
                                        <div class="plan-chiffrage-poste-amount">{{ getTTC(plan.calculate.RC.PHT + plan.calculate.RS.PHT + plan.calculate.PF.PHT).formatMoney() }} €</div>
                                    </div>
                                </template>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Ravalement</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.RC.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Revêtement de sol</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.RS.PHT).formatMoney() }} €</div>
                                </div>
                                <div class="plan-chiffrage-poste-annexe">
                                    <div class="plan-chiffrage-poste-annexe-label">Peinture</div>
                                    <div class="plan-chiffrage-poste-annexe-amount">{{ getTTC(plan.calculate.PF.PHT).formatMoney() }} €</div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                    <div class="plan-chiffrage-detail" @click="showCalculate = true">Détail du chiffrage</div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mixin } from "../../Components/Plan/HouseDrawer/ScalingTools.js"
import { INNER_WALL_WIDTH, OFFSET_X, OFFSET_Y, OUTER_WALL_COLOR, OUTER_WALL_WIDTH, SHIFT, RATIO } from "../../Components/Plan/HouseDrawer/CONST.js";

import HouseDrawer from '../../Components/Plan/HouseDrawer/HouseDrawer.vue'
import MainDisplay from '../../Components/Plan/MainDisplay.vue'
import Summary from '../../Components/Plan/Summary.vue'

export default {
    name: 'Drawer',
    mixins: [mixin],
    components: {
        'house-drawer': HouseDrawer,
        'main-display': MainDisplay,
        'mip-summary': Summary
    },
    data() {
        return {
            plan: null,
            plansID: [],
            showPlan: false,
            showCalculate: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        this.plansID = this.$route.params.ids || [];
        this.$http.get(this.$root.CALC_ADDR + '/plan/' + this.$route.params.id).then(res => {
            this.plan = res.data.plan;
            this.showPlan = true;
        }, err => {});
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        reDraw() {
            if (this.plansID.length > 0) {
                this.showPlan = false;
                var id = this.plansID.shift();
                this.$router.push({ name: 'PlanDrawer', params: { id: id, ids: this.plansID } });
            }
        },
        getIconByRoom(name) {
            const roomArray = ['Salon', 'Hall', 'Cuisine', 'Chambre', 'Salle', 'WC', 'Dressing', 'Placard', 'Cellier', 'Buanderie', 'Dégagement', 'Garage']
            const iconArray = ['sofa', 'plant', 'fridge', 'bed', 'bathup', 'tissue', 'dresser', 'book-cabinet', 'wine-bottle', 'dryer', 'long-desk', 'car-front']
            return 'budicon-' + iconArray[roomArray.findIndex(r => name.search(r) > -1)];
        },
        savePlan() {
            var formData = {
                image: this.$refs.house.$el.children[0].toDataURL('image/png'),
                totalPrice: this.plan.calculate.price.TTC,
                plan: this.plan
            };

            this.$http.post(this.$root.URL + '/plan/add', formData).then(res => {
                this.$message.success('Votre plan a bien été sauvegardé');
            });
        },
        handleCloseDevis() {
            this.showCalculate = false;
        },
        getTTC(ht) {
            return ht + ht * 0.2;
        },
        getNumberOfOptionalRoom() {
            var count = 0;
            for (var p in this.plan.optionalRoom) {
                count += this.plan.optionalRoom[p] == true ? 1 : 0;
            }
            return count;
        }
    }
}
</script>

<style scoped>

@media print {
    .summary {display: none}
}
.item-size {
    font-size: .7rem;
    color: #302D4A;
    opacity: 0.6;
}

.item-size.surface {
    font-weight: 700;
}

.summary-size {
    padding-top: 1rem;
    text-align: center;
}

.summary-size-container {
    margin-top: 2rem;
}

.room-size-container {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 80%;
    margin: auto;
}

/* .house { margin: auto; } */
.budicon { font-size: 24px; margin: 0px 10px; }

.el-button { margin-left: 0 !important; }
.save-button { width: 100%; padding: 1rem; color: white; background-color: #62C047; border: 1px solid #62C047; border-radius: 0px; border-top-left-radius: 5px; border-top-right-radius: 5px; }
.save-button:hover { opacity: 0.8; }
.return-list-button { width: 100%; color: #00BBFF; background-color: white; border: 1px solid #00BBFF; border-radius: 0px; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 1rem; }
.return-list-button:hover {  }
.return-config-button { width: 100%; background-color: #00BBFF; border: 1px solid #00BBFF; border-radius: 0px; padding: 1rem; }
.return-config-button:hover { opacity: 0.8; }

.plan-summary{
    display: flex;
    flex-direction: column;
 }


.plan-summary, .plan-chiffrage, .plan-toolbar, .summary-size-container { box-shadow: 0 0 10px 3px rgba(0, 0, 0, .06); border-radius: 5px; }
.plan-summary-item { display: flex; flex-direction: column; align-items: center; padding: 1.5rem 0; margin: 0 2rem; border-bottom: 1px solid rgba(44, 60, 104, 0.05); }
.plan-summary-item:last-of-type { border-bottom: none; }
.plan-summary-item-icon { width: 1.5rem; }
.plan-summary-item-label { margin: .5rem 0 0; font-weight: 500; color: rgba(44, 60, 104, 7); }

.plan-summary-edit {
    margin-left: auto;
    margin-right: 1rem;
    margin-top: 1rem;
    font-size: .8rem;
    color: #00BBFF;
    cursor: pointer;
}

.plan-chiffrage { display: flex; flex-direction: column; justify-content: space-between; padding: 0rem; }
.plan-chiffrage-total { display: flex; justify-content: space-between; align-items: center; padding: 2rem 1.5rem; }
.plan-chiffrage-total-label { color: rgba(33, 45, 89, 0.3); font-size: .95rem; line-height: 1.3; }
.plan-chiffrage-total-amount { color: #00BBFF; font-size: 2rem; font-weight: 600; }
.plan-chiffrage-postes { display: flex; flex-direction: column; }
.plan-chiffrage-poste { display: flex; justify-content: space-between; margin-bottom: 1.4rem; }
.plan-chiffrage-poste-label { text-transform: uppercase; font-weight: 500; letter-spacing: 1px; border-left: 3px solid currentColor; padding-left: 1rem; }
.plan-chiffrage-poste-amount { padding-right: 1rem; font-weight: 600; }

.plan-chiffrage-poste-annexe { display: flex; justify-content: space-between; color: #989DB4; margin: 5px; }
.plan-chiffrage-poste-annexe:last-of-type { margin-bottom: -15px; }
.plan-chiffrage-poste-annexe-label { font-weight: 400; letter-spacing: 0px; padding-left: 1.4rem; }
.plan-chiffrage-poste-annexe-amount { padding-right: 1.5rem; font-weight: 600; }

.go { color: #212D59; }
.so { color: #E97956; }
.lt { color: #E15F6C; }
.finitions { color: #C69C6D; }

.plan-chiffrage-detail { text-align: center; color: #fff; background: #00BBFF; padding: 1rem; border-bottom-left-radius: 5px; border-bottom-right-radius: 5px; }
.plan-chiffrage-detail:hover { opacity: 0.8; cursor: pointer; }

.plan-toolbar {
    text-align: center;

    margin-bottom: 1rem;
    color: rgba(33, 45, 89, 1);
    font-size: .9rem;
}
.plan-toolbar--item {
    padding: 1rem 0;
    border-left: 1px solid rgba(33, 45, 89, .08);
    transition: all .2s linear;
    cursor: pointer;
}
.plan-toolbar--item.disabled { opacity: 0.5; cursor: not-allowed; }

.plan-toolbar--item:hover {
    background: rgba(33, 45, 89, .02);
    transition: all .2s linear;
}

.plan-toolbar--item i {
    font-size: .9rem;
    font-weight: 900;
    color: #00BBFF;
}

.plan-toolbar--item .budicon-like {
    color: #2ECC71;
}

.plan-toolbar--item .budicon-dislike {
    color: #FF5252;
}

.back-page {
    color: rgba(35, 49, 88, .3);
    font-size: 1.5rem;
    vertical-align: middle;
    cursor: pointer;
    border-radius: 4px;
    padding: .4rem .8rem;
    box-sizing: border-box;
    border: 1px dotted rgba(35, 49, 88, 0);
}

.back-page:hover {
    border: 1px solid rgba(35, 49, 88, .3);
}

.drawnPlan {
    text-align: center;
}

.image-plan {
    width: 80%;
}

</style>
