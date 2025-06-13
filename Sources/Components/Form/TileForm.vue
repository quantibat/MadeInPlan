<template>
    <div :class="(active)?'':'disabled'">
        <el-row class="tiles">
            <el-col v-for="data in tiles" :lg="{span:4, offset:1}" :xl="{span:4, offset:1}" :md="{span:5, offset:1}" :sm="{span:5, offset:1}" :xs="{span:4, offset:1}">
                <div v-if="!textOnly" :class="getRightTileClass(data)" v-on:click="selectTile(data)">
                    <img class="tile-image" :src="data.imgUrl"/>
                    <div class="text">{{ data.name }}</div>
                </div>
                <div v-else :class="getRightTileClass(data)" v-on:click="selectTile(data)">
                    <div class="tile-text-only">
                        <div class="text-only">{{ data.name }}</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row v-if="multi && selected.length > 0 && active && requireValidation" class="validate-row" align="bottom">
            <el-col :span="6">
                <el-button @click="validate" class="validate">Validez</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: 'TileForm',
    props: {
        'tiles': Array,
        'selected': [Object, Array],
        'select': Function,
        'multi': {
            default: false,
            type: Boolean
        },
        'textOnly': {
            default: false,
            type: Boolean
        },
        'requireValidation': {
            default: true,
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
                return ((JSON.stringify(data) === JSON.stringify(this.selected))?'selected-tile':'tile');
            } else {
                return ((this.selected.findIndex((item) => JSON.stringify(item) === JSON.stringify(data)) !== -1)?'selected-tile':'tile');
            }
        }
    }
}
</script>

<style scoped>
    .validate-row {
        margin-top: 3rem;
    }
    .tile-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
    .selected-tile {
        cursor: pointer;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        padding-top: 100%;
        border-color: #31bdfc;
        position: relative;
    }
    .text {
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 1rem;
        font-size: 14px;
        color: #31bdfc;
    }
    .text-only {
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: #31bdfc;
    }
    .tile-text-only {
        display: flex;
        flex-direction: column;
        align-content: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
    }
    .tile {
        cursor: pointer;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        padding-top: 100%;
        border-color: #E3E5EA;
        text-align: center;
        position: relative;
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