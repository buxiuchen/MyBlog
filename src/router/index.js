import Vue from 'vue'
import  Router  from "vue-router";
import Login from '@/components/Login'
import App from '@/components/Main'
import Main from '@/components/Index'
import Edit from '@/components/Edit'
import Manage from '@/components/Manage'
import Article from '@/components/Article'
import Overtime from '@/components/Overtime'
import Note from '@/components/Note'
import ajax from '../api/parconfig'
import store from '../store'


Vue.use(Router)
const router=new Router({
    routes:[
        {
            path:'/',
            name:'header',
            component:App,
            children:[{
                path:'/index',
                name:'首页',
                component:Main,
                meta: {
                    requireAuth: true,  
                },
            },
            {
                path:'/edit',
                name:'编辑',
                component:Edit,
                meta: {
                    requireAuth: true,  
                },
            },
            {
                path:'/manage',
                name:'管理',
                component:Manage,
                meta: {
                    requireAuth: true,  
                },
            },
            {
                name:'文章',
                path:'/article/:id',
                component:Article,
                meta: {
                    requireAuth: true,  
                },
            },
            {
                name:'记事本',
                path:'/note',
                component:Note,
                meta: {
                    requireAuth: true,  
                },
            },
        ]
           
        
        },
        {
            path:'/login',
            name:'登录',
            component:Login
        },
        {
            path:'/index/:code',
            component:Overtime,
        },
        

    ]
})

router.beforeEach((to, from, next) => {
    
    if(to.fullPath==='/'){
        next('/index')
    }

    if (to.meta.requireAuth) {
        if (sessionStorage.getItem('immblogtoken')!==null) {
            ajax.post('/checklogin',{token:sessionStorage.getItem('immblogtoken')})
            .then(res=>{
                if(res.data.stutas===200){
                    async function fn(){
                        await store.dispatch('getuserinfo',res.data.info);
                        await store.dispatch('updateau',res.data.info.authority);
                        return true;
                    }
                    fn().then(res=>{
                        console.log(store.state.main);
                        next();
                    })
                }else if(res.data.stutas===404 && to.name!='首页' && to.name!='文章'){
                    next({path: '/index/非法登录'})
                    store.dispatch('getuserinfo',{});
                    store.dispatch('updateau','');
                    console.log("非法登录")
                }else if(res.data.stutas===500 && to.name!='首页' && to.name!='文章'){
                    next({path: '/index/登录超时'})
                    store.dispatch('getuserinfo',{});
                    store.dispatch('updateau','');
                    console.log("登录超时")
                }
            })
        }
        else {
            if(to.name==='首页' || to.name==='文章'){
               next();
            }else{
                console.log(to.name)
                next({path: '/index/非法登录'})
            }
            
           
        }
    }
    else {
        next();
    }


  })

export default router