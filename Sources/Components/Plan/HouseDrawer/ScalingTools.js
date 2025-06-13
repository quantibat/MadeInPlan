import { OFFSET_X, OFFSET_Y, RATIO } from "./CONST.js";

var mixin = {
    methods: {
        scaleAndOffsetX: function(x) {
            return x * RATIO + OFFSET_X;
        },
        scaleAndOffsetY: function(y) {
            return y * RATIO + OFFSET_Y;
        },
        scale: function(dim) {
            return dim * RATIO;
        },
        sum: function(...c) {
            c.reduce((a, b) => Number((a + b).toFixed(2)), 0);
        }
    }
}

export { mixin };
