<template>
<div>
  <div class="container">
    <my-sidebar :myinfo="userinfo" :func="authority"></my-sidebar>
    <div class="zhezhao"></div>
    <div class="content">
      <div class="content_header">
        <img src="../assets/login.png" width="30px" height="30px" class="header_login" @click="tologin">
      </div>
      <div class="content_wrap"></div>
      <router-view></router-view>
    <div class="up">
      <a @click="up"><img src="../assets/up.png"></a>
    </div>
    </div>

  </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import mySidebar from './my-sidebar'

export default {
  components:{'my-sidebar':mySidebar},
  data(){
      return {
      }
  },
  computed:{
    ...mapState({
      userinfo:state=>state.main.userinfo,
      authority:state=>state.main.authority
    })
  },
  methods:{
    up:function(){
      let everystep=document.getElementsByTagName('html')[0].scrollTop/100;
      let timer=window.setInterval(()=>{
        if(document.getElementsByTagName('html')[0].scrollTop>0){
            document.getElementsByTagName('html')[0].scrollTop=document.getElementsByTagName('html')[0].scrollTop-everystep;
        }else{
            document.getElementsByTagName('html')[0].scrollTop=0;
            window.clearTimeout(timer)
        }
      },1)
    },
    tologin(){
      this.$router.push('/login');
    }
  },
  mounted:function(){
      let html= document.getElementsByTagName('html')[0];
      let up=document.getElementsByClassName('up')[0];
      window.addEventListener('scroll',e=>{
        if(html.scrollTop>0){
          up.style.transform="translate(0,0)"
        }else{
          up.style.transform="translate(90px,0)"
        }
      })
    }
    
}
</script>

<style>

*{
  font-family: 'Microsoft YaHei';
  margin: 0;
  padding: 0;
}
.container{
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.content{
  background: #F6F6F6;
  border-radius: 10px;
  min-height: calc(100vh - 50px)
}

.content .content_header{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width:100%;
  height: 40px;
  background: linear-gradient(to right,#2b3b73,#486090)
}
.content .content_wrap{
  height: 40px;
}
.content .content_header .header_login{
  float: right;
  margin-top: 5px;
}
.content .content_header .header_login:hover{
  cursor: pointer;
}

.up{
  transition: all 0.3s linear;
  position: fixed;
  bottom: 30px;
  right: 20px;
  transform: translate(90px,0);
}
.up:hover{
 cursor: pointer;
}
.up img{
 width: 50px;
 height: 50px;
}

</style>


