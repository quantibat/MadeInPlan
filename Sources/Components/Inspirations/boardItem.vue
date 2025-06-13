<template>
        <el-dialog v-if="open" class="board-item-container" fullscreen :visible="open" @close="close" width="85vw">
        <el-dialog title="Ajouter une inspiration" :visible.sync="addDialog.show" width="40vw" append-to-body>
            <picture-input ref="pictureInputAdd" @change="onChangedAdd" :height="400" :width="400" accept="image/jpeg, image/png, image/jpg" :crop="false" :customStrings="{ upload: '<h1>Envoyer la !</h1>', drag: 'Ajouter une image' }"></picture-input>

            <el-select v-model="addDialog.newInspiration.board" placeholder="Selectionner le board">
                <el-option v-for="board in $parent.boards" :key="board._id" :label="board.name" :value="board._id"></el-option>
            </el-select>

            <el-tag :key="tag" v-for="tag in addDialog.newInspiration.tag" closable :disable-transitions="false" @close="handleCloseTagAdd(tag)">{{ tag }}</el-tag>
            <el-input class="input-new-tag" v-if="addDialog.inputVisible" v-model="addDialog.newTag" ref="saveTagInputAdd" size="mini" @keyup.enter.native="handleAddTagAdd()"></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showAddTagAdd()">+ Nouveau Tag</el-button>

            <span slot="footer" class="addDialog-footer">
                <el-button @click="cancel()">Annuler</el-button>
                <el-button type="primary" @click="add()">Ajouter</el-button>
            </span>
        </el-dialog>

        <el-dialog v-if="imageDialog.show" :visible.sync="imageDialog.show" custom-class="image-dialog"  append-to-body :show-close="false" :center="true">
            <img :src="'/upload/Inspiration/' + (imageDialog.inspiration.user == null ? 'Default/' : imageDialog.inspiration.user + '/') + imageDialog.inspiration.url">
            <img class="dialog-imgs-icon heart" src="/Assets/heart-red.svg" v-if="isFavorite(imageDialog.inspiration) == true" @click.stop="toogleFavori(imageDialog.inspiration)" />
            <img class="dialog-imgs-icon heart" src="/Assets/heart-outline.svg" v-else @click.stop="toogleFavori(imageDialog.inspiration)" />
            <i v-if="imageDialog.inspiration.user === $parent.user._id" class="board-imgs-icon budicon budicon-trash in-dialog" @click="remove(imageDialog.inspiration)"></i>
        </el-dialog>

        <el-row type="flex" justify="center">
            <!-- <el-col :span="4" class="board-filters">
                <el-row class="board-filter">
                    <h4>Couleurs</h4>
                    <div class="board-color-tags">
                        <div class="board-color-tag yellow"></div>
                        <div class="board-color-tag blue"></div>
                    </div>
                </el-row>

                <el-row class="board-filter">
                    <h4>Textures</h4>
                </el-row>
            </el-col> -->

            <el-col :md="24" :lg="24" :xl="18" class="board-main">
                <h1>{{ board.name }}</h1>
                <el-tabs v-model="activeTab" :stretch="isMobile()">
                    <!-- <el-tab-pane label="Mes favoris" name="first" :lazy="true">
                        <el-row>
                            <el-col class="board-imgs" :span="24">
                                <div class="board-imgs--item">
                                    <div class="board-imgs--last-inspi">
                                        <masonry :cols="{default: 3, 1000: 3, 700: 2, 400: 1}" :gutter="{default: '1.5rem', 700: '1rem'}">
                                            <div v-for="(inspiration, index) in $parent.inspirations" v-if="inspiration.board == board._id && isFavorite(inspiration) == true" @click="openImage(inspiration)">
                                                <img :src="'/upload/Inspiration/' + (inspiration.user == null ? 'Default/' : inspiration.user + '/') + inspiration.url">
                                                <i :class="'board-imgs-icon budicon budicon-heart ' + (isFavorite(inspiration) == true ? 'is-favori' : '')" @click.stop="toogleFavori(inspiration)"></i>
                                                <i v-if="inspiration.user != null" class="board-imgs-icon budicon budicon-trash" @click.stop="remove(inspiration)"></i>
                                                <div class="board-imgs-cover"></div>
                                            </div>
                                        </masonry>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-tab-pane> -->
                    <el-tab-pane label="Plus d'inspirations" name="first" :lazy="true">
                        <el-row>
                            <el-col class="board-imgs" :span="24">
                                <div class="board-imgs--item">
                                    <div class="board-imgs--last-inspi">
                                        <masonry :cols="{default: 3, 1000: 3, 700: 2, 400: 1}" :gutter="{default: '1.5rem', 700: '1rem'}">
                                            <div v-for="inspiration in $parent.inspirations" v-if="inspiration.board == board._id && inspiration.user == null" :key="inspiration._id" @click="openImage(inspiration)">
                                                <img :src="'/upload/Inspiration/' + (inspiration.user == null ? 'Default/' : inspiration.user + '/') + inspiration.url">
                                                <img class="board-imgs-icon heart" src="/Assets/heart-red.svg" v-if="isFavorite(inspiration) == true" @click.stop="toogleFavori(inspiration)" />
                                                <img class="board-imgs-icon heart" src="/Assets/heart-outline.svg" v-else @click.stop="toogleFavori(inspiration)" />
                                                <div class="board-imgs-cover"></div>
                                            </div>
                                        </masonry>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="Mes images favorites" name="second" :lazy="true">
                        <el-row>
                            <el-col class="board-imgs" :span="24">
                                <div class="board-imgs--item">
                                    <div class="board-imgs--last-inspi">
                                        <masonry :cols="{default: 3, 1000: 3, 700: 2, 400: 1}" :gutter="{default: '1.5rem', 700: '1rem'}">
                                            <div class="add-inspi" @click="addDialog.show = true">
                                                <i class="budicon budicon-plus-ui"></i>
                                                <p>Ajouter une image</p>
                                            </div>
                                            <div v-for="inspiration in $parent.inspirations" v-if="inspiration.board == board._id && (inspiration.user == $parent.user._id || isFavorite(inspiration) == true)" :key="inspiration._id" @click="openImage(inspiration)">
                                                <img :src="'/upload/Inspiration/' + (inspiration.user == null ? 'Default/' : inspiration.user + '/') + inspiration.url">
                                                <img class="board-imgs-icon heart" src="/Assets/heart-red.svg" v-if="isFavorite(inspiration) == true" @click.stop="toogleFavori(inspiration)" />
                                                <img class="board-imgs-icon heart" src="/Assets/heart-outline.svg" v-else @click.stop="toogleFavori(inspiration)" />
                                                <div style="margin-bottom: 0;" v-if="inspiration.user === $parent.user._id" class="board-imgs-del-icon" @click.stop="remove(inspiration)">
                                                    <i class="budicon budicon-trash"></i>
                                                </div>
                                                <div class="board-imgs-cover"></div>
                                            </div>
                                        </masonry>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-tab-pane>

                </el-tabs>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
