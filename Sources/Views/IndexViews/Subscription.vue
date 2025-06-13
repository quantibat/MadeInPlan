<template>
    <div class="main-container subscription">
        <checkout v-if="checkout.show" class="checkout" :info="checkout" v-on:complete="completeCheckout" v-on:abort="abortCheckout"></checkout>
        <h1 style="margin-bottom: 1.5rem; text-align: center">Mon abonnement</h1>
        <el-row class="user-info" style="overflow-x: scroll" type="flex">
            <div>
                <div class="pricing-table">
                    <el-col :class="'pricing-item card ' + (user.money.sub_type == 'free' ? 'is-active' : '')" @click="openCheckout(0)">
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
                        <button v-if="user.money.sub_type == 'free'" class="pricing-cta">✓ Offre actuelle</button>
                        <button v-else class="pricing-cta">Choisir cette offre</button>
                    </el-col>

                    <!-- <el-col :class="'pricing-item card ' + (user.money.sub_type == 'monthly' ? 'is-active' : '')" @click="openCheckout(15)">
                        <h2 class="pricing-title">MIP Projet 🏡</h2>
                        <ul class="pricing-features">
                            <li class="pricing-feature">Liste des tâches <b>complète</b></li>
                            <li class="pricing-feature">Liste des dépenses <b>complète</b></li>
                            <li class="pricing-feature">Conception de plans illimitée</li>
                            <li class="pricing-feature">Comparateurs de devis</li>
                            <li class="pricing-feature">Checklists exclusives</li>
                            <li class="pricing-feature">Contenu exclusif</li>
                            <li class="pricing-feature">Support 24h/7j</li>
                        </ul>
                        <div class="pricing-offer">15€/mois</div>
                        <button v-if="user.money.sub_type == 'monthly'" class="pricing-cta">✓ Offre actuelle</button>
                        <button v-else class="pricing-cta">Choisir cette offre</button>
                    </el-col> -->

                    <el-col :class="'pricing-item card ' + (user.money.sub_type == 'full' ? 'is-active' : '')" @click="openCheckout(90)">
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
                        <div class="pricing-offer">90€ accès à vie </div>
                        <button v-if="user.money.sub_type == 'full'" class="pricing-cta">✓ Offre actuelle</button>
                        <button v-else class="pricing-cta">Choisir cette offre</button>
                    </el-col>
                </div>

            </div>
        </el-row>

        <div style="max-width:1024px; margin: auto;">
            <el-row>
                <h1 style="color: rgba(35, 49, 88, 1); text-align: center; margin: 0; margin-bottom: 1rem;">Questions fréquentes</h1>
                <el-collapse>
                    <el-collapse-item title="Pourquoi Made in Plan est payant ?">
                        <div>Made in Plan a pour ambition de révolutionner la construction de maisons individuelles en redonnant le pouvoir aux particuliers et aux artisans. Pour accomplir cette mission, nous avons besoin de vous !</div>
                    </el-collapse-item>
                    <el-collapse-item title="Pourquoi une version gratuit de Made in Plan ?">
                        <div>Nous souhaitons proposer à tous, les avantages fondamentaux de Made in Plan et vous permettre d’imaginer ce que la version complète pourrait pour faire gagner en temps et en argent… Découvrez notre univers, posez-nous toutes vos questions ! Bienvenu chez Made in Plan !</div>
                    </el-collapse-item>
                    <el-collapse-item title="Qu’est ce que c’est Made in Plan en fait ?">
                        <div>Made in Plan vous propose tous les outils vous permettant de réaliser des économies considérables pour votre projet de construction de maison. Gérer votre budget, concevoir vos plans, comparer vos devis, communiquer avec vos artisans… Une solution tout en 1 qui change tout.</div>
                    </el-collapse-item>
                    <el-collapse-item title="Pourquoi soutenir Made in Plan ?">
                        <div>Si vous croyez en nous et en notre solution. Si vous nous pensez capables de résoudre tous les problèmes liés à la construction de votre future maison. Ou simplement, si vous nous aimez… alors vous avez déjà une raison suffisante pour nous soutenir !</div>
                    </el-collapse-item>
                    <el-collapse-item title="Est-il possible d’utiliser Made in Plan alors que j’ai déjà commencé mon projet ?">
                        <div>Évidemment oui ! Made in Plan est une solution tout en 1 qui s’adapte au stade auquel vous êtes dans votre projet de construction. Vous pouvez nous rejoindre à n’importe quel stade, dès que vous en ressentez le besoin.</div>
                    </el-collapse-item>
                    <el-collapse-item title="Est ce que Made in Plan est utile pour moi alors que je passe par un constructeur ?">
                        <div>Oui ! Vous serez toujours amené à vous posez des questions, ou à avoir besoin d’outil pour mieux gérer votre projet. Made in Plan et un point de ressource indépendant qui s’adapte très bien aux maîtres d’ouvrages ayant déjà fait appel à un constructeur, ou à n’importe quel professionnel de la construction.</div>
                    </el-collapse-item>
                    <el-collapse-item title="L’équipe de Made in Plan peut-elle m’aider à faire construire ma maison ?">
                        <div>Bien sûr ! Au delà de tous les outils que nous mettons à votre disposition, nous sommes en mesure de vous recommander auprès de notre réseau de professionnels qualifiés dans toute la France. </div>
                    </el-collapse-item>
                    <el-collapse-item title="Est-il possible de résilier mon abonnement quand je le souhaite ?">
                        <div>Oui ! Votre abonnement à Made in Plan est sans engagement. Vous pouvez le résilier quand vous le souhaitez. </div>
                    </el-collapse-item>
                    <el-collapse-item title="Made in Plan fonctionne-t-il aussi sur mobile ?">
                        <div>L’application mobile sur iOS et Android est en cours de développement ! Donc c’est pour bientôt :-). Avant cela, vous pouvez toujours accéder à votre compte via votre navigateur mobile.</div>
                    </el-collapse-item>
                </el-collapse>
            </el-row>

            <div style="width:60vw; margin: auto; margin-top: 3rem; margin-bottom: 4rem; text-align: center;">
                <el-row>
                    <h1 style="margin-bottom: 1rem;">Il vous manque une info ?</h1>
                    <button @click="displayChat()" class="contact">Contactez-nous</button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import Checkout from '../../Components/Checkout.vue';

