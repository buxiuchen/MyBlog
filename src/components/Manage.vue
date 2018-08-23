<template>
    <div>
        <div class="manage_wrap"></div>
        <div class="manage">
            <div class="uodateinfo">
                <div class="info_img">
                    <el-upload
                        class="avatar-uploader"
                        :action="actionurl"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="userinfo.imgurl" :src="userinfo.imgurl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
                <div class="info_detail">
                        <div class="nickname">{{userinfo.nickname}}</div>
                        <div class="sign">{{userinfo.sign}}</div>
                        <el-button type="primary" icon="el-icon-setting" @click="infoVisible = true">修改信息</el-button>
                </div>
            </div>

            <div class="editarticle">
                <div class="artedittitle">文章编辑<el-button icon="el-icon-plus" circle style="margin-left:10px" @click="addmewart"></el-button></div>
                <ul>
                    <template v-for="item in artlist">
                        <li><img src="../assets/edit.png" width="30px" height="30px"><span  @click="editarticle(item.title)">{{item.title}}</span></li>
                    </template>
                </ul>
            </div>
        </div>


        <el-dialog title="信息修改" :visible.sync="infoVisible">
            <div class="info_row">
                <div class="info_id info_item">id:<el-input v-model="userinfo.user" placeholder="id" :disabled="true"></el-input></div>
               <div class="info_nickname info_item">昵称:<el-input v-model="userinfo.nickname" placeholder="昵称"></el-input></div>
            </div>
            <div class="info_row">
                <div class="info_sign info_item">签名:<el-input v-model="userinfo.sign" placeholder="签名"></el-input></div>
                <div class="info_sex info_item">性别: 
                    <div><el-select v-model="userinfo.sex" placeholder="请选择" style="width:300px">
                        <el-option value="男" label="男" key="1"></el-option>
                        <el-option value="女" label="女" key="0"></el-option>
                    </el-select></div>
                </div>
            </div>
            <el-collapse>
                <el-collapse-item>
                    <template slot="title">
                        修改密码<i class="el-icon-star-on"></i>
                        
                    </template>
                    <div class="info_item">原密码:<el-input v-model="oldpwd" placeholder="请输入原密码" type="password"></el-input></div>
                    <div class="info_item">新密码:<span class="update_warm" v-show="newpwd_show">请输入新密码</span><el-input v-model="newpwd" placeholder="请输入新密码" type="password"></el-input></div>
                    <div class="info_item">再次输入:<span class="update_warm" v-show="again_show">请再次输入新密码</span><span class="update_warm" v-show="diff_warm">两次密码不相同</span><el-input v-model="again_newpwd" placeholder="请再次输入新密码" type="password"></el-input></div>
                </el-collapse-item>
            </el-collapse>
            <div slot="footer" class="dialog-footer">
                <el-button @click="infoVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateuserinfo">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑" :visible.sync="articleVisible" v-loading="arloading" width="90%" :append-to-body="true" :fullscreen="true">
            <div class="info_row flex_edit">
                <div class="info_item" style="width:250px">标题<el-input v-model="title" placeholder="标题" ></el-input></div>
                <div class="info_item" style="width:250px">作者:<el-input v-model="author" placeholder="作者"></el-input></div>
                <el-button type="success" icon="el-icon-check" circle style="height:40px;margin-top:20px" @click="saveart"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle style="height:40px;margin-top:20px"  @click="deleteart"></el-button>
            </div>
            <div ref="editor" style="text-align:left" class="edit" v-loading="arloading"></div>  
            <div slot="footer" class="dialog-footer">
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import E from 'wangeditor'
import ajax from '../api/parconfig.js'
 export default {
    data() {
      return {
        artlist:[],
        arloading:false,
        infoVisible:false,
        articleVisible:false,
        // imageUrl: '',
        oldpwd:'',
        newpwd:'',
        newpwd_show:false,
        again_newpwd:'',
        again_show:false,
        diff_warm:false,
        artlist:'',
        title:'',
        author:'admin',
        editor:'',
        content:'',
        token:sessionStorage.getItem('immblogtoken')
      };
    },
    computed:{
        ...mapState({
            userinfo:state=>state.main.userinfo
        }),
        actionurl:function(){
            return "http://www.immortalchen.xyz/api/upload?user="+this.userinfo.user
        }
    },
    methods: {

        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        } ,
        editarticle:function(title){
            this.articleVisible=true;
            this.arloading=true;
            let par={title:title};
            if(document.getElementsByClassName('el-dialog__body')[0]===undefined){
                setTimeout(()=>{
                    this.editor = new E(this.$refs.editor)
                    this.editor.customConfig.onchange = (html) => {
                        this.content = html;
                    }
                      this.editor.create();

                       ajax.post('/detail',par)
                            .then(res=>{
                                this.arloading=false;
                                this.content=res.data.content;
                                this.editor.txt.html(this.content);
                                this.title=res.data.title;
                                this.author=res.data.author;
                                this.artid=res.data._id;
                            })
                },100)
            }else{
                ajax.post('/detail',par)
                .then(res=>{
                    this.arloading=false;
                    this.content=res.data.content
                    this.editor.txt.html(this.content);
                    this.title=res.data.title;
                    this.author=res.data.author;
                    this.artid=res.data._id;
                })
            }
            
            },
            saveart:function(){
                if(this.title===''){
                    this.$message({
                            message: '不能修改标题为空',
                            type: 'error'
                        });
                }else if(this.author===''){
                    this.$message({
                            message: '不能修改作者为空',
                            type: 'error'
                        });
                }else if(this.content===''){
                    this.$message({
                            message: '不能修改内容为空',
                            type: 'error'
                        });
                }else{
                    let par={
                        id:this.artid,
                        title:this.title,
                        content:this.content,
                        author:this.author,
                        token:this.token
                    }
                    ajax.post('/saveart',par)
                    .then(res=>{
                    if(res.data.status=="200"){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                    }else{
                            this.$message({
                                message: '修改失败',
                                type: 'error'
                            });
                    }
                    this.$router.push('/index')
                    })
                }
            },
            deleteart:function(){
                this.$alert('确定删除吗', '警告', {
                    confirmButtonText: '确定',
                    callback: action => {
                        if(action=='confirm'){
                            ajax.post('/deleteart',{id:this.artid,token:this.token})
                                .then(res=>{
                                    if(res.data.status=='200'){
                                        this.$message({
                                            message: '删除成功',
                                            type: 'success'
                                        });
                                        // this.$router.push('/manage')
                                        // this.$router.go(0)
                                        location.reload()
                                    }
                                })
                        }
                    }
                    });
            },
            addmewart:function(){
                this.$router.push('/edit');
            },
            updateuserinfo:function(){
                if(this.oldpwd===''){
                    let par={
                        user:this.userinfo.user,
                        nickname:this.userinfo.nickname,
                        sign:this.userinfo.sign,
                        sex: this.userinfo.sex,
                        token:this.token
                    }
                    ajax.post('/updateuser',par)
                        .then(res=>{
                            if(res.data.status===200){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.infoVisible=false
                            }else{
                                 this.$message({
                                    message: '修改失败',
                                    type: 'error'
                                });
                            }
                        })
                }else{
                    if(this.newpwd===''){
                        this.newpwd_show=true;
                        this.again_show=false;
                        this.diff_warm=false;
                        return 
                    }
                    if(this.again_newpwd===''){
                        this.newpwd_show=false;
                        this.again_show=true;
                        this.diff_warm=false;
                        return 
                    }
                    if(this.again_newpwd!=this.newpwd){
                        this.newpwd_show=false;
                        this.again_show=false;
                        this.diff_warm=true;
                        return 
                    }
                    let par={
                        user:this.userinfo.user,
                        password:this.oldpwd,
                        new_pwd:this.newpwd,
                        token:this.token
                    }
                    ajax.post('/updatepassword',par)
                        .then(res=>{
                            if(res.data.status===200){
                                this.again_newpwd='';
                                this.newpwd='';
                                this.oldpwd=''
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                });
                                this.infoVisible=false
                            }else if(res.data.status===-1){ 
                                this.$message({
                                    message: '密码错误',
                                    type: 'error'
                                });
                            }else{
                                 this.$message({
                                    message: '修改密码失败',
                                    type: 'error'
                                });
                            }
                        })
                }
            }
        },
    mounted:function(){
        ajax.post('/manage')
            .then(res=>{
                this.artlist=res.data;
            })
    }
  }
