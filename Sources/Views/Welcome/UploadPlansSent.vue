<template id="signup">
    <el-row class="main-container">
        <el-col style="padding:1rem;" :xs="24" :sm="24" :md="12" :lg="9" :xl="9">
            <div class="validate-container">
                <i class="budicon budicon-check-ui green-check"/>
                <div class="validate-title">Vos plans ont été envoyés.</div>
                <div class="validate-subtitle">Vous allez recevoir votre chiffrage par email en moins de 24 heures.</div>
                <a class="cta validate-redirect" @click="handleRedirect()">Continuez vers l'application</a>
            </div>
        </el-col>
    </el-row>
</template>


<script>
import MobileDetect from 'mobile-detect';
export default {
    name: "UploadPlansSent",
    methods: {
        handleRedirect() {
            var md = new MobileDetect(window.navigator.userAgent);

            if (md.mobile() != null) window.location.href = this.$root.MOBILE_URL;
            else this.$router.push({ name: 'Index', params: { first: true } });
        }
    }
};
</script>
<style scoped>

.green-check {
    font-size: 3rem;
    color: rgb(91,205,114);
}

.validate-subtitle {
    font-weight: 300;
    letter-spacing: 0;
  font-size: 1.25rem;
    color: rgba(38,50,89,.7);
}

.validate-redirect {
    margin-top: 3rem;
}

.cta {
    cursor: pointer;
    font-weight: 600;
    font-size: 1.2rem;
    line-height: 1.6;
    padding: 1.2rem 2rem;
    background: linear-gradient(5deg,#31bdfc,#00d3f7);
    color: #fff !important; transition: all 400ms ease;
    border-radius: 4px;
    /* width: 100%; */
 }

 .cta:hover {
     box-shadow: 0 2px   12px 6px rgba(0, 0, 0, .08);
 }
  .cta:focus, .cta:active {
     box-shadow: 0 1px 5px 2px rgba(0, 0, 0, .1);
 }

.validate-title {
    letter-spacing: 0;
   font-size: 2.5rem;
    font-weight: 600;
    color: rgb(38,50,89);
}

.validate-container {
    margin-top: -2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    z-index: 20018;
}

</style>
