
var cppTag=192837465;

var GameStart = cc.Layer.extend({
  gameid:0,
  params:null,
  ctor: function (id) {
    this.gameid=id;
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
    image.setTouchEnabled(true);
    var that=this;
    image.addClickEventListener(function(sender){
      that.enterGame(null);
    });
    var file = "res/GameStartLayer.json";
    var json = ccs.load(file);
    this.addChild(json.node);
    var text=ccui.helper.seekWidgetByName(json.node,"Text_info");
    var define=this.getGameByID(this.gameid);
    var title = "";
    var message = "";
    if(define.SceneName == "GameThrow")
    {
      var throwsdata = this.getGameThrowsByID(this.gameid);
      title = throwsdata.name;
      message = throwsdata.secneDesc;
    }
    else
    {
      title = define.Title;
      message = define.Message;
    }
    text.setString(message);
    var text=ccui.helper.seekWidgetByName(json.node,"Text");
    text.setString(title);
  },
  actDone:function(sender)
  {

  },
  enterGame:function(sender)
  {
    var define=this.getGameByID(this.gameid);
    if(define!=null)
    {
      curGameID=define.ID;
      if(define.Type=="js")
      {
        var tglayer=eval("new "+define.SceneName+"()");
        tglayer.params = this.params;
        tglayer.define = define;
        UIModule.closeLatest(true);
        var parent=cc.director.getRunningScene();
        UIModule.showLayer(tglayer,{callback:cc.callFunc(tglayer.showDone,this,tglayer),aparent:parent,isBg:false,bgOpacity:255,act:null,outact:null,isAct:true},define.SceneName);
      }
      else //if(define.Type=="cpp")
      {
        //var EnterGameMsg="Open:"+define.LevelName+":"+define.SceneName+":"+define.Level;
        SysUtils.log("Start.enterGame")
        var EnterGameMsg="Open:"+define.ID;
        cc.eventManager.dispatchCustomEvent("cppMessage",EnterGameMsg);

        var scene=cc.director.getRunningScene();
        var cpplayer=scene.getChildByTag(cppTag);
        if(cpplayer!=null)
        {
          var cppgame=new CppGameLayer();
          cppgame.params=this.params;
          cppgame.cpplayer=cpplayer;
          cppgame.define=define;
          UIModule.closeLatest(true);
          if(cppgame!=null)
          {
            scene.addChild(cppgame);
            UIModule.runDefAction(cppgame,this.actDone);
          }
          cpplayer.scheduleUpdate();
        }
        else
        {
          SysUtils.log("not cpp scene={0}".format(define.SceneName));
          UIModule.closeLatest();
        }
      }
    }
    else
    {
      cc.log("undefine game id="+this.gameid);
    }
  },
  showDone:function(sender)
  {
    cc.log("GameStart:showDone");
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
  getGameThrowsByID: function (id) {
    for(var i=0;i<gameThrowsData.length;i++)
    {
      if(gameThrowsData[i].id==1)
      {
        return gameThrowsData[i];
      }
    }
    return null;

  }
});


