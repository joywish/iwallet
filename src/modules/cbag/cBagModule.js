

var BagModule = BagModule || {};

var _maxItem=131;
var _pageCount=30;
var _maxArmor=6;

var _itemTyes=SysUtils.readJson("res/data/ItemTypes.json");
var _itemData=SysUtils.readJson("res/data/ItemData.json");
var _girlSlots=[{name:"上衣",id:2},{name:"裤子",id:3},{name:"头饰",id:0},{name:"鞋子",id:7},{name:"坐骑",id:8},{name:"手饰",id:5}];


BagModule.useBagForArmor=function(data,id)
{
  for(var i=0;i<data[0].bag.own.length;i++)
  {
    if(data[0].bag.own[i][0]==id)
    {
      if(data[0].bag.own[i][1]>1)
      {
        data[0].bag.own[i][1]=data[0].bag.own[i][1]-1;
      }
      else
      {
        data[0].bag.own.splice(i,1);
      }
    }
  }
}

BagModule.ArmorToBag=function(data,id)
{
  var isFound=false;
  for(var i=0;i<data[0].bag.own.length;i++)
  {
    if(data[0].bag.own[i][0]==id)
    {
      data[0].bag.own[i][1]=data[0].bag.own[i][1]+1;
      isFound=true;
    }
  }
  if(!isFound)
  {
    data[0].bag.own.push([id,1]);
  }
}

BagModule.convetRelationPos=function(sender,ndescribe,offset)
{
  if(typeof offset==="undefined"||offset==null)
  {
    offset=0;
  }
  var senderpos=sender.parent.getWorldPosition();
  var sendersize=sender.parent.getContentSize();
  var startpos=cc.p(senderpos.x,senderpos.y);
  var s=cc.director.getVisibleSize();
  var showsize=ndescribe.getContentSize();
  var flag="";
  if(startpos.x+sendersize.width< s.width/2)
  {
    startpos.x=senderpos.x+sendersize.width+10;
    flag="right";
  }
  else
  {
    startpos.x=senderpos.x-showsize.width-10;
    flag="left";
  }
  if(startpos.x<10)
  {
    startpos.x=10;
  }
  if(startpos.y<s.height/2)
  {
    startpos.y=senderpos.y+(showsize.height+sendersize.height)*0.5;
  }
  else
  {
    startpos.y=senderpos.y+(showsize.height+sendersize.height)*1.5;
  }
  if(startpos.y<showsize.height+10)
  {
    startpos.y=showsize.height+10;
  }
  ndescribe.setVisible(true);
  //SysUtils.log(startpos.x+":"+startpos.y);
  ndescribe.setPosition(startpos.x,startpos.y-offset);

  var senderpos=sender.parent.getWorldPosition();
  var sendersize=sender.parent.getContentSize();
  var dirpos=cc.p(startpos.x,senderpos.y+sendersize.height/2);

  var pos=ndescribe.convertToNodeSpace(dirpos);
  var dir=ccui.helper.seekWidgetByName(ndescribe,"img_dir");
  if(flag=="right")
  {
    dir.setPosition(pos.x-18,pos.y);
    dir.setRotation(90);
  }
  else
  {
    dir.setPosition(pos.x+showsize.width+18,pos.y);
    dir.setRotation(270);
  }
}

BagModule.qryItem=function(id)
{
  for(var i=0;i<_itemData.length;i++)
  {
    if(_itemData[i].id==id)
    {
      return _itemData[i];
    }
  }
  return null;
}

//for bag use
BagModule.qryPlayerItemData=function(type)
{
  var items=[];
  var bItems=BagModule.qryBagItems();
  for(var i=0;i<bItems.length;i++)
  {
    if(bItems[i][1].type==type)
    {
      items.push(bItems[i]);
    }
  }
  return items;
}

//for item book use
BagModule.qryItemData=function(type)
{
  var items=[];
  for(var i=0;i<_itemData.length;i++)
  {
    if(_itemData[i].type==type)
    {
      items.push(_itemData[i]);
    }
  }
  return items;
}

BagModule.qryListData=function(list) {
  function isInList(id)
  {
    for(var i=0;i<list.length;i++)
    {
      if(id==list[i].id)
      {
        return true;
      }
    }
    return false;
  }
  var items=[];
  for(var i=0;i<_itemData.length;i++)
  {
    if(isInList(_itemData[i].id))
    {
      items.push(_itemData[i]);
    }
  }
  return items;
}

