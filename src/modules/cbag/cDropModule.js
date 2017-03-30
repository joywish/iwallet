

var DropModule = DropModule || {};
//1000 tili, 1002 zuanshi 1004 jinbi
var _testlist=[{"id":1000,"num":5},{"id":1002,"num":2},{"id":1004,"num":100},{"id":10004,"num":1},{"id":10021,"num":1}];
var _itemData=SysUtils.readJson("res/data/ItemData.json");
var _CoinNumber=SysUtils.readJson("res/data/coin_number.json");
var _basic_split=1100;

DropModule.showDrops=function(list,num)
{
  if(list==null)//for test only
  {
    list=DropModule.getTestDropList(num);
  }
  var mlist=DropModule.mergeItems(list);
  var drops=DropModule.queryItemsData(mlist);
  DropModule.showStatement(drops);

  var data=CharacterModule.getCharaData();
  var isImportant=false;
  for(var i=0;i<list.length;i++)
  {
    if(list[i].id==1000||list[i].id==1001)
    {
      data[0].diamond=data[0].diamond+list[i].num;
      CmdReq_Set_Prop.setDiamond(data[0].diamond);
      isImportant=true;
    }
    else if(list[i].id==1002||list[i].id==1003)
    {
      data[0].tili=data[0].tili+list[i].num;
      CmdReq_Set_Prop.setTili(data[0].tili);
      isImportant=true;
    }
    else if(list[i].id==1004||list[i].id==1005)
    {
      data[0].gold=data[0].gold+list[i].num;
      CmdReq_Set_Prop.setGold(data[0].gold);
    }
    else if(list[i].id==1006)
    {
      data[0].ep=data[0].ep+list[i].num;
      CmdReq_Set_Prop.setEp(data[0].ep);
    }
    else
    {
      DropModule.addBagItems(data[0].bag,list[i]);
    }
  }
  CharacterModule.saveCharacterData(isImportant);
  cc.eventManager.dispatchCustomEvent("basefresh","");

  return list;
}

DropModule.showFinished=function(rewards,cb,isWin) {
  var num=rewards[1];
  if(num==0)
  {
    num=0.5;
  }
  var coin_names=DropModule.getDropCoins();
  //1000=tili/1002=zuanshi/1004=jinbi
  var drops=[{"id":1004,"num":MathUtils.randomNum(Math.floor(16*num),Math.floor(32*num))}];
  if(isWin)
  {
    drops.push({"id":1002,"num":MathUtils.randomNum(Math.floor(2*num),Math.floor(4*num))});
    drops.push({"id":1000,"num":MathUtils.randomNum(Math.floor(4*num),Math.floor(8*num))});
  }
  else
  {
    drops.push({"id":1000,"num":MathUtils.randomNum(1,5)});
  }
  var droplist = DropModule.converCoinDropList(drops,coin_names);
  var statement = new StatementLayer("Win");
  if(isWin==null||!isWin)
  {
    statement.msg = "Fail";
  }
  statement.dtype = "coins";
  statement.drops = droplist;
  DropModule.saveCoinData(droplist);
  UIModule.showSimple(statement, "statement", cb);
}

DropModule.showDropDialog=function(rewards,cb)
{
  if(DataModule.backcount>0)
  {
    return;//回退之后不重新掉落，回退多少次，需要前进或游戏多少次后才恢复掉落
  }
  var droplist=DropModule.getCoinDropList(rewards[1][1]);
  var statement=new StatementLayer("Win");
  statement.msg="Win";
  statement.dtype="coins";
  statement.drops=droplist;
  DropModule.saveCoinData(droplist);
  UIModule.showSimple(statement,"statement",cb);
}

