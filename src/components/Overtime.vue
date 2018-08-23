<template>
    <div class="checkfaile">
        <div class="checkrow">
            <div class="checkfail_img"><img src="../assets/overtime.png" alt=""></div>
            <div class="checkfail_code">
                {{this.$route.params.code}}
            </div>
        </div>
        <div class="check_warm">3秒后跳转到登录页~~~</div>
    </div>
</template>

<script>
export default {
    data:{
        warmpageurl:"",
    },
    mounted:function(){
        setTimeout(() => {
            this.$router.push('/login');
        }, 4000);
    }
}
</script>

<style>
.checkfaile{
    width: 80%;
    height: 100vh;
    margin: 0 auto
}
.checkfaile .check_warm{
   text-align: center;
   width: 100%;
}
.checkfaile .checkrow{
    font-size: 100px;
    display: flex;
    flex-wrap: wrap;
    min-height: 250px;
    line-height: 250px;
    justify-content: center
}
.checkfaile .checkfail_img{
    margin-top: 25px;
    font-size: 100px;
    height: 100%;

}
.checkfaile .checkfail_code{
    text-align: center;
    font-size: 70px;
    width: 200px;
    width: 350px;
}
</style>


