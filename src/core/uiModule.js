/*
使用方式，write by 2016.03.08 by cclin
打开UI窗口
 var tlayer=new ToolLayer();
 var uidef=UIModule.showLayer(tlayer,{callback:cc.callFunc(this.showDone,this,tlayer),aparent:null,isBg:true,act:null,outact:null,isAct:true,isMsg:false},"uniname");
 //SysUtils.log(uidef.name);
关闭UI窗口,四种方式
 UIModule.closeLatest();//关闭最新的
 UIModule.closeName(uniName);//关闭唯一的名字
 UIModule.closeLayer(layer);//关闭指针
 UIModule.removeLayer(uidef);//关闭数据关联的对象
 PS:9位数的后2位Tag给UIModule来用
 */

var UIModule = UIModule || {};

var _UIList=new Array();
var _UIIndex=0;
var _BGTag=123654789;
var _RedTag=123654788;
var _SingleTag=123654787;
var _NameList=new Array();
var _lcbg=null;
var _animTime=0.2;
var _MainLayer=null;
var _MsgLayer=null;
var _debug=false;

UIModule.getBackground=function(aparent)
{
  var parent=aparent;
  if(parent==null)
  {
    parent=cc.director.getRunningScene();
  }
  _lcbg=parent.getChildByTag(_BGTag);
  if(_lcbg==null) {
    _lcbg = new BackGround();
    _lcbg.setTag(123654789);
    _lcbg.setName(name);
    parent.addChild(_lcbg);
  }
  return _lcbg;
}

UIModule.getViewAction=function(csize)
{
  var vsize=cc.director.getVisibleSize();
  var seq=cc.sequence(cc.moveTo(4,cc.p(vsize.width-csize.width/2,vsize.height-csize.height/2))
    ,cc.moveTo(4,cc.p(vsize.width/2,vsize.height/2))
    ,cc.moveTo(4,cc.p(csize.width/2,csize.height/2)));
  return cc.RepeatForever(seq);
}

UIModule.getViewWalkAction=function(csize)
{
  var vsize=cc.director.getVisibleSize();
  var camerapos=[];
  camerapos.push(cc.p(vsize.width/2,vsize.height/2));
  camerapos.push(cc.p(vsize.width-csize.width/2,vsize.height-csize.height/2));
  camerapos.push(cc.p(csize.width/2,vsize.height-csize.height/2));
  camerapos.push(cc.p(vsize.width-csize.width/2,csize.height/2));
  camerapos.push(cc.p(csize.width/2,csize.height/2));
  var seq=cc.sequence(cc.moveTo(4,camerapos[1])
    ,cc.moveTo(4,camerapos[0])
    ,cc.moveTo(4,camerapos[2])
    ,cc.moveTo(4,camerapos[0])
    ,cc.moveTo(4,camerapos[3])
    ,cc.moveTo(4,camerapos[0])
    ,cc.moveTo(4,camerapos[4])
  );
  return cc.RepeatForever(seq);
}

UIModule.showProgress=function(name)
{
  var progress=new BackGround();
  progress.isProgress=true;
  UIModule.showSimpleBg(progress,name,false);
  return name;
}

UIModule.showUI=function()
{
  UIModule.showMain();
  /*
  for(var i=0;i<_UIList.length;i++)
  {
    var uidef=_UIList[i];
    if(uidef.bglayer!=null)
    {
      uidef.bglayer.setVisible(true);
    }
    if(uidef.bglayer!=null)
    {
      uidef.layer.setVisible(true);
    }
  }
  */
  UIModule.getSingleRoot().setVisible(true);
}

UIModule.hideUI=function()
{
  UIModule.hideMain();
  /*
  for(var i=0;i<_UIList.length;i++) {
    var uidef = _UIList[i];
    if (uidef.bglayer != null) {
      uidef.bglayer.setVisible(false);
    }
    if (uidef.bglayer != null) {
      uidef.layer.setVisible(false);
    }
  }
  */
  UIModule.getSingleRoot().setVisible(false);
}

UIModule.showMain=function()
{
  if(_MainLayer!=null)
  {
    _MainLayer.setVisible(true);
  }
}

