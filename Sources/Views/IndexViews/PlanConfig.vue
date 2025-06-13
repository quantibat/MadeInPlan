<template>
    <div v-loading="loading" style="position: relative;">
            <el-row type="flex" align="bottom" class="header">
        <h1>Mes plans</h1>
    </el-row>
        <template-form name="PlanConfig" button-message="Configurer mon plan" :questions="questions" :recap="recap" @done="handleDone"/>
    </div>
</template>

<script>
import TemplateForm from '../../Components/Form/IntegratedTemplateForm.vue' // il va ce servir de ce fichier pour l'affichage (peut être ici qu'il faut voir)
export default {
    name: 'PlanConfig',
    components: {
        'template-form': TemplateForm,
    },
    data() {
        return {
            isStarted: false,
            currentQuestion: 0,
            questions: [
                {
                    type: 'iconbutton',
                    multipleAnswer: true,
                    resultName: 'shapes',
                    baseResult: [],
                    title: 'Forme de la maison',
                    subtitle: "Quelle(s) forme(s) souhaitez-vous idéalement pour votre maison ? Plusieurs réponses possibles…",
                    isRequired: true,
                    answers: [{
                        repeat: 1,
                        name: 'Rectangle',
                        imgUrl: '/Assets/Configurator/maison-rectangle.svg',
                        firstAnswer: "de forme rectangulaire",
                        answer: "rectangulaire"
                    },{
                        repeat: 1,
                        name: 'L',
                        imgUrl: '/Assets/Configurator/maison-L.svg',
                        firstAnswer: "en L",
                        answer: "en L"
                    }],
                    options: {
                        answerPreffix: 'Maison',
                        answerSeparator: " ou "
                    }
                }, {
                    type: 'range',
                    multipleAnswer: false,
                    resultName: 'squareMeterRange',
                    baseResult: [0, 200],
                    title: 'Surface de la maison',
                    subtitle: 'La surface habitable idéale pour vous, <b>sans le garage</b>',
                    isRequired: true,
                    options: {
                        maxRange: 200,
                        minRange: 0,
                        stepSize: 5,
                        answerPreffix: 'Surface de',
                        answerSuffix: 'm2'
                    }
                }, {
                    type: 'multibutton',
                    multipleAnswer: false,
                    resultName: 'floorNumbers',
                    baseResult: null,
                    title: 'Nombre d\'étages',
                    subtitle: 'Souhaitez-vous une maison avec un étage et/ou avec un sous-sol ?',
                    isRequired: true,
                    answers: [{
                        name: '1 étage (R + 1)',
                        answer: "1 étage (R + 1)"
                    },
                    {
                        name: 'Plain-Pied',
                        answer: "Plain-Pied"
                    },
                    {
                        name: 'Sous-Sol',
                        answer: "Sous-Sol"
                    }],
                    options: {
                        answerPreffix: 'Et',
                        answerSeparator: ", "
                        // answerSuffix: 'pièces supplémentaires'
                    }
                },{
                    type: 'iconbutton',
                    multipleAnswer: false,
                    resultName: 'bedroomsNumber',
                    baseResult: null,
                    title: 'Nombre de chambres',
                    subtitle: "De combien de chambres avez-vous besoin,<b> y compris la suite parentale et la chambre d’amis</b>",
                    isRequired: true,
                    answers: [{
                        repeat: 1,
                        name: 'Une',
                        answer: "Vous avez besoin d'une chambre",
                        imgUrl: '/Assets/Plans/lit.svg'
                    },{
                        repeat: 2,
                        answer: 'Avec deux chambres',
                        name: 'Deux',
                        imgUrl: '/Assets/Plans/lit.svg'
                    },{
                        repeat: 3,
                        answer: 'Avec trois chambres',
                        name: 'Trois',
                        imgUrl: '/Assets/Plans/lit.svg'
                    },{
                        repeat: 4,
                        answer: 'Avec quatre chambres',
                        name: 'Quatre',
                        imgUrl: '/Assets/Plans/lit.svg'
                    },{
                        repeat: 5,
                        answer: 'Avec cinq chambres',
                        name: 'Cinq',
                        imgUrl: '/Assets/Plans/lit.svg'
                    }],
                    options: {
                        answerPreffix: 'Avec',
                        answerSuffix: 'chambres'
                    }
                }, {
                    type: 'multibutton',
                    multipleAnswer: true,
                    resultName: 'aditionalRooms1',
                    baseResult: null,
                    title: 'Quelles sont les pièces dont vous avez besoin ?',
                    isRequired: false,
                    answers: [{
                        name: 'Garage',
                        answer: "un garage"
                    },
                    {
                        name: 'Cellier',
                        answer: "un cellier"
                    },
                    {
                        name: 'Buanderie',
                        answer: "une buanderie"
                    }, {
                        name: 'Suite parentale',
                        answer: "une suite parentale",
                        tooltip: "La suite parentale comprend un dressing et une salle de bain privative",
                    }, {
                        name: "2ème Salle de bain",
                        answer: "une 2ème salle de bain",
                        tooltip: "Une 2ème salle de bain non-privative"
                    },
                    {
                        name: "2ème WC",
                        answer: "un 2ème WC",
                        tooltip: "Un 2ème WC non-privatif"
                    }],
                    options: {
                        answerPreffix: 'Et',
                        answerSeparator: ", "
                        // answerSuffix: 'pièces supplémentaires'
                    }
                }, {
                    type: 'range',
                    multipleAnswer: false,
                    resultName: 'budgetRange',
                    baseResult: [0, 400],
                    title: 'Votre budget',
                    subtitle: 'De quel budget disposez vous pour construire votre future maison, <b>sans le terrain</b>',
                    isRequired: true,
                    options: {
                        suffix: "k€",
                        maxRange: 400,
                        minRange: 0,
                        stepSize: 5,
                        answerPreffix: 'Pour un budget construction de ',
                        answerSuffix: 'k€'
                    }
                }, {
                    type: "text",
                    baseResult: null,
                    title: "Avez-vous des remarques et précisions supplémentaires à exprimer ?",
                    subtitle: "Vous pouvez ici préciser : l’orientation, le nombre d’étages, les placards, une cuisine ouverte, une suite parentale dans la zone jour… 😉",
                    resultName: 'comments',
                    isRequired: false,
                    multipleAnswer: false,
                    options: {
                        placeholder: 'Vos commentaires'
                    }
                }
            ],
            recap: {
                name: 'Configuration'
            },
            loading: false
        }
    },
    created() {
        if (this.currentQuestion === 0) this.isStarted = false;
        if (this.currentQuestion != 0) this.isStarted = true;
    },
    methods: {
        handleDone(data) {
            this.loading = true;
            this.$http.get(this.$root.URL + '/planConfigurator/get').then(res => {
                const advOptions = {
                    0: res.data.configurations[0].enabled,
                    1: res.data.configurations[1].enabled,
                    2: res.data.configurations[2].enabled,
                    3: res.data.configurations[3].enabled,
                    4: res.data.configurations[4].enabled,
                    5: res.data.configurations[5].enabled,
                };
                var formData = {
                    shape: this.getShape(data.shapes),
                    nbBedroom: Number(data.bedroomsNumber.repeat),
                    surface: {
                        min: Number(data.squareMeterRange[0]),
                        max: Number(data.squareMeterRange[1])
                    },
                    prix: {
                        min: Number(data.budgetRange[0]) * 1000,
                        max: Number(data.budgetRange[1]) * 1000
                    },
                    options: {
                        placard: data.aditionalRooms1.findIndex(item => item.name == 'Placard') !== -1,
                        cellier: data.aditionalRooms1.findIndex(item => item.name == 'Cellier') !== -1,
                        suite: data.aditionalRooms1.findIndex(item => item.name == 'Suite parentale') !== -1,
                        buandrie: data.aditionalRooms1.findIndex(item => item.name == 'Buanderie') !== -1,
                        garage: data.aditionalRooms1.findIndex(item => item.name == 'Garage') !== -1,
                        SDB: data.aditionalRooms1.findIndex(item => item.name == '2ème Salle de bain') !== -1,
                        WC: data.aditionalRooms1.findIndex(item => item.name == '2ème WC') !== -1,
                        hall: true
                    },
                    advOptions
                };
                this.$http.post(this.$root.CALC_ADDR + '/plan', formData).then(res => {
                    this.loading = false;
                    if (res.data.ok == false) {
                        this.$message.error('Nous n\'avons pas trouver de plan pour cette configuration');
                    } else {
                        if (res.data.nb == 1) {
                            this.$router.push({ name: 'PlanDrawer', params: { id: res.data.id } });
                        } else {
                            var plans = res.data.plans;
                            var unique_plan = [];

                            for (var i = 0; i < plans.length; i++) {
                                if (unique_plan.indexOf(plans[i]) == -1) unique_plan.push(plans[i]);
                                else plans.splice(i, 1);
                            }

                            var first = unique_plan.shift();
                            this.$router.push({ name: 'PlanDrawer', params: { id: first, ids: unique_plan } });
                        }
                    }
                }, (err) => {
                    this.loading = false;
                    this.$message.error('Nous n\'avons pas trouver de plan pour cette configuration');
                });
            });
        },
        getShape(shapes) {
            var array = [];
            for (var i = 0; i < shapes.length; i++) {
                if (shapes[i].name == 'L') array.push('L');
                if (shapes[i].name == 'Carré') array.push('square');
                if (shapes[i].name == 'Rectangle') array.push('rectangle');
            }
            return array[Math.floor(Math.random() * array.length)];
        }
    }
}
</script>

<style scoped>
</style>