import PictureInput from '../../Components/PictureInput.vue';

export default {
    name: 'BoardItem',
    components: {
        'picture-input': PictureInput
    },
    props: {
        'open': Boolean,
        'close': Function,
    },
    data() {
        return {
            board: {},
            inspirations: [],
            activeTab: 'first',
            addDialog: {
                show: false,

                inputVisible: false,
                newTag: '',

                newInspiration: {
                    image: null,
                    height: 0,
                    width: 0,
                    tag: [],
                    board: null
                }
            },
            imageDialog: {
                show: false,
                inspiration: {}
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        this.board = this.$parent.boards.find(item => item._id == this.$parent.currentBoardID);
        this.addDialog.newInspiration.board = this.$parent.currentBoardID;
    },
    methods: {
        isMobile() {
            var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

            return x <= 1024;
        },
        isFavorite(inspiration) {
            if (inspiration.user == null) {
                return (inspiration.favoriArray.indexOf(this.user._id) == -1 ? false : true);
            } else {
                return inspiration.favori;
            }
        },
        openImage(inspiration) {
            this.imageDialog.inspiration = inspiration;
            this.imageDialog.show = true;
        },
        toogleFavori(inspiration) {
            if (inspiration.user == null) {
                var i = inspiration.favoriArray.indexOf(this.user._id);
                if (i == -1) {
                    inspiration.favoriArray.push(this.user._id);
                } else {
                    inspiration.favoriArray.splice(i, 1);
                }
            } else {
                inspiration.favori = !inspiration.favori;
            }

            if (this.isFavorite(inspiration) == true) this.$message.success('Cette inspiration a été ajoutée à vos favoris');

            this.$http.post('/inspiration/toogle-favori', { id: inspiration._id }).then(res => {}, err => {});
        },
        add() {
            if (this.addDialog.newInspiration.image) {
                const formData = new FormData();
                formData.append('image', this.addDialog.newInspiration.image);
                formData.append('height', this.addDialog.newInspiration.height);
                formData.append('width', this.addDialog.newInspiration.width);
                formData.append('tag', JSON.stringify(this.addDialog.newInspiration.tag));
                formData.append('board', this.addDialog.newInspiration.board);
                const config = { headers: { 'content-type': 'multipart/form-data' } };
                this.$http.post('/inspiration/inspiration/add', formData, config).then(res => {
                    this.addDialog.show = false;
                    this.addDialog.inputVisible = false;
                    this.$refs.pictureInputAdd.removeImage();
                    this.addDialog.newInspiration.image = null;
                    this.addDialog.newInspiration.tag = [];
                    this.addDialog.newInspiration.board = this.$parent.currentBoardID;

                    var i = this.$parent.boards.findIndex(item => item._id == this.$parent.currentBoardID);
                    this.$parent.boards[i].nbPicture += 1;
                    this.$parent.inspirations.push(res.data.inspiration);
                }, err => {});
            }
        },
        cancel() {
            this.addDialog.show = false;
            this.addDialog.inputVisible = false;
            this.$refs.pictureInputAdd.removeImage();
            this.addDialog.newInspiration.image = null;
            this.addDialog.newInspiration.tag = [];
            this.addDialog.newInspiration.board = this.$parent.currentBoardID;
        },
        remove(inspiration) {
            this.$http.post('/inspiration/inspiration/delete', { id: inspiration._id }).then(res => {
                var i = this.$parent.boards.findIndex(item => item._id == this.$parent.currentBoardID);
                this.$parent.boards[i].nbPicture += 1;
                i = this.$parent.inspirations.findIndex(item => item._id == inspiration._id);
                this.$parent.inspirations.splice(i, 1);
                this.$message.success('Cette inspiration a bien été supprimée');
                this.imageDialog.show = false;
            }, err => {});
        },
        onChangedAdd() {
            if (this.$refs.pictureInputAdd.file) {
                this.addDialog.newInspiration.image = this.$refs.pictureInputAdd.file;
                this.addDialog.newInspiration.height = this.$refs.pictureInputAdd.imageHeight;
                this.addDialog.newInspiration.width = this.$refs.pictureInputAdd.imageWidth;
            }
        },
        handleCloseTagAdd(tag) {
            this.addDialog.newInspiration.tag.splice(this.addDialog.newInspiration.tag.indexOf(tag), 1);
        },
        showAddTagAdd() {
            this.addDialog.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInputAdd.$refs.input.focus();
            });
        },
        handleAddTagAdd() {
            this.addDialog.newInspiration.tag.push(this.addDialog.newTag);
            this.addDialog.newTag = '';
        }
    }
}
</script>

