<template id="welcomeVue">
    <el-row class="main-container" type="flex" align="middle" justify="center" v-if="userEdited != null">
        <checkout v-if="checkout.show" class="checkout" :info="checkout" v-on:complete="completeCheckout" v-on:abort="abortCheckout"></checkout>
        <el-row class="logo-container">
            <img class="logo" src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x">
        </el-row>

        <el-row class="containers">
            <el-row>
                <h2 class="container-title">Faites le bon choix <span style="opacity: 1">😉</span></h2>
            </el-row>

            <el-row class="user-info hidden-md-and-down" type="flex" justify="space-between">
                <div class="pricing-table">
                    <div class="pricing-item card" @click="openCheckout(0)">
                        <h2 class="pricing-title">MIP Découverte 👣</h2>
                        <ul class="pricing-features">
                            <li class="pricing-feature">Liste des tâches <b>complète</b></li>
                            <li class="pricing-feature">Liste des dépenses <b>complète</b></li>
                            <li class="pricing-feature disabled">Conception de plans illimitée</li>
                            <li class="pricing-feature disabled">Comparateurs de devis</li>
                            <li class="pricing-feature disabled">Checklists exclusives</li>
                            <li class="pricing-feature disabled">Contenu exclusif</li>
                            <li class="pricing-feature">Support 24h/7j</li>
                        </ul>
                        <div class="pricing-offer">Gratuit</div>
                        <button class="pricing-cta">S'inscrire gratuitement</button>
                    </div>

                    <div class="pricing-item card is-active" @click="openCheckout(90)">
                        <h2 class="pricing-title">MIP Soutien 💪</h2>
                        <ul class="pricing-features">
                            <li class="pricing-feature">Liste des tâches <b>complète</b></li>
                            <li class="pricing-feature">Liste des dépenses <b>complète</b></li>
                            <li class="pricing-feature">Conception de plans illimitée</li>
                            <li class="pricing-feature">Comparateurs de devis</li>
                            <li class="pricing-feature">Checklists exclusives</li>
                            <li class="pricing-feature">Contenu exclusif</li>
                            <li class="pricing-feature">Support 24h/7j</li>
                        </ul>
                        <div class="pricing-offer">90€ accès illimité</div>
                        <button class="pricing-cta">S'inscrire</button>
                    </div>
                </div>
            </el-row>


            <el-row class="user-info pricing-mobile" type="flex" justify="space-between">
                <div class="pricing-table">

                    <div class="pricing-item card" @click="openCheckout(0)">
                        <h2 class="pricing-title">MIP Découverte 👣</h2>
                        <div class="pricing-offer">Gratuit</div>
                    </div>

                    <div class="pricing-item card is-active" @click="openCheckout(90)">
                        <h2 class="pricing-title">MIP Soutien 💪</h2>
                        <div class="pricing-offer">90€ accès illimité</div>
                    </div>
                </div>
            </el-row>

        </el-row>


        <el-row class="onboard-progress" style="margin-top: auto;" >
            <el-col>
                <el-steps :space="200" :active="3" finish-status="success" align-center>
                    <el-step title="Moi"></el-step>
                    <el-step title="Nous"></el-step>
                    <el-step title="Projet"></el-step>
                    <el-step title="Offre"></el-step>
                </el-steps>
            </el-col>
        </el-row>

        <el-row class="hidden-md-and-up responsive-progress">
            <el-col style="margin: auto;">
                <el-steps :space="200" :active="3" finish-status="success" align-center>
                    <el-step></el-step>
                    <el-step></el-step>
                    <el-step></el-step>
                    <el-step></el-step>
                </el-steps>
            </el-col>
        </el-row>
    </el-row>
</template>

<script>
import Checkout from '../../Components/Checkout.vue';
import MobileDetect from 'mobile-detect';

