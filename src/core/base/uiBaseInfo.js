
var BaseInfoData =
{
  backBtn:false,
  actpoint : 0,
  maxactpoint:150,
  gold: 0,
  gems:0
};

var BaseInfo = cc.Layer.extend({
  listener:null,
  CharList:null,
  actTxt:null,
  goldTxt:null,
  gemsTxt:null,
  returnbtn:null,
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this._super();
    if(cc.sys.isNative) {
      cc.eventManager.removeListener(this.listener);
      cc.eventManager.removeListener(this.listener1);
    }
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
    var size = cc.winSize;
    if(cc.sys.isNative) {
      this.listener = cc.EventListenerCustom.create("UIMsg", this.onMsg.bind(this));
      cc.eventManager.addEventListenerWithFixedPriority(this.listener, 2);
      this.listener1 = cc.EventListenerCustom.create("basefresh", this.onfresh.bind(this));
      cc.eventManager.addEventListenerWithFixedPriority(this.listener1, 2);
    }
    this.CharList = SysUtils.readJson("res/data/Characters.json");
    var fileTool = "res/cItemTemplate.json"
    var jsonTool = ccs.load(fileTool);
    var ToolUi = jsonTool.node;
    var toolbar = ccui.helper.seekWidgetByName(ToolUi, "toolbar");
    toolbar.retain();
    toolbar.removeFromParent();
    toolbar.setPosition(cc.p(size.width - toolbar.getContentSize().width, size.height-toolbar.getContentSize().height));
    this.addChild(toolbar);
    var actPower = toolbar.getChildByName("pnl_act");
    this.actTxt = actPower.getChildByName("Text");
    var image = actPower.getChildByName("btn_add");
    var pic = actPower.getChildByName("Image");
    image.addTouchEventListener(this.touchEvent, this);
    var goldUI = toolbar.getChildByName("pnl_gold");
    this.goldTxt = goldUI.getChildByName("Text");
    this.goldTxt.setString(this.CharList[0].gold);
    var image = goldUI.getChildByName("btn_add");
    var pic = goldUI.getChildByName("Image");
    image.addTouchEventListener(this.touchEvent, this);
    var gemsUI = toolbar.getChildByName("pnl_gems");
    this.gemsTxt = gemsUI.getChildByName("Text");
    this.gemsTxt.setString(this.CharList[0].diamond);
    var image = gemsUI.getChildByName("btn_add");
    var pic = gemsUI.getChildByName("Image");
    image.addTouchEventListener(this.touchEvent, this);

    this.returnbtn = ccui.helper.seekWidgetByName(ToolUi,"btn_close");
    this.returnbtn.retain();
    this.returnbtn.removeFromParent();
    this.returnbtn.setPosition(cc.p(50, size.height-50));
    this.addChild(this.returnbtn);
    this.returnbtn.addTouchEventListener(this.touchEvent, this);
    this.init();
  },
  update:function(delta){
    
  },
  onMsg:function(event)
  {

  },
  onfresh:function(event)
  {
    this.actTxt.setString(CharacterModule.getCharacterData(0).tili + "/" + CharacterModule.getCharacterData(0).tilimax);
    this.goldTxt.setString(CharacterModule.getCharacterData(0).gold);
    this.gemsTxt.setString(CharacterModule.getCharacterData(0).diamond);
  },
  init:function()
  {
    this.actTxt.setString(CharacterModule.getCharacterData(0).tili + "/" + CharacterModule.getCharacterData(0).tilimax);
    this.goldTxt.setString(CharacterModule.getCharacterData(0).gold);
    this.gemsTxt.setString(CharacterModule.getCharacterData(0).diamond);
    if (BaseInfoData.backBtn == false)
    {
      this.returnbtn.setVisible(false);
    }
    else
    {
      this.returnbtn.setVisible(true);
    }
  },
  touchEvent: function (sender, type) {
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        if (sender.getName() == "btn_close") {
          sender.setScale(0.7);
        }
        else {
          sender.setScale(0.7);
        }
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED:
        if (sender.getName() == "btn_close") {
          sender.setScale(1.0);
          //uiroot.removeFromParent();
          SysUtils.log("close");
          UIModule.closeLatest();
        }
        else {
          sender.setScale(1.0);
        }
        break;
      case ccui.Widget.TOUCH_CANCELED:
        sender.setScale(1.0);
        break;
      default:
        break;
    }
  },
});