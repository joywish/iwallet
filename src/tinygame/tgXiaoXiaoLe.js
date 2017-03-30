
var total_x=5;
var total_y=8;

var imgMap1=[
  1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,5 , 5 , 5 , 5 , 6 , 6 , 6 , 6 ,
  7 , 7 , 7 , 7 , 0 , 0 , 0 , 0 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,
  1 , 1 , 1 , 1 , 2 , 2 , 2 , 2 ,3 , 3 , 3 , 3 , 4 , 4 , 4 , 4 ,
  5 , 5 , 5 , 5 , 6,  6,  6,  6, 7 , 7 , 7 , 7 , 8,  8,  9,  9,
  11, 11, 11, 11, 12, 12, 12, 12,11, 11, 11, 11, 12, 12, 12, 12,
  13, 13, 13, 13, 14, 14, 14, 14,13, 13, 13, 13, 14, 14, 14, 14,
  15, 15, 14, 14, 0 , 0 , 0 , 0 ,15, 15, 14, 14, 0 , 0 , 0 , 0 ,
  16, 16, 0 , 0 , 0 , 0 , 0 , 0 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,
  1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,
  5 , 5 , 5 , 5 , 6 , 6 , 0 , 0 ,5 , 5 , 5 , 5 , 6 , 6 , 0 , 0 ,
  7 , 7 , 7 , 7 , 8 , 8 , 0 , 0 ,7 , 7 , 7 , 7 , 8 , 8 , 0 , 0 ,
  9 , 9 , 9 , 9 , 10, 10, 10, 10,9 , 9 , 9 , 9 , 10, 10, 10, 10,
  11, 11, 11, 11, 12, 12, 12, 12,11, 11, 11, 11, 12, 12, 12, 12,
  13, 13, 13, 13, 14, 14, 15, 15,13, 13, 13, 13, 14, 14, 14, 14,
  15, 15, 14, 14, 0 , 0 , 0 , 0 ,15, 15, 14, 14, 0 , 0 , 0 , 0 ,
  14, 14, 0 , 0 , 0 , 0 , 0 , 0 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4
];
var imgMap=[
  1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,
  5 , 5 , 5 , 5 , 6 , 6 , 0 , 0 ,5 , 5 , 5 , 5 , 6 , 6 , 0 , 0 ,
  7 , 7 , 7 , 7 , 8 , 8 , 0 , 0 ,7 , 7 , 7 , 7 , 8 , 8 , 0 , 0 ,
  9 , 9 , 9 , 9 , 10, 10, 10, 10,9 , 9 , 9 , 9 , 10, 10, 10, 10,
  11, 11, 11, 11, 12, 12, 12, 12,11, 11, 11, 11, 12, 12, 12, 12,
  13, 13, 13, 13, 14, 14, 14, 14,13, 13, 13, 13, 14, 14, 14, 14,
  15, 15, 16, 16, 0 , 0 , 0 , 0 ,15, 15, 16, 16, 0 , 0 , 0 , 0 ,
  16, 16, 0 , 0 , 0 , 0 , 0 , 0 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,
  1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4 ,
  5 , 5 , 5 , 5 , 6 , 6 , 0 , 0 ,5 , 5 , 5 , 5 , 6 , 6 , 0 , 0 ,
  7 , 7 , 7 , 7 , 8 , 8 , 0 , 0 ,7 , 7 , 7 , 7 , 8 , 8 , 0 , 0 ,
  9 , 9 , 9 , 9 , 10, 10, 10, 10,9 , 9 , 9 , 9 , 10, 10, 10, 10,
  11, 11, 11, 11, 12, 12, 12, 12,11, 11, 11, 11, 12, 12, 12, 12,
  13, 13, 13, 13, 14, 14, 14, 14,13, 13, 13, 13, 14, 14, 14, 14,
  15, 15, 16, 16, 0 , 0 , 0 , 0 ,15, 15, 16, 16, 0 , 0 , 0 , 0 ,
  16, 16, 0 , 0 , 0 , 0 , 0 , 0 ,1 , 1 , 2 , 2 , 3 , 3 , 4 , 4
]

function MapSort(a,b)
{
  return a.order- b.order;
}

