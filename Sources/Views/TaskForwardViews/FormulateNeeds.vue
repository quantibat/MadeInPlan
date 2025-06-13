<template>
   <div>
       <template-form name="FormulateNeeds" :questions="questions" :recap="recap" />
   </div>
</template>

<script>
import TemplateForm from '../../Components/TemplateForm.vue'
export default {
    name: 'FormulateNeeds',
    components: {
        'template-form': TemplateForm,
    },
    data() {
        return {
            'currentQuestion': 0,
            'questions': [{
                type: 'multibutton',
                multipleAnswer: false,
                resultName: 'houseStyle',
                baseResult: null,
                title: 'Quel style de maison vous plairait ?',
                isRequired: true,
                answers: [{
                    name: 'Villa provençale',
                    answer: 'Vous voulez une villa provençale'
                },{
                    name: 'Pavillon',
                    answer: 'Vous voulez un pavillon'
                },{
                    name: 'Moderne',
                    answer: 'Vous voulez une maison moderne'
                }]
            }, {
                type: 'range',
                multipleAnswer: false,
                resultName: 'squareMeterRange',
                baseResult: [0, 100],
                title: 'Quel surface habitable souhaitez-vous ?',
                isRequired: true,
                options: {
                    maxRange: 100,
                    minRange: 0,
                    stepSize: 5,
                    answerPreffix: 'Vous souhaitez une surface de',
                    answerSuffix: 'm2'
                }
            }, {
                type: 'multibutton',
                multipleAnswer: false,
                resultName: 'floors',
                baseResult: null,
                title: 'Souhaitez-vous un étage ?',
                isRequired: true,
                answers: [{
                    name: 'Oui, je le veux',
                    answer: 'Vous souhaitez un étage'
                }, {
                    name: 'Non, je m\'en fou',
                    answer: 'Vous ne souhaitez pas un étage'
                }]
            }, {
                type: 'multibutton',
                multipleAnswer: false,
                resultName: 'basement',
                baseResult: null,
                title: 'Souhaitez-vous un sous-sol ?',
                isRequired: true,
                answers: [{
                    name: 'Oui, je le veux',
                    answer: 'Vous souhaitez un sous-sol'
                }, {
                    name: 'Non, je m\'en fou',
                    answer: 'Vous ne souhaitez pas un sous-sol'
                }]
            }, {
                type: 'tile',
                multipleAnswer: true,
                resultName: 'houseShapes',
                baseResult: [],
                title: 'Avez-vous une idée de la forme souhaitée ?',
                isRequired: true,
                answers: [{
                    name: 'Carré',
                    imgUrl: '/Assets/TaskForward/baseline.png'
                },{
                    name: 'Rectangle',
                    imgUrl: '/Assets/TaskForward/baseline.png'
                },{
                    name: 'L',
                    imgUrl: '/Assets/TaskForward/baseline.png'
                }],
                options: {
                    answerPreffix: 'Vous aimeriez vivre dans',
                    answerSuffix: 'formes différentes'
                }
            }, {
                type: 'minitile',
                multipleAnswer: false,
                resultName: 'bedrooms',
                baseResult: null,
                title: 'Combien de chambres ?',
                isRequired: true,
                answers: [{
                    title: '1',
                    answer: 'Vous souhaiteriez avoir 1 chambre'
                },{
                    title: '2',
                    answer: 'Vous souhaiteriez avoir 2 chambres'
                },{
                    title: '3',
                    answer: 'Vous souhaiteriez avoir 3 chambres'
                },{
                    title: '4',
                    answer: 'Vous souhaiteriez avoir 4 chambres'
                },{
                    title: '5',
                    answer: 'Vous souhaiteriez avoir 5 chambres'
                },{
                    title: '6',
                    answer: 'Vous souhaiteriez avoir 6 chambres'
                }]
            }, {
                type: 'tile',
                multipleAnswer: true,
                resultName: 'houseOptions',
                baseResult: [],
                title: 'Quelles pièces optionnelles souhaitez-vous ?',
                isRequired: true,
                answers: [{
                        name: 'Cellier',
                        imgUrl: '/Assets/TaskForward/baseline.png'
                    },{
                        name: 'Buandrie',
                        imgUrl: '/Assets/TaskForward/baseline.png'
                    },{
                        name: 'Garage',
                        imgUrl: '/Assets/TaskForward/baseline.png'
                    }, {
                        name: 'Autre',
                        imgUrl: '/Assets/TaskForward/baseline.png'
                    }],
                options: {
                    answerPreffix: 'Vous souhaiteriez avoir',
                    answerSuffix: 'pièces optionnelles'
                }
            }, {
                type: 'text',
                multipleAnswer: false,
                resultName: 'houseAmbiance',
                baseResult: '',
                title: 'Si vous deviez décrire l\'esthétique, l\'ambiance de votre futur maison, à quoi ressemblerait-elle ?',
                isRequired: false,
                options: {
                    placeholder: 'Couleur de la façade, forme et couleur de la toiture, gouttière, portes d\'entrée, menuiseries intérieures et extérieures.'
                }
            }, {
                type: 'text',
                multipleAnswer: false,
                resultName: 'projectInfo',
                baseResult: '',
                title: 'Que pouvez-vous nous dire sur votre projet ?',
                isRequired: false,
                options: {
                    placeholder: 'Exprimez-vous'
                }
            }],
            recap: {
                name: 'RECAPITULATIF'
            }
        }
    },
}
</script>

<style scoped>
</style>