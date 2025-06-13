<style>
#app, body { margin: 0px; background: #FFFFFF; overflow: overlay; }
* { font-family: 'Poppins', sans-serif;  }
.budicon { font-size: 14px; }
.header h1 {
    font-size: 2.5rem;
    opacity: .9;
    letter-spacing: -2px;
    color: #212D59;
    font-weight: 300;
    margin-bottom: -20px;
    position: relative;
}
.header h1::after {
    display: block;
    position: absolute;
    bottom: .5rem;
    content: '';
    width: 25px;
    /* margin: auto; */
    height: 3px;
    background: #00BBFF;
    border-radius: 500px;
}
.el-input.large .el-input__inner { height: 50px; }
.toogle-checkbox-message-class { margin-top: 180px; }
.el-dialog.modal-container { overflow-x: hidden; }
.main-container { }

/* .el-dialog {
    box-shadow: none;
    -webkit-box-shadow: none;
    background: none;
} */
.el-select-dropdown::after {
    display: none;
}
.el-select-dropdown .el-scrollbar {
    padding-bottom: 0;
}

@-webkit-keyframes flash {
    from,
    50%,
    to {
        opacity: 1;
    }

    25%,
    75% {
        opacity: 0;
    }
}

@keyframes flash {
    from,
    50%,
    to {
        opacity: 1;
    }

    25%,
    75% {
        opacity: 0;
    }
}

@-webkit-keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.fadeIn {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
}

@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}


