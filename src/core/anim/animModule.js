/*
 write by 2016.04.19 by cclin
 */

var AnimModule = AnimModule || {};

var effects=SysUtils.readJson("res/effect/Effects.json");

AnimModule.addPList=function(plist)
{
  var animCache = cc.animationCache;
  animCache.addAnimations(plist);
  return true;
}

AnimModule.newLabel=function(fontsize,color)
{
  var Label = new cc.Label();
  Label.enableOutline(cc.color(255,0,0,255),2);
  Label.enableShadow(cc.color(255,255,0,255),cc.size(2,-2),1);
  if(color==null)
  {
    color=cc.color(0,255,255,255);
  }
  Label.setTextColor(color);
  Label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
  Label.setSystemFontName("Helvetica-Bold");
  Label.setSystemFontSize(fontsize);
  return Label;
}

AnimModule.countToList=function(list,count,order)
{
  for(var i=0;i<count;i++)
  {
    if(order=="asc")
    {
      list.push(i+1);
    }
    else
    {
      list.push(count-i);
    }
  }
  return list;
}

AnimModule.downTimersSeq=function(interval,func,type,isDelay)
{
  var seq=null;
  for(var i=0;i<Math.ceil(interval);i++)
  {
    var delay=cc.delayTime(1.0);
    var scale=cc.scaleTo(1.0,1.0);
    if(!(type==null||type=="s"))
    {
      delay=cc.delayTime(0.1);
      scale=cc.scaleTo(0.1,1.0);
    }
    //var bound=cc.EaseElasticOut(scale,0.3);
    var bound=cc.EaseQuinticActionOut(scale);
    var spwan=cc.spawn(delay,bound);
    if(seq==null)
    {
      if(isDelay)
      {
        SysUtils.log("delay");
        seq=cc.sequence(cc.hide(),cc.delayTime(2.0),cc.show(),spwan,cc.callFunc(func,this));
      }else
      {
        SysUtils.log("not delay");
        seq=cc.sequence(spwan,cc.callFunc(func,this));
      }
    }
    else
    {
      seq=cc.sequence(seq,spwan,cc.callFunc(func,this));
    }
  }
  return seq;
}

AnimModule.newTimerLabel=function(fsize,seconds,type,scale,color,callback)
{
  var label=AnimModule.newLabel(fsize,color);
  label.setScale(scale);
  var timercount=seconds;
  if(type==null||type=="s")
  {
    label.setString(timercount);
  }
  else
  {
    timercount=seconds*10;
    label.setString("{0}.{1}".format(Math.floor(timercount/10),Math.floor(timercount%10)));
  }
  var seq=AnimModule.downTimersSeq(timercount,function(sender){
    timercount=timercount-1;
    if(type==null||type=="s")
    {
      label.setString(timercount);
    }
    else
    {
      label.setString("{0}.{1}".format(Math.floor(timercount/10),Math.floor(timercount%10)));
    }
    if(callback)
    {
      callback(timercount,label);
    }
    if(timercount<=0)
    {
      label.parent.removeFromParent(true);
    }
    label.setScale(scale);
  },type,false);
  label.runAction(seq);
  var s=cc.director.getVisibleSize();
  label.setPosition(s.width/2, s.height/2);
  var bg=AnimModule.newCaptureBg();
  bg.addChild(label);
  label.setTag(10);
  return bg;
}

AnimModule.newCaptureBg=function()
{
  var layout = new ccui.Layout();
  layout.setBackGroundColorType(ccui.Layout.BG_COLOR_NONE);
  //layout.setBackGroundColor(cc.color(128, 128, 128,120));
  var s=cc.director.getVisibleSize();
  layout.setContentSize(cc.size(s.width, s.height));
  layout.setTouchEnabled(true);
  return layout;
}

AnimModule.newSequenceLabel=function(list,fsize,scale,color,isDelay,callback) {
  if(isDelay==null)
  {
    isDelay=true;
  }
  var label=AnimModule.newLabel(fsize,color);
  label.setScale(scale);
  var timercount=list.length;
  label.setString(list[list.length-timercount]);
  var seq=AnimModule.downTimersSeq(timercount,function(sender){
    timercount=timercount-1;
    var index=list.length-timercount;
    if(index>=0&&index<list.length)
    {
      label.setString(list[index]);
    }
    if(callback)
    {
      callback(timercount,label);
    }
    if(timercount<=0)
    {
      label.parent.removeFromParent(true);
    }
    label.setScale(scale);
  },"s",isDelay);
  label.runAction(seq);
  var s=cc.director.getVisibleSize();
  label.setPosition(s.width/2, s.height/2);
  var bg=AnimModule.newCaptureBg();
  bg.addChild(label);
  label.setTag(10);
  return bg;
}