</script>
<style>
.manage .manage_wrap{
    height: 40px;
}
.manage{
    background: #fff;
    border-radius: 10px;
    width: 70%;
    margin:0 auto;
}
.info_item{
    margin: 10px;
    width: 300px;
}
.update_warm{
    margin-left: 10px;
    font-size: 14px;
    color: red
}
.manage .uodateinfo{
    display: flex;
    width:100%;
    height: 140px;
}
.manage .uodateinfo .info_img{
    margin-left: 20px;
}
.manage .uodateinfo .info_detail{
    margin-left: 20px;
}
.manage .uodateinfo .nickname{
    margin-top:20px;
    height: 40px;
    font-size: 30px;
}
.manage .uodateinfo .sign{
    line-height: 40px;
    height: 40px;
    font-size: 20px;
}
.manage .editarticle{
    margin-top: 50px;
}
.manage .editarticle  .artedittitle{
    font-size:20px;
    margin-left: 20px;
}

.manage .editarticle ul li{
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin:0 10px 0 10px;
    font-size: 20px;
    list-style: none;
    height: 50px;
    border-bottom: 1px solid #CCCCFF;
    line-height: 50px;
}
.manage .editarticle ul li img{
    vertical-align: middle;
}
.manage .editarticle ul li span:hover{
    cursor: pointer;
    color: #666666;
}
.avatar-uploader .el-upload {
    margin-top:25px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
  .info_row{
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
  }
  .flex_edit{
      justify-content:flex-start;
  }
  .el-dialog__body .w-e-toolbar{
      flex-wrap: wrap
  }
  .el-dialog__body .edit{
      width: 100%;
  }
  .el-dialog__body .w-e-text-container{
      height: 100% !important;
  }
  @media screen and (max-width: 830px){
    .manage{
        width: 90%;
    }
    .content .el-dialog{
        width: 90%;
        margin-top:5vh !important
    }
}
</style>


