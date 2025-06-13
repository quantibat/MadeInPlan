<template id="house-drawer">
    <div id="canvas-drawer" />
</template>

<script>
import * as THREE from 'three';
import Two from 'two.js';
import { mixin } from "./ScalingTools.js"
import { INNER_WALL_WIDTH, HUMAN_SPACE, CUPBOARD_COLOR, KITCHEN_TABLE_HEIGHT, KITCHEN_TABLE_WIDTH, WALL_DOUBLING_WIDTH, WALL_DOUBLING_COLOR, FURNITURE_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, INNER_DOOR_WIDTH, CUPBOARD_WIDTH, BED_HEIGHT, KITCHEN_SINK_HEIGHT, WORKPLAN_KITCHEN_HEIGHT, WC_HEIGHT, SINK_HEIGHT, SINK_WIDTH, BATHROOM_HEIGHT, CUPBOARD_DASH_SIZE, SHOWER_HEIGHT, OFFSET_X, GARAGE_DASH_SIZE, WINDOW_DASH_SIZE, OFFSET_Y, OUTER_WALL_WIDTH, ROOM_COLORS, WALL_COLOR, SHIFT, DOOR_COLOR, DOOR_WIDTH, WINDOW_COLOR, WINDOW_WIDTH, FONT_COLOR, FONT_SIZE } from "./CONST.js";

