<template>
    <div id="container">
        <div class="login_content">
            <div class="login_img"></div>
            <div class="login_box">
                <div class="login_title">
                    Welcome to my blog!
                </div>
                <div class="login_item">
                    <label class="form_label" for="username">用户名<span class="login_warm" v-show="warm1_show">请输入用户名</span></label>
                    <input type="text" id="username" autocomplete="off" placeholder="用户名" v-model="username">
                </div>
                <div  class="login_item">
                    <label class="form_label" for="password">密码<span class="login_warm" v-show="warm2_show">请输入密码</span></label>
                    <input type="password" id="password" autocomplete="off" placeholder="密码" v-model="password" @keyup.13="enter">
                </div>
                <button class="login_buttom" @click="login">登录</button>
                <div class="toindex" @click="todindex">跳过登录</div>    
            </div>
        </div>
    </div>
</template>
<script>
import ajax from '../api/parconfig.js'

export default {
    data(){
        return {
            username:'',
            password:'',
            warm1_show:false,
            warm2_show:false
        }
    },
    computed:{
    },
    methods:{
        login:function(){
            if(this.username===''){
                this.warm1_show=true
                this.warm2_show=false
                return 
            }
            if(this.password===''){
                this.warm1_show=false
                this.warm2_show=true
                return 
            }
            ajax.post('/check',{username:this.username,password:this.password})
                .then(res=>{
                    if(res.data.stutas=='200'){
                        sessionStorage.setItem("immblogtoken",res.data.info.token)
                        let info={
                            user:res.data.info.user,
                            nickname:res.data.info.nickname,
                            sign:res.data.info.sign,
                            authority:res.data.info.authority,
                            sex:res.data.info.sex,
                            imgurl:res.data.info.imgurl
                        }
                        if(info.authority==='admin'){
                            this.$store.dispatch('updateau','admin')
                        }
                        this.$store.dispatch('getuserinfo',info)
                        this.$router.push('/index')
                    }else if(res.data.stutas===-1){
                        this.$message({
                            message: '没有该账号',
                            type: 'error'
                        });
                        this.usernae='';
                    }else if(res.data.stutas===0){
                        this.$message({
                            message: '密码错误',
                            type: 'error'
                        });
                        this.password='';
                    }
                })
        },
        todindex:function(){
            this.$router.push('/index')
        },
        enter:function(){
            this.login();
        }
    }
}
</script>
<style>
*{
    margin: 0;
    padding: 0;
}
.login_box .login_title{
    margin: 100px;
    text-align: center;
    font-size: 40px; 
}
.login_box #username{
    background-image: url(../assets/user.png);
}
.login_box #password{
    background-image: url(../assets/password.png);
}
.login_box .login_item{
    margin: 40px auto;
    height: 40px;
    width: 300px;
}
.login_box .login_item .login_warm{
    margin-left: 10px;
    font-size: 14px;
    color: red
}
.login_box .login_item input{
    display: block;
    height: 35px;
    width: 265px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding-left: 35px;
    background-repeat: no-repeat;
    background-size: 25px 25px;
    background-position-y: 5px;
    background-position-x: 5px;
}
.login_box .login_item .form_label{
    display: block;
}
.login_box .login_buttom{
    color: #fff;
    background-color: #58A1F5;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0px;
    display: block;
    margin: 0px auto;
    width: 300px;
    height: 37px;
}
.login_box .toindex{
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: #58A1F5;
}
.login_box .toindex:hover{
    cursor: pointer;
    text-decoration: none;
}
.login_box .login_buttom:hover{
    cursor: pointer;
}
 #container .login_content{
     background: #fff;
    overflow: hidden;
    border-radius: 5px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 80vw;
    height: 80vh;
    margin: 0 auto;
    position: relative;
    top:10vh;
}
#container{
    width: 100vw;
    height: 100vh;
    background-color: #f6f6f6
}
 #container .login_img{
     background: url('../assets/15870.jpg');
     background-repeat: no-repeat;
     background-position: center;
     width: 50%;
     flex-grow: 1
}
#container .login_box{
     flex-grow: 1;
     width: 50%;
     box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
}
@media screen and (max-width: 830px){
    #container .login_content{
        top: 5vh;
        width:90vw;
        height: 90vh
    }
    #container .login_img{
        background: url('../assets/15870.jpg');
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;

    }
    #container .login_box{
        color: #fff;
        width: 100%;
        position: absolute;
        z-index: 100;
        background:rgba(0,0,0,.6);
        height: 100%;
    }
    #container .login_title{
        margin: 50px;
    }
}


</style>