BagModule.newItems=function(items,callback,parent,params)
{
  if(typeof params==="undefined"||params==null)
  {
    params={};
  }
  parent.removeAllChildren();
  var file="res/cnCharacter.json";
  var json = ccs.load(file);
  var template=ccui.helper.seekWidgetByName(json.node,"pnl_tpl");
  var txt=ccui.helper.seekWidgetByName(template,"txt_armor");
  txt.setFontName("Helvetica");
  var csize=template.getContentSize();
  var col=Math.floor(parent.getContentSize().width/template.getContentSize().width);
  var offsetx=(parent.getContentSize().width%template.getContentSize().width)/2;
  var offsety=0;
  if(offsetx<0)
  {
    offsetx=0;
  }
  var row=items.length/col;
  if(items.length%col!=0)
  {
    row=row+1;
  }
  if(parent.getDirection()==2)
  {
    row=parent.getContentSize().height/template.getContentSize().height;
    col=items.length/row;
    if(items.length%row!=0)
    {
      col=col+1;
    }
    offsetx=0;
    offsety=(parent.getContentSize().height%template.getContentSize().height)/2;
    if(offsety<0)
    {
      offsety=0;
    }
  }
  if(params.isDescribe)
  {
    var describe=parent.parent.getChildByTag(182635);
    if(describe==null)
    {
      var describe=ccui.helper.seekWidgetByName(json.node,"pnl_describe");
      describe.setVisible(false);
      var ndescribe=describe.clone();
      parent.parent.addChild(ndescribe);
      ndescribe.setTag(182635);
      var pnl_close=ccui.helper.seekWidgetByName(ndescribe,"pnl_close");
      pnl_close.addClickEventListener(function(sender){
        ndescribe.setVisible(false);
      });
    }
    else
    {
      describe.setVisible(true);
    }
  }
  var height=template.getContentSize().height*row;
  if(height<parent.getContentSize().height)
  {
    height=parent.getContentSize().height;
  }
  var width=template.getContentSize().width*col;
  if(width<parent.getContentSize().width)
  {
    width=parent.getContentSize().width;
  }
  parent.setInnerContainerSize(cc.size(width,height));
  for(var i=0;i<items.length;i++)
  {
    var item=template.clone();
    var rowi=Math.floor(i/col);
    var coli=i%col;
    item.setPosition(offsetx+coli*csize.width,height-(rowi+1)*csize.height-offsety);
    var clickwidget=ccui.helper.seekWidgetByName(item,"pnl_tpl_di");
    var txt_armor=ccui.helper.seekWidgetByName(item,"txt_armor");
    if(params.fontColor)
    {
      txt_armor.setTextColor(params.fontColor);
    }
    txt_armor.setString(items[i][1].abbr);
    var icon=ccui.helper.seekWidgetByName(item,"sv_tpl_bg");
    icon.setBackGroundImage(items[i][1].iconUrl);
    icon.setPosition(55,59);
    var num=ccui.helper.seekWidgetByName(item,"albl_num");
    num.setString(items[i][0][1]);
    clickwidget.addTouchEventListener(function(sender,type){
      switch(type)
      {
        case ccui.Widget.TOUCH_BEGAN:
          if(params.isDescribe)
          {
            var descirbe=parent.parent.getChildByTag(182635);
            descirbe.setVisible(false);
          }
          sender.setScale(0.8);
          break;
        case ccui.Widget.TOUCH_MOVED:
          break;
        case ccui.Widget.TOUCH_CANCELED:
          sender.setScale(1.0);
          break;
        case ccui.Widget.TOUCH_ENDED:
          if(params.isDescribe) {
            var descirbe = parent.parent.getChildByTag(182635);
            BagModule.convetRelationPos(sender, descirbe);
          }
          else
          {
            if(callback)
            {
              callback(sender);
            }
          }
          sender.setScale(1.0);
          break;
        default:
          sender.setScale(1.0);
          break;
      }
    },item);
    clickwidget.setTag(11000+i);
    item.setTag(20000+items[i][1].index);
    parent.addChild(item);
  }
}

BagModule.qryBagItems=function()
{
  var data=CharacterModule.getCharaData();
  if(data[0].bag==null)
  {
    data[0].bag={};
  }
  if(data[0].bag.own==null)
  {
    data[0].bag.own=[];
  }
  var ownitems=data[0].bag.own;
  var items=[];
  for(var i=0;i<ownitems.length;i++)
  {
    var data=BagModule.qryItem(ownitems[i][0]);
    items.push([ownitems[i],data]);
  }
  return items;
}

BagModule.qryCoinItems=function()
{
  var data=CharacterModule.getCharaData();
  var ownitems=data[0].coin.own;
  var items=[];
  for(var i=0;i<ownitems.length;i++)
  {
    var data=_CoinNumber[ownitems[i][0]].list[ownitems[i][1]];
    //SysUtils.log(ownitems[i][2]);
    items.push([ownitems[i],data]);
  }
  return items;
}

BagModule.newRewards=function(items)
{
  var statement=new StatementLayer("Win");
  statement.items=items;
  UIModule.showSimple(statement,"statement");
}
