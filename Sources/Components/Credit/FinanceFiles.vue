<template id="FinanceFiles">
 <div v-if="visible" style="margin: 0; height: 100%; overflow: hidden; margin-bottom: 10rem;">
    <div v-if="answeredQuestions == 0 && !isStarted" class="start-survey" >
        <button @click="start" class="start" type="primary">Commencer le questionnaire</button>
    </div>
        <el-container>
            <el-main id="q-active" class="st-scroll">
                <div v-if="!isDone" v-for="(question, index) in questions" :key="index" class="question" :class="(currentQuestion === index)?'active':'transparent'" @click="handleQuestionClick(index)">
                    <el-row>
                        <el-col :offset="1" :span="16">
                            <h1 class="question-title"><span class="question-number">{{index + 1}} <span style="font-size: .9rem; vertical-align: middle;">→</span> </span> {{question.prompt}} </h1>
                        </el-col>
                    </el-row>
                    <el-col :offset="1">
                        <multibutton-form v-scroll-to="{duration: 900, easing: 'linear', container: '#pieces-container', el: '#scroll-me'}" :answers="question.answers" :selected="finalForm[questions[index].resultName]" :select="selectItem" />
                    </el-col>
                </div>
            </el-main>
            <nav v-if="questions.length != currentQuestion" id="pieces" class="liste-pieces aside" style="overflow: hidden;" :class="!isDone?'':'done'">
                <h3>Pièces à fournir ({{getDocuments().length}})</h3>
                <ul id="pieces-container" style="overflow: auto;">
                    <li v-for="(cDocument, index) in getDocuments()" :id="'document' + index" :key="index">
                        <i class="el-icon-check"></i> {{cDocument}}
                    </li>
                    <div id="scroll-me"></div>
                </ul>

            </nav>
            <nav v-if="questions.length == currentQuestion" id="pieces" style="overflow: hidden;" class="liste-pieces download">
                <h3>Pièces à fournir ({{getDocuments().length}})</h3>
                <ul id="pieces-container" style="overflow: auto;">
                    <li v-for="(cDocument, index) in getDocuments()" :id="'document' + index" :key="index">
                        <i class="el-icon-check"></i> {{cDocument}}
                    </li>
                    <div id="scroll-me"></div>
                </ul>
                <!-- <el-button class="pieces-download" v-if="questions.length == currentQuestion" style="width: 100%">Télécharger la liste détaillée des pièces</el-button> -->
            </nav>

             <form-footer :first-question="firstQuestion" :progress="answeredQuestions" :prev-question="previousQuestion" :next-question="nextQuestion" :current-question="currentQuestion" :total-questions="questions.length"/>
            </el-container>
</div>
    <div v-else>
        <nav v-if="answeredQuestions == questions.length" id="pieces" class="liste-pieces">
            <h3>Pièces à fournir ({{getDocuments().length}})</h3>
            <ul id="pieces-container">
                <li v-for="(cDocument, index) in getDocuments()" :id="'document' + index" :key="index">
                    <i class="el-icon-check"></i> {{cDocument}}
                </li>
                <div id="scroll-me"></div>
            </ul>
                <!-- <el-button class="pieces-download" v-if="questions.length == currentQuestion">Télécharger la liste détaillée des pièces</el-button> -->
        </nav>
        <br/>
        <el-button style="width:50%;margin:auto;" type="primary" @click="visible = true">
            
            <div v-if="currentQuestion == 0">
                Commencer le questionnaire
            </div>
            <div v-else-if="answeredQuestions == questions.length">
                Modifier le questionnaire
            </div>
            <div v-else>
                Reprendre le questionnaire
            </div>
        </el-button>
        
    </div>
    
</template>

<script>
import MultiButtonForm from '../Form/MultiButtonForm.vue'
import FormFooter from '../Form/FormFooter.vue'
import TextForm from '../Form/TextForm.vue'
import VueScrollTo from 'vue-scrollto'

