<template id="window-hole">
    <line :x1="x1" :y1="y1" :x2="x2" :y2="y2" :style="windowHoleStyle"/>
</template>

<script>
import { mixin } from "./ScalingTools.js";
import { INNER_WALL_WIDTH, OUTER_WALL_WIDTH } from "./CONST.js";

export default {
    name: 'WindowHole',
    mixins: [mixin],
    props: {
        'house': {
            type: Object,
            required: true
        },
        'window': {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            windowHoleStyle: {
                stroke: "black",
                strokeWidth: OUTER_WALL_WIDTH + 1
            },
            verticalShift: 0,
            horizontalShift: 0,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        }
    },
    created() {
        const roomName = this.window.room;
        const room = this.house.rooms.filter(r => r.name === roomName)[0];
        if (this.window.shape === 'HORIZONTAL') {
            let verticalShift = this.window.y === room.y ? -1 : 1;
            this.x1 = this.scaleAndOffsetX(this.window.x);
            this.x2 = this.scaleAndOffsetX(this.window.x + this.window.type.size);
            this.y1 = this.scaleAndOffsetY(this.window.y);
            this.y2 = this.scaleAndOffsetY(this.window.y);
        } else {
            let horizontalShift = this.window.x === room.x ? -1 : 1;
            this.x1 = this.scaleAndOffsetX(this.window.x);
            this.x2 = this.scaleAndOffsetX(this.window.x);
            this.y1 = this.scaleAndOffsetY(this.window.y);
            this.y2 = this.scaleAndOffsetY(this.window.y + this.window.type.size);
        }
    }
}

</script>

<style scoped>
</style>
