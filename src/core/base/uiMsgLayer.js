
var uiMsgLayer = cc.LayerColor.extend({
  listener:null,
  isCanTouch:false,
  isClose:false,
  ctor: function () {
    var size=cc.director.getVisibleSize();
    this._super(cc.color(0,0,0,0),size.width,size.height);
  },
  onExit: function() {
    this._super();
    if(cc.sys.isNative)
    {
      cc.eventManager.removeListener(this.listener);
    }
    //cc.eventManager.removeListener(cc.EventListener.TOUCH_ONE_BY_ONE);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
    if(cc.sys.isNative) {
      this.listener = cc.EventListenerCustom.create("UIMsg", this.onMsg.bind(this));
      cc.eventManager.addEventListenerWithFixedPriority(this.listener, 2);
    }
    var file = "res/cBgLayer.json";
    var json = ccs.load(file);
    this.addChild(json.node);
    json.node.setContentSize(cc.director.getVisibleSize());
    ccui.helper.doLayout(json.node);
    var tools=ccui.helper.seekWidgetByName(json.node,"pnl_value");
    tools.setVisible(false);
    tools.setTouchEnabled(false);

    var pnl_close=ccui.helper.seekWidgetByName(json.node,"pnl_close");
    if(this.isClose)
    {
      pnl_close.addTouchEventListener(this.onTouchButton.bind(this),this);
    }
    else
    {
      pnl_close.setVisible(false);
      pnl_close.setTouchEnabled(false);
    }

    var pnl_msg=ccui.helper.seekWidgetByName(json.node,"pnl_msg");
    if(this.isMsgBtn)
    {
      pnl_msg.addTouchEventListener(this.onTouchButton.bind(this),this);
    }
    else
    {
      pnl_msg.setVisible(false);
      pnl_msg.setTouchEnabled(false);
    }

    this.background=ccui.helper.seekWidgetByName(json.node,"pnlBg");
    this.background.setBackGroundColorOpacity(0);
    this.background.setTouchEnabled(this.isCanTouch);
  },
  update:function(delta){
    this._super(delta);
  },
  onMsg:function(event)
  {
    //this._super(event);
  },
  onTouchButton:function(sender,type)
  {
    switch(type)
    {
      case ccui.Widget.TOUCH_BEGAN:
       sender.setScale(0.8);
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_CANCELED:
        sender.setScale(1.0);
        break;
      case ccui.Widget.TOUCH_ENDED:
        sender.setScale(1.0);
        if(sender.getName()=="pnl_close")
        {
          UIModule.closeLayer(this);
        }
        break;
      default:
        sender.setScale(1.0);
        break;
    }
  },
  onTouchBegan:function(touch,event)
  {
    //cc.log("onTouchBegan");
    //UIModule.closeLatest();
    return false;
  },
  onTouchMoved:function(touch,event)
  {
    //cc.log("onTouchMove");
  },
  onTouchEnded:function(touch,event)
  {
    //cc.log("onTouchEnd");
  },
  onTouchCancelled:function(touch,event)
  {
    //cc.log("onTouchCanceled");
  }
});