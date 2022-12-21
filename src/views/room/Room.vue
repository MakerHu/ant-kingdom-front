<template>
  <div class="room-content">
    <el-row class="row-one">
      <el-col class="loc-center" :span="4" style="background-color: orange">
          <el-avatar style="height: 80px;width: 80px" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
      </el-col>
      <el-col :span="16" style="background-color: gray">
        <el-row style="height: 100%;" :gutter="5">
          <el-col :span="3" v-for="o in 8" :key="o" class="loc-center">
            <el-card class="box-card loc-center" :body-style="{ padding: '0px' }">
              <img src="../../assets/ant.png" alt="蚂蚁" height="50">
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4" style="background-color: orange">
        <div>
          {{ roomMsg?roomMsg.name:'' }}: {{ roomMsg?roomMsg.id:'' }}
        </div>
        <el-button :disabled="ready" @click="readyGame()">{{ ready | readyBtn }}</el-button>
      </el-col>
    </el-row>

    <el-row class="row-two">
      <el-col :span="6" class="loc-center" style="background-color: gray">
        <el-card>
          <div slot="header" class="loc-center">
            <span>计分板</span>
          </div>
          <div>
            {{ enemy ? enemy.user.uname:'' }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="background-color: orange">
        <el-row class="center-row" :gutter="5" style="background-color: chartreuse">
          <el-col :span="6" v-for="o in 4" :key="o" class="loc-center">
            <el-card class="box-card">
              <div v-for="o in 4" :key="o">
                {{'列表内容 ' + o }}
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="center-row-two" :gutter="5" style="background-color: aqua">
          <el-col :span="24" class="loc-center">
            <el-card style="width:20%;height: 90%" :body-style="{ padding: '0px' }">
              <div>
                <span>环境：</span>
                <span>{{ roomInfo && roomInfo.environmentCard ? roomInfo.environmentCard.name:'' }}</span>
              </div>
              <div>
                <span>消耗：</span>
                <span>{{ roomInfo ? roomInfo.environmentRice:'' }}米</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="center-row" :gutter="5" style="background-color: chartreuse">
          <el-col :span="6" v-for="o in 4" :key="o" class="loc-center">
            <el-card class="box-card">
              <div v-for="o in 4" :key="o">
                {{'列表内容 ' + o }}
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6" class="loc-center" style="background-color: gray">
        <img src="../../assets/forest.png" alt="野外" height="200">
        <el-button v-show="this.playCardList.length == 2 && (this.currentStatus == 'show' || this.currentStatus == 'hide')" @click="playCards()">出牌</el-button>
      </el-col>
    </el-row>

    <el-row class="row-one">
      <el-col class="loc-center" :span="4" style="background-color: orange">
        <el-card>
          <div>粮仓</div>
          <div>{{ player ? player.rice:'' }}</div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-row style="height: 100%;" :gutter="5">
          <el-col :span="3" v-for="(idleCard,index) in player?player.idleCardList:[]" :key="index" class="loc-center">
            <el-card class="box-card" :shadow="idleCard.shadow? 'always':'never'" :body-style="cardBodyStyle" @click.native="idleCard.shadow = selectCard(index, idleCard.shadow)">
              <div>
                <div><span>卡名：</span><span>{{ idleCard.name }}</span></div>
                <div><span>消耗米粒：</span><span>{{ idleCard.rice }}</span></div>
                <div><span>基础战力：</span><span>{{ idleCard.initValue }}</span></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col class="loc-center" :span="4" style="background-color: orange">
        <el-avatar style="height: 80px;width: 80px" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Room",
  data() {
    return {
      // ws是否启动
      wsIsRun: false,
      // 定义ws对象
      webSocket: null,
      // ws请求链接（类似于ws后台地址）
      ws: '',
      // ws定时器
      wsTimer: null,
      // 用户
      user: null,
      roomMsg: null,
      ready: false,
      roomInfo: null,
      player: null,
      enemy: this.player,
      playCardList: [],
      currentStatus: 'show',// 当前状态show可以出明牌，hide可以出隐藏牌

      cardBodyStyle: {
        padding: '5px',
        textAlign: 'left'
      },
    };
  },
  filters: {
    readyBtn(value) {
      return value ? '已准备':'准备'
    }
  },
  methods: {

    sendDataToServer(msg) {
      if (this.webSocket.readyState === 1) {
        this.webSocket.send(msg)
      } else {
        throw Error('服务未连接')
      }
    },
    /**
     * 初始化ws
     */
    wsInit() {
      let wsuri = 'ws://localhost:8081/websocket/'+this.user.uid
      this.ws = wsuri
      if (!this.wsIsRun) return
      // 销毁ws
      this.wsDestroy()
      // 初始化ws
      this.webSocket = new WebSocket(this.ws)
      // ws连接建立时触发
      this.webSocket.addEventListener('open', this.wsOpenHanler)
      // ws服务端给客户端推送消息
      this.webSocket.addEventListener('message', this.wsMessageHanler)
      // ws通信发生错误时触发
      this.webSocket.addEventListener('error', this.wsErrorHanler)
      // ws关闭时触发
      this.webSocket.addEventListener('close', this.wsCloseHanler)

      // 检查ws连接状态,readyState值为0表示尚未连接，1表示建立连接，2正在关闭连接，3已经关闭或无法打开
      clearInterval(this.wsTimer)
      this.wsTimer = setInterval(() => {
        if (this.webSocket.readyState === 1) {
          clearInterval(this.wsTimer)
        } else {
          console.log('ws建立连接失败')
          this.wsInit()
        }
      }, 3000)
    },
    wsOpenHanler(event) {
      console.log('ws建立连接成功')
      this.sendDataToServer('ENTER#'+this.roomMsg.id)
    },
    wsMessageHanler(e) {
      console.log('wsMessageHanler')
      console.log(e)
      const redata = JSON.parse(e.data)
      //console.log(redata)

      switch (redata.msg) {
        case 'MSG':
          console.log(redata.data)
          break
        case 'START':
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          this.currentStatus = 'show'
          break
        case 'REFRESH':
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          break
      }
    },
    /**
     * ws通信发生错误
     */
    wsErrorHanler(event) {
      console.log(event, '通信发生错误')
      this.wsInit()
    },
    /**
     * ws关闭
     */
    wsCloseHanler(event) {
      console.log(event, 'ws关闭')
      this.wsInit()
    },
    /**
     * 销毁ws
     */
    wsDestroy() {
      if (this.webSocket !== null) {
        this.webSocket.removeEventListener('open', this.wsOpenHanler)
        this.webSocket.removeEventListener('message', this.wsMessageHanler)
        this.webSocket.removeEventListener('error', this.wsErrorHanler)
        this.webSocket.removeEventListener('close', this.wsCloseHanler)
        this.webSocket.close()
        this.webSocket = null
        clearInterval(this.wsTimer)
      }
    },

    /**
     * 准备游戏
     */
    readyGame(){
      this.ready = !this.ready
      this.sendDataToServer('READY')
    },
    /**
     * 根据RoomInfo更新数据
     */
    refreshByRoomInfo(){
      this.roomInfo.players.forEach((item) => {
        if (item.user.uid == this.user.uid) {
          this.player = item
          if (this.player.idleCardList) {
            this.player.idleCardList.forEach((card) => {
              this.$set(card, 'shadow', false)
            })
          }
        } else {
          this.enemy = item
        }
      })
    },
    /**
     * 选择卡片
     * @param index
     */
    selectCard(index, shadow){
      if (!shadow && this.playCardList.length>=2){
        let message = ''
        if (this.currentStatus == 'show') {
          message = '只能选择两张亮牌'
        } else {
          message = '只能选择两张暗牌'
        }
        this.$message({
          message: message,
          type: "warning",
        });
        return shadow
      } else {
        let index2 = this.playCardList.indexOf(index)
        if (index2 > -1) {
          this.playCardList.splice(index2, 1)
        }
        if (!shadow){
          this.playCardList.push(index);
        }
        return !shadow
      }
    },
    /**
     * 出牌
     */
    playCards(){
      if (this.playCardList.length == 2 && this.currentStatus == 'show') {
        this.sendDataToServer('SHOW#'+this.playCardList[0]+'#'+this.playCardList[1])
        this.playCardList = []
      } else if (this.playCardList.length == 2 && this.currentStatus == 'hide') {
        this.sendDataToServer('HIDE#'+this.playCardList[0]+'#'+this.playCardList[1])
        this.playCardList = []
      }
    }
  },
  async mounted() {
    if (sessionStorage.getItem('userInfo')) {
      // 将用户信息存储到sessionStorage中
      this.user = JSON.parse(sessionStorage.getItem('userInfo'));
    }
    this.roomMsg = this.$route.query.roomMsg

    this.wsIsRun = true
    this.wsInit()
  },
  destroyed() {
    this.wsDestroy()
  }
}
</script>

<style scoped>
.el-row {
  /*margin-bottom: 10px;*/
}

.el-col {
  height: 100%;
}

.bg-purple {
  background: #d3dce6;
}

.grid-content {
  border-radius: 4px;
  /*min-height: 36px;*/
  height: 100%;
}

.room-content {
  height: 100%;
}

.row-one {
  height: 23%;
}

.row-two {
  height: 54%;
}

.box-card {
  height: 90%;
  width: 100%;
  font-size: small;
}

.center-row {
  height: 40%;
}
.center-row-two {
  height: 20%;
}

.loc-center {
  align-items: center;
  justify-content: center;
  display: flex;
}

</style>
