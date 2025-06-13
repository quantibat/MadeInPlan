<template>
    <el-dialog style="background: rgba(255, 255, 255, 1)" :visible.sync="show" width="54vw" @close="handleClose()" :append-to-body="true">
        <div class="content">
            <p style="margin: 0; margin-bottom: 1rem; padding: 0;font-size: 1.5rem; color: #212D59;">Bientôt disponible, promis 😍</p>
            <!-- <p style="font-size: 1.2rem;">Deux de nos développeurs en ce moment ... </p>
            <p> Si si, on ne vous ment pas 🤥</p> -->
            <img style="height: 300px; border-radius: 4px;" src="https://media1.giphy.com/media/13HBDT4QSTpveU/giphy.gif">
            <img style="height: 300px; border-radius: 4px;" src="https://media1.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif">
            <!-- <el-button type="primary" @click="handleConfirm()">D'accord</el-button> -->
        </div>
    </el-dialog>
</template>

<script>
export default {
    name: 'Checkbox',
    props: {
        'show': {
            type: Boolean,
            required: true
        },
    },
    methods: {
        handleClose() {
            this.$emit('update:show', false);
        },
        handleConfirm() {
            this.$emit('update:show', false);
        }
    }
}
</script>

<style scoped>
.content { text-align: center; font-weight: 300; }

.content div { font-size: 16px; color: #212D59; }
.content .el-button { margin-top: 20px; }
</style>
