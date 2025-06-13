<template>
    <div class="main-container">
        <el-dialog v-if="coachDialog" class="coach-dialog" style="background: rgba(255, 255, 255, 1);" :visible.sync="coachDialog" top="6vh" :fullscreen="false" :close-on-click-modal="false" :width="(isMobile())?'60%':'45%'">
            <p>Félicitation d’avoir choisi le <span style="border-bottom: 6px solid #31BDFC; font-weight: 700;">coaching MIP</span></p>
            <p>Afin d’entrer en contact avec vous, nous avons besoin d’un numéro de téléphone pour vous joindre 😊</p>
            <div style="width: 50%; margin: 3rem auto; animation: fadeIn 1s !important;">
                <el-input placeholder="N° de Téléphone" style="font-size: 1.1rem;" v-model="phone"></el-input>
                <button @click="sendNumber">Coachez-moi !</button>
            </div>
            <p style="animation: fadeIn 4s !important;">Ensemble nous allons vous faire faire des économies considérables, c'est parti !</p>
        </el-dialog>

        <el-row  class="user-info" type="flex" justify="space-between">
            <div style="width: 70vw; margin: auto;">
                <h2 class="subtitle">Vous souhaitez un accompagnement complet<br> pour réussir chaque étape de votre projet ?</h2>
                <p class="value-proposition">Economisez plus de <b>10 000 € !</b></p>
                <div class="pricing-table">
                    <div class="pricing-item card" @click="coachDialog = true">
                        <div class="ribbon ribbon-top-right"><span>Satisfait ou remboursé</span></div>
                        <h2 class="pricing-title">MIP Coach</h2>
                        <ul class="pricing-features">
                            <li class="pricing-feature"><i class="el-icon-check"></i> Élaboration complète de votre projet</li>
                            <li class="pricing-feature"><i class="el-icon-check"></i> Chiffrage de la totalité des dépenses</b></li>
                            <li class="pricing-feature"><i class="el-icon-check"></i> Accompagnement dans la recherche de crédit</li>
                            <li class="pricing-feature"><i class="el-icon-check"></i> Accompagnement dans la recherche de terrain</li>
                            <li class="pricing-feature"><i class="el-icon-check"></i> Sélection des meilleurs devis d’assurance</li>
                            <li class="pricing-feature"><i class="el-icon-check"></i> Réalisation d’une maquette 3D de votre projet</li>
                            <li class="pricing-feature"><i class="el-icon-check"></i> Recherche des meilleures entreprises de construction</li>
                        </ul>
                        <div class="pricing-offer">490 €</div>
                        <button class="pricing-cta" @click="coachdDialog = true">Je veux économiser plus de 10 000 €</button>
                    </div>
                </div>
            </div>
        </el-row>

        <div style="max-width:1024px; margin: 4rem auto;">
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
export default {
    data() {
        return {
            coachDialog: false,
            phone: ''
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted(){
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
        sendNumber() {
            this.$http.post(this.$root.URL + '/account/subscribe-coach', { phone: this.phone }).then(res => {});
            this.coachDialog = false;
            this.$swal({ title: 'C’est tout bon ! Nous allons bientôt vous contacter', type: 'success', showConfirmButton: false });
        },
        displayChat() {
            $crisp.push(['do', 'chat:open']);
        }
    }
};
</script>

<style scoped>

.ribbon {
    width: 200px;
    height: 200px;
    overflow: hidden;
    position: absolute;
}
.ribbon::before,
.ribbon::after {
    position: absolute;
    z-index: -1;
    content: '';
    display: block;
}
.ribbon span {
    position: absolute;
    display: block;
    width: 290px;
    padding: .4rem 0 .4rem 1rem ;
    background-color: #F4AD3D;
    box-shadow: 0 2px 10px 1px rgba(0,0,0,.15);
    color: #fff;
    text-align: center;
    font-size: .9rem;
    font-weight: 500;
}

/* top right*/
.ribbon-top-right {
    top: 0px;
    right: 0px;
}
.ribbon-top-right::before,
.ribbon-top-right::after {
    border-top-color: transparent;
    border-right-color: transparent;
}
.ribbon-top-right::before {
    top: 0;
    left: 0;
}
.ribbon-top-right::after {
    bottom: 0;
    right: 0;
}
.ribbon-top-right span {
    left: -35px;
    top: 40px;
    transform: rotate(40deg);
}

.subtitle {
    text-align: center;
    font-weight: 500;
    color: rgba(35, 49, 88, .9);
    font-size: 2rem;
    margin-top: 3.2rem;
    line-height: 1.5;
    letter-spacing: -2px;
}
.value-proposition {
    font-weight: 400;
    text-align: center;
    color: rgba(35, 49, 88, .6);
    font-size: 1.4rem;
    line-height: 1;
    margin-bottom: 2.5rem;
}

.value-proposition b {
    color: #31BDFC;
}

.label {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: .8rem;
    font-weight: 500;
    color: rgba(35, 49, 88, .2);
}

.el-input {
    margin-bottom: 1.2rem;
}

.pricing-table {
    margin-bottom: 5rem;
    margin: auto;
    position: relative;
    width: 530px;
}

.pricing-item {
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e7eb69;
    background-color: #fff;
    border-radius: 2%;
    box-shadow: 0 0 5px  4px rgba(0,0,0,.04);
    padding: 1rem 1rem 2rem;
    transition: all .2s ease;
    text-align: center;
    /* width:  100%; */
    overflow: hidden;
}
.pricing-item:last-of-type {
    margin-right: 0;
}
.pricing-item:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .07);
    transform: translate3D(0, -1px, 0) scale(1.05);
    transition: all 0.4s ease;
}

