<template>
    <div class="mysidebar">
      <div class="sidebar_wrap" v-show="show"></div>
      <div class="sidebar_content">
        <div class="sidebar_btn" @click="handlesidebar">
          <img :src="now_img" width="30px" height="30px" id="btn_icon">
        </div>
        <div class="mysidebar-info">
          <div class="mysidebar-icon">
            <img :src="myinfo.imgurl" alt="">
          </div>
          <div class="mysidebar-nicker">{{myinfo.nickname}}</div>
          <div class="mysidebar-sign">{{myinfo.sign}}</div>
        </div>
        <div class="mysidebar-menulist">
          <ul>
            <template v-for="item in list">
              <li><img :src="item.imgsrc"><a :href="item.url">{{item.name}}</a></li>
            </template>
          </ul>
        </div>
        <div class="weather">
          <div class="weather_info" v-show="weathershow">
            <div>{{position}}</div>
            <div>{{tem}}℃</div>
          </div>
          <img src="./assets/weather.png"  width="30px" height="30px" @click="weather" v-show="!loading">
          <img src="./assets/loading.png"  width="30px" height="30px" v-show="loading" class="loading">
        </div>
      </div>
    </div>
</template>
<script>
import ajax from '../../api/parconfig'
import {mapState} from 'vuex'
import * as listdata from './data.js'
export default {
  data() {
    return {
      show:false,
      list:listdata.list,
      loading: false,
      now_img: require("./assets/menu.png"),
      clientwidth:document.documentElement.clientWidth,
      lastcursor:250,
      overcursor:0,
      position:'',
      tem:'',
      weathershow:false
    };
  },
  computed:{
    ...mapState({
      authority:state=>state.main.authority,
      myinfo:state=>state.main.userinfo
    })
  },
  methods: {
    close() {
      let sidebar = document.getElementsByClassName("sidebar_content")[0];
      let btn = document.getElementById("btn_icon");
      sidebar.style.transform = "translate(-250px,0)";
      btn.style.transform = "translate(0,0)";
      this.now_img = require("./assets/menu.png");
      this.show = false;
    },
    open() {
      let sidebar = document.getElementsByClassName("sidebar_content")[0];
      let btn = document.getElementById("btn_icon");
      sidebar.style.transform = "translate(0,0)";
      btn.style.transform = "translate(0,0)";
      this.now_img = require("./assets/close.png");
      this.show = true;
    },
    handlesidebar() {
      if (this.show) {
        this.close();
      } else {
        this.open();
      }
    },
    weather:function(){
      this.loading=true;
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(Position=>{
          ajax.post('https://free-api.heweather.com/s6/weather/now?key=3360423bf4cc430888e26b863c60a1ab&location='+Position.coords.longitude+','+Position.coords.latitude)
            .then(res=>{
              this.position=res.data.HeWeather6[0].basic.location
              this.tem=res.data.HeWeather6[0].now.tmp
              this.weathershow=true;
              console.log(this.loading)
              this.loading=false;
            })
        },err=>{
          this.weathershow=false;
          this.loading=false;
          switch(err.code)
          {
          case err.PERMISSION_DENIED:
            this.$message({message: '拒绝使用定位服务',type: 'error'});
            break;
          case err.POSITION_UNAVAILABLE:
            this.$message({message: '不可用的位置信息',type: 'error'});
            break;
          case err.TIMEOUT:
            this.$message({message: '位置信息请求超时',type: 'error'});
            break;
          case err.UNKNOWN_ERROR:
            this.$message({message: '未知错误',type: 'error'});
            break;
          }
        })
      }
      
    }
  },
  watch: {
    show: function() {
      if (this.show) {
        this.open();
      } else {
        this.close();
      }
    },
    authority:function(){
      if(this.authority==='admin'){
        if(this.list.length>3){
          this.list.pop();
        }
        this.list.push({
          name:'Management',
          imgsrc:require('./assets/manage.png'),
          url:'http://www.immortalchen.xyz/#/manage'
        })
      }
    }

    
  },
  mounted: function() {
    if(this.authority==='admin'){
        if(this.list.length>3){
          this.list.pop();
        }
        this.list.push({
          name:'Management',
          imgsrc:require('./assets/manage.png'),
          url:'http://www.immortalchen.xyz/#/manage'
        })
      }
    
    if(this.myinfo.nickname===undefined){
      this.myinfo.nickname='Immortal';
      this.myinfo.sign='为你分享我所知道的点滴',
      this.myinfo.imgurl=require('../../assets/headerico.jpg')
    }
    let mysidebar = document.getElementsByClassName("sidebar_content")[0];
    let sidebar_btn= document.getElementsByClassName("sidebar_btn")[0];
    let sidebar_btnimg=document.getElementById('btn_icon');
    
    document.addEventListener("click", e => {
      if (!mysidebar.contains(e.target) && e.target!=sidebar_btn && this.show) {
        this.show = false;
      }
    });
    /*
      移动端触摸事件
    */
    document.addEventListener("touchstart", e => {
      mysidebar.style.transition = "none";
      if (mysidebar.contains(e.target)) {
        this.lastcursor = e.touches[0].clientX;
      }
    });
    document.addEventListener("touchmove", e => {
      if (mysidebar.contains(e.target) && e.target!=sidebar_btn && e.target!=sidebar_btnimg) {
        if (this.lastcursor - e.touches[0].clientX < 0) {
          mysidebar.style.transform = "translate(0,0)";
        } else {
          mysidebar.style.transform ="translate(" +parseInt(-(this.lastcursor - e.touches[0].clientX)) +"px,0)";
        }
      }
    });
    document.addEventListener("touchend", e => {
      mysidebar.style.transition = "all .3s ease-in-out";
      if (mysidebar.contains(e.target) && e.target!=sidebar_btn && e.target!=sidebar_btnimg ){
        this.overcursor = e.changedTouches[0].clientX;
        if (this.lastcursor - this.overcursor < 140) {
          this.open();
        }
        if (this.lastcursor - this.overcursor > 140) {
          this.close();
        }
      }
    });
  }

  



};
</script>
<style>
.mysidebar .sidebar_content{
  color: #666666;
  transform: translate(-250px, 0);
  transition: all 0.3s ease-in-out;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  height: 100vh;
  width: 250px;
  background: #fff;
  border-radius: 2px;
}
.mysidebar .sidebar_wrap{
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
.mysidebar .sidebar_btn {
  border: none;
  margin-top: 5px;
  transition: all 0.3s ease-in-out;
  width: 30px;
  height: 30px;
  float: right;
  transform: translate(30px, 0);
}
.mysidebar .sidebar_btn :hover{
  cursor: pointer;
}
.mysidebar-info{
  background: url('./assets/sidebarheader.jpg');
  width: 100%;
  height: 250px;
}
.mysidebar-info .mysidebar-icon{
  position: relative;
  top:15px;
  width:100px;
  height: 100px;
  border-radius: 50px;
  border: 2px solid #e6e6e6;
  margin: 0 75px 0 75px;
  overflow: hidden;
}
.mysidebar-info .mysidebar-icon img{
  width: 100px;
  height: 100px;
}
.mysidebar-info .mysidebar-nicker{
  padding-top: 30px;
  color: #fff;
  margin: 0px auto;
  width: 100px;
  text-align: center
}
.mysidebar-info .mysidebar-sign{
   color: #fff;
  padding-top: 15px;
  margin: 0px auto;
  width: 100%;
  height: 50px;
  text-align: center
}
.mysidebar-menulist ul{
  list-style: none;
}
.mysidebar-menulist ul li:hover{
  background: linear-gradient(to right,#CCCCFF,#f2f2f2);
  cursor: pointer;
}
.mysidebar-menulist ul li{
  height: 50px;
  line-height: 50px;  
}
.mysidebar-menulist ul li img{
  padding-left:30px;
  padding-right:15px;
  vertical-align: middle;
  width: 30px;
  height: 30px;
}
.mysidebar-menulist ul li a{
  color: #666666;
  text-decoration: none;
}
.mysidebar .weather img{
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.mysidebar .weather img:hover{
  cursor: pointer;
}
.mysidebar .weather_info{
  text-align: center;
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: 0px;
}
.mysidebar .weather_info div:first-child{
  font-size: 20px;
}
.mysidebar .weather_info div:last-child{
  font-size: 40px;
}
.loading{
  animation: loading 1s linear infinite;
}
@keyframes loading {
  0%{
    transform: rotate(0deg)
  }

  100%{
    transform: rotate(360deg)
  }
}
/* @keyframes ul_hover {
  0%{
    background: linear-gradient(to right,#CCCCFF,#CCFFFF)
  }
  50%{
    background: linear-gradient(to right,#CCFFFF,#CCCCFF)
  }
  100%{
   background: linear-gradient(to right,#CCCCFF,#CCFFFF)
  }
} */
</style>
