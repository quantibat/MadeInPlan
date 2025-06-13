<template>
    <div class="main-container">
        <el-row type="flex" align="middle" justify="space-between" class="app top">
                <el-row type="flex" align="middle">
                    <router-link class="header-logo" :to="{ name: 'Index' }">
                        <img src="/Assets/Logo/logo-made-in-plan.png" srcset="/Assets/Logo/logo-made-in-plan@2x.png 2x" class="logo">
                    </router-link>
                </el-row>
                <a href="https://app.madeinplan.fr/signup" class="cta" target="_blank">Créer mon budget</a>
        </el-row>
        <hr />
        <router-view class="child-view"></router-view>
    </div>
</template>

<script>

export default {
    name: 'Index',
}
</script>

<style scoped>
@media only screen and (max-width: 1239px) {
    .child-view { width: 97%; margin: 0 auto; }
    .subscription.child-view {display: flex; flex-direction: column; align-items: center; }
}
@media only screen and (min-width: 1240px) {
    .child-view { width: 96%; margin: 0 auto; }
    .subscription.child-view {display: flex; flex-direction: column; align-items: center; }
}
@media only screen and (min-width : 1440px) {
    .child-view { width: 85%; margin: 0 auto;  }
    .subscription.child-view {display: flex; flex-direction: column; align-items: center; }
}
.app { width: 100%; border-bottom: 1px solid rgba(33, 45, 89, 0);  }

@media only screen and (max-width: 1239px) {
    .app.top { padding: 0 1.5%; margin: 0 auto; }
    .app.list { padding: 0 1.5%; margin: 0 auto; }
    .logo { left: 1.5% }
}
@media only screen and (min-width: 1240px) {
    .app.top { padding: 0 2%; margin: 0 auto; }
    .app.list { padding: 0 15%; margin: 0 auto; }
    .logo { left: 2% }
}
@media only screen and (min-width : 1440px) {
    .app.top { padding: 0 8%; margin: 0 auto; }
    .app.list { padding: 0 16%; margin: 0 auto; }
    .logo { left: 7.5% }
}

.header-links {
    margin-left: 80px;
}


.main-container {
    background: rgba(33, 45, 89, 0.025);
}

.app.top { padding-top: 1.5rem; padding-bottom: 16px; background-color: #fff; z-index: 1;}
.app.top .logo { margin-right: 20px; height: 40px; width: auto; position: relative; bottom: 0px; left: 0px; }
.app.top .logo:hover { cursor: pointer; }
.app.top .item-link { text-decoration: none; opacity: 0.9;  font-size: 17px;  margin: 0 25px; color: #212D59; font-weight: 400; }
.app.top .item-link:hover { cursor: pointer; opacity: 0.7; }
.app.top .item-link.current { font-weight: 600; opacity: 0.9; }

.app.top .budicon { font-size: 20px; }
.app.top .budicon:hover { cursor: pointer; }
.app.top .budicon:focus { outline: none; }
.app.top .budicon-bell{ color: rgba(33, 45, 89, .5); font-weight: 600; font-size: 1.2rem; vertical-align: middle;}
.app.top .budicon-bell:hover {
    color: rgba(33, 45, 89,.9);
}

.app.list .item {
    flex: 1;
}
hr {
    margin: 1.25em 0;
    border-bottom: 1px solid #ededed;
    border-left: none;
    border-right: none;
    border-top: none;
    margin-top: 0 !important;
}

.cta {
    border: none;
    border-radius: 55px;
    color: #fff;
    background: linear-gradient(0deg,#31bdfc,#00d3f7);
    padding: .8rem 1.5rem;
    text-decoration: none;
    box-shadow: 0 4px 8px 0px rgba(0, 0, 0, .15);
    width: 150px;
}
</style>
