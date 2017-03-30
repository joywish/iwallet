
var BackGround = cc.LayerColor.extend({
  listener:null,
  background:null,
  bgOpacity:0,
  bgImage:"",
  isCanTouch:true,
  isProgress:false,
  isClose:false,
  isMsgBtn:false,
  ctor: function (aopacity,bgimage) {
    var size=cc.director.getWinSize();
    this._super(cc.color(0,0,0,0),size.width,size.height);
    if(aopacity!=null)
    {
      this.bgOpacity=aopacity;
    }
    if(bgimage!=null)
    {
      this.bgImage=bgimage;
    }
  },
  onExit: function() {
    this._super();
    if(cc.sys.isNative) {
      cc.eventManager.removeListener(this.listener);
    }
    //cc.eventManager.removeListener(cc.EventListener.TOUCH_ONE_BY_ONE);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
    if(cc.sys.isNative)
    {
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
    this.background.setBackGroundColorOpacity(this.bgOpacity);
    this.background.setTouchEnabled(false);
    var size=cc.director.getVisibleSize();
    if(this.bgOpacity>=0&&this.bgOpacity<250)
    {
      var image=new ccui.ImageView("res/source/common/heisebeijing.png");
      image.setScale9Enabled(true);
      image.setContentSize(size.width,size.height);
      image.setAnchorPoint(0.5,0.5);
      image.setPosition(size.width/2,size.height/2);
      this.addChild(image);
      if(this.isProgress)
      {
        this.background.setTouchEnabled(true);
        this.addProgressAction(image);
      }
      else
      {
        image.setTouchEnabled(this.isCanTouch);
        image.addClickEventListener(function(sender){
          var def=UIModule.getLatest();
          if(def!=null)
          {
            UIModule.closeLatest();
            if(UIModule.getSameNameCount(def.name)<1)
            {
              image.setTouchEnabled(false);
            }
          }
        });
      }
    }
    else
    {
      if(this.isProgress)
      {
        this.background.setTouchEnabled(true);
        this.addProgressAction(this.background);
      }
      else
      {
        this.background.setTouchEnabled(this.isCanTouch);
        this.background.addClickEventListener(function(e){
          var def=UIModule.getLatest();
          if(def!=null)
          {
            UIModule.closeLatest();
            if(UIModule.getSameNameCount(def.name)<1)
            {
              this.background.setTouchEnabled(false);
            }
          }
        });
      }
    }
  },
  addProgressAction:function(parent)
  {
    var size=cc.director.getVisibleSize();
    var to = cc.progressFromTo(2, 0, 100);
    var seq=cc.sequence(cc.show(),to,cc.blink(1,3));
    var progress = new cc.ProgressTimer(new cc.Sprite("res/coin/1yuan.png"));
    progress.type = cc.ProgressTimer.TYPE_RADIAL;
    progress.setReverseDirection(true);
    parent.addChild(progress);
    progress.x=size.width/2;
    progress.y=size.height/2;
    progress.runAction(seq.repeatForever());
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
        if(sender.getName()=="pnl_msg")
        {
          SysUtils.log("TODO:BackGround:show all the msg list");
        }
        else if(sender.getName()=="pnl_close")
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
    UIModule.closeLatest();
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