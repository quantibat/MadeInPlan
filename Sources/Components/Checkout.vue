<template>
    <div class="modal" @click.self="close()">
        <div class="modal-content">
            <h2 style="color: #2B396A;font-weight: 300; letter-spacing: -1px; font-size: 2rem; margin-top: 0px;">Vous faites le bon choix !</h2>
            <div class="payment-container">
                <div class="payment-form payment-item">
                    <div class="field payment-form-item">
                        <div ref="num" class="input"></div>
                        <div ref="cvc" class="input"></div>
                        <div ref="exp" class="input"></div>
                        <div v-show="cardCheckErrorMessage != ''" ref="card-error" class="card-error" role="alert">{{ cardCheckErrorMessage }}</div>
                    </div>

                    <div class="button-cta payment-form-item">
                        <el-button class="paid-button btn" @click="validate()">Valider</el-button>
                    </div>

                    <!-- <div class="security-icons payment-form-item">
                        <img src="https://www.alexandrofratelli.com/wp-content/uploads/2018/02/logo-stripe.png" width="60%" alt="">
                    </div> -->
                </div>

                <div class="payment-info payment-item">
                    <div class="payment-offer-name">
                        <h2>{{ info.name }}</h2>
                        <div class="pricing-offer">{{ info.amount }}€{{ info.amount == 15 ? '/mois' : '' }}</div>
                        <ul class="pricing-features">
                            <li v-for="feature in info.features" :key="feature" class="pricing-feature">{{ feature }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let stripe = Stripe('pk_test_jDfxzLnzKNyOa39bnX2ywGnr'),
elements = stripe.elements(),
card = undefined;

export default {
    name: 'Information',
    props: {
        info: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            userEdited: {},

            card: {
                num: {},
                cvc: {},
                exp: {}
            },
            cardCheckErrorMessage: ''
        }
    },
    computed: {
        user() {
            return this.$localStorage.get('user');
        }
    },
    created() {
        this.$http.get(this.$root.URL + '/auth/islogged').then((res) => {
            if (res.data.isLogged == false) this.$router.replace({ name: 'Login' });
        });
        this.userEdited = JSON.parse(JSON.stringify(this.user));
    },
    mounted() {
        var style = {
            style: {
                base: {
                    color: "#2B396A",
                    fontWeight: 400,
                    fontFamily: "Poppins, Helvetica, Arial, sans-serif",
                    fontSize: "16px",
                    fontSmoothing: "antialiased",

                    "::placeholder": {
                        color: "rgba(43, 57, 106, 0.304)"
                    },
                    ":-webkit-autofill": {
                        color: "#fce883"
                    }
                },
                invalid: {
                    iconColor: "#D32F2F",
                    color: "#D32F2F"
                }
            }
        };

        this.card.num = elements.create('cardNumber', style);
        this.card.cvc = elements.create('cardExpiry', style);
        this.card.exp = elements.create('cardCvc', style);

        this.card.num.mount(this.$refs.num);
        this.card.cvc.mount(this.$refs.cvc);
        this.card.exp.mount(this.$refs.exp);

        this.card.num._on('change', (event) => { this.cardCheckErrorMessage = event.error ? event.error.message : ''; });
        this.card.cvc._on('change', (event) => { this.cardCheckErrorMessage = event.error ? event.error.message : ''; });
        this.card.exp._on('change', (event) => { this.cardCheckErrorMessage = event.error ? event.error.message : ''; });
    },
    destroyed() {
        this.card.num.destroy();
        this.card.cvc.destroy();
        this.card.exp.destroy();
    },
    methods: {
        validate() {
            this.$swal({
                title: 'Votre paiement est en cours de traitement',
                showConfirmButton: false,
                onOpen: () => {
                    this.$swal.showLoading()
                    stripe.createToken(this.card.num).then(result => {
                        if (result.error) {
                            this.$swal({ title: result.error.message, type: 'error', showConfirmButton: false, timer: 2000 });
                        } else {
                            this.$http.post('/money' + this.info.route, { token: result.token.id }).then((res) => {
                                this.$swal({ title: 'Votre paiement à bien été validé !', type: 'success', showConfirmButton: false, timer: 2000 });
                                this.$store.commit('setUser', res.data.user);
                                this.$localStorage.set('user', res.data.user);
                                this.$emit('complete');
                            });
                        }
                    });
                },
                allowOutsideClick: () => !this.$swal.isLoading()
            });
        },
        close() {
            this.$emit('abort');
        }
    }
}
</script>

<style scoped>
.modal { position: fixed; top: 0; left: 0; z-index: 20; height: 100%; width: 100%; background-color: rgba(255, 255, 255, .9) !important; }
.modal-content { background-color: white; margin: 0 auto; display: flex; flex-direction: column; align-items: center; height: 100vh; justify-content: center;}

#paymentRequest { max-width: 500px; width: 100%; margin-bottom: 10px; }

