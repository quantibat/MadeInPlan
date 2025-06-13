<template>
<body class="print">
    <header class="doc-head2">
        <img class="doc-logo" src="/Assets/mip-print.png" alt="">
        <h1 class="doc-title">Projet de construction d'une maison individuelle</h1>
        <span class="doc-location">La capitale pointue — Nîmes</span>
        <span class="doc-username">{{user.firstName}} {{user.lastName}}</span>
    </header>

    <main class="doc-content">
        <table v-for="item in data" v-if="item.PHT && !item.PU" class="doc-table">
            <tbody>
                <tr>
                    <td class="gros-oeuvre" style="page-break-inside: avoid;">{{item.label}}</td>
                    <td>{{item.PHT}}</td>
                </tr>
             </tbody>
        </table>

        <table class="doc-table">
            <tfoot>
                <tr>
                    <td class="finitions">Estimation totale</td>
                    <td>{{this.price[0].PHT}}</td>
                </tr>
            </tfoot>
        </table>
    </main>

    <header class="doc-head">
        <img class="doc-logo" src="/Assets/mip-print.png" alt="">
        <h1 class="doc-title">Détail des postes</h1>
        <!-- <spab class="doc-desc">Détail</spab> -->
    </header>

    <main class="doc-content">
        <table class="doc-table">
            <tbody v-for="item in data" v-if="item.PHT && !item.PU">
                <tr>
                    <td class="gros-oeuvre">{{item.label}}</td>
                    <td>{{item.PHT}}</td>
                </tr>
                <tr class="subitem" v-for="subitem in data" v-if="subitem.PHT && subitem.PU && subitem.ref[0] == item.ref[0]">
                    <td>{{subitem.label}}</td>
                    <td class="price">{{subitem.PHT}}</td>
                </tr>
             </tbody>
        </table>

        <table class="doc-table">
            <tfoot>
                <tr>
                    <td class="finitions">Estimation totale</td>
                    <td>{{this.price[0].PHT}}</td>
                </tr>
            </tfoot>
        </table>
    </main>
</body>
</template>

<script>

export default {
    name: 'PrintChiffrage',
    components: {
    },
    data() {
        return {
        }
    },
    props: {
        'data': { type: Array, required: true },
        'price': { type: Array, required: true },
    },
    computed: {
        user() {
            return this.$store.state.user.info[0];
        }
    },
    created() {
        this.data = this.data.sort((a, b) => {

            var iA = a.ref.split('.');
            var iB = b.ref.split('.');

            for (var i = 0; i < Math.min(iA.length, iB.length); i++) {
                if (parseInt(iA[i]) < parseInt(iB[i])) return -1;
                else if (parseInt(iA[i]) > parseInt(iB[i])) return 1;
            }
            return (iA.length - iB.length > 0 ? 1 : -1);
        })
        // console.log("devis", window.localStorage.get('devis'))
        // setTimeout(() => {
        //     window.print()
        // }, 300);
    },
    methods: {
        getTotal() {
            // var total = this.data.reduce((accumulator, item) => {
            //     if (item.PHT && !item.PU) console.log(item.PHT)
            //     if (item.PHT && !item.PU) return (accumulator + parseInt(item.PHT));
            //     else return (accumulator);
            // } , 0);
            // console.log(total);
            // return (total);
            return "300000"
        },
    }
}

</script>
    <style scoped>
 @page { margin: 0; }
 @media print {
     @page :first {
         margin: 0;
         size: auto;
     }
     @page {
        size: auto;   /* auto is the initial value */
        margin-top : 20px;
        margin-bottom: 0px;
    }
    .print {}
    .doc-table {
            width: 100%;
            /* margin-bottom: 2rem; */
            /* page-break-inside: avoid; */
    }
    .doc-head2 {
        page-break-inside: avoid;
        position: relative;
    }
    .doc-head {
        page-break-before: always;
        page-break-inside: avoid;
        display: inline-block;
        vertical-align: top;
        width: 100%;
        position: relative;
    }
    body {
        /* margin-top : 50px; */
         margin-bottom: 50px;
         position: relative;
    }
    .print {position: relative;}
    .price {width: 100px}
    .subitem {page-break-inside: avoid;}
     .Header, .Footer { display: none ; }
 }

 @media screen {
    .print {display: none}
 }
    .doc-head {
    clear: both;
    margin-top: 50px;
    }

    .doc-head2 {
    clear: both;
    margin-top: 50px;
    }
    body {
    font-family: 'Poppins', sans-serif;
    margin: 2rem 4rem;
    color: rgba(55, 65, 105, 1);
    }

    header {
    display: flex;
    flex-direction: column;
    }

    .doc-logo {
    width: 400px;
    margin-top: -2rem;
    margin-left: -4rem;
    margin-bottom: 3rem;
    }
    .doc-title {
    margin-bottom: .5rem;
    font-weight: 500;
    letter-spacing: -1px;
    color: rgba(55, 65, 105, .2);
    }
    .doc-desc {
    color: rgba(55, 65, 105, .6);
    text-transform: uppercase;
    letter-spacing: 1px;
    }
    .doc-table:first-of-type {
    margin-bottom: 1rem;
    }
    .doc-table {
    width: 100%;
    margin-top: 2rem;
    margin-bottom: 2rem;
    }
    .doc-table td+td {
    /* width: 50%; */
    }
    .doc-table td+td {
    text-align: right;
    }

    .doc-table thead td {
    color: rgba(55, 65, 105, .6);
    font-size: .9rem;
    }
    .doc-table tbody tr+tr td {
    color: rgba(55, 65, 105, .6);

    padding: 1rem 0 0rem 1.2rem;
    font-size: .9rem;
    }
    .doc-table tbody tr:first-of-type td:first-of-type {
    font-weight: 600;
    border-left: 4px solid white;
    padding-left: 1rem;
    box-sizing: border-box;
    color: rgba(55, 65, 105, 1);
    font-size: 1.2rem;
    text-transform: uppercase;
    letter-spacing: -1px;
    border-radius: 3px;
    }
    .doc-table tbody tr:first-of-type td {
    font-weight: 600;
    font-size: 1.2rem;
    }
    .doc-table tfoot tr td { font-weight: 700; font-size: 1.6rem; color: #00BBFF !important; }
    .gros-oeuvre {color: #212D59 !important; border-color: #212D59 !important;}   
    .second-oeuvre {color: #E97956 !important; border-color: #E97956 !important;}
    .lots-techniques {color: #E15F6C !important; border-color: #E15F6C !important;}
    .finitions {color: #C69C6D !important; border-color: #C69C6D !important;}

    </style>
