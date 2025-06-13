<template id="door-hole">
    <line v-bind:x1="this.scaleAndOffsetX(door.x)" v-bind:y1="this.scaleAndOffsetY(door.y)" :style="doorHoleStyle"
        v-bind:x2="this.scaleAndOffsetX(door.x + door.width)" v-bind:y2="this.scaleAndOffsetY(door.y + door.height)"/>
</template>

<script>
import { mixin } from "./ScalingTools.js";
import { INNER_WALL_WIDTH, OUTER_WALL_WIDTH, BACKGROUNDS, FILL_BY_ROOM } from "./CONST.js";

export default {
    name: 'DoorHole',
    mixins: [mixin],
    props: {
        'door': {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            doorHoleStyle: {
                stroke: "black",
                strokeWidth: INNER_WALL_WIDTH + 1
            }
        }
    },
}

</script>

<style scoped>
</style>
