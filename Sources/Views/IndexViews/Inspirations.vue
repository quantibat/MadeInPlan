<template>
    <div class="main-container">
        <el-dialog title="Ajouter un board" :visible.sync="addBoardDialog.show" class="inspi-new-board-modal">
            <el-input autofocus v-model="addBoardDialog.name" placeholder="Nom du nouveau board"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button class="btn-add" @click="add()">Sauvegarder</el-button>
                <el-button class="btn-cancel" @click="cancel()">Annuler</el-button>
            </span>
        </el-dialog>

        <board-item v-if="showBoardItemDialog" :open="showBoardItemDialog" :close="closeBoardItemDialog" />
        <!-- <el-row align="bottom" class="header">
            <h1>Inspirations</h1>
        </el-row> -->
<h2 class="section-description">Tout pour faire mes choix esthétiques</h2>
        <el-row class="inspi-container" type="flex">
            <el-col :sm="7" :md="7" :lg="6" :xl="5" class="inspi-card new">
                <div class="inspi-card--new" @click="addBoardDialog.show = true">
                    <i class="inspi-card--icon budicon budicon-plus-ui"></i>
                    <p>Nouveau board</p>
                </div>
            </el-col>

            <el-col :sm="7" :md="7" :lg="6" :xl="5" v-for="board in boards" :key="board._id" class="inspi-card">
                <el-popover placement="top" trigger="click" v-model="board._showDel">
                    <el-row type="flex" justify="center">
                        <span class="remove-title">Êtes-vous sûr ?</span>
                    </el-row>
                    <el-row type="flex" justify="center">
                        <el-button type="secondary" size="mini" style="button-remove" @click="board._showDel = false">Annuler</el-button>
                        <el-button type="danger" size="mini" class="button-remove"  @click.stop="remove(board)">Supprimer</el-button>
                    </el-row>
                    <div style="" v-if="board.user == user._id" class="inspi-budicon" slot="reference" @click.stop="board._showDel = true;">
                        <i class="budicon budicon-trash"></i>
                    </div>
                </el-popover>
                <div :xl="23" class="inspi-card--item" @click="showBoardItem(board._id)">
                    <h3 class="inspi-card--title">{{ board.name }}</h3>
                    <span class="inspi-card--counter">{{ board.nbPicture }} inspiration{{ board.nbPicture > 1 ? 's' : '' }} - {{ getFavoriteInspirationCount(board._id) }} favori{{ getFavoriteInspirationCount(board._id) > 1 ? 's' : '' }}</span>
                    <div class="inspi-card--last-inspi">
                        <masonry :cols="{ default: 3, 1000: 3, 700: 2, 400: 1 }" :gutter="{ default: '1rem', 700: '1rem' }">
                            <div v-for="inspiration in inspirations.filter(item => item.board == board._id).slice(0, 13)" :key="inspiration._id">
                                <img :src="'/upload/Inspiration/' + (inspiration.user == null ? 'Default/' : inspiration.user + '/') + inspiration.url">
                            </div>
                        </masonry>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import BoardItem from '../../Components/Inspirations/boardItem.vue'

