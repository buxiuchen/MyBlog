<template>
    <div class="note">
        <template v-for="item1 in formatdata">
            <div class="note_row">
                <template v-for="item2 in item1">
                    <div class="note_item">
                        
                    </div>
                </template>
            </div>
        </template>
    </div>

</template>

<script>
import ajax from '../api/parconfig.js'
import {mapState} from 'vuex'
export default {
    data(){
        return {
            data:[],
            token:sessionStorage.getItem('immblogtoken')
        }
    },
    computed:{
        ...mapState({
            userinfo:state=>state.main.userinfo
        }),
        formatdata:function(){
            let data=[];
            let temp=[];
            let initnum=1;
            for(let i=0;i<this.data.length;i++){
                if((i+1)/3<initnum){
                    temp.push(this.data[i]);
                }
                if(i===this.data.length-1){
                    data.push(temp)
                }else{
                    if((i+1)/3==initnum){
                        temp.push(this.data[i]);
                        initnum++;
                        data.push(temp);
                        temp=[];
                    }
                }
            }
            return data
        }
    },
    mounted:function(){
        ajax.post('/searchnote',{
            user:this.userinfo.user,
            token:this.token
        }).then(res=>{
            this.data=res.data.data
        })
    }
}
</script>
<style>
.note{
    margin: 0 auto;
    width: 70%;
}
.note_row{
    margin-top: 20px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between
}
.note_row:first-child div{
     margin-top: 50px !important;
}
.note_item{
    background: white;
    width: 350px;

}
</style>


