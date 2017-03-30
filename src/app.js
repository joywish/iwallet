
var isVideoApp=false;

var SocialLayer = cc.Layer.extend({
  ctor: function () {
    this._super();
    return true;
  },
  onEnter:function(){
    this._super();
    this.init();
  },
  init: function () {
    var size=cc.director.getVisibleSize();

    var mainNode = new cc.Node();
    this.addChild(mainNode);

    //var vlist=new VideoListLayer();
    //mainNode.addChild(vlist,3);

    var uilayer = new cc.Layer();
    mainNode.addChild(uilayer);
    UIModule.setMain(uilayer);

    var msglayer=new uiMsgLayer();
    mainNode.addChild(msglayer);
    UIModule.setMsgLayer(msglayer);
    msglayer.setLocalZOrder(99999999);

    var videolist=new VideoListLayer();
    UIModule.showSimple(videolist,"videolist");

    //var xiaoxiaole=new oXiaoXiaoLe();
    //xiaoxiaole.define={"ID":2,"LevelName":"Level1","SceneName":"oXiaoXiaoLe","Level":1,"LevelData":"","Type":"js","Gamebg":"","Title":"连连看","Message":"选择相同的图标消除"};
    //UIModule.showSingle(xiaoxiaole,"xiaoxiaole");

    //var CoinMall=new uiCoinMall();
    //UIModule.showSimple(CoinMall,"coinmall");
  }
});

var SocialScene=cc.Scene.extend({
  ctor: function(){
    this._super();
    return true;
  },
  onExit: function(){
    this._super();
  },
  onEnter: function(){
    this._super();
    var size=cc.director.getVisibleSize();

    var layer=new SocialLayer();
    this.addChild(layer,1);

    var sprite = new cc.Sprite("res/coin/1yuan.png");
    sprite.setPosition(cc.p(size.width/2,size.height/2));
    this.addChild(sprite, -1);
  }
});