AnimModule.newAnimation=function(frames,name,delay)
{
  var animCache = cc.animationCache;
  //SysUtils.log("name="+name);
  var anim=animCache.getAnimation(name);
  if(anim==null)
  {
    anim = new cc.Animation();
    for (var i = 1; i < frames.length; i++) {
      var frameName=frames[i];
      var frame=AnimModule.getSpriteFrame(frameName);
      if(frame!=null)
      {
        anim.addSpriteFrame(frame);
      }
      else
      {
        anim.addSpriteFrameWithFile(frameName);
      }
    }
    if(delay==null)
    {
      delay=0.02;
    }
    anim.setDelayPerUnit(delay*2.5);
    anim.setRestoreOriginalFrame(true);
    if(name==null)
    {
      name=frames[0];//default use first frame as anim name
    }
    animCache.addAnimation(anim,name);
  }
  var action = cc.animate(anim);
  return action;
}

AnimModule.getAnimation=function(name)
{
  var animCache = cc.animationCache;
  var anim = animCache.getAnimation(name);
  if(anim==null)
  {
    console.log("anim name=<"+name+"> is null");
    return null;
  }else
  {
    var action = cc.animate(anim);
    return action;
  }
}

AnimModule.getAnimCache=function()
{
  var animCache = cc.animationCache;
  return animCache;
}

AnimModule.addAnimtion=function(anim,name)
{
  var animCache = cc.animationCache;
  animCache.addAnimtion(anim,name);
  return true;
}

AnimModule.rotateHint=function(anticlock)
{
  var path="res/source/huadonglei/huadonglei_tishi.png";
  var sprite=new cc.Sprite(path);
  var angle=180;
  if(!anticlock)
  {
    sprite.setFlippedX(true);
    angle=180;
  }
  sprite.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(1,angle),cc.rotateTo(0.1,0))));
  return sprite;
}

AnimModule.newLineEffects=function(points)
{
  var effects=[];
  for(var i=0;i<points.length-1;i++)
  {
    var effect=AnimModule.newDelayEffect("xiaoxiaole/line",0.5);
    var size=effect[0].getContentSize();
    var begin=points[i];
    var end=points[i+1];
    if(begin.x==end.x)
    {
      var len=Math.abs(end.y-begin.y);
      effect[0].setScaleX(len/size.width+0.1);
      effect[0].setRotation(90);
    }
    else
    {
      var len=Math.abs(end.x-begin.x);
      effect[0].setScaleX(len/size.width+0.1);
    }
    var eob={};
    eob.start=begin;
    eob.end=end;
    eob.center=cc.p((begin.x+end.x)/2,(begin.y+end.y)/2);
    eob.effect=effect;
    effects.push(eob);
  }
  return effects;
}

AnimModule.newDelayEffect=function(name,delta)
{
  var anims=AnimModule.getTmpAnim(name);
  if(anims==null)
  {
    anims=AnimModule.getDataAnim(name);
  }
  var sprite=new cc.Sprite(anims[1][0]);
  sprite.runAction(cc.sequence(anims[0],cc.delayTime(delta),cc.removeSelf()));
  return [sprite,anims];
}

AnimModule.newRepeatEffect=function(name)
{
  var anims=AnimModule.getTmpAnim(name);
  if(anims==null)
  {
    anims=AnimModule.getDataAnim(name);
  }
  var sprite=new cc.Sprite(anims[1][0]);
  sprite.runAction(cc.repeatForever(anims[0]));
  return [sprite,anims];
}

AnimModule.newEffect=function(name,cbdone,delay)
{
  var anims=AnimModule.getTmpAnim(name);
  if(delay==null)
  {
    delay=0;
  }
  if(anims!=null&&anims.length!=0)
  {
    var sprite=new cc.Sprite(anims[1][0]);
    if(cbdone==null)
    {
      sprite.runAction(cc.sequence(cc.delayTime(delay),anims[0]));
    }
    else
    {
      sprite.runAction(cc.sequence(cc.delayTime(delay),anims[0],cc.callFunc(cbdone,AnimModule)));
    }
    return [sprite,anims];
  }
  else
  {
    anims=AnimModule.getDataAnim(name);
    if(anims!=null)
    {
      var sprite=new cc.Sprite(anims[1][0]);
      if(cbdone==null)
      {
        sprite.runAction(cc.sequence(cc.delayTime(delay),anims[0]));
      }
      else
      {
        sprite.runAction(cc.sequence(cc.delayTime(delay),anims[0],cc.callFunc(cbdone,AnimModule)));
      }
      return [sprite,anims];
    }
    else
    {
      SysUtils.log("AnimModule.newEffect not effect define");
    }
  }
}

AnimModule.getFrames=function(name)
{
  var frames=[];
  var data=AnimModule.getEffectData(name);
  for(var i=0;i<data.framecount;i++)
  {
    var framename=data.path.format(AnimModule.IntoStr(i+1,4));
    frames.push(framename);
    //SysUtils.log(framename);
  }
  return frames;
}

