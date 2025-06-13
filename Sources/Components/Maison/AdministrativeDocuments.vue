<template>
    <el-row>
        <h2 class="section-pieces">Tout pour gérer et organiser mes pièces administratives</h2>
        <div v-for="(uploader, uploaderIndex) in uploaders">
            <h3 class="upload-section-title">{{uploader.category}}</h3>
            <el-row class="multiple-upload-container" type="flex" :gutter="32">
                <el-col :span="4" v-for="(fileUploader, index) in uploader.fileUploaders">
                    <h3 class="upload-file-title">{{fileUploader.description}}</h3>
                    <div class="upload-container" v-loading="fileUploader.loading" :element-loading-text="'Envoi: ' + fileUploader.loadingPercentage + '%'">
                        <upload-document-input v-model="fileUploader.fileList" :uploadChange="() => onUploadChange(index, uploaderIndex)" />
                    </div>
                    <div class="upload-files">
                        <div class="upload-files">
                            <el-row v-for="file in fileUploader.uploadedFiles.files" class="upload-file" @mouseover.native="mouseOverUploadedFile(file.filename)" @mouseleave.native="uploadHoverFile = ''">
                                <el-col :span="20">
                                    <i class="el-icon-document" />
                                    <a :href="'/upload/Documents/' + file.filename" target="_blank">{{file.filename}}</a>
                                </el-col>
                                <el-col v-show="file.filename !== uploadHoverFile" :span="4">
                                    <i class="el-icon-success upload-success" />
                                </el-col>
                                <el-col v-show="file.filename === uploadHoverFile" :span="4">
                                    <i class="el-icon-close" @click="removeUploadedFile(fileUploader.uploadedFiles._id, file.filename)" />
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-row>
</template>

<script>
import UploadDocumentInput from '../UploadDocumentInput.vue';
import axios from 'axios';

