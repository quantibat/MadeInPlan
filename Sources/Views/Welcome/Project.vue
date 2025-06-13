<template id="welcomeVue">
    <el-row class="main-container" type="flex" align="middle" v-if="userEdited != null">
        <el-row class="logo-container">
            <img class="logo" src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x">
        </el-row>
        <!-- <img class="circles" src="/Assets/circles.svg"> -->
        <el-row class="container">
            <el-row type="flex" justify="center">
                <p class="title">Que vous manque t-il pour réaliser votre projet ?</p>
            </el-row>

            <el-row type="flex" justify="center" align="top">
                <div :class="'mip-step ' + (userEdited.step['credit'] == true ? 'is-true' : '')" @click="userEdited.step['credit'] = !userEdited.step['credit']">
                    <img class="hidden-md-and-down checkbox" src="/Assets/checkbox.svg">
                    <img class="icon" src="/Assets/Welcome/icon-credit.svg">
                    <p class="desc">Mon crédit</p>
                </div>
                <div :class="'mip-step ' + (userEdited.step['terrain'] == true ? 'is-true' : '')" @click="userEdited.step['terrain'] = !userEdited.step['terrain']">
                    <img class="hidden-md-and-down checkbox" src="/Assets/checkbox.svg">
                    <img class="icon" src="/Assets/Welcome/icon-terrain.svg">
                    <p class="desc">Mon terrain</p>
                </div>
                <div :class="'mip-step ' + (userEdited.step['plan'] == true ? 'is-true' : '')" @click="userEdited.step['plan'] = !userEdited.step['plan']">
                    <img class="hidden-md-and-down checkbox" src="/Assets/checkbox.svg">
                    <img class="icon" src="/Assets/Welcome/icon-plan.svg">
                    <p class="desc">Mon plan</p>
                </div>
            </el-row>

            <el-row type="flex" justify="center" align="top">
                <div :class="'mip-step ' + (userEdited.step['permitConstruire'] == true ? 'is-true' : '')" @click="userEdited.step['permitConstruire'] = !userEdited.step['permitConstruire']">
                    <img class="hidden-md-and-down checkbox" src="/Assets/checkbox.svg">
                    <img class="icon" src="/Assets/Welcome/icon-permis.svg">
                    <p class="desc">Mon permis de construire</p>
                </div>
                <div :class="'mip-step ' + (userEdited.step['artisant'] == true ? 'is-true' : '')" @click="userEdited.step['artisant'] = !userEdited.step['artisant']">
                    <img class="hidden-md-and-down checkbox" src="/Assets/checkbox.svg">
                    <img class="icon" src="/Assets/Welcome/icon-prestataires.svg">
                    <p class="desc">Mes artisans</p>
                </div>
                <div :class="'mip-step ' + (userEdited.step['chantier'] == true ? 'is-true' : '')" @click="userEdited.step['chantier'] = !userEdited.step['chantier']">
                    <img class="hidden-md-and-down checkbox" src="/Assets/checkbox.svg">
                    <img class="icon" src="/Assets/Welcome/icon-chantier.svg">
                    <p class="desc">Suivre mon chantier</p>
                </div>
            </el-row>

            <el-row type="flex" justify="center" align="top">
                <el-button @click="sendInfo()">En avant !</el-button>
            </el-row>
        </el-row>
        <el-row class="onboard-progress" style="margin-top: auto;" >
            <el-col>
            <el-steps :space="200" :active="2" finish-status="success" align-center>
                <el-step title="Moi"></el-step>
                <el-step title="Nous"></el-step>
                <el-step title="Projet"></el-step>
            </el-steps>
            </el-col>
        </el-row>

            <el-row class="hidden-md-and-up responsive-progress">
            <el-col style="margin: auto;">
            <el-steps :space="200" :active="2" finish-status="success" align-center>
                <el-step></el-step>
                <el-step></el-step>
                <el-step></el-step>
            </el-steps>
            </el-col>
            </el-row>
    </el-row>
</template>

