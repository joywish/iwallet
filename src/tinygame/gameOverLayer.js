
var GameOver = cc.Layer.extend({
  msg: "",
  score:0,
  ltimer:0,
  txt:"",
  params:null,
  define:null,
  ctor: function (content) {
    this.msg = content;
    this._super();
  },
  onEnter: function () {
    this._super();

    var image=new ccui.ImageView("res/source/common/heisebeijing.png");
    var size=cc.director.getVisibleSize();
    image.setScale9Enabled(true);
    image.setContentSize(size.width,size.height);
    image.setAnchorPoint(0.5,0.5);
    image.setPosition(size.width/2,size.height/2);
    this.addChild(image);
    image.setTouchEnabled(false);
    var that=this;
    image.addClickEventListener(function(sender){
      //that.enterGame(null);
    });

    var file = "res/VictoryLayer.json";
    var json = ccs.load(file);
    var root=ccui.helper.seekWidgetByName(json.node,"mainroot");
    root.setBackGroundColorOpacity(0);
    root.setTouchEnabled(true);
    this.addChild(json.node);
    this.root=json.node;
    var imgvictory = ccui.helper.seekWidgetByName(json.node, "victoryImg");
    if (this.msg == "Win") {
      //SysUtils.log("Win");
      imgvictory.setBackGroundImage("res/source/game01/game1p01_shengli.png");

      var size=imgvictory.getContentSize();
      var effect=AnimModule.newEffect("win/appear",function()
        {
          var reffect=AnimModule.newRepeatEffect("win/circulation");
          imgvictory.addChild(reffect[0]);
          effect[0].removeFromParent(true);
          reffect[0].setPosition(size.width/2,size.height/2+5);
          reffect[0].setScale(1.3);
        }
      );
      imgvictory.addChild(effect[0]);
      effect[0].setPosition(size.width/2,size.height/2+5);
      effect[0].setScale(1.3);
    }
    else {
      //SysUtils.log("fail");
      imgvictory.setBackGroundImage("res/source/game01/game1p01_shibai.png");

      var size=imgvictory.getContentSize();
      var effect=AnimModule.newEffect("fail/appear",function()
        {
          var reffect=AnimModule.newRepeatEffect("fail/circulation");
          imgvictory.addChild(reffect[0]);
          effect[0].removeFromParent(true);
          reffect[0].setPosition(size.width/2,size.height/2+5);
          reffect[0].setScale(1.3);
        }
      );
      imgvictory.addChild(effect[0]);
      effect[0].setPosition(size.width/2,size.height/2+5);
      effect[0].setScale(1.3);
    }
    var score=ccui.helper.seekWidgetByName(json.node,"txt_score");
    score.setString(this.score);
    var timer=ccui.helper.seekWidgetByName(json.node,"txt_time");
    if(this.define!=null&&this.define.SceneName!="SceneLove")
    {
      timer.setString(this.ltimer);
    }
    else
    {
      var pnl_timer=ccui.helper.seekWidgetByName(json.node,"pnl_timer");
      pnl_timer.setVisible(false);
    }
    this.scheduleOnce(this.operation,0.1);
  },
  operation:function(delta)
  {
    SysUtils.log("operation");
    var btnretry = ccui.helper.seekWidgetByName(this.root, "btn_retry");
    var that = this;
    var define=that.define;
    btnretry.addClickEventListener(function () {
      //cc.director.getEventDispatcher().dispatchCustomEvent("GameSuccess", "");
      if(define!=null)
      {
        UIModule.showMain();
        if(that.params==null||that.params.isStartEnd)
        {
          if(define.Type=="cpp")
          {
            //cc.director.getEventDispatcher().dispatchCustomEvent("GameStep:GameOver", "");
            var scene=cc.director.getRunningScene();
            var cpplayer=scene.getChildByTag(cppTag-1);
            if(cpplayer!=null)
            {
              cpplayer.removeFromParent(true);
            }
          }else
          {
            UIModule.closeLatest(true);
            UIModule.closeLatest(true);
          }
          cc.eventManager.dispatchCustomEvent("jsInner", "Open:"+define.ID);
          cc.eventManager.dispatchCustomEvent("UIMsg","NextStep:"+define.ID+":"+that.msg);
        }
        else
        {
          if(define.Type=="cpp")
          {
            //cc.director.getEventDispatcher().dispatchCustomEvent("GameStep:GameOver", "");
            var scene=cc.director.getRunningScene();
            var cpplayer=scene.getChildByTag(cppTag-1);
            if(cpplayer!=null)
            {
              cpplayer.removeFromParent(true);
            }
          }
          else
          {
            UIModule.closeLatest(true);
            UIModule.closeLatest(true);
          }
          that.params.msg=that.msg;
          TinyGameWrapper.leaveGame(that.params);
        }
      }
    });
    var btnclose = ccui.helper.seekWidgetByName(this.root, "btn_close");
    btnclose.addClickEventListener(function () {
      UIModule.showMain();
      if(that.params==null||that.params.isStartEnd)
      {
        if(define!=null&&define.Type=="cpp")
        {
          //cc.director.getEventDispatcher().dispatchCustomEvent("GameStep:GameOver", "");
          var scene=cc.director.getRunningScene();
          var cpplayer=scene.getChildByTag(cppTag-1);
          if(cpplayer!=null)
          {
            cpplayer.removeFromParent(true);
          }
        }else
        {
          UIModule.closeLatest(true);
          UIModule.closeLatest(true);
        }
        var gid="-1";
        if(define!=null)
        {
          gid=define.ID;
        }
        //cc.director.getEventDispatcher().dispatchCustomEvent("GameSuccess", "");
        cc.eventManager.dispatchCustomEvent("UIMsg","NextStep:"+gid+":"+that.msg);
      }
      else
      {
        if(define!=null&&define.Type=="cpp")
        {
          //cc.director.getEventDispatcher().dispatchCustomEvent("GameStep:GameOver", "");
          var scene=cc.director.getRunningScene();
          var cpplayer=scene.getChildByTag(cppTag-1);
          if(cpplayer!=null)
          {
            cpplayer.removeFromParent(true);
          }

        }else
        {
          UIModule.closeLatest(true);
          UIModule.closeLatest(true);
        }
        if(that.params!=null)
        {
          that.params.msg=that.msg;
          TinyGameWrapper.leaveGame(that.params);
        }
      }
      if(that.params!=null&&that.params.isVideo)
      {
        cc.eventManager.dispatchCustomEvent("jsInner","Play:toTom");
      }
    });
  },
  getGameByID:function(id)
  {
    for(var i=0;i<miniGames.MiniGames.length;i++)
    {
      if(miniGames.MiniGames[i].ID==id)
      {
        return miniGames.MiniGames[i];
      }
    }
    return null;
  },
  showDone:function(sender)
  {
    cc.log("GameOver:showDone");
  },
  gameOverDone: function () {
    cc.director.getEventDispatcher().dispatchCustomEvent("js_game_over");
  }
});


