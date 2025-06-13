<template>
    <div class="main-container" v-if="isLogged">
        <app-header v-if="shouldShow()" class="app-header"></app-header>
        <router-view class="child-view"></router-view>
    </div>
</template>

<script>
import Header from '../Components/Header.vue'

export default {
    name: 'Index',
    components: {
        'app-header': Header
    },
    data() {
        return {
            isLogged: false
        }
    },
    created() {
        this.$http.get(this.$root.URL + '/auth/islogged').then(res => {
            if (res.data.isLogged == false) this.$router.replace({ name: 'Login' });
            else if (res.data.user.active == false) {
                this.$message.error('Votre compte n\'est pas activé');
            }
            else {
                this.$localStorage.set('user', res.data.user);
                this.$store.commit('setUser', res.data.user);
                if (res.data.user.meta.firstConnexion == true) this.$router.replace({ name: 'Welcome-1' });
                this.isLogged = true;
            }
        });
    },
    methods: {
        shouldShow() {
            var shouldShow = true;
            var BannedPaths = ['/print-budget', '/print-chiffrage']
            BannedPaths.forEach(path => {
                if (this.$route.path == path) shouldShow = false;
            })
            return (shouldShow)
        }
    }
}
</script>

<style scoped>
@media only screen and (max-width: 1239px) {
    .child-view { width: 97%; margin: 0 auto; }
    .subscription.child-view {display: flex; flex-direction: column; align-items: center; }
}
@media only screen and (min-width: 1240px) {
    .child-view { width: 96%; margin: 0 auto; }
    .subscription.child-view {display: flex; flex-direction: column; align-items: center; }
}
@media only screen and (min-width : 1440px) {
    .child-view { width: 85%; margin: 0 auto;  }
    .subscription.child-view {display: flex; flex-direction: column; align-items: center; }
}
</style>
