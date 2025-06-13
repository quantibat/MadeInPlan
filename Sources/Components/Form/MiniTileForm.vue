<template>
    <div :class="(active)?'':'disabled'">
        <el-row class="tiles" type="flex" :gutter="15">
            <div v-for="data in tiles" :class="getRightTileClass(data)" v-on:click="selectTile(data)">
                <div class="text">{{ data.title }}</div>
            </div>
        </el-row>
        <el-row v-if="multi && selected.length > 0 && active" class="validate-row" align="bottom">
            <el-col :span="6">
                <el-button @click="validate" class="validate">Validez</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'MiniTileForm',
    props: {
        'tiles': Array,
        'selected': [Object, Array],
        'select': Function,
        'multi': {
            default: false,
            type: Boolean
        },
        'validate': Function,
        'active': {
            default: true,
            type: Boolean
        }
    },
    methods: {
        selectTile(data) {
            if (this.multi) {
                const index = this.selected.findIndex((item) => JSON.stringify(item) === JSON.stringify(data));
                var selectedArray = this.selected;
                if (index !== -1) {
                    selectedArray.splice(index, 1);
                } else {
                    selectedArray.push(data);
                }
                this.select(selectedArray);
            } else {
                this.select(data);
            }
        },
        getRightTileClass(data) {
            if (!this.multi) {
                return ((JSON.stringify(data) === JSON.stringify(this.selected))?'tile selected-tile':'tile');
            } else {
                return ((this.selected.findIndex((item) => JSON.stringify(item) === JSON.stringify(data)) !== -1)?'tile selected-tile':'tile');
            }
        }
    }
}
</script>

<style scoped>
    .validate-row {
        margin-top: 3rem;
    }
    .text {
        width: 100%;
        font-size: 20px;
        color: #31bdfc;
    }
    .tile {
        cursor: pointer;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        margin-left: 1rem;
        /* width: 3vw; */
        height: 3vw;
        min-width: 3vw;
        border-color: #E3E5EA;
        text-align: center;
        display: flex;
        align-items: center;
    }
    .selected-tile {
        background-color: #31bdfc;
    }
    .selected-tile .text {
        color: #FFFFFF;
    }
    .tiles {
        margin-top: 3rem;
    }
    .el-button.validate {
        border: 1px #E7E9ED;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        background-color: #31BDFC;
        color: white;
        font-weight: 300;
        width: 100%;
        font-size: 15px;
        padding: 15px 15px;
        margin-bottom: 15px;
    }
    .el-button:hover {
        opacity: 0.8;
    }
    .disabled {
        pointer-events: none;
    }
</style>