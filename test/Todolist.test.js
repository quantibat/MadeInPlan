import Vue from 'vue'
import Vuex from 'vuex';
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Checkbox from '../Sources/Components/Todolist/Checkbox.vue'
import { __createMocks as createStoreMocks, mockRequest } from './_mocks_/Todolist.mock.js';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/fr';
import axios from 'axios'
const localVue = createLocalVue();

Vue.use(ElementUI, { locale });
localVue.use(ElementUI, { locale });
Vue.use(Vuex);
localVue.use(Vuex);


describe('Todolist', () => {
    describe('Checkbox', () => {    
        beforeEach(() => {
            storeMocks = createStoreMocks();
            wrapper = shallowMount(Checkbox, {
                propsData: {
                    id: "ac7a758514e87136a17c",
                    done: false,
                    cb: id => id
                },
                store: storeMocks.store,
                mutations: storeMocks.mutations,
                localVue,
            });
            Vue.prototype.$http = mockRequest;
            localVue.prototype.$http = mockRequest;
            store = new Vuex.Store(storeMocks)
        });
    
        it('renders correctly', () => {
            expect(wrapper.html()).toMatchSnapshot("checkbox");
        });

        it('Calls ToggleTask when checked', () => {
            wrapper.find('.switch').trigger('click');
            expect(storeMocks.mutations.toggleTask).toBeCalled();
        });
    });
});