export default {
    components: {
        'checkout': Checkout
    },
    data() {
        return {
            checkout: {
                show: false,
                amout: 0,
                route: '/change',
                name: 'MIP Projet',
                features: ['Liste des tâches à compléter', 'Liste des dépenses à compléter', 'Conception de plans illimitée', 'Comparateurs de devis', 'Checklists exclusives', 'Contenu exclusif', 'Support 24h/7j']
            }
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        openCheckout(amount) {
            if (this.user.money.sub_type == 'full') {
                this.$swal({
                    title: "Haaaa vous alors… 🙂\n Vous avez déjà souscrit à une offre à vie…\n Nous sommes donc avec vous pour toujours ! 😉",
                    confirmButtonText: 'Ok !'
                });
                return;
            }
            if (amount == 0) {
                this.$swal({
                    title: 'Êtes-vous sûre ?',
                    text: "Vous vous appretez à changer en votre compte en gratuit !",
                    type: 'warning',
                    reverseButtons: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonText: 'Non, annuler',
                    confirmButtonText: 'Oui !'
                }).then((result) => {
                    if (result.value) {
                        this.$http.post(this.$root.URL + '/money/change/free').then(res => {
                            this.$store.commit('setUser', res.data.user);
                            this.$localStorage.set('user', res.data.user);
                            this.$swal('Gratuit !', 'Votre compte est maintenant gratuit', 'success');
                            this.$router.push({ name: 'Projet' });
                        });
                    }
                });
            } else {
                this.checkout.route += '/' + (amount == 15 ? 'monthly' : 'full');
                this.checkout.amount = amount;
                this.checkout.show = true;
            }
        },
        completeCheckout() {
            this.checkout.show = false;
            this.$router.push({ name: 'Projet' });
        },
        abortCheckout() {
            this.checkout.show = false;
        },
        displayChat() {
            $crisp.push(['do', 'chat:open']);
        }
    }
};
</script>

<style scoped>
.user-card {
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    padding: 1.2rem 1rem;
    align-items: center;
    box-sizing: border-box;
}

.user-card h2 {
    color: rgba(35, 49, 88, 1);
    margin: 0;
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
    font-weight: 700;
}

.user-edit {
    margin-left: auto;
    margin-bottom: 1rem;
    box-sizing: border-box;
}

.user-edit a {
    color: #31BDFC;
    text-decoration: none;
    font-size: .9rem;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid transparent;
}
.user-edit a:hover {
    border: 1px solid #31BDFC;
    border-radius: 4px;
}


.user-pic {
    margin-bottom: .6rem;
}

.user-pic img {
    border-radius: 50%;
}

.user-name h3 {
    margin: 0;
    font-weight: 500;
    color: rgba(35, 49, 88, 1);
}

.user-email {
    color: rgba(35, 49, 88, .6);
    font-size: .9rem;
}

.label {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: .8rem;
    font-weight: 500;
    color: rgba(35, 49, 88, .6);
}

.el-input {
    margin-bottom: 1.2rem;
}

.pricing-table {
    display: flex;
    /* align-content: center; */
    align-items: stretch;
    margin-bottom: 5rem;
    align-content: center;
    /* margin-left: 4rem;
    margin-right: 4rem; */
}

.pricing-item {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 25rem;
    margin-right: 2rem;
    /* margin-left: 1rem; */
    border: 1px solid #e5e7eb;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 4px rgba(0,0,0,.03);
    transition: all .2s ease;
    padding: 1rem 0 2rem;
    text-align: center;
}
.pricing-item:last-of-type {
    margin-right: 0;
}
.pricing-item:hover {
    cursor: pointer;
    box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, .07);
    transform: translate3D(0, -1px, 0) scale(1.05);
    transition: all 0.4s ease;
}