UIModule.hideMain=function()
{
  if(_MainLayer!=null)
  {
    _MainLayer.setVisible(false);
  }
}

UIModule.setMain=function(layer)
{
  _MainLayer=layer;
}

UIModule.getMain=function()
{
  return _MainLayer;
}

UIModule.hideMsgLayer=function()
{
  if(_MsgLayer!=null)
  {
    _MsgLayer.setVisible(false);
  }
}

UIModule.setMsgLayer=function(layer)
{
  _MsgLayer=layer;
}

UIModule.getMsgLayer=function()
{
  return _MsgLayer;
}

UIModule.runDefAction=function(alayer,callback)
{
  alayer.setScale(0.1);
  var seq=cc.sequence(cc.scaleTo(_animTime*1.5,1.0),cc.callFunc(callback));
  alayer.stopAllActions();
  alayer.runAction(seq);
}

UIModule.getSingleRoot=function()
{
  var scene=cc.director.getRunningScene();
  var singleRoot=scene.getChildByTag(_SingleTag);
  if(singleRoot==null)
  {
    singleRoot = new cc.Node();
    singleRoot.setTag(_SingleTag);
    scene.addChild(singleRoot);
  }
  return singleRoot;
}

UIModule.showSimpleBg=function(alayer,aname,isbg,opacity,cb)
{
  var scene=cc.director.getRunningScene();
  var isbackground=true;
  var iopacity=200;
  if(opacity!=null)
  {
    iopacity=opacity;
  }
  if(isbg==false)
    isbackground=false;
  var params={callback: cc.callFunc(cb), aparent: scene, isBg: isbackground,bgOpacity:iopacity, act: null, outact: null, isAct: true,isMsg:false};
  return UIModule.showLayer(alayer,params,aname);
}

UIModule.showSimple=function(alayer,aname,cb)
{
  var scene=cc.director.getRunningScene();
  var params={callback: cc.callFunc(cb), aparent: scene, isBg: true, act: null, outact: null, isAct: true,isMsg:false};
  return UIModule.showLayer(alayer,params,aname);
}

UIModule.showSingle=function(alayer,aname,cb)
{
  var parent=UIModule.getSingleRoot();
  var params={callback: cc.callFunc(cb), aparent: parent, isBg: false, act: null, outact: null, isAct: true,isMsg:false};
  return UIModule.showLayer(alayer,params,aname);
}

UIModule.getTypeof=function(objClass)
{
  if (objClass && objClass.constructor && objClass.constructor.toString()) {
    if(objClass.constructor.name) {
      return objClass.constructor.name;
    }
    var str = objClass.constructor.toString();
    if(str.charAt(0) == '[')
    {
      var arr = str.match(/\[\w+\s*(\w+)\]/);
    } else {
      var arr = str.match(/function\s*(\w+)/);
    }
    if (arr && arr.length == 2) {
      return arr[1];
    }
  }
  return typeof(objClass);
}

