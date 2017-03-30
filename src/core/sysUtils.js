/*
使用方式，write by 2016.03.09 by cclin

写JOSN对象为文件
var testwrite={};
testwrite.aa="abc";
testwrite.bb=false;
SysUtils.writeJson(testwrite,"aa.json");

读文件为JSON对象
var LevelList=SysUtils.readJson("res/data/"+define.LevelData);
or
var testread=SysUtils.readJson(jsb.fileUtils.getWritablePath()+"aa.json");
cc.log(testread.aa);
*/

var SysUtils = SysUtils || {};
var curGameID=0;

SysUtils.isFileOrPath=function(file)
{
  //TODO:
  return "file";
}

SysUtils.readJson=function(file) {
  try {
    var mcnt=null;
    if(!cc.sys.isNative) {
      var len=window.location.href.lastIndexOf("/");
      var urlroot=window.location.href.substr(0,len+1);
      mcnt=cc.loader._loadTxtSync(urlroot+file);
    }else
    {
      var udatefile=jsb.fileUtils.getWritablePath()+"update/"+file;
      var path=file;
      if(jsb.fileUtils.isFileExist(udatefile))
      {
        path=udatefile;
      }
      mcnt = jsb.fileUtils.getStringFromFile(path);
    }
    if (mcnt) {
      var json = JSON.parse(mcnt);
      return json;
    }
    else {
      return null;
    }
  }
  catch (e) {
    SysUtils.log(e.toString());
    SysUtils.log(file);
  }
}

SysUtils.writeJson=function(json,file) {
  var path = file;
  SysUtils.log("writeJson:"+file);
  var dir=path.substring(0,path.lastIndexOf('/'));
  //SysUtils.log("dir="+dir);
  if(dir==null||dir=="")
  {
    path=jsb.fileUtils.getWritablePath() + file;
    SysUtils.log("path is null");
  }else if (!jsb.fileUtils.isDirectoryExist(dir)) {
    path=jsb.fileUtils.getWritablePath() + file;
    SysUtils.log("path not exists");
  }
  //SysUtils.log("path="+path);
  //SysUtils.log(path);
  var jsonstr=JSON.stringify(json,"",2);
  //SysUtils.log(jsonstr);
  jsb.fileUtils.writeStringToFile(jsonstr,path);
  //SysUtils.log("writeJson:"+path);
}

SysUtils.log=function(msg)
{
  var time=new Date().getTime();
  console.log(time+":"+msg);
}

SysUtils.cpause=function(target)
{
  //cc.director.getScheduler().pauseTarget(target);
  //cc.director.getActionManager().pauseTarget(target);
  target.pause();
  //cc.eventManager.pauseTarget(target);
  var childs=target.getChildren();
  for(var i=0;i<childs.length;i++)
  {
    SysUtils.cpause(childs[i]);
  }
}

SysUtils.cresume=function(target)
{
  //cc.director.getScheduler().resumeTarget(target);
  //cc.director.getActionManager().resumeTarget(target);
  target.resume();
  //cc.eventManager.resumeTarget(target);
  var childs=target.getChildren();
  for(var i=0;i<childs.length;i++)
  {
    SysUtils.cresume(childs[i]);
  }
}


SysUtils.pause=function(target)
{
  cc.director.getScheduler().pauseTarget(target);
  cc.director.getActionManager().pauseTarget(target);
  //cc.eventManager.pauseTarget(target);
  var childs=target.getChildren();
  for(var i=0;i<childs.length;i++)
  {
    SysUtils.pause(childs[i]);
  }
}

SysUtils.resume=function(target)
{
  cc.director.getScheduler().resumeTarget(target);
  cc.director.getActionManager().resumeTarget(target);
  //cc.eventManager.resumeTarget(target);
  var childs=target.getChildren();
  for(var i=0;i<childs.length;i++)
  {
    SysUtils.resume(childs[i]);
  }
}

SysUtils.lajihuishou=function()
{
  cc.sys.garbageCollect();
}

