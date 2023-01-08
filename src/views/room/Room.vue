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
          <el-col class="loc-center" :span="3" v-for="(idleCard,index) in (enemy && enemy.idleCardMap)?enemy.idleCardMap['env']:[]" :key="'key1env'+index">
            <el-card class="box-card loc-center card-back" :body-style="{ padding: '0px'}">
              <img src="../../assets/ant.png" alt="蚂蚁" height="50">
            </el-card>
          </el-col>
          <el-col class="loc-center" :span="3" v-for="(idleCard,index) in (enemy && enemy.idleCardMap)?enemy.idleCardMap['ant']:[]" :key="'key1ant'+index">
            <el-card class="box-card loc-center card-back" :body-style="{ padding: '0px'}">
              <img src="../../assets/ant.png" alt="蚂蚁" height="50">
            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <el-col class="loc-center" :span="4">
        <div class="loc-center" style="position: relative;width: 100%;height: 100%;">
          <div>
            <div class="loc-center" style="position: relative;width: 100%;height: 100%;">
              <div class="frosted loc-center" v-if="enemy? enemy.offLine:false" style="width: 30%;height:100%;border-radius: 50%;color: white;top: 50%; left: 50%;transform: translate(-50%, -50%);">
                <img class="shadow" style="z-index: 999" width="50%" alt="离线" src="../../assets/offline.svg">
              </div>
              <img class="shadow" v-if="enemy&&enemy.user" width="30%" style="border-radius: 50%" alt="玩家2" src="../../assets/player2.jpg">
            </div>
            <div class="text-shadow" style="color: white;margin-bottom: 3px;margin-top: 3px;">{{ enemy&&enemy.user ? enemy.user.uname:'' }}</div>
            <span class="shadow" v-if="enemy&&enemyStatus" style="color: #42413c;background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);border-radius: 5px;padding: 2px;">
              {{ enemy && enemyStatus? enemyStatus:'' | statusFilter }}
            </span>
            <span class="shadow" v-if="enemy&&enemyStatus&&(enemyStatus!=='UNREADY')" style="color: #42413c;background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);border-radius: 5px;padding: 2px;margin-left: 5px">
              {{ enemy&&enemy.rice ? enemy.rice+'米':'0米' }}
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
          <span style="position: absolute; top: calc(20px + 1em); left: calc(50%);">{{ enemyScore ? enemyScore:'0' }}</span>
          <span style="position: absolute; top: calc(25px + 2em); right: calc(50%);">{{ player&&player.user ? player.user.uname:'' }}:</span>
          <span style="position: absolute; top: calc(25px + 2em); left: calc(50%);">{{ playerScore ? playerScore:'0' }}</span>
        </div>
      </el-col>

<!--      场上牌面-->
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
              <div v-if="showRestartBtn==false && (currentStatus == 'UNREADY' || currentStatus == 'READY')" @click="readyGame()" style="position: relative;height: 50px; width: 120px;cursor: pointer;">
                <img class="shadow" src="../../assets/button.png" alt="开始" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
                <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">{{ ready | readyBtn }}</div>
              </div>
            </transition>
            <div v-if="roomInfo && roomInfo.environmentCard" @click="onEnvBtn()" style="position: relative;height: 100%;cursor: pointer;">
              <el-tooltip effect="light" content="点我可随时改造环境" placement="top">
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