.pricing-title {
    font-weight: 500;
    font-size: 1.5rem;
    color: rgba(35, 49, 88, 1);
    margin-bottom: 1rem;
}

.pricing-features {
    margin-bottom: 2rem;
    /* padding: 0 2rem; */
    list-style: none;
    padding: 0 3rem;
}

.pricing-feature {
    margin-bottom: .5rem;
    color:  rgba(35, 49, 88, .6);
    text-align: left;
    font-size: .95em;
}

.pricing-feature::before {
    content: '✓ ';
    color: #2ecc71;
}

.pricing-feature.disabled::before {
    content: '';
    margin-left: 1rem
}

.pricing-feature.disabled {
    text-decoration: line-through;
}

.pricing-offer {
    color: #31BDFC;
    margin-top: auto;
    margin-bottom: .7rem;
    /* font-weight: 600; */
    font-size: 1.5rem;
    text-align: center;
}

.pricing-item.is-active {
    background: rgba(35, 49, 88, .03);
}

.pricing-item.is-active:hover {
    cursor: not-allowed;
}

.pricing-item.is-active .pricing-offer {
    font-weight: 700;
}

.pricing-item.is-active .pricing-cta {
    font-weight: 700;
}

.pricing-cta {
    color: #fff;
    background: #31BDFC;
    border: none;
    border-radius: 4px;
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
    margin: 0 1.6rem;
}

.pricing-item.is-active {
    box-shadow: 0px 6px 18px 10px rgba(0, 0, 0, .07);
    background: #2ECC71;
    background: linear-gradient(5deg, rgba(46,204,113,1) 0%, rgba(145,212,101,1) 100%);
    color: #fff;
    opacity: .9;
}

.pricing-item.is-active:hover {
    transform: none;
}

.pricing-item.is-active .pricing-title {
    color: #fff;
}

.pricing-item.is-active .pricing-offer{
    color: #fff;
}

.pricing-item.is-active .pricing-feature {
    color: #fff;
}

.pricing-item.is-active .pricing-feature::before {

    color: #fff;
}

.pricing-item.is-active .pricing-cta {
    color: #fff;
    background: #2ECC71;
    border: 1px solid #fff;
}
.pricing-item.is-active .pricing-cta:hover {
    cursor: not-allowed;
}

.contact {
    color: #fff;
    /* border: 1px solid #31BDFC; */
    background: #31BDFC;
    background: linear-gradient(5deg,#31BDFC,#00D3F7);
    border-radius: 4px;
    padding: 1rem 2rem;
    font-size: 1.5rem;
    cursor: pointer;
    transition: .2s ease-in-out;
    border: none;
}


.contact:hover {
    transition: .2s ease-in-out;
   transform: translate3D(0, -1px, 0) scale(1.05);
}
</style>
