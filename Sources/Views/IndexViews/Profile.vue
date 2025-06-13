<template>
    <div class="main-container">
        <el-row type="flex" align="bottom" class="header">
            <h1>Mon profil</h1>
        </el-row>

        <el-tabs tab-position="left">
            <el-tab-pane label="Informations" style="min-height: 800px;">
                <el-row class="profile-container" :gutter="42" style="margin-top: .1rem; margin-left: 1rem;">
                    <el-col v-if="!showEdit" :xs="12" :sm="12" :md="12" :lg="6" :xl="6" class="profile-item">
                        <div class="user-card">
                            <div class="user-edit">
                                <a href="#" @click="editProfile(0)">Modifier</a>
                            </div>
                            <img class="user-pic" :src="user.info[0].picture == '' ?'/Assets/avatar-default-man.png' : '/Upload/Profile/' + user.info[0].picture">
                            <br style="clear: both;"/>
                            <h2>{{ user.info[0].firstName }}</h2>
                            <div class="user-email" v-if="user.info">
                                {{ user.info[0].mail }}
                            </div>
                        </div>
                    </el-col>
                    <el-col v-if="showEdit" :xs="12" :sm="12" :md="12" :lg="6" :xl="6" class="profile-item">
                        <div class="user-card edit-mode">
                            <div class="user-edit">
                                <a href="#" @click="saveProfile(0)">Enregistrer</a>
                            </div>
                            <div>
                                <croppa width="120" height="120" @file-choose="handleCroppaFileChoose" @click="canEdit()" v-model="croppa" :prevent-white-space="true" :show-remove-button="false" placeholder="Choisir une image" :disable-drag-to-move="!canResize" :disable-scroll-to-zoom="!canResize" :initial-image="isImage() == '' ?'/Assets/avatar-default-man.png' : '/upload/Profile/' + user.info[0].picture" canvas-color="#ffff" @init="onInit"></croppa>
                            </div>
                            <div class="user-name">
                                <label class="label">Prénom</label>
                                <el-input v-model="userEdit.firstName" class="large" type="text"></el-input>

                                <label class="label">Nom</label>
                                <el-input v-model="userEdit.lastName" class="large" type="text"></el-input>

                                <label class="label">Email</label>
                                <el-input v-model="userEdit.mail" class="large" type="email"></el-input>
                            </div>
                        </div>
                    </el-col>

                    <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" class="profile-item" v-if="user.info[1].firstName != '' && !showPartnerEdit">
                        <div class="user-card">
                            <div class="user-edit">
                                <a href="#" @click="editProfile(1)">Modifier</a>
                            </div>
                            <img class="user-pic" :src="user.info[1].picture == '' ?'/Assets/avatar-default-man.png' : '/Upload/Profile/' + user.info[1].picture">
                            <br style="clear: both;"/>
                            <h2>{{ user.info[1].firstName }}</h2>
                            <div class="user-email" v-if="user.info">
                                {{ user.info[1].mail }}
                            </div>
                        </div>
                    </el-col>

                    <el-col :xs="12" :sm="12" :md="12" :lg="6" :xl="6" class="profile-item partner" v-if="user.info[1].firstName == '' && !showPartnerEdit">
                        <div class="user-card" @click="addPartner()">
                            <div class="user-edit">
                                <a href="#">Ajouter</a>
                            </div>
                            <el-button class="partner-new">
                                <img src="https://app.madeinplan.fr/Assets/heart.svg" style="height: 3rem;margin-bottom: 0rem;"><br>
                                <p>Parfois, c'est mieux à deux</p>
                            </el-button>
                        </div>
                    </el-col>

                    <el-col v-if="showPartnerEdit" :xs="12" :sm="12" :md="12" :lg="6" :xl="6" class="profile-item">
                        <div class="user-card edit-mode">
                            <div class="user-edit">
                                <a href="#" @click="saveProfile(1)">Enregistrer</a>
                            </div>
                            <div>
                                <croppa width="120" height="120" @file-choose="handleCroppaFileChoose" @click="canEdit()" v-model="croppa" :prevent-white-space="true" :show-remove-button="false" placeholder="Choisir une image" :disable-drag-to-move="!canResize" :disable-scroll-to-zoom="!canResize" :initial-image="isImage() == '' ?'/Assets/avatar-default-man.png' : '/upload/Profile/' + user.info[1].picture" canvas-color="#ffff" @init="onInit"></croppa>
                            </div>
                            <div class="user-name">
                                <label class="label">Prénom</label>
                                <el-input v-model="userEdit.firstName" class="large" type="text"></el-input>

                                <label class="label">Nom</label>
                                <el-input v-model="userEdit.lastName" class="large" type="text"></el-input>

                                <label class="label">Email</label>
                                <el-input v-model="userEdit.mail" class="large" type="email"></el-input>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>

            <el-tab-pane v-if="user.local && user.local.password != undefined" label="Mot de passe">
                <el-row class="profile-container" :gutter="42" style="margin-top: .1rem; margin-left: 1rem;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="6">
                        <label class="label">Mot de passe actuel</label>
                        <el-input v-model="editPassword.oldPass" type="password"></el-input>

                        <label class="label">Nouveau mot de passe</label>
                        <el-input v-model="editPassword.newPass" ref="newPass" type="password"></el-input>

                        <label class="label">Confirmer Nouveau mot de passe</label>
                        <el-input v-model="editPassword.newPass2" ref="newPass2" type="password"></el-input>
                        <label class="label error-password" v-if="editPassword.error.length > 0">{{ editPassword.error }}</label>

                        <el-button @click="handleChangePassword()" type="primary" style="margin-top: 12px;">Enregistrer</el-button>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showEdit: false,
            canResize: false,
            showPartnerEdit: false,
            imageChange: {
                bool: false,
                name: ''
            },
            userEdit: {
                index: 0,
                picture: '',
                firstName: '',
                lastName: '',
                mail: '',
                phone: ''
            },
            editPassword: {
                oldPass: '',
                newPass: '',
                newPass2: '',
                error: ''
            }
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    watch: {
        'editPassword.newPass': function(item) {
            if (this.editPassword.newPass2.length > 0) {
                if (item != this.editPassword.newPass2) {
                    this.$refs.newPass.$el.firstElementChild.style.border = 'inherit';
                    this.$refs.newPass2.$el.firstElementChild.style.border = 'solid 1px #ff5252';
                    this.editPassword.error = 'Les deux mots de passe doivent être identiques';
                } else {
                    this.$refs.newPass.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                    this.$refs.newPass2.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                    this.editPassword.error = '';
                }
            }
        },
        'editPassword.newPass2': function(item) {
            if (item != this.editPassword.newPass) {
                this.$refs.newPass.$el.firstElementChild.style.border = 'solid 1px #D7DAE2';
                this.$refs.newPass2.$el.firstElementChild.style.border = 'solid 1px #ff5252';
                this.editPassword.error = 'Les deux mots de passe doivent être identiques';
            } else {
                this.$refs.newPass.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                this.$refs.newPass2.$el.firstElementChild.style.border = 'solid 1px #2ecc71';
                this.editPassword.error = '';
            }
        }
    },
    methods: {
        isImage() {
            if (!this.croppa) return true;
            return (this.croppa.hasImage())
        },
        canEdit() {
            if (this.canResize == false && this.croppa.hasImage()) this.croppa.chooseFile();
            this.canResize = true;
        },
        onInit() {
            this.croppa.addClipPlugin(function (ctx, x, y, w, h) {
                ctx.beginPath()
                ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
                ctx.closePath()
            })
        },
        addPartner() {
            this.editProfile(1);
        },
        editProfile(index) {
            if (index == 0 && this.showPartnerEdit == true) {
                this.saveProfile(1);
            } else if (index == 1 && this.showEdit == true) {
                this.saveProfile(0);
            }
            this.userEdit = {
                index: index,
                picture: this.user.info[index].picture || '',
                firstName: this.user.info[index].firstName,
                lastName: this.user.info[index].lastName,
                mail: this.user.info[index].mail,
                phone: this.user.info[index].phone
            }
            if (index == 0) {
                this.showEdit = !this.showEdit;
                this.showPartnerEdit = false;
            } else if (index == 1) {
                this.showPartnerEdit = !this.showPartnerEdit;
                this.showEdit = false;
            }
        },
        handleCroppaFileChoose(file) {
            this.imageChange.bool = true;
            this.imageChange.name = file.name;
        },
        saveProfile(index) {
            this.canResize = false;
            if (this.userEdit.firstName == '' || this.userEdit.lastName == '' || this.userEdit.mail == '') {
                this.$message.error('Les champs nom, prénom et e-mail doivent être remplis');
                return;
            }
            if (this.croppa && this.imageChange.bool == true) {
                this.croppa.generateBlob(blob => {
                    const config = { headers: { 'content-type': 'multipart/form-data' } };
                    const formData = new FormData();
                    formData.append('image', blob);
                    formData.append('index', index);
                    formData.append('name', this.imageChange.name);

                    this.$http.post('/account/upload-picture', formData, config).then(res => {
                        this.userEdit.picture = res.data.url;
                        var info = this.$store.state.user.info;
                        info[index].picture = res.data.url || '';
                        this.$store.commit('setUserInfos', info);
                        this.imageChange.bool = false;
                    });
                });
            }
            var info = this.$store.state.user.info;
            info[index] = this.userEdit
            info[index].mail = info[index].mail.toLowerCase();
            this.$store.commit('setUserInfos', []);
            this.$store.commit('setUserInfos', info);

            this.$http.post('/account/edit', { user: this.user }).then(res => {});
            if (index == 0) this.showEdit = !this.showEdit
            if (index == 1) this.showPartnerEdit = !this.showPartnerEdit
        },
        handleChangePassword() {
            if (this.editPassword.oldPass == '' || this.editPassword.newPass == '' || this.editPassword.newPass2 == '') {
                this.$message.error('Les champs mot de passe doit être complet');
            } else if (this.editPassword.newPass != this.editPassword.newPass2) {
                return;
            } else {
                this.$http.post('/account/edit-password', { oldPassord: this.editPassword.oldPass, newPassord: this.editPassword.newPass }).then(res => {
                    var self = this;
                    this.$swal({ title: res.data.message, type: 'success', showConfirmButton: false, timer: 2000 });
                    this.editPassword.oldPass = '';
                    this.editPassword.newPass = '';
                    this.editPassword.newPass2 = '';
                    this.$nextTick(() => {
                        self.$refs.newPass.$el.firstElementChild.style.border = 'solid 1px #D7DAE2';
                        self.$refs.newPass2.$el.firstElementChild.style.border = 'solid 1px #D7DAE2';
                    });
                }, err => {
                    this.$message.error(err.response.data.message);
                });
            }
        }
    }
};
</script>