fieldset { border: 1px solid #31BDFC; padding: 15px; border-radius: 6px; }
fieldset legend { margin: 0 auto; padding: 0 10px; text-align: center; font-size: 14px; font-weight: 500; color: white; background-color: #31BDFC; }
fieldset legend + * { clear: both; }

.card-only { display: block; }
.payment-request-available { display: none; }

.row { display: -ms-flexbox; display: flex; margin: 0 0 10px; }
.field { position: relative; width  : 100%; }
.field + .field { margin-left: 40px; }

label { text-transform: uppercase; margin-bottom: -15px; text-align: left; color: #2B396A; opacity: 0.5; letter-spacing: 1px; font-weight: 400; font-size: 15px; }
.input {margin-bottom: 1rem; font-size: .9rem; width: 100%;color: rgba(43, 57, 106, 0.338); background: transparent;  padding: 24px 16px; border-radius: 4px; border: 1px solid rgba(54, 89, 159, .2); }
.input::-webkit-input-placeholder, .input::-moz-placeholder, .input:-ms-input-placeholder { color: rgba(43, 57, 106, 0.167); }
.input::-webkit-input-placeholder:focus, .input::-moz-placeholder:focus, .input:-ms-input-placeholder:focus { color: transparent; }

.input.StripeElement--focus, .input:focus { border-color: #31BDFC; }
.input.StripeElement--invalid { border-color: #D32F2F; }

input:-webkit-autofill, select:-webkit-autofill { -webkit-text-fill-color: #fce883; transition: background-color 100000000s; -webkit-animation: 1ms void-animation-out; }

.StripeElement--webkit-autofill { background: transparent !important; }

input, button, select { -webkit-animation: 1ms void-animation-out; -webkit-appearance: none; -moz-appearance: none; appearance: none; outline: none; border-style: none; border-radius: 0; }

select.input, select:-webkit-autofill { background-image: url('data:image/svg+xml;utf8,<svg width="10px" height="5px" viewBox="0 0 10 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path fill="#fff" d="M5.35355339,4.64644661 L9.14644661,0.853553391 L9.14644661,0.853553391 C9.34170876,0.658291245 9.34170876,0.341708755 9.14644661,0.146446609 C9.05267842,0.0526784202 8.92550146,-2.43597394e-17 8.79289322,0 L1.20710678,0 L1.20710678,0 C0.930964406,5.07265313e-17 0.707106781,0.223857625 0.707106781,0.5 C0.707106781,0.632608245 0.759785201,0.759785201 0.853553391,0.853553391 L4.64644661,4.64644661 L4.64644661,4.64644661 C4.84170876,4.84170876 5.15829124,4.84170876 5.35355339,4.64644661 Z" id="shape"></path></svg>'); background-position: 100%; background-size: 10px 5px; background-repeat: no-repeat; overflow: hidden; text-overflow: ellipsis; padding-right: 20px; }

.card-error { color: #D32F2F; }

.button-cta button {
    width: 498px;
    text-align:center;
    float: right;
    margin-right: -2.1rem;
}

.btn {
    padding: 1rem 20px;
    /* width: 100%; */
}
.paid-button { background-color: #4FC7FC; border-radius: 4px; color: white; font-weight: 400; cursor: pointer; font-size: 16px; }
.cancel-button { margin: 20px 0 0; border: 1px solid rgba(54, 89, 159, .5); border-radius: 4px; color: rgba(54, 89, 159, .5); font-weight: 300; cursor: pointer; font-size: 16px; }

.payment-container {
    display: flex;
}

.payment-item {
    flex: 1;
    position: relative;
}
.payment-item:first-of-type {
    margin-right: 10rem;
}

.payment-item:first-of-type::after {
    content: '';
    border-right: 1px solid rgba(35, 49, 88, .1);
    display: block;
    position: absolute;
    right: -100px;
    height: 250px;
    top: 20px;


}

.payment-form {
    /* flex:0; */
}

.payment-info  {
    /* padding: 0 4rem; */
    /* flex: 2; */
}

.payment-offer-name h2 {
    margin: 0;
    padding: 0;
    color: rgba(33, 45, 89, 1);
}

.pricing-features { margin-bottom: 2rem; padding: 0 ; list-style: none; }
.pricing-feature { margin-bottom: 1rem; color:  rgba(35, 49, 88, .6); text-align: left; }
.pricing-feature::before { content: '✓ '; color: #2ecc71; }

.pricing-offer { color: #31BDFC; margin-top: auto; margin-bottom: .8rem; font-weight: 300;  font-size: 1rem;}


.payment-form {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;

}

.payment-form-item {
    margin-bottom: 0rem;
}

.payment-form-item:last-of-type {
    margin-top: 2rem;
}
/* 
  ##Device = Laptops, Desktops
  ##Screen = B/w 1025px to 1280px
*/

@media (min-width: 1025px) and (max-width: 1280px) {
  
  
  
}

/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 300px) and (max-width: 1024px) and (orientation: portrait) {

    .modal-content {
        height: 100%;  
    }
  
  .payment-item:first-of-type::after {
      display: none;
  }
  .payment-container {
      min-width: 60vw;
      flex-direction: column;
      overflow: scroll;
      /* height: 100%; */
  }

  .payment-item:first-of-type {
    margin-right: inherit;
}
  .payment-form {
      margin-top: inherit;
  } 

.pricing-features {
      width: 50vw;
      margin: auto;
  }
  .payment-info {
      margin-top: 2rem;
      text-align: center;
  }
  .security-icons {
      text-align: center;
  }
  .input {
      width: auto;
  }
  .button-cta button {
      float: inherit;
      margin-right: none;
      width: 100%;
  }
  .payment-form-item:last-of-type {
    margin-top: inherit;
}
}

/* 
  ##Device = Tablets, Ipads (landscape)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

  
}
</style>
