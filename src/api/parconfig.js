import qs from 'qs'
import axios from 'axios'

axios.defaults.baseURL = 'http://www.immortalchen.xyz/api';
const instance =axios.create();
instance.interceptors.request.use(config=>{
    if(config.method==='post'){
        config.data=qs.stringify(config.data)
    }
    return config
},error=>{
    return Promise.reject(error);
})

instance.interceptors.response.use(res=>{
    return res;
},err=>{
    console.log(err);
    return Promise.reject(err)
})

export default instance