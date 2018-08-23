<template>
    <div class="editpage">
        <div class="editpagewrap"></div>
        <div class="eidt_box">
            <el-row>
                <el-col :span="2">文章标题</el-col></el-col>
                <el-col :span="7">
                    <el-input v-model="title" placeholder="文章标题"></el-input>
                </el-col>
                <el-col :span="2">作者</el-col>
                <el-col :span="7">
                    <el-input v-model="author" placeholder="作者"></el-input>
                </el-col>
            </el-row>
            <div ref="editor" style="text-align:left" class="edit"></div>
            <el-button type="primary" style="float:right" @click='addart'>保存</el-button>
        </div>
        
    </div>
</template>

<script>
    import ajax from '../api/parconfig.js'
    import E from 'wangeditor'
    export default {
      name: 'editor',
      data () {
        return {
          editorContent: '',
          title:'',
          author:'admin',
          token:sessionStorage.getItem('immblogtoken')
        }
      },
      methods: {
        addart:function(){
            
            if(this.editorContent==''){
                  this.$message({
                    message: '请输入内容',
                    type: 'error',
                    showClose:true
                    });
                    return
                    
            }
            if(this.title==''){
                  this.$message({
                    message: '请输入标题',
                    type: 'error',
                    showClose:true
                    });
                    return
            }
            if(this.author==''){
                  this.$message({
                    message: '请输入作者',
                    type: 'error',
                    showClose:true
                    });
                    return
            }
            let par={
                title:this.title,
                author:this.author,
                content:this.editorContent,
                createtime:new Date().getTime(),
                token:this.token
            }
            ajax.post('/addart',par)
                .then(res=>{
                    if(res.data.status=="200"){
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                   }else{
                        this.$message({
                            message: '新增失败',
                            type: 'error'
                        });
                   }
                   this.$router.push('/manage')
                })
        }
      },
      mounted() {
        var editor = new E(this.$refs.editor)
        editor.customConfig.onchange = (html) => {
          this.editorContent = html;
        }
        editor.create();
      }
    }
</script>
<style>
.editpage{
    height: 100vh;
}
.editpage .editpagewrap {
    height: 50px;
}

.editpage .eidt_box{
    text-align: center;
    line-height: 40px;
    background-color: #fff;
    width: 70%;
    margin: 40px auto 0px auto;
}
.editpage .edit{
    background-color: #fff;
    width: 100%;
    
    /* margin: 10px auto 0px auto; */
}
.editpage .w-e-text-container{
    height: calc(100vh - 260px) !important;
    z-index:99 !important
}
.editpage .edit .w-e-toolbar{
   flex-wrap: wrap
}
.editpage .edit .w-e-toolbar .w-e-menu{
   z-index:99 !important
}
@media screen and (max-width: 830px){
    .editpage .eidt_box {
        width: 90%;
        margin: 0 auto;
    }
}
</style>
