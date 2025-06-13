<template></template>

<script>
export default {
    name: 'ActivationCallback',
    data() {
        return {}
    },
    created() {
        this.$http.post(this.$root.URL + '/auth/activation/' + this.$route.params.token).then(res => {
            this.$localStorage.set('user', res.data.user);
            this.$store.commit('setUser', res.data.user);
            this.$swal({ title: 'Votre compte a été bien activé', type: "success", timer: 3000, showConfirmButton: false });
            this.$router.push({ name: 'Welcome-1' });
        }, error => {
            this.$message.error(error.response.data.message);
            this.$router.push({ name: 'Login' });
        });
    }
}
</script>

<style scoped>
</style>
