<template id="background-drawer">
    <g>
        <defs>
            <pattern :id="data.id" patternUnits="userSpaceOnUse" :width="data.width" :height="data.height" v-bind:x="data.shiftX" v-bind:y="data.shiftY">
                <image :xlink:href="data.image" :width="data.width" :height="data.height"/>
            </pattern>
        </defs>
        <rect :fill="'url(#' + data.id + ')'" v-bind:x="this.scaleAndOffsetX(room.x)" v-bind:y="this.scaleAndOffsetY(room.y)" :width="this.scale(room.width)" :height="this.scale(room.height)"/>
    </g>
</template>

<script>
import { mixin } from "./ScalingTools.js";
import { INNER_WALL_WIDTH, OUTER_WALL_WIDTH, BACKGROUNDS, FILL_BY_ROOM } from "./CONST.js";

export default {
    name: 'BackgroundDrawer',
    mixins: [mixin],
    props: {
        'house': {
            type: Object,
            required: true
        },
        'room': {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            shiftX: 0,
            shiftY: 0,
            rect: false,
            data: {}
        }
    },
    methods: {
        getFillInfo(room) {
            var info = BACKGROUNDS[FILL_BY_ROOM[room.name]];
            info.id = FILL_BY_ROOM[room.name];
            return info;
        }
    },
    created() {
        this.data = this.getFillInfo(this.room);
        this.shiftX += 50;
        this.shiftY += 50;
    },
}

</script>

<style scoped>
</style>