<style scoped>

.profile-container { display: flex; align-items: stretch; align-content: center; }

.user-card { display: flex; flex-direction: column; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); padding: 1.2rem 1rem; align-items: center; box-sizing: border-box; min-height: 322px; border-radius: 4px; }

.partner .user-card { cursor: pointer; }

.partner .user-card:hover img { animation: shake 0.5s; }

.partner .user-card:hover { }

.partner-new { margin: auto 0; border: none; color: #31BDFC; font-size: 1.2rem; font-weight: 400; }

.partner-new { background: none; }

.partner-new i { font-size: 1.2rem; position: relative; top: 1px; }

.user-card h2 { color: rgba(35, 49, 88, 1); margin: 0; margin-bottom: 0rem; font-size: 1.6rem; font-weight: 600; }

.user-edit { margin-left: auto; margin-bottom: 1rem; box-sizing: border-box; }

.user-edit a { color: #31BDFC; text-decoration: none; font-size: .9rem; padding: 5px; box-sizing: border-box; border: 1px solid transparent; }
.user-edit a:hover { opacity: .8; }

.user-pic { border: dashed 2px transparent; margin-bottom: .6rem; border-radius: 50%; height: 120px; width: 120px; }

.edit-mode .user-pic { border: dashed 2px grey; width: 120px; }

.user-name h3 { margin: 0; font-weight: 500; color: rgba(35, 49, 88, 1); }

.user-email { color: rgba(35, 49, 88, .6); font-size: .9rem; margin-bottom: 1rem; }

.label { text-transform: uppercase; letter-spacing: 1px; font-size: .8rem; font-weight: 500; color: rgba(35, 49, 88, .6); }
.label.error-password { color: red; text-transform: none; font-size: 12px; letter-spacing: 0px; position: absolute; bottom: 48px; }

.el-input { margin-bottom: 1.2rem; }
</style>