<style>

.board-item-container {
    background: rgba(255, 255, 255, 1);
}
.board-item-container > .el-dialog {
    box-shadow: none;
}

.board-main h1 {
    letter-spacing: -1px;
    margin-bottom: .6rem;
    font-size: 2rem;
}

.board-filters {
    margin-top: 5.4rem;
}

.board-filters h4 {
    text-transform: uppercase;
    color: rgba(35, 49, 88, .3);
    letter-spacing: 1px;
    font-weight: 500;
    margin-bottom: .5rem;
}

.board-filter {
    margin-bottom: 1.5rem;
}

.el-tabs__item {
    font-size: 1.1rem;
    text-decoration: none;
    color: rgba(35, 49, 88, .3);
    transition: .1s linear;
}

.el-tabs__item:hover {
    color: #00BBFF;
    transition: .1s linear;
}

.el-tabs__item.is-active {
    color: #00BBFF;
}
.el-tabs__active-bar {
    background-color: #00BBFF;
}

.add-inspi {
    width: 100%;
    height: 200px;
    border-radius: 5px;
    transition: .2s linear all;
    margin-right: 2rem;
    margin-bottom: 2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    color: rgba(35, 49, 88, .3);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 2rem;
    box-sizing: border-box;
    text-align: center;
    line-height: 1.4;
    border: 1px dashed rgba(35, 49, 88, 0.2);
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .04);

}