export default {
    name: 'AdministrativeDocuments',
    components: {
        'upload-document-input': UploadDocumentInput,
    },
    data() {
        return {
            uploadHoverFile: '',
            uploaders: [
                {
                    category: 'Vente',
                    fileUploaders: [{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDT',
                        description: 'Photos du terrain',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'CDV',
                        description: 'Compromis de vente',
                        loading: false,
                        loadingPercentage: 0
                    },{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ADDV',
                        description: 'Acte définitif de vente',
                        loading: false,
                        loadingPercentage: 0
                    }]
                }, {
                    category: 'Crédit',
                    fileUploaders: [{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ADPDC',
                        description: 'Accord de principe de crédit',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ODP',
                        description: 'Offre de prêt',
                        loading: false,
                        loadingPercentage: 0
                    },{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'CDP',
                        description: 'Contrat de prêt',
                        loading: false,
                        loadingPercentage: 0
                    }]
                }, {
                    category: 'Études',
                    fileUploaders: [{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'DPEDS',
                        description: 'Devis pour étude de sol',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'EDS',
                        description: 'Étude de sol',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'DPEH',
                        description: 'Devis pour étude hydrogéologique',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'EH',
                        description: 'Étude hydrogéologique',
                        loading: false,
                        loadingPercentage: 0
                    }]
                }, {
                    category: 'Plan',
                    fileUploaders: [{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDM',
                        description: 'Plan de masse',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PT',
                        description: 'Plan topographique',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDC',
                        description: 'Plan de coupe',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDF',
                        description: 'Plan de façade',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDI',
                        description: 'Plan d\'implantation',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PC',
                        description: 'Plan cadastrale',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDD',
                        description: 'Plan de division',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PLU',
                        description: 'PLU',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PPRI',
                        description: 'PPRi',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PPRS',
                        description: 'PPRs',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDA',
                        description: 'Permis d\'aménager',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PDCO',
                        description: 'Permis de construire',
                        loading: false,
                        loadingPercentage: 0
                    }]
                }, {
                    category: 'Assurance',
                    fileUploaders: [{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'CDCDL',
                        description: 'Cahier des charges du lotissement',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'RDL',
                        description: 'Règlement de lotissement',
                        loading: false,
                        loadingPercentage: 0
                    },{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ADCDSDL',
                        description: 'Acte de création du syndic de lotissement',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'DEDC',
                        description: 'Devis entreprises de construction',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ADAD',
                        description: 'Attestations d\'assurance décennale',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ADADO',
                        description: 'Attestations d\'assurance dommage-ouvrage',
                        loading: false,
                        loadingPercentage: 0
                    }]
                }, {
                    category: 'Déclaration',
                    fileUploaders: [{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'DDCDT',
                        description: 'Déclaration de commencement des travaux',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'DDADT',
                        description: 'Déclaration d\'achèvement des travaux',
                        loading: false,
                        loadingPercentage: 0
                    },{
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ADADT',
                        description: 'Attestation d\'achèvement des travaux',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'CDCPR',
                        description: 'Courrier de convocation pour réception',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PVDR',
                        description: 'Procès verbal de réserves',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'PVDRP',
                        description: 'Procès verbal de réception',
                        loading: false,
                        loadingPercentage: 0
                    }, {
                        fileList: [],
                        uploadedFiles: [],
                        tag: 'ART',
                        description: 'Attestation RT 2012',
                        loading: false,
                        loadingPercentage: 0
                    }]
                },
            ],
        }
    },
    created() {
        this.getUploadedFiles();
    },
    methods: {
        onUploadChange(index, uploaderIndex) {
            if (this.uploaders[uploaderIndex].fileUploaders[index].fileList.length > 0) {
                this.uploaders[uploaderIndex].fileUploaders[index].loading = true;
                var fd = new FormData();
                this.uploaders[uploaderIndex].fileUploaders[index].fileList.forEach((file) => {
                    fd.append(this.uploaders[uploaderIndex].fileUploaders[index].tag, file, file.name);
                });
                axios.post('/administrative-documents/add?documentName=' + this.uploaders[uploaderIndex].fileUploaders[index].tag,
                    fd,
                    {
                        onUploadProgress: progressEvent => {
                           this.uploaders[uploaderIndex].fileUploaders[index].loadingPercentage = Math.round(progressEvent.loaded / progressEvent.total * 100);
                            if (this.uploaders[uploaderIndex].fileUploaders[index].loadingPercentage === 100) {
                                this.uploaders[uploaderIndex].fileUploaders[index].loading = false;
                                this.uploaders[uploaderIndex].fileUploaders[index].fileList = [];
                            }
                        },
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    ).then(this.handleUploadSuccess)
                    .catch(function(){
                        console.log('FAILURE!!');
                });
            }
        },
        mouseOverUploadedFile(filename) {
           this.uploadHoverFile = filename;
        },
        removeUploadedFile(id, filename) {
            this.$http.post('/administrative-documents/remove', { id, filename }).then(res => {
                this.getUploadedFiles();
            }, err => {});
        },
        resetUploadedFiles() {
            this.uploaders.forEach((uploader) => {
                uploader.fileUploaders.forEach((fileUploader) => {
                    fileUploader.uploadedFiles = [];
                });
            });
        },
        getUploadedFiles() {
            this.$http.get(this.$root.URL + '/administrative-documents/get').then(res => {
                this.resetUploadedFiles();
                res.data.forEach((document) => {
                    this.uploaders.forEach((uploader) => {
                        uploader.fileUploaders.forEach((fileUploader) => {
                            if (document.documentName === fileUploader.tag)
                            fileUploader.uploadedFiles = document;
                        });
                    });
                });
                this.$forceUpdate();
            }, err => {
            });
        },
        handleUploadSuccess() {
            this.$message({
                message: 'Félicitations, vos fichiers ont été envoyé.',
                type: 'success'
            });
            this.getUploadedFiles();
        },
    }
}
</script>

<style scoped>
    .multiple-upload-container {
        margin-top: 0rem;
        flex-wrap: wrap;
    }
    .section-pieces {
        margin: 0;
        margin-top: .5rem;
        font-weight: 400;
        color: #212D59;
        opacity: .5;
        font-size: 1.5rem;
    }
    .upload-container {
        padding: 1rem;
    }
    .upload-files {
        display: flex;
        flex-direction: column;
    }
    .upload-file:hover {
        background-color: rgba(0,0,0,.1);
    }
    .upload-file {
        margin-bottom: .3rem;
        cursor: pointer;
    }

    .upload-file:last-of-type {
        margin-bottom: 0;
    }
    .upload-success {
        color:rgb(92, 186, 51);
    }
    .upload-file-title {
        font-weight: 500;
        font-size: 1rem;
        color: #212D59;
        opacity: .4;
        margin: 0;
        margin-left: 1rem;
    }
    .upload-section-title {
        color: #212D59;
        font-size: 2rem;
        margin-bottom: 1rem;
        padding: 0;   
    }

.multiple-upload-container div {
    margin-bottom: .5rem;
}
</style>
