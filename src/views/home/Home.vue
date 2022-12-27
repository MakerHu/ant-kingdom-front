<template>
  <div style="margin-top: 30px">
    <div class="loc-center" @click="gameBgDialogVisible=true" style="width: 40px;height: 40px;position: absolute; top: 30px; right: 30px;cursor: pointer;">
      <div class="card-shadow" style="position: relative;width: 100%;height: 100%;">
        <img src="../../assets/doorplate.png" alt="" width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
        <span class="loc-center" style="position: absolute; top: 0; left: 0;width: 100%;height: 100%;color: white;font-size: x-large">?</span>
      </div>
    </div>
    <img class="shadow" src="../../assets/ant_kingdom.png" alt="蚂蚁星球" width="30%">
    <h2>欢迎{{ user.uname }}！</h2>
    <el-button @click="logout"> 登出 </el-button>
    <el-button @click="createRoomDialogVisible = true">创建房间</el-button>
    <el-button @click="refreshRoomList">刷新</el-button>

    <div class="room-card-panel loc-center">
      <div class="room-card card-shadow" v-for="(room,index) in roomList" @click="enterRoom(room)" :key="index">
        <el-image
            style="width: 100%;border-radius: 10px 10px 0 0px"
            :src="require('../../assets/room5.jpg')"
            :fit="'fit'"></el-image>
        <img class="shadow" v-if="room.status==0" src="../../assets/ready.svg" alt="" width="25%" style="position: absolute; top: 0; left: 0;">
        <img class="shadow" v-if="room.status==1" src="../../assets/going.svg" alt="" width="25%" style="position: absolute; top: 0; left: 0;">
        <div class="shadow" style="position: absolute; top: 5px; right: 5px;color: white;font-size: large;">{{ room.peopleNum }}人</div>
        <div style="padding: 5px;">
          <div  style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 100%">{{ room.name }}</div>
          <div>房间号：{{ room.id }}</div>
        </div>
      </div>
    </div>

    <el-dialog
        title="创建房间"
        :visible.sync="createRoomDialogVisible"
        width="30%">
      <el-form label-position="right" label-width="80px" :model="createForm">
        <el-form-item label="名称">
          <el-input v-model="createForm.roomName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createRoomDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreateRoom">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="游戏背景"
        :visible.sync="gameBgDialogVisible"
        width="50%">
      <div v-html="gameBackground" style="text-align:left;"></div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import {getRoomList,createRoom} from "../../api/request";

export default {
  components: {
  },
  data() {
    return {
      user: {
        uname: "",
        uid: null,
      },
      roomList: [],
      createRoomDialogVisible: false,
      gameBgDialogVisible: false,
      gameBackground: '',
      createForm: {
        roomName: ''
      }
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
    },
    handleCreateRoom(){
      this.createRoomDialogVisible = false
      createRoom(this.createForm.roomName)
      .then(res => {
        this.$message({
          message: '房间创建成功',
          type: "success",
        });
        this.enterRoom(res.data)
        // this.refreshRoomList()
      })
    },
    readFile() {
      axios.get('/gameBackground.txt').then((data)=>{
        this.gameBackground = data.data
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

    this.readFile()
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
  width: calc(15% - 30px);
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  /*background-color: white;*/
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  position: relative;
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

.shadow {
  filter: drop-shadow(2px 3px 8px #ffffff);
}

.card-shadow {
  filter: drop-shadow(2px 3px 8px #d5c7c7);
}

.card-shadow:hover {
  filter: drop-shadow(2px 3px 8px #ffffff);
}
</style>
