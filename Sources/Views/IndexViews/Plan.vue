<template id="Plan">
    <div class="main-container">
        <el-row type="flex" align="bottom" class="header">
            <h1>Mes plans</h1>
        </el-row>
        <el-row class="plan-container" type="flex">

            <el-col :span="5" class="plan-card new">
                <div class="plan-card--new" @click="handleAddPlan()">
                    <i class="plan-card--icon budicon budicon-plus-ui"></i>
                    <p>Nouveau plan</p>
                </div>
            </el-col>

            <el-col v-for="(plan, index) in plans" :key="plan._id" :span="5" class="plan-card">
                <div class="plan-card--item" @click="handleShowPlan(plan)">
                    <div class="plan-card--img">
                        <img :src="'/upload/Plans/' + user._id + '/' + plan.url" alt="">
                    </div>
                    <div class="plan-card--info">
                        <div class="plan-card--meta">
                            <h3 class="plan-card--title">{{ plan.plan.surfaceTotal }} m<sup>2</sup><br>{{ plan.plan.numberOfBedroom + ' chambre' + (plan.plan.numberOfBedroom > 1 ? 's' : '') }}</h3>
                        </div>
                        <div class="plan-card--chiffrage">
                            {{ plan.totalPrice.formatMoney() }} €
                        </div>
                    </div>
                    <i class="plan-card--delete budicon budicon-cross-ui" @click.stop="handleDeletePlan(plan._id, index)"></i>
                </div>
            </el-col>
         </el-row>
    </div>
</template>

<script>
export default {
    name: 'Plan',
    data() {
        return {
            plans: []
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    created() {
        this.$http.get('/plan/get').then(res => {
            this.plans = res.data.plans;
        }, err => {});
    },
    methods: {
        handleAddPlan() {
            var formData = {
                shape: 'L',
                nbBedroom: 3,
                surface: {
                    min: 100,
                    max: 110
                },
                prix: {
                    min: 60000,
                    max: 90000
                },
                options: {
                    placard: false,
                    cellier: false,
                    suite: false,
                    buandrie: false,
                    garage: false,
                    hall: false
                },
                advOptions: { 0: true, 1: true, 2: true, 3: true, 4: false, 5: false }
            };
            this.loading = true;
            this.$http.post(this.$root.CALC_ADDR + '/plan', formData).then(res => {
                this.loading = false;
                if (res.data.ok == false) {
                    this.$message.error('Nous n\'avons pas trouver de plan pour cette configuration');
                } else {
                    this.$router.push({ name: 'PlanDrawer', params: { id: res.data.id } });
                }
            }, (err) => {});
            // this.$router.push({ name: 'PlanConfig'});
        },
        handleShowPlan(plan) {
            this.$router.push({ name: 'PlanDrawer', params: { id: plan.plan._id } });
        },
        handleDeletePlan(id, index) {
            this.$confirm('Ce plan va être supprimer définitivement, continuer ?', 'Attention', {
                confirmButtonText: 'Supprimer',
                cancelButtonText: 'Annuler',
                type: 'warning'
            }).then(() => {
                this.$http.post('/plan/delete', { id: id }).then(res => {
                    this.plans.splice(index, 1);
                }, err => {});
                this.$message.success('Suppression confirmée');
            }).catch(() => {});

        },
        getTimeFromNow(time) {
            var now = new Date();
            var notifDate = new Date(time);

            var timeDiff = Math.abs(notifDate.getTime() - now.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays > 7) {
                return ("Le " + notifDate.toLocaleDateString());
            } else if (diffDays < 7 && diffDays > 1) {
                return ("Il y a " + diffDays + " jours")
            } else if ((timeDiff / (3600 * 1000)) >= 1) {
                return ("Il y a " + Math.floor(timeDiff / (3600 * 1000)) + " heures");
            } else if ((timeDiff / (60 * 1000)) >= 1) {
                return ('Il y a ' + Math.floor((timeDiff / (3600 * 1000) * 60)) + ' minutes')
            } else {
                return ('Maintenant')
            }
            return (notifDate.toLocaleString())
        },
        getTotalSurface(house) {
            var surface = 0.0;
            for (var i = 0; i < house.rooms.length; i++) {
                if (house.rooms[i].name != 'trouL') {
                    surface += house.rooms[i].height * house.rooms[i].width;
                }
            }
            return Math.round(surface * 10) / 10;
        },
        getNbBedroom(house) {
            return house.rooms.filter(item => item.name.includes('Chambre')).length;
        }
    }
}
</script>

<style scoped>

.plan-container {
    margin-top: 2rem;
    flex-wrap: wrap;
}

.plan-card {
    display: flex;
    position: relative;
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1);
    border-radius: 5px;
    transition: .2s linear all;
    margin-right: 2rem;
    margin-bottom: 2rem;
}

.plan-card:hover {
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .1);
    transition: .2s linear all;
    cursor: pointer;
}

