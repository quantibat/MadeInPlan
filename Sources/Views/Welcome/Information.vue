<template id="welcomeVue">
    <el-row class="main-container" type="flex" align="middle" v-if="userEdited != null">
        <el-row class="logo-container">
            <img class="logo" src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x">
        </el-row>

        <el-row class="container">
            <el-row type="flex" justify="center">
                <p class="title">Vivez-vous cette expérience à deux ?</p>
            </el-row>

            <el-row hidden-md-and-down class="hidden-md-and-down user-info" type="flex" justify="space-between">
                <el-col class="mip-col" :span="9">
                    <p class="sub-title">Vous</p>

                    <label class="label">Prénom</label>
                    <el-input class="large" type="text" v-model="userEdited.info[0].firstName"></el-input>

                    <label class="label">Nom</label>
                    <el-input class="large" type="text" v-model="userEdited.info[0].lastName"></el-input>

                    <label class="label">Email</label>
                    <el-input class="large" type="mail" v-model="userEdited.info[0].mail"></el-input>
                </el-col>
                <img class="heart" src="/Assets/heart.svg">
                <el-col class="mip-col" :span="9">
                    <p class="sub-title">Votre partenaire</p>

                    <label class="label">Prénom</label>
                    <el-input autofocus class="large" type="text" v-model="userEdited.info[1].firstName"></el-input>

                    <label class="label">Nom</label>
                    <el-input class="large" type="text" v-model="userEdited.info[1].lastName"></el-input>

                    <label class="label">Email</label>
                    <el-input class="large" type="mail" v-model="userEdited.info[1].mail"></el-input>
                </el-col>
            </el-row>

            <el-row hidden-lg-and-up class="hidden-lg-and-up user-info-m" type="flex">
                <el-col class="yes-no" :span="24">
                    <el-radio-group v-model="radio3">
                        <el-radio-button label="Oui">Oui</el-radio-button>
                        <el-radio-button label="Non">Non</el-radio-button>
                    </el-radio-group>
                </el-col>
                <el-col class="" :span="24">
                    <div v-if="radio3 === 'Oui'">
                        <label class="label">Nom de votre partenaire</label>
                        <el-input autofocus class="large" type="text" v-model="userEdited.info[1].lastName"></el-input>

                        <label class="label">Prénom de votre partenaire</label>
                        <el-input class="large" type="text" v-model="userEdited.info[1].firstName"></el-input>

                        <label class="label">Email de votre partenaire</label>
                        <el-input class="large" type="mail" v-model="userEdited.info[1].mail"></el-input>
                    </div>
                </el-col>
            </el-row>

            <el-row type="flex" justify="center">
                <el-button @click="sendInfo()">En avant !</el-button>
            </el-row>
        </el-row>

        <el-row class="onboard-progress" style="margin-top: auto;" >
            <el-col>
            <el-steps :space="200" :active="1" finish-status="success" align-center>
                <el-step title="Moi"></el-step>
                <el-step title="Nous"></el-step>
                <el-step title="Projet"></el-step>
            </el-steps>
            </el-col>
        </el-row>

            <el-row class="hidden-md-and-up responsive-progress">
            <el-col style="margin: auto;">
            <el-steps :space="200" :active="1" finish-status="success" align-center>
                <el-step></el-step>
                <el-step></el-step>
                <el-step></el-step>
            </el-steps>
            </el-col>
            </el-row>
    </el-row>
</template>

<script>
export default {
    name: 'Information',
    data() {
        return {
            userEdited: null,
            radio3: 'Oui'
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    created() {
        this.$http.get(this.$root.URL + '/auth/islogged').then(res => {
            if (res.data.isLogged == false) this.$router.replace({ name: 'Login' });
            else if (res.data.user.meta.firstConnexion == false) this.$router.replace({ name: 'Projet' });
            this.$store.commit('setUser', res.data.user);
            this.userEdited = res.data.user;
            heap.identify(res.data.user.info[0].mail, 'email');

        });
    },
    methods: {
        sendInfo() {
            if (this.userEdited.info[0].firstName == '' || this.userEdited.info[0].lastName == '') {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: 'Les champs nom et prénom doivent être complet'
                });
                return;
            }
            var formData = { user: this.userEdited };
            this.$http.post(this.$root.URL + '/account/edit', formData).then(res => {
                heap.identify(this.user.info[0].mail, 'email');
                this.$localStorage.set('user', this.userEdited);
                this.$router.push({ name: 'Welcome-2' });
            }, err => { this.$message.error(err.response.data.message); });
        }
    }
}
</script>

<style scoped>
.main-container { justify-content:flex-start; flex-direction: column; height: 100%; width: 100%; min-height: 100vh; font-family: 'Poppins', 'sans-serif'; background-color: #F8F9FA; }
.logo { height: 54px; }
.circles { position: absolute; left: -30px; top: 50%; height: 259px; width: auto; }
.container { width: 55%; border-radius: 4px; background: #FFFFFF; padding: 20px 50px 30px 50px; box-shadow: 0 0 12px 3px rgba(0, 0, 0, .05);}

.heart { position: absolute; top: 40%; left: 0; right: 0; width: 100px; height: auto; margin: 0 auto; animation: pulse 1s infinite;}

.title { margin-bottom: 2rem; font-size: 28px; line-height: 1.4; color: #2B396A; text-align: center; }
.sub-title { font-size: 24px; color: #2B396A; }
.label { text-transform: uppercase; margin-bottom: -15px; text-align: left; color: #2B396A; opacity: 0.5; letter-spacing: 1px; font-weight: 400; font-size: 15px; }

.el-input { border-radius: 4px; margin-bottom: 20px; font-size: 18px; color: #2B396A; }
.el-input:focus { box-shadow: 0 0 6px rgba(0, 0, 0, .16); }

.el-button { font-size: 21px; color: #FFFFFF; border-radius: 4px; background: #48BEFE; border-color: #48BEFE; text-align: center; min-width: 150px; width: 30%; margin-top: 10px; }
.el-button:hover { opacity: 0.8; }

.logo-container {
    margin: 2rem 0;
}

.user-info-m {
    flex-direction: column;
}

.yes-no {
    text-align: center;
    margin-bottom: 10px;
}

@media only screen and (min-width: 300px) and (max-width: 767px) {
    .main-container {

    }
    .container {
        width: 90vw !important;
        padding: .5rem 1.5rem;
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

.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #48BEFE !important;
border-color: #48BEFE !important;
}


}

@media screen and (max-width: 1188px) {

    .main-container { height: 100%;  min-height: 100vh; align-content: start; background-color: #F8F9FA; }
    .container {
        width: 60vw;

    }
    .user-info {
        flex-direction: column;
    }
    .heart {
        display: none;
    }
    .mip-col {
        width: 90%;
        margin: 0 auto;
    }


        .el-steps--horizontal {
    width: 70vw;
}
}
</style>
