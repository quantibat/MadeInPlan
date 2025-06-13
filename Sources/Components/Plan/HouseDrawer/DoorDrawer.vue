<template id="door-drawer">
    <g v-if="data.hinge">
        <path :d="data.semiCircle" :style="arcStyle" :transform="'translate(' + this.scaleAndOffsetX(door.x + data.xShift) + ', ' + this.scaleAndOffsetY(door.y + data.yShift) + ')'" />

        <g :transform="'translate(' + this.scaleAndOffsetX(data.hinge[0]) + ', ' + this.scaleAndOffsetY(data.hinge[1]) + ')'">
            <line :x1="this.moveHinge(data.top, data.left, data.horizontal)[0]" :y1="0"
                :x2="this.moveHinge(data.top, data.left, data.horizontal)[0]" :y2="-this.scale(door.type.size)" :style="doorStyle"
                :transform="'rotate(' + this.getArcAngles(data.room, door, data.horizontal)[1] * 180 / Math.PI + ')'"/>
        </g>
    </g>
</template>

<script>
import { arc } from "d3-shape";
import { mixin } from "./ScalingTools.js";
import { DOOR_WIDTH, INNER_WALL_WIDTH } from "./CONST.js";

export default {
    name: 'DoorDrawer',
    mixins: [mixin],
    props: {
        'rooms': {
            type: Array,
            required: true
        },
        'door': {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            doorStyle: {
                stroke: "black",
                strokeWidth: DOOR_WIDTH
            },
            arcStyle: {
                stroke: "black",
                strokeDasharray: "3, 7",
                fill: "none"
            },
            data: {}
        }
    },
    methods: {
        getHingePosition(door, top, left, horizontal) {
            let x = door.x;
            let y = door.y;
            const vertical = !horizontal;
            const bottom = !top;
            const right = !left;

            if(bottom && vertical) y += door.type.size;
            if(right && horizontal) x += door.type.size;

            return [x, y];
        },
        moveHinge(top, left, horizontal) {
            var x = 0;
            var y = 0;
            if (!horizontal) x = (left ? 1 : -1)
            else x = (left ? -1 : 1);
            return [x, y];
        },
        getDoorOpeningSide([a, b]) {
            return b;
        },
        positionInRoom(room, door) {
            const left = (room.x + room.width / 2) > door.x;
            const top = (room.y + room.height / 2) > door.y;
            return [left, top];
        },
        getArcAngles(room, door, horizontal) {
            const [left, top] = this.positionInRoom(room, door);
            const space = 0; // Math.PI / 8;

            // top left and vertical
            if(top && left && !horizontal) return [Math.PI, Math.PI / 2 + space];
            // top left and horizontal
            if(top && left && horizontal) return [Math.PI / 2, Math.PI - space];
            // top right and vertical
            if(top && !left && !horizontal) return [Math.PI, Math.PI * 3 / 2 - space];
            // top right and horizontal
            if(top && !left && horizontal) return [Math.PI * 3 / 2, Math.PI + space];
            // bottom left and vertical
            if(!top && left && !horizontal) return [0, Math.PI / 2 - space];
            // bottom left and horizontal
            if(!top && left && horizontal) return [Math.PI / 2, space];
            // bottom right and vertical
            if(!top && !left && !horizontal) return [2 * Math.PI, 3 * Math.PI / 2 + space];
            // bottom right and horizontal
            if(!top && !left && horizontal) return [Math.PI * 3 / 2, 2 * Math.PI - space];
        }
    },
    created() {
        this.data.horizontal = this.door.shape == 'HORIZONTAL';
        this.data.room = this.rooms.filter(r => r.name === this.getDoorOpeningSide(this.door.rooms))[0];

        [this.data.startAngle, this.data.endAngle] = this.getArcAngles(this.data.room, this.door, this.data.horizontal);
        [this.data.left, this.data.top] = this.positionInRoom(this.data.room, this.door);

        this.data.xShift = !this.data.horizontal ? 0 * (this.data.left ? 1 : -1) / 2 : 0;
        this.data.yShift = this.data.horizontal ? 0 * (this.data.top ? 1 : -1) / 2 : 0;

        if (!this.data.top) this.data.yShift += this.door.height;
        if (!this.data.left) this.data.xShift += this.door.width;

        this.data.semiCircle = arc()
        .innerRadius(this.scale(this.door.type.size))
        .outerRadius(this.scale(this.door.type.size))
        .startAngle(this.data.startAngle)
        .endAngle(this.data.endAngle)();

        if (this.door.type.type == 'DOOR')
            this.data.hinge = this.getHingePosition(this.door, this.data.top, this.data.left, this.data.horizontal);
    }
}
</script>

<style scoped>
</style>
