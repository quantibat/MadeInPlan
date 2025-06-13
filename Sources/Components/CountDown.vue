<template>
    <ul class="vuejs-countdown">
        <li>
            <p class="digit">{{ days | twoDigits }}</p>
            <p class="text">{{ days > 1 ? 'jours' : 'jour' }}</p>
        </li>
        <li>
            <p class="digit">{{ hours | twoDigits }}</p>
            <p class="text">{{ hours > 1 ? 'heures' : 'heure' }}</p>
        </li>
        <li>
            <p class="digit">{{ minutes | twoDigits }}</p>
            <p class="text">minutes</p>
        </li>
        <li>
            <p class="digit">{{ seconds | twoDigits }}</p>
            <p class="text">secondes</p>
        </li>
    </ul>
</template>

<script>
let interval = null;
export default {
    name: 'CountDown',
    props: {
        end: {
            type: Date
        }
    },
    data() {
        return {
            now: Math.trunc((new Date()).getTime() / 1000),
            date: null,
            diff: 0
        }
    },
    created() {
        if (!this.end) {
            throw new Error("Missing props 'endTime'");
        }
        this.date = Math.trunc(this.end / 1000);
        this.now = Math.trunc((new Date()).getTime() / 1000);
        this.diff = this.date - this.now;
        interval = setInterval(() => {
            this.now = Math.trunc((new Date()).getTime() / 1000);
            this.diff = this.date - this.now;
        }, 1000);
    },
    computed: {
        seconds() {
            return Math.trunc(this.diff) % 60
        },
        minutes() {
            return Math.trunc(this.diff / 60) % 60
        },
        hours() {
            return Math.trunc(this.diff / 60 / 60) % 24
        },
        days() {
            return Math.trunc(this.diff / 60 / 60 / 24)
        }
    },
    filters: {
        twoDigits(value) {
            if ( value.toString().length <= 1 ) {
                return '0'+value.toString()
            }
            return value.toString()
        }
    },
    destroyed() {
        clearInterval(interval);
    }
}
</script>
<style>
.vuejs-countdown {
    padding: 0;
    margin: 2.5rem 0;
    color: rgba(33, 45, 89, 1);
}
.vuejs-countdown li {
    display: inline-block;
    margin: 0 4px;
    text-align: center;
    position: relative;
}
.vuejs-countdown li p {
    margin: 0;
}
.vuejs-countdown li:after {
    content: ":";
    position: absolute;
    top: -2px;
    right: -10px;
    font-size: 21px;
    color: #00BBFF;

}
.vuejs-countdown li:first-of-type {
    margin-left: 0;
}
.vuejs-countdown li:last-of-type {
    margin-right: 0;
}
.vuejs-countdown li:last-of-type:after {
    content: "";
}
.vuejs-countdown .digit {
    font-size: 24px;
    font-weight: 300;
    line-height: 1.4;
    margin-bottom: 0;
    color: #00BBFF;
}
.vuejs-countdown .text {
    text-transform: uppercase;
    margin-bottom: 0;
    font-size: 10px;
    opacity: .5;
}
</style>
