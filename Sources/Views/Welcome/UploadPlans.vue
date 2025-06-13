<template id="signup">
    <el-row class="main-container">
        <el-col style="padding:1rem;" :xs="24" :sm="24" :md="12" :lg="8" :xl="7">
            <div class="header">
                <h1 class="title">Avez-vous déjà des <span style="color: rgb(80, 184, 249)">plans</span> ?</h1>
                <h3 class="subtitle">On vous les chiffres gratuitement en 24h</h3>
            </div>
            <div class="footer">
                <upload-plans-input v-model="fileList" />
                <div class="tags uploaded-file">
                    <span v-for="(file, index) in fileList"
                        :key="index"
                        class="tag" >
                        {{file.name}}
                        <span class="el-icon-close delete-btn" @click="removeFile(index)"></span>
                    </span>
                </div>
            
                <el-button @click="uploadFiles()" :loading="uploadLoading" class="cta">Envoyer mes plans ! <span v-show="uploadLoading">{{uploadingPercentage}} %</span></el-button>
                <a class="quit-btn" @click="handleRedirect()">Non, je n'ai pas encore mes plans ...</a>
            </div>
        </el-col>
    </el-row>
</template>


<script>
import axios from 'axios';
import UploadPlansInput from '../../Components/UploadPlansInput.vue';
import MobileDetect from 'mobile-detect';
export default {
    name: "UploadPlans",
    components: {
        'upload-plans-input': UploadPlansInput,
    },
    data() {
        return {
            dragAndDropCapable: false,
            fileList: [],
            uploadLoading: false,
            uploadingPercentage: 0
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    created() {
        this.$http.get(this.$root.URL + '/auth/islogged').then(res => {
            if (res.data.isLogged == false) this.$router.replace({ name: 'Login' });
            this.$store.commit('setUser', res.data.user);
            this.userEdited = res.data.user;
        });
    },
    methods: {
        removeFile(index) {
            this.fileList.splice(index, 1);
        },
        handleRedirect() {
            var md = new MobileDetect(window.navigator.userAgent);

            if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
            else this.$router.push({ name: 'Index', params: { first: true } });
        },
        handleSuccess() {
            this.uploadLoading = false;
            this.$router.push({ name: 'UploadPlansSent', params: { first: true } });
        },
        uploadFiles() {
            if (this.fileList.length > 0) {
                const email = this.user.info[0].mail;
                this.uploadLoading = true;
                var fd = new FormData();
                this.fileList.forEach((file) => {
                    fd.append('plans', file, file.name);
                });
                axios.post('/upload-plan/add?email=' + email,
                    fd,
                    {
                        onUploadProgress: progressEvent => this.loadingPercentage = Math.round(progressEvent.loaded / progressEvent.total * 100),
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                    ).then(this.handleSuccess)
                    .catch(function(){
                        console.log('FAILURE!!');
                });
            } else {
                this.$message({
                    message: 'Attention, vous n\'avez pas ajouté de plans',
                    type: 'warning'
                });
            }
        }
    }
};
</script>
<style scoped>
    .delete-btn {
        margin-left: .3rem;
        font-weight: bold;
        cursor: pointer;
    }
    .tags .tag {
        margin-right: .5rem;
        margin-bottom: .5rem;
        background-color: #3fbcfc;
        color: #fff;
    }
    .tag:not(body) {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        background-color: #f5f5f5;
        border-radius: 4px;
        color: #4a4a4a;
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        font-size: .75rem;
        height: 2em;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        line-height: 1.5;
        padding-left: .75em;
        padding-right: .75em;
        white-space: nowrap;
    }
    .tags {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
    }
    .tags:not(:last-child) {
        margin-bottom: 0;
    }
    .uploaded-file {
        padding-left: .3rem;
        margin-top: .4rem;
        /* min-height: 35px; */
    }
    .plan-upload-name {
        display: flex;
    }
    .footer {
        display: flex;
        flex-direction: column;
    }
    .cta {
        margin-top: 3rem;
        font-weight: 400;
        font-size: 1.4rem;
        line-height: 1.6;
        padding: 1.2rem 2rem;
        text-align: center;
        background: linear-gradient(5deg,#31bdfc,#00d3f7);
        color: #fff !important; transition: all 400ms ease;
        border-radius: 4px;
        cursor: pointer;
        /* width: 100%; */
    }

    .cta:hover {
        box-shadow: 0 2px   12px 6px rgba(0, 0, 0, .08);
    }
    .cta:focus, .cta:active {
        box-shadow: 0 1px 5px 2px rgba(0, 0, 0, .1);
    }
    .quit-btn {
        text-decoration: underline;
        margin-top: 2rem;
        font-size: 1.2rem;
        text-align: center;
        color: rgb(143, 149, 168);
        cursor: pointer;
    }
    .header {
        text-align: center;
    }
    .title {
        color: rgb(37,49, 85);
        font-weight: 500;
        letter-spacing: .04rem;
    }

    .title::after {
        content: '';
        display: none;
    }
    .subtitle {
        font-size: 1.3rem;
        font-weight: 400;
        color: rgb(143, 149, 168);
    }
    .main-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    .plan-upload-container {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        border: 2px dashed rgba(35, 49, 88, .16);
        border-radius: 6px;
        padding: 2rem 0;
        background: #fff;
        box-shadow: 0 4px 10px 1px rgba(0, 0, 0, .07);
        transition: 400ms all;
    }

  .plan-upload-container:hover {
      transform: scale(1.03);
      transition: 400ms all;
      border-color: rgb(124,209,250);
      box-shadow: 0 8px 22px 5px rgba(0, 0, 0, .07);
   }
   .plan-upload-container img {
        width: 40%;
        opacity: .6;
    }

    .plan-upload-container i {
        font-size: 6rem;
        opacity: .1;
        margin-top: .6rem;
    }

    .plan-upload-maintext {
        font-size:1.3rem;
        color: rgb(145, 151, 169);
        /* color: #31BDFC; */
        font-weight: 300;
        margin-top: .6rem;
    }
</style>