DropModule.showDropMini=function(parent,widget,rewards,pnl_bag)
{
  if(DataModule.backcount>0)
  {
    return;//回退之后不重新掉落，回退多少次，需要前进或游戏多少次后才恢复掉落
  }
  parent.addChild(rewardWidget);
  widget.setLocalZOrder(99999999);
  var droplist=DropModule.getCoinDropList(rewards[1][1]);
  var statement=new StatementLayer();
  var sv_main=ccui.helper.seekWidgetByName(widget,"sv_main");
  statement.showBasics(sv_main,droplist.basic);
  var sv_items=ccui.helper.seekWidgetByName(widget,"sv_item_cnt");
  statement.showCoins(sv_items,droplist.items);
  var move=cc.moveTo(0.3,pnl_bag.getWorldPosition());
  var scale=cc.scaleTo(0.3,0.001);
  var spawn=cc.spawn(move,scale);
  var size=cc.director.getVisibleSize();
  var bound=cc.EaseElasticOut(cc.scaleTo(1.0,1.0),1.0);
  //var bound=cc.EaseQuinticActionOut(cc.ScaleTo(1.0,1.0),1.0);
  widget.setScale(0.05);
  var seq=cc.sequence(cc.place(cc.p(size.width/2,size.height/2)),bound,cc.delayTime(0.1),spawn,cc.delayTime(0.5),cc.callFunc(function(sender){
    var bseq=cc.sequence(cc.spawn(cc.rotateTo(0.1, 10),cc.scaleTo(0.1,1.2)),cc.spawn(cc.rotateTo(0.1, -10),cc.scaleTo(0.1,0.9))
        ,cc.spawn(cc.rotateTo(0.2, 10),cc.scaleTo(0.2,1.2)),cc.spawn(cc.rotateTo(0.2, -10),cc.scaleTo(0.2,0.9))
        // ,cc.spawn(cc.rotateTo(0.3, 10),cc.scaleTo(0.3,1.2)),cc.spawn(cc.rotateTo(0.3, -10),cc.scaleTo(0.3,0.9))
        ,cc.spawn(cc.rotateTo(0.1, 0),cc.scaleTo(0.1,1.0))
    );
    pnl_bag.runAction(bseq);
  }.bind(this)),cc.delayTime(0.5),cc.removeSelf());
  widget.runAction(seq);

  DropModule.saveCoinData(droplist);
}

