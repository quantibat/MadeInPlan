import Vue from 'vue'
import Router from 'vue-router'

import Login from './Views/Auth/Login.vue'
import Signup from './Views/Auth/Signup.vue'
import Signup2 from './Views/Welcome/Signup2.vue'
import AutoLogin from './Views/Auth/AutoLogin.vue'
import SocialAuthCallback from './Views/Auth/SocialAuthCallback.vue'
import ActivationCallback from './Views/Auth/ActivationCallback.vue'
import ResetPassword from './Views/Auth/ResetPassword.vue'
import ResetPasswordCallback from './Views/Auth/ResetPasswordCallback.vue'
import Profile from './Views/IndexViews/Profile.vue'
import Subscription from './Views/IndexViews/Subscription.vue'

import FormulateNeeds from './Views/TaskForwardViews/FormulateNeeds.vue'

import Index from './Views/Index.vue'

import Information from './Views/Welcome/Information.vue'
import Project from './Views/Welcome/Project.vue'
import Pricing from './Views/Welcome/Pricing.vue'
import UploadPlans from './Views/Welcome/UploadPlans.vue'
import UploadPlansSent from './Views/Welcome/UploadPlansSent.vue'


import Projet from './Views/IndexViews/Projet.vue'
import Maison from './Views/IndexViews/Maison.vue'
import Todolist from './Views/IndexViews/Todolist.vue'
import TaskDetail from './Views/IndexViews/TaskDetail.vue'
import Budget from './Views/IndexViews/Budget.vue'
import Credit from './Views/IndexViews/Credit.vue'
import Inspirations from './Views/IndexViews/Inspirations.vue'
import Terrain from './Views/IndexViews/Terrain.vue'
import Plan from './Views/IndexViews/Plan.vue'
import PlanConfig from './Views/IndexViews/PlanConfig.vue'
import PlanDrawer from './Views/IndexViews/PlanDrawer.vue'
import Chantier from './Views/IndexViews/Chantier.vue'
import Coach from './Views/IndexViews/Coach.vue'
import Prestataires from './Views/IndexViews/Prestataires.vue'
import FinanceFolder from './Components/Credit/FinanceFiles.vue'
// import Artisan from './Views/IndexViews/Artisan.vue'
// import Construction from './Views/IndexViews/Construction.vue'

import PreviewBudget from './Views/Preview/Budget.vue';
import PreviewTodolist from './Views/Preview/Todolist.vue';
import PreviewIndex from './Views/Preview/Index.vue';

Vue.use(Router);

