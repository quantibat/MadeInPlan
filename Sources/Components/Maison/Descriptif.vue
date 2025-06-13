<template>
    <el-row>
        <h2 class="section-description">Tout pour faire le choix de mes équipements</h2>
        <el-row type="flex" :gutter="64" align="top" class="descriptif-questions">
                <el-col :md="6" :lg="5" :xl="4" class="hidden-sm-and-down">

                    <div class="el-menu-vertical">
                        <div v-for="category in categories" :class="(selectedQuestionType === category.type)?`menu-item ${category.type}  is-active`:`menu-item ${category.type}`" @click="changeSelectedQuestionType(category.type)">
                            <div class="category">{{ category.name }}</div>
                        </div>
                    </div>
                </el-col>

            <el-col :lg="11" :xl="11" class="descriptif-question">
                <div v-for="question in questions" class="descriptif-question-detail" v-if="question.category === selectedQuestionType">
                    <h3>{{ question.title }}</h3>
                    <p>{{ question.subtitle }}</p>
                    <multi-button
                        v-if="question.type === 'multibutton'"
                        :multi="question.multipleAnswer"
                        :selected="results[question.resultName]"
                        :crowded="question.crowded"
                        :select="(answer) => selectAnswer(answer, question.resultName)"
                        :answers="question.answers"
                        :requireValidation="false" />
                </div>
            </el-col>
            <nav class="recap-container aside">
                <h3>Récapitulatif</h3>
                <ul id="pieces-container" style="overflow: auto; flex: 1;" v-if="selectedQuestionType">
                    <li v-for="(answer, index) in computedResult" :key="index" v-if="selectedQuestionType === answer.type">
                             <i class="el-icon-check"> </i> <span style="width: 90%;display: inline-block;vertical-align: top;">{{answer.result}}</span>
                    </li>
                </ul>
            </nav>
         </el-row>
    </el-row>
</template>

<script>
import TileForm from './../Form/TileForm.vue'
import IconButtonForm from './../Form/IconButtonForm.vue'
import MultiButtonForm from './../Form/MultiButtonForm.vue'

