import Vue from 'vue'
import Vuex from 'vuex'
import main from './modules'


Vue.use(Vuex);


export default new Vuex.Store({
    modules:{
        main
    }
})