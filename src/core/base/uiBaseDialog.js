
var BaseDialog = BaseLayer.extend({
  //listener:null,
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this._super();
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
  },
  update:function(delta){
    this._super(delta);
  },
  onMsg:function(event)
  {
    this._super(event);
  }
});