.add-inspi:hover {
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .1);
    transition: .2s linear all;
    cursor: pointer;
    border: 1px dashed #00BBFF;
}
.add-inspi p {
    margin: 0;
    margin-top: 1rem;
    transition: .2s linear all;
}
.add-inspi:hover p {
    color: #00BBFF;
    transition: .2s linear all;
}
.add-inspi .budicon {
    color: #00BBFF;
    font-size: 2.5rem;
    font-weight: 500;
}

.board-card {
    display: flex;
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1);
    border-radius: 5px;
    transition: .2s linear all;
    margin-right: 2rem;
    text-align: center;
    padding: 6rem 0;
    cursor: pointer;
}

.board-card:hover {
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .1);
    transition: .2s linear all;
    cursor: pointer;
}

.board-card--new {
    /* height: 250px; */
    margin: auto;
    color: rgba(35, 49, 88, .5);

}
.board-card--icon {
    color: #00BBFF;
    font-size: 2rem;
    font-weight: 500;
}

.board-card p {
    margin: 0;
}

.board-imgs {
    /* display: flex;   */
}
.board-imgs--last-inspi img {
    width: 100%;
    height: 100%;
    border-radius: 3px;
    cursor: pointer;
}

.board-imgs--last-inspi img:hover {
    /* box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .9); */
    transition: .3s linear;
    cursor: zoom-in;
}

.board-imgs--last-inspi div > div {
    margin-bottom: 1rem;
    position: relative;
    transition: .3s linear;
}

.board-imgs--last-inspi div > div > div .board-imgs-cover {
    transition: all .2s linear;
}

.board-imgs--last-inspi div > div > div:hover .board-imgs-cover {
    /* position: absolute;
    bottom: -.6rem;
    height: 50px;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .2);
    border-radius: 3px;
    transition: all .2s linear;
    z-index: 1;
    cursor: zoom-in; */

}


.board-imgs--last-inspi div > div .board-imgs-icon {
    display: none;
}

.board-imgs--last-inspi div > div > div:hover .board-imgs-icon {
    display: block;
    position: absolute;
    z-index: 2;
    font-size: 1.6rem;
    width: 2.1rem;
    height: 2.1rem;
    background: rgba(255, 255, 255, 1);
    padding: 0.5rem;
    box-sizing: border-box;
    border-radius: 20%;
    box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, .2);
    transition: linear 200ms all;
    cursor: pointer;
}

