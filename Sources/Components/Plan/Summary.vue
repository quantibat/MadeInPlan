<template id="Summary">
    <div class="container">
        <transition name="el-fade-in-linear">
            <el-row type="flex" justify="center" align="middle" v-if="show">
                <el-button type="primary" class="return-button" @click="returnToPlan()">
                    <div style="display: flex; position: relative; left: 5px;">
                        <i class="budicon budicon-arrow-left"></i><p style="position: relative; bottom: 7px;"> Retour aux paramètres</p>
                    </div>
                </el-button>
            </el-row>
        </transition>
        <div class="house">
            <el-row class="house-spec" type="flex" justify="space-between" align="middle">
                <span class="spec-name">Surface totale</span>
                <span class="spec-value">{{ config.surface }}</span>
            </el-row>

            <el-row class="house-spec" type="flex" justify="space-between" align="middle">
                <span class="spec-name">Nombre de chambres</span>
                <span class="spec-value">{{ config.nbRoom }}</span>
            </el-row>

            <el-row class="house-spec" type="flex" justify="space-between" align="middle">
                <span class="spec-name">Type de maison</span>
                <span class="spec-value value-tag">{{ config.type ? 'Design' : 'Economique' }}</span>
            </el-row>

            <el-row class="house-spec">
                <el-row type="flex">
                    <span class="spec-name">Pièces optionnelles</span>
                </el-row>
                <el-row>
                    <el-col v-for="(p, key, index) in config.options" v-if="config.options[key] == true" :span="8" class="la-col">
                        <span class="spec-value value-tag">{{ key | capitalize }}</span>
                    </el-col>
                </el-row>
            </el-row>

            <el-row class="house-spec" v-if="config.advOptions">
                <el-row class="spec-name">Options</el-row>
                <el-row v-if="config.advOptions[0]" class="spec-value spec-list">Pas de WC dans un coin</el-row>
                <el-row v-if="config.advOptions[1]" class="spec-value spec-list">Dégagement sans mur extérieur</el-row>
                <el-row v-if="config.advOptions[2]" class="spec-value spec-list">Salon dans un coin</el-row>
                <el-row v-if="config.advOptions[3]" class="spec-value spec-list">Séparation Jour/Nuit</el-row>
                <el-row v-if="config.advOptions[4]" class="spec-value spec-list">Suite parentale dans la zone jour</el-row>
                <el-row v-if="config.advOptions[5]" class="spec-value spec-list">Suite parentale sur terrace</el-row>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Summary',
    props: {
        config: Object
    },
    data() {
        return {}
    },
    filters: {
        upperCase: function (value) {
            return value.toUpperCase();
        },
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    methods: {
        returnToPlan() {
            this.$router.push({ name: 'Plan' });
        }
    }
}
</script>

<style scoped>

.container { background: #FFFFFF; border-radius: 0px; border: 1px solid #FFFFFF; padding: 10px 10px 30px 10px; width: 320px; height: auto; }

.return-button { width: 100%; height: 50px; }
.budicon { font-size: 24px; margin: 0px 10px; }

.house {
    margin: 20px 0px 0px 0px;
    box-shadow: 0 0 5px  4px rgba(0,0,0,.04);
    border-radius: 4px;
    padding: 1rem 1.2rem;
 }
.house-spec {
    border-bottoms: solid 1px #F8F8F8;
    margin-top: 10px;
    padding: 10px 0px 10px 0px;
    border-radius: 6px;
    /* background: #F8F8F8; */
    color: #2B396A;
    letter-spacing: 0px;
}
.spec-name { margin-left: 5px; opacity: 0.7; }
.spec-value { margin-right: 5px; font-weight: bold; }
.spec-list { margin-left: 8%; }
.value-tag { border-radius: 25px; background: #2A9EFC; color: #FFFFFF; padding: 5px 15px; margin-bottom: 5px; }
.la-col { margin: 6px 15px 6px 15px; text-align: center; }

</style>
