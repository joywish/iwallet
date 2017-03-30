
var BaseGame = cc.Layer.extend({
  params:null,
  leveldata:null,
  currLevel:0,
  listener:null,
  uiroot:null,
  curIndex:0,
  progress:null,
  ltimer:0,
  cd_size:cc.size(0,0),
  score:0,
  status:null,
  step:0,
  isclose:false,
  ishideui:false,
  istimer:true,
  tmproot:null,
  itool:null,
  iscore:null,
  itimer:null,
  inState:false,
  countdelta:0,
  intervals:[],
  isPause:false,
  isSeqEnd:false,
  animLabels:[],
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this.oper_close=false;
    this._super();
    if(this.ishideui)
    {
      UIModule.showUI();
    }
    if(cc.sys.isNative) {
      cc.eventManager.removeListener(this.listener);
    }
    this.tmproot.release();
  },
  onEnter: function() {
    this._super();
    this.isclose=false;
    if(this.params==null)
    {
      if(cc.sys.isNative) {
        this.params = TinyGameWrapper.getCurrParams();
        if (this.params == null) {
          this.params = {isStartEnd: true, level: null, from: "unknown", isVideo: false, gameid: this.define.ID};
          TinyGameWrapper.setCurrParams(this.params);
        }
        else {
          this.params.isVideo = false;
        }
      }
    }
    if(this.ishideui)
    {
      UIModule.hideUI();
      if(this.params.isVideo)
      {
        if(cc.sys.isNative) {
          cc.eventManager.dispatchCustomEvent("jsInner", "Play:toShow");
          cc.eventManager.dispatchCustomEvent("jsInner", "Play:toPlay:");
        }
      }
    }
    this.scheduleUpdate();
    if(cc.sys.isNative) {
      this.listener = cc.EventListenerCustom.create("UIMsg", this.onMsg.bind(this));
      cc.eventManager.addEventListenerWithFixedPriority(this.listener, 2);
    }
    var file="res/cGameTemplate.json";
    var json=ccs.load(file);
    this.tmproot=json.node;
    this.tmproot.retain();
    var size=cc.director.getVisibleSize();

    var tool_template="tool_template_one"
    if(this.tool_template!=null)
    {
      tool_template=this.tool_template;
    }
    var tool=ccui.helper.seekWidgetByName(json.node,tool_template);
    var itool=tool.clone();
    itool.setPosition(0,size.height);
    this.addChild(itool);
    this.itool=itool;

    if(this.ScoreTemplate==null)
    {
      this.ScoreTemplate="score_template_heart";
    }
    var score=ccui.helper.seekWidgetByName(json.node,this.ScoreTemplate);
    var iscore=score.clone();
    iscore.setPosition(0,size.height);
    this.addChild(iscore);
    this.iscore=iscore;

    if(this.istimer)
    {
      var timer_count=ccui.helper.seekWidgetByName(json.node,"pnl_timer_count");
      var itimer_count=timer_count.clone();
      this.addChild(itimer_count);
      this.itimer=itimer_count;

      this.schedule(this.onTimer,1);
      this.progress=itimer_count;
      this.ltimer=this.leveldata[this.currLevel].timer;
      this.cd_size=this.progress.getChildByName("pnl_progress").getContentSize();
      this.refreshTimer();
    }

    this.refreshScore();
    this.calcPosition();
    this.countdelta = 0;
    this.step=0;
    if(this.isState)
    {
      this.doMakeStates(null);
      this.doCutScenes(null);
    }
    else
    {
      //this.doStartScene(0);
    }
    var pause=ccui.helper.seekWidgetByName(this.itool,"pnl_pause");
    this.isPause=false;
    if(pause!=null)
    {
      var that=this;
      pause.addClickEventListener(function(sender) {
          that.isPause=!that.isPause;
          if(that.isPause)
          {
            SysUtils.pause(that);
            pause.setBackGroundImage("res/source/common/game_kaishi.png");
            if(that.params.isVideo)
            {
              cc.eventManager.dispatchCustomEvent("jsInner","Play:toHide");
              cc.eventManager.dispatchCustomEvent("jsInner","Play:Pause");
            }
          }
          else
          {
            SysUtils.resume(that);
            pause.setBackGroundImage("res/source/common/game_zanting.png");
            if(that.params.isVideo)
            {
              cc.eventManager.dispatchCustomEvent("jsInner","Play:toShow");
              cc.eventManager.dispatchCustomEvent("jsInner","Play:toTom");
            }
          }
        }
      );
    }
    var retry=ccui.helper.seekWidgetByName(this.itool,"btn_retry");
    var that=this;
    if(retry!=null)
    {
      retry.addClickEventListener(function (sender){
        //that.gameClose(null);
        //TinyGameWrapper.reStartGame();
        that.reStart(null);
      });
    }
    var exit=ccui.helper.seekWidgetByName(this.itool,"btn_exit");
    this.exit=exit;
    if(exit!=null)
    {
      exit.addClickEventListener(function(sender) {
        that.gameClose(null);
      });
    }
    /*
    var label=this.newLabel(200);
    label.setPosition(cc.p(300,300));
    var timercount=10;
    this.addChild(label);
    label.setString(timercount);
    var seq=this.downTimersSeq(timercount,function(sender){
      timercount=timercount-1;
      label.setString(timercount);
      if(timercount<=0)
      {
        label.removeFromParent(true);
      }
    });
    label.runAction(seq);
    */
  },
  getDispSize:function(playSize)
  {
    var size=cc.director.getVisibleSize();
    var vidsize=cc.size(playSize[0],playSize[1]);
    var scalew=size.width/vidsize.width;
    var scaleh=size.height/vidsize.height;
    var scale=scalew;
    if(scale<scaleh) {
      scale=scaleh;
    }
    var dispsize=cc.size(vidsize.width*scale,vidsize.height*scale);
    return [dispsize,scale];
  },
  doMakeStates:function(sender)
  {
    var state=this.leveldata[this.currLevel].stateTimes[0];
    this.intervals=[];
    this.intervals.push(state[0]);
    var actStart=cc.delayTime(state[0]+2);
    //SysUtils.log("start");
    var seq=cc.sequence(actStart,cc.callFunc(this.onStateStart,this));
    for(var i=0;i<this.leveldata[this.currLevel].stateTimes.length-1;i++)
    {
      var state=this.leveldata[this.currLevel].stateTimes[i];
      var state_ext=this.leveldata[this.currLevel].stateTimes[i+1];
      var act1=cc.delayTime(state[1]-state[0]);
      seq=cc.sequence(seq,act1);
      seq=cc.sequence(seq,cc.callFunc(this.onStateEnd,this));
      this.intervals.push(state_ext[0]-state[1]);
      var act2=cc.delayTime(state_ext[0]-state[1]);
      seq=cc.sequence(seq,act2);
      seq=cc.sequence(seq,cc.callFunc(this.onStateStart,this));
    }
    var state_end=this.leveldata[this.currLevel].stateTimes[this.leveldata[this.currLevel].stateTimes.length-1];
    var acte=cc.delayTime(state_end[1]-state_end[0]);
    this.intervals.push(state_end[1]-state_end[0]);
    seq=cc.sequence(seq,acte);
    seq=cc.sequence(seq,cc.callFunc(this.onSequenseEnd,this));
    this.stopAllActions();
    this.runAction(seq);
    //this.status=ccui.helper.seekWidgetByName(this.uiroot.tool,"txt_status");
    //this.status.setString(this.leveldata[this.currLevel].freeTxt);
    //SysUtils.log(this.leveldata[this.currLevel].freeTxt);
  },
  onStateStart:function(sender)
  {
    //this.status.setString(this.leveldata[this.currLevel].stateTxts[this.step]);
    //SysUtils.log(this.leveldata[this.currLevel].stateTxts[this.step]);
    this.inState=true;
    this.countdelta=0;
  },
  addLabel:function(label)
  {
	if(this.cpplayer!=null)
	{
	  var running=cc.director.getRunningScene();
	  running.addChild(label);
	  label.setLocalZOrder(1000);
	}
	else
	{
	  this.addChild(label);
	}  
  },
  doStartScene:function(interval)
  {
    var nlist=[];
    if(interval>0)
    {
      nlist=AnimModule.countToList(nlist,Math.ceil(interval));
    }
    nlist.push(this.getWaveName(1));
    var label=AnimModule.newSequenceLabel(nlist,80,10,cc.color(0,255,0,255),false,function(count,label){
    }.bind(this));
    this.addLabel(label);
  },
  numToEnglish:function(num)
  {
    //TODO:convert num to english
    return num;
  },
  getWaveName:function(index)
  {
    var eng=this.numToEnglish(index);
    return "第{0}波".format(eng);
  },
  doCutScenes:function(sender)
  {
    var step=this.step;
    if(step<this.intervals.length&&step>=0&&!this.isSeqEnd)
    {
      if(this.intervals[step]>0)
      {
        var interval=this.intervals[step];
        var nlist=[];
        if(step>0)
        {
          if(interval>3)
          {
            nlist=AnimModule.countToList(nlist,Math.ceil(interval-2));
            nlist.push(this.getWaveName(step+1));
          }
          else if(interval>=1.0)
          {
            nlist.push(this.getWaveName(step+1));
          }
        }
        else
        {
          nlist=AnimModule.countToList(nlist,Math.ceil(interval));
          nlist.push(this.getWaveName(step+1));
        }
        if(interval>=1.0)
        {
          var isDelay=true;
          if(step==0)
          {
            isDelay=false;
          }
          var label=AnimModule.newSequenceLabel(nlist,80,10,cc.color(0,255,0,255),isDelay,function(count,label){
          }.bind(this));
          this.addLabel(label);
        }
      }
    }
  },
  onStateEnd:function(sender)
  {
    //this.status.setString(this.leveldata[this.currLevel].freeTxt);
    //SysUtils.log(this.leveldata[this.currLevel].freeTxt);
    this.inState=false;
    this.countdelta=0;
    this.step=this.step+1;
    //this.addScore(50);
    this.doCutScenes(null);
  },
  onSequenseEnd:function(sender)
  {
    //this.status.setString(this.leveldata[this.currLevel].endTxt);
    //SysUtils.log(this.leveldata[this.currLevel].endTxt);
    var length=this.leveldata[this.currLevel].stateTimes.length;
    var interval=this.leveldata[this.currLevel].timer-this.leveldata[this.currLevel].stateTimes[length-1][1]-3;
    if(interval<3)
    {
      interval=3;
    }
    var label=AnimModule.newTimerLabel(80,Math.ceil(interval),"s",10,null,function(count,label){
    }.bind(this));
    this.addLabel(label);
    var seq=cc.sequence(cc.delayTime(interval),cc.callFunc(this.doExit,this));
    this.stopAllActions();
    this.runAction(seq);
  },
  update:function(delta)
  {
    if(this.inState)
    {
      this.countdelta=this.countdelta+delta*1000;
    }
  },
  onMsg:function(event)
  {

  },
  reStart:function(sender)
  {
    this.stopAllActions();
    if(DataModule.consume("entergame"))
    {
      this.oper_close=true;
      this.closeLabels();
      UIModule.closeLatest(true);
      if(typeof this.params.gameid=="undefined")
      {
        var msg="Open:"+this.define.ID;
        cc.eventManager.dispatchCustomEvent("jsInner",msg);
      }
      else
      {
        TinyGameWrapper.reStartGame();
      }
    }
  },
  gameClose:function(event)
  {
    this.oper_close=true;
    this.isclose=true;
    UIModule.closeLayer(this);
    //this.doExit(null);
  },
  successEnd:function(sender)
  {
    this.isclose=true;
    var interval=this.leveldata[this.currLevel].successTime[1]-this.leveldata[this.currLevel].successTime[0];

    var label=AnimModule.newTimerLabel(80,Math.ceil(interval),"s",10,null,function(count,label){
    }.bind(this));
    this.addLabel(label);
    var seq=cc.sequence(cc.delayTime(interval),cc.callFunc(this.doExit,this));
    this.stopAllActions();
    this.runAction(seq);
  },
  failEnd:function(sender)
  {
    this.isclose=true;
    var interval=this.leveldata[this.currLevel].failTime[1]-this.leveldata[this.currLevel].failTime[0];

    var label=AnimModule.newTimerLabel(80,Math.ceil(interval),"s",10,null,function(count,label){
    }.bind(this));
    this.addLabel(label);
    var seq=cc.sequence(cc.delayTime(interval),cc.callFunc(this.doExit,this));
    this.stopAllActions();
    this.runAction(seq);
  },
  successDialog:function(sender)
  {
    SysUtils.pause(this);
    var winLayer = new GameOver("Win");
    var func=cc.callFunc(winLayer.showDone, this, winLayer);
    var seq=cc.sequence(cc.scaleTo(_animTime,0.1),func);
    winLayer.score=this.score;
    winLayer.ltimer=this.ltimer;
    winLayer.define=this.define;
    var parent=cc.director.getRunningScene();
    winLayer.params=this.params;
    UIModule.showLayer(winLayer,{callback:cc.callFunc(winLayer.showDone,this,winLayer),aparent:parent,isBg:false,bgOpacity:200,act:null,outact:seq,isAct:true,isMsg:false},"winLayer");
  },
  failDialog:function(sender)
  {
    SysUtils.pause(this);
    var loseLayer = new GameOver("Lose");
    loseLayer.score=this.score;
    loseLayer.ltimer=this.ltimer;
    loseLayer.define=this.define;
    var func=cc.callFunc(loseLayer.showDone, this, loseLayer);
    var seq=cc.sequence(cc.scaleTo(_animTime,0.1),func);
    var parent=cc.director.getRunningScene();
    loseLayer.params=this.params;
    UIModule.showLayer(loseLayer,{callback:cc.callFunc(loseLayer.showDone,this,loseLayer),aparent:parent,isBg:false,bgOpacity:200,act:null,outact:seq,isAct:true,isMsg:false},"Loselayer");
  },
  isSuccess:function()
  {
    if(this.ScoreTemplate=="score_template_heart") {
      if (this.score >= this.leveldata[this.currLevel].heartValues[0]) {
        return true;
      }
      else {
        return false;
      }
    }else
    {
      if (this.score >= this.leveldata[this.currLevel].goal) {
        return true;
      }
      else {
        return false;
      }
    }
  },
  saveHeart:function()
  {
    var heart=Math.round(this.score/100);
    if(heart>0)
    {
      var data=CharacterModule.getCharaData();
      data[0].heart=data[0].heart+heart;
      CmdReq_Set_Prop.setHeart(data[0].heart);
      CharacterModule.saveCharacterData();
    }
  },
  doExit:function(sender)
  {
    SysUtils.log("BaseGame:doExit");
    this.stopAllActions();
    this.saveHeart();
    if(this.params.isStartEnd)
    {
      if(this.isSuccess())
      {
        this.successDialog(null);
      }
      else
      {
        this.failDialog(null);
      }
    }
    else
    {
      UIModule.closeLayer(this);
      //TinyGameWrapper.leaveGame(this.params);
      if(this.isSuccess()) {
        cc.eventManager.dispatchCustomEvent("UIMsg", "NextStep:" + this.params.gameid+":Win");
      }
      else
      {
        cc.eventManager.dispatchCustomEvent("UIMsg", "NextStep:" + this.params.gameid+":Fail");
      }
    }
  },
  refreshTimer:function()
  {
    var timer_prog=this.progress.getChildByName("pnl_progress");
    var txt_num=this.progress.getChildByName("txt_memo").getChildByName("txt_value");
    txt_num.setString(this.ltimer);
    timer_prog.setContentSize(cc.size(this.cd_size.width*this.ltimer/this.leveldata[this.currLevel].timer,this.cd_size.height));
  },
  calcPosition:function()
  {
    if(this.ScoreTemplate=="score_template_heart") {
      var lb_bar = ccui.helper.seekWidgetByName(this.iscore, "lb_bar");
      var isize = lb_bar.getContentSize();
      var names = ["pnl_spliter_one", "pnl_spliter_two", "pnl_spliter_three"];
      for (var i = 0; i < this.leveldata[this.currLevel].heartValues.length; i++) {
        var value = this.leveldata[this.currLevel].heartValues[i];
        var pos_percent = value / this.getHeartMax();
        var posx = pos_percent * isize.width;
        var spliter = ccui.helper.seekWidgetByName(this.iscore, names[i]);
        spliter.setPosition(cc.p(posx - spliter.getContentSize().width / 2, spliter.getPositionY()));
      }
    }
  },
  getHeartMax:function()
  {
    return this.leveldata[this.currLevel].heartValues[this.leveldata[this.currLevel].heartValues.length-1];
  },
  refreshScore:function()
  {
    if(this.ScoreTemplate=="score_template_heart") {
      var lb_bar = ccui.helper.seekWidgetByName(this.iscore, "lb_bar");
      var percent = this.score / this.leveldata[this.currLevel].heartValues[2] * 100;
      lb_bar.setPercent(percent);
      var scoreText = ccui.helper.seekWidgetByName(this.iscore, "txt_score");
      scoreText.setFontName("Helvetica");
      this.scheduleOnce(function(delta){
        scoreText.setString(this.score);
      },0.1);
      var heart_three = ccui.helper.seekWidgetByName(this.iscore, "pnl_heart_three");
      var heart_two = ccui.helper.seekWidgetByName(this.iscore, "pnl_heart_two");
      var heart_one = ccui.helper.seekWidgetByName(this.iscore, "pnl_heart_one");
      heart_three.setVisible(false);
      heart_two.setVisible(false);
      heart_one.setVisible(false);
      if (this.score >= this.leveldata[this.currLevel].heartValues[2]) {
        //show three heart
        heart_three.setVisible(true);
      }
      if (this.score >= this.leveldata[this.currLevel].heartValues[1]) {
        //show two heart
        heart_two.setVisible(true);
      }
      if (this.score >= this.leveldata[this.currLevel].heartValues[0]) {
        //show one heart
        heart_one.setVisible(true);
      }
    }
    else
    {
      var scoreText = ccui.helper.seekWidgetByName(this.iscore, "scoreText");
      scoreText.setFontName("Helvetica");
      this.scheduleOnce(function(delta){
        scoreText.setString(this.score);
      },0.1);
    }
    this.refreshScoreEffect();
  },
  downTimersSeq:function(interval,func)
  {
    var seq=null;
    for(var i=0;i<Math.ceil(interval);i++)
    {
      if(seq==null)
      {
        seq=cc.sequence(cc.delayTime(1.0),cc.callFunc(func,this));
      }else
      {
        seq=cc.sequence(seq,cc.delayTime(1.0),cc.callFunc(func,this));
      }
    }
    return seq;
  },
  refreshScoreEffect:function()
  {
    var scoreImg = ccui.helper.seekWidgetByName(this.iscore, "img_leader");
    if(scoreImg!=null&&this.score>0)
    {
      var time=0.03;
      var seq=cc.sequence(cc.rotateTo(time, 10), cc.rotateTo(time, -10)
        ,cc.rotateTo(time, 10), cc.rotateTo(time, -10)
        ,cc.rotateTo(time, 20), cc.rotateTo(time, -20)
        ,cc.rotateTo(time*2, 10), cc.rotateTo(time*3, -10)
        ,cc.rotateTo(time*5, 0)
      );
      scoreImg.runAction(seq);
    }
  },
  onTimer:function(delta)
  {
    if(!this.isclose)
    {
      this.ltimer=this.ltimer-1;
      this.refreshTimer();
      if(this.ltimer<1)
      {
        this.gameClose(null);
      }
    }
  },
  newLabel:function(fontsize,color)
  {
    if(cc.sys.isNative)
    {
      var Label = new cc.Label();
      Label.enableOutline(cc.color(255,0,0,255),2);
      Label.enableShadow(cc.color(0,255,255,255),cc.size(2,-2),1);
      Label.setTextColor(color);
      Label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
      Label.setSystemFontName("Helvetica-Bold");
      Label.setSystemFontSize(fontsize);
      return Label;
    }
    else
    {
      var fontDefStrokeShadow = new cc.FontDefinition();
      fontDefStrokeShadow.fontName = "Arial";
      fontDefStrokeShadow.fontSize = fontsize;
      fontDefStrokeShadow.textAlign = cc.TEXT_ALIGNMENT_CENTER;
      fontDefStrokeShadow.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
      fontDefStrokeShadow.fillStyle = color;
      fontDefStrokeShadow.boundingWidth = 2;
      fontDefStrokeShadow.boundingHeight = 2;
      // stroke
      fontDefStrokeShadow.strokeEnabled = true;
      fontDefStrokeShadow.strokeStyle = cc.color(255,0,0,255);
      // shadow
      fontDefStrokeShadow.shadowEnabled = true;
      fontDefStrokeShadow.shadowOffsetX = -2;
      fontDefStrokeShadow.shadowOffsetY = 2;

      var Label=new cc.LabelTTF("", fontDefStrokeShadow);
      return Label;
    }
  },
  playScoreEffect:function(nums,pos)
  {
    var color=cc.color(0,255,0,255);
    if(nums<0)
    {
      color=cc.color(255,0,0,255);
    }
    var Label = this.newLabel(100,color);
    Label.setString("+"+nums);
    if(nums<0)
    {
      Label.setString(nums);
    }
    var size=cc.director.getVisibleSize();
    if(pos==null)
    {
      pos=cc.p(size.width/2,size.height/2);
    }
    Label.setPosition(pos);
    this.addChild(Label);
    var scoreText = ccui.helper.seekWidgetByName(this.iscore, "txt_score");
    if(this.ScoreTemplate!="score_template_heart") {
      scoreText = ccui.helper.seekWidgetByName(this.iscore, "scoreText");
    }
    var p=scoreText.getWorldPosition();
    var moveup=cc.moveTo(0.3,cc.p(pos.x,pos.y+100));
    var moveadd=cc.moveTo(0.3,p);
    var scale=cc.scaleTo(0.3,0.3);
    var spwanadd=cc.spawn(moveadd,scale);
    Label.runAction(cc.sequence(moveup,cc.delayTime(0.3),spwanadd,cc.delayTime(0.2),cc.callFunc(this.refreshScore,this),cc.removeSelf()));
  },
  addScore:function(nums,pos)
  {
    this.score=this.score+nums;
    this.playScoreEffect(nums,pos);
  }
});