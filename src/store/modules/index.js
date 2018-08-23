import * as types from '../type'
const state={
    userinfo:{},
    authority: ""
}

const getters={

}
const actions={
    getuserinfo({commit},params){
        commit(types.GET_USERINFO,params);
    },
    updateau({commit},params){
        commit(types.UPDTAE_AU,params);
    }
}
const mutations={
    [types.GET_USERINFO](state,info){
        state.userinfo=info
    },
    [types.UPDTAE_AU](state,info){
        state.authority=info
    }
}

export default{
    state,
    getters,
    actions,
    mutations
}