UIModule.showLayer=function(alayer,params,aname)
{
  if(params.isMsg==null)
  {
    params.isMsg=false;
  }
  var parent=_MainLayer;
  if(_MainLayer==null||typeof parent=="undefined")
  {
    parent=UIModule.getSingleRoot();
  }
  var name=UIModule.getUniQueName();
  var layerdef=layerdef||{};
  layerdef.state="showing";
  layerdef.params=params;
  layerdef.uniName=name;
  if(aname!=null)
  {
    name=aname;
  }
  layerdef.name=name;
  var count=UIModule.getSameNameCount(name);
  var namedef=UIModule.getNameDef(name);
  var maxcount=1;
  if(namedef!=null)
  {
    maxcount=namedef.maxcount;
  }
  if(count>(maxcount-1))
  {
    if(maxcount==1)
    {
      SysUtils.log("Name {0} Already Exists".format(name));
    }
    else
    {
      SysUtils.log("Name {0} Exists {1} Greater than {2}".format(name,count,maxcount));
    }
    layerdef.status="fail";
    return layerdef;
  }
  _UIList.push(layerdef);
  if(params.aparent!=null)
  {
    parent=params.aparent;
  }
  if(params.isBg==null)
  {
    params.isBg=false;
  }
  if(params.isBg)
  {
    _lcbg=parent.getChildByTag(_BGTag);
    if(_lcbg==null) {
      if(params.bgOpacity!=null)
      {
        SysUtils.log("set=opacity="+params.bgOpacity);
        _lcbg = new BackGround(params.bgOpacity);
      }else
      {
        _lcbg = new BackGround();
      }
      _lcbg.setTag(_BGTag);
      _lcbg.setName(name);
      parent.addChild(_lcbg);
    }
    layerdef.bglayer=_lcbg;
    _lcbg.addChild(alayer);
  }else
  {
    layerdef.bglayer=null;
    parent.addChild(alayer);
  }
  var actlayer=alayer;
  if(params.isBg)
  {
    if(UIModule.getSameBgCount(layerdef)<2) {
      actlayer = layerdef.bglayer;
    }else
    {
      actlayer=alayer;
    }
  }
  else
  {
    actlayer=alayer;
  }
  layerdef.layer=alayer;
  layerdef.parent=parent;
  layerdef.scaledfin=false;
  actlayer.setUserData(layerdef);
  if(params.isAct==null||params.isAct==true)
  {
    if(params.act==null)
    {
      actlayer.setScale(0.1);
      if(params.callback!=null)
      {
        var seq=cc.sequence(cc.scaleTo(_animTime,1.0),cc.callFunc(function(alay,data){
          data.scaledfin=true;
          data.state="showed";
          UIModule.reOrderPos(UIModule.getNameDef(data.name));
        },UIModule,layerdef),params.callback);
        //actlayer.stopAllActions();
        actlayer.runAction(seq);
      }
      else
      {
        var seq=cc.sequence(cc.scaleTo(_animTime,1.0),cc.callFunc(function(alay,data){
          data.scaledfin=true;
          data.state="showed";
          UIModule.reOrderPos(UIModule.getNameDef(data.name));
        },UIModule,layerdef));
        //actlayer.stopAllActions();
        actlayer.runAction(seq);
      }
    }
    else
    {
      if(params.callback!=null)
      {
        var seq=cc.sequence(params.act,cc.callFunc(function(alay,data){
          data.scaledfin=true;
          data.state="showed";
          UIModule.reOrderPos(UIModule.getNameDef(data.name));
        },UIModule,layerdef),params.callback);
        //actlayer.stopAllActions();
        actlayer.runAction(seq);
      }
      else
      {
        var seq=cc.sequence(params.act,cc.callFunc(function(alay,data){
          data.scaledfin=true;
          data.state="showed";
          UIModule.reOrderPos(UIModule.getNameDef(data.name));
        },UIModule,layerdef));
        //actlayer.stopAllActions();
        actlayer.runAction(seq);
      }
    }
  }
  layerdef.status="success";
  if(params.outact!=null)
  {
    params.outact.retain();
  }
  if(params.callback!=null)
  {
    params.callback.retain();
  }
  if(_debug)
  {
    SysUtils.log("UIModule.showLayer="+layerdef.name+";count="+UIModule.getSameBgCount(params));
  }
  return layerdef;
}

UIModule.closeLayer=function(alayer,isInstanct,cb)
{
  for(var i=0;i<_UIList.length;i++)
  {
    var def=_UIList[i];
    if(def.layer==alayer)
    {
      if(cb!=null)
      {
        if(def.params.callback!=null)
        {
          def.params.callback.release();
        }
        def.params.callback=cb;
        cb.retain();
      }
      UIModule.removeLayer(def,isInstanct);
      return true;
    }
  }
  return false;
}

UIModule.clearAll=function()
{
  _UIList=[];
  _UIIndex=0;
  _NameList=[];
  _lcbg=null;
  _MainLayer=null;
}

UIModule.clearClosing=function()
{
  //TODO:
  for(var i=_UIList.length-1;i>=0;i--)
  {
    if(_UIList[i].state=="closing"||_UIList[i].state=="closed")
    {
      _UIList.splice(i,1);
    }
  }
}