DropModule.showDropWidgets=function(parent,widget,rewards,pnl_bag) {
  if(DataModule.backcount>0)
  {
    return;//回退之后不重新掉落，回退多少次，需要前进或游戏多少次后才恢复掉落
  }
  var droplist=DropModule.getCoinDropList(rewards[1][1]);
  /*
  var statement=new StatementLayer();
  var sv_main=ccui.helper.seekWidgetByName(widget,"sv_main");
  var basicwidgets=statement.getBasicWidgets(sv_main,droplist.basic);
  var itemwidgets=statement.getItemWidgets(droplist.items);
  */
  var template=uiTemplateMan.getTemplate("coinitem");
  if(template==null)
  {
    var file="res/cItemTemplate.json";
    var json = ccs.load(file);
    template=ccui.helper.seekWidgetByName(json.node,"pnl_tpl");
    uiTemplateMan.addTemplate("coinitem",template);
  }
  var itemwidgets=[];
  for(var i=0;i<droplist.items.length;i++) {
    var item = template.clone();
    itemwidgets.push(item);
    if(droplist.items[i].data!=null)
    {
      var txt=ccui.helper.seekWidgetByName(item,"txt_armor");
      txt.setString(droplist.items[i].data.numdata[1]);
      if(jsb.fileUtils.isFileExist(droplist.items[i].data.numdata[2]))
      {
        var icon=ccui.helper.seekWidgetByName(item,"sv_tpl_bg");
        var image=new ccui.ImageView(droplist.items[i].data.numdata[2]);
        var isize=icon.getContentSize();
        var size=image.getContentSize();
        var scalex=isize.width/size.width;
        var scaley=isize.height/size.height;
        var scale=scalex;
        if(scalex>scaley)
        {
          scale=scaley;
        }
        icon.setBackGroundImage(droplist.items[i].data.numdata[2]);
        icon.setScale(scale-0.2);
        icon.setPosition(57,59);
      }
    }
    var num=ccui.helper.seekWidgetByName(item,"albl_num");
    num.setString(droplist.items[i].num);
  }
  var size=cc.director.getVisibleSize();
  var isize=template.getContentSize();
  //var bound=cc.EaseQuinticActionOut(cc.ScaleTo(1.0,1.0),1.0);
  for(var i=0;i<itemwidgets.length;i++)
  {
    var item=itemwidgets[i];
    parent.addChild(item);
    item.setScale(0.1);
    item.setLocalZOrder(99999999);

    var move=cc.moveTo(0.3,pnl_bag.getWorldPosition());
    var scale=cc.scaleTo(0.3,0.1);
    var spawn=cc.spawn(move,scale);
    var bound=cc.EaseElasticOut(cc.scaleTo(1.0,1.0),1.0);

    var seq=cc.sequence(cc.place(cc.p(size.width/2,size.height/2)),bound,cc.delayTime(0.2*(itemwidgets.length-i)),spawn,cc.delayTime(0.2),cc.callFunc(function(sender){
      var bseq=cc.sequence(cc.spawn(cc.rotateTo(0.1, 10),cc.scaleTo(0.1,1.2)),cc.spawn(cc.rotateTo(0.1, -10),cc.scaleTo(0.1,0.9))
          ,cc.spawn(cc.rotateTo(0.2, 10),cc.scaleTo(0.2,1.2)),cc.spawn(cc.rotateTo(0.2, -10),cc.scaleTo(0.2,0.9))
          // ,cc.spawn(cc.rotateTo(0.3, 10),cc.scaleTo(0.3,1.2)),cc.spawn(cc.rotateTo(0.3, -10),cc.scaleTo(0.3,0.9))
          ,cc.spawn(cc.rotateTo(0.1, 0),cc.scaleTo(0.1,1.0))
      );
      pnl_bag.stopAllActions();
      pnl_bag.runAction(bseq);
    }.bind(this)),cc.delayTime(0.5),cc.removeSelf());
    item.runAction(seq);
  }
  DropModule.saveCoinData(droplist);
}

DropModule.saveCoinData=function(droplist)
{
  var data=CharacterModule.getCharaData();
  var list=droplist.basic;
  var isImportant=false;
  for(var i=0;i<list.length;i++)
  {
    if(list[i].id==1000||list[i].id==1001)
    {
      data[0].tili=data[0].tili+list[i].num;
      CmdReq_Set_Prop.setTili(data[0].tili);
      isImportant=true;
    }
    else if(list[i].id==1002||list[i].id==1003)
    {
      data[0].diamond=data[0].diamond+list[i].num;
      CmdReq_Set_Prop.setDiamond(data[0].diamond);
      isImportant=true;
    }
    else if(list[i].id==1004||list[i].id==1005)
    {
      data[0].gold=data[0].gold+list[i].num;
      CmdReq_Set_Prop.setGold(data[0].gold);
    }
    else if(list[i].id==1006)
    {
      data[0].ep=data[0].ep+list[i].num;
      CmdReq_Set_Prop.setEp(data[0].ep);
    }
    else
    {
      SysUtils.log("no process basics");
    }
  }
  list=droplist.items;
  for(var i=0;i<list.length;i++)
  {
    DropModule.addCoinItems(data[0].coin,list[i]);
  }
  CharacterModule.saveCharacterData(isImportant);
  cc.eventManager.dispatchCustomEvent("basefresh","");
}

