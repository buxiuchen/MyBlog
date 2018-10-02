<template>
    <div class="note">
        <template v-for="(item,index) in data">
            <my-notecard :data="item" :index="index" :reloading="loading"></my-notecard>  
        </template>
        <div class="note_item">
            <div class="add_item" v-show="!ifadd"><i class="el-icon-plus" @click="ifadd=true"></i></div>
            <el-input
                @change="isempty1=false"
                v-model="new_title"
                v-show="ifadd"
                class="new_input"
                placeholder="标题"
                :class="{'empty':isempty1}">
                </el-input>
            <el-input
                @change="isempty2=false"
                type="textarea"
                v-model="new_content"
                v-show="ifadd"
                class="new_input"
                placeholder="内容"
                :class="{'empty':isempty2}"></el-input>
            <el-button type="danger"  icon="el-icon-close" @click="ifadd=false" v-show="ifadd" class="controlbtn" >取消</el-button>
            <el-button type="success" :icon="success_type" v-show="ifadd" @click="additem" class="controlbtn">保存</el-button>
        </div>
    </div>
</template>

<script>
import ajax from '../api/parconfig.js'
import Mynotecard from './my-notecard'
import {mapState} from 'vuex'
export default {
    components:{'my-notecard':Mynotecard},
    data(){
        return {
            data:[],
            token:sessionStorage.getItem('immblogtoken'),
            ifadd:false,
            isempty1:false,
            isempty2:false,
            success_type:"el-icon-check",
            new_title:'',
            new_content:'',
        }
    },
    computed:{
        ...mapState({
            userinfo:state=>state.main.userinfo
        }),
    },
    mounted:function(){
        this.loading();
    },
    methods:{
        loading:function(){
            ajax.post('/searchnote',{
                user:this.userinfo.user,
                token:this.token
            }).then(res=>{
                this.data=res.data.data;
            })
        },
        additem:function(){
            this.success_type='el-icon-loading';
            if(this.new_title===''){
                document.getElementsByClassName('new_input')[0].querySelector('input').focus();
                this.isempty1=true
            }else if(this.new_content===''){
                document.getElementsByClassName('new_input')[1].querySelector('textarea').focus();
                this.isempty2=true
            }else{
                ajax.post('/addnote',{
                    token:this.token,
                    user:this.userinfo.user,
                    title:this.new_title,
                    content:this.new_content,
                    createtime:new Date().getTime()/1000
                }).then(res=>{
                    if(res.data.status==200){
                        this.success_type='el-icon-check';
                        this.ifadd=false;
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        });
                        this.loading();
                    }else{
                        this.success_type='el-icon-check';
                        this.ifadd=false;
                        this.$message({
                            type: 'warning',
                            message: '添加失败'
                        });
                    }
                })
            }
        }
    }
}
</script>
<style>
.note{
    margin: 0 auto;
    width: 70%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    flex-wrap: wrap;
}
.new_input input{
    border-top: none;
    border-left: none;
    border-right: none;
}
.new_input input,textarea{
    margin: 10px;
    width: 94% !important;
}
.add_item{
    color: #DDDDDD;
    margin:10px auto;
    width: 90%;
    height: 180px;
    line-height: 180px;
    text-align: center;
    font-size: 100px;
    border: 1px dashed #DDDDDD;
    border-radius: 10px;
}
.add_item:hover{
    cursor: pointer;
    color: #486090;
    border: 1px dashed #486090;
    background-color: #F6F6F6
}

.controlbtn{
    margin: 5px;
    float: right;
    padding: 5px 10px !important;
}
.empty{
    animation: shake .1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}
.empty input:focus{
    border-bottom:1px solid red;
}
.empty textarea:focus{
    border:1px solid red;
}
@keyframes shake{
    0%{
        transform: translateX(0px)
    }
    25%{
        transform: translateX(-10px)
    }
    50%{
        transform: translateX(0px)
    }
    75%{
        transform: translateX(10px)
    }
    100%{
        transform: translateX(0px)
    }
}
@media screen and (max-width:400px){
    .note{
        width: 100%;
    }
    .el-message-box{
        width: 300px;
    }
}
</style>


