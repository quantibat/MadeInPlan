<template>
    <div>
        <div class="header hidden-xs-only">
            <el-dialog style="text-align: center; background: rgba(255, 266, 255, .99);" custom-class="dialog__body" :visible.sync="showFeatureMissing" width="45%" :before-close="handleClose">
                <h3 style="margin-top: -5px; font-size: 2rem; font-weight: 600; line-height: 1.3; color: #4BC0FD; margin-bottom: 1rem;">Fonctionnalité bientôt disponible <span style="font-size: .8em">🙂</span></h3>
                <p style="font-size: 1rem; font-weight: 300;">
                    Faites nous vos suggestions ici <span style="font-size: 1.5rem;">👇</span>
                </p>
                <textarea style="min-height: 200px;" class="note-text" v-model="remarque.text" placeholder="Exemple :  je souhaiterais pouvoir estimer le prix de ..." @keyup="handleKeyup($event, this)"></textarea>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sendRemarque()" v-loading="loading">Envoyer</el-button>
                </span>
            </el-dialog>

            <el-dialog style="background: rgba(255, 255, 255, .95);" :visible.sync="communityDialog" top="6vh" :fullscreen="false" width="85%" :before-close="handleClose">
                <div class="modal-content">
                    <p class="name">Oups 😊</p><br>
                    <p class="desc">Notre communauté grandit ! Bientôt elle aura sa propre page ... </p>
                </div>
            </el-dialog>
            <el-row type="flex" align="middle" justify="space-between" class="app top">
                <el-row type="flex" align="middle">
                    <router-link class="header-logo" :to="{ name: 'Index' }">
                        <img src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x" class="logo">
                    </router-link>
                    <div class="header-links">
                        <router-link class="item-link" :to="{ name: 'Projet' }" style="font-weight: 600;">Mon projet</router-link>
                        <a target="_blank" href="https://www.facebook.com/groups/303091663578412/" class="item-link">Communauté</a>
                        <a class="item-link" href="https://blog.madeinplan.fr">Guides</a>
                        <a class="item-link" href="https://madeinplan.fr/lexique">Questions/Réponses</a>
                    </div>
                </el-row>

                <el-row class="user" align="middle">
                    <el-dropdown class="notification-dropdown" trigger="click" @visible-change="readNotifications">
                        <span class="el-dropdown-link">
                            <div class="notification">
                                <el-badge :value="unreadNotifs" class="item">
                                    <i class="budicon budicon-bell"></i>
                                </el-badge>

                                <div class="notification-label hidden-sm-and-down">
                                    Notifications
                                </div>
                            </div>
                        </span>
                        <el-dropdown-menu class="notification-list" slot="dropdown" ref="notification_list" v-loading="isNotifLoading">
                            <el-dropdown-item v-if="notifications.length == 0">
                                Vous n'avez aucune nouvelle notification 😊
                            </el-dropdown-item>
                            <el-dropdown-item v-else-if="notifications.length != 0" v-for="notif in loadedNotifs" :key="notif._id" class="notification-item">
                                <div @click="redirectToNotif(notif)"  class="notification-item-detail notification-img">
                                    <img :src="getSelectedIcon(notif)" alt="">
                                </div>
                                <div @click="redirectToNotif(notif)" class="notification-item-detail notification-body">
                                    <span class="notification-type"> {{ notif.category }}</span>
                                    <div v-html="notif.desc" class="notification-message">
                                    </div>
                                    <div class="notification-date">
                                        {{ getTimeFromNow(notif.date) }}
                                    </div>
                                </div>
                            </el-dropdown-item>
                            <div class="load-more" v-if="isNotifLoading && loadedNotifs.length < notifs.length">
                                <i class="el-icon-loading"></i>
                            </div>
                            <div class="load-more" v-else-if="loadedNotifs.length < notifs.length" @click="loadMoreNotifs">Charger plus...</div>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-dropdown class="user-dropdown" trigger="click">
                        <span class="el-dropdown-link">
                            <div class="user-settings">
                                <div class="user-picture">
                                    <img class="account-image" :src="user.info[0].picture == '' ? '/Assets/avatar-default-man.png' : '/Upload/Profile/' + user.info[0].picture">
                                </div>

                                <div class="user-name hidden-sm-and-down" v-if="user.info">
                                    {{ user.info[0].firstName }} {{ user.info[0].lastName }}
                                </div>

                                <div class="user-drop">
                                    <i class="budicon budicon-chevron-bottom"></i>
                                </div>
                            </div>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <router-link :to="{ name: 'Profile' }">
                                    <i class="budicon budicon-user"></i>
                                    Mon profil
                                </router-link>
                            </el-dropdown-item>

                            <el-dropdown-item>
                                <router-link :to="{ name: 'Subscription' }">
                                    <i class="budicon budicon-star"></i>
                                    Mon abonnement
                                </router-link>
                            </el-dropdown-item>

                            <el-dropdown-item>
                                <span @click="logout()">
                                    <i class="budicon budicon-logout"></i>
                                    Déconnexion
                                </span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-row>
            </el-row>
            <el-row type="flex" align="middle" justify="" class="app list">
                <router-link class="item" :to="{ name: 'Projet' }">
                    <img src="/Assets/Header/dashboard.svg" class="header-icon" />
                    <div class="name">Résumé</div>
                </router-link>
                <router-link class="item" :to="{ name: 'Maison' }">
                    <img style="height: 36px; position:relative; top: -4px; vertical-align: top;" src="/Assets/Header/monprojet.svg" class="header-icon" />
                    <div class="name">Projet</div>
                </router-link>
                <router-link :to="{ name: 'Todolist' }" class="item">
                    <img src="/Assets/Header/todolist.svg" class="header-icon" />
                    <div class="name">Tâches</div>
                </router-link>
                <router-link :to="{ name: 'Budget' }" class="item">
                    <img src="/Assets/Header/budget.svg" class="header-icon" />
                    <div class="name">Budget</div>
                </router-link>
                <router-link :to="{ name: 'Credit' }" class="item">
                    <img src="/Assets/Header/credit.svg" class="header-icon" />
                    <div class="name">Crédit</div>
                </router-link>
                <router-link :to="{ name: 'PlanConfig' }" class="item">
                    <img src="/Assets/Header/plans.svg" class="header-icon" />
                    <div class="name">Plans</div>
                </router-link>
                <router-link class="item" :to="{name : 'Terrain'}">
                    <img src="/Assets/Header/terrain.svg" class="header-icon" />
                    <div class="name">Terrain</div>
                </router-link>
                <router-link :to="{ name: 'Prestataires' }" class="item">
                    <img src="/Assets/Header/prestataires.svg" class="header-icon" />
                    <div class="name">Prestataires</div>
                </router-link>
                <router-link :to="{ name: 'Chantier' }" class="item">
                    <img src="/Assets/Header/travaux.svg" class="header-icon" style="position:relative; top: 7px;" />
                    <div class="name">Chantier</div>

                </router-link>
                <router-link :to="{ name: 'Coach' }" class="item">
                    <img src="/Assets/Header/coach.svg" class="header-icon" />
                    <div class="name">Coach</div>
                </router-link>
            </el-row>
        </div>
    </div>