/* .pricing-title {
    font-weight: 500;
    font-size: 1.2rem;
    color: rgba(35, 49, 88, .3);
    letter-spacing: 1px;
    margin-bottom: .5rem;
    text-transform: uppercase;
} */

.pricing-title {
    color: rgba(33, 45, 89, .9);
    font-weight: 500;
    text-align: center;
    font-size: 1.2rem;
    display: inline-block;
    position: relative;
}

.pricing-title::after {
    display: inline-block;
    position: absolute;
    bottom: 0;
    left: 40%;
    content: '';
    width: 15px;
    /* margin: auto; */
    height: 3px;
    background: #00BBFF;
    border-radius: 500px;
}

.pricing-features {
    margin-bottom: 1rem;
    /* padding: 0 2rem; */
    list-style: none;
}

.pricing-feature {
    margin-bottom: 1rem;
    color:  rgba(35, 49, 88, .8);
    text-align: left;
}

.pricing-feature::before {
    /* content: '✓ ';
    color: #2ecc71; */
}

.pricing-feature.disabled::before {
    content: '';
    /* color: #2ecc71; */
}

.pricing-feature.disabled {
    text-decoration: line-through;
}

.pricing-offer {
    color: #31BDFC;
    margin-top: auto;
    margin-bottom: 2.2rem;
    font-weight: 600;
    font-size: 1.5rem;
    text-align: center;
}

.pricing-item.is-active {
    background: rgba(35, 49, 88, .03);
}

.pricing-item.is-active:hover {
    cursor: not-allowed;
}

/* .pricing-item:before {
content: 'Satisfait ou remboursé';
position: absolute;
top: 45px;
right: -40px;
background: yellow;
transform: rotate(35deg);
text-align: center;
font-size: .9rem;
padding: 0 1rem;
width: 220px;
overflow: hidden;
} */

.pricing-item.is-active .pricing-offer {
    font-weight: 700;
}

.pricing-item.is-active .pricing-cta {
    font-weight: 700;
}

.pricing-cta {
    border: 1px solid #31bdfc;
    color: #fff;
    background: linear-gradient(5deg,#31bdfc,#00d3f7);
    font-weight: 500;
    /* border-radius: 50px; */
    border-bottom-right-radius: 6px;
    border-bottom-left-radius: 6px;
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
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
    border-radius: 4px !important;
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

.coach-dialog p {
    text-align: center;
    font-size: 1.3rem;
    color:  rgba(35, 49, 88, .6);
    font-weight: 300;

}

.coach-dialog p:first-of-type {
    animation: fadeIn 2s;
}
.coach-dialog p:nth-of-type(2) {
    animation: fadeIn 3s;
}



.coach-dialog p:first-of-type {
    color:  rgba(35, 49, 88, .9);
    font-size: 2rem;
    font-weight: 300;
}

.coach-dialog .el-input .el-input__inner {
    height: 62px;
    line-height: 62px;
}

.coach-dialog button {
    border: 1px solid #31bdfc;
    color: #fff;
    background: linear-gradient(5deg,#31bdfc,#00d3f7);
    font-weight: 500;
    /* border-radius: 50px; */
    padding: 1rem;
    font-size: 1rem;
    cursor: pointer;
    bottom: 0;
    width: 100%;
    border-radius: 4px;
}

.coach-dialog button:hover {
    cursor: pointer;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, .07);
    transform: translate3D(0, -1px, 0) scale(1.05);
    transition: all 0.4s ease;
}

.el-icon-check {
    color: #2ECC71;
    padding-right: .2rem;
}



</style>