.plan-card.new {
    border: 1px dashed #00BBFF;
}

.plan-card.new:hover {
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .08);
}

.plan-card--new {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    color: rgba(35, 49, 88, .3);
    font-size: 1.5rem;
    cursor: pointer;
    padding-bottom: 1.85rem;
    box-sizing: border-box;
    text-align: center;
    width: 100%;
    padding: 5rem 0;
}

.plan-card--new:hover p {
    color: #00BBFF;
    transition: .2s linear all;
}

.plan-card--icon {
    color: #00BBFF;
    font-size: 2.5rem;
    font-weight: 500;
}
.plan-card--new p {
    margin: 0;
    transition: .2s linear all;
}

.plan-card--item {
    display: flex;
    flex-direction: column;
    padding: 1rem 1rem;
    justify-content: space-between;
    margin: 0 auto;
    width: 100%;

}

.plan-card--title {
    margin: 0;
    color: #212D59;
    opacity: .9;
    font-size: .9rem;
    font-weight: 400;
}

.plan-budicon {
    display: none;
}
.plan-card:hover .plan-budicon {
    display: block;
    position: absolute;
    z-index: 2;
    font-size: 1.6rem;
    top: 1rem;
    right: 1rem;
    color: rgba(35, 49, 88, 0.5);
}
.plan-card:hover .plan-budicon:hover {
    color: rgba(35, 49, 88, 1);
}

@media (min-width: 768px) and (max-width: 1188px) {

  .prestataire-remove {
      left: 5%;
      font-size: 2.5rem;
      text-align: center;
  }
}

@media (min-width: 768px) and (max-width: 1188px) {
    .plan-summary {
        display: flex;
        margin-bottom: 2rem;
        align-items: center;
    }
    .plan-summary-item {
        flex: 1;
        position: relative;
        border-bottom: none;
    }

    .plan-summary-item::after {
        content: '';
        background: rgba(0, 0, 0, 0.1);
        width: 1px;
        height: 30%;
        position: absolute;
        top: 30%;
        right: -2rem;
    }
    .plan-summary-item:last-of-type:after {
        display: none;
    }
}
.plan-card--counter {
    color: #00BBFF;
    font-size: .9rem;
}

.plan-card--last-inspi.no-inspi:hover {
    border: 1px dashed #00BBFF;
    transition: .2s linear;
}

.plan-card--last-inspi.no-inspi i {
    margin: auto;
    font-size: 2rem;
}
.plan-card--img {
    margin: auto;
    width: 90%;
}
.plan-card--img img {
    width: 100%;
}

.plan-card--time {
    margin: 0;
    font-size: .8rem;
    color: rgba(35, 49, 88, .3);
}

.plan-card--info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.plan-card--delete {
    display: none;
}

.plan-card--item:hover .plan-card--delete {
    display: block;
    position: absolute;
    z-index: 2;
    font-size: 1.6rem;
    top: 0.4rem;
    right: 0.4rem;
    color: rgba(35, 49, 88, 0.5);
}

.plan-card--item:hover .plan-card--delete:hover {
    color: #EF5350;
}

.plan-card--chiffrage {
    font-size: .8rem;
    padding: 2px 0 1px;
    color: rgba(35, 49, 88, .5);
    position: relative;
    z-index: 1;
    color: #fff;
}

.plan-card--chiffrage::before {
    content: '';
    background: #00BBFF;
    background: linear-gradient(to right,#31bdfc,#00d3f7);
    box-shadow: 0 2px 8px 0px rgba(0, 0, 0, .07);
    position: absolute;
    top: 0;
    bottom: 0;
    left: -.6rem;
    right: -1rem;
    z-index: -1;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    transition: .1s linear;
}

.plan-card:hover .plan-card--chiffrage::before  {
    background: #00BBFF;
    background: linear-gradient(to left,#31bdfc,#00d3f7);
    transition: all .2s linear;
}

</style>