@keyframes tada {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    10%,
    20% {
        -webkit-transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
        transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    }

    30%,
    50%,
    70%,
    90% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    }

    40%,
    60%,
    80% {
        -webkit-transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@-webkit-keyframes pulse {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    50% {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

@keyframes pulse {
    from {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }

    50% {
        -webkit-transform: scale3d(1.05, 1.05, 1.05);
        transform: scale3d(1.05, 1.05, 1.05);
    }

    to {
        -webkit-transform: scale3d(1, 1, 1);
        transform: scale3d(1, 1, 1);
    }
}

::-webkit-scrollbar {
    width: 6px;
    height: 4px;
}
::-webkit-scrollbar-track {
    background: transparent;
}
::-webkit-scrollbar-thumb {
    -webkit-border-radius: 4px;
    border-radius: 4px;
    background: #BBBBBB;
}
::-webkit-scrollbar-thumb:horizontal {
    border-right-width: 0;
    border-bottom-width: 4px;
    -webkit-border-top-right-radius: 5px;
    -webkit-border-bottom-right-radius: 5px 9px;
    -webkit-border-bottom-left-radius: 5px 9px;
}

.el-carousel__indicators--outside .el-carousel__button {
    background-color: #48BEFE;
    margin-top: 1rem;

    height: 10px;
    width: 10px;
    border-radius: 50%;

}

.dossier-financier .el-dialog {
    width: 100% !important;
}

.el-dialog__headerbtn {
    font-size: 2rem;
    z-index: 99999;
}

.el-steps--horizontal {
    width: 25vw;
    margin: 2rem 0;
    /* margin-top: auto; */
}


.el-step.is-center .el-step__line {
    left: 68%;
    right: -32%;
    border-radius: 50%;
}

.el-step.is-horizontal .el-step__line {
    height: 1px;
    background: rgba(33, 45, 89, .1);
    border-radius: 50%;
}

.el-step__icon-inner {
    font-weight: 400;
    color: #48BEFE;
    /* height: 1.5rem; */
}

.el-step__icon.is-text {
    border: 1px solid #48BEFE;
    background: transparent;
    /* margin-top: 9px; */
    /* font-size: 1rem; */
    /* font-weight: 00; */
}


.el-step__head.is-wait .el-step__icon.is-text {
    color: rgba(33, 45, 89, .5);
    border-color: rgba(33, 45, 89, .5);
    opacity: .5;
}

.el-step__head.is-wait .el-step__icon-inner {
    color: rgba(33, 45, 89, .5);
}

.el-step__title.is-process {
    color: #48BEFE;
    margin-top: 3px;
    font-weight: 300;
}

.el-step__title.is-wait{
    color: rgba(33, 45, 89, .3);
    margin-top: 3px;
}

.el-step__head.is-success .el-step__icon.is-text,
.el-step__icon-inner.is-status.el-icon-check,
.el-step__main .el-step__title.is-success,
.el-step__head.is-success .el-step__line
{
    color: #2ecc71;
    border-color: #2ecc71;
    border: none;
    height: 1px;
    border-radius: 50%;
}

.el-step__head.is-success .el-step__line {
    /* height: 1px; */
    /* display: none; */
}

.el-step__icon-inner.is-status.el-icon-check {
    font-size: 1.5rem;
}

.el-step__head.is-success .el-step__line-inner {
    border-width: .04em !important;
    border-radius: 50%;
}

.notification-body .notification-message > p {
    padding: 0;
    margin: 0 !important;
}

.el-collapse-item__header {
    font-size: 1rem;
    color: rgba(33, 45, 89, .9);
    height: 65px;
    line-height: 65px;
    padding: inherit 1.1rem;
}

.el-collapse-item__header:hover {
    background: rgba(33, 45, 89, .02);
}
.el-collapse-item__arrow {
    line-height: 65px;
}


.inspi-new-board-modal .el-dialog {
    box-shadow: none !important;
    webkit-box-shadow: none !important;
}

.inspi-new-board-modal .el-dialog__title {
    color: rgba(33, 45, 89, .9);
    font-size: 2.5rem;
    font-weight: 300;
}

.inspi-new-board-modal .el-dialog__footer {
    text-align: left;
}

.inspi-new-board-modal input {
    height: 60px;
    line-height: 60px;
    font-size: 1.5rem;
    font-weight: 400;
}



/* CREDIT */

.credit-container .el-tabs__nav, .projet-container .el-tabs__nav {
    float: right;
}

.credit-container .el-tabs__item, .projet-container .el-tabs__item {
    height: auto;
    line-height: auto;
    padding: .5rem 1.4rem;
    font-size: .8rem;
    font-weight: 500;
    color: rgba(33, 45, 89, .7);
    text-transform: uppercase;
    letter-spacing: 1px;
}
.credit-container .el-tabs__item.is-active, .projet-container .el-tabs__item.is-active {
    background: linear-gradient(5deg,#31bdfc,#00d3f7);
    color: #fff;
}

.credit-container2 .el-tabs__nav {
    float: left;
}

.credit-container2 .el-tabs__item {
    height: auto;
    line-height: auto;
    padding: .3rem 1rem;
    font-size: .8rem;
    font-weight: 500;
    color: rgba(33, 45, 89, .7);
    text-transform: uppercase;
    letter-spacing: 1px;
}
.credit-container2 .el-tabs__item.is-active {
    background: linear-gradient(5deg,#31bdfc,#00d3f7);
    color: #fff;
}


.credit-container2 .el-tab-pane {
    margin-bottom: .5rem;
}

.credit-container2 .el-tabs__header {
    margin: 0 0 2rem;
}

.monthly-calculation-dialog .el-tabs__nav {
    float: left;
}
.monthly-calculation-dialog .el-tabs__item {
    height: 3rem;
    line-height: 3rem;
    font-size: .8rem;
    font-weight: 500;
    color: rgba(33, 45, 89, .7);
    text-transform: uppercase;
    letter-spacing: 1px;
}
.monthly-calculation-dialog .el-tabs--card>.el-tabs__header .el-tabs__item:first-child {
    border-left: 1px solid #D4D7DF;
}
.monthly-calculation-dialog .el-tabs--card>.el-tabs__header .el-tabs__item {
    color: #D4D7DF;
    border: 1px solid #D4D7DF;
}
.monthly-calculation-dialog .el-tabs--card>.el-tabs__header .el-tabs__item:last-child {
    color: #00BBFF;
}
.monthly-calculation-dialog .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
    color: #00BBFF;
    border: 1px solid #00BBFF;
    border-left: 1px solid #00BBFF;
}

.el-tabs__content {
    overflow: inherit;
}

.monthly-calculation-dialog .el-tabs--card>.el-tabs__header {
    border-bottom: none;
}
.monthly-calculation-dialog .el-tabs--card>.el-tabs__header .el-tabs__nav {
    border: none;
}

.monthly-calculation-dialog .el-tab-pane {
    margin-bottom: .5rem;
}

.monthly-calculation-dialog .el-tabs__header {
    margin: 0 0 2rem;
}
.case-input-number input {
    text-align: center;
}
.case-input-number input::-webkit-outer-spin-button,
.case-input-number input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.vue-slider-component .vue-slider-dot {
    box-shadow: none !important;
}
input[type=number] {
    -moz-appearance:textfield;
}
/* NOTIFICATION */
.el-badge__content {
    border-radius: 5px;
}


/* SWAL */

.swal2-popup .swal2-title {
    color: #2b396a !important;
    font-weight: 300 !important;
}

.swal2-popup .swal2-styled.swal2-confirm {
    border: 0;
    border-radius: .25em;
    background: #31bdfc;
    color: #fff;
    font-size: 1.0625em;
    padding: 1em inherit;
}

.swal2-popup .swal2-styled.swal2-confirm:focus, .swal2-popup .swal2-styled.swal2-confirm:active {
    border: none;
}

.swal2-container.swal2-shown {
    background-color: rgba(255, 255, 255, 0.96);
}


.swal2-container {
    margin-top: -5rem !important;
}

/* Detail Tache */
.task-container .el-input {
    font-size: 1rem;
}

.InputElement::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: red;
    opacity: 1; /* Firefox */
}

/* FAQ */

.el-collapse-item__content {
    font-size: .9rem;
    color: rgba(35, 49, 88, .8);
}


.coach-dialog .el-input .el-input__inner {
    height: 62px;
    line-height: 62px;
}



.credit-container2 .el-dialog__headerbtn {
    top: 60px;
    z-index: 9999;
}

.monthly-calculation-dialog .el-dialog__headerbtn {
    top: 60px;
    z-index: 9999;
}

.vue-slider-tooltip::before {
    display: none !important
}

.el-tabs__item .el-icon-close {
    background: none !important;
    color: rgba(35, 49, 88, .3);
    font-size: 1rem !important;
    position: relative;
}


.el-tabs__item .el-icon-close:hover::before {
    color: #FF5252;
}


.el-dialog__headerbtn .el-dialog__close:hover {
    /* color: #909399; */
    color: #FF5252;
}

.projet-container .el-tabs__content {
    height: auto !important;
    overflow:visible !important;
}

.board-item-container .el-tabs__content {
    height: 80vh !important;
    overflow:scroll !important;
    overflow:overlay !important;
} 


/* PRESTATAIRES */

.select-jobs > .el-input > input {
    border: none;
    font-weight: 600;
    font-size: 1.1rem;
    color: rgba(33, 45, 89, 1);
    padding-left: 0;
    width: 360px;
}
.select-jobs > .el-input {
    border-top: none;
    border-right: none;
    border-left: none;
    outline: none;
    border-bottom: 1px solid rgba(33, 45, 89, 0);
}

.select-jobs > .el-input:hover, .select-jobs >  .el-input.is-focus {
    border-bottom: 1px solid rgba(33, 45, 89, .3);
}



.add-terrain .el-select-dropdown::after {
    content: 'test' !important
}
@media (min-width: 768px) and (max-width: 1188px) {
    .contacts-table.details .contact-metier, .select-jobs > .el-input > input {
        /* color: #00BBFF; */

        width: 120px !important;
        font-size: .9rem !important;
    }
}

.tooltip {
    z-index: 9999;
}

.tooltip .tooltip-inner {
    background: #fff;
    color: rgba(33, 45, 89, .8);
    border-radius: 5px;
    padding: .8rem 1rem;
    max-width: 300px;
    box-shadow: 0 0 8px 3px rgba(0, 0, 0, .09);
    font-size: .9rem;
}

.tooltip .tooltip-arrow {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
    margin: 5px;
    border-color: #fff;
}

.tooltip[x-placement^="top"] {
    margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
    border-width: 5px 5px 0 5px;
    border-left-color: transparent !important;
    border-right-color: transparent !important;
    border-bottom-color: transparent !important;
    bottom: -5px;
    left: calc(50% - 5px);
    margin-top: 0;
    margin-bottom: 0;
}

@media only screen and (min-width: 300px) and (max-width: 767px) {
    .el-input input {
        /* padding: 0; */
        margin: 0;
        font-size: .9rem;
        height: 40px !important;

    }

    .el-message {
        min-width: 90vw;
        opacity: .92;
        padding: .5rem;

    }

    .el-message .el-message__content {
        font-size: .7rem !important;
        line-height: 1.4
    }
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background-color: #48BEFE !important;
        border-color: #48BEFE !important;
    }
}

/*
##Device = Tablets, Ipads (portrait)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {
    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        background-color: #48BEFE !important;
        border-color: #48BEFE !important;
    }

    .credit-container .el-tabs__item {
        padding: 0 20px;
        font-size: .7rem;
    }

    .credit-container2 .el-tabs__content {
        width: 100%;
    }
    .select-jobs > .el-input > input {
        font-weight: normal;
        font-size: 0.9rem;
    }
}

/*
##Device = Tablets, Ipads (landscape)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

    .credit-container .el-tabs__item {
        padding: 0 20px;
        font-size: .7rem;
    }

    .credit-container2 .el-tabs__content {
        width: 100%;
    }

}

/* TILES */
.tile, .selected-tile {
    margin-bottom: 1rem;
}

.descriptif-question .tile-image {
    top: 15% !important;
    left: 15% !important;
    width: 50% !important;
}

</style>

<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
Number.prototype.formatMoney = function(c) {
    var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = ",",
    t = " ",
    s = n < 0 ? "-" : "",

    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
String.prototype.removeAccents = function(){
    var accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
    ];
    var noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];

    var str = this;
    for(var i = 0; i < accent.length; i++){
        str = str.replace(accent[i], noaccent[i]);
    }

    return str;
}
String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};
String.prototype.contains = function(sub) {
    return (this.toLowerCase().removeAccents().indexOf(sub.toLowerCase().removeAccents()) != -1 ? true : false);
};

export default {
    name: 'App',
}
</script>
