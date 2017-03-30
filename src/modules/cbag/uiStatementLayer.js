
var StatementLayer = cc.Layer.extend({
  msg: "",
  score:0,
  ltimer:0,
  txt:"",
  params:null,
  define:null,
  starcount:0,
  stars:["pnl_star_left","pnl_star_mid","pnl_star_right"],
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
    image.setTouchEnabled(true);
    var that=this;
    image.addClickEventListener(function(sender){
      //that.enterGame(null);
    });

    var file = "res/cStatementLayer.json";
    var json = ccs.load(file);
    this.root=json.node;
    this.addChild(json.node);

    if(this.msg != "Win")
    {
      this.starcount=0;
    }
    var pnlstar=ccui.helper.seekWidgetByName(json.node,"pnl_star");
    for(var i=0;i<this.stars.length;i++)
    {
      var star=ccui.helper.seekWidgetByName(pnlstar,this.stars[i]);
      if(star!=null)
      {
        star.setVisible(false);
      }
    }
    if(this.starcount>0)
    {
      //TODO:show the star
    }

    var imgvictory = ccui.helper.seekWidgetByName(json.node, "pnl_vitory");
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
    var btnclose = ccui.helper.seekWidgetByName(json.node, "pnl_close");
    btnclose.addTouchEventListener(this.onTouch.bind(this),this);
    if(this.items!=null)
    {
      this.listItems();
    }
    else if(this.drops!=null)
    {
      this.showDrops();
    }
  },
  listItems:function()
  {
    var sv_item_cnt=ccui.helper.seekWidgetByName(this.root,"sv_item_cnt");
    var items=BagModule.qryListData([{"id":1,"count":1}]);
    BagModule.newItems(items,null,sv_item_cnt,{isDescribe:true});
  },
  showBasics:function(sv_basic,dbasic)
  {
    //show basic
    var basictpl=ccui.helper.seekWidgetByName(sv_basic,"pnl_tpl");
    var height=basictpl.getContentSize().height*dbasic.length;
    if(height<sv_basic.getContentSize().height){
      height=sv_basic.getContentSize().height;
    }
    sv_basic.setInnerContainerSize(cc.size(sv_basic.getContentSize().width,height));
    for(var i=0;i<dbasic.length;i++) {
      var basic = basictpl.clone();
      sv_basic.addChild(basic);
      basic.setVisible(true);
      basic.setPosition(0, basictpl.getContentSize().height * (i+1));
      var icon=ccui.helper.seekWidgetByName(basic,"img_icon");
      icon.setBackGroundImage(dbasic[i].data.icon);
      var txtname=ccui.helper.seekWidgetByName(basic,"txt_name");
      txtname.setString(dbasic[i].data.abbr);
      var txtnum=ccui.helper.seekWidgetByName(basic,"txt_num");
      txtnum.setString(dbasic[i].num);
    }
    basictpl.removeFromParent(true);
  },
  showItems:function(sv_item_cnt,items)
  {
    //show items
    var file="res/cCharacter.json";
    var json = ccs.load(file);
    var template=ccui.helper.seekWidgetByName(json.node,"pnl_tpl");
    var ts=template.getContentSize();
    var is=sv_item_cnt.getContentSize();
    var col=Math.floor(is.width/ts.width);
    var oset=(is.width-(col*ts.width))/2;
    var row=Math.floor(items.length/col);

    if(items.length%col!=0)
    {
      row=row+1;
    }
    var iheight=ts.height*row;
    if(row>1){
      if(iheight<is.height)
      {
        iheight=is.height;
      }
      var height=iheight;
      if(iheight>=500)
      {
        height=500;
      }
      this.osetoper=height-is.height;
      sv_item_cnt.setContentSize(is.width,height);
      sv_item_cnt.setInnerContainerSize(is.width,iheight);
    }
    else {
      this.osetoper=0;
      oset=(is.width-(items.length*ts.width))/2;
    }

    for(var i=0;i<items.length;i++) {
      var item=template.clone();
      sv_item_cnt.addChild(item);
      var irow=Math.floor(i/col);
      var icol=i%col;
      var p=cc.p(oset+icol*ts.width,iheight-(irow+1)*ts.height);
      item.setPosition(p.x, p.y);
      if(items[i].data!=null)
      {
        var txt=ccui.helper.seekWidgetByName(item,"txt_armor");
        txt.setString(items[i].data.abbr);
        var icon=ccui.helper.seekWidgetByName(item,"pnl_tpl_bg");
        icon.setBackGroundImage(items[i].data.iconUrl);
        icon.setPosition(55,59);
      }
      var num=ccui.helper.seekWidgetByName(item,"albl_num");
      num.setString(items[i].num);
    }
  },
  getBasicWidgets:function(sv_basic,dbasic)
  {
    //show basic
    var BasicWidgets=[];
    var basictpl=ccui.helper.seekWidgetByName(sv_basic,"pnl_tpl");
    for(var i=0;i<dbasic.length;i++) {
      var basic = basictpl.clone();
      basic.setVisible(true);
      var icon=ccui.helper.seekWidgetByName(basic,"img_icon");
      icon.setBackGroundImage(dbasic[i].data.icon);
      var txtname=ccui.helper.seekWidgetByName(basic,"txt_name");
      txtname.setString(dbasic[i].data.abbr);
      var txtnum=ccui.helper.seekWidgetByName(basic,"txt_num");
      txtnum.setString(dbasic[i].num);
      BasicWidgets.push(basic);
    }
    basictpl.removeFromParent(true);
    return BasicWidgets;
  },
  getItemWidgets:function(items)
  {
    //show items
    var file="res/cCharacter.json";
    var json = ccs.load(file);
    var template=ccui.helper.seekWidgetByName(json.node,"pnl_tpl");
    template.setAnchorPoint(cc.p(0.5,0.5));
    var rewardWidgets=[];
    for(var i=0;i<items.length;i++) {
      var itemwidget=template.clone();

      if(items[i].data!=null&&itemwidget!=null)
      {
        var txt=ccui.helper.seekWidgetByName(itemwidget,"txt_armor");
        txt.setString(items[i].data.numdata[1]);
        var icon=ccui.helper.seekWidgetByName(itemwidget,"pnl_tpl_bg");
        if(jsb.fileUtils.isFileExist(items[i].data.numdata[2]))
        {
          var image=new ccui.ImageView(items[i].data.numdata[2]);
          var isize=icon.getContentSize();
          var size=image.getContentSize();
          var scalex=isize.width/size.width;
          var scaley=isize.height/size.height;
          var scale=scalex;
          if(scalex>scaley)
          {
            scale=scaley;
          }
          icon.setBackGroundImage(items[i].data.numdata[2]);
          icon.setScale(scale-0.2);
          icon.setPosition(57,59);
        }
      }
      var num=ccui.helper.seekWidgetByName(itemwidget,"albl_num");
      num.setString(items[i].num);

      rewardWidgets.push(itemwidget);
    }
    return rewardWidgets;
  },
  showCoins:function(sv_item_cnt,items)
  {
    //show items
    var file="res/cItemTemplate.json";
    var json = ccs.load(file);
    var template=ccui.helper.seekWidgetByName(json.node,"pnl_tpl");
    var ts=template.getContentSize();
    var is=sv_item_cnt.getContentSize();
    var col=Math.floor(is.width/ts.width);
    var oset=(is.width-(col*ts.width))/2;
    var row=Math.floor(items.length/col);

    if(items.length%col!=0)
    {
      row=row+1;
    }
    var iheight=ts.height*row;
    if(row>1){
      if(iheight<is.height)
      {
        iheight=is.height;
      }
      var height=iheight;
      if(iheight>=500)
      {
        height=500;
      }
      this.osetoper=height-is.height;
      sv_item_cnt.setContentSize(is.width,height);
      sv_item_cnt.setInnerContainerSize(is.width,iheight);
    }
    else {
      this.osetoper=0;
      oset=(is.width-(items.length*ts.width))/2;
    }

    for(var i=0;i<items.length;i++) {
      var item=template.clone();
      sv_item_cnt.addChild(item);
      var irow=Math.floor(i/col);
      var icol=i%col;
      var p=cc.p(oset+(icol+0.5)*ts.width,iheight-(irow+0.3)*ts.height);
      item.setPosition(p.x, p.y);
      if(items[i].data!=null)
      {
        var txt=ccui.helper.seekWidgetByName(item,"txt_armor");
        txt.setString(items[i].data.numdata[1]);
        var icon=ccui.helper.seekWidgetByName(item,"sv_tpl_bg");
        if(jsb.fileUtils.isFileExist(items[i].data.numdata[2]))
        {
          var image=new ccui.ImageView(items[i].data.numdata[2]);
          var isize=icon.getContentSize();
          var size=image.getContentSize();
          var scalex=isize.width/size.width;
          var scaley=isize.height/size.height;
          var scale=scalex;
          if(scalex>scaley)
          {
            scale=scaley;
          }
          icon.setBackGroundImage(items[i].data.numdata[2]);
          icon.setScale(scale-0.2);
          icon.setPosition(57,59);
        }
        var type = ccui.helper.seekWidgetByName(item, "pnl_type");
        var type_txt = ccui.helper.seekWidgetByName(item, "albl_type");
        type.setVisible(true);
        type_txt.setVisible(true);
        type_txt.setString(_CoinNumber[items[i].data.index].mname);
      }
      var num=ccui.helper.seekWidgetByName(item,"albl_num");
      num.setString(items[i].num);
    }
  },
  showDrops:function()
  {
    var sv_basic=ccui.helper.seekWidgetByName(this.root,"sv_main");
    var sv_item_cnt=ccui.helper.seekWidgetByName(this.root,"sv_item_cnt");
    this.showBasics(sv_basic,this.drops.basic);
    if(this.dtype=="coins")
    {
      this.showCoins(sv_item_cnt,this.drops.items);
    }
    else
    {
      this.showItems(sv_item_cnt,this.drops.items);
    }
    var pnl_operate=ccui.helper.seekWidgetByName(this.root,"pnl_operate");
    var op=pnl_operate.getPosition();
    var py=op.y-this.osetoper;
    if(py<10)
    {
      py=10;
    }
    pnl_operate.setPosition(op.x, py);
  },
  onTouch:function(sender,type)
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
        if(sender.getName()=="pnl_close")
        {
          this.closeFunc(sender);
        }
        sender.setScale(1.0);
        break;
      default:
        sender.setScale(1.0);
        break;
    }
  },
  closeFunc:function(sender)
  {
    UIModule.closeLayer(this);
  },
  showDone:function(sender)
  {
    cc.log("GameOver:showDone");
  }
});