<!--      右侧按钮-->
      <el-col :span="8" class="loc-center" >
        <el-tooltip effect="light" content="双方回合结束点我，用粮食补充兵力" placement="top">
          <img class="shadow" src="../../assets/ant1.png" alt="野外" height="40%" @click="drawCard()" style="cursor: pointer;">
        </el-tooltip>
        <transition name = "fade">
          <div v-if="this.playCardList.length == 2 && (this.currentStatus == 'SHOW_START' || this.currentStatus == 'HIDE_START')" @click="playCards()" style="position: relative;height: 50px; width: 80px;cursor: pointer;">
            <img class="shadow" src="../../assets/button.png" alt="出牌" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
            <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">出牌</div>
          </div>
        </transition>
        <transition name = "fade">
          <div v-if="currentStatus == 'BOTH_HIDE_END'" @click="endThisRound()" style="position: relative;height: 50px; width: 120px;cursor: pointer;">
            <img class="shadow" src="../../assets/button.png" alt="结束本回合" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
            <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">结束本回合</div>
          </div>
        </transition>
        <transition name = "fade">
          <div v-if="currentStatus == 'UNCONTINUE'" @click="nextRound()" style="position: relative;height: 50px; width: 80px;cursor: pointer;">
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
<!--      自己的头像-->
      <el-col class="loc-center" :span="4">
        <div class="loc-center" style="position: relative;width: 100%;height: 100%;">
          <div>
            <div class="loc-center" style="width: 100%;height: 100%;">
              <img class="shadow" v-if="player&&player.user" width="30%" style="border-radius: 50%" alt="玩家1" src="../../assets/player1.jpg">
            </div>
            <div class="text-shadow" style="color: white;margin-bottom: 3px;margin-top: 3px;">{{ player&&player.user ? player.user.uname:'' }}</div>
            <span class="shadow" v-if="player&&currentStatus" style="color: #42413c;background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);border-radius: 5px;padding: 2px;">
              {{ (player && currentStatus) ? currentStatus:'' | statusFilter }}
            </span>
          </div>
        </div>
      </el-col>

<!--      自己的手牌-->
      <el-col :span="16">
        <el-row style="height: 100%;" :gutter="5">
          <el-col :span="3" v-for="(idleCard,index) in (player && player.idleCardMap)?player.idleCardMap['env']:[]" :key="'key6env'+index" class="loc-center">
            <el-card :class="idleCard.shadow?'selected-card':'box-card card-front'" :shadow="idleCard.shadow? 'always':'never'" :body-style="cardBodyStyle" @click.native="idleCard.shadow = selectCard(index, idleCard)" style="cursor: pointer;">
              <div>
                <div class="loc-center"><strong style="font-size: medium;">{{ idleCard.name }}</strong></div>
                <div><span>消耗米粒：</span><span>{{ idleCard.rice }}</span></div>
                <div><span>基础战力：</span><span>{{ idleCard.initValue }}</span></div>
                <div v-for="relateCard in idleCard.relationList"><span>{{ relateCard.name }}：</span><span>{{ relateCard.valueImpact }}</span></div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="3" v-for="(idleCard,index) in (player && player.idleCardMap)?player.idleCardMap['ant']:[]" :key="'key6ant'+index" class="loc-center">
            <el-card :class="idleCard.shadow?'selected-card':'box-card card-front'" :shadow="idleCard.shadow? 'always':'never'" :body-style="cardBodyStyle" @click.native="idleCard.shadow = selectCard(index, idleCard)" style="cursor: pointer;">
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

<!--      自己的粮仓-->
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

<!--    抽牌弹窗-->
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

<!--    游戏结束弹窗-->
    <div class='pop-frosted loc-center' v-if="gameOverDialogVisible" @click="gameOverDialogVisible = false">
      <div style="width: 30%;">
        <div v-if="winner&&winner.user&&winner.user.uid != user.uid">
          <img class="shadow" src="../../assets/fail.png" alt="失败" width="60%" style="cursor: pointer;">
        </div>
        <div class="loc-center" v-else style="position: relative;width: 100%;">
          <img class="shadow" src="../../assets/victory.png" alt="奖杯" width="35%" style="cursor: pointer;">
          <span style="position: absolute; top: 0; left: 50%;transform: translate(-50%, -100%);color: #ffffff">+{{ winner? (winner.rice+'米'):'' }}</span>
          <span style="position: absolute; bottom: 0; left: 50%;transform: translate(-50%, -80%);color: #f6d365">{{ (winner&&winner.user)? winner.user.uname:'' }}</span>
        </div>
      </div>
    </div>

