<template id="ResetPassword">
    <el-row class="main-container" type="flex" align="middle" justify="center">
        <img class="logo" src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x">
        <img class="circles" src="/Assets/circles.svg">
        <el-row class="container">
            <p class="title">Mot de passe oublié ?</p>
            <p style="text-align: center; color: rgba(33, 45, 89, .4);">Saisissez votre adresse email pour réinitialiser votre mot de passe.</p>

            <label class="label">Email</label>
            <el-input autofocus class="large" type="mail" v-model="mail" @keyup.enter="handleReset()"></el-input>

            <el-row type="flex" justify="center">
                <el-button @click="handleReset()">Réinitialiser</el-button>
            </el-row>
            <!-- <router-link class="link" :to="{ name: 'Login'}">Déjà inscrit ?</router-link> -->
        </el-row>
    </el-row>
</template>

<script>
export default {
    name: 'ResetPassword',
    data() {
        return {
            mail: ''
        }
    },
    mounted() {
        this.mail = this.$route.params.mail;
    },
    methods: {
        handleReset() {
            if (this.mail == '') {
                this.$message({
                    showClose: true,
                    type: 'error',
                    message: 'Le champs ci-dessous doit être complet'
                });
                return;
            }
            var formData = { mail: this.mail };
            this.$http.post(this.$root.URL + '/auth/resetpassword', formData).then(res => {
                this.mail = '';
                this.$swal({ title: 'Un email contenant les instructions     vous a été envoyé', type: 'success', showConfirmButton: false, allowOutsideClick: false });
            }, err => {
                this.$message.error(err.response.data.message);
            });
        }
    }
}
</script>

<style scoped>
.main-container { height: 100%; width: 100%; min-height: 100vh; font-family: 'Poppins', 'sans-serif'; background-color: #F8F9FA; }
.logo { width: auto; height: 54px; position: absolute; top: 8%; }
.circles { position: absolute; left: -30px; top: 50%; height: 259px; width: auto; }
.container { border-radius: 4px; background: #FFFFFF; padding: 20px 30px 40px 30px; box-shadow: 0 3px 6px rgba(0, 0, 0, .16); }

.heart { position: absolute; top: 40%; left: 0; right: 0; width: 100px; height: auto; margin: 0 auto; }

.title { margin-bottom: 0px; font-size: 28px; line-height: 1.4; color: #2B396A; text-align: center; }
.sub-title { font-size: 24px; color: #2B396A; }
.label { margin-bottom: -15px; text-align: left; color: #2B396A; opacity: 0.5; font-weight: 500; letter-spacing: 1px; font-size: 15px; text-transform: uppercase; }

.el-input { border-radius: 4px; margin-bottom: 20px; font-size: 18px; color: #2B396A; width: 100%; }
.el-input:focus { box-shadow: 0 0 6px rgba(0, 0, 0, .16); }

.el-button { font-size: 21px; color: #FFFFFF; border-radius: 4px; background: #48BEFE; border-color: #48BEFE; text-align: center; min-width: 150px; width: 100%; margin-top: 10px; }
.el-button:hover { opacity: 0.8; }
.link { text-decoration: none; font-size: 16px; color: rgba(33, 45, 89, .4); font-weight: 400; display: block;text-align: center; margin-top: 32px; }

@media only screen and (min-width: 321px) and (max-width: 767px) { .container { width: 90%; } }
@media only screen and (min-width: 768px) and (max-width: 1023px) { .container { width: 60%; } }
@media only screen and (min-width: 1024px) and (max-width: 1219px) { .container { width: 50%; } }
@media only screen and (min-width: 1220px) and (max-width: 1439px) { .container { width: 40%; } }
@media only screen and (min-width: 1440px) and (max-width: 1639px) { .container { width: 30%; } }
@media only screen and (min-width: 1640px) { .container { width: 25%; } }

</style>