export default {
    name: 'Inspirations',
    components : {
        'board-item': BoardItem,
    },
    data() {
        return {
            boards: [],
            inspirations: [],
            currentBoardID: {},
            addBoardDialog: {
                show: false,
                name: ''
            },
            showBoardItemDialog: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    created() {
        this.$http.get('/inspiration/get').then(res => {
            this.boards = res.data.boards;
            var inspirations = res.data.inspirations
            inspirations.forEach(item => { item._showDel = false; });
            this.inspirations = inspirations;
        }, err => {});
    },
    methods: {
        add() {
            this.$http.post('/inspiration/board/add', { name: this.addBoardDialog.name }).then(res => {
                this.boards.push(res.data.board);
                this.addBoardDialog.show = false;
            }, err => {});
        },
        cancel() {
            this.addBoardDialog.name = '';
            this.addBoardDialog.show = false;
        },
        remove(board) {
            this.$http.post('/inspiration/board/delete', { id: board._id }).then(res => {
                var i = this.boards.findIndex(item => item._id == board._id);
                this.boards.splice(i, 1);
                this.$message.success('Suppression confirmée');
            }, err => {});
        },
        getFavoriteInspirationCount(board) {
            return this.inspirations.filter(item => {
                return ((item.board == board) && (item.favoriArray.indexOf(this.user._id) == -1 ? false : true))
            }).length;
        },
        showBoardItem(id) {
            this.currentBoardID = id;
            this.showBoardItemDialog = true
        },
        closeBoardItemDialog() {
            this.showBoardItemDialog = false
        }
    }
}
</script>
<style scoped>

.main-container {
    margin-left: .3rem;
}

.inspi-container {
    margin-top: 2rem;
    flex-wrap: wrap;
}

.inspi-card {
    display: flex;
    max-height: 250px;
    /* width: 21%; */
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1);
    border-radius: 5px;
    transition: .2s linear all;
    margin-right: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    padding: 0 0 2rem;
}

.inspi-card.new {
    border: 1px dashed rgba(35, 49, 88, 0.2);
}

.inspi-card:hover {
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .1);
    transition: .2s linear all;
    cursor: pointer;
}


.inspi-card--new {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    color: rgba(35, 49, 88, .3);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4rem;
    padding-bottom: 1.85rem;
    box-sizing: border-box;
    text-align: center;
    line-height: 1.4;
}

.inspi-card.new:hover {
    border: 1px dashed #00BBFF;
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .04);
}

.inspi-card--new:hover p {
    color: #00BBFF;
    transition: .2s linear all;
}

.inspi-card--icon {
    color: #00BBFF;
    font-size: 2.5rem;
    font-weight: 500;
}
.inspi-card--new p {
    margin: 0;
    transition: .2s linear all;
}

.inspi-card--item {
    display: flex;
    flex-direction: column;
    padding: 1.5rem 2rem;
    overflow: hidden;
}

.inspi-card--title {
    margin: 0;
    color: rgba(35, 49, 88, 1);
    font-weight: 600;
    line-height: 1.4
}

.inspi-budicon {
    display: none;
}
.inspi-card:hover .inspi-budicon {
    display: block;
    position: absolute;
    z-index: 2;
    font-size: 1.6rem;
    top: 1rem;
    right: 1rem;
    color: rgba(35, 49, 88, 0.5);
}

.inspi-card:hover .inspi-budicon i {
    font-size: 1.6rem;
}

.inspi-card:hover .inspi-budicon i:hover {
    color: rgba(35, 49, 88, 1);
}


.inspi-card--counter {
    color: #00BBFF;
    font-size: .9rem;
}

.inspi-card--last-inspi {
    margin-top: 1rem;
}

.inspi-card--last-inspi img {
    width: 100%;
    border-radius: 3px;
}

.inspi-card--last-inspi.no-inspi {
    display: flex;
    flex-direction: column;
    top: 5rem;
    bottom: 2rem;
    position: absolute;
    left: 2rem;
    right: 2rem;
    text-align: center;
    border: 1px dashed rgba(0, 51, 191, 0.2);
    border-radius: 5px;
    color: #00BBFF;
    transition: .2s linear;
}

.inspi-card--last-inspi.no-inspi:hover {
    border: 1px dashed #00BBFF;
    transition: .2s linear;
}

.inspi-card--last-inspi.no-inspi i {
    margin: auto;
    font-size: 2rem;
}

.inspi-new-board-modal {
    width: 100vw;
    margin: auto;
    background:#fff;
}

.btn-add {
    color: #fff;
    background: #31BDFC;
    background: linear-gradient(5deg,#31BDFC,#00D3F7);
    border-radius: 6px !important;
    padding: 1.3rem 2rem;
    font-size: 1.2rem;
    cursor: pointer;
    transition: .2s ease-in-out;
    border: none;
}

.btn-cancel {
    border: none;
    font-size: 1.2rem;
    color: rgba(35, 49, 88, .5);
    font-weight: 400;
    background: none;
}

.btn-cancel:hover {
    background:none !important;
}

.section-description {
    margin: 0;
    margin-top: 0rem;
    font-weight: 400;
    color: #212D59;
    opacity: .5;
    font-size: 1rem;
}


</style>