SysUtils.containsPixel=function(arr, pix, approx, range)
{
  range = range || 50.0;
  approx = approx || false;

  var abs = function(a,b) {
    return ((a-b) > 0) ? (a-b) : (b-a);
  };

  var pixelEqual = function(pix1, pix2) {
    if(approx && abs(pix1, pix2) < range) return true;
    else if(!approx && pix1 == pix2) return true;
    return false;
  };

  for(var i=0; i < arr.length; i += 4) {
    if(pixelEqual(arr[i], pix[0]) && pixelEqual(arr[i + 1], pix[1]) &&
      pixelEqual(arr[i + 2], pix[2]) && pixelEqual(arr[i + 3], pix[3])) {
      return true;
    }
  }
  return false;
}

SysUtils.readPixels=function(x,y,w,h)
{
  if( 'opengl' in cc.sys.capabilities) {
    var size = 4 * w * h;
    var array = new Uint8Array(size);
    gl.readPixels(x, y, w, h, gl.RGBA, gl.UNSIGNED_BYTE, array);
    return array;
  }
  else
  {
    // implement a canvas-html5 readpixels
    return cc._renderContext.getImageData(x, winSize.height-y-h, w, h).data;
  }
}

SysUtils.trace=function(count)
{
  var caller = arguments.callee.caller;
  var i = 0;
  count = count || 10;
  console.log("***----------------------------------------  ** " + (i + 1));
  while (caller && i < count) {
    console.log(caller.toString());
    caller = caller.caller;
    i++;
    console.log("***---------------------------------------- ** " + (i + 1));
  }
}

SysUtils.AsciiString=function(sin,start,end)
{
  return sin.slice(start, end).replace(/([^x00-xff])/g, "$1a").slice(start, end).replace(/([^x00-xff])a/g, "$1");
}

SysUtils.parseUTF8=function(sin)
{
  //TODO:此方法有问题
  var l=sin.length;
  var ret=[];
  for(var p = 0; p < l; ) {
    var size, n = l - p;
    var c = sin.charCodeAt(p), cc = sin.charCodeAt(p + 1);
    if(c < 0x80) {
      size = 1;
    } else if(c < 0xc2) {
      SysUtils.log("WRONG FROM OF THE SEQUENCE");
    } else if(c < 0xe0) {
      if(n < 2) {
        SysUtils.log("MISSING FROM THE SEQUENCE");
      }
      if(!((sin.charCodeAt(p + 1) ^ 0x80) < 0x40)) {
        SysUtils.log("WRONG FROM OF THE SEQUENCE");
      }
      size = 2;
    } else if(c < 0xf0) {
      if(n < 3) {
        SysUtils.log("MISSING FROM THE SEQUENCE");
      }
      if(!((sin.charCodeAt(p + 1) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 2) ^ 0x80) < 0x40 &&
          (c >= 0xe1 || cc >= 0xa0))) {
        SysUtils.log("WRONG FROM OF THE SEQUENCE");
      }
      size = 3;
    } else if(c < 0xf8) {
      if(n < 4) {
        SysUtils.log("MISSING FROM THE SEQUENCE");
      }
      if(!((sin.charCodeAt(p + 1) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 2) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 3) ^ 0x80) < 0x40 &&
          (c >= 0xf1 || cc >= 0x90))) {
        SysUtils.log("WRONG FROM OF THE SEQUENCE");
      }
      size = 4;
    } else if (c < 0xfc) {
      if(n < 5) {
        SysUtils.log("MISSING FROM THE SEQUENCE");
      }
      if(!((sin.charCodeAt(p + 1) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 2) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 3) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 4) ^ 0x80) < 0x40 &&
          (c >= 0xfd || cc >= 0x88))) {
        SysUtils.log("WRONG FROM OF THE SEQUENCE");
      }
      size = 5;
    } else if (c < 0xfe) {
      if(n < 6) {
        SysUtils.log("MISSING FROM THE SEQUENCE");
      }
      if(!((sin.charCodeAt(p + 1) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 2) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 3) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 4) ^ 0x80) < 0x40 &&
          (sin.charCodeAt(p + 5) ^ 0x80) < 0x40 &&
          (c >= 0xfd || cc >= 0x84))) {
        SysUtils.log("WRONG FROM OF THE SEQUENCE");
      }
      size = 6;
    } else {
      SysUtils.log("WRONG FROM OF THE SEQUENCE");
      size=1;
      break;
    }
    var temp = "";
    temp = SysUtils.AsciiString(sin,p, size);
    ret.push(temp);
    SysUtils.log("Word="+temp);
    p += size;
  }
  return ret;
}