export default {
    name: 'Descriptif',
    components: {
        'tile-form': TileForm,
        'icon-button': IconButtonForm,
        'multi-button': MultiButtonForm
    },
    mounted() {
    },
    computed: {
        computedResult: function() {
            let recap = [];
            for (var i=0; i<this.questions.length;i++) {
                const question = this.questions[i];
                if (question.type === 'range') {
                    if (this.results[question.resultName][0] !== question.options.minRange || this.results[question.resultName][1] !== question.options.maxRange)
                        recap.push(question.options.answerPreffix + ' ' + this.results[question.resultName][0] + '-' + this.results[question.resultName][1] + ' ' + question.options.answerSuffix);
                } else if (question.type === 'text') {
                    if (this.currentQuestion > i)
                        recap.push((this.results[question.resultName] === '')?'Champ vide':'Champ rempli');
                } else {
                    if (question.multipleAnswer && this.results[question.resultName].length > 0) {
                        var addedResult = question.options.answerPreffix;
                        for (var x=0; x < this.results[question.resultName].length; x++) {
                            if (x === this.results[question.resultName].length - 1)
                                addedResult += this.results[question.resultName][x].answer;
                            else
                                addedResult += (this.results[question.resultName][x].answer + question.options.answerSeparator);
                        }
                        recap.push({result: addedResult, type: question.category});
                    }
                    else if (!question.multipleAnswer && this.results[question.resultName] !== null)
                        recap.push({result: question.options.answerPreffix + this.results[question.resultName].answer, type: question.category});
                }
            }
            return recap;
        }
    },
    data() {
        return {
            results: {
                outdoorWall: null,
                floorType: null,
                crawlspaceSize: null,
                ceilingSize: null,
                indoorOpeningType: null,
                indoorMaterial: null,
                indoorModel: null,
                energyType: null,
                eaterType: null,
                mainEaterType: null,
                hotWaterProduction: null,
                ventilationType: null,
                charpenteType: null,
                tuileType: null,
                toitureShape: null,
                combleType: null,
                gouttieresMateriaux: null,
                gouttieresType: null,
                enduisType: null,
                enduisColor: null,
                assainissementType: null,
                outdoorMateriaux: null,
                outdoorColor: null,
                outdoorVitrageType: null,
                outdoorVolets: null,
                outdoorSeuilFenetre: null,
                porteEntreeMateriaux: null,
                porteEntreeType: null,
                salleDeBainEquipement: null,
                clotureType: null,
                clotureMateriaux: null,
                cuisineType: null,
                cuisineShape: null,
                cuisineMateriaux: null
            },
            selectedQuestionType: 'mode-constructif',
            questions: [{
                category: 'mode-constructif',
                type: 'multibutton',
                title: 'Murs extérieurs – Élévations',
                subtitle: 'Quel mode constructif souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'outdoorWall',
                answers: [{
                    name: 'Parpaings',
                    answer: 'Parpaings'
                }, {
                    name: 'Brique',
                    answer: 'Brique'
                }, {
                    name: 'Bois',
                    answer: 'Bois'
                }, {
                    name: 'Ossature bois',
                    answer: 'Ossature bois'
                }, {
                    name: 'Ossature métallique',
                    answer: 'Ossature métallique'
                }],
                options: {
                    answerPreffix: 'Murs Extérieurs : ',
                }                
            }, {
                category: 'mode-constructif',
                type: 'multibutton',
                title: 'Type de plancher',
                subtitle: 'Avez-vous une préférence en matière de type de plancher ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'floorType',
                answers: [{
                    name: 'Vide sanitaire',
                    answer: 'Vide sanitaire'
                }, {
                    name: 'Dalle pleine',
                    answer: 'Dalle pleine'
                }],
                options: {
                    answerPreffix: 'Type de plancher : ',
                }                
            }, {
                category: 'mode-constructif',
                type: 'multibutton',
                title: 'Hauteur du vide sanitaire',
                subtitle: 'Quelle est la hauteur idéale pour votre vide sanitaire ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'crawlspaceSize',
                answers: [{
                    name: '40 cm',
                    answer: '40 cm'
                }, {
                    name: '60 cm',
                    answer: '60 cm'
                }, {
                    name: '80 cm',
                    answer: '80 cm'
                }],
                options: {
                    answerPreffix: 'Hauteur du vide sanitaire : '
                }                
            }, {
                category: 'mode-constructif',
                type: 'multibutton',
                title: 'Hauteur sous plafond',
                subtitle: 'Quelle est la hauteur sous-plafond idéale ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'ceilingSize',
                answers: [{
                    name: '250 cm',
                    answer: '250 cm'
                }, {
                    name: '270 cm',
                    answer: '270 cm'
                }, {
                    name: '290 cm',
                    answer: '290 cm'
                }],
                options: {
                    answerPreffix: 'Hauteur sous plafond : '
                }              
            }, {
                category: 'menuiseries-interieures',
                type: 'multibutton',
                title: 'Type d\'ouverture',
                subtitle: 'Quel type d’ouverture souhaitez-vous privilégier pour vos porte intérieures ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'indoorOpeningType',
                answers: [{
                    name: 'Battante',
                    answer: 'Battante'
                }, {
                    name: 'Coulissante à galandage',
                    answer: 'Coulissante à galandage'
                }, {
                    name: 'Pliante',
                    answer: 'Pliante'
                }, {
                    name: 'Pivotante',
                    answer: 'Pivotante'
                }], 
                options: {
                    answerPreffix: 'Type d\'ouverture intérieur : ',
                }             
            }, {
                category: 'menuiseries-interieures',
                type: 'multibutton',
                title: 'Matériaux',
                subtitle: 'Quel matériaux souhaitez-vous privilégier pour vos porte intérieures ?',                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       subtitle: 'Avez-vous une préférence en matière de type de plancher ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'indoorMaterial',
                answers: [{
                    name: 'Bois',
                    answer: 'Bois'
                }, {
                    name: 'Alu',
                    answer: 'Alu'
                }, {
                    name: 'Verre',
                    answer: 'Verre'
                }],
                options: {
                    answerPreffix: 'Matériaux : '
                }               
            }, {
                category: 'menuiseries-interieures',
                type: 'multibutton',
                title: 'Modèle',
                subtitle: 'Avez-vous une préférence en matière de portes intérieures ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'indoorModel',
                answers: [{
                    name: 'Isoplane',
                    answer: 'Isoplane'
                }, {
                    name: 'Postformée',
                    answer: 'Postformée'
                }, {
                    name: 'Affleurante',
                    answer: 'Affleurante'
                }],
                options: {
                    answerPreffix: 'Modèle : '
                }                
            }, {
                category: 'chauffage',
                type: 'multibutton',
                title: 'Type d\'énergie',
                subtitle: 'Quel type d’énergie souhaitez-vous privilégier pour votre chauffage ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'energyType',
                answers: [{
                    name: 'Solaire',
                    answer: 'Solaire'
                }, {
                    name: 'Bois',
                    answer: 'Bois'
                }, {
                    name: 'Géothermie',
                    answer: 'Géothermie'
                }, {
                    name: 'Aérothermie',
                    answer: 'Aérothermie'
                }, {
                    name: 'Gaz',
                    answer: 'Gaz'
                }, {
                    name: 'Électrique',
                    answer: 'Électrique'
                }, {
                    name: 'Fioul',
                    answer: 'Fioul'
                }],
                options: {
                    answerPreffix: 'Type d\'énergie : '
                }   
            }, {
                category: 'chauffage',
                type: 'multibutton',
                title: 'Type de chauffage',
                subtitle: 'Quel type de chauffage souhaitez-vous privilégier ?',
                multipleAnswer: false,
                resultName: 'eaterType',
                crowded: true,
                answers: [{
                    name: 'Radiateurs',
                    answer: 'Radiateurs'
                }, {
                    name: 'Gainable',
                    answer: 'Gainable'
                }, {
                    name: 'Chauffage au sol',
                    answer: 'Chauffage au sol'
                }, {
                    name: 'Plafond chauffant',
                    answer: 'Plafond chauffant'
                }, {
                    name: 'Chauffage mural',
                    answer: 'Chauffage mural'
                }],
                options: {
                    answerPreffix: 'Type de chauffage : '
                }   
            }, {
                category: 'chauffage',
                type: 'multibutton',
                title: 'Type de chauffage principal',
                subtitle: 'Quel type de chauffage principal souhaitez-vous privilégier ?',
                multipleAnswer: false,
                resultName: 'mainEaterType',
                crowded: false,
                answers: [{
                    name: 'Insert, foyer fermé avec récupérateur',
                    answer: 'Insert, foyer fermé avec récupérateur'
                }, {
                    name: 'Poêle traditionnel',
                    answer: 'Poêle traditionnel'
                }, {
                    name: 'Climatisation réversible',
                    answer: 'Climatisation réversible'
                }, {
                    name: 'Pompe à chaleur',
                    answer: 'Pompe à chaleur'
                }, {
                    name: 'Chaudière à granulés',
                    answer: 'Chaudière à granulés'
                }, {
                    name: 'Chaudière à gaz naturel',
                    answer: 'Chaudière à gaz naturel'
                }, {
                    name: 'Chaudière à fioul',
                    answer: 'Chaudière à fioul'
                }, {
                    name: 'Chaudière à condensation',
                    answer: 'Chaudière à condensation'
                }, {
                    name: 'Radiateur électrique à inertie',
                    answer: 'Radiateur électrique à inertie'
                }, {
                    name: 'Chauffe solaire à accumulation',
                    answer: 'Chauffe solaire à accumulation'
                }],
                options: {
                    answerPreffix: 'Type de chauffage principal : '
                }    
            }, {
                category: 'chauffage',
                type: 'multibutton',
                title: 'Production d’eau chaude sanitaire',
                subtitle: 'Avez-vous une préférence en matière de production d’eau chaude sanitaire ?',
                multipleAnswer: false,
                crowded: false,
                resultName: 'hotWaterProduction',
                answers: [{
                    name: 'Chauffe-eau au gaz',
                    answer: 'Chauffe-eau au gaz'
                }, {
                    name: 'Chauffe-eau Électrique',
                    answer: 'Chauffe-eau Électrique'
                }, {
                    name: 'Chauffe-eau énergie renouvelable',
                    answer: 'Chauffe-eau énergie renouvelable'
                }, {
                    name: 'Chauffe-eau thermodynamique',
                    answer: 'Chauffe-eau thermodynamique'
                }, {
                    name: 'Chauffe-eau solaire',
                    answer: 'Chauffe-eau solaire'
                }],
                options: {
                    answerPreffix: 'Eau chaude sanitaire : '
                }   
            }, {
                category: 'ventilation',
                type: 'multibutton',
                title: 'Type de ventilation',
                subtitle: 'Avez-vous une préférence en matière ventilation ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'ventilationType',
                answers: [{
                    name: 'VMC simple flux',
                    answer: 'VMC simple flux'
                }, {
                    name: 'VMC double flux',
                    answer: 'VMC double flux'
                }, {
                    name: 'VMC Gaz',
                    answer: 'VMC Gaz'
                }, {
                    name: 'VM Répartie ou Ponctuelle',
                    answer: 'VM Répartie ou Ponctuelle'
                }],
                options: {
                    answerPreffix: 'Ventilation : '
                }   
            }, {
                category: 'toiture',
                type: 'multibutton',
                title: 'Type de charpente',
                subtitle: 'Quel type de charpente souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'charpenteType',
                answers: [{
                    name: 'Traditionnelle',
                    answer: 'Traditionnelle'
                }, {
                    name: 'Fermettes industrielles',
                    answer: 'Fermettes industrielles'
                }, {
                    name: 'Toit Terrasse',
                    answer: 'Toit Terrasse'
                }],
                options: {
                    answerPreffix: 'Charpente : '
                }   
            }, {
                category: 'toiture',
                type: 'multibutton',
                title: 'Type des tuiles',
                subtitle: 'Avez-vous une préférence en matière de tuiles ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'tuileType',
                answers: [{
                    name: 'Tuile en terre cuite',
                    answer: 'Tuile en terre cuite'
                }, {
                    name: 'Ardoise',
                    answer: 'Ardoise'
                }, {
                    name: 'Zinc',
                    answer: 'Zinc'
                }, {
                    name: 'Tuile en béton',
                    answer: 'Tuile en béton'
                }, {
                    name: 'Tuile photovoltaïque',
                    answer: 'Tuile photovoltaïque'
                }, {
                    name: 'Chaume',
                    answer: 'Chaume'
                }, {
                    name: 'Brande',
                    answer: 'Brande'
                }, {
                    name: 'Pierre (Lauze)',
                    answer: 'Pierre (Lauze)'
                }],
                options: {
                    answerPreffix: 'Type des tuiles : '
                }   
            }, {
                category: 'toiture',
                type: 'multibutton',
                title: 'Forme de la toiture',
                subtitle: 'Quelle forme de toiture souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'toitureShape',
                answers: [{
                    name: 'Monopente',
                    answer: 'Monopente'
                }, {
                    name: '2 pentes',
                    answer: '2 pentes'
                }, {
                    name: '4 pentes',
                    answer: '4 pentes'
                }],
                options: {
                    answerPreffix: 'Forme de la toiture : '
                }   
            }, {
                category: 'toiture',
                type: 'multibutton',
                title: 'Combles',
                subtitle: 'Avez-vous une préférence en matière de combles ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'combleType',
                answers: [{
                    name: 'Combles perdus',
                    answer: 'Combles perdus'
                }, {
                    name: 'Combles aménageables',
                    answer: 'Combles aménageables'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'gouttieres',
                type: 'multibutton',
                title: 'Matériaux',
                subtitle: 'Quel matériaux souhaitez-vous privilégier pour vos gouttières ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'gouttieresMateriaux',
                answers: [{
                    name: 'Zinc',
                    answer: 'Zinc'
                }, {
                    name: 'Cuivre',
                    answer: 'Cuivre'
                }, {
                    name: 'Fonte',
                    answer: 'Fonte'
                }, {
                    name: 'Alu laqué',
                    answer: 'Alu laqué'
                }, {
                    name: 'PVC',
                    answer: 'PVC'
                }],
                options: {
                    answerPreffix: 'Gouttières en '
                }   
            }, {
                category: 'gouttieres',
                type: 'multibutton',
                title: 'Type',
                subtitle: 'Quel type de gouttières souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'gouttieresType',
                answers: [{
                    name: 'Gouttière pendante',
                    answer: 'Gouttière pendante'
                }, {
                    name: 'Gouttière Laval',
                    answer: 'Gouttière Laval'
                }, {
                    name: 'Gouttière anglaise',
                    answer: 'Gouttière anglaise'
                }, {
                    name: 'Gouttière havraise',
                    answer: 'Gouttière havraise'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'menuiseries-exterieures',
                type: 'multibutton',
                title: 'Matériaux',
                subtitle: 'Quel matériaux souhaitez-vous privilégier pour vos fenêtres et baies vitrées ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'outdoorMateriaux',
                answers: [{
                    name: 'Bois',
                    answer: 'Bois'
                }, {
                    name: 'PVC',
                    answer: 'PVC'
                }, {
                    name: 'Alu',
                    answer: 'Alu'
                }],
                options: {
                    answerPreffix: 'Matériaux : '
                }   
            }, {
                category: 'menuiseries-exterieures',
                type: 'multibutton',
                title: 'Couleur',
                subtitle: 'Quelle couleur souhaitez-vous privilégier pour vos fenêtres et baies vitrées ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'outdoorColor',
                answers: [{
                    name: 'Blanc',
                    answer: 'Blanc'
                }, {
                    name: 'Anthracite',
                    answer: 'Anthracite'
                }, {
                    name: 'Autre',
                    answer: 'Autre'
                }],
                options: {
                    answerPreffix: 'Couleur : '
                }   
            }, {
                category: 'menuiseries-exterieures',
                type: 'multibutton',
                title: 'Types de vitrage',
                subtitle: 'Avez-vous une préférence en matière de vitrage ?',
                multipleAnswer: false,
                crowded: false,
                resultName: 'outdoorVitrageType',
                answers: [{
                    name: 'Double vitrage standard',
                    answer: 'Double vitrage standard'
                }, {
                    name: 'Double vitrage faiblement émissif',
                    answer: 'Double vitrage faiblement émissif'
                }, {
                    name: 'Double vitrage faiblement émissif renforcé à lame argon',
                    answer: 'Double vitrage faiblement émissif renforcé à lame argon'
                }, {
                    name: 'Vitrage Chauffant',
                    answer: 'Vitrage Chauffant'
                }, {
                    name: 'Vitrage anti-réfléchissant',
                    answer: 'Vitrage anti-réfléchissant'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'menuiseries-exterieures',
                type: 'multibutton',
                title: 'Volets',
                subtitle: 'Quel type de volets souhaitez vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'outdoorVolets',
                answers: [{
                    name: 'Volets roulants',
                    answer: 'Volets roulants'
                }, {
                    name: 'Volets battants',
                    answer: 'Volets battants'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'menuiseries-exterieures',
                type: 'multibutton',
                title: 'Seuil de fenêtres et porte-fenêtre',
                subtitle: 'Quel type de seuils souhaitez vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'outdoorSeuilFenetre',
                answers: [{
                    name: 'Maçonnées/Rejingot',
                    answer: 'Maçonnées/Rejingot'
                }, {
                    name: 'Intégré',
                    answer: 'Intégré'
                }, {
                    name: 'Rapporté',
                    answer: 'Rapporté'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'enduis',
                type: 'multibutton',
                title: 'Type de finition',
                subtitle: 'Quel type de finition souhaitez-vous privilégier pour votre façade ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'enduisType',
                answers: [{
                    name: 'Projeté',
                    answer: 'Projeté'
                }, {
                    name: 'Gratté',
                    answer: 'Gratté'
                }, {
                    name: 'Taloché',
                    answer: 'Taloché'
                }, {
                    name: 'Lissé',
                    answer: 'Lissé'
                }, {
                    name: 'Ribé',
                    answer: 'Ribé'
                }],
                options: {
                    answerPreffix: 'Finition : '
                }   
            }, {
                category: 'enduis',
                type: 'multibutton',
                title: 'Couleur',
                subtitle: 'Quelle couleur souhaitez-vous privilégier pour votre façade ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'enduisColor',
                answers: [{
                    name: 'Ton clair',
                    answer: 'Ton clair'
                }, {
                    name: 'Ton foncé',
                    answer: 'Ton foncé'
                }],
                options: {
                    answerPreffix: 'Couleur : '
                }   
            }, {
                category: 'assainissement',
                type: 'multibutton',
                title: 'Type',
                subtitle: 'Quel type d’assainissement est nécessaire pour votre future maison ?',
                multipleAnswer: false,
                crowded: false,
                resultName: 'assainissementType',
                answers: [{
                    name: 'Assainissement collectif/Tout à l’égout',
                    answer: 'Assainissement collectif/Tout à l’égout'
                }, {
                    name: 'Assainissement non-collectif/Fosse septique',
                    answer: 'Assainissement non-collectif/Fosse septique'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'porte-dentree',
                type: 'multibutton',
                title: 'Matériaux',
                subtitle: 'Avez-vous une préférence en matière de matériaux ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'porteEntreeMateriaux',
                answers: [{
                    name: 'Bois',
                    answer: 'Bois'
                }, {
                    name: 'PVC',
                    answer: 'PVC'
                }, {
                    name: 'Alu',
                    answer: 'Alu'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'porte-dentree',
                type: 'multibutton',
                title: 'Type',
                subtitle: 'Quel type de porte d’entrée souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'porteEntreeType',
                answers: [{
                    name: 'Porte pleine',
                    answer: 'Porte pleine'
                }, {
                    name: 'Porte semi-vitrée',
                    answer: 'Porte semi-vitrée'
                }, {
                    name: 'Porte vitrée',
                    answer: 'Porte vitrée'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'salle-de-bain',
                type: 'multibutton',
                title: 'Équipement',
                subtitle: 'Avez-vous une préférence en matière d’équipements pour la salle de bain ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'salleDeBainEquipement',
                answers: [{
                    name: '1 vasque',
                    answer: '1 vasque'
                }, {
                    name: '2 vasques',
                    answer: '2 vasques'
                }, {
                    name: 'Baignoire',
                    answer: 'Baignoire'
                }, {
                    name: 'Douche italienne',
                    answer: 'Douche italienne'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'cloture',
                type: 'multibutton',
                title: 'Type de clôture',
                subtitle: 'Quel type de clôture souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'clotureType',
                answers: [{
                    name: 'Clôture traditionelle',
                    answer: 'Clôture traditionelle'
                }, {
                    name: 'Brise vue',
                    answer: 'Brise vue'
                }, {
                    name: 'Palissade',
                    answer: 'Palissade'
                }, {
                    name: 'Muret simple',
                    answer: 'Muret simple'
                }, {
                    name: 'Muret + Brise vue',
                    answer: 'Muret + Brise vue'
                }, {
                    name: 'Gabion',
                    answer: 'Gabion'
                }, {
                    name: 'Grillage',
                    answer: 'Grillage'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'cloture',
                type: 'multibutton',
                title: 'Matériaux',
                subtitle: 'Quel type de matériaux souhaitez-vous privilégier pour votre clôture ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'clotureMateriaux',
                answers: [{
                    name: 'Béton',
                    answer: 'Béton'
                }, {
                    name: 'Bois',
                    answer: 'Bois'
                }, {
                    name: 'PVC',
                    answer: 'PVC'
                }, {
                    name: 'Alu',
                    answer: 'Alu'
                }, {
                    name: 'Fer forgé',
                    answer: 'Fer forgé'
                }, {
                    name: 'Pierre',
                    answer: 'Pierre'
                }, {
                    name: 'Haie végétale',
                    answer: 'Haie végétale'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'cuisine',
                type: 'multibutton',
                title: 'Type de cuisine',
                subtitle: 'Quel type de cuisine souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'cuisineType',
                answers: [{
                    name: 'Standard',
                    answer: 'Standard'
                }, {
                    name: 'Sur-mesure',
                    answer: 'Sur-mesure'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'cuisine',
                type: 'multibutton',
                title: 'Forme',
                subtitle: 'Quelle forme de cuisine souhaitez-vous privilégier ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'cuisineShape',
                answers: [{
                    name: 'Linéaire',
                    answer: 'Linéaire'
                }, {
                    name: 'Angle',
                    answer: 'Angle'
                }, {
                    name: 'Îlot central',
                    answer: 'Îlot central'
                }, {
                    name: 'U',
                    answer: 'U'
                }, {
                    name: 'Parallèle',
                    answer: 'Parallèle'
                }],
                options: {
                    answerPreffix: ''
                }   
            }, {
                category: 'cuisine',
                type: 'multibutton',
                title: 'Matériaux',
                subtitle: 'Quel matériaux souhaitez-vous privilégier pour votre cuisine ?',
                multipleAnswer: false,
                crowded: true,
                resultName: 'cuisineMateriaux',
                answers: [{
                    name: 'Bois',
                    answer: 'Bois'
                }, {
                    name: 'Stratifié',
                    answer: 'Stratifié'
                }, {
                    name: 'Laque',
                    answer: 'Laque'
                }, {
                    name: 'Inox',
                    answer: 'Inox'
                }],
                options: {
                    answerPreffix: ''
                }   
            }
        ],
            categories: [{
                    name: 'Mode constructif',
                    type: 'mode-constructif'
                }, { 
                    name: 'Toiture',
                    type: 'toiture'
                }, {
                    name: 'Clôture',
                    type: 'cloture'
                }, {
                    name: 'Menuiseries extérieures',
                    type: 'menuiseries-exterieures'
                }, { 
                    name: 'Gouttières',
                    type: 'gouttieres'
                }, { 
                    name: 'Enduis',
                    type: 'enduis'
                }, { 
                    name: 'Assainissement',
                    type: 'assainissement'
                }, { 
                    name: 'Porte d\'entrée',
                    type: 'porte-dentree'
                }, { 
                    name: 'Menuiseries intérieures',
                    type: 'menuiseries-interieures'
                }, { 
                    name: 'Chauffage',
                    type: 'chauffage'
                }, { 
                    name: 'Ventilation',
                    type: 'ventilation'
                }, { 
                    name: 'Salle de bain',
                    type: 'salle-de-bain'
                }, { 
                    name: 'Cuisine',
                    type: 'cuisine'
                }/*, { 
                    name: 'Éclairage',
                    type: 'eclairage'
                }, { 
                    name: 'Domotique',
                    type: 'domotique'
                }*/]
        }
    },
    created() {
        this.$http.get(this.$root.URL + '/form/get?name=description').then(res => {
            this.fillForm(res.data.result);
        }, err => {
            this.fillForm();
        });
    },
    methods: {
        fillForm(base) {
            const basis = {
                outdoorWall: null,
                floorType: null,
                crawlspaceSize: null,
                ceilingSize: null,
                indoorOpeningType: null,
                indoorMaterial: null,
                indoorModel: null,
                energyType: null,
                eaterType: null,
                mainEaterType: null,
                hotWaterProduction: null,
                ventilationType: null,
                charpenteType: null,
                tuileType: null,
                toitureShape: null,
                combleType: null,
                gouttieresMateriaux: null,
                gouttieresType: null,
                enduisType: null,
                enduisColor: null,
                assainissementType: null,
                outdoorMateriaux: null,
                outdoorColor: null,
                outdoorVitrageType: null,
                outdoorVolets: null,
                outdoorSeuilFenetre: null,
                porteEntreeMateriaux: null,
                porteEntreeType: null,
                salleDeBainEquipement: null,
                clotureType: null,
                clotureMateriaux: null,
                cuisineType: null,
                cuisineShape: null,
                cuisineMateriaux: null
            };
            this.results = basis;
            for (var key in base)
                this.results[key] = base[key];
            console.log(base);
        },
        changeSelectedQuestionType(newQuestionType) {
            this.selectedQuestionType = newQuestionType;
        },
        selectAnswer(answer, field,) {
            this.results[field] = answer;
            this.$http.post(this.$root.URL + '/form/save?name=description', this.results).then(res => {
                this.results = res.data.result;
            });
        },
    }
}
</script>

<style scoped>


.recap-container {
    width: 390px;
    /* margin-right: 5%; */
    margin-left: 1.5vw;
    overflow: auto;
    max-height: 50vh;
    border-radius: 7px;
    padding: 2rem 2rem;
    animation: float 2.5s ease-in-out infinite;
    display: flex;
    flex-direction: column;
    /* align-items: center; */
    position: relative;
    overflow-x: hidden;
}
.recap-container::after {
    /* content: url(../../Assets/bg-plans.svg);
    position: absolute;
    top: -2rem;
    right: -2rem;
    width: 50%;
    opacity: .05; */
}

.recap-container h3::after {
    display: inline-block;
    content: '';
    width: 25px;
    /* margin: auto; */
    height: 3px;
    background: #00BBFF;
    border-radius: 500px;
    position: absolute;
    bottom: 0;
    left: 34.5%;
}
.recap-container.full ul { font-size: 1rem; }
.recap-container ul {
    width: auto;
    list-style: none;
    padding: 0 1.4rem;
    color: rgba(33, 45, 89, .8);
    font-size: .85rem;
    height: 75%;
}
.recap-container i {
    color: #2ECC71;
    padding-right: .2rem;
}
.recap-container li {
    transition: all .4s linear;
    padding-bottom: .5em;
}

.section-description {
    margin: 0;
    margin-top: 0rem;
    font-weight: 400;
    color: #212D59;
    opacity: .5;
    font-size: 1rem;
}

.descriptif-questions {
    margin-top: 2rem;
    color: #212D59;
    flex-wrap: wrap;
}

.descriptif-questions h3 {
    font-weight: 500;
    font-size: 1rem;
    margin: 0;
    /* margin-left: 2rem; */
}

.descriptif-questions p {
    margin: 0;
    opacity: .5;
    font-size: .9rem;
    font-weight: 300;
    margin-bottom: -1.5rem;
    margin-bottom: -2.5rem;
    /* margin-left: 2rem; */
}

.descriptif-question {
    margin-bottom: 1.5rem;
}

.help {
    margin-left: .5rem !important;
    top: -5px !important;
    display: none;
}

/*
##Device = Tablets, Ipads (portrait)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {

    .recap-container {
        margin-right: 0rem;
    }

    .recap-container.aside {
        width: 250px;
        margin-right: 2rem;
    }

}

/*
##Device = Tablets, Ipads (landscape)
##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {

    .recap-container {
        margin-right: 0rem;
    }

    .recap-container.aside {
        width: 500px;
    }

}



 .menu-title {
    text-transform: uppercase;
    color: #212D59;
    letter-spacing: 1px;
    margin-bottom: .5rem;
}

.el-menu-vertical {
    /* margin-left: 10px; */
    border-right: none;
}


.menu-item {
        display: flex;
        padding: .3rem 0 .3rem 1rem;
       /* justify-content: center; */
        color: rgba(33, 45, 89, 1);
        border-left: 3px solid currentColor;
        /* border-bottom: 1px solid rgba(33, 45, 89, .05); */
        font-size: 0.9rem;
        cursor: pointer;
        margin-bottom: .8rem;
        border-radius: 2px;
        font-weight: 500;
        transition: all linear 100ms;
    }

.menu-item:hover, .menu-item.is-active {
    transition: all linear 150ms;
    border-radius: 4px;
    color: #fff;
}

.mode-constructif {
    border-color:#945200;
}
.mode-constructif:hover, .mode-constructif.is-active {
    background: #945200;
    background: linear-gradient(to left, #B98C65, #945200);
}

.menuiseries-exterieures {
    border-color:#929292;
}
.menuiseries-exterieures:hover, .menuiseries-exterieures.is-active {
    background:#929292;
    background: linear-gradient(to left, rgb(208, 207, 213), #929292);
}

.menuiseries-interieures {
    border-color:#9fc1e8;
}
.menuiseries-interieures:hover, .menuiseries-interieures.is-active  {
    background:#9fc1e8;
    /* background: linear-gradient(to right, #7A81FF, #008BFC); */
    background-image: linear-gradient(to right, #9fc1e8 0%, #bdd6f9 100%);
}

.porte-dentree {
    border-color:#D783FF;
}
.porte-dentree:hover, .porte-dentree.is-active {
    background:#D783FF;
    background: linear-gradient(to right, #D783FF, #FF89A3);
}

.chauffage {
    border-color:#FF7E79;
}
.chauffage:hover, .chauffage.is-active {
    background:#FF7E79;
    background: linear-gradient(to right, #FF7E79, #DB6D92);
}

.ventilation {
    border-color:#55E6C1;
}
.ventilation:hover, .ventilation.is-active {
    background:#55E6C1;
    background: linear-gradient(to right, #55E6C1, #2CC5BA);
}

.cuisine {
    border-color:#7A81FF;
}
.cuisine:hover, .cuisine.is-active {
    background:#7A81FF;
    background: linear-gradient(to right, #7A81FF, #008BFC);
}

.salle-de-bain {
    border-color:#4FB9F9;
}
.salle-de-bain:hover, .salle-de-bain.is-active {
    background:#4FB9F9;
    background: linear-gradient(to right, #4FB9F9, #00D0F9);
}

.toiture {
    border-color:#FF9300;
}
.toiture:hover, .toiture.is-active {
    background:#FF9300;
    background: linear-gradient(to right, #FF9300, #FF635C);
}

.cloture {
    border-color:#CF5B01;
}
.cloture:hover, .cloture.is-active {
    background:#CF5B01;
    background: linear-gradient(to right, #CF5B01, #CE3C4D);
}

.gouttieres {
    border-color:#477EB0;
}
.gouttieres:hover, .gouttieres.is-active {
    background:#477EB0;
    background: linear-gradient(to right, #477EB0, #009EC6);
}

.enduis {
    border-color:#FECA57;
}
.enduis:hover, .enduis.is-active {
    background:#FECA57;
    background: linear-gradient(to right, #FECA57, #FFC190);
}

.assainissement {
    border-color:#82CBDD;
}
.assainissement:hover, .assainissement.is-active {
    background:#82CBDD;
    background: linear-gradient(to right, #82CBDD, #6DDBDC);
}

.eclairage {
    border-color:#FECA57;
}
.eclairage:hover, .eclairage.is-active {
    background:#FECA57;
}

.domotique {
    border-color:#FF8AD8;
}
.domotique:hover, .domotique.is-active {
    background:#FF8AD8;
}






.descriptif-question-detail {
    margin-bottom: 1rem;
}

.recap-container h3 {
    color: rgba(33, 45, 89, .9);
    font-weight: 500;
    text-align: center;
    font-size: 1.2rem;
    display: inline-block;
    position: relative;
    margin-bottom: 0;
}


</style>
