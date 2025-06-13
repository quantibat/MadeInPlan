<template id="Checkbox">
    <div id="_prevent" :class="'switch ' + (done ? 'true' : 'false' )" @click="handleToggle()">
        <span id="_prevent"></span>
    </div>
</template>

<script>
export default {
    name: 'Checkbox',
    props: {
        'id': {
            type: String,
            required: true
        },
        'done': {
            type: Boolean,
            required: true
        },
        'cb': {
            type: Function,
            required: false
        }
    },
    data() {
        return {
            messages: ["Bravo 😀", "Génial !", "Top !", "Une bonne chose de faite !",
            "Quel talent !", "Ça c’est super !", "Super !", "Excellent !", "Topissime !", "Sans pitié !",
            "Vamos !", "Cool !", "Vous avancez bien, bravo !", "Fantastique !", "C’est bon ça !",
            "Voilà une bonne nouvelle !", "Yes ! Rien ne vous arrête !", "Parfait ! Ne changez rien !",
            "En avant !", "En avant Guingamp !", "Vous assurez !"]
        }
    },
    computed: {
        tasklist() {
            return this.$store.state.tasklist;
        }
    },
    methods: {
        handleToggle() {
            if (this.tasklist.length > 0) this.$store.commit('toggleTask', this.id);
            
            if (!this.done) {
                this.$message({
                    message: this.messages[Math.floor(Math.random() * Math.floor(this.messages.length))],
                    type: 'success',
                    customClass: 'toogle-checkbox-message-class'
                });
            }
            this.$http.post(this.$root.URL + '/todolist/toggle-task', { id: this.id }).then(res => {
                if (this.cb) this.cb(this.id);
            }, res => {
                console.log('ERROR toggleTask Server');
            });
        }
    }
}
</script>

<style scoped>
.switch::before {
    content: '';
    position: absolute;
    left: -20px;
    top: -20px;
    width: 70px;
    height: 85px;
    background: transparent;
}

.switch {
    position: absolute;
    width: 42px;
    height: 42px;
    text-align: center;
    margin: 0;
    margin-top: 5px;
    background: #2ECC71;
    background: linear-gradient(5deg, rgba(46,204,113,1) 0%, rgba(145,212,101,1) 100%);
    -webkit-transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -o-transition: all 0.2s ease;
    -ms-transition: all 0.2s ease;
    transition: all 0.2s ease;
    border-radius: 25px;
}
.switch span {
    position: absolute;
    width: 19px;
    height: 3px;
    top: 50%;
    left: 50%;
    margin: -2px 0px 0px -7px;
    background: #FFFFFF;
    display: block;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -o-transition: all 0.2s ease;
    -ms-transition: all 0.2s ease;
    transition: all 0.2s ease;
    border-radius: 25px;
}
.switch span::after {
    content: "";
    display: block;
    position: absolute;
    width: 3px;
    height: 9px;
    margin: -6px 0px 0px 0px;
    background: #FFFFFF;
    -webkit-transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -o-transition: all 0.2s ease;
    -ms-transition: all 0.2s ease;
    transition: all 0.2s ease;
    border-radius: 25px;
}
.false {
    width: 38px;
    height: 38px;
    background: #FFFFFF;
    border: solid 2px #E0E0E0;
}
.false span {
    background: #E0E0E0;
}
.false span::after {
    background: #E0E0E0;
}

.false:hover { border-color: #2ECC71; }
.false:hover span { background: #2ECC71; background: linear-gradient(5deg, rgba(46,204,113,1) 0%, rgba(145,212,101,1) 100%); }
.false:hover span::after { background: #2ECC71; background: linear-gradient(5deg, rgba(46,204,113,1) 0%, rgba(145,212,101,1) 100%);}
</style>
