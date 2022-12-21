<template>
  <div>
    <h2>欢迎{{ user.uname }}！您的 uid 为{{ user.uid }}</h2>
    <el-button @click="logout"> 登出 </el-button>
    <el-button @click="refreshRoomList">刷新</el-button>

    <div class="room-card-panel loc-center">
      <el-card class="room-card" v-for="(room,index) in roomList" :key="index" :body-style="{ padding: '0px' }">
<!--        <img style="width: 100%" src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">-->
        <el-image
            style="width: 100%"
            :src="'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'"
            :fit="'fit'"></el-image>
        <div style="padding: 14px;">
          <span>{{ room.name }}</span><br>
          <span>房间号：{{ room.id }}</span>
          <span style="margin-left: 5px">状态: {{ room.status | status }}</span>
          <div>
            <el-button class="button" @click="enterRoom(room)">进入</el-button>
          </div>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
import {getRoomList} from "../../api/request";

export default {
  components: {
  },
  data() {
    return {
      user: {
        uname: "",
        uid: null,
      },
      roomList: []
    };
  },
  methods: {
    logout(){
      // 移除本地用户登录信息
      sessionStorage.removeItem('userInfo');
      // 跳转页面到登录页
      this.$router.push('/login');
    },
    enterRoom(roomMsg){
      this.$router.push({path: '/room', query: {roomMsg: roomMsg}})
    },
    refreshRoomList(){
      getRoomList()
      .then(res=>{
        this.roomList = res.data
      })
    }
  },
  mounted() {
    if (sessionStorage.getItem('userInfo')) {
      // 将用户信息存储到sessionStorage中
      this.user = JSON.parse(sessionStorage.getItem('userInfo'));
    }

    getRoomList()
    .then(res=>{
      this.roomList = res.data
    })
  },
  filters: {
    status(value) {
      switch (value) {
        case 0:
          return '未开始'
          break
        case 1:
          return '进行中'
          break
        case 2:
          return '已结束'
          break
        default:
          return ''
      }
    }
  }
};
</script>

<style scoped>
.room-card-panel {
  width: 100%;
  overflow: hidden;
  padding: 10px 0px;
  display: flex;
  flex-wrap: wrap;
}

.room-card-panel .room-card {
  width: calc(20% - 30px);
  margin-right: 10px;
  margin-bottom: 10px;
  /*display: flex;*/
  /*align-items: center;*/
}

/*.room-card:nth-child(4n) {*/
/*   margin-right: 0;*/
/* }*/

.loc-center {
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
