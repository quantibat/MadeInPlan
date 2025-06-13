<template>
    <div :class="(active)?'':'disabled'">
        <el-row class="tiles" :gutter="16">
            <el-col v-for="data in tiles" :lg="5" :xl="4" :md="5" :sm="5" :xs="4">
                <div :class="getRightTileClass(data)" v-on:click="selectTile(data)">
                <div class="tile-image-container">
                    <div class="image-container" v-if="data.repeat === 2">
                        <img v-for="index in 2" :key="index" class="tile-image" :src="data.imgUrl" />
                    </div>
                     <div class="image-container" v-else-if="data.repeat === 3">
                         <div><img :key="index" class="tile-image" :src="data.imgUrl" /></div>
                        <img v-for="index in 2" :key="index" class="tile-image" :src="data.imgUrl" />
                    </div>
                    <div class="image-container" v-else-if="data.repeat === 4">
                         <div><img v-for="index in 2" :key="index" class="tile-image" :src="data.imgUrl" /></div>
                        <img v-for="index in 2" :key="index" class="tile-image" :src="data.imgUrl" />
                    </div>
                    <div class="image-container" v-else-if="data.repeat === 5">
                         <div><img v-for="index in 2" :key="index" class="tile-image" :src="data.imgUrl" /></div>
                        <div><img v-for="index in 3" :key="index" class="tile-image" :src="data.imgUrl" /></div>
                    </div>
                    <div v-else class="image-container">
                        <img :class="'tile-image '+ data.name.toLowerCase()" :src="data.imgUrl" />
                    </div> 
                    <div class="text">{{ data.name }}</div>
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
    name: 'IconButtonForm',
    props: {
        'tiles': Array,
        'selected': [Object, Array, String],
        'select': Function,
        'multi': {
            default: false,
            type: Boolean
        },
        'validate': Function,
        'requireValidation': {
            default: true,
            type: Boolean
        },
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
    .tile-image.rectangle {
        width: 45%;
    }
    .validate-row {
        margin-top: 3rem;
    }
    .tile-image-container {
        display: flex;
        align-items: center;
        justify-content:space-around;
        padding: 1rem 0;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .image-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        width: 100%;
        margin: auto;

    }
    .tile-image {
        width: 27%;
        margin: 0 .2rem;
    }
    .selected-tile {
        cursor: pointer;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        border-color: #31bdfc;
        width: auto;
        height: 7rem;  
        position: relative;
        text-align: center;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
    }
    .text {
        font-size: 13px;
        color: #31bdfc;
        margin-top: auto;
        padding-top: 1rem;
        font-weight: 300;
    }
    .tile {
        cursor: pointer;
        box-shadow: 0 4px 4px rgba(0,0,0,.03);
        border-style: solid;
        border-width: 1px;
        border-radius: 5px;
        display: flex;
        width: auto;
        height: 7rem;        
        border-color: #E3E5EA;
        position: relative;
        text-align: center;
        justify-content: space-between;
        flex-direction: column;
        /* margin-right: 50rem; */
    }
    .tiles {
        display: flex;
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
    @media (min-width: 768px) and (max-width: 1024px) {
        .tile-image { width: 26%; }
    }
</style>