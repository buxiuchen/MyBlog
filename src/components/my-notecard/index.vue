<template>
    <div class="note_item" :ref="index">
        <div class="item_title">
            <div v-show="!inputshow">{{data.title}}</div>
            <el-input v-model="data.title" v-show="inputshow"></el-input>
            <el-button type="success" circle><i class="el-icon-edit" @click="updateitem"></i></el-button>
            <el-button type="danger" circle @click="deleteitem(data._id)"><i class="el-icon-delete"></i></el-button>
        </div>
        <div class="item_content">
            <div v-show="!inputshow">{{data.content}}</div>
            <el-input type="textarea" v-model="data.content" v-show="inputshow"></el-input>
            <el-button type="danger"  icon="el-icon-close" @click="inputshow=false" v-show="inputshow" class="controlbtn">取消</el-button>
            <el-button type="success" :icon="success_type" v-show="inputshow" @click="saveitem(data._id,data.title,data.content)" class="controlbtn">保存</el-button>
        </div>
    </div>
</template>
<script>
import ajax from '../../api/parconfig.js'
import {mapState} from 'vuex'
export default {
    props: {
        data:Object,
        index:Number,
        reloading:Function
    },
    data(){
        return {
            token:sessionStorage.getItem('immblogtoken'),
            inputshow:false,
            success_type:"el-icon-check",
        }
    },
    computed:{
        ...mapState({
            userinfo:state=>state.main.userinfo
        }),
    },
    watch:{
        inputshow:function(){
            let inner=this.$refs[this.index].getElementsByClassName('item_title')[0];
            if(this.inputshow){
                inner.style.backgroundColor='white';
            }else{
                inner.style.backgroundColor='#486090';
            }
        }
    },
    methods:{
        deleteitem:function(id){
           this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                ajax.post('/delnote',{
                    token:this.token,
                    user:this.userinfo.user,
                    id:id
                }).then(res=>{
                    if(res.data.status==200){
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.reloading();
                    }else{
                        this.$message({
                            type: 'success',
                            message: '删除失败'
                        }); 
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            }); 
        },
        updateitem:function(){
            this.inputshow=true;
        },
        saveitem:function(id,title,content){
            this.success_type='el-icon-loading';
            ajax.post('/updatenote',{
                token:this.token,
                user:this.userinfo.user,
                id:id,
                title:title,
                content:content
            }).then(res=>{
                if(res.data.status==200){
                    this.success_type='el-icon-check';
                    this.inputshow=false;
                    this.$message({
                        type: 'success',
                        message: '更新成功'
                    });   
                }else{
                    this.inputshow=false;
                    this.$message({
                        type: 'warning',
                        message: '更新失败'
                    }); 
                }
            })
        },
    }

}
</script>
<style>
.note_item{
    overflow: hidden;
    border-radius: 10px;
    margin: 25px 0;
    width: 300px;
    height: 200px;
    background: white;
    box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
}
.note_item .el-form-item{
    margin: 22px 12px 22px 0;
}
.item_title{
    transition: all 0.3s;
    line-height: 30px;
    padding-left:10px;
    height: 30px;
    background: #486090;
    color: white;
}
.item_title   .el-button{
    float: right;
    margin-right: 10px;
    margin-top: 3px;
}
.item_title   .el-button.is-circle {
    padding: 4px;
}
.item_title   input{
    height: 25px;
    border:none;
    border-bottom: 1px solid #dcdfe6;
}
.item_title   div{
    display: inline-block;
    width: 170px;
    overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;
}
.item_title   .el-input{
    left:10px;
    top: 2px;
}
.item_content{
    background: white;
    padding: 10px 10px;
}

.item_content   .el-textarea__inner{
    height: 110px;
}
</style>