UIModule.removeLayer=function(adef,isInstanct)
{
  /*
  if(adef.params!=null)
  {
    adef.params={callback: null, aparent: null, isBg: false, act: null, outact: null, isAct: false,isMsg:false};
  }
  */
  var samebgcount=UIModule.getSameBgCount(adef);
  if(_debug) {
    SysUtils.log("UIModule.removeLayer=" + adef.name + ";count=" +samebgcount);
  }
  adef.state="closing";
  var _outact=adef.params.outact;
  if(_outact==null)
  {
    _outact=cc.scaleTo(_animTime,0.1);
  }
  else
  {
    //_outact.release();
  }
  if(adef.params.callback!=null)
  {
    //adef.params.callback.release();
  }
  if(adef.params.isBg)
  {
    if(samebgcount<2)
    {
      if(_debug) {
        SysUtils.log("UIModule.removeLayer and bg");
      }
      var seq=cc.sequence(_outact,cc.callFunc(function(alayer,data){
        alayer.removeFromParent(true);
        delete  alayer;
        data.state="closed";
        data.layer=null;
        var name=data.name;
        UIModule.removeBgDefs(data);
        UIModule.reOrderPos(UIModule.getNameDef(name));
      },UIModule,adef));
      if(adef.params.callback!=null)
      {
        seq=cc.sequence(seq,adef.params.callback, cc.callFunc(function(bdef){
          adef.params.callback.release();
        }));
      }
      if(isInstanct) {
        adef.state="closed";
        if(adef.params.callback!=null)
        {
          adef.layer.runAction(cc.sequence(adef.params.callback,cc.callFunc(function(bdef){
            adef.params.callback.release();
          })));
        }
        adef.bglayer.removeFromParent(true);
        delete  adef.bglayer;
        adef.layer=null;
        UIModule.removeBgDefs(adef);
        UIModule.reOrderPos(UIModule.getNameDef(adef.name));
      }
      else
      {
        adef.bglayer.stopAllActions();
        adef.bglayer.runAction(seq);
      }
    }
    else
    {
      if(_debug) {
        SysUtils.log("UIModule.removeLayer leave bg");
      }
      var seq=cc.sequence(_outact,cc.callFunc(function(alayer,data){
        alayer.removeFromParent(true);
        delete  alayer;
        data.state="closed";
        data.layer=null;
        var name=data.name;
        UIModule.removeDef(data);
        UIModule.reOrderPos(UIModule.getNameDef(name));
      },UIModule,adef));
      if(adef.params.callback!=null)
      {
        seq=cc.sequence(seq,adef.params.callback,cc.callFunc(function(bdef){
          adef.params.callback.release();
        }));
      }
      if(isInstanct) {
        adef.state="closed";
        if(adef.params.callback!=null)
        {
          adef.layer.runAction(cc.sequence(adef.params.callback,cc.callFunc(function(bdef){
            adef.params.callback.release();
          })));
        }
        adef.layer.removeFromParent(true);
        delete  adef.layer;
        adef.layer=null;
        UIModule.removeDef(adef);
        UIModule.reOrderPos(UIModule.getNameDef(adef.name));
      }
      else {
        adef.layer.stopAllActions();
        adef.layer.runAction(seq);
      }
    }
  }
  else
  {
    if(_debug) {
      SysUtils.log("UIModule.removeLayer no bg");
    }
    var seq=cc.sequence(_outact,cc.callFunc(function(alayer,data){
      delete  alayer;
      alayer.removeFromParent(true);
      data.state="closed";
      data.layer=null;
      var name=data.name;
      UIModule.removeDef(data);
      UIModule.reOrderPos(UIModule.getNameDef(name));
    },UIModule,adef));
    if(adef.params.callback!=null)
    {
      seq=cc.sequence(seq,adef.params.callback,cc.callFunc(function(bdef){
        adef.params.callback.release();
      }));
    }
    if(isInstanct) {
      adef.state="closed";
      if(adef.params.callback!=null)
      {
        adef.layer.runAction(cc.sequence(adef.params.callback,cc.callFunc(function(bdef){
          adef.params.callback.release();
        })));
      }
      adef.layer.removeFromParent(true);
      delete  adef.layer;
      adef.layer;
      UIModule.removeDef(adef);
      UIModule.reOrderPos(UIModule.getNameDef(adef.name));
    }
    else {
      adef.layer.stopAllActions();
      adef.layer.runAction(seq);
    }
  }
}

