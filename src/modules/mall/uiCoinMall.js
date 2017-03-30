
var uiCoinMall=SVBase.extend({
//var uiCoinMall=cc.Layer.extend({
  dataSections:[],
  dataLists:[],
  //coin_names:["coin_renminbi","coin_gangyuan","coin_taibi"],
  coin_names:[],
  templates:[],
  pageindex:2,
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this._super();
  },
  onEnter: function() {
    //provide cocos ui file
    var icoinmall=ccs.load("res/cIcoinMall.json");
    this.root=icoinmall.node;
    this.addChild(icoinmall.node);

    //set scollview,top,bottom and item template

    this.sv_main=ccui.helper.seekWidgetByName(this.root,"sv_main");

    this.item_tpl=ccui.helper.seekWidgetByName(this.root,"pnl_tpl");
    this.section_tpl=ccui.helper.seekWidgetByName(this.sv_main,"pnl_section_spliter");
    this.flagbottom=ccui.helper.seekWidgetByName(this.sv_main,"pnl_flag_bottom");
    this.flagtop=ccui.helper.seekWidgetByName(this.sv_main,"pnl_flag_top");

    this.listDatas();

    this._super();

    var ccss=this.getCoinCount();
    var count=ccui.helper.seekWidgetByName(this.root,"lbl_count_value");
    count.setString(ccss[0]);

    var size=ccui.helper.seekWidgetByName(this.root,"lbl_size_value");
    size.setString(ccss[1]);

    var weight=ccui.helper.seekWidgetByName(this.root,"lbl_weight_value");
    weight.setString(ccss[2]);

    this.scheduleUpdate();
  },
  getCoinCount:function()
  {
    var count=0;
    var size=0;
    var weight=0;
    for(var i=0;i<this.dataSections.length;i++)
    {
      count+=this.dataSections[i].datanum;
      for(var j=0;j<this.dataSections[i].list.length;j++)
      {
        if(this.dataSections[i].list[j].data[5]==0)
        {
          size+=4;
          weight+=10;
        }
        else if(this.dataSections[i].list[j].data[5]==2)
        {
          size+=2;
          weight+=1;
        }
        else if(this.dataSections[i].list[j].data[5]==1)
        {
          size+=1;
          weight+=5;
        }
        else
        {
          size+=1;
          weight+=1;
        }
      }
    }
    return [count,size,weight];
  },
  update:function(delta) {
    this._super(delta);
  },
  listDatas:function()
  {
    this.dataLists=[];
    this.dataSections=[];
    var datanumber=_coin_number;
    if(!cc.sys.isNative)
    {
      datanumber=SysUtils.readJson("res/data/coin_number.json");
      /*
      var count="data count:"+datanumber.length;
      var text=new ccui.Text();
      this.addChild(text);
      text.setColor(cc.color(0, 255, 0, 255));
      text.setFontSize(30);
      text.setString(count);
      var size=cc.director.getVisibleSize();
      text.setPosition(cc.p(size.width/2,15));
      */
    }
    if(this.coin_names.length>0)
    {
      for(var k=0;k<this.coin_names.length;k++)
      {
        for(var i=0;i<datanumber.length;i++)
        {
          if(datanumber[i].name==this.coin_names[k])
          {
            var sdispdata={"rownum":0,"colnum":0,"width":0,"height":0,"offset":cc.p(0,0),"pos":cc.p(0,0),"dispi":k,"Flags":[]};
            this.dataSections.push({"name":datanumber[i].describe,"datanum":datanumber[i].list.length,"ddindex":i,"ddata":sdispdata});
            for(var j=0;j<datanumber[i].list.length;j++)
            {
              //from tpl_type calc to flagis, so tpl_type should set first
              var did=this.dataLists.length;
              var dispdata= {"dispi":did,"pindex":-1,"width":0,"height":0,"offset":cc.p(0,0),"pos":cc.p(0,0),"tpl_type":0,"placei":did,"flagis":[]};
              var data={"secindex":k,"dataindex":j,"ddata":dispdata,"data":datanumber[i].list[j]};
              this.dataLists.push(data);
              //_coin_number[i].list[j].refid=did;
            }
            break;
          }
        }
      }
    }
    else
    {
      for(var i=0;i<datanumber.length;i++)
      {
        var sdispdata={"rownum":0,"colnum":0,"width":0,"height":0,"offset":cc.p(0,0),"pos":cc.p(0,0),"dispi":i,"Flags":[]};
        this.dataSections.push({"name":datanumber[i].describe,"datanum":datanumber[i].list.length,"ddindex":i,"ddata":sdispdata});
        for(var j=0;j<datanumber[i].list.length;j++)
        {
          //from tpl_type calc to flagis, so tpl_type should set first
          var did=this.dataLists.length;
          var dispdata={"dispi":did,"pindex":-1,"width":0,"height":0,"offset":cc.p(0,0),"pos":cc.p(0,0),"tpl_type":0,"placei":did,"flagis":[]};
          var data={"secindex":i,"dataindex":j,"ddata":dispdata,"data":datanumber[i].list[j]};
          this.dataLists.push(data);
          //_coin_number[i].list[j].refid=did;
        }
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
    if(sitem==null)
    {
      sitem=this.section_tpl.clone();
    }
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
    var sectxt=this.getSecText(secindex);
    var txtname=ccui.helper.seekWidgetByName(sitem,"spliter_name");
    if(txtname!=null)
    {
      txtname.setString(secindex+1+":"+sdata.name+sectxt[1]);
    }
    var cb_sec=ccui.helper.seekWidgetByName(sitem,"cb_section_sel");
    if(cb_sec!=null)
    {
      cb_sec.setVisible(false);
    }

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
    if(cc.sys.isNative)
    {
      var pnl_ico=ccui.helper.seekWidgetByName(item,"sv_tpl_bg");
      this.adapterImage(pnl_ico,data.data[2]);
    }
    var txt_title=ccui.helper.seekWidgetByName(item,"txt_armor");
    txt_title.setString(data.data[1]);
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
  selectItem:function(item,secindex,dataindex,dispindex)
  {
    //TODO:
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

