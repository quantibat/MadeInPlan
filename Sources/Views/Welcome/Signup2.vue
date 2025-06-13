<template id="signup">
    <el-row class="signup main-container" type="flex" align="middle" justify="center" @keyup.enter="handleSignup()">

        <el-row class="logo-container">
            <img class="logo" src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x">
        </el-row>

        <el-row class="container">
            <p class="title">Vos Informations</p>

            <label class="label">Prénom</label>
            <el-input autofocus tabindex="1" class="large" type="text" name="fname" auto-complete v-model="firstName"></el-input>

            <label class="label">Nom</label>
            <el-input tabindex="2" class="large" type="text" name="lname" auto-complete v-model="lastName"></el-input>

            <label class="label">Email</label>
            <el-input tabindex="3" class="large" type="email" name="email" auto-complete v-model="mail"></el-input>

            <label class="label">Mot de passe</label>
            <el-input tabindex="4" class="large" type="password" name="password" auto-complete v-model="password" @keyup.enter="handleSignup()"></el-input>

            <el-row type="flex" justify="center">
                <el-button tabindex="5" @click="handleSignup()">En avant !</el-button>
            </el-row>
            <!-- <router-link class="link" :to="{ name: 'Login'}">Déjà inscrit ?</router-link> -->
        </el-row>

        <el-row class="onboard-progress" style="margin-top: auto;" >
            <el-col>
            <el-steps :space="200" :active="0" finish-status="success" align-center>
                <el-step title="Moi"></el-step>
                <el-step title="Nous"></el-step>
                <el-step title="Projet"></el-step>
            </el-steps>
            </el-col>
        </el-row>

            <el-row class="hidden-md-and-up responsive-progress">
            <el-col>
            <el-steps :space="200" :active="0" finish-status="success" align-center>
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
    name: "Signup",
    data() {
        return {
            mail: "",
            password: "",
            firstName: "",
            lastName: ""
        };
    },
    methods: {
        handleSignup(ev) {
            if (
                this.mail == "" ||
                this.password == "" ||
                this.firstName == "" ||
                this.lastName == ""
            ) {
                this.$message({
                    showClose: true,
                    type: "error",
                    message: "Les champs ci-dessous doivent être complets"
                });
                this.password = "";
                return;
            } else if (this.mail.indexOf("@") == -1 || this.mail.indexOf(".") == -1) {
                this.$message({
                    showClose: true,
                    type: "error",
                    message: "Adresse e-mail invalide"
                });
                this.password = "";
                return;
            }
            var formData = {
                mail: this.mail.toLowerCase(),
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName
            };
            this.$http.post(this.$root.URL + "/auth/signup", formData).then(
                res => {
                    this.$swal({ title: res.data.message, type: "success", allowOutsideClick:false, showConfirmButton: false });
                    // Check with marvin
                    heap.identify(formData.mail, 'email');
                },
                error => {
                    this.$message.error(error.response.data.message);
                    this.password = "";
                }
            );
        }
    }
};
</script>
<style scoped>
.main-container {
    flex-direction: column;
    height: 100%;
    width: 100%;
    min-height: 100vh;
    font-family: "Poppins", "sans-serif";
    background-color: #f8f9fa;
    justify-content:flex-start;
}
.logo {
    width: auto;
    height: 54px;
}
.circles {
    position: absolute;
    left: -30px;
    top: 50%;
    height: 259px;
    width: auto;
}
.container {
    border-radius: 4px;
    background: #ffffff;
    padding: 20px 60px 40px 60px;
    box-shadow: 0 0 12px 3px rgba(0, 0, 0, .05);
}

.title {
    margin-bottom: 2rem;
    font-size: 28px;
    line-height: 1.4;
    color: #2b396a;
    text-align: center;
}
.label {
    text-transform: uppercase;
    margin-bottom: -15px;
    text-align: left;
    color: #2b396a;
    opacity: 0.5;
    letter-spacing: 1px;
    font-weight: 400;
    font-size: 15px;
}

.el-input {
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 18px;
    color: #2b396a;
    width: 100%;
}
.el-input:focus {
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
}

.el-button {
    font-size: 21px;
    color: #ffffff;
    border-radius: 4px;
    background: #48befe;
    border-color: #48befe;
    text-align: center;
    min-width: 150px;
    width: 100%;
    margin-top: 10px;
}
.el-button:hover {
    opacity: 0.8;
}
.link {
    text-decoration: none;
    font-size: 18px;
    color: #2b396a;
    font-weight: 400;
    display: block;
    text-align: center;
    margin-top: 15px;
}

.swal2-popup .swal2-title {
    color: #2b396a !important;
    font-weight: 400 !important;
}

.logo-container {
    margin: 2rem 0;
}

@media only screen and (min-width: 300px) and (max-width: 767px) {
    .main-container {

    }
    .container {
        width: 90vw;
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



@media only screen and (min-width: 768px) and (max-width: 1023px) {
    .responsive-progress {
        display: none;
}
    .container {
        width: 60%;
    }
    .el-steps--horizontal {
    width: 50vw;
    /* text-align: center;   */
    /* margin: auto; */
}
}
@media only screen and (min-width: 1024px) and (max-width: 1219px) {
    .container {
        width: 50%;
    }
    .el-steps--horizontal {
    width: 70vw;
    margin: auto;
}
}
@media only screen and (min-width: 1220px) and (max-width: 1439px) {
    .container {
        width: 40%;
    }
}
@media only screen and (min-width: 1440px) and (max-width: 1639px) {
    .container {
        width: 30%;
    }
}
@media only screen and (min-width: 1640px) {
    .container {
        width: 25%;
    }
}

@media only screen and (max-width: 1188px) and (orientation: landscape) {

      .container {


    }
        .form {

    }
}

</style>