var oXiaoXiaoLe = BaseGame.extend({
  template:null,
  arrayMap:[],
  itemsize:cc.size(100,100),
  offsetx:0,
  offsety:0,
  matchs:[],
  currSelect:null,
  preSelect:null,
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this._super();
    this.template.release();
  },
  onEnter: function() {
    this.ishideui = false;
    this.isState = false;
    this.ScoreTemplate="score_template_leader";
    this.leveldata = SysUtils.readJson("res/data/XiaoXiaoLe.json");
    var tfile="res/cLinkLine.json";
    var root = ccs.load(tfile);
    this.addChild(root.node);
    this.uiroot=root.node;
    var template=ccui.helper.seekWidgetByName(root.node,"pnl_tpl");
    template.removeFromParent();
    template.retain();
    this.template=template;
    var csize=this.template.getContentSize();
    this.itemsize=csize;
    var items=ccui.helper.seekWidgetByName(root.node,"sv_grid");
    if(cc.sys.isNative) {
      items.setScrollBarEnabled(false);
    }
    var icons=this.leveldata[this.currLevel].icons;
    var array=[];
    //var randi=(MathUtils.randomNum(0,icons.length)*2)%icons.length;
    //SysUtils.log("rand="+randi);
    for(var i = 0;i < total_x*total_y; i++) {
      var imgid=imgMap[i];
      var map={"order":MathUtils.randomNum(0,(total_x+MathUtils.randomNum(0,5))*(total_y+MathUtils.randomNum(0,8))),"imageid":imgid};
      array.push(map);
    }
    array.sort(MapSort);

    var ii=0;
    this.arrayMap=[];
    for(var i=0;i<total_x+2;i++)
    {
      for(var j=0;j<total_y+2;j++)
      {
        if(i>0&&i<total_x+1&&j>0&&j<total_y+1)
        {
          this.arrayMap.push(array[ii]);
          ii=ii+1;
        }
        else
        {
          this.arrayMap.push({"order":0,"imageid":-1});
        }
      }
    }
    for(var i=1;i<total_x+1;i++)
    {
      for(var j=1;j<total_y+1;j++)
      {
        var item=template.clone();
        items.addChild(item);
        item.setPosition((i-0.5)*csize.width,items.getContentSize().height-(j-0.5)*csize.height);
        var index=j*(total_x+2)+i;
        item.setTag(index);
        //var label=new cc.LabelTTF(index, "Arial", 24);
        //item.addChild(label);
        var imgindex=this.indexFromPoint(cc.p(i,j));
        var mapnode=this.arrayMap[imgindex];
        item.mapnode=mapnode;
        mapnode.dispitem=item;
        item.istate="init";
        //var ri=MathUtils.randomNum(0,icons.length);
        var pnlicon=item.getChildByName("pnl_ico");
        var image=new ccui.ImageView();
        image.loadTexture(icons[mapnode.imageid]);
        if(cc.sys.isNative) {
          var s=image.getContentSize();
          var iiscale=1;
          if(s.width<pnlicon.getContentSize().width&& s.height<pnlicon.getContentSize().height)
          {
            var scalex = pnlicon.getContentSize().width/s.width;
            iiscale=scalex;
            var scaley = pnlicon.getContentSize().height/s.height;
            if(iiscale<scaley)
            {
              iiscale=scaley;
            }
          }
          else
          {
            var scalex = s.width/pnlicon.getContentSize().width;
            iiscale=scalex;
            var scaley = s.height/pnlicon.getContentSize().height;
            if(iiscale>scaley)
            {
              iiscale=scaley;
            }
          }
          image.setScale(iiscale);
          image.setPosition(cc.p(pnlicon.getContentSize().width/2,pnlicon.getContentSize().height/2));
        }
        else
        {
          image.setPosition(cc.p(pnlicon.getContentSize().width/2,pnlicon.getContentSize().height/2));
        }
        pnlicon.addChild(image);
        //pnlicon.setBackGroundImage(icons[mapnode.imageid]);
        pnlicon.removeBackGroundImage();
        pnlicon.setClippingEnabled(true);

        item.posx=i;
        item.posy=j;
        item.setAnchorPoint(cc.p(0.5,0.5));
        item.addTouchEventListener(this.onTouch,this);
      }
    }


    this.lineEffect([cc.p(50,50),cc.p(50,100)]);
    this._super();
  },
  lineEffect:function(points)
  {
    this.effects=AnimModule.newLineEffects(points);
    for(var i=0;i<this.effects.length;i++)
    {
      var effect=this.effects[i].effect[0];
      this.addChild(effect);
      effect.setPosition(this.effects[i].center.x,this.effects[i].center.y);
    }
  },
  indexFromPoint:function(point)
  {
    return point.x*(total_y+2)+point.y;
  },
  isSamePoint:function(a,b)
  {
    return(a.x== b.x&& a.y== b.y);
  },
  isValidableNode:function(point)
  {
    return (point.x>=0&&point.x<(total_x+2))&&(point.y>=0&&point.y<(total_y+2));
  },
  isEmptyNode:function(point)
  {
    var index=this.indexFromPoint(point);
    var mapnode=this.arrayMap[index];
    return mapnode.imageid==-1;
  },
  canClearTwo:function(pre,current)
  {
    var bmatch=false;
    var ipre=this.indexFromPoint(pre);
    var icurr=this.indexFromPoint(current);
    var p=this.arrayMap[ipre];
    var pc=this.arrayMap[icurr];
    if(p.imageid==pc.imageid&&this.domatch(pre,current)){
      bmatch=true;
    }
    return bmatch;
  },
  clearNode:function(point)
  {
    var p=this.indexFromPoint(point);
    this.arrayMap[p].imageid=-1;
  },
  qryPoints:function(matchs)
  {
    var points=[];
    for(var i=0;i<matchs.length;i++)
    {
      points.push(this.posFromGrid(matchs[i]));
    }
    return points;
  },
  posFromGrid:function(point)
  {
    var items=ccui.helper.seekWidgetByName(this.uiroot,"sv_grid");
    var p=cc.p((point.x-0.5)*this.itemsize.width,items.getContentSize().height-(point.y-0.5)*this.itemsize.height);
    var pw=items.convertToWorldSpace(p);
    return pw;
  },
  domatch:function(a,b)
  {
    var isMatch=false;
    if(this.match_direct(a,b,false))
    {
      //SysUtils.log("direct");
      isMatch=true;
    }
    else if(this.match_one_corner(a,b,false))
    {
      //SysUtils.log("one corner");
      isMatch=true;
    }
    else if(this.match_two_corner(a,b,false))
    {
      //SysUtils.log("two corner");
      isMatch=true;
    }
    if(isMatch)
    {
      var points=this.qryPoints(this.matchs);
      this.lineEffect(points);
    }
    return isMatch;
  },
  match_direct:function(a,b,isCall)
  {
    if(!(a.x== b.x|| a.y== b.y))
    {
      return false;
    }
    var i=0;
    var match_x=false;
    if(a.x== b.x){
      match_x = true;
      if(a.y> b.y)
      {
        for(i= a.y-1;i> b.y;--i)
        {
          var point=cc.p(a.x,i);
          if(!this.isValidableNode(point)||!this.isEmptyNode(point))
          {
            match_x = false;
          }
        }
      }
      if(b.y> a.y){
        for(var i= b.y-1;i> a.y;--i)
        {
          var point=cc.p(a.x,i);
          if(!this.isValidableNode(point)||!this.isEmptyNode(point))
          {
            match_x = false;
          }
        }
      }
    }
    var match_y=false;
    if(a.y== b.y)
    {
      match_y=true;
      if(a.x> b.x)
      {
        for(i= a.x-1;i> b.x;--i){
          var point=cc.p(i, a.y);
          if(!this.isValidableNode(point)||!this.isEmptyNode(point))
          {
            match_y=false;
          }
        }
      }
      if(b.x> a.x)
      {
        for(i= b.x-1;i> a.x;--i){
          var point=cc.p(i, a.y);
          if(!this.isValidableNode(point)||!this.isEmptyNode(point))
          {
            match_y=false;
          }
        }
      }
    }
    if(!isCall)
    {
      this.matchs=[];
      this.matchs.push(a);
      this.matchs.push(b);
    }
    return match_x||match_y;
  },
  match_one_corner:function(a,b,isCall)
  {
    var point=cc.p(b.x, a.y);
    if(this.isValidableNode(point)&&this.isEmptyNode(point)
      &&this.match_direct(a,point,false)&&this.match_direct(b,point,true))
    {
      if(!isCall)
      {
        this.matchs=[];
        this.matchs.push(a);
        this.matchs.push(point);
        this.matchs.push(b);
      }
      return true;
    }
    point=cc.p(a.x, b.y);
    if(this.isValidableNode(point)&&this.isEmptyNode(point)
      &&this.match_direct(a,point,false)&&this.match_direct(b,point,true))
    {
      if(!isCall)
      {
        this.matchs=[];
        this.matchs.push(a);
        this.matchs.push(point);
        this.matchs.push(b);
      }
      return true;
    }
    return false;
  },
  match_two_corner:function(a,b,isCall)
  {
    for(var i= a.x- 1;i>=0;--i){
      var point=cc.p(i, a.y);
      if(!this.isValidableNode(point)||!this.isEmptyNode(point)){
        break;
      }
      else
      {
        if(this.match_one_corner(point,b,true)){
          if(!isCall)
          {
            this.matchs=[];
            this.matchs.push(a);
            this.matchs.push(point);
            this.matchs.push(cc.p(point.x, b.y));
            this.matchs.push(b);
          }
          return true;
        }
      }
    }
    for(var i= a.x+1;i<(total_x+2);++i){
      var point=cc.p(i, a.y);
      if(!this.isValidableNode(point)||!this.isEmptyNode(point)){
        break;
      }
      else
      {
        if(this.match_one_corner(point,b,true)){
          if(!isCall)
          {
            if(!isCall)
            {
              this.matchs=[];
              this.matchs.push(a);
              this.matchs.push(point);
              this.matchs.push(cc.p(point.x, b.y));
              this.matchs.push(b);
            }
            return true;
          }
        }
      }
    }

    for(var i= a.y-1;i>=0;--i){
      var point=cc.p(a.x,i);
      if(!this.isValidableNode(point)||!this.isEmptyNode(point))
      {
        break;
      }else
      {
        if(this.match_one_corner(point,b,true)){
          if(!isCall)
          {
            this.matchs=[];
            this.matchs.push(a);
            this.matchs.push(point);
            this.matchs.push(cc.p(b.x,point.y));
            this.matchs.push(b);
          }
          return true;
        }
      }
    }
    for(var i= a.y+1;i<(total_y+2);++i){
      var point=cc.p(a.x,i);
      if(!this.isValidableNode(point)||!this.isEmptyNode(point))
      {
        break;
      }else
      {
        if(this.match_one_corner(point,b,true)){
          if(!isCall)
          {
            this.matchs=[];
            this.matchs.push(a);
            this.matchs.push(point);
            this.matchs.push(cc.p(b.x,point.y));
            this.matchs.push(b);
          }
          return true;
        }
      }
    }
    return false;
  },
  onTouch:function(sender,type){
    switch (type)
    {
      case ccui.Widget.TOUCH_BEGAN:
        sender.setScale(0.8);
        break;
      case ccui.Widget.TOUCH_ENDED:
        sender.setScale(1.0);
        this.currSelect=sender;

        var seq=cc.sequence(cc.scaleTo(0.1, 0.8),cc.scaleTo(0.9, 1.0));
        this.currSelect.runAction(cc.repeatForever(seq));

        var pcurr=cc.p(this.currSelect.posx,this.currSelect.posy);
        //SysUtils.log(this.currSelect.posx+":"+this.currSelect.posy+":"+this.indexFromPoint(pcurr));
        if(this.preSelect!=null)
        {
          var ppre=cc.p(this.preSelect.posx,this.preSelect.posy);
          if(this.isSamePoint(pcurr,ppre))
          {
            //SysUtils.log("same point");
          }else
          {
            if(this.isValidableNode(pcurr)&&this.isValidableNode(ppre))
            {
              var currs=this.arrayMap[this.indexFromPoint(pcurr)].dispitem;
              var pres=this.arrayMap[this.indexFromPoint(ppre)].dispitem;
              if(this.canClearTwo(ppre,pcurr)&&currs.istate!="removing"&&pres.istate!="removing")
              {
                currs.istate="removing";
                pres.istate="removing";
                var that=this;
                this.scheduleOnce(function(delta){

                  var pxiaoshi=AnimModule.newEffect("xiaoxiaole/xiaoshi", function(sender) {
                    pxiaoshi[0].removeFromParent(true);
                  });
                  var csize=pres.getContentSize();
                  that.addChild(pxiaoshi[0]);
                  that.pos0=cc.p(pres.getPositionX()+csize.width/2,pres.getPositionY()+csize.height*1.3);
                  that.playScoreEffect(1,that.pos0);
                  pxiaoshi[0].setPosition(that.pos0);

                  var cxiaoshi=AnimModule.newEffect("xiaoxiaole/xiaoshi", function(sender) {
                    cxiaoshi[0].removeFromParent(true);
                  });

                  that.addChild(cxiaoshi[0]);
                  that.pos1=cc.p(currs.getPositionX()+csize.width/2,currs.getPositionY()+csize.height*1.3);
                  that.addScore(1,that.pos1);
                  cxiaoshi[0].setPosition(that.pos1);

                  that.preSelect=null;
                  that.currSelect=null;
                  that.arrayMap[this.indexFromPoint(pcurr)].dispitem=null;
                  that.arrayMap[this.indexFromPoint(ppre)].dispitem=null;
                },0.2);
                this.scheduleOnce(function(delta){
                  pres.mapnode.imageid=-1;
                  pres.removeFromParent(true);
                  pres=null;
                  currs.mapnode.imageid=-1;
                  currs.removeFromParent(true);
                  currs=null;
                },0.7)
              }
              else
              {
                //SysUtils.log("do Flags back");
                //this.currSelect.stopAllActions();
                //this.currSelect.setScale(1.0);
                if(pres!=null)
                {
                  pres.stopAllActions();
                  pres.setScale(1.0);
                }
              }
            }
          }
        }
        if(this.preSelect!=this.currSelect)
        {
          this.preSelect=this.currSelect;
        }
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      default:
        sender.setScale(1.0);
        break;
    }
  },
  doMakeStates:function(sender)
  {
    //this._super(sender);
  },
  onStateStart:function(sender)
  {
    this._super(sender);
  },
  onStateEnd:function(sender)
  {
    this._super(sender);
  },
  onSequenseEnd:function(sender)
  {
    this._super(sender);
  },
  update:function(delta){
    this._super(delta);
  },
  onMsg:function(event)
  {
    //this._super(event);
  },
  gameClose:function(event)
  {
    this._super(event)
  },
  successEnd:function(sender)
  {
    this._super(sender);
  },
  failEnd:function(sender)
  {
    this._super(sender);
  },
  successDialog:function(sender)
  {
    this._super(sender);
  },
  failDialog:function(sender)
  {
    this._super(sender);
  },
  isSuccess:function()
  {
    if(this.score>=this.leveldata[this.currLevel].goal)
    {
      SysUtils.log("Success");
      return true;
    }
    return false;
  },
  doExit:function(sender)
  {
    this.stopAllActions();
    var isSuccess=this.isSuccess();
    var rewards=[0,0,0];
    if(isSuccess)
    {
      rewards=[0,1,1];
    }
    DropModule.showFinished(rewards,function(sender){
      var userdata=sender.getUserData();
      if(userdata.state=="closed")
      {
        //TODO:showRestart
        UIModule.closeLayer(this);
        //this.showRestart();
      }
    }.bind(this),isSuccess);
  },
  refreshTimer:function()
  {
    this._super();
  },
  getHeartMax:function()
  {
    return this._super();
  },
  refreshScore:function()
  {
    //this._super();
    var scoreText = ccui.helper.seekWidgetByName(this.iscore, "scoreText");
    //SysUtils.log("refreshScore="+this.leveldata[this.currLevel].goal);
    scoreText.setString("{0}/{1}".format(this.score,this.leveldata[this.currLevel].goal));

    this.refreshScoreEffect();
  },
  onTimer:function(delta)
  {
    this._super(delta);
  },
  addScore:function(num,pos)
  {
    this._super(num,pos);
    if(this.score>=this.leveldata[this.currLevel].goal)
    {
      this.scheduleOnce(function(delta){
        //this.doExit(null);
        UIModule.closeLayer(this);
      }.bind(this),1.0);
    }
  }
});