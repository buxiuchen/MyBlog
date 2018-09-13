<template>
    <div class="articlepage"  v-loading="loading">
        <div class="articleinfo">
            <div class="article_title">{{data.title}}</div>
            <div class="article_author_time">{{data.author}}&nbsp&nbsp{{formattime}}</div>
        </div>
        <div class="article" v-html="data.content" v-highlight></div>
    </div>
</template>
<script>
import hljs from 'highlight.js'
import Vue from 'vue'
import ajax from '../api/parconfig.js'
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block)
  })
})
export default {
    data(){
        return {
            data:'',
            loading:'false'
        }
        
    },
    mounted:function(){
        let par={title:this.$route.params.id};
        this.loading=true;
        ajax.post('/detail',par)
            .then(res=>{
                this.loading=false;
                this.data=res.data
                // console.log(res.data)
            })
    },
    computed:{
        formattime:function(){
            let date=new Date(parseInt(this.data.createtime));
            return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}  ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        },
        
    }
}
</script>
<style>
@import url(https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/default.min.css);
.article{
    animation:article-animation .8s ease-in-out;
    width: 70%;
    margin: 40px auto;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.article img { 
    max-width: 100%;
}
.articleinfo{
    width: 70%;
    margin:40px auto;
    /* box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); */
}
.articleinfo .article_title{
    /* text-align: center; */
    font-size: 30px;
}
.articleinfo .article_author_time{
    /* text-align: center; */
    font-size: 14px;
}
    /* table 样式 */
.article{
   word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
.article table {
    max-width: 100%;
    overflow-x: scroll;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
}
.article table td,
.article table th {
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding: 3px 5px;
}
.article table th {
    border-bottom: 2px solid #ccc;
    text-align: center;
}

/* blockquote 样式 */
.article blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
}

/* code 样式 */
.article code{
    text-indent: 0em;
    font-family: 'Consolas' !important;
    font-size:14px;
    overflow-x: auto;
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
}
.article pre *{
    font-family: 'Consolas' !important;
}
.article pre {
    font-family: 'Consolas' !important;
    font-size:14px;
    width: 100%;
    overflow-x: auto;
    display: inline-block;
    *display: inline;
    *zoom: 1;
    background-color: #f1f1f1;
    border-radius: 3px;
    padding: 3px 5px;
    margin: 0 3px;
}
.article pre code{
    font-family: 'Consolas' !important;
}
.article p{
    line-height: 25px;
    text-indent:2em;
}
.article a{
    color: #ff4081;
    text-decoration: none;
    border-bottom: 1px dotted #ff4081;
}
/* ul ol 样式 */
.article ul, ol {
    margin: 10px 0 10px 20px;
    list-style: none;
}
.article ul li{
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
}
@keyframes article-animation{
    from{
        transform: translate(0,50px);
        opacity: 0;
    }
    to{
        transform: translate(0,0);
         opacity: 1;
    }
}
@media screen and (max-width: 830px){
    .article{
        width: 80%;
    }
}
</style>