.dialog-imgs-icon {
    display: block;
    position: absolute;
    z-index: 2;
    font-size: 1.6rem;
    width: 2.5rem !important;
    height: 2.5rem !important;
    cursor: pointer;
    padding: 0.5rem;
    box-sizing: border-box;
    border-radius: 20%;
}

.dialog-imgs-icon.heart{
    bottom: .6rem;
    right: .8rem;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 0px 2px 1px 1px rgba(0, 0, 0, .2);
    transition: linear 200ms all;
}
.dialog-imgs-icon.heart:hover{
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, .2);
    transition: linear 200ms all;
    transform: scale(1.08);
}

.board-imgs--last-inspi div > div .board-imgs-del-icon {
    display: none;
}

.board-imgs-icon.budicon-trash.in-dialog {
    color: #FFFFFF;
    cursor: pointer;
    z-index: 15000;
}

.board-imgs--last-inspi div > div > div:hover .board-imgs-del-icon {
    display: block;
    position: absolute;
    z-index: 2;
    font-size: 1.6rem;
    bottom: .5rem;
    left: .5rem;
    color: #FFFFFF;
    animation: pulse 2s;
    cursor: pointer;
}

.board-imgs--last-inspi div > div > div:hover .board-imgs-icon.heart {
    bottom: 1rem;
    right: 1rem;
    color: #FFFFFF;
    animation: pulse 2s;
}
.board-imgs--last-inspi div > div > div:hover .board-imgs-icon.heart.is-favori {
    color: #F44336;
}
.board-imgs--last-inspi div > div > div:hover .board-imgs-del-icon .budicon-trash {
    font-size: 1.6rem;
}
.board-imgs--last-inspi div > div > div:hover .board-imgs-del-icon .budicon-trash:hover {
    color: #F44336;
}

.board-imgs-icon:hover {
    cursor: pointer;
}

.board-color-tags {
    display: flex;
}

.board-color-tag {
    width: 1.5rem;
    height: 1.5rem;
    background: currentColor;
    border-radius: 50%;
    margin-right: .5rem;
    cursor: pointer;
    transition: .1s linear all;
}

.board-color-tag:hover {
    transform: scale(1.2);
    transition: .1s linear all;
    cursor: pointer;
}

.board-color-tag.yellow {
    background: #F7CF47;
}

.board-color-tag.blue {
    background: #92B2E1;
}

.image-dialog {
    position: relative;
    background-color: transparent !important;
    width: fit-content;
    width: -moz-fit-content;
}

.image-dialog::after {
    /* content: '';
    height: 3.5rem;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .25); */
}

.image-dialog .el-dialog__body {
    padding: 0;
}

.image-dialog .el-dialog__header {
    padding: 0;
}

.image-dialog img {
    display: block;
    margin: 0 auto;
    max-height: 60vh;
    height: auto;
    width: auto;
}

.image-dialog .board-imgs-icon {
    display: block;
    position: absolute;
    font-size: 2rem;
}
.image-dialog .budicon-heart {
    bottom: 1rem;
    right: 1rem;
    color: #9E9E9E;
    animation: pulse 2s;
}
.image-dialog .budicon-heart.is-favori {
    color: #F44336;
}
.image-dialog .budicon-trash {
    bottom: 1rem;
    left: 1rem;
    color: #9E9E9E;
    animation: pulse 2s;
}
.image-dialog .budicon-trash:hover {
    color: #F44336;
}

.board-main .el-tabs__header {
    margin-top: -4rem;
}

.el-tabs__nav-wrap::after {
    height: 1px !important;
}

.board-main .el-tabs__nav {
    border: 1px solid #e4e7ed;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}

.el-tabs__content {
    height: 80vh;
    overflow-y: auto !important;
    overflow-y: overlay;
    overflow-x: hidden;
}

.el-dialog.is-fullscreen {
    overflow: hidden !important;
}
</style>