var router = new Router({
    mode: "history",
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index,
            redirect: { name: 'Projet' },
            meta: { requiresAuth: true, requiresPaid: false },
            children: [
                {
                    name: 'Projet',
                    path: 'projet',
                    component: Projet,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                {
                    name: 'Maison',
                    path: 'maison',
                    component: Maison,
                    meta: {
                        requiresAuth: true,
                        requiresPaid: false
                    }
                },
                {
                    name: 'Todolist',
                    path: 'todolist',
                    component: Todolist,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                {
                    name: 'TaskDetail',
                    path: 'todolist/task/:id',
                    component: TaskDetail,
                    meta: { requiresAuth: true, requiresPaid: true }
                },
                {
                    name: 'Budget',
                    path: 'budget',
                    component: Budget,
                    meta: { requiresAuth: false, requiresPaid: false }
                },
                {
                    name: 'Credit',
                    path: 'credit',
                    component: Credit,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                {
                    name: 'Profile',
                    path: 'profile',
                    component: Profile,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                {
                    name: 'Prestataires',
                    path: 'prestataires',
                    component: Prestataires,
                    meta: {
                        requiresAuth: true,
                        requiresPaid: false
                    }
                },
                {
                    name: 'Chantier',
                    path: 'chantier',
                    component: Chantier,
                    meta: {
                        requiresAuth: true,
                        requiresPaid: false
                    }
                },
                {
                    name: 'Inspirations',
                    path: 'inspirations',
                    component: Inspirations,
                    meta: {
                        requiresAuth: true,
                        requiresPaid: false
                    }
                },
                {
                    name: 'Subscription',
                    path: 'subscription',
                    component: Subscription,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                {
                    name: 'Coach',
                    path: 'coach',
                    component: Coach,
                    meta: {
                        requiresAuth: true,
                        requiresPaid: false
                    }
                },
                {
                    name: 'Terrain',
                    path: 'terrain',
                    component: Terrain,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                {
                    name: 'Plan',
                    path: 'plan',
                    component: Plan,
                    meta: { requiresAuth: false, requiresPaid: false }
                },
                {
                    name: 'PlanConfig',
                    path: 'plan/configurator',
                    component: PlanConfig,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                {
                    name: 'PlanDrawer',
                    path: 'plan/:id',
                    component: PlanDrawer,
                    meta: { requiresAuth: true, requiresPaid: false }
                },
                // {
                //     name: 'Artisan',
                //     path: 'artisan',
                //     component: Artisan,
                //     meta: { requiresAuth: true, requiresPaid: false }
                // },
                // {
                //     name: 'Construction',
                //     path: 'construction',
                //     component: Construction,
                //     meta: { requiresAuth: true, requiresPaid: false }
                // }
            ]
        },
        // TASK FORWARD
        {
            path: '/todolist/task/forward/formulateNeeds',
            name: 'FormulateNeeds',
            component: FormulateNeeds,
            meta: { requiresAuth: true, requiresPaid: true }
        },
        {
            name: 'Finance Folder',
            path: '/finance-folder',
            component: FinanceFolder,
            meta: { requiresAuth: true, requiresPaid: false }
        },

        // WELCOME
        {
            path: '/welcome-1',
            name: 'Welcome-1',
            component: Information,
            meta: { requiresAuth: true, requiresPaid: false }
        },
        {
            path: '/welcome-2',
            name: 'Welcome-2',
            component: Project,
            meta: { requiresAuth: true, requiresPaid: false }
        },
        {
            path: '/pricing',
            name: 'Pricing',
            component: Pricing,
            meta: { requiresAuth: true, requiresPaid: false }
        },
        {
            path: '/upload-plans',
            name: 'UploadPlans',
            component: UploadPlans,
            meta: { requiresAuth: true, requiresPaid: false }
        },
        {
            path: '/upload-plans-sent',
            name: 'UploadPlansSent',
            component: UploadPlansSent,
            meta: { requiresAuth: true, requiresPaid: false }
        },
        // PREVIEW
        {
            path: '/preview',
            name: 'PreviewIndex',
            component: PreviewIndex,
            meta: { requiresAuth: false, requiresPaid: false },
            children: [{
                name: 'PreviewBudget',
                path: 'budget/:id',
                component: PreviewBudget,
                meta: { requiresAuth: false, requiresPaid: false }
            }, {
                name: 'PreviewTodolist',
                path: 'todolist/:id',
                component: PreviewTodolist,
                meta: { requiresAuth: false, requiresPaid: false }
            }]
        },
        // AUTH
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: { requiresAuth: false, requiresPaid: false }
        },
        {
            path: '/signup2',
            name: 'Signup2',
            component: Signup2,
            meta: { requiresAuth: false, requiresPaid: false }
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup,
            meta: {
                requiresAuth: false,
                requiresPaid: false
            }
        },
        {
            path: '/auto-login/:key',
            name: 'AutoLogin',
            component: AutoLogin,
            meta: { requiresAuth: false, requiresPaid: false }
        },
        {
            path: '/auth/activation/:token',
            name: 'ActivationCallback',
            component: ActivationCallback,
            meta: { requiresAuth: false, requiresPaid: false }
        },
        {
            path: '/reset',
            name: 'ResetPassword',
            component: ResetPassword,
            meta: { requiresAuth: false, requiresPaid: false }
        },
        {
            path: '/auth/reset/:token',
            name: 'ResetPasswordCallback',
            component: ResetPasswordCallback,
            meta: { requiresAuth: false, requiresPaid: false }
        },
        {
            path: '/auth/callback',
            name: 'SocialAuthCallback',
            component: SocialAuthCallback,
            meta: { requiresAuth: false, requiresPaid: false }
        }
    ],
});

router.beforeEach((to, from, next) => {
    var user = Vue.localStorage.get('user');
    if (to.meta.requiresAuth && (!user || user == undefined || user == null || user == 'null'))
        next({ replace: true, name: 'Login' });
    else next();
});

export default router;