export default {
    name: 'FinanceFiles',
    props: {
    },
    components: {
        'multibutton-form': MultiButtonForm,
        'form-footer': FormFooter,
        'text-form': TextForm,
    },
    data() {
        return {
            questions: [
                { 
                    prompt: "Vous empruntez...",
                    resultName: 'NumberPeople',
                    answers: [{
                        index: 0,
                        name: 'Seul',
                        documents: ['Pièces d’identité en cours de validité', '3 derniers avis d’imposition'],
                        condensedDocuments: ['Pièces d’identité en cours de validité', '3 derniers avis d’imposition'],
                        answer: 'seul'
                    },
                    {
                        index: 0,
                        name: 'A deux',
                        documents: ['Pièces d’identité en cours de validité de chacun des emprunteurs', '3 derniers avis d’imposition'],
                        condensedDocuments: ['Pièces d’identité en cours de validité de chacun des emprunteurs', '3 derniers avis d’imposition'],
                        answer: 'deux'
                    }]
                },
                {
                    prompt: "Vous êtes...",
                    resultName: 'Relationship',
                    answers: [{
                        index: 1,
                        name: 'Célibataire',
                        answer: 'celibataire'
                    },
                    {
                        index: 1,
                        name: 'Divorcé',
                        documents: ["Jugement de divorce", "Acte liquidatif de la communauté", "Convention définitive de divorce"],
                        condensedDocuments: ["Jugement de divorce", "Acte liquidatif de la communauté", "Convention définitive de divorce"],
                        answer: 'divorcé'
                    }]
                },
                {
                    prompt: "Vous êtes...",
                    resultName: 'RelationshipSituation',
                    answers: [{
                        index: 2,
                        name: 'En concubinage',
                        answer: 'concubinage',
                        documents: ["Attestation sur l’honneur signée par les concubins"],
                        condensedDocuments: ["Attestation sur l’honneur signée par les concubins"],
                    },
                    {
                        index: 2,
                        name: 'Pacsés',
                        answer: 'pacsés',
                        documents: ["Contrat de PACS", "Livret de famille"],
                        condensedDocuments: ["Contrat de PACS", "Livret de famille"],
                    },
                    {
                        index: 2,
                        name: 'Mariés',
                        answer: 'mariés',
                        documents: ["Contrat de mariage ", "Livret de famille"],
                        condensedDocuments: ["Contrat de mariage ", "Livret de famille"],
                    }]
                },
                {
                    prompt: "Vous êtes actuellement",
                    resultName: 'Job',
                    answers: [{
                        index: 3,
                        name: 'Salarié',
                        answer: 'salarié',
                        documents: ["3 derniers bulletins de salaires ", "Bulletin de salaire de décembre de l’année N-1",
                            "Contrat de travail ou attestation employeur",
                            "Justificatif des rémunérations variables et primes",
                            "Déclaration de revenues pré-remplie pour l’année N-1"],
                        condensedDocuments: ["3 derniers bulletins de salaires ", "Bulletin de salaire de décembre de l’année N-1",
                            "Contrat de travail ou attestation employeur",
                            "Justificatif des rémunérations variables et primes",
                            "Déclaration de revenues pré-remplie pour l’année N-1"]
                    },
                    {
                        index: 3,
                        name: 'Indépendant/Professions libérales',
                        answer: 'independant',
                        documents: ["3 dernières déclarations 2035 ou 2031",
                            "3 derniers bilans comptables", "Situation comptable ou bénéfice réalisé pour l'année en cours",
                            "3 derniers relevés de compte professionnel"],
                        condensedDocuments: ["3 dernières déclarations 2035 ou 2031",
                            "3 derniers bilans comptables", "Situation comptable ou bénéfice réalisé pour l'année en cours",
                            "3 derniers relevés de compte professionnel"],
                    },
                    {
                        index: 3,
                        name: 'Chef d’entreprise',
                        answer: 'chef',
                        documents: ["3 derniers bilans comptables", "Situation comptable ou bénéfice réalisé pour l'année en cours",
                            "Extrait Kbis", "Statuts de la société", "3 derniers relevés de compte professionnel"],
                        condensedDocuments: ["3 derniers bilans comptables", "Situation comptable ou bénéfice réalisé pour l'année en cours",
                            "Extrait Kbis", "Statuts de la société", "3 derniers relevés de compte professionnel"],
                    },
                    {
                        index: 3,
                        name: 'En recherche d’emploi',
                        documents: ["Attestation d’inscription à Pôle Emploi"],
                        condensedDocuments: ["Attestation d’inscription à Pôle Emploi"],
                        answer: 'recherche',
                        
                    }, {
                        index: 3,
                        name: 'Retraité',
                        answer: 'retired',
                        
                    }]
                },
                {
                    prompt: "Vous êtes actuellement",
                    resultName: 'MainHousing',
                    answers: [{
                        index: 4,
                        name: 'Propriétaire de votre résidence principale',
                        answer: 'proprietaire',
                        documents: ["Justificatif de domicile de moins de 3 mois",
                            "Taxe foncière de votre résidence principale",
                            "Taxe d'habitation de votre résidence principale"],
                        condensedDocuments: ["Justificatif de domicile de moins de 3 mois",
                            "Taxe foncière de votre résidence principale",
                            "Taxe d'habitation de votre résidence principale"],
                    },
                    {
                        index: 4,
                        name: 'Locataire de votre résidence principale',
                        answer: 'locataire',
                        documents: ["Justificatif de domicile de moins de 3 mois", "Bail de location",
                        "Dernière quittance de loyer ou relevé de gestion",
                        "Taxe d'habitation de votre résidence principale"],
                        condensedDocuments: ["Justificatif de domicile de moins de 3 mois", "Bail de location",
                        "Dernière quittance de loyer ou relevé de gestion",
                        "Taxe d'habitation de votre résidence principale"],
                    },
                    {
                        index: 4,
                        name: 'Hébergé à titre gratuit',
                        answer: 'gratuit',
                        documents: ["Attestation d'hébergement manuscrite datée et signée",
                            "Pièce d’identité de l’hébergeant",
                            "Justificatif de domicile de l’hébergeant"],
                        condensedDocuments: ["Attestation d'hébergement manuscrite datée et signée",
                            "Pièce d’identité de l’hébergeant",
                            "Justificatif de domicile de l’hébergeant"],
                    }]
                },
                {
                    prompt: "Disposez-vous de revenus foncier ?",
                    resultName: 'Income',
                    answers: [{
                        index: 5,
                        name: 'Oui',
                        answer: 'oui',
                        documents: [ "Titre de propriété ou taxe foncière de tous les biens",
                            "Évaluation de la valeur des biens",
                            "Attestation notariée des caractéristiques des biens",
                            "Dernière déclaration ISF", "Dernière déclaration de revenus fonciers"],
                        condensedDocuments: [ "Titre de propriété ou taxe foncière de tous les biens",
                            "Évaluation de la valeur des biens",
                            "Attestation notariée des caractéristiques des biens",
                            "Dernière déclaration ISF", "Dernière déclaration de revenus fonciers"],
                    },
                    {
                        index: 5,
                        name: 'Non',
                        answer: 'non'
                    }]
                },
                {
                    prompt: "Vous bénéficiez…",
                    resultName: 'FundsIncome',
                    answers: [{
                        index: 6,
                        name: 'D’allocation(s)',
                        answer: 'allocations',
                        documents: ["Attestation(s) de versement"],
                        condensedDocuments: ["Attestation(s) de versement"],
                    },
                    {
                        index: 6,
                        name: 'D’une pension',
                        answer: 'pension',
                        documents: ["Documents justifiant le montant de la ou des pension perçue(s)",
                            "Justificatif des pensions (invalidité, complémentaires, etc.)",
                            "Justificatif(s) de tous revenu(s) complémentaire(s)"],
                        condensedDocuments: ["Documents justifiant le montant de la ou des pension perçue(s)",
                            "Justificatif des pensions (invalidité, complémentaires, etc.)",
                            "Justificatif(s) de tous revenu(s) complémentaire(s)"],
                    }]
                },
                {
                    prompt: "Êtes-vous propriétaire du terrain sur lequel vous souhaitez faire construire ?",
                    resultName: 'isOwner',
                    answers: [{
                        index: 7,
                        name: 'Oui',
                        answer: 'oui',
                        documents: ["Titre de propriété du terrain", "État hypothécaire récent"],
                        condensedDocuments: ["Titre de propriété du terrain", "État hypothécaire récent"],
                    },
                    {
                        index: 7,
                        name: 'Non',
                        answer: 'no',
                        documents: ["Compromis ou promesse de vente du terrain signée",
                            "Extrait cadastral mentionnant l'identité du propriétaire actuel"],
                        condensedDocuments: ["Compromis ou promesse de vente du terrain signée",
                            "Extrait cadastral mentionnant l'identité du propriétaire actuel"],
                    }]
                },
                {
                    prompt: "Pour construire votre maison, vous avez recours à …",
                    resultName: 'Employees',
                    answers: [{
                        index: 8,
                        name: 'Des artisans et entreprises du bâtiments',
                        answer: 'artisans',
                        documents: ["Devis estimatifs et descriptifs des travaux",
                            "Attestations d’assurances décennales des entreprises intervenantes",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                        condensedDocuments: ["Devis estimatifs et descriptifs des travaux",
                            "Attestations d’assurances décennales des entreprises intervenantes",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                    },
                    {
                        index: 8,
                        name: 'Un architecte',
                        answer: 'architecte',
                        documents: [
                            "Contrat d’architecte avec description de la mission",
                            "Attestation d’assurance décennale de l’architecte",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                        condensedDocuments: [
                            "Contrat d’architecte avec description de la mission",
                            "Attestation d’assurance décennale de l’architecte",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                    },
                    {
                        index: 8,
                        name: 'Un maître d’oeuvre',
                        answer: 'maitre',
                        documents: [
                            "Contrat de maîtrise d’oeuvre",
                            "Attestation d’assurance décennale du maître d’oeuvre",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                        condensedDocuments: [
                            "Contrat de maîtrise d’oeuvre",
                            "Attestation d’assurance décennale du maître d’oeuvre",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                    },
                    {
                        index: 8,
                        name: 'Un constructeur de maisons individuelles',
                        answer: 'constructeur',
                        documents: [
                            "Contrat de construction de maison individuelle (pour une maison à construire)",
                            "Attestation d’assurance décennale du constructeur",
                            "Attestation de garantie de livraison",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                        condensedDocuments: [
                            "Contrat de construction de maison individuelle (pour une maison à construire)",
                            "Attestation d’assurance décennale du constructeur",
                            "Attestation de garantie de livraison",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                    }, {
                        index: 8,
                        name: 'Un promoteur immobilier',
                        answer: 'promoteur',
                        documents: [
                            "Contrat de promotion immobilière",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                        condensedDocuments: [
                            "Contrat de promotion immobilière",
                            "Dossier de dépôt du permis de construire ou justificatif du dépôt",
                            "Certificat RT 2012 ou Attestation de performance énergétique",
                            "Attestation d’assurance dommage-ouvrage"],
                    }]
                },
                {
                    prompt: "Avez-vous un apport personnel ?",
                    resultName: 'PersonalAdd',
                    answers: [{
                        index: 9,
                        name: 'Oui',
                        answer: 'oui',
                        documents: ["Justificatif(s) de l’apport personnel",
                            "3 derniers relevés de tous les comptes bancaires",
                            "Relevé d'intérêts acquis (PEL/CEL)",
                            "Relevés des placements (assurance-vie...)"],
                        condensedDocuments: ["Justificatif(s) de l’apport personnel",
                            "3 derniers relevés de tous les comptes bancaires",
                            "Relevé d'intérêts acquis (PEL/CEL)",
                            "Relevés des placements (assurance-vie...)"],
                    },
                    {
                        index: 9,
                        name: 'Non',
                        answer: 'non',
                        documents: [
                            "3 derniers relevés de tous les comptes bancaires",
                            "Relevé d'intérêts acquis (PEL/CEL)",
                            "Relevés des placements (assurance-vie...)"],
                        condensedDocuments: [
                            "3 derniers relevés de tous les comptes bancaires",
                            "Relevé d'intérêts acquis (PEL/CEL)",
                            "Relevés des placements (assurance-vie...)"],
                    }]
                },
                {
                    prompt: "Souhaitez-vous bénéficier d’un/de prêt(s) aidé(s) ?",
                    resultName: 'Loan',
                    answers: [{
                        index: 10,
                        name: 'Non',
                        answer: 'non'
                    },
                    {
                        index: 10,
                        name: 'Prêt à taux zéro',
                        answer: 'zero',
                        documents: [
                            "Fiche de renseignements PTZ complétée",
                            "Contrat(s) de bail pour les 2 dernières années",
                            "Quittances de loyer pour les 2 dernières année"],
                        condensedDocuments: [
                            "Fiche de renseignements PTZ complétée",
                            "Contrat(s) de bail pour les 2 dernières années",
                            "Quittances de loyer pour les 2 dernières année"],
                    },
                    {
                        index: 10,
                        name: 'Prêt action logement',
                        answer: 'action'
                    },
                    {
                        index: 10,
                        name: 'Prêt epargne logement',
                        answer: 'epargne',
                        documents: ["Relevé d’épargne logement"],
                        condensedDocuments: ["Relevé d’épargne logement"],
                    }]
                },
                {
                    prompt: "Avez-vous des crédits en cours ?",
                    resultName: 'CurrentLoan',
                    answers: [{
                        index: 11,
                        name: 'Oui',
                        answer: 'oui',
                        documents: [
                            "Contrats de prêt ou justificatifs de crédits ",
                            "Tableaux d’amortissement",
                            "Attestation d'engagement ou de remboursement pour les prêts en cours",
                            "Le dernier relevé mensuel des crédits en cours"],
                        condensedDocuments: [
                            "Contrats de prêt ou justificatifs de crédits ",
                            "Tableaux d’amortissement",
                            "Attestation d'engagement ou de remboursement pour les prêts en cours",
                            "Le dernier relevé mensuel des crédits en cours"],
                    },
                    {
                        index: 11,
                        name: 'Non',
                        answer: 'non'
                    }]
                },
                {
                    index: 12,
                    prompt: "Avez-vous recours à un crédit-relais ",
                    resultName: 'LoanRelais',
                    answers: [{
                        index: 12,
                        name: 'Oui',
                        answer: 'oui',
                        documents: [
                            "Titre de propriété",
                            "Rapport d’expertise ou attestation notarié",
                            "Contrat du prêt en cours",
                            "Tableau d’amortissement du prêt en cours"],
                        condensedDocuments: [
                            "Titre de propriété",
                            "Rapport d’expertise ou attestation notarié",
                            "Contrat du prêt en cours",
                            "Tableau d’amortissement du prêt en cours"],
                    },
                    {
                        index: 12,
                        name: 'Non',
                        answer: 'non'
                    }]
                }
            ],
            visible: true,
            currentQuestion: 0,
            isStarted: false,
            finalForm: {
                NumberPeople: {answer: undefined},
                Relationship: {answer: undefined},
                RelationshipSituation: {answer: undefined},
                Job: {answer: undefined},
                MainHousing: {answer: undefined},
                Income: {answer: undefined},
                isOwner: {answer: undefined},
                FundsIncome: {answer: undefined},
                Employees: {answer: undefined},
                PersonalAdd: {answer: undefined},
                Loan: {answer: undefined},
                CurrentLoan: {answer: undefined},
                LoanRelais: {answer: undefined}
            },

            isDone: false,
        }
    },
    watch: {
        currentQuestion: function (newQuestion, oldQuestion) {
            const scrollLength = newQuestion * 30;
            document.getElementById('q-active').style.WebkitTransform = 'translateY(-' + scrollLength + 'rem)';
            // Code for IE9
            document.getElementById('q-active').style.msTransform = 'translateY(-' + scrollLength + 'rem)';
            // Standard syntax
            document.getElementById('q-active').style.transform = 'translateY(-' + scrollLength + 'rem)';
        }
    },
    computed: {
        answeredQuestions() {
            let p = 0;
            for (var i = 0; i < this.questions.length; i++) {
                let question = this.questions[i];
                if (this.finalForm[question.resultName].answer) p++ 
            }
            return p
        },
        user() {
            return this.$localStorage.get('user');
        }
    },
    mounted() {

    },
    created() {
        this.$http.get(this.$root.URL + '/form/get?name=FinanceFiles').then(res => {
            this.fillForm(res.data.result)
            this.currentQuestion = this.answeredQuestions;
            if (this.currentQuestion < this.answeredQuestions) this.currentQuestion += 1;
            if (this.answeredQuestions >= this.questions.length) this.isDone = true;
            if (this.answeredQuestions > 0) this.isStarted = true; 
        }, err => {
            const basis = {
                NumberPeople: {answer: undefined},
                Relationship: {answer: undefined},
                RelationshipSituation: {answer: undefined},
                Job: {answer: undefined},
                MainHousing: {answer: undefined},
                Income: {answer: undefined},
                isOwner: {answer: undefined},
                FundsIncome: {answer: undefined},
                Employees: {answer: undefined},
                PersonalAdd: {answer: undefined},
                Loan: {answer: undefined},
                CurrentLoan: {answer: undefined},
                LoanRelais: {answer: undefined}
            };
        if (this.answeredQuestions > 0) this.isStarted = true; 
            this.fillForm(basis);
        });
        window.addEventListener('keydown', this.handleEvents);
        this.$root.$el.offsetParent.style.overflow= 'hidden';
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.handleEvents);
        this.$root.$el.offsetParent.style.overflow= 'auto';
    },
    methods: {
        start() {
            this.isStarted = true;
        },
        firstQuestion(questionNbr)  {
            this.isDone = false;
            this.currentQuestion = 0;
        },
        handleQuestionClick(questionNumber) {
            if (questionNumber !== this.currentQuestion) {
                if (questionNumber > this.currentQuestion) {
                    this.nextQuestion();
                }
            }
        },
        getDocuments() {
            let documents = [];

            for (var i = 0; i < this.questions.length; i++) {
                let question = this.questions[i];
                if (this.finalForm[question.resultName].answer && this.finalForm[question.resultName].condensedDocuments) {
                    if (this.currentQuestion >= this.questions.length) {
                        this.finalForm[question.resultName].documents.forEach(document => {
                            documents.push(document);
                        })
                    } else {
                        this.finalForm[question.resultName].condensedDocuments.forEach(document => {
                            documents.push(document);
                        })
                    }
                }
            }

            // this.finalForm.forEach(answer => {
            //     if (answer && answer.condensedDocuments) {
            //         if (this.currentQuestion >= this.questions.length) {
            //             answer.documents.forEach(document => {
            //                 documents.push(document);
            //             })
            //         } else {
            //             answer.condensedDocuments.forEach(cDocument => {
            //                 documents.push(cDocument);
            //             })
            //         }
            //     }
            // })
            return (documents)
        },
        handleClose() {
            this.visible = false;
        },
        selectItem(item) {
            if (item == null) return;
            if (item.index != this.currentQuestion) return;
            this.finalForm[this.questions[this.currentQuestion].resultName] = item;
            if (item !== null)
                window.setTimeout(this.nextQuestion, 100);
        },
        fillForm(base) {
            for (var i = 0; i < this.questions.length; i++) {
                 if (base[this.questions[i].resultName]) this.finalForm[this.questions[i].resultName] = base[this.questions[i].resultName]
            }
        },
        saveForm() {
            this.$http.post(this.$root.URL + '/form/save?name=FinanceFiles', this.finalForm).then(res => {
                this.fillForm(res.data.result);
            });
        },
        nextQuestion() {
            if (this.finalForm[this.questions[this.currentQuestion].resultName].answer && this.currentQuestion != this.questions.length) {
                this.saveForm()
                this.currentQuestion += 1;
            }
            if (this.currentQuestion >= this.questions.length) {
                this.isDone = true;
                this.$message.success("Voici votre liste de pièces à fournir 😉")
                return;
            }  else {
                this.isDone = false;
            }
        },
        previousQuestion() {
            this.isDone = false;
            this.currentQuestion -= 1;
        }
    },
}
</script>

<style scoped>
    html, body {margin: 0; height: 100%; overflow: hidden}

    nav {
        margin-right: 8rem;
    }
    nav ul{ width:380px;}
    /* nav ul{overflow:hidden; overflow-y:scroll;} */

    .start-survey {
        background: rgba(255, 255, 255, 0.7);
        z-index: 1;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
    }

    .start-survey button {
        position: absolute;
        left: calc(50% - 197px);
        background: #31BDFC;
        color: #fff;
        padding: 1rem 3rem;
        font-size: 1.5rem;
        border: none;
        border-radius: 5px;
        margin-top: 20vh;
        box-shadow: 0 0 69px 0px rgba(0, 0, 0, .2);
        cursor: pointer;
    }

    .question-title {
        font-size: 9rem;
        letter-spacing: normal;
    }
    .question-number {
        color: #31bdfc;
    }
    .active {
        opacity: 1;
    }
    .transparent {
        opacity: 0.2;
    }

    .st-scroll {
        overflow: hidden;
        top: 0;
        left: 0;
        transition: all 0.6s ease-in-out;
        
        /* Let's enforce some hardware acceleration */
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
    }
    .last-question {
        height: 30rem;
        margin-bottom: 30rem;
    }
    .question {
        height: 30rem;
        left:0;
    }
    .el-main {
        color: #333;
        margin-top: 2rem;
    }
        #q1-active > .st-scroll {
	    transform: translateY(0%);
    }
    #q2-active > .st-scroll {
	    transform: translateY(-30rem);
    }
    #q3-active > .st-scroll {
	    transform: translateY(-60rem);
    }
    #q4-active > .st-scroll {
	    transform: translateY(-90rem);
    }
    #q5-active > .st-scroll {
	    transform: translateY(-120rem);
    }
    #q6-active > .st-scroll {
	    transform: translateY(-150rem);
    }
    #q7-active > .st-scroll {
	    transform: translateY(-180rem);
    }
    #q8-active > .st-scroll {
	    transform: translateY(-210rem);
    }
    #q9-active > .st-scroll {
	    transform: translateY(-240rem);
    }
    #q10-active > .st-scroll {
	    transform: translateY(-270rem);
    }
    #q11-active > .st-scroll {
	    transform: translateY(-300rem);
    }
    #q12-active > .st-scroll {
	    transform: translateY(-330rem);
    }


