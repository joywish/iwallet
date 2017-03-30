/*
使用方式:
 最多同时显示9个消息，如果有多个显示逻辑需要修改
 write by 2016.03.08 by cclin
 PS:9位数的后2位Tag给UIModule来用
*/

var UIMessage = UIMessage || {};

var _MessageList=new Array();
UIMessage._msgTemplate=null;
UIMessage._msgName="message";

UIMessage.templateInit=function()
{
  var file = "res/cMsgLayer.json";
  var json = ccs.load(file);
  var root = json.node;
  UIMessage._msgTemplate = ccui.helper.seekWidgetByName(root,"pnlMsg");
  var size=cc.director.getVisibleSize();
  var s=UIMessage._msgTemplate.getContentSize();
  UIMessage._msgTemplate.setPosition((size.width+ s.width)/2,0);
  UIMessage._msgTemplate.retain();
  UIModule.setNameMaxCount("message",9,true);
  console.log("UIMessage.templateInit");
}

//消息窗
UIMessage.showMsgLayer=function(msg,parent,num)
{
  if(parent==null)
  {
    parent=UIModule.getMsgLayer();
  }
  var msgdef={};
  msgdef.message=msg;
  msgdef.parent=parent;
  _MessageList.push(msgdef);

  var txt = UIMessage._msgTemplate.getChildByName("txtMsg");
  txt.setFontName("Helvetica");
  txt.setString(msg);
  var pmsg=UIMessage._msgTemplate.clone();
  UIModule.showLayer(pmsg,{callback:null,aparent:parent,isBg:true,act:null,outact:null,isAct:true,isMsg:true},UIMessage._msgName);
  UIMessage.showTagPoint("righttop",pmsg,"res/nflag/red19.png",num);
  console.log("UIMessage.showMsgLayer");
  return pmsg;
}

UIMessage.getMsgCount=function()
{
  return UIModule.getSameNameCount(UIMessage._msgName);
}

UIMessage.closeAllMsgLayer=function()
{
  if(lcbg!=null) {
    var _outact=cc.scaleTo(_animTime,0.1);
    var seq=cc.sequence(_outact,cc.callFunc(function(alayer){
      alayer.removeFromParent(true);
    },UIModule));
    lcbg.runAction(seq);
    lcbg=null;
  }
  _MessageList.slice(0,_MessageList.length);
  UIModule.removeAllSameName(UIMessage._msgName);
}

//标志点
UIMessage.showTagPoint=function(postype,parent,tagPic,num)
{
  if(UIMessage.isTagPoint(parent))
  {
    UIMessage.closeTagPoint(parent);
  }
  if(parent!=null)
  {
    var sprite=cc.Sprite(tagPic);
    if(num!=null)
    {
      var label=new cc.LabelTTF(num, "Arial", 36);
      label.setColor(cc.color(0,255,0,255));
      sprite.addChild(label);
      //label.enableShadow(cc.color(0,255,0,255),cc.p(2.5,-2.5),0);
      var cntsize=sprite.getContentSize();
      label.setPosition(cc.p(cntsize.width/2,cntsize.height/2));
    }
    sprite.setAnchorPoint(cc.p(0.5,0.5));
    sprite.setTag(_RedTag);
    var cntsize=parent.getContentSize();
    parent.addChild(sprite);
    if(postype=="lefttop")
    {
      sprite.setPosition(cc.p(0,cntsize.height));
    }
    else if(postype=="righttop")
    {
      sprite.setPosition(cc.p(cntsize.width,cntsize.height));
    }
    else if(postype=="leftbottom")
    {
      sprite.setPosition(cc.p(0,0));
    }
    else if(postype=="rightbottom")
    {
      sprite.setPosition(cc.p(cntsize.width,0));
    }
    else if(postype=="center")
    {
      sprite.setPosition(cc.p(cntsize.width/2,cntsize.height/2));
    }
    var seq=cc.sequence(cc.scaleTo(0.2,0.5),cc.scaleTo(0.8,1.0));
    sprite.runAction(cc.repeatForever(seq));
  }
}

UIMessage.isTagPoint=function(parent) {
  if (parent != null) {
    var sprite = parent.getChildByTag(_RedTag);
    if (sprite != null) {
      return true;
    }
  }
  return false;
}

UIMessage.closeTagPoint=function(parent)
{
  if(parent!=null)
  {
    var sprite=parent.getChildByTag(_RedTag);
    if(sprite!=null)
    {
      sprite.stopAllActions();
      sprite.removeFromParent(true);
    }
  }
}

UIMessage.templateInit();