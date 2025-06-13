<template>
    <el-row class="main-container" type="flex" align="middle" justify="center">
        <img class="logo" src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x">
        <img class="circles" src="/Assets/circles.svg">
        <el-row class="container">
            <p class="title">Saisissez un nouveau mot de passe</p>

            <label class="label">Nouveau mot de passe</label>
            <el-input autofocus class="large" type="password" ref="passwordOne" v-model="passwordOne"></el-input>

            <label class="label">Confirmer nouveau mot de passe</label>
            <el-input class="large" type="password" ref="passwordTwo" v-model="passwordTwo"></el-input>
            <label class="label error-password" v-if="editError.length > 0">{{ editError }}</label>

            <el-row type="flex" justify="center">
                <el-button @click="handleReset()">Réinitialiser</el-button>
            </el-row>
        </el-row>
    </el-row>
</template>

<script>
import MobileDetect from 'mobile-detect';

export default {
    name: 'ResetPassword',
    data() {
        return {
            passwordOne: '',
            passwordTwo: '',
            editError: ''
        }
    },
    mounted() {
        this.mail = this.$route.params.mail;
    },
    watch: {
        'passwordOne': function(value) {
            if (this.passwordTwo.length > 0) {
                if (value != this.passwordTwo) {
                    this.$refs.passwordOne.$el.firstElementChild.style.border = 'solid 1px #D7DAE2';
                    this.$refs.passwordTwo.$el.firstElementChild.style.border = 'solid 1px #ff5252';
                    this.editError = 'Les deux mots de passes doivent être identiques';
                } else {
                    this.$refs.passwordOne.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                    this.$refs.passwordTwo.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                    this.editError = '';
                }
            }
        },
        'passwordTwo': function(value) {
            if (value != this.passwordOne) {
                this.$refs.passwordOne.$el.firstElementChild.style.border = 'solid 1px #D7DAE2';
                this.$refs.passwordTwo.$el.firstElementChild.style.border = 'solid 1px #ff5252';
                this.editError = 'Les deux mots de passe doivent être identiques';
            } else {
                this.$refs.passwordOne.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                this.$refs.passwordTwo.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                this.editError = '';
            }
        }
    },
    methods: {
        handleReset() {
            if (this.passwordOne == '' || this.passwordTwo == '') {
                this.$message.error('Les champs ci-dessous doivent être remplis');
                return;
            }
            else if (this.passwordOne != this.passwordTwo) {
                this.$message.error('Les deux mot de passe ne sont pas identiques');
                return;
            }
            var formData = { password: this.passwordOne };
            this.$http.post(this.$root.URL + '/auth/reset/' + this.$route.params.token, formData).then(res => {
                this.$swal({ title: 'Votre mot de passe a été bien modifié', type: 'success', showConfirmButton: false, timer: 2000 });
                this.$localStorage.set('user', res.data.user);

                if (res.data.user.meta.firstConnexion == true) this.$router.push({ name: 'Welcome-1' });
                else {
                    var md = new MobileDetect(window.navigator.userAgent);

                    if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
                    else this.$router.push({ name: 'Index' });
                }
            }, error => {
                this.$message.error(error.response.data.message);
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

.title { margin-bottom: 2rem; font-size: 28px; line-height: 1.3; color: #2B396A; text-align: center; }
.sub-title { font-size: 24px; color: #2B396A; }

.label { text-transform: uppercase; letter-spacing: 1px; font-size: .8rem; font-weight: 500; color: rgba(35, 49, 88, .6); }
.label.error-password { color: #ff5252; text-transform: none; font-size: 12px; letter-spacing: 0px; position: absolute; bottom: 104px; }

.el-input { border-radius: 4px; margin-bottom: 20px; font-size: 18px; color: #2B396A; width: 100%; }
.el-input:focus { box-shadow: 0 0 6px rgba(0, 0, 0, .16); }

.el-button { font-size: 21px; color: #FFFFFF; border-radius: 4px; background: #48BEFE; border-color: #48BEFE; text-align: center; min-width: 150px; width: 100%; margin-top: 1.5rem; }
.el-button:hover { opacity: 0.8; }
.link { text-decoration: none; font-size: 18px; color: #2B396A; font-weight: 400; display: block;text-align: center; margin-top: 15px; }

@media only screen and (min-width: 321px) and (max-width: 767px) { .container { width: 90%; } }
@media only screen and (min-width: 768px) and (max-width: 1023px) { .container { width: 60%; } }
@media only screen and (min-width: 1024px) and (max-width: 1219px) { .container { width: 50%; } }
@media only screen and (min-width: 1220px) and (max-width: 1439px) { .container { width: 40%; } }
@media only screen and (min-width: 1440px) and (max-width: 1639px) { .container { width: 30%; } }
@media only screen and (min-width: 1640px) { .container { width: 25%; } }

</style>
