<template id="room-drawer">
    <g v-if="showRoom">
        <background-drawer :house="house" :room="room"></background-drawer>

        <line v-bind:x1="this.scaleAndOffsetX(data.x1)" v-bind:y1="this.scaleAndOffsetY(data.y1)" class="room-line"
            v-bind:x2="this.scaleAndOffsetX(data.x2)" v-bind:y2="this.scaleAndOffsetY(data.y1)" :style="wallStyle"/> <!-- top -->

        <line v-bind:x1="this.scaleAndOffsetX(data.x1)" v-bind:y1="this.scaleAndOffsetY(data.y1)" class="room-line"
            v-bind:x2="this.scaleAndOffsetX(data.x1)" v-bind:y2="this.scaleAndOffsetY(data.y2)" :style="wallStyle"/> <!-- left -->

        <line v-bind:x1="this.scaleAndOffsetX(data.x2)" v-bind:y1="this.scaleAndOffsetY(data.y1)" class="room-line"
            v-bind:x2="this.scaleAndOffsetX(data.x2)" v-bind:y2="this.scaleAndOffsetY(data.y2)" :style="wallStyle"/> <!-- right -->

        <line v-bind:x1="this.scaleAndOffsetX(data.x1)" v-bind:y1="this.scaleAndOffsetY(data.y2)" class="room-line"
            v-bind:x2="this.scaleAndOffsetX(data.x2)" v-bind:y2="this.scaleAndOffsetY(data.y2)" :style="wallStyle"/> <!-- bottom -->

        <text :x="this.data.x" :y="this.data.y" :style="textStyle">
            {{ room.name }}
        </text>
    </g>
</template>

<script>
import BackgroundDrawer from "./BackgroundDrawer.vue";
import { mixin } from "./ScalingTools.js"
import { FONT_SIZE, INNER_WALL_COLOR, INNER_WALL_WIDTH, OUTER_WALL_WIDTH, OFFSET_X, OFFSET_Y, RATIO } from "./CONST.js";

export default {
    name: 'RoomDrawer',
    mixins: [mixin],
    components: {
        'background-drawer': BackgroundDrawer,
    },
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
            showRoom: false,
            data: {},
            wallStyle: {
                stroke: INNER_WALL_COLOR,
                strokeWidth: INNER_WALL_WIDTH,
                strokeLinecap: 'square'
            },
            textStyle: {
                display: "block",
                textAnchor: "middle",
                dominantBaseline: "central",
                fontSize: FONT_SIZE,
            }
        }
    },
    created() {
        [this.data.x1, this.data.y1, this.data.x2, this.data.y2] = [this.room.x, this.room.y, this.room.x + this.room.width, this.room.y + this.room.height];
        this.data.x = this.scaleAndOffsetX(this.room.x + this.room.width / 2);
        this.data.y = this.scaleAndOffsetY(this.room.y + this.room.height / 2);
        if (this.room.name !== 'trouL') this.showRoom = true;
    }
}

</script>

<style scoped>
    .room-line { mask: url(#doorsHoles); }
</style>
