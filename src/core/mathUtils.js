/*
使用方式，write by 2016.04.25 by cclin
*/

var MathUtils = MathUtils || {};

MathUtils.randomNum=function(Min,Max)
{
  var Range = Max - Min;
  var Rand = Math.random();
  return (Min + Math.round(Rand * Range));
}

MathUtils.getDistance=function(x1, y1,  x2, y2){
  var x = Math.abs(x1-x2);
  var y = Math.abs(y1-y2);
  var z = Math.sqrt(x*x+y*y);
  return z;
}

MathUtils.getAngle=function(x1, y1,  x2, y2){
  var x = Math.abs(x1-x2);
  var y = Math.abs(y1-y2);
  var z = Math.sqrt(x*x+y*y);
  var rotat = Math.round((Math.asin(y/z)/Math.PI*180));
  // 一
  if (x2 >= x1 && y2 <= y1) {
    rotat = rotat;
  }
  // 二
  else if (x2 <= x1 && y2 <= y1) {
    rotat = 180 - rotat;
  }
  // 三
  else if (x2 <= x1 && y2 >= y1) {
    rotat = 180 + rotat;
  }
  // 四
  else if(x2 >= x1 && y2 >= y1){
    rotat = 360 - rotat;
  }
  return rotat;
}

//1 left
//2 bottomg
//3 right
//4 top
MathUtils.getEnterDir=function(e){
  //元素矩形框宽度和高度
  var w = e.target.scrollWidth;
  var h = e.target.scrollHeight;
  //鼠标进入矩形框后的位置,相对于矩形框左上角位置
  var mousePointX=e.offsetX;
  var mousePointY=e.offsetY;
  //移动坐标原点到矩形中心点后，鼠标位置
  var mousePointXOnNewMatrix= mousePointX-(w/2);
  var mousePointYOnNewMatrix=(h/2)-mousePointY;
  //和中心原点的弧度
  var enterAngel= (Math.atan2(mousePointYOnNewMatrix,mousePointXOnNewMatrix)*180/Math.PI)+180;
  //矩形右上角和中心点的角度
  var startAngle=Math.atan2(h/2,w/2)*180/Math.PI+180;
  //计算出topS和bottomS扇形取夹角大小
  var topBottomHalfAngle=270-startAngle;
  //将4个扇形区边线的角度不重复的组成一个数组，并添加了当前鼠标的角度，从0~360度
  var newAngleArray=[].concat(enterAngel,0,Math.atan2(h/2,w/2)*180/Math.PI,startAngle-2*Math.atan2(h/2,w/2)*180/Math.PI,startAngle,
    startAngle+2*topBottomHalfAngle,360);
  //数组排序
  newAngleArray.sort(function(a,b){
    return a-b
  });
  //查询出当前鼠标位置角度在数组中的index值
  var dir=newAngleArray.indexOf(enterAngel);
  //在扇形区域被水平线分成了2个区，但是鼠标进入位置是同一个
  if(dir==1||dir==5){
    dir=1;
  }
  return dir;
}