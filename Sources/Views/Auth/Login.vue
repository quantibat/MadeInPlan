<template id="loginVue">
    <el-row class="main-container" type="flex" align="middle" justify="center">
        <!-- <img class="circles" src="/Assets/circles.svg"> -->
        <el-row class="container" type="flex">
            <el-row class="logo-container" type="flex" align="middle" justify="center">
                <img class="logo" src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x">
            </el-row>
            <el-row class="header" type="flex" align="middle" justify="center">
                <p class="title">Tous les outils pour faire construire votre maison de A à Z.</p>
            </el-row>
            <el-row type="flex" align="middle" class="form">

                <el-row class="email-login">
                    <label class="label">Email</label>
                    <el-input autofocus class="large" type="mail" name="email" auto-complete v-model="mail"></el-input>

                    <label class="label">Mot de passe</label>
                    <div class="password">
                    <el-input class="large" type="password" name="password" auto-complete v-model="password" @keyup.enter="handleLogin()"></el-input>
                    <router-link class="link2" :to="{ name: 'ResetPassword', params: { 'mail': mail }}">Oublié ?</router-link>
                    </div>

                    <el-row type="flex" class="action" justify="space-between">
                        <el-button class="login" @click="handleLogin()">Connexion</el-button>
                    </el-row>
                </el-row>

                <el-row class="login-separator">ou</el-row>

                <el-row class="social-login">

                    <a class="button google-button" href="/auth/google">
                        <el-row type="flex" align="middle">
                            <img src="/Assets/google.png">
                            <span>Connexion avec Google</span>
                        </el-row>
                    </a>
                    <a class="button facebook-button" href="/auth/facebook">
                        <el-row type="flex" align="middle">
                            <img src="/Assets/facebook.svg">
                            <span>Connexion avec Facebook</span>
                        </el-row>
                    </a>
                </el-row>

            </el-row>
        </el-row>
    </el-row>
</template>

<script>
import MobileDetect from 'mobile-detect';

export default {
    name: 'Login',
    data() {
        return {
            mail: '',
            password: '',
            res: {
                message: ''
            },
            radio3: 'Oui'
        }
    },
    beforeMount() {
        this.$localStorage.set('user', null);
    },
    methods: {
        handleLogin() {
            if (this.mail == '' || this.password == '') {
                this.$message({ showClose: true, type: 'error', message: 'Les champs ci-dessous doivent être complets' });
                this.password = '';
                return;
            }
            var formData = {
                mail: this.mail.toLowerCase(),
                password: this.password
            }
            this.$http.post(this.$root.URL + '/auth/login', formData).then(res => {
                this.$localStorage.set('user', res.data.user);
                if (res.data.user.active == false) {
                    this.$message.error('Votre compte n\'est pas activé');
                    this.password = '';
                    return;
                } else if (res.data.user.meta.firstConnexion == true) {
                    this.$router.push({ name: 'Welcome-1' });
                } else {
                    var md = new MobileDetect(window.navigator.userAgent);

                    if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
                    else this.$router.push({ name: 'Index' });
                }
            }, error => {
                this.$message.error(error.response.data.message);
                this.password = '';
            });
        }
    }
}
</script>