<script>
import MobileDetect from 'mobile-detect';
export default {
    name: 'Project',
    data() {
        return {
            userEdited: null
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    created() {
        console.log(this.user);
        this.$http.get(this.$root.URL + '/auth/islogged').then(res => {
            if (res.data.isLogged == false) this.$router.replace({ name: 'Login' });
            else if (res.data.user.meta.firstConnexion == false) this.$router.replace({ name: 'Projet' });
            this.$store.commit('setUser', res.data.user);
            this.userEdited = res.data.user;
        });
    },
    methods: {
        sendInfo() {
            var formData = { user: this.userEdited };
            this.$http.post(this.$root.URL + '/account/edit', formData).then(res => {
                this.$localStorage.set('user', this.userEdited);
                this.$http.post(this.$root.URL + '/money/charge/free').then(res => {
                    var md = new MobileDetect(window.navigator.userAgent);
                    if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
                    else this.$router.push({ name: 'UploadPlans', params: { first: true } });
                });
            }, err => { this.$message.error(err.response.data.message); });
        }
    }
}
</script>

<style scoped>
.main-container {justify-content:flex-start;  flex-direction: column; height: 100%; width: 100%; min-height: 100vh; font-family: 'Poppins', 'sans-serif'; background-color: #F8F9FA;}
.logo { height: 54px; }
.circles { position: absolute; left: -30px; top: 50%; height: 259px; width: auto; }
.container { width: 55%; border-radius: 4px; background: #FFFFFF; padding: 20px 50px 30px 50px;box-shadow: 0 0 12px 3px rgba(0, 0, 0, .05);}

.title { margin-bottom: 2rem; font-size: 28px; line-height: 1.4; color: #2B396A; text-align: center; }

.etapes-projet {
    flex-flow: row wrap !important;
}

.mip-step {justify-content: center; display: flex; flex-direction: column; border: solid 1px #EAEBF0; border-radius: 4px; margin: 10px; height: 18vh; width: 18vh; position: relative; transition: all .2s ease; }
.mip-step.is-true { border: solid 2px #48BEFE; height: calc(18vh - 2px); width: calc(18vh - 2px); transition: all .2s ease; }
.mip-step:hover { cursor: pointer; box-shadow: 0px 6px 10px 0px rgba(0, 0, 0, .07); transform: translate3D(0, -1px, 0) scale(1.05); transition: all 0.4s ease;   }
.mip-step:hover .checkbox {visibility: visible;}
.mip-step .checkbox { height: 20px; width: auto; position: absolute; top: 8px; right: 8px; visibility: hidden; }
.mip-step.is-true .checkbox { visibility: visible; }
.mip-step .icon { height: 5vh; width: auto; position: absolute; left: 0; right: 0; margin: 0 auto; top: 20%; }
.mip-step .desc { font-size: 14px; color: #2B396A; text-align: center; position: absolute; left: 0; right: 0; margin: 0 auto; bottom: 20%; }

.el-button { font-size: 21px; color: #FFFFFF; border-radius: 4px; background: #48BEFE; border-color: #48BEFE; text-align: center; min-width: 150px; width: 30%; margin-top: 10px; }
.el-button:hover { opacity: 0.8; }

.logo-container {
    margin: 2rem 0;
}

@media only screen and (min-width: 300px) and (max-width: 767px) {
    /* .mip-step:hover .checkbox, .mip-step:active .checkbox, .mip-step:focus .checkbox {visibility: hidden;}
    .mip-step .checkbox {
        height: 12px;
    } */
    .mip-step:hover { box-shadow: none; transform: none;  }
    .mip-step { width: 21vh; margin: 10px 5px; flex: 1; }
    .mip-step .desc { font-size: 12px !important; }
    .mip-step .icon {height: 4vh;}
    .main-container {

    }
    .container {
        width: 90vw !important;
        padding: .5rem 1rem;
        margin-bottom: 4rem;
    }

    .container .title {
        font-size: .9rem;
        padding: 0;
        margin: .5rem 0 .5rem;
        /* text-align: left; */
    }
    .label {font-size: .7rem; }
    .el-steps--horizontal {
        margin: 0 auto;
        font-size: .7rem;
        width: 90vw;
}
.logo-container {
    margin: 1rem 0 0;
}
.logo { margin: 0 0 .5rem;height: 1.5rem; width: auto;}
.onboard-progress {
    display: none;
}
.el-button {
    font-size: 1rem;
    width: 100%;
}

.el-input {
    margin-bottom: .5vh;
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

}

@media screen and (max-width: 1188px) {
    .mip-step:hover { box-shadow: none; transform: none;  }
    .main-container {height: 100%;  min-height: 100vh; align-content: start; }
    .container {
        width: 92%;

    }
    .etapes-projet {
        flex-direction: column;
    }

            .el-steps--horizontal {
    width: 70vw !important;
    margin: 0  auto;

}

.mip-step {
    box-sizing: border-box;
}
    .mip-step .desc {
        line-height: 1.3;
        font-size: 16px;
        margin-top: 0;
        /* position: relative; */
        /* bottom: 0rem; */
        bottom: 13%;
    }
}




</style>