</template>

<script>
import socketIo from 'socket.io-client';
import MobileDetect from 'mobile-detect';

export default {
    name: 'Header',
    data() {
        return {
            notifs: [],
            showFeatureMissing: false,
            menuItem: ['/dashboard', '/todolist', '/budget', '/loan', '/terrain', '/plan', '/artisan', '/construction'],
            remarque: { part: '', text: '' },
            communityDialog: false,
            loading: false,
            loadedNotifs: [],
            isNotifLoading: false,
        }
    },
    computed: {
        notifications () {
            return (this.notifs.filter(notif => {
                if (new Date(notif.date) > new Date() || new Date(this.$store.state.user.meta.created) > new Date(notif.date)) return false;
                return true;
            }));
        },
        unreadNotifs() {
            var total = 0;
            this.notifs.forEach(notif => {
                if (notif.type === "Création de compte") {
                    var reveal = new Date(this.$store.state.user.meta.created);
                    reveal.setHours(reveal.getHours() + notif.delay)
                    if (new Date() < reveal) return;
                    else if (notif._seen && notif._seen.find(id => this.$store.state.user._id == id)) return;
                    else return total += 1;
                }

                if (new Date(notif.date) > new Date() || new Date(this.$store.state.user.meta.created) > new Date(notif.date)) return

                if (notif._seen && !notif._seen.find(id => this.$store.state.user._id == id) &&
                (new Date(notif.date) <= new Date()) &&
                (new Date(this.$store.state.user.meta.created) < new Date(notif.date))) total += 1;
                else if (!notif._seen || notif._seen.length == 0)  return total += 1;
            });
            if (total == 0) return undefined;
            return total;
        },
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        var md = new MobileDetect(window.navigator.userAgent);
        if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
        this.isActive = (this.menuItem.indexOf(this.$route.path.substring(0, this.$route.path.indexOf('/', 1) == -1 ? this.$route.path.lenght : this.$route.path.indexOf('/', 1))) + 1).toString();
    },
    created() {
        var io;
        if (process.env.NODE_ENV === 'production') {
            io = socketIo.connect('https://admin.madeinplan.fr')
        } else if (process.env.NODE_ENV === 'preprod') {
            io = socketIo.connect('https://admin.myeconomiste.com')
        } else {
            io = socketIo.connect('http://localhost:9000')
        }

        io.on('notification', (notif) => {
            var notifs = this.notifs;
            notifs.unshift(notif);
            this.notifs = [];
            this.notifs = notifs;
            this.notifs.sort((notif1, notif2) => new Date(notif1.date) - new Date(notif2.date));
            var unread = this.notifs.filter(notif => {
                if (notif._seen.find(id => this.$store.state.user._id == id)) return false;
                return true;
            });
            if (unread.length == 0) return;

            document.title = `(${unread.length}) Made In Plan`
        });

        this.$http.get('/notifications/get').then(res => {
            this.notifs = res.data;
            this.notifs = res.data.sort((notif1, notif2) => new Date(notif2.date) - new Date(notif1.date));
            this.loadedNotifs = []
            for (var i = 0; i < 10 && i < this.notifs.length; i++) {
                this.loadedNotifs.push(this.notifs[i])
            }
            var unread = this.notifs.filter(notif => {
                if (notif.type === "Création de compte") {
                    var reveal = new Date(this.$store.state.user.meta.created);
                    reveal.setHours(reveal.getHours() + notif.delay)
                    notif.date = reveal;
                    if (new Date() < reveal) return false;
                    else if (notif._seen && notif._seen.find(id => this.$store.state.user._id == id)) return false;
                    else return true;
                }
                if (new Date(notif.date) > new Date() || new Date(this.$store.state.user.meta.created) > new Date(notif.date)) return false
                if (notif._seen.find(id => this.$store.state.user._id == id)) {
                    return false;
                }
                return true;
            });
            if (unread.length == 0)  document.title = `Made In Plan`;
            else document.title = `(${unread.length}) Made In Plan`
        });

        this.$http.get('/auth/islogged').then(res => {
            if (res.data.isLogged == false) this.$router.push({ name: 'Login' });
            else this.$store.commit('setUser', res.data.user);
        });
    },
    methods: {
        loadMoreNotifs() {
            if (this.notifs.length <= this.loadedNotifs.length) return;
            this.isNotifLoading = true;
            setTimeout(() => {
                const lengthStart = this.loadedNotifs.length;
                for (var i = lengthStart; i < lengthStart + 5 && i < this.notifs.length; i++) {
                    this.loadedNotifs.push(this.notifs[i])
                }
                this.readNotifications(true)
                this.isNotifLoading = false;
            }, 300)
        },
        redirectToNotif(notif) {
            this.$router.push({ path: notif.url });
        },
        readNotifications(state) {
            if (state == false) return;
            this.notifs.forEach(notif => {
                if (new Date(notif.date) >= new Date()) return;
                if (!notif._seen) notif._seen = [];
                if (!notif._seen.find(id => this.$store.state.user._id == id)) {
                    notif._seen.push(this.$store.state.user._id)
                }
            });
            var notifs = this.notifs;
            this.notifs = [];
            this.notifs = notifs;
            document.title = `Made In Plan`;
            var unreadNotifs = this.notifs.filter(notif => {
                if (notif.type === "Création de compte") {
                    var reveal = new Date(this.$store.state.user.meta.created);
                    reveal.setHours(reveal.getHours() + notif.delay)
                    if (new Date() > reveal && notif._seen  && notif._seen.find(id => this.$store.state.user._id == id)) return true;
                }
                if (new Date(notif.date) > new Date() || new Date(this.$store.state.user.meta.created) > new Date(notif.date)) return false
                if (notif._seen && !notif._seen.find(id => this.$store.state.user._id == id) &&
                (new Date(notif.date) <= new Date()) &&
                (new Date(this.$store.state.user.meta.created) < new Date(notif.date))) return true;
                else if (!notif._seen || notif._seen.length == 0) return true;
            });
            this.$http.post('/notifications/read-notifications', {notifications: this.loadedNotifs}).then(res => {});
        },
        getSelectedIcon(notif) {
            switch (notif.category) {
                case "Fonctionnalités":
                return ("/Assets/Notifications/laptop.png");
                break;
                case "Croissance":
                return ("/Assets/Notifications/rocket.png");
                break;
                case "Evènement":
                return ("/Assets/Notifications/calendar.png");
                break;
                case "Timing":
                return ("/Assets/Notifications/hourglass.png");
                break;
                case "Contenu":
                return ("/Assets/Notifications/edit.png");
                break;
                case "Actualité":
                return ("/Assets/Notifications/light.png");
                break;
                case "Presse":
                return ("/Assets/Notifications/text-lines.png");
                break;
                default:
                return ""
                break;
            }
        },
        getTimeFromNow(time) {
            var now = new Date();
            var notifDate = new Date(time);

            var timeDiff = Math.abs(notifDate.getTime() - now.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (diffDays > 7) {
                const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

                return ("Le " + notifDate.getDay() + " " + months[notifDate.getMonth()] + " " + notifDate.getFullYear());


            } else if (diffDays < 7 && diffDays >= 3) {
                return ("Il y a " + diffDays + " jours")
            } else if (diffDays == 2)  {
                return ("Avant-hier")
            } else if (diffDays == 1 && (timeDiff / (3600 * 1000)) > 24) {
                return ("Hier")
            } else if ((timeDiff / (3600 * 1000)) > 1) {
                return ("Il y a " + Math.floor(timeDiff / (3600 * 1000)) + " heures");
            } else if (((3600 * 1000) * 60) > 1) {
                return ('Il y a ' + Math.floor((timeDiff / (3600 * 1000) * 60)) + ' minutes')
            } else {
                return ('Il y a' + Math.floor((timeDiff / (3600 * 1000) * 60)) + ' secondes')
            }
            return (notifDate.toDateString())
        },
        logout() {
            this.$http.post('/auth/logout').then(res => {
                this.$swal({ title: 'Hasta Luego !', html:'<img style="text-align: center;" src="https://cdn.dribbble.com/users/405145/screenshots/4056193/2017_wave_final_4x3.gif" width="320">', showConfirmButton: false, timer: 2100 });
                this.$store.commit('setUser', null);
                this.$localStorage.set('user', null);
                this.$router.push({ name: 'Login' });
            });
        },
        prepareSend(part) {
            this.remarque.part = part;
            this.showFeatureMissing = true;
        },
        sendRemarque() {
            var formData = {
                app: this.remarque.part,
                remarque: this.remarque.text
            };
            this.loading = true;
            this.$http.post(this.$root.URL + '/account/send-remarque', formData).then(res => {
                this.remarque.text = '';
                this.$swal({ title: 'Nous avons bien reçu votre remarque !', type: "success", allowOutsideClick: false, showConfirmButton: false, timer: 2000 });
                this.showFeatureMissing = false;
                this.loading = false;
            });
        },
        handleKeyup(e) {
            e.path[0].style.height = '1px'
            e.path[0].style.height = (e.path[0].scrollHeight) + 'px';
        },
        showCommunity() {
            var self = this;
            self.communityDialog = true;
            setTimeout(() => {
                self.communityDialog = false;
            }, 25000);
        },
    }
}
</script>

<style scoped>
@media print {
    .header {
        display: none;
    }
    .is-mobile {
        display: none !important;
    }
}

.load-more {
    font-size: 14px;
    text-align: center;
    padding-top: 8px;
    padding-bottom: 8px;
    background-color: #00BBFF;
    color: white;
    cursor: pointer;
}

.is-mobile {
    padding: 0 2rem;
    font-size: 1.3rem;
    font-weight: 300;
    color: rgba(33, 45, 89, .9);
    display: flex;
    align-items: center;
    height: 100vh;
    text-align: center;
}
.mobile-container {
    margin-top: -2.5rem;
}
.mobile-container p+p {
    font-size: 1rem;
    line-height: 1.8;
    font-weight: 300;
}

.mobile-container p {
    font-size: 1.6rem;
    line-height: 1.5;
    font-weight: 600;

}
.header { padding: 0; margin-bottom: 0; }
.header-logo {
    display: flex;
}

.app { width: 100%; border-bottom: 1px solid rgba(33, 45, 89, 0);  }

@media only screen and (max-width: 1239px) {
    .app.top { padding: 0 1.5%; margin: 0 auto; }
    .app.list { padding: 0 1.5%; margin: 0 auto; }
    .logo { left: 1.5% }
}
@media only screen and (min-width: 1240px) {
    .app.top { padding: 0 2%; margin: 0 auto; }
    .app.list { padding: 0 15%; margin: 0 auto; }
    .logo { left: 2% }
}
@media only screen and (min-width : 1440px) {
    .app.top { padding: 0 8%; margin: 0 auto; }
    .app.list { padding: 0 16%; margin: 0 auto; }
    .logo { left: 7.5% }
}

.header-links {
    margin-left: 80px;
}

.app.top { padding-top: 16px; padding-bottom: 16px; background-color: #fff; z-index: 1;}
.app.top .logo { margin-right: 20px; height: 40px; width: auto; position: relative; bottom: 0px; left: 0px; }
.app.top .logo:hover { cursor: pointer; }
.app.top .item-link { text-decoration: none; opacity: 0.9;  font-size: 17px;  margin: 0 25px; color: #212D59; font-weight: 400; }
.app.top .item-link:hover { cursor: pointer; opacity: 0.7; }
.app.top .item-link.current { font-weight: 600; opacity: 0.9; }

.app.top .budicon { font-size: 20px; }
.app.top .budicon:hover { cursor: pointer; }
.app.top .budicon:focus { outline: none; }
.app.top .budicon-bell{ color: rgba(33, 45, 89, .5); font-weight: 600; font-size: 1.2rem; vertical-align: middle;}
.app.top .budicon-bell:hover {
    color: rgba(33, 45, 89,.9);
}

.app.list .item {
    flex: 1;
}


.user {
    display: flex;
    /* align-items: stretch; */
}
.notification {
    display: flex;
    margin-right: 1.6rem;
    /* margin-top: -2px; */
    /* align-items: center; */
    align-content: center;
    cursor: pointer;
}
.notification:hover .notification-label, .notification:hover .budicon{
    color: rgba(33, 45, 89, .8);
}


.notification-label {
    color: rgba(33, 45, 89, .8);
    font-size: .95rem;
    margin-left: .5em;
}
.el-dropdown-menu__item {
    color: rgba(33, 45, 89, .8);
}

.app.list {font-size: 10px; border-top: 1px solid rgba(0, 0, 0, .07);     box-shadow: 0px 3px 9px 0px rgba(0, 0, 0, .05 );border-bottom: 1px solid rgba(0, 0, 0, .07); padding-top: 20px; background: rgba(33, 45, 89, .02); z-index: 1  }
.app.list .item {  text-transform: uppercase; padding: 0 6px 10px 6px; text-align: center; color: rgba(33, 45, 89, 0.7); position: relative; top: 2px; border-bottom: 3px solid transparent; text-decoration: none; }
.app.list .item:hover { cursor: pointer; color: rgba(33, 45, 89, 1); }
.app.list .item.router-link-active {  color: rgba(33, 45, 89, 1); border-bottom: 2px solid #4BC0FD; }

.app.list .item .header-icon { height: 32px; }
.app.list .item .name { padding-top: 6px; font-size: 14px; letter-spacing: 1px;  font-weight: 400; }
.app.list .item.router-link-active .name { font-weight: 500; }

.note-text { border: solid 1px #E3E4E9; border-radius: 4px; height: 40px; padding: 16px; width: 95%; outline: none; resize: none; background: transparent; color: #212D59; font-size: 16px; }
.note-text::placeholder { font-size: 16px; color: #ccc; }
.note-text:focus::placeholder { color: transparent; }

.user-settings {
    display: flex;
    align-items: center;
    align-content: center;
}

.user-settings:hover {
    cursor: pointer;
}

.user-settings .account-image { vertical-align: middle; height: 24px; width: 24px; border-radius: 50%; margin: 0 .5rem; }
.user-name {
    color: rgba(33, 45, 89, .8);
    font-size: .95rem;
}

.user-drop {
    margin-left: 5px;
}

.budicon-chevron-bottom {
    font-size: .8rem !important;
    font-weight: 900 !important;
}

.el-dropdown-link:active, .el-dropdown-link:focus {
    outline: none !important;
    border: none;
}

.el-dropdown-menu__item {
    padding: .2rem 1.5rem;
}

.el-dropdown-menu__item a {
    text-decoration: none;
    color: inherit;
}

.el-dropdown-menu__item i {
    margin-right: .3rem;
}

.item.disabled {
    opacity: .3;
}

.el-dropdown-menu {
    padding: 0;
}

.el-dropdown-menu+.el-dropdown-menu {
    padding: 1rem 0;
}

.notification-list {
    height: auto;
    max-height: 525px;
    overflow-y: auto;
    overflow-x: hidden;
}

.notification-item {
    display: flex;
    align-content: center;
    align-items: center;
    /* width: 500px; */
    margin-top: 0;
    padding-top: .8rem;
    padding-bottom: .7rem;
    border-bottom: 1px solid rgba(33, 45, 89, .08);
    min-height: 105px;
    box-sizing: border-box;
}

.notification-item:last-of-type {
    border: none;
}

.notification-item:hover {
    background: rgba(33, 45, 89, .03);
    color: rgba(33, 45, 89, .9);
}

.notification-item-detail {
    margin-right: 1rem;
}

.notification-item-detail:last-of-type {
    margin-right: 0;
}

.notification-body {
    display: flex;
    flex-direction: column;
    line-height: 1.5rem;
    word-wrap: break-word;
    width: 44ch;
}

.notification-body .notification-message > p {
    padding: 0;
    margin: 0 !important;
}


.notification-message {
    /* margin-bottom: 0rem; */
    font-size: .8rem;
}

.notification-type {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.6rem;
    font-weight: 500;
    color: #0bf;
}

.notification-date {
    color: rgba(33, 45, 89, .4);
    font-size: .7rem;
    font-weight: 300;
}

.notification-img {
    margin-bottom: auto;
    margin-top: auto;
}

.notification-img img {
    height: 60px;
    /* border-radius: 50%; */
    /* border: 1px solid rgba(33, 45, 89, .1); */
    /* object-fit: contain; */
    /* padding: 3px; */
}

.notification-read i {
    font-size: 1.3rem;
    color: #fff;
}

.notification-item:hover .notification-read i {
    color: rgba(33, 45, 89, .4);
}

.notification-item:hover .notification-read i:hover {
    color: rgba(33, 45, 89, .8);
}

.dialog__body { display: none; }
.modal-content { width: 50%; height: 50%; text-align: center; position: fixed; top: 25%; bottom: 25%; left: 25%; right: 25%; color: #2ECC71; }
.modal-content .budicon { font-size: 152px; }
.modal-content .name { font-size: 3rem; margin: 0; margin-top: 4%;  }
.modal-content .desc { font-size: 1.8rem; margin: 0; font-weight: 300; }


/*
##Device = Tablets, Ipads (portrait)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {

    .app.top .logo {
        height: 30px;
    }

    .header-links {
        margin-left: 15px;
    }

    .app.top .item-link {
        margin: 0 7px;
        font-size: .8rem;
    }

    .app.top .notification {
        margin-right: 0.8rem;
    }

    .app.list {
        padding-top: 12px;
    }

    .app.list .item .name {
        font-size: 0.65rem;
    }

    .app.list .item .header-icon {
        height: 20px;
    }

}

/*
##Device = Tablets, Ipads (landscape)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

    .notification-label {
        display: none;
    }

    .header-links {
        margin-left: 40px;
    }

    .user-name {
        display: none;
    }

    .app.top .item-link {
        margin: 0 15px;
        font-size: .8rem;
    }

    .app.top .notification {
        margin-right: 0.8rem;
    }

    .app.list {
        padding-top: 20px;
    }

    .app.list .item .name {
        font-size: 0.8rem;
    }

    .app.list .item .header-icon {
        height: 30px;
    }

}

</style>