export default {
    name: 'Information',
    components: {
        'checkout': Checkout
    },
    data() {
        return {
            userEdited: null,
            radio3: 'Oui',
            checkout: {
                show: false,
                amount: 0,
                route: '/charge',
                name: 'MIP Projet',
                features: ['Liste des tâches à compléter', 'Lisfte des dépenses à compléter', 'Conception de plans illimitée', 'Comparateurs de devis', 'Checklists exclusives', 'Contenu exclusif', 'Support 24h/7j']
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    created() {
        this.$http.get(this.$root.URL + '/auth/islogged').then((res) => {
            if (res.data.isLogged == false) this.$router.replace({ name: 'Login' });
            else this.userEdited = res.data.user;
        });
    },
    methods: {
        openCheckout(amount) {
            if (amount == 0) {
                this.$http.post(this.$root.URL + '/money/charge/free').then(res => {
                    this.completeCheckout();
                });
            } else {
                this.checkout.route += '/' + (amount == 15 ? 'monthly' : 'full');
                this.checkout.amount = amount;
                this.checkout.show = true;
            }
        },
        completeCheckout() {
            this.checkout.show = false;
            var md = new MobileDetect(window.navigator.userAgent);

            if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
            else this.$router.push({ name: 'UploadPlans', params: { first: true } });
        },
        abortCheckout() {
            this.checkout.show = false;
        }
    }
}
</script>

<style scoped>
.main-container {justify-content:flex-start; flex-direction: column; height: 100%; width: 100%; min-height: 100vh; font-family: 'Poppins', 'sans-serif'; background-color: #F8F9FA; }
.logo { height: 54px; }
.circles { position: absolute; left: -30px; top: 50%; height: 259px; width: auto; }

.yes-no { text-align: center; margin-bottom: 10px; }
.pricing-table { display: flex; align-content: center; align-items: stretch; margin-bottom: .6rem; }

.pricing-item { position: relative; display: flex; flex-direction: column; flex: 1; margin-right: 2rem; border: 1px solid #e5e7eb; background-color: #fff; border-radius: 4px; box-shadow: 0 4px 4px rgba(0,0,0,.03); padding: 2rem 2rem; transition: all .2s ease; text-align: center; }
.pricing-item:last-of-type { margin-right: 0; }
.pricing-item:hover { cursor: pointer; box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, .07); transform: translate3D(0, -1px, 0) scale(1.05); transition: all 0.4s ease; }

.pricing-title { font-weight: 500; font-size: 1.5rem; color: rgba(35, 49, 88, 1); margin-bottom: 1rem; }
.pricing-features { margin-bottom: 2rem; padding: 0 2rem; list-style: none; }
.pricing-feature { margin-bottom: .5rem; color:  rgba(35, 49, 88, .6); text-align: left; }
.pricing-feature::before { content: '✓ '; color: #2ecc71; }
.pricing-feature.disabled::before { content: ''; margin-left: 1rem;}
.pricing-feature.disabled { text-decoration: line-through; }
.pricing-offer { color: #31BDFC; margin-top: auto; margin-bottom: .8rem; /* font-weight: 600; */ font-size: 1.5rem; text-align: center; }
.pricing-item.is-active .pricing-offer { font-weight: 700; }
.pricing-item.is-active .pricing-cta { font-weight: 700; }
.pricing-cta { margin: 0 1.6rem; color: #31BDFC; border: 1px solid #31BDFC; background: #fff; border-radius: 4px; padding: 1rem; font-size: 1rem; cursor: pointer; }
.pricing-item.is-active { box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, .03); }
.pricing-item.is-active:hover { box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, .07); }
.pricing-item.is-active .pricing-cta { color: #fff; background: #31BDFC; background: linear-gradient(5deg,#31BDFC,#00D3F7); }

.pricing-item.is-active::before {
    content: 'Recommandé';
    position: absolute;
    top: -.8rem;
    left: 25%;
    width: 50%;
    display: block;
    padding: .3rem 0rem;
    background: #31BDFC;
    background: linear-gradient(5deg,#31BDFC,#00D3F7);
    color: #fff;
    border-radius: 4px;
    font-size: .9rem;
}

.pricing-item.is-active {
    /* box-shadow: 0px 3px 18px 4px rgba(0, 0, 0, .04); */
    position: relative;
    border: 1px solid #31BDFC;
    transform: translate3D(0, -1px, 0) scale(1.05);

}

.pricing-cta:hover {
    color: #fff;
    background: #31BDFC;
    background: linear-gradient(5deg,#31BDFC,#00D3F7);
    border: 1px solid #31BDFC;
    font-weight: bold;
}

.pricing-item.is-active .pricing-title {
    color: #31BDFC;
    font-weight: 700;
}


.container-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 400;
    color: rgba(35, 49, 88, .3);
    margin: 1rem 0 2rem;
}

.logo-container {
    margin: 2rem 0;
}

@media only screen and (min-width: 300px) and (max-width: 767px) {

    .container-title {
        font-size: .9rem;
        padding: 0;
        margin: .5rem 0 .5rem;
    }
    .logo-container {
        margin: 1rem 0 0;
    }
    .logo { margin: 0 0 .5rem;height: 1.5rem; width: auto;}

    .pricing-table {
        flex-direction: column;
        width: 80vw;
        align-items: center;
        margin-bottom: 3rem;
    }
    .pricing-item { margin-bottom: .8rem; margin-right: 0; padding: 0 .8rem .8rem; width: 100%; }
    .pricing-item:last-of-type { margin-bottom: 0; }
    .pricing-item.is-active {
        transform: translate3D(0, 0px, 0) scale(1);

    }
    .pricing-cta { margin: 0 1rem;padding: .5rem; font-size: .9rem;}
    .pricing-title { font-size: 1rem !important; margin-bottom: .4rem;}


    .pricing-offer {margin-bottom: 0; font-size: .8rem !important; }
    .pricing-cta { font-size: .8rem;  }

    .onboard-progress {
        display: none;
    }

    .el-steps--horizontal {
        margin: 0 auto;
        font-size: .7rem;
        width: 90vw;
    }

    .responsive-progress {
        position: fixed;
        width: 100vw;
        bottom: 0px;
        left: 0px;
        padding: .5rem;
        z-index: 10000;
        background: rgba(252, 252, 252, .9);
        border: 1px solid rgba(33, 45, 89, .08);
        box-shadow: 0 -3px 12px 0px rgba(0, 0, 0, .1);
        border-radius: 0;
    }

    .pricing-item.is-active {
        background:#31BDFC;
        background: linear-gradient(5deg,#31BDFC,#00D3F7);
        color: #fff;
    }
    .pricing-item.is-active .pricing-title {
        color: #fff;
    }

    .pricing-item.is-active .pricing-offer {
        color: #fff;
    }

    .pricing-item.is-active .pricing-cta {
        color: #fff;
        border: 1px solid #fff;
        background: transparent;
    }


    .pricing-item.is-active::before {
        display: none !important;
    }

    .pricing-item.is-active .pricing-offer {
        font-weight: 400;
    }

}


@media only screen and (min-width: 768px) and (max-width: 1188px) {

    .pricing-table {
        flex-direction: column;
        width: 70vw;
        align-items: center;
        margin-bottom: 3rem;
    }
    .pricing-item { margin-bottom: .8rem; margin-right: 0; padding: 0 .8rem .8rem; width: 100%; }
    .pricing-item:last-of-type { margin-bottom: 0; }
    .pricing-item.is-active {
        transform: translate3D(0, 0px, 0) scale(1);

    }
    .pricing-cta { margin: 0 1rem; padding: .8rem; font-size: 1.2rem;}
    .pricing-title { font-size: 1.1rem !important; margin-bottom: .4rem;}


    .pricing-offer {margin-bottom: 0; font-size: .9rem !important; }
    .pricing-cta { font-size: .8rem;  }

    .onboard-progress {
        display: none;
    }

    .el-steps--horizontal {
        margin: 0 auto;
        font-size: .7rem;
        width: 90vw;
    }

    .responsive-progress {
        position: fixed;
        width: 100vw;
        bottom: 0px;
        left: 0px;
        padding: .5rem;
        z-index: 10000;
        background: rgba(252, 252, 252, .9);
        border: 1px solid rgba(33, 45, 89, .08);
        box-shadow: 0 -3px 12px 0px rgba(0, 0, 0, .1);
        border-radius: 0;
    }

    .pricing-item.is-active {
        background:#31BDFC;
        background: linear-gradient(5deg,#31BDFC,#00D3F7);
        color: #fff;
    }
    .pricing-item.is-active .pricing-title {
        color: #fff;
    }

    .pricing-item.is-active .pricing-offer {
        color: #fff;
    }

    .pricing-item.is-active .pricing-cta {
        color: #fff;
        border: 1px solid #fff;
        background: transparent;
    }


    .pricing-item.is-active::before {
        display: none !important;
    }

    .pricing-item.is-active .pricing-offer {
        font-weight: 400;
    }

}

@media only screen and (min-width: 1189px) {
    .pricing-mobile {
        display: none;
    }
}


</style>