<!--    对方中途退出弹窗-->
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

<!--    改造环境弹窗-->
    <transition name = "fade">
      <div class='pop-frosted loc-center' v-if="changeEnvDialogVisible">
        <div style="width: 30%;">
          <div class="loc-center" style="position: relative;width: 100%;">
            <div style="position: relative;width: 30%">
              <img class="shadow" v-if="roomInfo && roomInfo.environmentCard && roomInfo.environmentCard.name ==='沙漠'" src="../../assets/desert.png" alt="沙漠" width="100%">
              <img class="shadow" v-if="roomInfo && roomInfo.environmentCard && roomInfo.environmentCard.name ==='草原'" src="../../assets/grassland.png" alt="草原" width="100%">
              <img class="shadow" v-if="roomInfo && roomInfo.environmentCard && roomInfo.environmentCard.name ==='森林'" src="../../assets/forest1.png" alt="森林" width="100%">
              <div style="position: absolute; top: 5%; left: 5%;color: white;border-radius: 3px;background-color: orange;font-size: small;padding: 1px;min-width: 1em">
                {{ roomInfo ? roomInfo.environmentRice:'' }}
              </div>
            </div>
            <div style="width: 15%">
              <div style="margin-bottom: -5px;color: #f6d365">{{ playerEnvRice ? playerEnvRice:'0' }} 米</div>
              <img class="shadow" src="../../assets/point_right.svg" alt="右箭头" width="100%">
            </div>
            <div style="position: relative;width: 30%">
              <img class="shadow" v-if="currentSelectedEnvCard && currentSelectedEnvCard.name ==='沙漠'" src="../../assets/desert.png" alt="沙漠" width="100%">
              <img class="shadow" v-if="currentSelectedEnvCard && currentSelectedEnvCard.name ==='草原'" src="../../assets/grassland.png" alt="草原" width="100%">
              <img class="shadow" v-if="currentSelectedEnvCard && currentSelectedEnvCard.name ==='森林'" src="../../assets/forest1.png" alt="森林" width="100%">
              <div style="position: absolute; top: 5%; left: 5%;color: white;border-radius: 3px;background-color: orange;font-size: small;padding: 1px;min-width: 1em">
                {{ playerEnvRice ? playerEnvRice:'0' }}
              </div>
            </div>
          </div>
          <div style="margin-top: 20px">
            <el-row :gutter="20">
              <el-col :span="4">
                <div class="shadow change-env-btn" @click="resetPlayerEnvRice()">重置</div>
              </el-col>
              <el-col :span="4">
                <div class="shadow change-env-btn" @click="addChangeEnvCost(100)">+100</div>
              </el-col>
              <el-col :span="4">
                <div class="shadow change-env-btn" @click="addChangeEnvCost(50)">+50</div>
              </el-col>
              <el-col :span="4">
                <div class="shadow change-env-btn" @click="addChangeEnvCost(10)">+10</div>
              </el-col>
              <el-col :span="4">
                <div class="shadow change-env-btn" @click="addChangeEnvCost(5)">+5</div>
              </el-col>
              <el-col :span="4">
                <div class="shadow change-env-btn" @click="addChangeEnvCost(1)">+1</div>
              </el-col>
            </el-row>
          </div>
          <div class="loc-center" style="margin-top: 30px">
            <transition name = "fade">
              <div @click="changeEnvDialogVisible = false" style="position: relative;height: 50px; width: 120px;cursor: pointer;">
                <img class="shadow" src="../../assets/button.png" alt="取 消" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
                <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">取 消</div>
              </div>
            </transition>
            <transition name = "fade">
              <div @click="confirmChangeEvn()" style="position: relative;height: 50px; width: 120px;cursor: pointer;">
                <img class="shadow" src="../../assets/button.png" alt="确定改造" width="100%" height="100%" style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);">
                <div style="position: absolute; left: 50%; top: 50%;transform: translate(-50%, -50%);width: 100%;color: white;font-size: larger">确定改造</div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>

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
      enemyScore: 0,
      playerScore: 0,

      playerEnvRice: 0, // 玩家打算出的改造环境的代价
      currentSelectedEnvCard: null, // 当前玩家选择的环境牌

      hasFirstInInit: false, // 是否执行了第一次连接后的初始化

      // 准备按钮
      ready: false,
      hasShownGameBegin: false,

      playCardList: [], // 选中的牌
      currentStatus: '',// 本人当前状态
      enemyStatus: '',// 对手当前状态
      showBright: false,
      showHide: false,
      showChangeRice: false,

      //出牌
      canPlayCard: true,

      //重新开始按钮
      showRestartBtn: false,

      //抽卡弹窗
      drawCardDialogVisible: false,

      //游戏结束弹窗
      gameOverDialogVisible: false,

      //对手退出弹窗
      enemyQuitDialogVisible: false,

      //改造环境弹窗
      changeEnvDialogVisible: false,

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
    },
    statusFilter(value) {
      let status = ''
      switch (value) {
        case 'UNREADY':
          status = '未准备'
          break
        case 'READY':
          status = '已准备'
          break
        case 'SHOW_START':
          status = '出牌中'
          break
        case 'SHOW_END':
          status = '已出牌'
          break
        case 'HIDE_START':
          status = '出牌中'
          break
        case 'HIDE_END':
          status = '已出牌'
          break
        case 'BOTH_HIDE_END':
          status = '未结束'
          break
        case 'ROUND_END':
          status = '已结束'
          break
        case 'UNCONTINUE':
          status = '未继续'
          break
        case 'CONTINUE':
          status = '已继续'
          break
      }
      return status
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
      let wsuri = 'ws://'+window.location.hostname+':8081/websocket/'+this.user.uid+'-'+this.roomMsg.id
      // let wsuri = 'ws://'+window.location.hostname+':8081/websocket/'+this.user.uid
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
      // this.sendDataToServer('ENTER#'+this.roomMsg.id)
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
          this.$message({
            message: redata.data,
            type: "warning",
          });
          break
        case 'REFRESH': // 刷新牌局
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          this.refreshScore()
          break
        case 'CHANGE_ENV': // 改造环境
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          this.refreshScore()
          this.$message({
            message: '对方改造了环境',
            type: "success",
          });
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
          this.refreshScore()
          break
        case 'SHOW_OUT': // 第一阶段出牌结束
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          this.showBright = true
          this.canPlayCard = true
          this.refreshScore()
          break
        case 'HIDE_OUT':  // 第二阶段出牌结束
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          setTimeout(()=>{
            this.showHide = true
            this.enemyScore = this.enemy.score
            this.playerScore = this.player.score
            this.$message({
              message: '你可以选择修改环境或结束本回合'
            });
          },500)
          break
        case 'END_OUT':  // 回合结束
          this.roomInfo = redata.data
          this.showChangeRice = true
          setTimeout(()=>{
            this.showChangeRice = false
          },2000)
          this.refreshByRoomInfo()
          this.refreshScore()
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
        case 'ENTER_ERR': // 对方中途退出
          this.wsDestroy()
          this.$message({
            message: '你未从房间：'+redata.data.name +' '+redata.data.id+' 正常退出，已为你自动跳转到该房间',
            type: "warning",
          });
          this.roomMsg = redata.data
          this.wsInit()
          break
        case 'DEVICE_REPLACE': // 设备顶替
          this.$message({
            message: redata.data,
            type: "warning",
          });
          this.$router.push('/home');
          break
        case 'OFFLINE': // 对方掉线
          this.roomInfo = redata.data
          this.refreshByRoomInfo();
          this.$message({
            message: '对方似乎掉线了。。。',
            type: "warning",
          });
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
     * 更新分数板分数
     */
    refreshScore(){
      this.enemyScore = (this.enemy && this.enemy.score) ? this.enemy.score:0
      this.playerScore = (this.player && this.player.score) ? this.player.score:0
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
     * 对象转Map
     */
    objToMap(obj){
      let tempMap =  new Map(Object.entries(obj))
      let resultMap = new Map()
      tempMap.forEach((value,key) => {
        resultMap[key] = value
      })
      return resultMap
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
          this.currentStatus = item.state
          if (this.player.idleCardMap) {
            this.player.idleCardMap = this.objToMap(this.player.idleCardMap)
            this.player.idleCardMap.forEach((value, key) => {
              value.forEach((card) => {
                this.$set(card, 'shadow', false)
              })
            })
            if (this.playCardList.length > 0) {
              for (let i=0;i<this.playCardList.length;i++){
                let cardTagArr = this.playCardList[i].split('@')
                this.player.idleCardMap[cardTagArr[0]][cardTagArr[1]].shadow = true
              }
            }
          }
        } else {
          this.enemy = item
          this.enemyStatus = item.state
          if (this.enemy.idleCardMap) {
            this.enemy.idleCardMap = this.objToMap(this.enemy.idleCardMap)
          }
        }
      })
      this.fistIn()
    },
    /**
     * 转换卡牌的类别为字符串
     * @param intType
     */
    strCardType(intType){
      intType = parseInt(intType)
      let strType = ''
      switch (intType) {
        case 0:
          strType = 'ant'
          break
        case 1:
          strType = 'env'
          break
      }
      return strType
    },
    /**
     * 选择牌时针对环境牌附加处理
     */
    dealEnvCard(idleCard) {
      if (this.playCardList.length === 1 && this.playCardList[0].split('@')[0] === 'env') {
        this.currentSelectedEnvCard = idleCard
        this.$message({
          message: "这里换成好看方式提示用户点击环境"
        });
      }
    },
    /**
     * 选择卡片
     * @param index
     */
    selectCard(index, idleCard){
      let shadow = idleCard.shadow
      if (!shadow && this.playCardList.length>=2){
        let message = '只能选两张牌'
        if (this.currentStatus == 'SHOW_START') {
          message = '只能选择两张亮牌'
        } else if(this.currentStatus == 'HIDE_START') {
          message = '只能选择两张暗牌'
        }
        this.$message({
          message: message,
          type: "warning",
        });
        return shadow
      } else {
        let cardTag = this.strCardType(idleCard.type) + '@' +index
        let index2 = this.playCardList.indexOf(cardTag)
        if (index2 > -1) {
          this.playCardList.splice(index2, 1)
        }
        if (!shadow){
          this.playCardList.push(cardTag);
        }
        this.dealEnvCard(idleCard)
        return !shadow
      }
    },
    /**
     * 点击环境
     */
    onEnvBtn(){
      if (this.playCardList.length === 1 && this.playCardList[0].split('@')[0] === 'env') {
        this.playerEnvRice = this.roomInfo.environmentRice + 1
        this.changeEnvDialogVisible = true
      } else {
        this.$message({
          message: "请先选择【一张】环境牌"
        });
      }
    },
    /**
     * 改造环境
     */
    confirmChangeEvn(){
      this.sendDataToServer('CHANGE_ENV#'+this.playCardList[0]+'#'+this.playerEnvRice)
      this.playCardList = []
      this.changeEnvDialogVisible = false
    },
    /**
     * 前端假装出牌
     */
    frontPlayCards(){
      let firstCardArr = this.playCardList[0].split('@')
      let secCardArr = this.playCardList[1].split('@')
      if (this.isCardToPlaySameType()) {
        if (parseInt(firstCardArr[1]) > parseInt(secCardArr[1])) {
          this.player.idleCardMap[firstCardArr[0]].splice(parseInt(firstCardArr[1]), 1)
          this.player.idleCardMap[secCardArr[0]].splice(parseInt(secCardArr[1]), 1)
        } else {
          this.player.idleCardMap[secCardArr[0]].splice(parseInt(secCardArr[1]), 1)
          this.player.idleCardMap[firstCardArr[0]].splice(parseInt(firstCardArr[1]), 1)
        }
      } else {
        this.player.idleCardMap[firstCardArr[0]].splice(parseInt(firstCardArr[1]), 1)
        this.player.idleCardMap[secCardArr[0]].splice(parseInt(secCardArr[1]), 1)
      }
    },
    /**
     * 判断要出的两张牌是否为一个类型
     */
    isCardToPlaySameType () {
      let isSameType = false
      if(this.playCardList[0].split('@')[0] === this.playCardList[1].split('@')[0]) {
        isSameType = true
      }
      return isSameType
    },
    /**
     * 检查待出牌列表里的牌是否有环境牌
     */
    isPlayCardValid(){
      let valid = true
      this.playCardList.forEach((cardTag) => {
        if (cardTag.split('@')[0] === 'env') {
          valid = false
        }
      })
      return valid
    },
    /**
     * 出牌
     */
    playCards(){
      if (!this.isPlayCardValid()) {
        this.$message({
          message: '环境牌只能单独出！',
          type: "warning",
        });
        return
      }
      if (this.canPlayCard) {
        this.canPlayCard = false
        if (this.playCardList.length == 2 && this.currentStatus == 'SHOW_START') {
          this.frontPlayCards();
          this.player.showCardList = [0,0]  // 前端先展示两张假牌等待后端更新
          this.sendDataToServer('SHOW#'+this.playCardList[0]+'#'+this.playCardList[1])
          this.playCardList = []
        } else if (this.playCardList.length == 2 && this.currentStatus == 'HIDE_START') {
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
      this.sendDataToServer('END')
    },
    /**
     * 下一回合
     */
    nextRound(){
      this.sendDataToServer('CONTINUE')
    },
    /**
     * 抽卡
     */
    drawCard(){
      if (this.currentStatus == 'UNCONTINUE'){
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
      this.showRestartBtn = false
      this.ready = false  //为下一局的开始做准备

      // this.playCardList = []
      this.showBright = false
      this.showHide = false
      this.showChangeRice = false

      //出牌
      this.canPlayCard = true

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
      this.hasShownGameBegin = false

      this.playCardList = [] // 选中的牌
      this.showBright = false
      this.showHide = false
      this.showChangeRice = false

      //出牌
      this.canPlayCard = true

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
    },
    /**
     * 刚进入房间时，且第一次获取到后端数据时执行一次
     */
    fistIn(){
      if (!this.hasFirstInInit) {
        this.hasFirstInInit = true
        this.showBright = this.currentStatus !== 'SHOW_START' && this.currentStatus !== 'SHOW_END'
        this.showHide = this.currentStatus !== 'SHOW_START' && this.currentStatus !== 'SHOW_END' && this.currentStatus !== 'HIDE_START' && this.currentStatus !== 'HIDE_END'
      }
    },
    /**
     * 增加改造环境投入
     */
    addChangeEnvCost(num){
      this.playerEnvRice += num
    },
    /**
     * 重置环境改造投入
     */
    resetPlayerEnvRice(){
      this.playerEnvRice = this.roomInfo.environmentRice + 1
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

div.pop-frosted {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(1px);
}

div.frosted {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(9, 9, 9, 0.4);
  backdrop-filter: blur(1px);
  z-index: 9999;
}

.text-shadow {
  text-shadow: 0.1em 0.1em 0.2em black
}

.change-env-btn {
  align-items: center;
  justify-content: center;
  display: flex;
  padding: 3px;
  border-radius: 3px;
  background-color: #f6d365;
  cursor: pointer;
  height: 2em;
}
</style>