.liste-pieces {
    margin-top: 4rem;
    border: 1px solid rgba(33, 45, 89, 0.1);
    overflow: auto;
    max-height: 46vh;
    width: 500px;
    box-shadow: 4px 4px 4px rgba(0, 0, 0, .05);
}

.liste-pieces.download {
    width: 60%;
    height: auto;
    margin-right: 20%;
    border: none;
    border-radius: 5px;
    margin-bottom: 1rem;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, .05);
}
.liste-pieces h3 {
    color: rgba(33, 45, 89, 0.3);
    font-weight: 500;
    text-align: center;
    font-size: 1.2rem;
}

.pieces-container {
    width: 450px;
}

.liste-pieces ul {
    width: auto;
    list-style: none;
    padding: 0 1.4rem;
    color: rgba(33, 45, 89, .8);
    font-size: .85rem;
    height: 85%;
}

.liste-pieces li {
    transition: all .4s linear;
    padding-bottom: .5em;
}

.done {
    
    -webkit-transition: width 2s; /* Safari */
    transition: width 2s;
}

.liste-pieces i {
    color: #00BBFF;
}

.pieces-download.el-button {
    color: #fff;
    background: #31BDFC;
    background: linear-gradient(5deg,#31BDFC,#00D3F7);
    border-radius: 4px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    padding: 1.4rem 0rem;
    cursor: pointer;
    transition: .2s ease-in-out;
    border: none;
     margin-top: -13px;
}

.liste-pieces.aside {
    width: 500px;
}

    .btn-close {
        right: 10%;
        top: 2rem;
        z-index: 9999;
    }
    .question-title {
        font-size: 1.4rem;
        letter-spacing: normal;
    }
    .question-number {
        color: #31bdfc;
        font-size: 1rem;
        vertical-align: middle;
    }
    .active {
        opacity: 1;
    }
    .transparent {
        opacity: 0.2;
    }
    .st-scroll {
        top: 0;
        left: 0;
        transition: all 0.6s ease-in-out;
        
        /* Let's enforce some hardware acceleration */
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
    }
    .last-question {
        height: 30rem;
        margin-bottom: 30rem;
    }
    .question {
        height: 30rem;
    }
    .el-main {
        color: #333;
        
    }
/* 
  ##Device = Tablets, Ipads (portrait)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) {
  .liste-pieces {
      margin-right: 1.2rem;
      max-height: 50vh;
  }
    .liste-pieces.download {
      margin-top: 2rem;
  }
}

/* 
  ##Device = Tablets, Ipads (landscape)
  ##Screen = B/w 768px to 1024px
*/

@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .liste-pieces.download {
      margin-top: 2rem;
  }

    .liste-pieces {
        max-height: 40vh;
    }

    .liste-pieces.download ul {
      height: 55%;
  }
}
</style>
