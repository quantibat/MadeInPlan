<template id="Plan">
    <div class="main-container">
        <el-row type="flex" align="bottom" class="header">

            <!--<transition name="slide-fade-a">
                <mip-configurator v-if="!show" class="child configurator"></mip-configurator>
            </transition>
            <transition name="slide-fade-b">
                <mip-drawer v-if="show" class="child drawer"></mip-drawer>
            </transition>-->
            <h1>Mon chantier</h1>
        </el-row>
        
                     <el-row class="chantier-container" type="flex" :gutter="32">
                    <div v-if="showChantierModal" class="modal-chantier">
                        <div class="prestataire-remove">
                        Vous n’en êtes pas encore là ... 😊
                        </div>
                    </div>
            
                        
                        <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal($event)" class="chantier-card">
                            <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="10"></el-progress>

                                <h6 class="chantier-card--number">1</h6>
                                <h3 class="chantier-card--title">Terrassement - VRD</h3>

                                
                            </div>
                         </el-col>

                        <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">2</h6>
                                <h3 class="chantier-card--title">Maçonnerie</h3>

                                
                            </div>
                         </el-col>

                            <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">3</h6>
                                <h3 class="chantier-card--title">Charpente - Couverture</h3>

                                
                            </div>
                         </el-col>
    
                                <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">4</h6>
                                <h3 class="chantier-card--title">Cloison/Doublage/Faux-plafond</h3>

                                
                            </div>
                         </el-col>

                            <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">5</h6>
                                <h3 class="chantier-card--title">Plomberie/Chauffage/Ventilation</h3>

                                
                            </div>
                         </el-col>


                            <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">6</h6>
                                <h3 class="chantier-card--title">Electricité</h3>

                                
                            </div>
                         </el-col>

                                <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
<el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>                    

                                <h6 class="chantier-card--number">7</h6>
                                <h3 class="chantier-card--title">Menuiseries intérieures</h3>

                                
                            </div>
                            
                         </el-col>

                                <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">8</h6>
                                <h3 class="chantier-card--title">Façade - Enduis</h3>

                                
                            </div>
                         </el-col>

                                    <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">9</h6>
                                <h3 class="chantier-card--title">Revêtement de sol</h3>

                                
                            </div>
                            
                         </el-col>

                                    <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                  
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">10</h6>
                                <h3 class="chantier-card--title">Peinture - Finitions</h3>

                                
                            </div>
                            
                         </el-col>

                  
                   <el-col :xl="6" :lg="6" :md="8" :sm="12" :xs="12">
                            <div @click="handleChantierModal()" class="chantier-card disabled">
                    <el-progress :show-text="false" stroke-width="3" color="#2ECC71" class="chantier-step-progression" width="40" type="circle" :percentage="0"></el-progress>

                                <h6 class="chantier-card--number">11</h6>
                                <h3 class="chantier-card--title">Aménagements extérieurs</h3>

                                
                            </div>
                            
                         </el-col>
                         </el-row>
    </div>
</template>

<script>

export default {
    name: 'Chantier',
    data() {
        return {
            showChantierModal: false
        }
    },
    methods: {
        handleChantierModal(e) {
            let self = this;
            self.showChantierModal = true;
            let el = document.querySelector('.modal-chantier')
            setTimeout(function(){self.showChantierModal = false;  el.classList.add('hide'); }, 2000);
        }
    }
}
</script>

<style scoped>

.chantier-container div:nth-child(1) .chantier-card {
    border-color: #CF815F;
}
.chantier-container div:nth-child(2) .chantier-card {
    border-color: #E97956;
}
.chantier-container div:nth-child(3) .chantier-card {
    border-color: #ff5252;
}
.chantier-container div:nth-child(4) .chantier-card {
    border-color: #AAADBD;
}
.chantier-container div:nth-child(5) .chantier-card {
    border-color: #00BBFF;
}
.chantier-container div:nth-child(6) .chantier-card {
    border-color: #FEDC57;
}
.chantier-container div:nth-child(7) .chantier-card {
    border-color: #7F8FC6;
}
.chantier-container div:nth-child(8) .chantier-card {
    border-color: #B2DA93;
}
.chantier-container div:nth-child(9) .chantier-card {
    border-color: #FFC1FF;
}
.chantier-container div:nth-child(10) .chantier-card {
    border-color: #E09AFF;
}
.chantier-container div:nth-child(11) .chantier-card {
    border-color: #03D390;
}


/* .disabled {
    opacity: .3;
    cursor: not-allowed !important;
} */


.chantier-container {
    flex-wrap: wrap;
    margin-top: 3rem;

}

.chantier-card {
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 5px 1px rgba(35, 49, 88, .1);
    border-radius: 5px;
    transition: .2s linear all;
    border-left: 2px solid currentColor;
    padding: 0rem 2rem 0rem;
    margin-bottom: 2rem;
    /* height: 18vh; */
    position: relative;
}
.chantier-card:hover {
    box-shadow: 0 4px 12px 2px rgba(35, 49, 88, .1);
    transition: .2s linear all;
    cursor: pointer;
}

.chantier-card--icon {
    color: #00BBFF;
    font-size: 2.5rem;
    font-weight: 500;
}

.chantier-card--title {
    color: rgba(35, 49, 88, 1);
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.4;
    /* margin-top: -.4rem; */
}

.chantier-card--number {
    /* margin: auto 0 0; */
    margin: 0;
    margin-top: 3rem;
    margin-bottom: 1rem;
    font-size: 3rem;
    line-height: 0;
    font-weight: 200;
    color: rgba(35, 49, 88, .2);
}

.prestataire-remove {
    position:absolute;
    top: 25vh;
    left: 24%;
    color:rgba(33, 45, 89, .8);
    font-weight: 300;
    font-size: 3rem;
    text-align: center;
}

@media (min-width: 768px) and (max-width: 1188px) {
  
  .prestataire-remove {
      left: 5%;
      font-size: 2.5rem;
      text-align: center;
  }

  .chantier-card {

    /* height: 7rem; */

}

}

.chantier-step-progression {
    position: absolute;
    right: 1rem;
    top: .5rem;
}

.el-progress__text { 
    display: none !important;
}

.modal-chantier {
    transition: all linear 4s;
    align-content: center; display: flex; align-items: center;position:absolute; left: 0; right: 0; top: 0; bottom: 0; background: rgba(255, 255, 255, .7); z-index: 1000
}

.hide {
    transition: all linear 4s;
    display: none !important;
    left: -999999px;
}

</style>