<style scoped>
.main-container { height: 100%; width: 100%; min-height: 100vh; font-family: 'Poppins', 'sans-serif'; background-color: #F8F9FA; }

.container { flex-direction: column; align-items: center; border-radius: 6px; background: #FFFFFF;padding: 1.5rem 0; box-shadow: 0 4px 22px 0px rgba(0, 0, 0, .09); }

.logo { height: 4rem; width: auto; margin-bottom: 0px; margin-top: 40px; }
.title { margin-bottom: 4rem; font-size: 1.6rem; color: #9196AB; font-weight: 300; width: 65%; text-align: center; }


.form { margin: 1rem 0 50px; flex-direction: column; }

.social-login { width: 100%; }

.social-login .button { font-size: 16px;  margin: 1rem auto; padding: 10px 0px; border-radius: 4px; text-align: center; }
.social-login .button.google-button img, .social-login .button.facebook-button img { height: 1.5rem; width: auto; margin-left: 5%; }
.social-login .button.google-button span, .social-login .button.facebook-button span,
.social-login .button.email-button span { position: absolute; left: 25%; }


.social-login .button.email-button { border: solid 1px #31BDFC; background-color: white; color: #31BDFC; }
.social-login .button.google-button { border: solid 1px #FE6460; background-color: white; color: #FE6460; }
.social-login .button.facebook-button { border: solid 1px #36599F; background-color: white; color: #36599F; }
.social-login .button.facebook-button img, .budicon { margin-left: 6%; }
.social-login a { text-decoration: none; font-size: 14px; font-weight: 400; display: block; color: #BFCBD9; }

.social-login i {
    font-size: 1.5rem;
}

.email-login { text-align: left; margin: 0; }

.email-login .title {  margin-bottom: 10px;font-size: 21px; color: #2B396A; font-weight: 500; width: 100%; text-align: left; }
.email-login .label { text-transform: uppercase; margin-bottom: -15px; text-align: left; color: #2B396A; opacity: 0.5; letter-spacing: 1px; font-weight: 400; font-size: 15px; }

.email-login .el-input, .email-login .el-button { border-radius: 4px; }
.email-login .el-input { color: #484848; margin: 5px 0 20px; width: 100%; }
.email-login .el-input:focus { border: solid 1px #31BDFC; }


.email-login .action { margin: 0; width: 100%; flex-direction: column;  }
.email-login .action .el-button.login { border: 1px #31BDFC; background-color: #31BDFC; color: white; font-weight: 300; width: auto; font-size: 18px; padding: 15px 15px; margin-bottom: 15px; }
.email-login .action .el-button:hover { opacity: 0.8; }
.email-login .action .link {color: rgba(54, 89, 159, .9); text-decoration: none; font-size: 16px;  font-weight: 400; display: block; }

.login-separator {
    color: rgba(0, 0, 0, 0.228);
    position: relative;
    width: 100%;
    margin: auto;
    text-align: center;
    z-index: 99;
    font-size: .9rem;
}

.login-separator::before, .login-separator::after {
    content: '';
    position: absolute;
    height: 1px;
    top: .7rem;

    width: 45%;
    background: rgba(0, 0, 0, 0.1);
    z-index: -1;
}

.login-separator::before {
    left: 0;
}

.login-separator::after {
    right: 0;
}

@media only screen and (min-width: 300px) and (max-width: 767px) {
.el-input {
    margin-bottom: .5vh;
}
    .main-container {
        display: flex;
        align-items: center;
        flex-direction: column;
        /* width: 100vw; */
        /* height:   100vh; */
        background: rgba(54, 89, 159, .04);
        /* justify-content:flex-start; */
    }
    .header .title {
        display: none;
    }


   .container {
        padding: 2rem;
        display: flex;
        align-items: center;
        margin: auto;
        border-radius: 0px;
        height: 100%;
    }
    .logo-container {
        /* background:rgba(54, 89, 159, .05); */
        width: 100%;
    }
.logo { height: 2rem; width: auto; margin-bottom: 0rem; margin-top: 1rem; }

  .form {
      flex-direction: column;


  }
  .social-login {
      position: relative;
  }

  .email-login .action .el-button.login { background-color: #31BDFC; color: white; font-weight: 400; width: auto; font-size: 1rem; padding: .8rem; margin-bottom: .9rem; }

    .social-login .button {
      width: 100%;
      font-size: 16px;
      padding: 7px 0;
  }



  .social-login::after {
      display: none;
  }

      .title {
        font-size: 4vw !important;
        line-height: 1.5;
        opacity: .2;
        text-align: center !important;
    }

.email-login .label {font-size: .8rem; }

.email-login .el-input input {height: 1rem; }

.social-login span {
    font-size: .9rem;
}

.social-login i {
    font-size: 1.5rem;
}

.social-login img {
    height: 1.5rem !important;
}



}

@media only screen and (min-width: 768px) and (max-width: 1188px) and (orientation: portrait) {




        .main-container {
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 100vw;
            height: 100vh;
        }
   .container {
        padding: 1rem;
        display: flex;
        align-items: center;
        margin: auto;
        border-radius: 8px;

    }
    .logo { height: 2rem; width: auto; margin-bottom: 0px; margin-top: 40px; }
    .title {
        font-size: .9em; line-height: 1.5;
    }
  .form {
      flex-direction: column;
  }
  .separator {
      display: none;
  }
  .social-login .button {
      width: 100%;
      font-size: 16px;
      padding: 10px 0;
  }
  .social-login .button.google-button span, .social-login .button.facebook-button span { left: 0; right: 0; }
  .social-login::after { display: none; }
  .email-login {padding: 0 }
  .email-login .el-button {
      width: 100%;
      }


.email-login .title { text-align: center;  }

}



.password {position: relative; }
.link2 {position: absolute; z-index: 1000; top: 27%; bottom: 25%; right: 1em; font-size: .9em; text-decoration: none; color: rgba(54, 89, 159, .5)}
.link2:hover {color: rgba(54, 89, 159, .8)}


</style>