DropModule.getDropCoins=function()
{
  var list=["coin_renminbi","coin_hanguoyuan"];
  /*
   if(DataModule.isVIP(15))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang","coin_zhongfeijinrongfalang","coin_feigontifalang"];
   }
   else if(DataModule.isVIP(14))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang","coin_zhongfeijinrongfalang","coin_feigontifalang"];
   }
   else if(DataModule.isVIP(13))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang","coin_zhongfeijinrongfalang","coin_feigontifalang"];
   }
   else if(DataModule.isVIP(12))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang","coin_zhongfeijinrongfalang","coin_feigontifalang"];
   }
   else if(DataModule.isVIP(11))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang","coin_zhongfeijinrongfalang","coin_feigontifalang"];
   }
   else if(DataModule.isVIP(10))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang","coin_zhongfeijinrongfalang","coin_feigontifalang"];
   }
   else if(DataModule.isVIP(9))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang","coin_zhongfeijinrongfalang"];
   }
   else if(DataModule.isVIP(8))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan","coin_yingbang"];
   }
   else if(DataModule.isVIP(7))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan","coin_riyuan"];
   }
   else if(DataModule.isVIP(6))
   {
   list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan"];
   }
   else*/
  if(DataModule.isVIP(5))
  {
    list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan","coin_aomenyuan"];
  }
  else if(DataModule.isVIP(4))
  {
    list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan","coin_ouyuan"];
  }
  else if(DataModule.isVIP(3))
  {
    list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi","coin_meiyuan"];
  }
  else if(DataModule.isVIP(2))
  {
    list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan","coin_taibi"];
  }
  else if(DataModule.isVIP(1))
  {
    list=["coin_renminbi","coin_hanguoyuan","coin_gangyuan"];
  }
  return list;
}

DropModule.getCoinDropList=function(num)
{
  var list=DropModule.getDropCoins();
  if(num==0)
  {
    num=0.5;
  }
  // tili/zuanshi/jinbi
  var droplist=[{"id":1000,"num":MathUtils.randomNum(Math.floor(2*num),Math.floor(3*num))}
    ,{"id":1002,"num":MathUtils.randomNum(Math.floor(1*num),Math.floor(2*num))}
    ,{"id":1004,"num":MathUtils.randomNum(Math.floor(10*num),Math.floor(30*num))}];

  return DropModule.converCoinDropList(droplist,list);
}

DropModule.converCoinDropList=function(droplist,list)
{
  for(var j=0;j<2;j++)
  {
    var index=MathUtils.randomNum(0,list.length-1);
    var mname=list[index];
    for(var i=0;i<_CoinNumber.length;i++)
    {
      if(_CoinNumber[i].name==mname)
      {
        //TODO:按概率计算掉落的钱币面值
        //var lindex=MathUtils.randomNum(0,_CoinNumber[i].list.length-1);
        var lindex=DropModule.randomCoinNumber(i);
        var cindex=1000000+index*1000+lindex;
        var isFound=false;
        for(var k=3;k<droplist.length;k++)
        {
          if(droplist[k].id==cindex)
          {
            droplist[k].num=droplist[k].num+MathUtils.randomNum(1,3);
            isFound=true;
          }
        }
        if(!isFound)
        {
          droplist.push({"id":cindex,"num":MathUtils.randomNum(1,3)});
        }
      }
    }
  }
  var mlist=DropModule.mergeItems(droplist);
  var basics=[];
  var items=[];
  for(var i=0;i<mlist.length;i++) {
    if (mlist[i].id <= _basic_split) {
      mlist[i].data = DropModule.getItemData(mlist[i].id);
      if(mlist[i].num>0)
      {
        basics.push(mlist[i]);
      }
    }
    else
    {
      var mindex=Math.floor((mlist[i].id-1000000)/1000);
      var cindex=(mlist[i].id-1000000)%1000;
      //SysUtils.log(mlist[i].id+":"+mindex+":"+cindex);
      var nums=DropModule.getCoinNumber(list[mindex]);
      mlist[i].data={"index":nums[0],"subindex":cindex,"numdata":nums[1].list[cindex]};
      items.push(mlist[i]);
    }
  }
  /*
   for(var i=0;i<basics.length;i++)
   {
   if(basics[i].id==1002)
   {
   SysUtils.log("diamond:"+basics[i].id+":"+basics[i].num);
   }
   }
   */
  return {"basic":basics,"items":items};
}

DropModule.getRandomSum=function(index,id)
{
  var allnum=0;
  for(var i=_CoinNumber[index].list.length-1;i>=id;i--)
  {
    allnum=allnum+_CoinNumber[index].list[i][0];
  }
  return allnum;
}

