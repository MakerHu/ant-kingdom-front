<template>
  <div class="room-content" :style="roomBackground">
    <el-row class="row-one">
      <el-col :span="4">
        <div class="loc-center" style="width: 100%;height: 30%;margin-top: 20px">
          <img class="shadow" @click="quit()" src="../../assets/quit.svg" alt="" height="40%" style="cursor: pointer;margin-right: 10px">
          <div style="position: relative;width: 50%;height: 100%;">
            <img class="shadow" src="../../assets/doorplate.png" alt="" width="100%" height="100%" style="position: absolute; top: 0; left: 0;">
            <el-tooltip class="item" effect="light" :content="roomMsg?roomMsg.name:''" placement="bottom">
              <div style="position: absolute; top: 50%; left: 50%;transform: translate(-50%, -50%);color: white;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width: 75%;">
                {{ roomMsg?roomMsg.id:'' }}<br>{{ roomMsg?roomMsg.name:'' }}
              </div>
            </el-tooltip>
          </div>
        </div>
      </el-col>

      <el-col :span="16" >
        <el-row style="height: 100%;" :gutter="5" type="flex" justify="end">
          <el-col class="loc-center" :span="3" v-for="(idleCard,index) in enemy?enemy.idleCardList:[]" :key="'key1'+index">
            <el-card class="box-card loc-center card-back" :body-style="{ padding: '0px'}">
              <img src="../../assets/ant.png" alt="蚂蚁" height="50">
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <el-col class="loc-center" :span="4">
        <div class="loc-center" style="position: relative;width: 100%;height: 100%;">
          <div>
            <img class="shadow" v-if="enemy&&enemy.user" width="30%" style="border-radius: 50%" alt="玩家2" src="../../assets/player2.jpg">
            <div style="color: white;margin-bottom: 3px">{{ enemy&&enemy.user ? enemy.user.uname:'' }}</div>
            <span class="shadow" v-if="enemy&&enemy.rice" style="color: #33312d;background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);border-radius: 5px;padding: 2px;">
              {{ enemy&&enemy.rice ? enemy.rice+'米':'' }}
            </span>
          </div>
          <transition name="fade">
            <span v-if="showChangeRice" style="position: absolute; bottom: 0; left: 50%;transform: translate(-50%, 5px);font-size: large;color: white;border-radius: 15px;background-color: #1fd082;padding: 5px">
              {{ (enemy&&enemy.changeRice>=0)? '+':'' }}{{ enemy? enemy.changeRice:'' }}
            </span>
          </transition>
        </div>
      </el-col>
    </el-row>

    <el-row class="row-two">
      <el-col :span="8" class="loc-center" >
        <div style="position: relative;width: 30%;">
          <img class="shadow" src="../../assets/whiteboard.svg" alt="" width="100%" height="100%">
          <span style="position: absolute; top: 10px; left: calc(50% - 2em);">本回战况</span>
          <span style="position: absolute; top: calc(20px + 1em); right: calc(50%);">{{ enemy&&enemy.user ? enemy.user.uname:'' }}:</span>
          <span style="position: absolute; top: calc(20px + 1em); left: calc(50%);">{{ enemy ? enemy.score:'' }}</span>
          <span style="position: absolute; top: calc(25px + 2em); right: calc(50%);">{{ player&&player.user ? player.user.uname:'' }}:</span>
          <span style="position: absolute; top: calc(25px + 2em); left: calc(50%);">{{ player ? player.score:'' }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <el-row class="center-row" :gutter="5">
          <el-col :span="6" v-for="(showCard,index) in enemy? enemy.showCardList:[]" :key="'key2'+index" class="loc-center">
            <el-card :class="showBright?'box-card card-front':'box-card loc-center card-back'" :body-style="cardBodyStyle">
              <img v-if="!showBright" src="../../assets/ant.png" alt="蚂蚁" height="50">
              <div v-else>
                <div class="loc-center"><strong style="font-size: medium;">{{ showCard.name }}</strong></div>
                <div><span>消耗米粒：</span><span>{{ showCard.rice }}</span></div>
                <div><span>基础战力：</span><span>{{ showCard.initValue }}</span></div>
                <div v-for="relateCard in showCard.relationList"><span>{{ relateCard.name }}：</span><span>{{ relateCard.valueImpact }}</span></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" v-for="(showCard,index) in enemy? enemy.hideCardList:[]" :key="'key3'+index" class="loc-center">
            <el-card :class="showHide?'box-card card-front':'box-card loc-center card-back'" :body-style="cardBodyStyle">
              <img v-if="!showHide" src="../../assets/ant.png" alt="蚂蚁" height="50">
              <div v-else>
                <div class="loc-center"><strong style="font-size: medium;">{{ showCard.name }}</strong></div>
                <div><span>消耗米粒：</span><span>{{ showCard.rice }}</span></div>
                <div><span>基础战力：</span><span>{{ showCard.initValue }}</span></div>
                <div v-for="relateCard in showCard.relationList"><span>{{ relateCard.name }}：</span><span>{{ relateCard.valueImpact }}</span></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row class="center-row-two" :gutter="5">
          <el-col :span="24" class="loc-center">
            <transition name = "fade">
              <div v-show="showReadyBtn" @click="readyGame()" style="position: relative;height: 50px; width: 120px;cursor: pointer;">
                <img class="shadow" src="../../assets/button.png" alt="开始" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
                <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">{{ ready | readyBtn }}</div>
              </div>
            </transition>
            <div v-if="roomInfo && roomInfo.environmentCard" style="position: relative;height: 100%;cursor: pointer;">
              <el-tooltip effect="light" content="点我可随时改造环境（待实现）" placement="top">
                <img class="shadow" v-if="roomInfo && roomInfo.environmentCard && roomInfo.environmentCard.name == '森林'" src="../../assets/forest1.png" alt="森林" height="100%">
                <img class="shadow" v-if="roomInfo && roomInfo.environmentCard && roomInfo.environmentCard.name == '沙漠'" src="../../assets/desert.png" alt="沙漠" height="100%">
                <img class="shadow" v-if="roomInfo && roomInfo.environmentCard && roomInfo.environmentCard.name == '草原'" src="../../assets/grassland.png" alt="草原" height="100%">
              </el-tooltip>
              <div style="position: absolute; top: 3px; left: 5px;color: white;border-radius: 3px;background-color: orange;font-size: small;padding: 1px;min-width: 1em">
                {{ roomInfo ? roomInfo.environmentRice:'' }}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="center-row" :gutter="5">
          <el-col :span="6" v-for="(showCard,index) in player? player.showCardList:[]" :key="'key4'+index" class="loc-center">
            <el-card :class="showBright?'box-card card-front':'box-card loc-center card-back'" :body-style="cardBodyStyle">
              <img v-if="!showBright" src="../../assets/ant.png" alt="蚂蚁" height="50">
              <div v-else>
                <div class="loc-center"><strong style="font-size: medium;">{{ showCard.name }}</strong></div>
                <div><span>消耗米粒：</span><span>{{ showCard.rice }}</span></div>
                <div><span>基础战力：</span><span>{{ showCard.initValue }}</span></div>
                <div v-for="relateCard in showCard.relationList"><span>{{ relateCard.name }}：</span><span>{{ relateCard.valueImpact }}</span></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6" v-for="(showCard,index) in player? player.hideCardList:[]" :key="'key5'+index" class="loc-center">
            <el-card :class="showHide?'box-card card-front':'box-card loc-center card-back'" :body-style="cardBodyStyle">
              <img v-if="!showHide" src="../../assets/ant.png" alt="蚂蚁" height="50">
              <div v-else>
                <div class="loc-center"><strong style="font-size: medium;">{{ showCard.name }}</strong></div>
                <div><span>消耗米粒：</span><span>{{ showCard.rice }}</span></div>
                <div><span>基础战力：</span><span>{{ showCard.initValue }}</span></div>
                <div v-for="relateCard in showCard.relationList"><span>{{ relateCard.name }}：</span><span>{{ relateCard.valueImpact }}</span></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="loc-center" >
        <el-tooltip effect="light" content="双方回合结束点我，用粮食补充兵力" placement="top">
          <img class="shadow" src="../../assets/ant1.png" alt="野外" height="40%" @click="drawCard()" style="cursor: pointer;">
        </el-tooltip>
<!--        <el-button v-show="this.playCardList.length == 2 && (this.currentStatus == 'show' || this.currentStatus == 'hide')" @click="playCards()">出牌</el-button>-->
<!--        <el-button v-show="showEndBtn" :disabled="endBtnDisable" @click="endThisRound()">结束本回合</el-button>-->
<!--        <el-button v-show="showNextRound" :disabled="nextRoundBtnDisable" @click="nextRound()">继续</el-button>-->
        <transition name = "fade">
          <div v-if="this.playCardList.length == 2 && (this.currentStatus == 'show' || this.currentStatus == 'hide')" @click="playCards()" style="position: relative;height: 50px; width: 80px;cursor: pointer;">
            <img class="shadow" src="../../assets/button.png" alt="出牌" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
            <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">出牌</div>
          </div>
        </transition>
        <transition name = "fade">
          <div v-if="showEndBtn" @click="endThisRound()" style="position: relative;height: 50px; width: 120px;cursor: pointer;">
            <img class="shadow" src="../../assets/button.png" alt="结束本回合" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
            <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">结束本回合</div>
          </div>
        </transition>
        <transition name = "fade">
          <div v-if="showNextRound" @click="nextRound()" style="position: relative;height: 50px; width: 80px;cursor: pointer;">
            <img class="shadow" src="../../assets/button.png" alt="继续" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
            <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">继续</div>
          </div>
        </transition>
        <transition name = "fade">
          <div v-if="showRestartBtn" @click="readyGame()" style="position: relative;height: 50px; width: 120px;cursor: pointer;">
            <img class="shadow" src="../../assets/button.png" alt="再来一局" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
            <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">{{ ready | restartBtn }}</div>
          </div>
        </transition>
      </el-col>
    </el-row>

    <el-row class="row-one">
      <el-col class="loc-center" :span="4">
        <div>
          <img class="shadow" v-if="player&&player.user" width="30%" style="border-radius: 50%" alt="玩家1" src="../../assets/player1.jpg">
          <div style="color: white">{{ player? player.user.uname:'' }}</div>
        </div>
      </el-col>

      <el-col :span="16">
        <el-row style="height: 100%;" :gutter="5">
          <el-col :span="3" v-for="(idleCard,index) in player?player.idleCardList:[]" :key="'key6'+index" class="loc-center">
            <el-card :class="idleCard.shadow?'selected-card':'box-card card-front'" :shadow="idleCard.shadow? 'always':'never'" :body-style="cardBodyStyle" @click.native="idleCard.shadow = selectCard(index, idleCard.shadow)" style="cursor: pointer;">
              <div>
                <div class="loc-center"><strong style="font-size: medium;">{{ idleCard.name }}</strong></div>
                <div><span>消耗米粒：</span><span>{{ idleCard.rice }}</span></div>
                <div><span>基础战力：</span><span>{{ idleCard.initValue }}</span></div>
                <div v-for="relateCard in idleCard.relationList"><span>{{ relateCard.name }}：</span><span>{{ relateCard.valueImpact }}</span></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <el-col class="loc-center" :span="4">
        <div style="position: relative;width: 100%;height: 100%">
          <img class="shadow" src="../../assets/rice.png" alt="" width="100%" height="100%">
          <span style="position: absolute; bottom: 25%; right: calc(28% - 2em);font-size: large;">{{ player ? player.rice+'米':'' }}</span>
          <transition name="fade">
            <span v-if="showChangeRice" style="position: absolute; top: 10%; right: 15%;font-size: large;color: white;border-radius: 15px;background-color: #1fd082;padding: 5px">
              {{ (player&&player.changeRice>=0)? '+':'' }}{{ player? player.changeRice:'' }}
            </span>
          </transition>
        </div>
      </el-col>
    </el-row>

    <el-dialog
        title="确认"
        :visible.sync="drawCardDialogVisible"
        width="30%">
      <span>是否确定花50米兑换一张手牌？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="drawCardDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDrawCard">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="游戏结束"
        :visible.sync="gameOverDialogVisible"
        width="30%"
        center>
      <span>赢家是：{{ (winner&&winner.user)? winner.user.uname:'' }}</span>
      <span style="margin-left: 10px">总粮食：{{ winner? (winner.rice+'米'):'' }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="gameOverDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="对方已离开，游戏结束"
        :visible.sync="enemyQuitDialogVisible"
        width="30%"
        center>
      <span>你获得了本局的胜利！</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enemyQuitDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
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
      roomInfo: null,
      player: null,
      enemy: null,
      winner: null,

      // 准备按钮
      ready: false,
      showReadyBtn: true,
      hasShownGameBegin: false,

      playCardList: [], // 选中的牌
      currentStatus: 'show',// 当前状态show可以出明牌，hide可以出隐藏牌，end一回合结束
      showBright: false,
      showHide: false,
      showChangeRice: false,

      //出牌
      canPlayCard: true,

      //结束本回合
      showEndBtn: false,
      endBtnDisable: false,

      //继续按钮
      showNextRound: false,
      nextRoundBtnDisable: false,

      //重新开始按钮
      showRestartBtn: false,

      //抽卡弹窗
      drawCardDialogVisible: false,

      //游戏结束弹窗
      gameOverDialogVisible: false,

      //对手退出弹窗
      enemyQuitDialogVisible: false,

      roomBackground: {
        backgroundImage:"url(" + require("../../assets/background2.png") + ")",
        backgroundSize: "100% 100%",
        //隐藏滚动条
        overflow: "hidden",
        height: "100vh"
      },
      cardBodyStyle: {
        padding: '5px',
        textAlign: 'left'
      },
    };
  },
  filters: {
    readyBtn(value) {
      return value ? '取消准备':'准备'
    },
    restartBtn(value) {
      return value ? '取消准备':'再来一局'
    }
  },
  methods: {

    sendDataToServer(msg) {
      if (this.webSocket.readyState === 1) {
        this.webSocket.send(msg)
        console.log('向服务器发送信息：', msg)
      } else {
        throw Error('服务未连接')
      }
    },
    /**
     * 初始化ws
     */
    wsInit() {
      // let wsuri = 'ws://localhost:8081/websocket/'+this.user.uid
      // let wsuri = 'ws://114.115.131.120:8081/websocket/'+this.user.uid
      // let wsuri = 'ws://'+window.location.hostname+':8081/websocket/'+this.user.uid+'#'+this.roomMsg.id
      let wsuri = 'ws://'+window.location.hostname+':8081/websocket/'+this.user.uid
      this.ws = wsuri
      if (!this.wsIsRun) return
      // 销毁ws
      this.wsDestroy()
      // 初始化ws
      this.webSocket = new WebSocket(this.ws)
      // ws连接建立时触发
      this.webSocket.addEventListener('open', this.wsOpenHanler)
      // ws服务端给客户端推送消息
      // ws通信发生错误时触发
      this.webSocket.addEventListener('message', this.wsMessageHanler)
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
        case 'ALERT': // 警告信息
          this.$message({
            message: redata.data,
            type: "warning",
          });
          break
        case 'CONTINUE_ALERT': // 无法继续时
          this.nextRoundBtnDisable = false
          this.showNextRound = true
          this.$message({
            message: redata.data,
            type: "warning",
          });
          break
        case 'REFRESH': // 刷新牌局
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          break
        case 'START': // 开始
          this.roomInfo = redata.data
          this.roundInit()
            let showMsg = '回合开始！'
            if (!this.hasShownGameBegin) {
              this.hasShownGameBegin = !this.hasShownGameBegin
              showMsg = '游戏开始！'
            }
          this.$notify.success({
            title: showMsg,
            showClose: false,
            offset: 150
          });
          this.refreshByRoomInfo();
          break
        case 'SHOW_OUT': // 第一阶段出牌结束
          this.roomInfo = redata.data
          this.currentStatus = 'hide'
          this.refreshByRoomInfo();
          setTimeout(()=>{
            this.showBright = true
            this.canPlayCard = true
          },2000)
          break
        case 'HIDE_OUT':  // 第二阶段出牌结束
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          setTimeout(()=>{
            this.showHide = true
            this.showEndBtn = true
            this.$message({
              message: '你可以选择修改环境或结束本回合'
            });
          },2000)
          break
        case 'END_OUT':  // 回合结束
          this.roomInfo = redata.data
          this.currentStatus = 'end'
          this.showChangeRice = true
          this.showEndBtn = false
          this.showNextRound = true
          setTimeout(()=>{
            this.showChangeRice = false
          },2000)
          this.refreshByRoomInfo()
          break
        case 'GAME_OVER': // 游戏结束
          this.roomInfo = redata.data
          this.roomInfo.players.forEach((player)=>{
            if (!player.bankruptcy) {
              this.winner = player
            }
          })
          this.gameOverDialogVisible = true
          this.showRestartBtn = true
          this.showNextRound = false
          this.refreshByRoomInfo()
          break
        case 'CONN_ERR': // 连接异常
          this.$message({
            message: '房间已不存在！',
            type: "warning",
          });
          this.quit()
          break
        case 'ENEMY_QUIT': // 对方中途退出
          this.roomInfo = redata.data
          this.enemyQuitDialogVisible = true
          this.globalInit()
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
      if (this.ready) {
        this.sendDataToServer('READY')
      } else {
        this.sendDataToServer('UNREADY')
      }
    },
    /**
     * 根据RoomInfo更新数据
     */
    refreshByRoomInfo(){
      this.player = null
      this.enemy = null
      this.roomInfo.players.forEach((item) => {
        if (item.user.uid == this.user.uid) {
          this.player = item
          if (this.player.idleCardList) {
            this.player.idleCardList.forEach((card) => {
              this.$set(card, 'shadow', false)
            })
            if (this.playCardList.length > 0) {
              for (let i=0;i<this.playCardList.length;i++){
                this.player.idleCardList[this.playCardList[i]].shadow = true
              }
            }
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
     * 前端假装出牌
     */
    frontPlayCards(){
      if (this.playCardList[0]>this.playCardList[1]) {
        this.player.idleCardList.splice(this.playCardList[0], 1)
        this.player.idleCardList.splice(this.playCardList[1], 1)
      } else {
        this.player.idleCardList.splice(this.playCardList[1], 1)
        this.player.idleCardList.splice(this.playCardList[0], 1)
      }
    },
    /**
     * 出牌
     */
    playCards(){
      if (this.canPlayCard) {
        this.canPlayCard = false
        if (this.playCardList.length == 2 && this.currentStatus == 'show') {
          this.frontPlayCards();
          this.player.showCardList = [0,0]  // 前端先展示两张假牌等待后端更新
          this.sendDataToServer('SHOW#'+this.playCardList[0]+'#'+this.playCardList[1])
          this.playCardList = []
        } else if (this.playCardList.length == 2 && this.currentStatus == 'hide') {
          this.frontPlayCards();
          this.player.hideCardList = [0,0]  // 前端先展示两张假牌等待后端更新
          this.sendDataToServer('HIDE#'+this.playCardList[0]+'#'+this.playCardList[1])
          this.playCardList = []
        }
      } else {
        this.$message({
          message: '当前不能出牌！',
          type: "warning",
        });
      }

    },
    /**
     * 结束本回合
     */
    endThisRound(){
      this.endBtnDisable = true
      this.showEndBtn = false
      this.sendDataToServer('END')
    },
    /**
     * 下一回合
     */
    nextRound(){
      this.nextRoundBtnDisable = true
      this.showNextRound = false
      this.sendDataToServer('CONTINUE')
    },
    /**
     * 抽卡
     */
    drawCard(){
      if (this.currentStatus == 'end' && this.nextRoundBtnDisable == false){
        this.drawCardDialogVisible = true
      } else {
        this.$message({
          message: '回合结束时才能补充手牌',
          type: "warning",
        });
      }
    },
    confirmDrawCard(){
      this.drawCardDialogVisible = false
      this.sendDataToServer('BRAND')
    },
    /**
     * 回合初始化
     */
    roundInit(){
      this.showReadyBtn = false
      this.showRestartBtn = false
      this.ready = false  //为下一局的开始做准备

      // this.playCardList = []
      this.currentStatus = 'show'// 当前状态show可以出明牌，hide可以出隐藏牌，end一回合结束
      this.showBright = false
      this.showHide = false
      this.showChangeRice = false

      //出牌
      this.canPlayCard = true

      //结束本回合
      this.showEndBtn = false
      this.endBtnDisable = false

      //继续按钮
      this.showNextRound = false
      this.nextRoundBtnDisable = false

      //抽卡弹窗
      this.drawCardDialogVisible = false

      if (this.player){
        this.player.showCardList = []
        this.player.hideCardList = []
      }
      if (this.enemy){
        this.enemy.showCardList = []
        this.enemy.hideCardList = []
      }
    },
    /**
     * 全局初始化
     */
    globalInit(){
      this.winner = null
      this.enemy = null

      // 准备按钮
      this.ready = false
      this.showReadyBtn = true
      this.hasShownGameBegin = false

      this.playCardList = [] // 选中的牌
      this.currentStatus = 'show'// 当前状态show可以出明牌，hide可以出隐藏牌，end一回合结束
      this.showBright = false
      this.showHide = false
      this.showChangeRice = false

      //出牌
      this.canPlayCard = true

      //结束本回合
      this.showEndBtn = false
      this.endBtnDisable = false

      //继续按钮
      this.showNextRound = false
      this.nextRoundBtnDisable = false

      //重新开始按钮
      this.showRestartBtn = false

      //抽卡弹窗
      this.drawCardDialogVisible = false

      //游戏结束弹窗
      this.gameOverDialogVisible = false
    },
    /**
     * 退出房间
     */
    quit(){
      this.sendDataToServer('QUIT')
      this.$router.push('/home');
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

.selected-card {
  height: 90%;
  width: 100%;
  font-size: small;
  /*background-color: aqua;*/
  /*background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);*/
  /*background-image: linear-gradient(-225deg, #50A7C2 0%, #B7F8DB 100%);*/
  background-image: linear-gradient(to top, #0db76a 0%, #2fe1a4 100%);
}

.card-back {
  /*background-image: linear-gradient(-20deg, #616161 0%, #9bc5c3 100%);*/
  background-image: linear-gradient(-225deg, #473B7B 0%, #3584A7 51%, #30D2BE 100%);
}

.card-front {
  /*background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);*/
  background-image: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
}

.shadow {
  /*box-shadow: 3px 3px 8px #000000;*/
  filter: drop-shadow(2px 3px 8px #5d5a5a);
}
</style>