export default {
    name: 'HouseDrawer',
    mixins: [mixin],
    props: {
        'house': {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            canvas: {
                width: 0,
                height: 0
            },
            ratio: 60
        }
    },
    mounted() {
        const canvasDrawer = document.querySelector('#canvas-drawer');
        this.ratio = (canvasDrawer.clientWidth - OFFSET_X - SHIFT) / this.house.width;
        console.log(this.ratio);
        this.canvas.width = (this.house.width * this.ratio) + OFFSET_X + SHIFT;
        this.canvas.height = (this.house.height * this.ratio) + OFFSET_Y + SHIFT;
        var elem = document.getElementById('canvas-drawer');
        var params = { width: this.canvas.width, height: this.canvas.height, autostart: true };
        var two = new Two(params).appendTo(elem);
        this.render(two);
    },
    methods: {
        render(two) {
            console.log(this.house);
            this.renderRooms(this.house.rooms, two);
            this.createOpenings(this.house.openings, two);
            this.createDoors(this.house.doors, two);
            this.createFurniture(two);
            this.createCupboard(this.house.rooms.filter((room) => room.name.split(' ')[0] === 'Placard'), two);
            two.update();
        },
        createFurniture(two){
            this.createBathroomFurniture(this.house.rooms.find((room) => room.name === 'Salle de Bain'), two);
            const waterRoom = this.house.rooms.find((room) => room.name === 'Salle d\'eau');
            if (waterRoom !== undefined)
                this.createBathroomFurniture(waterRoom, two);
            this.createWCFurniture(this.house.rooms.find((room) => room.name === 'WC'), two);
            this.createKitchenFurniture(this.house.rooms.find((room) => room.name === 'Cuisine'), two)
            const bedrooms = this.house.rooms.filter((room) => room.name.split(' ')[0] === 'Chambre');
            bedrooms.forEach((bedroom) => this.createBedroomFurniture(bedroom, two));
            this.createLivingRoomFurniture(this.house.rooms.find((room) => room.name === 'Salon'), two);
        },
        createLivingRoomFurniture(livingRoom, two) {
            const orientation = this.findRoomOrientation(livingRoom);
            this.drawLivingRoomTable(livingRoom, orientation, two);
        },
        createBedroomFurniture(bedroom, two) {
            const outdoorWallPosition = this.findOutdoorWallWithNoOpening(bedroom);
            const doorPosition = this.findDoorPosition(bedroom);
            if (outdoorWallPosition !== 'none') {
                this.drawBed(bedroom, outdoorWallPosition, two);
            } else {
                const wallsPosition = this.findWallsWithNoOpening(bedroom);
                var index = 0;
                if (!doorPosition.direction) {
                    if (wallsPosition[0] === 'top' || wallsPosition[0] === 'left')
                        index = 1;
                }
                this.drawBed(bedroom, wallsPosition[index], two);
            }
        },
        createKitchenFurniture(kitchen, two) {
            const kitchenPosition = this.findOutdoorWallWithOpening(kitchen);
            const orientation = this.findRoomOrientation(kitchen);
            this.drawKitchenTable(kitchen, orientation, kitchenPosition, two);
            this.drawKitchenWorkPlan(kitchen, kitchenPosition, two);
            this.drawKitchentSink(kitchen, kitchenPosition, two);
        },
        createWCFurniture(WC, two) {
            const door = this.house.doors.find((door) => door.rooms[1] === WC.name);
            var doorDirection = null;
            if (door.shape === 'HORIZONTAL') {
                const doorPosY = Math.round(door.y * this.ratio) + OFFSET_Y;
                var doorPosition = 'bottom';
                var doorDirection = undefined;
                if (this.isTop(doorPosY, doorPosY, WC))
                    doorPosition = 'top';
                if ((door.x + (door.type.size / 2)) > (WC.x + (WC.width / 2)))
                    doorDirection = true;
                else if ((door.x + (door.type.size / 2)) < (WC.x + (WC.width / 2)))
                    doorDirection = false;
                doorDirection =  { position: doorPosition, direction: doorDirection};
            } else {
                const doorPosX = Math.round(door.x * this.ratio) + OFFSET_X;
                var doorPosition = 'right';
                var doorDirection = undefined;
                if (this.isLeft(doorPosX, doorPosX, WC))
                    doorPosition = 'left';
                if ((door.y + (door.type.size / 2)) > (WC.y + (WC.height / 2)))
                    doorDirection = true;
                else if ((door.y + (door.type.size / 2)) < (WC.y + (WC.height / 2)))
                    doorDirection = false;
                doorDirection =  { position: doorPosition, direction: doorDirection};
            }
            if (WC.width / WC.height > 0.5 && WC.width / WC.height < 1.5) {
                if (doorDirection.position === 'top')
                    this.drawWC(WC, 'bottom', two);
                else if (doorDirection.position === 'bottom')
                    this.drawWC(WC, 'top', two);
                else if (doorDirection.position === 'left')
                    this.drawWC(WC, 'right', two);
                else if (doorDirection.position === 'right')
                    this.drawWC(WC, 'left', two);
            } else {
                if (doorDirection.position === 'top')
                    this.drawWC(WC, (doorDirection.direction)?'left':'right', two);
                else if (doorDirection.position === 'bottom')
                    this.drawWC(WC, (doorDirection.direction)?'left':'right', two);
                else if (doorDirection.position === 'left')
                    this.drawWC(WC, (doorDirection.direction)?'top':'bottom', two);
                else if (doorDirection.position === 'right')
                    this.drawWC(WC, (doorDirection.direction)?'top':'bottom', two);
            }
        },
        createBathroomFurniture(bathroom, two){
            const bathroomPosition = this.findOutdoorWallWithOpening(bathroom);
            const doorPosition = this.findDoorPosition(bathroom);
            if (bathroom.name === 'Salle de Bain') {
                this.drawBath(bathroom, bathroomPosition, two);
                if (bathroom.width * bathroom.height >= 7)
                    this.drawShower(bathroom, doorPosition, bathroomPosition, two);
                this.drawBathroomSink(bathroom, doorPosition, bathroomPosition, two);
            } else {
                this.drawShower(bathroom, doorPosition, bathroomPosition, two);
                this.drawBathroomSink(bathroom, doorPosition, bathroomPosition, two);
            }
            
        },
        drawKitchenTable(kitchen, orientation, kitchenPosition, two) {
            var display = true;
            var centerX = (kitchen.x + kitchen.width / 2) * this.ratio + OFFSET_X;
            var centerY = (kitchen.y + kitchen.height / 2) * this.ratio + OFFSET_Y;
            var spaceDiff = 0;
            if (orientation === 'HORIZONTAL') {
                const tableSize = KITCHEN_TABLE_WIDTH - ((kitchen.height / 2) - WORKPLAN_KITCHEN_HEIGHT - HUMAN_SPACE);
                spaceDiff = (KITCHEN_TABLE_WIDTH / 2) - ((kitchen.height / 2) - WORKPLAN_KITCHEN_HEIGHT - HUMAN_SPACE)
                if ((kitchen.height / 2) - tableSize < HUMAN_SPACE)
                    display = false;
            } else {
                const tableSize = KITCHEN_TABLE_HEIGHT - ((kitchen.width / 2) - WORKPLAN_KITCHEN_HEIGHT - HUMAN_SPACE);
                spaceDiff = (KITCHEN_TABLE_HEIGHT / 2) - ((kitchen.width / 2) - WORKPLAN_KITCHEN_HEIGHT - HUMAN_SPACE);
                if ((kitchen.width / 2) - tableSize < HUMAN_SPACE)
                    display = false;
            }
            if (kitchenPosition === 'top') {
                centerY += spaceDiff * this.ratio;
            } else if (kitchenPosition === 'bottom') {
                centerY -= spaceDiff * this.ratio;
            } else if (kitchenPosition === 'left') {
                centerX += spaceDiff * this.ratio;
            } else if (kitchenPosition === 'right') {
                centerX -= spaceDiff * this.ratio;
            }
            if (display) {
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/kitchen-table.png", centerX, centerY);
                sprite.scale = 0.001 * this.ratio;
                if (orientation === 'HORIZONTAL')
                    sprite.rotation = 1.57;
                two.add(sprite);
            }
        },
        drawLivingRoomTable(livingRoom, orientation, two) {
            const centerX = (livingRoom.x + livingRoom.width / 2) * this.ratio + OFFSET_X;
            const centerY = (livingRoom.y + livingRoom.height / 2) * this.ratio + OFFSET_Y;
            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/livingroom-table.png", centerX, centerY);
            sprite.scale = 0.001 * this.ratio;
            if (orientation === 'HORIZONTAL')
                sprite.rotation = 1.57;
            two.add(sprite);
        },
        drawBed(bedroom, bedroomPosition, two) {
            if (bedroomPosition === 'left') {
                const bedX = bedroom.x * this.ratio + 2 + OFFSET_X;
                const bedY = (bedroom.y + (bedroom.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bed.png", bedX, bedY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(bedX + (BED_HEIGHT * sprite.scale / 2), bedY);
                sprite.rotation = -1.57;
                two.add(sprite);
            } else if (bedroomPosition === 'right') {
                const bedX = (bedroom.x + bedroom.width) * this.ratio - 2 + OFFSET_X;
                const bedY = (bedroom.y + (bedroom.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bed.png", bedX, bedY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(bedX - (BED_HEIGHT * sprite.scale / 2), bedY);
                sprite.rotation = 1.57;
                two.add(sprite);
            } else if (bedroomPosition === 'top') {
                const bedX = (bedroom.x + (bedroom.width / 2)) * this.ratio + OFFSET_X;
                const bedY = bedroom.y * this.ratio + 2 + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bed.png", bedX, bedY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(bedX, bedY + (BED_HEIGHT * sprite.scale / 2));
                sprite.rotation = 0;
                two.add(sprite);
            } else if (bedroomPosition === 'bottom') {
                const bedX = (bedroom.x + (bedroom.width / 2)) * this.ratio + OFFSET_X;
                const bedY = (bedroom.y + bedroom.height) * this.ratio - 2 + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bed.png", bedX, bedY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(bedX, bedY - (BED_HEIGHT * sprite.scale / 2));
                sprite.rotation = 3.14;
                two.add(sprite);
            }
        },
        drawKitchentSink(kitchen, kitchenPosition, two) {
            if (kitchenPosition === 'left') {
                const kitchenX = kitchen.x * this.ratio + 2 + OFFSET_X;
                const kitchenY = (kitchen.y + (kitchen.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/kitchen-sink.png", kitchenX, kitchenY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(kitchenX + (KITCHEN_SINK_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), kitchenY);
                sprite.rotation = -1.57;
                two.add(sprite);
            } else if (kitchenPosition === 'right') {
                const kitchenX = (kitchen.x + kitchen.width) * this.ratio - 2 + OFFSET_X;
                const kitchenY = (kitchen.y + (kitchen.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/kitchen-sink.png", kitchenX, kitchenY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(kitchenX - (KITCHEN_SINK_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), kitchenY);
                sprite.rotation = 1.57;
                two.add(sprite);
            } else if (kitchenPosition === 'top') {
                const kitchenX = (kitchen.x + (kitchen.width / 2)) * this.ratio + OFFSET_X;
                const kitchenY = kitchen.y * this.ratio + 2 + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/kitchen-sink.png", kitchenX, kitchenY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(kitchenX, kitchenY + (KITCHEN_SINK_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                sprite.rotation = 0;
                two.add(sprite);
            } else if (kitchenPosition === 'bottom') {
                const kitchenX = (kitchen.x + (kitchen.width / 2)) * this.ratio + OFFSET_X;
                const kitchenY = (kitchen.y + kitchen.height) * this.ratio - 2 + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/kitchen-sink.png", kitchenX, kitchenY);
                sprite.scale = 0.001 * this.ratio;
                sprite.translation.set(kitchenX, kitchenY - (KITCHEN_SINK_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                sprite.rotation = 3.14;
                two.add(sprite);
            }
        },
        drawKitchenWorkPlan(kitchen, kitchenPosition, two) {
            if (kitchenPosition === 'left') {
                const kitchenX = (kitchen.x + WORKPLAN_KITCHEN_HEIGHT/2) * this.ratio + 2 + OFFSET_X + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75);
                const kitchenY = (kitchen.y + (kitchen.height / 2)) * this.ratio + OFFSET_Y;
                var rect = two.makeRectangle(kitchenX, kitchenY, WORKPLAN_KITCHEN_HEIGHT * this.ratio, kitchen.height * this.ratio - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) - 5);
                rect.stroke = FURNITURE_COLOR;
                rect.fill = '#fff';
                rect.linewidth = 0.5;
            } else if (kitchenPosition === 'right') {
                const kitchenX = (kitchen.x + kitchen.width - WORKPLAN_KITCHEN_HEIGHT/2) * this.ratio - 2 + OFFSET_X - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75);
                const kitchenY = (kitchen.y + (kitchen.height / 2)) * this.ratio + OFFSET_Y;
                var rect = two.makeRectangle(kitchenX, kitchenY, WORKPLAN_KITCHEN_HEIGHT * this.ratio, kitchen.height * this.ratio - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) - 5);
                rect.stroke = FURNITURE_COLOR;
                rect.fill = '#fff';
                rect.linewidth = 0.5;
            } else if (kitchenPosition === 'top') {
                const kitchenX = (kitchen.x + (kitchen.width / 2)) * this.ratio + OFFSET_X;
                const kitchenY = (kitchen.y + WORKPLAN_KITCHEN_HEIGHT/2) * this.ratio + 2 + OFFSET_Y + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75);
                var rect = two.makeRectangle(kitchenX, kitchenY, kitchen.width * this.ratio - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) - 5, WORKPLAN_KITCHEN_HEIGHT * this.ratio);
                rect.stroke = FURNITURE_COLOR;
                rect.fill = '#fff';
                rect.linewidth = 0.5;
            } else if (kitchenPosition === 'bottom') {
                const kitchenX = (kitchen.x + (kitchen.width / 2)) * this.ratio + OFFSET_X;
                const kitchenY = (kitchen.y + kitchen.height - WORKPLAN_KITCHEN_HEIGHT/2) * this.ratio - 2 + OFFSET_Y - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75);
                var rect = two.makeRectangle(kitchenX, kitchenY, kitchen.width * this.ratio - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) - 5, WORKPLAN_KITCHEN_HEIGHT * this.ratio);
                rect.stroke = FURNITURE_COLOR;
                rect.fill = '#fff';
                rect.linewidth = 0.5;
            }
        },
        drawWC(WC, WCPosition, two) {
            if (WCPosition === 'left') {
                const wcX = (WC.x) * this.ratio + OFFSET_X;
                const wcY = (WC.y + (WC.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/wc.png", wcX, wcY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.translation.set(wcX + (WC_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), wcY);
                sprite.rotation = -1.57;
                two.add(sprite);
            } else if (WCPosition === 'right') {
                const wcX = (WC.x + WC.width) * this.ratio + OFFSET_X;
                const wcY = (WC.y + (WC.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/wc.png", wcX, wcY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.translation.set(wcX - (WC_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), wcY);
                sprite.rotation = 1.57;
                two.add(sprite);
            } else if (WCPosition === 'top') {
                const wcX = (WC.x + (WC.width / 2)) * this.ratio + OFFSET_X;
                const wcY = WC.y * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/wc.png", wcX, wcY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.translation.set(wcX, wcY + (WC_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                two.add(sprite);
            } else if (WCPosition === 'bottom') {
                const wcX = (WC.x + (WC.width / 2)) * this.ratio + OFFSET_X;
                const wcY = (WC.y + WC.height) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/wc.png", wcX, wcY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.rotation = 3.14;
                sprite.translation.set(wcX, wcY - (WC_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                two.add(sprite);
            }
        },
        drawBathroomSink(bathroom, doorPosition, bathroomPosition, two) {
            if (bathroom.name === 'Salle de Bain') {
                if (bathroom.width * bathroom.height >= 7) {
                    if (doorPosition.direction !== undefined) {
                        if (bathroomPosition === 'top') {
                            var offset = 0;
                            var rotation = 3.14;
                            if (doorPosition.direction) {
                                offset = bathroom.width;
                                rotation = 0;
                            }
                            const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + bathroom.height - ((bathroom.height - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (doorPosition.direction)
                                sprite.translation.set(bathX - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            else
                                sprite.translation.set(bathX + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            two.add(sprite);
                        } else if (bathroomPosition == 'bottom') {
                            var offset = 0;
                            var rotation = 3.14;
                            if (doorPosition.direction) {
                                offset = bathroom.width;
                                rotation = 0;
                            }
                            const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + ((bathroom.height - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (doorPosition.direction)
                                sprite.translation.set(bathX - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            else
                                sprite.translation.set(bathX + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            two.add(sprite);
                        } else if (bathroomPosition == 'left') {
                            var offset = 0;
                            var rotation = -1.57;
                            if (doorPosition.direction) {
                                offset = bathroom.height;
                                rotation = 1.57;
                            }
                            const bathX = (bathroom.x + bathroom.width - ((bathroom.width - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (doorPosition.direction)
                                sprite.translation.set(bathX, bathY - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            else
                                sprite.translation.set(bathX, bathY + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            two.add(sprite);
                        } else if (bathroomPosition == 'right') {
                            var offset = 0;
                            var rotation = -1.57;
                            if (doorPosition.direction) {
                                offset = bathroom.height;
                                rotation = 1.57;
                            }
                            const bathX = (bathroom.x + ((bathroom.width - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (doorPosition.direction)
                                sprite.translation.set(bathX, bathY - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            else
                                sprite.translation.set(bathX, bathY + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            two.add(sprite);
                        }
                    }
                } else {
                    if (doorPosition.direction !== undefined) {
                        if (bathroomPosition === 'top') {
                            var offset = 0;
                            var rotation = 3.14;
                            if (!doorPosition.direction) {
                                offset = bathroom.width;
                                rotation = 0;
                            }
                            const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + bathroom.height - ((bathroom.height - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (!doorPosition.direction)
                                sprite.translation.set(bathX - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            else
                                sprite.translation.set(bathX + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            two.add(sprite);
                        } else if (bathroomPosition == 'bottom') {
                            var offset = 0;
                            var rotation = 3.14;
                            if (!doorPosition.direction) {
                                offset = bathroom.width;
                                rotation = 0;
                            }
                            const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + ((bathroom.height - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (!doorPosition.direction)
                                sprite.translation.set(bathX - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            else
                                sprite.translation.set(bathX + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                            two.add(sprite);
                        } else if (bathroomPosition == 'left') {
                            var offset = 0;
                            var rotation = -1.57;
                            if (!doorPosition.direction) {
                                offset = bathroom.height;
                                rotation = 1.57;
                            }
                            const bathX = (bathroom.x + bathroom.width - ((bathroom.width - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (!doorPosition.direction)
                                sprite.translation.set(bathX, bathY - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            else
                                sprite.translation.set(bathX, bathY + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            two.add(sprite);
                        } else if (bathroomPosition == 'right') {
                            var offset = 0;
                            var rotation = -1.57;
                            if (!doorPosition.direction) {
                                offset = bathroom.height;
                                rotation = 1.57;
                            }
                            const bathX = (bathroom.x + ((bathroom.width - (BATHROOM_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_X;
                            const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                            var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                            sprite.scale = 0.001 * this.ratio;
                            sprite.rotation = rotation;
                            if (!doorPosition.direction)
                                sprite.translation.set(bathX, bathY - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            else
                                sprite.translation.set(bathX, bathY + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                            two.add(sprite);
                        }
                    }
                }
            } else {
                if (doorPosition.direction !== undefined) {
                    if (bathroomPosition === 'top') {
                        var offset = 0;
                        var rotation = 3.14;
                        if (!doorPosition.direction && doorPosition.position !== 'right') {
                            offset = bathroom.width;
                            rotation = 0;
                        }
                        const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + bathroom.height - ((bathroom.height - (SHOWER_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction && doorPosition.position !== 'right')
                            sprite.translation.set(bathX - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                        else
                            sprite.translation.set(bathX + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                        two.add(sprite);
                    } else if (bathroomPosition == 'bottom') {
                        var offset = 0;
                        var rotation = 3.14;
                        if (!doorPosition.direction && doorPosition.position !== 'right') {
                            offset = bathroom.width;
                            rotation = 0;
                        }
                        const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + ((bathroom.height - (SHOWER_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction && doorPosition.position !== 'right')
                            sprite.translation.set(bathX - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                        else
                            sprite.translation.set(bathX + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                        two.add(sprite);
                    } else if (bathroomPosition == 'left') {
                        var offset = 0;
                        var rotation = -1.57;
                        if (!doorPosition.direction && doorPosition.position !== 'top') {
                            offset = bathroom.height;
                            rotation = 1.57;
                        }
                        const bathX = (bathroom.x + bathroom.width - ((bathroom.width - (SHOWER_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction && doorPosition.position !== 'top')
                            sprite.translation.set(bathX, bathY - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX, bathY + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    } else if (bathroomPosition == 'right') {
                        var offset = 0;
                        var rotation = -1.57;
                        if (!doorPosition.direction && doorPosition.position !== 'top') {
                            offset = bathroom.height;
                            rotation = 1.57;
                        }
                        const bathX = (bathroom.x + ((bathroom.width - (SHOWER_HEIGHT / 1000))/ 2)) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/sink.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction && doorPosition.position !== 'top')
                            sprite.translation.set(bathX, bathY - (SINK_WIDTH * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX, bathY + (SINK_WIDTH * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    }
                }
            }
        },
        drawShower(bathroom, doorPosition, bathroomPosition, two) {
            console.log(bathroomPosition, doorPosition);
            if (bathroom.name === 'Salle de Bain') {
                if (doorPosition.direction !== undefined) {
                    if (bathroomPosition === 'top') {
                        var offset = 0;
                        var rotation = 0;
                        if (!doorPosition.direction) {
                            offset = bathroom.width;
                            rotation = -1.57;
                        }
                        const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + bathroom.height) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    } else if (bathroomPosition == 'bottom') {
                        var offset = 0;
                        var rotation = 1.57;
                        if (!doorPosition.direction) {
                            offset = bathroom.width;
                            rotation = 3.14;
                        }
                        const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                        const bathY = bathroom.y * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    } else if (bathroomPosition == 'left') {
                        var offset = 0;
                        var rotation = 3.14;
                        if (!doorPosition.direction) {
                            offset = bathroom.height;
                            rotation = -1.57;
                        }
                        const bathX = (bathroom.x + bathroom.width) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    } else if (bathroomPosition == 'right') {
                        var offset = 0;
                        var rotation = 1.57;
                        if (!doorPosition.direction) {
                            offset = bathroom.height;
                            rotation = 0;
                        }
                        const bathX = bathroom.x * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    }
                }
            } else {
                if (doorPosition.direction !== undefined) {
                    if (bathroomPosition === 'bottom') {
                        var offset = 0;
                        var rotation = 0;
                        if (!doorPosition.direction) {
                            offset = bathroom.width;
                            rotation = -1.57;
                        }
                        const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + bathroom.height) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    } else if (bathroomPosition == 'top') {
                        var offset = 0;
                        var rotation = 1.57;
                        if (!doorPosition.direction) {
                            offset = bathroom.width;
                            rotation = 3.14;
                        }
                        const bathX = (bathroom.x + offset) * this.ratio + OFFSET_X;
                        const bathY = bathroom.y * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    } else if (bathroomPosition == 'right') {
                        var offset = 0;
                        var rotation = 3.14;
                        if (!doorPosition.direction) {
                            offset = bathroom.height;
                            rotation = -1.57;
                        }
                        const bathX = (bathroom.x + bathroom.width) * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    } else if (bathroomPosition == 'left') {
                        var offset = 0;
                        var rotation = 1.57;
                        if (!doorPosition.direction) {
                            offset = bathroom.height;
                            rotation = 0;
                        }
                        const bathX = bathroom.x * this.ratio + OFFSET_X;
                        const bathY = (bathroom.y + offset) * this.ratio + OFFSET_Y;
                        var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/shower.png", bathX, bathY);
                        sprite.scale = 0.001 * this.ratio;
                        sprite.rotation = rotation;
                        if (!doorPosition.direction)
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY - (SHOWER_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        else
                            sprite.translation.set(bathX + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY + (SHOWER_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                        two.add(sprite);
                    }
                }
            }
        },
        drawBath(bathroom, bathroomPosition, two) {
            if (bathroomPosition === 'left') {
                const bathX = (bathroom.x) * this.ratio + OFFSET_X;
                const bathY = (bathroom.y + (bathroom.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bath.png", bathX, bathY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.translation.set(bathX + (BATHROOM_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                sprite.rotation = 1.57;
                two.add(sprite);
            } else if (bathroomPosition === 'right') {
                const bathX = (bathroom.x + bathroom.width) * this.ratio + OFFSET_X;
                const bathY = (bathroom.y + (bathroom.height / 2)) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bath.png", bathX, bathY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.translation.set(bathX - (BATHROOM_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75), bathY);
                sprite.rotation = 1.57;
                two.add(sprite);
            } else if (bathroomPosition === 'top') {
                const bathX = (bathroom.x + (bathroom.width / 2)) * this.ratio + OFFSET_X;
                const bathY = bathroom.y * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bath.png", bathX, bathY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.translation.set(bathX, bathY + (BATHROOM_HEIGHT * sprite.scale / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                two.add(sprite);
            } else if (bathroomPosition === 'bottom') {
                const bathX = (bathroom.x + (bathroom.width / 2)) * this.ratio + OFFSET_X;
                const bathY = (bathroom.y + bathroom.height) * this.ratio + OFFSET_Y;
                var sprite = new Two.Sprite("/Assets/Plans/WebGL/furnitures/bath.png", bathX, bathY);
                sprite.scale = 0.00097 * this.ratio;
                sprite.translation.set(bathX, bathY - (BATHROOM_HEIGHT * sprite.scale / 2) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 1.75));
                two.add(sprite);
            }
        },
        findRoomOrientation(room) {
            if (room.width > room.height)
                return 'HORIZONTAL';
            else
                return 'VERTICAL';
        },
        findDoorPosition(room) {
            const door = this.house.doors.find((door) => door.rooms[1] === room.name);
            if (door.shape === 'HORIZONTAL') {
                const doorPosY = Math.round(door.y * this.ratio) + OFFSET_Y;
                var doorPosition = 'bottom';
                var doorDirection = undefined;
                if (this.isTop(doorPosY, doorPosY, room))
                    doorPosition = 'top';
                if ((door.x + (door.type.size / 2)) > (room.x + (room.width / 2)))
                    doorDirection = true;
                else if ((door.x + (door.type.size / 2)) < (room.x + (room.width / 2)))
                    doorDirection = false;
                return { position: doorPosition, direction: doorDirection};
            } else {
                const doorPosX = Math.round(door.x * this.ratio) + OFFSET_X;
                var doorPosition = 'right';
                var doorDirection = undefined;
                if (this.isLeft(doorPosX, doorPosX, room))
                    doorPosition = 'left';
                if ((door.y + (door.type.size / 2)) > (room.y + (room.height / 2)))
                    doorDirection = true;
                else if ((door.y + (door.type.size / 2)) < (room.y + (room.height / 2)))
                    doorDirection = false;
                return { position: doorPosition, direction: doorDirection};
            }
        },
        findWallswithDoors(room) {
            var wall = ['none'];
            if (this.roomHasDoorOn(room, 'left'))
                wall.push('left');
            if (this.roomHasDoorOn(room, 'right'))
                wall.push('right');
            if (this.roomHasDoorOn(room, 'top'))
                wall.push('top');
            if (this.roomHasDoorOn(room, 'bottom'))
                wall.push('bottom');
            if(wall.length > 1)
                wall.shift();
            return wall;
        },
        findWallsWithOpening(room) {
            var wall = ['none'];
            if (this.roomHasOpeningOn(room, 'left'))
                wall.push('left');
            if (this.roomHasOpeningOn(room, 'right'))
                wall.push('right');
            if (this.roomHasOpeningOn(room, 'top'))
                wall.push('top');
            if (this.roomHasOpeningOn(room, 'bottom'))
                wall.push('bottom');
            if(wall.length > 1)
                wall.shift();
            return wall;
        },
        findWallsWithNoOpening(room) {
            var wall = ['none'];
            if (!this.roomHasOpeningOn(room, 'left'))
                wall.push('left');
            if (!this.roomHasOpeningOn(room, 'right'))
                wall.push('right');
            if (!this.roomHasOpeningOn(room, 'top'))
                wall.push('top');
            if (!this.roomHasOpeningOn(room, 'bottom'))
                wall.push('bottom');
            if(wall.length > 1)
                wall.shift();
            return wall;
        },
        findOutdoorWallWithNoOpening(room) {
            if (this.checkWhatIsOnLeft(room).length === 0 && !this.roomHasWindowOn(room, 'left'))
                return 'left';
            else if (this.checkWhatIsOnRight(room).length === 0 && !this.roomHasWindowOn(room, 'right'))
                return 'right';
            else if (this.checkWhatIsOnTop(room).length === 0 && !this.roomHasWindowOn(room, 'top'))
                return 'top';
            else if (this.checkWhatIsOnBottom(room).length === 0 && !this.roomHasWindowOn(room, 'bottom'))
                return 'bottom';
            else
                return 'none';
        },
        findOutdoorWallWithOpening(room) {
            if (this.checkWhatIsOnLeft(room).filter((r) => r.name !== 'trouL').length === 0 && this.roomHasWindowOn(room, 'left'))
                return 'left';
            else if (this.checkWhatIsOnRight(room).filter((r) => r.name !== 'trouL').length === 0 && this.roomHasWindowOn(room, 'right'))
                return 'right';
            else if (this.checkWhatIsOnTop(room).filter((r) => r.name !== 'trouL').length === 0 && this.roomHasWindowOn(room, 'top'))
                return 'top';
            else if (this.checkWhatIsOnBottom(room).filter((r) => r.name !== 'trouL').length === 0 && this.roomHasWindowOn(room, 'bottom'))
                return 'bottom';
            else
                return 'none';
        },
        roomHasDoorOn(room, side) {
            if (side === 'left') {
                const leftDoor = this.house.doors.find((door) => {
                        if (door.shape === 'VERTICAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isLeft(Math.round(door.x * this.ratio) + OFFSET_X, Math.round(door.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    return false;
                });
                if (leftDoor !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'right') {
                const rightDoor = this.house.doors.find((door) => {
                        if (door.shape === 'VERTICAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isRight(Math.round(door.x * this.ratio) + OFFSET_X, Math.round(door.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    return false;
                });
                if (rightDoor !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'top') {
                const topDoor = this.house.doors.find((door) => {
                        if (door.shape === 'HORIZONTAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isTop(Math.round(door.y * this.ratio) + OFFSET_Y, Math.round(door.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    return false;
                });
                if (topDoor !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'bottom') {

                const bottomDoor = this.house.doors.find((door) => {
                        if (door.shape === 'HORIZONTAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isBottom(Math.round(door.y * this.ratio) + OFFSET_Y, Math.round(door.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    return false;
                });
                if (bottomDoor !== undefined)
                    return true;
                else
                    return false;
            }
        },
        roomHasOpeningOn(room, side) {
            if (side === 'left') {
                const leftOpening = this.house.openings.find((opening) => {
                        if (opening.shape === 'VERTICAL')
                            if (room.name === opening.room)
                                if (this.isLeft(Math.round(opening.x * this.ratio) + OFFSET_X, Math.round(opening.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    return false;
                });
                const leftDoor = this.house.doors.find((door) => {
                        if (door.shape === 'VERTICAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isLeft(Math.round(door.x * this.ratio) + OFFSET_X, Math.round(door.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    return false;
                });
                if (leftOpening !== undefined || leftDoor !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'right') {
                const rightOpening = this.house.openings.find((opening) => {
                        if (opening.shape === 'VERTICAL')
                            if (room.name === opening.room)
                                if (this.isRight(Math.round(opening.x * this.ratio) + OFFSET_X, Math.round(opening.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    return false;
                });
                const rightDoor = this.house.doors.find((door) => {
                        if (door.shape === 'VERTICAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isRight(Math.round(door.x * this.ratio) + OFFSET_X, Math.round(door.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    return false;
                });
                if (rightOpening !== undefined || rightDoor !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'top') {
                const topOpening = this.house.openings.find((opening) => {
                        if (opening.shape === 'HORIZONTAL')
                            if (room.name === opening.room)
                                if (this.isTop(Math.round(opening.y * this.ratio) + OFFSET_Y, Math.round(opening.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    return false;
                });
                const topDoor = this.house.doors.find((door) => {
                        if (door.shape === 'HORIZONTAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isTop(Math.round(door.y * this.ratio) + OFFSET_Y, Math.round(door.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    return false;
                });
                if (topOpening !== undefined || topDoor !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'bottom') {
                const bottomOpening = this.house.openings.find((opening) => {
                        if (opening.shape === 'HORIZONTAL')
                            if (room.name === opening.room)
                                if (this.isBottom(Math.round(opening.y * this.ratio) + OFFSET_Y, Math.round(opening.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    return false;
                });
                const bottomDoor = this.house.doors.find((door) => {
                        if (door.shape === 'HORIZONTAL')
                            if (room.name === door.rooms[0] || room.name === door.rooms[1])
                                if (this.isBottom(Math.round(door.y * this.ratio) + OFFSET_Y, Math.round(door.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    return false;
                });
                if (bottomOpening !== undefined || bottomDoor !== undefined)
                    return true;
                else
                    return false;
            }
        },
        roomHasWindowOn(room, side) {
            if (side === 'left') {
                const leftOpening = this.house.openings.find((opening) => {
                    if (opening.type.type === 'WINDOW') {
                        if (opening.shape === 'VERTICAL')
                            if (room.name === opening.room)
                                if (this.isLeft(Math.round(opening.x * this.ratio) + OFFSET_X, Math.round(opening.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    }
                    return false;
                })
                if (leftOpening !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'right') {
                const rightOpening = this.house.openings.find((opening) => {
                    if (opening.type.type === 'WINDOW') {
                        if (opening.shape === 'VERTICAL')
                            if (room.name === opening.room)
                                if (this.isRight(Math.round(opening.x * this.ratio) + OFFSET_X, Math.round(opening.x * this.ratio) + OFFSET_X, room))
                                    return true;
                    }
                    return false;
                })
                if (rightOpening !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'top') {
                const topOpening = this.house.openings.find((opening) => {
                    if (opening.type.type === 'WINDOW') {
                        if (opening.shape === 'HORIZONTAL')
                            if (room.name === opening.room)
                                if (this.isTop(Math.round(opening.y * this.ratio) + OFFSET_Y, Math.round(opening.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    }
                    return false;
                })
                if (topOpening !== undefined)
                    return true;
                else
                    return false;
            } else if (side === 'bottom') {
                const bottomOpening = this.house.openings.find((opening) => {
                    if (opening.type.type === 'WINDOW') {
                        if (opening.shape === 'HORIZONTAL')
                            if (room.name === opening.room)
                                if (this.isBottom(Math.round(opening.y * this.ratio) + OFFSET_Y, Math.round(opening.y * this.ratio) + OFFSET_Y, room))
                                    return true;
                    }
                    return false;
                })
                if (bottomOpening !== undefined)
                    return true;
                else
                    return false;
            }
        },
        findRoomDirection(baseRoom, roomTo) {
            if (this.checkWhatIsOnTop(baseRoom).indexOf(roomTo) !== -1)
                return 'top';
            else if (this.checkWhatIsOnBottom(baseRoom).indexOf(roomTo) !== -1)
                return 'bottom';
            else if (this.checkWhatIsOnLeft(baseRoom).indexOf(roomTo) !== -1)
                return 'left';
            else if (this.checkWhatIsOnRight(baseRoom).indexOf(roomTo) !== -1)
                return 'right';

        },
        createCupboard(cupboards, two) {
            cupboards.forEach((cupboard) => {
                const roomName = 'Chambre ' + Number(cupboard.name.split(' ')[1]);
                const openingDirection = this.findRoomDirection(cupboard, this.findRoom(roomName));
                if (openingDirection === 'top') {
                    const startX = (cupboard.x * this.ratio) + OFFSET_X + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2);
                    const startY = (cupboard.y * this.ratio) + OFFSET_Y;
                    this.createLine(startX, startY, startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY, (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 1, ROOM_COLORS[roomName], two);
                    this.createLine(startX, startY, startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY, CUPBOARD_WIDTH, CUPBOARD_COLOR, two);
                    this.createDashedLine(startX, startY, startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY + (cupboard.height * this.ratio) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                    this.createDashedLine(startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY, startX, startY + (cupboard.height * this.ratio) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                } else if (openingDirection === 'bottom') {
                    const startX = (cupboard.x * this.ratio) + OFFSET_X + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2);
                    const startY = (cupboard.y * this.ratio) + OFFSET_Y + (cupboard.height * this.ratio);
                    this.createLine(startX, startY, startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY, (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 1, ROOM_COLORS[roomName], two);
                    this.createLine(startX, startY, startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY, CUPBOARD_WIDTH, CUPBOARD_COLOR, two);
                    this.createDashedLine(startX, startY, startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY - (cupboard.height * this.ratio) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                    this.createDashedLine(startX + (cupboard.width * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), startY, startX, startY - (cupboard.height * this.ratio) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                } else if (openingDirection === 'left') {
                    const startX = (cupboard.x * this.ratio) + OFFSET_X;
                    const startY = (cupboard.y * this.ratio) + OFFSET_Y + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2);
                    this.createLine(startX, startY, startX, startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 1, ROOM_COLORS[roomName], two);
                    this.createLine(startX, startY, startX, startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), CUPBOARD_WIDTH, CUPBOARD_COLOR, two);
                    this.createDashedLine(startX, startY, startX + (cupboard.width * this.ratio) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                    this.createDashedLine(startX + (cupboard.width * this.ratio) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), startY, startX, startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                } else if (openingDirection === 'right') {
                    const startX = (cupboard.x * this.ratio) + OFFSET_X + (cupboard.width * this.ratio);
                    const startY = (cupboard.y * this.ratio) + OFFSET_Y + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2);
                    this.createLine(startX, startY, startX, startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 1, ROOM_COLORS[roomName], two);
                    this.createLine(startX, startY, startX, startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), CUPBOARD_WIDTH, CUPBOARD_COLOR, two);
                    this.createDashedLine(startX, startY, startX - (cupboard.width * this.ratio) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                    this.createDashedLine(startX - (cupboard.width * this.ratio) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), startY, startX, startY + (cupboard.height * this.ratio) - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ), CUPBOARD_WIDTH, CUPBOARD_COLOR, CUPBOARD_DASH_SIZE, two);
                }
            });
        },
        findDoorDirectionType(door, roomName) {
            const room = this.findRoom(roomName);
            if (door.shape === 'HORIZONTAL') {
                if (room.name.split(' ')[0] === 'Chambre') {
                    const cupboard = this.house.rooms.find((fRoom) => fRoom.name === 'Placard ' + room.name.split(' ')[1]);
                    if (cupboard !== undefined) {
                        const openingDirection = this.findRoomDirection(cupboard, room);
                        if (openingDirection === 'bottom') {
                            if (cupboard.x > door.x)
                                return false;
                            else
                                return true;
                        } else if (openingDirection === 'top') {
                            if (cupboard.x > door.x)
                                return false;
                            else
                                return true;
                        }
                    }
                }
                const centerX = (door.x * this.ratio) + OFFSET_X + (door.type.size * this.ratio /2);
                if (centerX > ((room.x * this.ratio) + OFFSET_X + (room.width * this.ratio / 2)))
                    return true;
                else
                    return false;
            } else {
                if (room.name.split(' ')[0] === 'Chambre') {
                    const cupboard = this.house.rooms.find((fRoom) => fRoom.name === 'Placard ' + room.name.split(' ')[1]);
                    if (cupboard !== undefined) {
                        const openingDirection = this.findRoomDirection(cupboard, room);
                        if (openingDirection === 'left') {
                            if (cupboard.y > door.y)
                                return false;
                            else
                                return true;
                        } else if (openingDirection === 'right') {
                            if (cupboard.y > door.y)
                                return false;
                            else
                                return true;
                        }
                    }
                }
                const centerY = (door.y * this.ratio) + OFFSET_Y + (door.type.size * this.ratio /2);
                if (centerY > ((room.y * this.ratio) + OFFSET_Y + (room.height * this.ratio / 2)))
                    return true;
                else
                    return false;
            }
        },
        createDoors(doors, two) {
            doors.forEach((door) => {
                const positionX = Math.round((door.x * this.ratio) + OFFSET_X);
                const positionY = Math.round(((door.y * this.ratio)) + OFFSET_Y);
                if (door.type.type === 'DOOR') {
                    const room = this.findRoom(door.rooms[1]);
                    const directionType = this.findDoorDirectionType(door, door.rooms[1]);
                        if (door.shape === 'HORIZONTAL') {
                            this.createLine(positionX, positionY, positionX + (door.type.size * this.ratio), positionY, (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 3, ROOM_COLORS[door.rooms[1]], two);
                            if (this.isTop(positionY, positionY, room)) {
                                if (directionType) {
                                    this.createLine(positionX + (door.type.size * this.ratio) -  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionX + (door.type.size * this.ratio) - ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) + (door.type.size * this.ratio), (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX + (door.type.size * this.ratio), positionY - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 3),(door.type.size * this.ratio), 1.57, 3.14, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                                else {
                                    this.createLine(positionX + ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionX + ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) + (door.type.size * this.ratio), (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX, positionY - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 3),(door.type.size * this.ratio), 0, 1.57, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                            } else if (this.isBottom(positionY, positionY, room)) {
                                if (directionType) {
                                    this.createLine(positionX + (door.type.size * this.ratio) -  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionX + (door.type.size * this.ratio) - ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) - (door.type.size * this.ratio), (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX + (door.type.size * this.ratio), positionY + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 3),(door.type.size * this.ratio), 3.14, 4.71, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                                else {
                                    this.createLine(positionX + ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionX + ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionY + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) - (door.type.size * this.ratio), (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX, positionY + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 3),(door.type.size * this.ratio), -1.57, 0, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                            }
                        } else {
                            this.createLine(positionX, positionY, positionX, positionY + (door.type.size * this.ratio), (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 3, ROOM_COLORS[door.rooms[1]], two);
                            if (this.isLeft(positionX, positionX, room)) {
                                if (directionType) {
                                    this.createLine(positionX + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY + (door.type.size * this.ratio) -  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionX + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) + (door.type.size * this.ratio), positionY + (door.type.size * this.ratio) -  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2) , (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY + (door.type.size * this.ratio),(door.type.size * this.ratio), -1.57, 0, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                                else {
                                    this.createLine(positionX + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY +  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionX + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) + (door.type.size * this.ratio), positionY + ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2) , (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY,(door.type.size * this.ratio), 0, 1.57, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                            } else if (this.isRight(positionX, positionX, room)) {
                                if (directionType) {
                                    this.createLine(positionX - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY + (door.type.size * this.ratio) -  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionX - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) - (door.type.size * this.ratio), positionY + (door.type.size * this.ratio) -  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2) , (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY + (door.type.size * this.ratio),(door.type.size * this.ratio), 3.14, 4.71, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                                else {
                                    this.createLine(positionX - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY +  ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2), positionX - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4) - (door.type.size * this.ratio), positionY + ((Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ) / 2) , (Math.round(INNER_DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY,(door.type.size * this.ratio), 1.57, 3.14, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                            }
                        }
                } else if (door.type.type === 'OPEN') {
                    if (door.shape === 'HORIZONTAL') {
                        this.createLine(positionX + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 6), positionY, positionX + (door.type.size * this.ratio) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 6), positionY, (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 5, ROOM_COLORS[door.rooms[1]], two);
                    } else {
                        this.createLine(positionX, positionY + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 6), positionX, positionY + (door.type.size * this.ratio) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 6), (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) + 5, ROOM_COLORS[door.rooms[1]], two);
                    }
                }
            });
        },
        findRoom(roomName) {
            return this.house.rooms.find((elem) => elem.name === roomName);
        },
        findWindowDirection(window) {
            const room = this.findRoom(window.room);
            const positionX = (window.x * this.ratio) - (this.canvas.width / 2) + OFFSET_X;
            const positionY = -((window.y * this.ratio) - (this.canvas.height / 2)) - OFFSET_Y;
            const roomPositionX = (room.x * this.ratio) - (this.canvas.width / 2) + OFFSET_X;
            const roomPositionY = -((room.y * this.ratio) - (this.canvas.height / 2)) - OFFSET_Y;
            let direction = '';
            if (window.shape === 'VERTICAL') {
                if (positionX === roomPositionX)
                    direction = 'left';
                else
                    direction = 'right';
            } else {
                if (positionY === roomPositionY)
                    direction = 'top';
                else
                    direction = 'bottom';
            }
            return direction;
        },
        renderWindowDoor(window, windowDirection, two) {
            let windowImg = "/Assets/Plans/WebGL/double-window.png";
            if (window.type.size === 0.6)
                windowImg = "/Assets/Plans/WebGL/window-bathroom.png";
            else if (window.type.size === 0.4)
                windowImg = "/Assets/Plans/WebGL/window-wc.png";
            if (windowDirection === 'left') {
                const windowPositionX = (window.x * this.ratio) + OFFSET_X + (window.type.size * this.ratio / 2);
                const windowPositionY = (window.y * this.ratio) + OFFSET_Y + (window.type.size * this.ratio / 2);
                var sprite = new Two.Sprite(windowImg, windowPositionX, windowPositionY);
                if (window.type.size === 0.6)
                    sprite.scale = 0.00053 * this.ratio;
                else if (window.type.size === 0.4)
                    sprite.scale = 0.00027 * this.ratio;
                else
                    sprite.scale = 0.0011 * this.ratio;
                sprite.rotation = 3.14;
                two.add(sprite);
            } else if (windowDirection === 'right') {
                const windowPositionX = (window.x * this.ratio) + OFFSET_X - (window.type.size * this.ratio / 2);
                const windowPositionY = (window.y * this.ratio) + OFFSET_Y + (window.type.size * this.ratio / 2);
                var sprite = new Two.Sprite(windowImg, windowPositionX, windowPositionY);
                if (window.type.size === 0.6)
                    sprite.scale = 0.00053 * this.ratio;
                else if (window.type.size === 0.4)
                    sprite.scale = 0.00027 * this.ratio;
                else
                    sprite.scale = 0.0011 * this.ratio;
                two.add(sprite);

            } else if (windowDirection === 'top') {
                const windowPositionX = (window.x * this.ratio) + OFFSET_X + (window.type.size * this.ratio / 2);
                const windowPositionY = (window.y * this.ratio) + OFFSET_Y + (window.type.size * this.ratio / 2);
                var sprite = new Two.Sprite(windowImg, windowPositionX, windowPositionY);
                if (window.type.size === 0.6)
                    sprite.scale = 0.00053 * this.ratio;
                else if (window.type.size === 0.4)
                    sprite.scale = 0.00027 * this.ratio;
                else
                    sprite.scale = 0.0011 * this.ratio;
                sprite.rotation = -1.57;
                two.add(sprite);

            } else if (windowDirection === 'bottom') {
                const windowPositionX = (window.x * this.ratio) + OFFSET_X + (window.type.size * this.ratio / 2);
                const windowPositionY = (window.y * this.ratio) + OFFSET_Y - (window.type.size * this.ratio / 2);
                var sprite = new Two.Sprite(windowImg, windowPositionX, windowPositionY);
                if (window.type.size === 0.6)
                    sprite.scale = 0.00053 * this.ratio;
                else if (window.type.size === 0.4)
                    sprite.scale = 0.00027 * this.ratio;
                else
                    sprite.scale = 0.0011 * this.ratio;
                sprite.rotation = 1.57;
                two.add(sprite);

            }
        },
        renderWindow(window, two) {
            const positionX = (window.x * this.ratio) + OFFSET_X;
            const positionY = ((window.y * this.ratio)) + OFFSET_Y;
            const windowDirection = this.findWindowDirection(window);
            const window_height = (Math.round((OUTER_WALL_WIDTH + WALL_DOUBLING_WIDTH) * this.ratio * 10) / 10 );
            const dashOffset = window_height / 4;
            const offset = ((Math.round((OUTER_WALL_WIDTH + (WALL_DOUBLING_WIDTH / 4)) * this.ratio * 10) / 10 ) / 2);
            if (windowDirection === 'left') {
                this.createLine(positionX - offset, positionY, positionX - offset, positionY + (window.type.size * this.ratio), window_height + 1 , WINDOW_COLOR, two);
                this.createLine(positionX - offset, positionY, positionX - offset, positionY + (window.type.size * this.ratio), window_height, 'WHITE', two);
                if (window.type.type === 'BAY_WINDOW') {
                    this.createDashedLine(positionX - offset + dashOffset, positionY, positionX - offset + dashOffset, positionY + (window.type.size * this.ratio / 2), WINDOW_WIDTH, WINDOW_COLOR, WINDOW_DASH_SIZE, two);
                    this.createDashedLine(positionX - offset - dashOffset, positionY + (window.type.size * this.ratio / 2), positionX - offset - dashOffset, positionY + (window.type.size * this.ratio), WINDOW_WIDTH, WINDOW_COLOR, WINDOW_DASH_SIZE, two);
                } else {
                    this.createDashedLine(positionX - offset - dashOffset, positionY, positionX - offset - dashOffset, positionY + (window.type.size * this.ratio), WINDOW_WIDTH, WINDOW_COLOR, WINDOW_DASH_SIZE, two);
                }
            } else if (windowDirection === 'right') {
                this.createLine(positionX + offset, positionY, positionX + offset, positionY + (window.type.size * this.ratio), window_height + 1 , WINDOW_COLOR, two);
                this.createLine(positionX + offset, positionY, positionX + offset, positionY + (window.type.size * this.ratio), window_height , 'WHITE', two);
                if (window.type.type === 'BAY_WINDOW') {
                    this.createDashedLine(positionX + offset + dashOffset, positionY, positionX + offset + dashOffset, positionY + (window.type.size * this.ratio / 2), WINDOW_WIDTH, WINDOW_COLOR, WINDOW_DASH_SIZE, two);
                    this.createDashedLine(positionX + offset - dashOffset, positionY + (window.type.size * this.ratio / 2), positionX + offset - dashOffset, positionY + (window.type.size * this.ratio), WINDOW_WIDTH, WINDOW_COLOR, WINDOW_DASH_SIZE, two);
                } else {
                    this.createDashedLine(positionX + offset + dashOffset, positionY, positionX + offset + dashOffset, positionY + (window.type.size * this.ratio), WINDOW_WIDTH, WINDOW_COLOR, WINDOW_DASH_SIZE, two);
                }
            } else if (windowDirection === 'top') {
                this.createLine(positionX, positionY - offset, positionX + (window.type.size * this.ratio), positionY - offset, window_height + 1, WINDOW_COLOR, two);
                this.createLine(positionX, positionY - offset, positionX + (window.type.size * this.ratio), positionY - offset, window_height, 'WHITE', two);
                if (window.type.type === 'BAY_WINDOW') {
                    this.createDashedLine(positionX, positionY - offset + dashOffset , positionX + (window.type.size * this.ratio / 2), positionY - offset + dashOffset, WINDOW_WIDTH, WINDOW_COLOR,WINDOW_DASH_SIZE, two);
                    this.createDashedLine(positionX + (window.type.size * this.ratio / 2), positionY - offset - dashOffset, positionX + (window.type.size * this.ratio), positionY - offset - dashOffset, WINDOW_WIDTH, WINDOW_COLOR,WINDOW_DASH_SIZE, two);
                } else {
                    this.createDashedLine(positionX, positionY - offset - dashOffset, positionX + (window.type.size * this.ratio), positionY - offset - dashOffset, WINDOW_WIDTH, WINDOW_COLOR,WINDOW_DASH_SIZE, two);
                }
            } else if (windowDirection === 'bottom') {
                this.createLine(positionX, positionY + offset, positionX + (window.type.size * this.ratio), positionY + offset, window_height + 1, WINDOW_COLOR, two);
                this.createLine(positionX, positionY + offset, positionX + (window.type.size * this.ratio), positionY + offset, window_height, 'WHITE', two);
                if (window.type.type === 'BAY_WINDOW') {
                    this.createDashedLine(positionX, positionY + offset + dashOffset , positionX + (window.type.size * this.ratio / 2), positionY + offset + dashOffset, WINDOW_WIDTH, WINDOW_COLOR,WINDOW_DASH_SIZE, two);
                    this.createDashedLine(positionX + (window.type.size * this.ratio / 2), positionY + offset - dashOffset, positionX + (window.type.size * this.ratio), positionY + offset - dashOffset, WINDOW_WIDTH, WINDOW_COLOR,WINDOW_DASH_SIZE, two);
                } else {
                    this.createDashedLine(positionX, positionY + offset + dashOffset , positionX + (window.type.size * this.ratio), positionY + offset + dashOffset, WINDOW_WIDTH, WINDOW_COLOR, WINDOW_DASH_SIZE, two);
                }
            }
            // if (window.type.type === 'WINDOW')
            //     this.renderWindowDoor(window, windowDirection, two);
        },
        createOpenings(openings, two) {
            openings.forEach((opening) => {
                if (opening.type.type === 'DOOR') {
                    const positionX = (opening.x * this.ratio) + OFFSET_X;
                    const positionY = ((opening.y * this.ratio)) + OFFSET_Y;
                    const directionType = this.findDoorDirectionType(opening, 'Hall');
                    const doorHeight = (Math.round((OUTER_WALL_WIDTH + WALL_DOUBLING_WIDTH) * this.ratio * 10) / 10 );
                    const offset = ((Math.round((OUTER_WALL_WIDTH + (WALL_DOUBLING_WIDTH / 4)) * this.ratio * 10) / 10 ) / 2);
                    if (opening.shape === 'HORIZONTAL') {
                        if (this.isTop(positionY, positionY, opening)) {
                            this.createLine(positionX, positionY - offset, positionX + (opening.type.size * this.ratio), positionY - offset, doorHeight, 'WHITE', two);
                            if (opening.room === 'Garage') {
                                const baseX = positionX;
                                const baseY = positionY - ((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2);
                                const dashSize = GARAGE_DASH_SIZE;
                                this.createDashedLine(baseX, baseY, baseX + (opening.type.size * this.ratio), baseY, WINDOW_WIDTH, WALL_COLOR, dashSize, two);
                                this.createDashedLine(baseX + (opening.type.size * this.ratio), baseY, baseX + (opening.type.size * this.ratio), baseY + (opening.type.size * this.ratio), WINDOW_WIDTH, WALL_COLOR, dashSize, two);
                                this.createDashedLine(baseX, baseY + (opening.type.size * this.ratio), baseX + (opening.type.size * this.ratio), baseY + (opening.type.size * this.ratio), WINDOW_WIDTH, WALL_COLOR, dashSize, two);
                                this.createDashedLine(baseX, baseY, baseX, baseY + (opening.type.size * this.ratio), WINDOW_WIDTH, WALL_COLOR, dashSize, two);
                                this.createDashedLine(baseX, baseY, baseX + (opening.type.size * this.ratio), baseY + (opening.type.size * this.ratio), WINDOW_WIDTH, WALL_COLOR, dashSize, two);
                                this.createDashedLine(baseX, baseY + (opening.type.size * this.ratio), baseX + (opening.type.size * this.ratio), baseY, WINDOW_WIDTH, WALL_COLOR, dashSize, two);

                            } else {
                                if (directionType) {
                                    this.createLine(positionX + (opening.type.size * this.ratio) - ((Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ) / 4), positionY - ((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2 - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2), positionX + (opening.type.size * this.ratio) - ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY - ((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2 - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2) + (opening.type.size * this.ratio), (Math.round(DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX + (opening.type.size * this.ratio), positionY - ((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2 - (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ) / 3),(opening.type.size * this.ratio), 1.57, 3.14, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                                else {
                                    this.createLine(positionX + ((Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ) / 4), positionY - ((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2 - (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ) / 2), positionX +  ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 4), positionY - ((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2 - (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2) + (opening.type.size * this.ratio), (Math.round(DOOR_WIDTH * this.ratio * 10) / 10 ), DOOR_COLOR, two);
                                    this.createDashedArcSegment(positionX, positionY - ((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2 - (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ) / 4),(opening.type.size * this.ratio), 0, 1.57, DOOR_COLOR, DOOR_DASH_WIDTH, DOOR_DASH_SIZE, two);
                                }
                            }
                        } else if (this.isBottom(positionY, positionY, opening)) {
                            this.createLine(positionX, positionY + offset, positionX + (opening.type.size * this.ratio), positionY + offset, doorHeight, 'WHITE', two);
                            if (opening.room === 'Garage') {

                            } else {
                            }
                        }
                    } else {
                        if (this.isLeft(positionX, positionX, opening)) {
                            this.createLine(positionX - offset, positionY, positionX - offset, positionY + (opening.type.size * this.ratio), doorHeight, 'WHITE', two);
                            if (opening.room === 'Garage') {

                            } else {
                            }
                        } else if (this.isRight(positionX, positionX, opening)) {
                            this.createLine(positionX + offset, positionY, positionX + offset, positionY + (opening.type.size * this.ratio), doorHeight, 'WHITE', two);
                            if (opening.room === 'Garage') {

                            } else {
                            }
                        }
                    }
                } else {
                    this.renderWindow(opening, two);
                }
            });
        },
        checkWhatIsOnLeft(roomToCompare) {
            const rooms = this.house.rooms;
            let onLeft = [];
            rooms.forEach((room) => {
                if (room.name !== roomToCompare.name) {
                    if (room.x < roomToCompare.x && ((room.y >= roomToCompare.y && room.y < Math.round((roomToCompare.y + roomToCompare.height) * 10)/ 10) || (roomToCompare.y >= room.y && roomToCompare.y < Math.round((room.y + room.height)*10)/10)))
                        onLeft.push(room);
                }
            });
            return onLeft;
        },
        checkWhatIsOnRight(roomToCompare) {
            const rooms = this.house.rooms;
            let onRight = [];
            rooms.forEach((room) => {
                if (room.name !== roomToCompare.name) {
                    if (room.x > roomToCompare.x && ((room.y >= roomToCompare.y && room.y < Math.round((roomToCompare.y + roomToCompare.height) * 10)/ 10) || (roomToCompare.y >= room.y && roomToCompare.y < Math.round((room.y + room.height)*10)/10)))
                        onRight.push(room);
                }
            });
            return onRight;
        },
        checkWhatIsOnTop(roomToCompare) {
            const rooms = this.house.rooms;
            let onTop = [];
            rooms.forEach((room) => {
                if (room.name !== roomToCompare.name) {
                    if (room.y < roomToCompare.y && ((room.x >= roomToCompare.x && room.x < Math.round((roomToCompare.x + roomToCompare.width) * 10)/ 10) || (roomToCompare.x >= room.x && roomToCompare.x < Math.round((room.x + room.width)*10)/10)))
                        onTop.push(room);
                }
            });
            return onTop;
        },
        checkWhatIsOnBottom(roomToCompare) {
            const rooms = this.house.rooms;
            let onBottom = [];
            rooms.forEach((room) => {
                if (room.name !== roomToCompare.name) {
                    if (room.y > roomToCompare.y && ((room.x >= roomToCompare.x && room.x < Math.round((roomToCompare.x + roomToCompare.width) * 10)/ 10) || (roomToCompare.x >= room.x && roomToCompare.x < Math.round((room.x + room.width)*10)/10)))
                        onBottom.push(room);
                }
            });
            return onBottom;
        },
        isTop(fromY, toY, room) {
            return (fromY === toY && fromY === Math.round(((room.y * this.ratio)) + OFFSET_Y));
        },
        isBottom(fromY, toY, room) {
            return (fromY === toY && fromY === Math.round((((room.y + room.height) * this.ratio)) + OFFSET_Y));
        },
        isLeft(fromX, toX, room) {
            return (fromX === toX && fromX === Math.round((room.x * this.ratio) + OFFSET_X));
        },
        isRight(fromX, toX, room) {
            return (fromX === toX && fromX === Math.round(((room.x + room.width) * this.ratio) + OFFSET_X));
        },
        isOuterWall(fromX, fromY, toX, toY, room) {
            if (this.checkWhatIsOnLeft(room).length === 0 && this.isLeft(fromX, toX, room))
                return true;
            else if (this.checkWhatIsOnRight(room).length === 0 && this.isRight(fromX, toX, room))
                return true;
            else if (this.checkWhatIsOnTop(room).length === 0 && this.isTop(fromY, toY, room))
                return true;
            else if (this.checkWhatIsOnBottom(room).length === 0 && this.isBottom(fromY, toY, room))
                return true;
            return false;

        },
        renderWall(fromX, fromY, toX, toY, room, two) {
            const diff = ((OUTER_WALL_WIDTH + WALL_DOUBLING_WIDTH) - (OUTER_WALL_WIDTH + INNER_WALL_WIDTH));
            const offset = (((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2)) + (Math.round(diff * this.ratio * 10 / 2) / 10);
            const cornerOffset = (Math.round((OUTER_WALL_WIDTH + WALL_DOUBLING_WIDTH - ((OUTER_WALL_WIDTH + WALL_DOUBLING_WIDTH) - (OUTER_WALL_WIDTH + INNER_WALL_WIDTH)) * 1.5) * this.ratio * 10) / 10);
            if (this.isOuterWall(fromX, fromY, toX, toY, room)) {
                if (this.isLeft(fromX, toX, room)) { // LEFT
                    this.createLine(fromX - offset, fromY - cornerOffset, toX - offset, toY + cornerOffset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
                } else if (this.isRight(fromX, toX, room)) { // RIGHT
                    this.createLine(fromX + offset, fromY + cornerOffset, toX + offset, toY - cornerOffset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
                } else if (this.isTop(fromY, toY, room)) { //TOP
                    this.createLine(fromX + cornerOffset, fromY - offset, toX - cornerOffset, toY - offset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
                } else if (this.isBottom(fromY, toY, room)) { // BOTTOM
                    this.createLine(fromX - cornerOffset, fromY + offset, toX + cornerOffset, toY + offset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
                }
            }
        },
        renderDoublingWall(fromX, fromY, toX, toY, room, two) {
            const cornerOffset = ((Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ) / 1.8);
            const offset = (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 );
            if (this.isOuterWall(fromX, fromY, toX, toY, room)) {
                if (this.isLeft(fromX, toX, room)) { // LEFT
                    this.createLine(fromX - cornerOffset, fromY - offset, toX - cornerOffset, toY + offset, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
                } else if (this.isRight(fromX, toX, room)) { // RIGHT
                    this.createLine(fromX + cornerOffset, fromY + offset, toX + cornerOffset, toY - offset, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
                } else if (this.isTop(fromY, toY, room)) { //TOP
                    this.createLine(fromX + offset, fromY - cornerOffset, toX - offset, toY - cornerOffset, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
                } else if (this.isBottom(fromY, toY, room)) { // BOTTOM
                    this.createLine(fromX - offset, fromY + cornerOffset, toX + offset, toY + cornerOffset, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
                }
            }
        },
        renderHole(fromX, fromY, toX, toY, room, two) {
            const diff = ((OUTER_WALL_WIDTH + WALL_DOUBLING_WIDTH) - (OUTER_WALL_WIDTH + INNER_WALL_WIDTH));
            const offset = (((Math.round(OUTER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2) + ((Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 ) / 2)) + (Math.round(diff / 2 * this.ratio * 10) / 10);
            const cornerOffset = Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 / 1.8;
            if (this.checkWhatIsOnLeft(room).length > 0 && this.isLeft(fromX, toX, room)) {
                this.createLine(fromX + offset, fromY - cornerOffset, toX - offset, toY + cornerOffset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
            } else if (this.checkWhatIsOnRight(room).length > 0 && this.isRight(fromX, toX, room)) {
                this.createLine(fromX - offset, fromY + cornerOffset, toX - offset, toY - cornerOffset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
            } else if (this.checkWhatIsOnTop(room).length > 0 && this.isTop(fromY, toY, room)) {
                this.createLine(fromX + cornerOffset, fromY + offset, toX - cornerOffset, toY + offset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
            } else if (this.checkWhatIsOnBottom(room).length > 0 && this.isBottom(fromY, toY, room)) {
                this.createLine(fromX - cornerOffset, fromY - offset, toX + cornerOffset, toY - offset, (Math.round((OUTER_WALL_WIDTH + diff) * this.ratio * 10) / 10 ), WALL_COLOR, two);
            }
        },
        renderDoublingHole(fromX, fromY, toX, toY, room, two) {
            const cornerOffset = 0;
            const offset = (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ) / 2;
            if (this.checkWhatIsOnLeft(room).length > 0 && this.isLeft(fromX, toX, room)) {
                this.createLine(fromX + offset, fromY, toX + offset, toY, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
            } else if (this.checkWhatIsOnRight(room).length > 0 && this.isRight(fromX, toX, room)) {
                this.createLine(fromX - offset, fromY + cornerOffset, toX - offset, toY - cornerOffset, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
            } else if (this.checkWhatIsOnTop(room).length > 0 && this.isTop(fromY, toY, room)) {
                this.createLine(fromX, fromY + offset, toX, toY + offset, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
            } else if (this.checkWhatIsOnBottom(room).length > 0 && this.isBottom(fromY, toY, room)) {
                this.createLine(fromX, fromY - offset, toX, toY - offset, (Math.round(WALL_DOUBLING_WIDTH * this.ratio * 10) / 10 ), WALL_DOUBLING_COLOR, two);
            }
        },
        renderRooms(rooms, two) {
            rooms.forEach((room) => {
                const positionX = (room.x * this.ratio) + OFFSET_X;
                const positionY = (room.y * this.ratio) + OFFSET_Y;
                if (room.name !== 'trouL') {
                    const rPositionX = (room.x * this.ratio) + OFFSET_X + (room.width * this.ratio / 2);
                    const rPositionY = (room.y * this.ratio) + OFFSET_Y + (room.height * this.ratio / 2);
                    var rect = two.makeRectangle(rPositionX, rPositionY, room.width * this.ratio, room.height * this.ratio);
                    rect.stroke = WALL_COLOR;
                    rect.fill = ROOM_COLORS[room.name];
                    rect.linewidth = (Math.round(INNER_WALL_WIDTH * this.ratio * 10) / 10 );
                    this.renderWall(positionX, positionY, positionX, Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderWall(positionX, Math.round(positionY + (room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderWall(Math.round(positionX + (room.width * this.ratio)), Math.round(positionY +(room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), positionY, room, two);
                    this.renderWall(Math.round(positionX + (room.width * this.ratio)), positionY, positionX, positionY, room, two);
                    if (room.name !== 'Dégagement' && room.name.split(' ')[0] !== 'Placard') {
                        var text1 = document.createElement('div');
                        text1.style.position = 'absolute';
                        text1.style.width = room.width * this.ratio + 'px';
                        text1.style.fontSize = FONT_SIZE + 'px';
                        text1.innerHTML = room.name;
                        text1.style.textAlign = 'center';
                        text1.style.top = (room.y * this.ratio) + (room.height * this.ratio / 2) + OFFSET_Y - 12 + 'px';
                        text1.style.left = room.x * this.ratio + OFFSET_X + 'px';
                        text1.style.color = FONT_COLOR;
                        text1.style.fontWeight = 500;
                        document.querySelector('#canvas-drawer').appendChild(text1);
                        var text2 = document.createElement('div');
                        text2.style.position = 'absolute';
                        text2.style.width = room.width * this.ratio + 'px';
                        text2.style.fontSize = FONT_SIZE - 3 +'px';
                        text2.style.color = FONT_COLOR;
                        text2.style.opacity = 0.6;
                        text2.style.fontWeight = 500;
                        text2.innerHTML = parseFloat(Math.round((room.width * room.height) * 100) / 100).toFixed(2) + ' m<sup>2</sup>';
                        text2.style.textAlign = 'center';
                        text2.style.top = (room.y * this.ratio) + (room.height * this.ratio / 2) + OFFSET_Y + 2 + 'px';
                        text2.style.left = room.x * this.ratio + OFFSET_X + 'px';
                        document.querySelector('#canvas-drawer').appendChild(text2);
                    }
                } else {
                    this.renderHole(positionX, Math.round(positionY), positionX, Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderHole(positionX, Math.round(positionY + (room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderHole(Math.round(positionX + (room.width * this.ratio)), Math.round(positionY +(room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), Math.round(positionY), room, two);
                    this.renderHole(Math.round(positionX + (room.width * this.ratio)), Math.round(positionY), positionX, Math.round(positionY), room, two);
                }
            });
            rooms.forEach((room) => {
                const positionX = (room.x * this.ratio) + OFFSET_X;
                const positionY = (room.y * this.ratio) + OFFSET_Y;
                if (room.name !== 'trouL') {
                    this.renderDoublingWall(positionX, positionY, positionX, Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderDoublingWall(positionX, Math.round(positionY + (room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderDoublingWall(Math.round(positionX + (room.width * this.ratio)), Math.round(positionY +(room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), positionY, room, two);
                    this.renderDoublingWall(Math.round(positionX + (room.width * this.ratio)), positionY, positionX, positionY, room, two);
                } else {
                    this.renderDoublingHole(positionX, Math.round(positionY), positionX, Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderDoublingHole(positionX, Math.round(positionY + (room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), Math.round(positionY + (room.height * this.ratio)), room, two);
                    this.renderDoublingHole(Math.round(positionX + (room.width * this.ratio)), Math.round(positionY +(room.height * this.ratio)), Math.round(positionX + (room.width * this.ratio)), Math.round(positionY), room, two);
                    this.renderDoublingHole(Math.round(positionX + (room.width * this.ratio)), Math.round(positionY), positionX, Math.round(positionY), room, two);
                }
            });
        },
        createLine(x1, y1, x2, y2, size, color, two) {
            var line = two.makeLine(x1, y1, x2, y2);
            line.stroke = color;
            line.linewidth = size;
        },
        createDashedLine(x1, y1, x2, y2, size, color, dashSize, two) {
            var distanceX = x2 - x1;
            var distanceY = y2 - y1;
            var distanceH = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
            var iterator = distanceH / dashSize;
            var dashSizeX =  Math.round(distanceX / iterator * 10) / 10;
            var dashSizeY =  Math.round(distanceY / iterator * 10) / 10;
            var currentX = x1;
            var currentY = y1;
            for (var z=0; z < iterator ;z++) {
                if (z%2 === 0) {
                    var line = two.makeLine(currentX, currentY, currentX + dashSizeX, currentY + dashSizeY);
                    line.stroke = color;
                    line.linewidth = size;
                }
                distanceX = Math.round((distanceX - dashSizeX) * 10) / 10;
                distanceY = Math.round((distanceY - dashSizeY) * 10) / 10;
                currentX = Math.round((currentX + dashSizeX) * 10) / 10;
                currentY = Math.round((currentY + dashSizeY) * 10) / 10;
            }
        },
        createDashedArcSegment(centerX, centerY, radius, startAngle, endAngle, color, size, dashSize, two) {
            var currentStartAngle = startAngle;
            while (currentStartAngle < endAngle) {
                var currentEndingAngle = (currentEndingAngle + dashSize > endAngle)?endAngle:(currentStartAngle + dashSize);
                var arcSegment = two.makeArcSegment(centerX, centerY, radius, radius, currentStartAngle, currentEndingAngle);
                arcSegment.stroke = color;
                arcSegment.linewidth = size;
                currentStartAngle = currentEndingAngle + dashSize;
            }
        }
    }
}
</script>

<style scoped>
    #canvas-drawer {
        position: relative;
    }
</style>