DropModule.randomCoinNumber=function(index)
{
  var allnum=0;
  for(var i=0;i<_CoinNumber[index].list.length;i++)
  {
    allnum=allnum+_CoinNumber[index].list[i][0];
  }
  var randomNum=MathUtils.randomNum(0,allnum);
  //SysUtils.log("randomNum:"+randomNum+":"+allnum);
  for(var i=_CoinNumber[index].list.length;i>=1;i--)
  {
    var numstart=DropModule.getRandomSum(index,i);
    var numend=DropModule.getRandomSum(index,i-1);
    //SysUtils.log(numstart+":"+numend);
    if(randomNum>=numstart&&randomNum<numend)
    {
      var retid=_CoinNumber[index].list.length-i;
      SysUtils.log("retid:"+retid);
      return retid;
    }
  }
  return 0;
}

DropModule.getCoinNumber=function(name)
{
  //SysUtils.log(name);
  for(var i=0;i<_CoinNumber.length;i++)
  {
    if(_CoinNumber[i].name==name)
    {
      return [i,_CoinNumber[i]];
    }
  }
}

DropModule.getTestDropList=function(num)
{
  var list=_testlist;
  if(num==null)
  {
    num=1;
  }
  var id1=MathUtils.randomNum(17,75);
  var id2=MathUtils.randomNum(76,141);
  _testlist[0].num=MathUtils.randomNum(3*num,6*num);
  _testlist[1].num=MathUtils.randomNum(1,4);
  _testlist[2].num=MathUtils.randomNum(50*num,100*num);
  _testlist[3].id=_itemData[id1].id;
  _testlist[3].num=MathUtils.randomNum(1,3+num);
  _testlist[4].id=_itemData[id2].id;
  _testlist[4].num=MathUtils.randomNum(1,3+num);
  return list;
}

DropModule.showStatement=function(drops)
{
  var statement=new StatementLayer("Win");
  statement.dtype="items";
  statement.drops=drops;
  UIModule.showSimple(statement,"statement");
}

DropModule.addBagItems=function(bag,item)
{
  var isFound=false;
  for(var i=0;i<bag.own.length;i++)
  {
    if(bag.own[i][0]==item.id)
    {
      bag.own[i][1]=bag.own[i][1]+item.num;
      isFound=true;
    }
  }
  if(!isFound)
  {
    bag.own.push([item.id,item.num]);
  }
}

DropModule.addCoinItems=function(coin,item)
{
  var isFound=false;
  for(var i=0;i<coin.own.length;i++)
  {
    if(coin.own[i][0]==item.data.index&&coin.own[i][1]==item.data.subindex)
    {
      coin.own[i][2]=coin.own[i][2]+item.num;
      CmdReq_Update_Data.pack_coin(coin.own[i][0],coin.own[i][1],coin.own[i][2]);
      isFound=true;
    }
  }
  if(!isFound)
  {
    coin.own.push([item.data.index,item.data.subindex,item.num]);
    CmdReq_Insert_Data.pack_coin(item.data.index,item.data.subindex,item.num);
  }
}

DropModule.mergeItems=function(list)
{
  var nlist=[];
  function isInList(id)
  {
    for(var i=0;i<nlist.length;i++)
    {
      if(id==nlist[i].id)
      {
        return nlist[i];
      }
    }
    return null;
  }
  for(var i=0;i<list.length;i++)
  {
    var item=isInList(list[i].id);
    if(item!=null)
    {
      item.num=list[i].num;
    }
    else
    {
      nlist.push(list[i]);
    }
  }
  return nlist;
}

DropModule.queryItemsData=function(list)
{
  var basics=[];
  var items=[];
  for(var i=0;i<list.length;i++)
  {
    list[i].data=DropModule.getItemData(list[i].id);
    if(list[i].id<=_basic_split)
    {
      basics.push(list[i]);
    }
    else
    {
      items.push(list[i]);
    }
  }
  return {"basic":basics,"items":items};
}

DropModule.getItemData=function(id)
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
