
var VideoListLayer=SVBase.extend({
//var VideoListLayer=cc.Layer.extend({
  dataSections:[],
  dataLists:[],
  pageindex:0,
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this._super();
  },
  onEnter: function() {
    //provide cocos ui file
    var videolist=ccs.load("res/cVideoList.json");
    //var videolist=ccs.load("res/cIcoinMall.json");
    this.root=videolist.node;
    this.addChild(this.root);

    //set scollview,top,bottom and item template
    this.sv_main=ccui.helper.seekWidgetByName(this.root,"sv_main");
    this.item_tpl=ccui.helper.seekWidgetByName(this.sv_main,"pnl_item_tpl");
    //this.item_tpl=ccui.helper.seekWidgetByName(this.root,"pnl_tpl");
    this.section_tpl=ccui.helper.seekWidgetByName(this.sv_main,"pnl_section_spliter");
    this.flagbottom=ccui.helper.seekWidgetByName(this.sv_main,"pnl_flag_bottom");
    this.flagtop=ccui.helper.seekWidgetByName(this.sv_main,"pnl_flag_top");

    this.listDatas();

    this._super();

    this.scheduleUpdate();
  },
  update:function(delta) {
    this._super(delta);
  },
  listDatas:function()
  {
    this.dataLists=[];
    this.dataSections=[];

    if(!cc.sys.isNative)
    {
      //var c=document.getElementById("Canvas");
      //var cxt=c.getContext("2d");
      //cxt.fillStyle="#FF0000";
      //cxt.fillRect(0,0,150,75);
      //for test debug
      var c=document.getElementById("sp");
      var len=window.location.href.lastIndexOf("/");
      var str=window.location.href.substr(0,len+1);
      c.innerHTML="<a href="+window.location.pathname+">"+str+"</a>";
      var c_git=document.getElementById("sp_git");
      c_git.innerHTML="<a href=https://github.com/joywish/iwallet>"+"OpenSource code:https://github.com/joywish/iwallet"+"</a>";
    }

    var sdispdata = {"rownum":0,"colnum":0,"width":0,"height":0,"offset":cc.p(0,0),"pos":cc.p(0,0),"dispi":0,"Flags":[]};
    this.dataSections.push({"name":"游戏或功能列表","datanum":20,"ddindex":0,"ddata":sdispdata});

    for(var i=0;i<20;i++)
    {
      var did = this.dataLists.length;
      var dispdata = {"dispi":did,"pindex":-1,"width":0,"height":0,"offset":cc.p(0,0),"pos":cc.p(0,0),"tpl_type":0,"placei":did,"flagis":[]};
      if(i==0)
      {
        var data = {"secindex":0,"dataindex":i,"ddata":dispdata,"data":[1,"我的钱包","","color",5,1]};
        this.dataLists.push(data);
      }
      else if(i==1)
      {
        var data = {"secindex":0,"dataindex":i,"ddata":dispdata,"data":[1,"连连看","","color",5,1]};
        this.dataLists.push(data);
      }
      else
      {
        var data = {"secindex":0,"dataindex":i,"ddata":dispdata,"data":[1,"连连看","","color",5,1]};
        this.dataLists.push(data);
      }
    }
  },
  startPage:function(pageindex)
  {
    //TODO:
  },
  endPage:function(pageindex)
  {
    //TODO:
  },
  startSection:function(sitem,secindex,dispindex)
  {
    //section header,can replace item here

    var offset=Math.floor(this.sv_main.getContentSize().width%this.item_tpl.getContentSize().width)/2;
    var sdata=this.dataSections[secindex];
    sdata.ddata.offset=cc.p(offset,(dispindex+1)*this.section_tpl.getContentSize().height);

    var colcount=Math.floor(this.sv_main.getContentSize().width/this.item_tpl.getContentSize().width);
    sdata.ddata.colnum=colcount;

    var cellcount=0;
    for(var i=0;i<sdata.list.length;i++)
    {
      var tpl_type=sdata.list[i].data[5];
      var flags=this.getFlagIndexs(tpl_type,colcount,0);
      sdata.list[i].ddata.flags=flags;
      cellcount+=flags.length;
    }

    sdata.ddata.rownum=Math.ceil(cellcount/colcount);
    while(sdata.ddata.Flags.length<cellcount)
    {
      sdata.ddata.Flags.push(-1);
    }

    if(sitem==null)
    {
      sitem=this.section_tpl.clone();
    }
    var txtname=ccui.helper.seekWidgetByName(sitem,"spliter_name");
    var sectxt=this.getSecText(secindex);
    txtname.setString(secindex+1+":"+sdata.name+sectxt[1]);
    var cb_sec=ccui.helper.seekWidgetByName(sitem,"cb_section_sel");
    cb_sec.setVisible(false);

    var pnl_ico=ccui.helper.seekWidgetByName(sitem,"pnl_ico");
    //TODO:1 calc the spliter length,set the pnl_ico texture
    //TODO:2 calc sitem position
    //TODO:3 calc flags
    return sitem;
  },
  endSection:function(sitem,secindex,dispindex)
  {
    //TODO:
    //section footer,can replace here, default is null
    return sitem;
  },
  startItem:function(item,secindex,dataindex,dispindex)
  {
    //can replace item here
    if(item==null)
    {
      item=this.item_tpl.clone();
    }
    var data=this.dataLists[dataindex];
    //var sdata=this.dataSections[secindex];
    data.ddata.offset=cc.p(item.getContentSize().width/2,item.getContentSize().height/2);
    var pnl_ico=ccui.helper.seekWidgetByName(item,"pnl_ico");
    this.adapterImage(pnl_ico,"res/coin/1yuan.png");
    var txt_title=ccui.helper.seekWidgetByName(item,"txt_title");
    txt_title.setString(data.data[1]+":"+dataindex);
    //TODO:calc item position

    return item;
  },
  endItem:function(item,secindex,dataindex,dispdataindex)
  {
    //get height of item
    //TODO:
    return item;
  },
  itemTouch:function(item,secindex,dataindex,dispindex,sender,type)
  {

  },
  selectItem:function(item,secindex,dataindex,dispindex) {
    //TODO:
    if (dataindex == 0)
    {
      var CoinMall=new uiCoinMall();
      UIModule.showSimpleBg(CoinMall,"coinmall",false);
    }
    else// if(dataindex==1)
    {
      var xiaoxiaole=new oXiaoXiaoLe();
      xiaoxiaole.define={"ID":2,"LevelName":"Level1","SceneName":"oXiaoXiaoLe","Level":1,"LevelData":"","Type":"js","Gamebg":"","Title":"连连看","Message":"选择相同的图标消除"};
      UIModule.showSimpleBg(xiaoxiaole,"xiaoxiaole",false);
    }
  },
  startShowDescribe:function(item,secindex,dataindex,dispindex)
  {
    //TODO:
  },
  endShowDescribe:function(item,secindex,dataindex,dispindex)
  {
    //TODO:
  },
  startCloseDescribe:function(item,secindex,dataindex,dispindex)
  {
    //TODO:
  },
  endCloseDescribe:function(item,secindex,dataindex,dispindex)
  {
    //TODO:
  },
  onMsg:function(event) {
    this._super(event);
  }
});

