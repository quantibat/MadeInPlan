<template>
    <div class="main-container">
        <el-row type="flex" align="bottom" class="header">
            <h1>Mon projet</h1>
        </el-row>
            <el-row class="projet-container">
            <el-tabs v-model="projetTabs" type="card" ref="tabs" :stretch="isMobile()">
                <el-tab-pane name="descriptif" label="Descriptif & Équipements">
                    <descriptif />
                </el-tab-pane>
                <el-tab-pane name="inspirations" label="Inspirations">
                     <inspiration />
                </el-tab-pane>
                <!-- <el-tab-pane name="pieces-admin" label="Pièces administratives">
                    <administrative-documents />
                </el-tab-pane> -->
            </el-tabs>
            </el-row>
    </div>
</template>

<script>
import AdministrativeDocuments from '../../Components/Maison/AdministrativeDocuments.vue';
import Descriptif from '../../Components/Maison/Descriptif.vue';
import Inspiration from './Inspirations.vue';
  export default {
      components: {
          'administrative-documents': AdministrativeDocuments,
          'descriptif': Descriptif,
          'inspiration': Inspiration
      },
      data() {
          return {
              projetTabs: 'descriptif'
          }
      },
      methods: {
        isMobile() {
            var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

            return x <= 1024;
        },
      }
  }
</script>

<style scoped>
.projet-container {
    margin-top: -3.5rem;
    margin-bottom: 2rem;
}
</style>