UIModule.closeName=function(uniName,isInstanct,cb)
{
  for(var i=0;i<_UIList.length;i++)
  {
    var def=_UIList[i];
    if(def.name==uniName)
    {
      if(cb!=null)
      {
        if(def.params.callback!=null)
        {
          def.params.callback.release();
        }
        def.params.callback=cb;
        cb.retain();
      }
      UIModule.removeLayer(def,isInstanct);
      return true;
    }
  }
  return false;
}

UIModule.removeDef=function(adef)
{
  for(var i=0;i<_UIList.length;i++)
  {
    if(_UIList[i]==adef)
    {
      _UIList.splice(i,1);
    }
  }
}

UIModule.removeBgDefs=function(adef)
{
  var bg=adef.bglayer;
  for(var i=_UIList.length-1;i>=0;i--)
  {
    if(_UIList[i].bglayer==bg)
    {
      _UIList.splice(i,1);
    }
  }
}

UIModule.getLatest=function()
{
  for(var i=_UIList.length-1;i>=0;i--)
  {
    var def=_UIList[i];
    if(def.state!="closing"&&def.state!="closed")
    {
      if(_debug) {
        SysUtils.log("latest=" + def.name);
      }
      return def;
    }
  }
  if(_debug)
  {
    SysUtils.log("no Latest");
  }
  return null;
}

UIModule.debugUIS=function()
{
  for(var i=_UIList.length-1;i>=0;i--) {
    var def = _UIList[i];
    SysUtils.log("debug="+def.name+":"+def.state);
  }
}

UIModule.closeLatest=function(isInstanct,cb)
{
  if(_debug)
  {
    SysUtils.log("closeLatest="+isInstanct);
  }
  var def=UIModule.getLatest();
  if(def!=null)
  {
    if(cb!=null)
    {
      if(def.params.callback!=null)
      {
        def.params.callback.release();
      }
      def.params.callback=cb;
      cb.retain();
    }
    UIModule.removeLayer(def,isInstanct);
    return true;
  }
  return false;
}

UIModule.queryLayer=function(uniName)
{
  for(var i=0;i<_UIList.length;i++) {
    var def = _UIList[i];
    if (def.name == uniName&&def.state!="closing"&&def.state!="closed") {
      return def.layer;
    }
  }
  return null;
}

UIModule.getSameBgCount=function(adef)
{
  var count=0;
  for(var i=0;i<_UIList.length;i++) {
    var def = _UIList[i];
    if (adef.bglayer == def.bglayer) {
      if(def.state!="closing"&&def.state!="closed")
      {
        count=count+1;
      }
    }
  }
  return count;
}

UIModule.setNameMaxCount=function(name,max,alongside)
{
  var ndef=UIModule.getNameDef(name);
  if(ndef==null)
  {
    var ndef=ndef||{};
    ndef.name=name;
    ndef.maxcount=max;
    if(alongside==null)
    {
      ndef.alongside=false;
    }
    else
    {
      ndef.alongside=alongside;
    }
    _NameList.push(ndef);
  }
  else
  {
    ndef.maxcount = max;
    if(alongside==null)
    {
      ndef.alongside=false;
    }
    else
    {
      ndef.alongside=alongside;
    }
  }
}

UIModule.reOrderPos=function(namedef)
{
  if(namedef!=null&&namedef.alongside)
  {
    if(namedef.maxcount>1)
    {
      var sameNameCount=UIModule.getSameNameCount(namedef.name);
      if(sameNameCount>1)
      {
        UIModule.arrangeWindow(namedef);
      }
      else
      {
        UIModule.centerWindow(namedef);
      }
    }
    else
    {
      UIModule.centerWindow(namedef);
    }
  }
}

