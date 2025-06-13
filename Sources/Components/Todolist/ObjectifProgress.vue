<template>
    <el-row class="objectif-progress" type="flex" align="middle" justify="center">
        <!-- <span class="circle-green">{{ currentIndex }}</span> -->
        <div class="progress-outer">
            <div class="progress-inner" ref="inner" :style="{ width: (getProgress() * 100) + '%' }">
                <span v-if="tooltip" class="tooltip">{{ currentObjectif.completeTask }}/{{ currentObjectif.totalTask }}</span>
            </div>
        </div>
        <!-- <span :class="'circle-' + (currentObjectif.totalTask == currentObjectif.completeTask ? 'green' : 'grey')">{{ nextIndex }}</span> -->
    </el-row>
</template>

<script>
export default {
    name: 'ObjectifProgress',
    props: {
        'tooltip': Boolean
    },
    computed: {
        currentObjectif() {
            return this.$store.state.currentObjectif;
        },
        prevObjectif() {
            return this.$store.getters.prevObjectif;
        },
        nextObjectif() {
            return this.$store.getters.nextObjectif;
        }
    },
    data() {
        return {
            currentIndex: '',
            nextIndex: '',
            tooltipWidth: 0
        }
    },
    created() {
        this.currentIndex = this.prevObjectif != null ? this.currentObjectif.index : ' ';
        this.nextIndex = this.nextObjectif != null ? this.currentObjectif.index + 1 : ' ';
    },
    watch: {
        currentObjectif: {
            handler: function (newObj) {
                this.currentIndex = this.prevObjectif != null ? this.currentObjectif.index : ' ';
                this.nextIndex = this.nextObjectif != null ? this.currentObjectif.index + 1 : ' ';
            },
            deep: true
        }
    },
    methods: {
        getProgress() {
            if (this.currentObjectif.totalTask > 0 && this.currentObjectif.completeTask > 0)
                return this.currentObjectif.completeTask / this.currentObjectif.totalTask;
            else
                return 0;
        }
    }
}
</script>

<style scoped>
.objectif-progress { margin: 0 auto; }

.circle-green { background-color: #02C701; border-radius: 50%; color: #FFFFFF; width: 30px; height: 30px; text-align: center; line-height: 30px; z-index: 2; }

.progress-outer {border: 1px solid rgba(33, 45, 89, .09); background-color: #EDEEF2; height: 14px; border-radius: 10px; flex-grow: 1; margin-left: -10px; margin-right: -10px; }
.progress-inner {   background: linear-gradient(90deg, rgba(46,204,113,1) 0%, rgba(110,209,105,1) 56%, rgba(145,212,101,1) 100%);height: 100%; border-radius: 25px; transition: width 1s; }

.circle-grey { background-color: #EDEEF2; border-radius: 50%; color: #BABECC; width: 30px; height: 30px; text-align: center; line-height: 30px; }

.tooltip { min-width: 50px; border: solid 1px #E0E2E8; position: relative; z-index: 1; width: auto; background-color: #FBFBFC; color: #212D59; text-align: center; letter-spacing: -1px; font-weight: 500; font-size: 15px; padding: 5px 0; border-radius: 4px; bottom: 50px; float: right; left: 26px; }
.tooltip:after, .tooltip:before { top: 100%; left: 50%; border: solid transparent; content: " "; height: 0; width: 0; position: absolute; pointer-events: none; }
.tooltip:after { border-color: rgba(251, 251, 252, 0); border-top-color: #FBFBFC; border-width: 5px; margin-left: -5px; }
.tooltip:before { border-color: rgba(224, 226, 232, 0); border-top-color: #E0E2E8; border-width: 6px; margin-left: -6px; }


</style>
