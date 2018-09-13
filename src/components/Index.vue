<template>
    <div class="indexpage">
        <div class="jumu">
            <div class="headerbg">
                <div class="jumu_content">
                    <div id="header_font">Hello world</div>
                    <div id="header_footer">为你分享我所知道的点滴</div>
                </div>
            </div>
      </div>
      <div class="ar_list"
        v-loading="loading">
        <template v-for="item in formattime">
          <div class="ar_list_info">
              <div class="ar_title" @click="toartilce(item.title)">{{item.title}}</div>
              <div class="ar_author_time">{{item.author}}&nbsp&nbsp{{item.createtime}}</div>
              <div class="ar_content">{{item.content}}</div>
          </div>
        </template>
        <el-pagination
            :small="ifsmall"
            background
            layout="prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
            v-show="!loading">
        </el-pagination>
      </div>
    </div>
</template>
<script>
import ajax from '../api/parconfig.js'
export default {
    data(){
        return {
            loading:false,
            list:[],
            ifsmall:false,
            total:0
        }
    },
    methods:{
        toartilce:function(id){
            this.$router.push('/article/'+id)
        },
        handleCurrentChange:function(index){
            console.log(index)
            ajax.post('/',{page:index})
            .then(res=>{
                this.loading=false;
                this.list=res.data.data;
                this.total=res.data.count
            })
        }
    },
    mounted:function(){
        if(document.documentElement.clientWidth<410){
            this.ifsmall=true
        }
        this.loading=true;
        ajax.post('/',{page:1})
            .then(res=>{
                this.loading=false;
                this.list=res.data.data;
                this.total=res.data.count
            })
    },
    computed:{
        formattime(){
            return this.list.map((item,index)=>{
                let date=new Date(parseInt(item.createtime));
                return {
                    title:item.title,
                    author:item.author,
                    createtime:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                    content:item.content.replace(/<[^>]+>/g,"")
                }
                
            })
        }
    }
};
</script>
<style>
.jumu{
    color: #fff;
  width: 100%;
  height: 320px;
  background:url('../assets/header.jpg');
}
.jumu .headerbg{
  text-align: center;
  width: 100%;
  height: 100%;
  background:rgba(0,0,0,0);
}
.headerbg:hover{
   background:rgba(0,0,0,0.1);
}
.headerbg:hover .jumu_content{
  transform: translate(0,-40px)
}
.headerbg:hover #header_footer{
  opacity: 1;
}
.headerbg .jumu_content{
  transition: all 0.3s linear;
  margin: 0px auto;
  width:250px;
  height: 250px;
  
}
.jumu_content #header_font{
  font-size: 40px;
  padding-top:100px;

}
#header_footer{
  transition: all 0.3s linear;
  opacity: 0;
  font-size: 16px;
  width: 100%;
  margin-top: 20px;
}
.ar_list{
    animation: art .8s ease-in-out;
    position: relative;
    width: 100%;
}
.ar_list_info{
    background-color: #fff;
    margin: 35px auto;
    width: 70%;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 5px;
}
.ar_list_info .ar_title{
    margin: 5px;
    /* padding-bottom: 5px; */
    font-size: 30px;
    font-weight: 500;
    color:#0099FF
}
.ar_list_info .ar_title:hover{
    cursor: pointer;
    color: #00CCFF;
}
.ar_list_info .ar_author_time{
    margin: 5px;
    font-size: 14px;
    color: #888;
}

.ar_list_info .ar_content{
    margin: 5px;
    height: 50px;
    overflow:hidden;/*超出长度的文字隐藏*/
	text-overflow:ellipsis;/*文字隐藏以后添加省略号*/
	white-space:nowrap;

}
.el-pagination{
    position: relative;
    top: -10px;
    width: 100%;
    display: flex;
    justify-content: center;
    padding-left: 0px;
    padding-right: 0px;
}
@keyframes art{
  0%{
    transform: translate(0,50px);
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
@media screen and (max-width: 830px){
    .ar_list_info{
        width: 90% ;
    }
}

</style>


