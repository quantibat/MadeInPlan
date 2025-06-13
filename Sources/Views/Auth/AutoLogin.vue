<template></template>

<script>
export default {
    name: 'AutoLogin',
    data() {
        return {}
    },
    created() {
        this.$http.post(this.$root.URL + '/auth/auto-login/', { key: this.$route.params.key }).then(res => {
            this.$localStorage.set('user', res.data.user);
            this.$store.commit('setUser', res.data.user);
            this.$router.push({ name: 'Index' });
        }, error => {
            this.$message.error(error.response.data.message);
            this.$router.push({ name: 'Login' });
        });
    }
}
</script>

<style>
</style>
