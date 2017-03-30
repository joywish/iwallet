
var BaseLayer = cc.Layer.extend({
  listener:null,
  params:null,
  uidef:null,
  define:null,
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this._super();
    if(cc.sys.isNative) {
      cc.eventManager.removeListener(this.listener);
    }
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
    if(cc.sys.isNative) {
      this.listener = cc.EventListenerCustom.create("UIMsg", this.onMsg.bind(this));
      cc.eventManager.addEventListenerWithFixedPriority(this.listener, 2);
    }
  },
  update:function(delta){
    this._super(delta);
  },
  onMsg:function(event)
  {
    //this._super(event);
  }
});