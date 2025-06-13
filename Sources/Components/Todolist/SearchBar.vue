<template>
    <el-row class="search" type="flex" align="middle">
        <i class="budicon budicon-search" :style="{ color: isFocus ? '#48BEFE' : '#C8CBD6' }" @click="handleSearch()"></i>
        <input type="text" v-model="text" placeholder="Rechercher" @focus="isFocus = true" @blur="isFocus = false">
        <i v-if="text.length > 0" class="budicon budicon-cross-ui" @click="text = ''"></i>
    </el-row>
</template>

<script>
export default {
    name: 'SearchBar',
    computed: {
        todolist() {
            return this.$store.state.todolist;
        },
        searchText() {
            return this.$store.state.searchText;
        }
    },
    data() {
        return {
            text: '',
            isFocus: false
        }
    },
    mounted() {
        this.text = this.searchText;
    },
    watch: {
        text: {
            handler: function (text) {
                this.$store.commit('handleSearch', this.text);
            }
        }
    },
    methods: {
    }
}
</script>

<style scoped>

.search { width: 100%; border: solid 1px #E3E4E9; border-radius: 5px; display: flex; font-size: 15px; box-shadow: 0px 0px 0px #CECECE; transition: box-shadow 0.1s; }
.search:hover { box-shadow: 0px 3px 6px #CECECE; }

.search .budicon:hover { cursor: pointer; }
.search .budicon-search { font-size: 20px; padding: 14px 10px 14px 14px; }
.search .budicon-cross-ui { font-size: 25px; color: #DFE1E7; position: relative; right: 16px; }
.search .budicon-cross-ui:hover { color: #FF5252; }

.search input { border: none; outline: none; font-size: 15px; color: #212D59; flex-grow: 1; height: 40px; width: 100%; }
.search input::placeholder { font-size: 15px; color: #C8CBD6; }

</style>