AnimModule.getEffectData=function(name)
{
  for(var i=0;i<effects.length;i++)
  {
    if(effects[i].name==name)
    {
      return effects[i];
    }
  }
  return null;
}

AnimModule.getSpriteFrame=function(name)
{
  if(cc.sys.isNative)
  {
    return cc.SpriteFrameCache.getInstance().getSpriteFrame(name);
  }
  else
  {
    var frame=cc.spriteFrameCache.getSpriteFrame(name);
    return frame;
  }
}

AnimModule.getDataAnim=function(name)
{
  var data=AnimModule.getEffectData(name);
  if(data!=null)
  {
    var frames=[];
    var prefix=data.path;
    for(var i=0;i<data.framecount;i++)
    {
      var framename=prefix.format(AnimModule.IntoStr(i+1,4));
      var frame=AnimModule.getSpriteFrame(framename);
      if(!cc.sys.isNative)
      {
        frames.push(framename);
      }else
      {
        if(frame!=null||jsb.fileUtils.isFileExist(framename))
        {
          frames.push(framename);
          //SysUtils.log(framename);
        }
      }
    }

    //SysUtils.log("getDataAnim="+name);
    var act=AnimModule.newAnimation(frames,name,data.frameTime);
    return [act,frames,data];
  }
  return null;
}

AnimModule.getTmpAnim=function(name)
{
  var frames=[];
  if(name=="chess")
  {
    return AnimModule.getChessAnim();
  }
  else if(name=="wave")
  {
    frames=AnimModule.getWaveFrames();
  }
  else if(name=="water")
  {
    frames=AnimModule.getWaterFrames();
  }
  else if(name=="move")
  {
    frames=AnimModule.getMoveFrames();
  }
  else if(name=="touch")
  {
    frames=AnimModule.getTouchFrames;
  }
  else if(name=="yan")
  {
    frames=AnimModule.getYanFrames();
  }
  else if(name=="paopao")
  {
    frames=AnimModule.getPaoPaoFrames();
  }
  else if(name=="dianji")
  {
    frames=AnimModule.getDianjiFrames();
  }
  else
  {
    return null;
  }
  var act=AnimModule.newAnimation(frames,name);
  return [act,frames];
}

AnimModule.getChessAnim=function()
{
  var frames=AnimModule.getChessFrames("gold_open",22);
  var openz=AnimModule.newAnimation(frames,"gold_open");
  var cycling=AnimModule.newAnimation(AnimModule.getChessFrames("gold_cyc",9),"gold_cyc");
  var seq=cc.sequence(openz,cc.RepeatForever(cycling));
  return [seq,frames];
}

AnimModule.IntoStr=function(num, length)
{
  return ( "0000000000000000" + num ).substr( -length );
}

AnimModule.getChessFrames=function(name,len)
{
  var frames=[];
  var prefix="res/effect/chess/";
  for(var i=0;i<len;i++)
  {
    var framename=prefix+name+"/"+name+"_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
    //SysUtils.log(framename);
  }
  return frames;
}

AnimModule.getWaveFrames=function()
{
  var frames=[];
  var prefix="res/effect/pour/wave/";
  for(var i=0;i<5;i++)
  {
    var framename=prefix+"wave_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
  }
  return frames;
}

AnimModule.getWaterFrames=function()
{
  var frames=[];
  var prefix="res/effect/pour/water/";
  for(var i=0;i<17;i++)
  {
    var framename=prefix+"water_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
  }
  return frames;
}

AnimModule.getMoveFrames=function()
{
  var frames=[];
  var prefix="res/effect/heart/move/";
  for(var i=0;i<20;i++)
  {
    var framename=prefix+"image_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
  }
  return frames;
}

AnimModule.getTouchFrames=function()
{
  var frames=[];
  var prefix="res/effect/heart/touch/";
  for(var i=0;i<16;i++)
  {
    var framename=prefix+"image_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
  }
  return frames;
}

AnimModule.getYanFrames=function()
{
  var frames=[];
  var prefix="res/effect/slide/yan/";
  for(var i=0;i<15;i++)
  {
    var framename=prefix+"yan_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
  }
  return frames;
}

AnimModule.getPaoPaoFrames=function()
{
  var frames=[];
  var prefix="res/effect/slide/paopao/";
  for(var i=0;i<26;i++)
  {
    var framename=prefix+"paopao_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
  }
  return frames;
}

AnimModule.getDianjiFrames=function()
{
  var frames=[];
  var prefix="res/effect/kiss/dianji/";
  for(var i=0;i<14;i++)
  {
    var framename=prefix+"dianji_"+AnimModule.IntoStr(i+1,4)+".png";
    frames.push(framename);
  }
  return frames;
}