UIModule.arrangeWindow=function(namedef)
{
  var _ulist=new Array();
  for(var i=0;i<_UIList.length;i++)
  {
    if(_UIList[i].name==namedef.name)
    {
      _ulist.push(_UIList[i]);
    }
  }
  if(_ulist.length>1)
  {
    var size=_ulist[0].layer.getContentSize();
    var vsize=cc.director.getVisibleSize();
    var col=Math.round(vsize.width/size.width);
    var row=Math.round(vsize.height/size.height);
    //SysUtils.log("col=%d,row=%d",col,row);
    var maxcol=Math.ceil(Math.sqrt(_ulist.length));
    if(maxcol>col)
    {
      maxcol=col;
    }
    var maxrow=Math.ceil(_ulist.length/maxcol);
    var offsetx=(vsize.width-(size.width*maxcol))/2+size.width/2;
    var offsety=(vsize.height-(size.height*maxrow))/2+size.height/2;
    for(var i=0;i<maxrow;i++)
    {
      for(var j=0;j<maxcol;j++)
      {
        var index=i*maxcol+j;
        if(i*maxcol+(maxcol-1)<_ulist.length)
        {
          if(index<_ulist.length)
          {
            var posx=offsetx+j*size.width;
            var posy=offsety+(maxrow-i-1)*size.height;
            if(_ulist[index].scaledfin)
            {
              _ulist[index].layer.stopAllActions();
              _ulist[index].layer.runAction(cc.moveTo(_animTime,cc.p(posx,posy)));
            }
            else {
              _ulist[index].layer.setPosition(cc.p(posx, posy));
            }
          }
        }
        else {
          if (index < _ulist.length) {
            var count = _ulist.length - i * maxcol;
            var noffsetx = (vsize.width - (size.width * count)) / 2 + size.width / 2;
            var posx = noffsetx + j * size.width;
            var posy = offsety + (maxrow - i - 1) * size.height;
            if(_ulist[index].scaledfin)
            {
              _ulist[index].layer.stopAllActions();
              _ulist[index].layer.runAction(cc.moveTo(_animTime,cc.p(posx,posy)));
            }
            else {
              _ulist[index].layer.setPosition(cc.p(posx, posy));
            }
          }
        }
      }
    }
  }
}

UIModule.centerWindow=function(namedef)
{
  var win=UIModule.queryLayer(namedef.name);
  if(win!=null)
  {
    var vsize=cc.director.getVisibleSize();
    var pos=cc.p(vsize.width/2,vsize.height/2);
    win.stopAllActions();
    win.runAction(cc.moveTo(_animTime,pos));
  }
}

UIModule.getNameDef=function(name)
{
  for(var i=0;i<_NameList.length;i++)
  {
    var namedef=_NameList[i];
    if(namedef.name==name)
    {
      return namedef;
    }
  }
  return null;
}

UIModule.getSameNameCount=function(name)
{
  var count=0;
  for(var i=0;i<_UIList.length;i++) {
    var def = _UIList[i];
    if (name == def.name) {
      if(def.state!="closing"&&def.state!="closed")
      {
        count=count+1;
      }
    }
  }
  return count;
}

UIModule.removeAllSameName=function(name)
{
  for(var i=_UIList.length-1;i>=0;i--)
  {
    var layerdef=_UIList[i];
    if(layerdef.name==name)
    {
      UIModule.removeDef(layerdef);
    }
  }
}

UIModule.getUniQueName=function()
{
  _UIIndex=_UIIndex+1;
  var templatename="__UI__UniName__{0}__"
  var name=templatename.format(_UIIndex);
  return name;
}

String.prototype.replaceAll = function (exp, newStr) {
  return this.replace(new RegExp(exp, "gm"), newStr);
}

String.prototype.format = function(args) {
  var result = this;
  if (arguments.length < 1) {
    return result;
  }
  var data = arguments; // 如果模板参数是数组
  if (arguments.length == 1 && typeof (args) == "object") {
    // 如果模板参数是对象
    data = args;
  }
  for ( var key in data ) {
    var value = data[key];
    if (undefined != value) {
      result = result.replaceAll("\\{" + key + "\\}", value);
    }
  }
  return result;
}