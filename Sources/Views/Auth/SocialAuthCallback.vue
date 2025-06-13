<template id="SocialAuthCallback">
</template>

<script>
import MobileDetect from 'mobile-detect';

export default {
    name: 'SocialAuthCallback',
    created() {
        this.$http.get(this.$root.URL + '/auth/islogged').then(res => {
            heap.identify(res.data.user.info[0].mail, 'email');
            if (res.data.isLogged) {
                this.$store.commit('setUser', res.data.user);
                this.$localStorage.set('user', res.data.user);
                if (res.data.user.meta.firstConnexion == true) {
                    this.$router.push({ name: 'Welcome-1' });
                } else {
                    var md = new MobileDetect(window.navigator.userAgent);

                    if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
                    else this.$router.push({ name: 'Index' });
                }
            } else this.$router.push({ name: 'Login' });
        });
    }
}
</script>

<style scoped>

.container {
    padding-left: 25px;
    padding-top: 4px;
}

</style>
