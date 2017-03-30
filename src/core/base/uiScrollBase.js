var SVBase = cc.Layer.extend({
  listener:null,
  //interface
  dataStart:0,//current display data item start
  maxDataCount:1000,//current display data item end
  maxDispPage:10,//current display data pages

  sectionDataStart:0,
  selDispDataIndex:0,//current select cell
  selDispIndex:0,

  defHeight:0,//normal height of innercontainer
  inrHeight:0,//detail height of innercontainer, add a panelheight
  inrPosition:cc.p(0,0),//innercontainer position, use it scroll to display item,0 means bottom

  //temp var
  dispSecs:[],//disp secs

  dispDataStart:0,
  dispDataEnd:0,
  dispDataIndex:0,
  dispRowCount:0,

  pages:[],
  currPages:{index:0,start:0,dcount:0,end:0,dir:"down"},
  loadType:"drag",//"clip"

  hideTemplates:function()
  {
    this.templates=[];
    for(var i=0;i<8;i++)
    {
      var item=ccui.helper.seekWidgetByName(this.root,"pnl_tpl_t"+(i+1));
      if(item!=null)
      {
        item.setVisible(false);
        var tpl={"name":"pnl_tpl_t"+(i+1),"tpl":item};
        this.templates.push(tpl);
      }
    }
    this.section_tpl.setVisible(false);
    this.item_tpl.setVisible(false);
  },
  isInDispSecs:function(secid)
  {
    for(var i=0;i<this.dispSecs.length;i++)
    {
      if(this.dispSecs[i].sid==secid)
      {
        return true;
      }
    }
    return false;
  },
  getSectionStart:function(dataindex)
  {
    var secid=this.dataLists[dataindex].secindex;
    var sdata=this.dataSections[secid];
    var start=dataindex-sdata.datanum;
    if(start<0)
    {
      start=0;
    }
    var sstart=dataindex;
    for(var i=dataindex;i>=start;i--)
    {
      if(this.dataLists[i].secindex==secid)
      {
        sstart=i;
      }
      else
      {
        break;
      }
    }
    return sstart;
  },
  dispInit:function()
  {
    if(this.dataLists.length<=this.dataStart){return;}
    this.dispSecIndex=this.dataLists[this.dataStart].secindex;
    this.sectionDataStart=this.getSectionStart(this.dispSecIndex);
    this.dispSecs=[];
    var maxCount=this.maxDataCount;
    if(this.dataStart+maxCount>this.dataLists.length)
    {
      maxCount=this.dataLists.length-this.dataStart;
    }
    var dstart=this.getSectionRdIndex(this.dataStart);
    var dcount=this.getSectionDataCount(dstart-1);
    for(var i=this.dataStart;i<this.dataStart+maxCount;i++)
    {
      var sid=this.dataLists[i].secindex;
      var did=this.dataLists[i].dataindex;
      var sdata=this.dataSections[sid];
      if(!this.isInDispSecs(sid))
      {
        var rdstart=0;
        if(i==this.dataStart)
        {
          rdstart=dstart;
        }
        //SysUtils.log(i+":"+this.dataStart+":"+did);
        this.dispSecs.push({"sid":sid,"sdata":sdata,"dstart":i,"rdstart":rdstart,"rdend":dcount,status:0,cs:0});
        //status,flags,0:unshow,1:part,2:showed
        //cs,is calc by calcpageindex
        //dstart,dataid
        //rdstart,rdend,section inner index
        sdata.ddata.placei=i;
      }
    }
    this.dispSecs[this.dispSecs.length-1].rdend=this.getSectionRdIndex(maxCount-1);
    //SysUtils.log("dispInit");
    this.dispSecInit();
  },
  getSectionDataList:function(secindex)
  {
    var datalist=[];
    for(var i=0;i<this.dataLists.length;i++)
    {
      if(this.dataLists[i].secindex==secindex)
      {
        datalist.push(this.dataLists[i]);
      }
    }
    return datalist;
  },
  dispSecInit:function()
  {
    var width=this.sv_main.getContentSize().width;
    var twidth=this.item_tpl.getContentSize().width;
    var ssize=this.section_tpl.getContentSize();
    var colcount=Math.floor(width/twidth);
    if(colcount<1) { colcount=1; }
    for(var i=0;i<this.dispSecs.length;i++)
    {
      var ddata=this.dispSecs[i].sdata.ddata;
      ddata.colnum=colcount;
      var datalist=this.getSectionDataList(this.dispSecs[i].sid);
      this.dataSections[this.dispSecs[i].sid].list=datalist;
      //var sdata=this.dispSecs[i].sdata.secdata;
      var cellcount=0;
      for(var j=0;j<datalist.length;j++)
      {
        var tpl_type=datalist[j].data[5];
        var flagis=this.getFlagIndexs(tpl_type,colcount,0);
        var data=datalist[j];
        if(i==0&&data.ddata.dispi==this.dataStart)
        {
          this.dispSecs[i].rdstart=j;
        }
        if(i==this.dispSecs.length-1&&data.ddata.dispi==this.dataStart+this.maxDataCount)
        {
          this.dispSecs[i].rdend=j;
        }
        data.ddata.tpl_type=tpl_type;
        data.ddata.flagis=flagis;
        cellcount+=flagis.length;
      }
      while(ddata.Flags.length<cellcount)
      {
        ddata.Flags.push(-1);
      }
      //SysUtils.log("rownum:"+ddata.rownum+":"+ddata.Flags.length);
      for(var j=0;j<datalist.length;j++)
      {
        var data=datalist[j];
        this.searchIndexPos(this.getSearchStart(ddata.Flags),data);
      }
      cellcount=this.getPlaceCellCount(this.dispSecs[i].sid);
      ddata.rownum=Math.ceil(cellcount/colcount);
      ddata.offset= cc.p(Math.floor(width%colcount/2),ssize.height*(i+1));
      //SysUtils.log("offset:"+ddata.offset.x+":"+ddata.offset.y);
    }
  },
  getSearchStart:function(Flags)
  {
    for(var i=0;i<Flags.length;i++)
    {
      if(Flags[i]==-1)
      {
        return i;
      }
    }
    return Flags.length-1;
  },
  getDispSectionId:function(secid)
  {
    for(var i=0;i<this.dispSecs.length;i++)
    {
      if(this.dispSecs[i].sdata.ddata.dispi==secid)
      {
        return i;
      }
    }
    return -1;
  },
  getPlaceCellCount:function(sid)
  {
    var sdata=this.dataSections[sid];
    var Flags=sdata.ddata.Flags;
    var count=Flags.length;
    for(var i=Flags.length-1;i>=0;i--)
    {
      if(Flags[i]>-1)
      {
        count=i+1;
        break;
      }
    }
    //SysUtils.log("sid:"+sid+":"+count+":"+Flags.length);
    return count;
  },
  searchIndexPos:function(index,data)
  {
    var placei=this.getPlaceItemIndex(index,data);
    data.ddata.placei=placei;
    this.usePlacePos(placei,data);
    //SysUtils.log(data.secindex+":"+data.data[1]+":"+placei);
    return placei;
  },
  getPlaceItemIndex:function(index,data)
  {
    var Flags=this.dataSections[data.secindex].ddata.Flags;
    //SysUtils.log("getPlaceItemIndex:"+index+":"+Flags.length+":"+data.secindex);
    for(var i=index;i<Flags.length;i++)
    {
      var placei=this.getPlaceIndex(i,data);
      if(placei>-1)
      {
        return placei;
      }
    }
    return -1;
  },
  getPlaceIndex:function(index,data)
  {
    //SysUtils.log("getPlaceIndex:"+index);
    if(this.isWidthEnough(index,data))
    {
      var isfree=this.isFreePlace(index,data);
      if(isfree)
      {
        return index;
      }
      else
      {
        return this.getPlaceItemIndex(index+1,data);
      }
    }
    else
    {
      return this.getPlaceItemIndex(index+1,data);
    }
  },
  forceFlagsLen:function(index,Flags)
  {
    while(index>=Flags.length)
    {
      Flags.push(-1);
    }
  },
  clearPlacePos:function(index,data)
  {
    var Flags=this.dataSections[data.secindex].ddata.Flags;
    //SysUtils.log("clearPlacePos:"+data.secindex+":"+index+":"+Flags.length);
    this.forceFlagsLen(index,Flags);
    var flagis=data.ddata.flagis;
    data.ddata.placei=index;
    for(var i=0;i<flagis.length;i++)
    {
      Flags[flagis[i]+index]=-1;
    }
  },
  usePlacePos:function(index,data)
  {
    var Flags=this.dataSections[data.secindex].ddata.Flags;
    //SysUtils.log("usePlacePos:"+data.secindex+":"+index+":"+Flags.length);
    this.forceFlagsLen(index,Flags);
    var flagis=data.ddata.flagis;
    data.ddata.placei=index;
    for(var i=0;i<flagis.length;i++)
    {
      var fi=flagis[i]+index;
      Flags[fi]=data.ddata.dispi;
      //SysUtils.log(fi+":"+data.ddata.dispi+":"+Flags[fi]);
    }
  },
  isFreePlace:function(index,data)
  {
    var Flags=this.dataSections[data.secindex].ddata.Flags;
    //SysUtils.log("isFreePlace:"+data.secindex+":"+index+":"+Flags.length);
    var flagis=data.ddata.flagis;
    for(var i=0;i<flagis.length;i++)
    {
      var fi=flagis[i]+index;
      this.forceFlagsLen(fi,Flags);
      if(Flags[fi]>=0)
      {
        return false;
      }
    }
    return true;
  },
  isWidthEnough:function(index,data)
  {
    var ddata=this.dataSections[data.secindex].ddata;
    var ti=index%ddata.colnum;
    var size=this.getFlagSize(data.ddata.tpl_type,ddata.colnum);
    var width=ddata.colnum-ti;
    //SysUtils.log(width+":"+size.width+":"+size.height+":"+data.data[1]);
    return width>=size.height;
  },
  getMaxSize:function()
  {
    return cc.size(2,2);
  },
  getFlagSize:function(type,colnum) {
    //SysUtils.log(type+":"+colnum);
    var size=cc.size(1,1);
    if(type==1||colnum<2)//single
    {
      size=cc.size(1,1);
    }
    else if(type==2)//v=1,h=2
    {
      size=cc.size(1,2);
    }
    else if(type==3)//v=2,h=1
    {
      size=cc.size(2,1);
    }
    else if(type==4||type==0)//v=2,h=2
    {
      size=cc.size(2,2);
    }
    else if(type==5)//v=2,h=2,left-top corner
    {
      size=cc.size(2,2);
    }
    else if(type==6)//v=2,h=2,right-top corner
    {
      size=cc.size(2,2);
    }
    else if(type==7) //v=2,h=2,left-bottom corner
    {
      size=cc.size(2,2);
    }
    else if(type==8)//v=2,h=2,right-bottom corner
    {
      size=cc.size(2,2);
    }
    return size;
  },
  getTemplate:function(atype)
  {
    if(this.templates!=null)
    {
      if(atype==0)
      {
        atype=4;
      }
      var name="pnl_tpl_t"+atype;
      for(var i=0;i<this.templates.length;i++)
      {
        if(name==this.templates[i].name)
        {
          return this.templates[i].tpl;
        }
      }
      return this.item_tpl;
    }
    else
    {
      return this.item_tpl;
    }
    return null;
  },
  getFlagIndexs:function(type,colnum,index)
  {
    var flagpos=[];
    if(type==1||colnum<2)//single
    {
      flagpos.push(index);
    }
    else if(type==2)//v=1,h=2
    {
      flagpos.push(index);
      flagpos.push(index+1);
    }
    else if(type==3)//v=2,h=1
    {
      flagpos.push(index);
      flagpos.push(index+colnum);
    }
    else if(type==4||type==0)//v=2,h=2
    {
      flagpos.push(index);
      flagpos.push(index+1);
      flagpos.push(index+colnum);
      flagpos.push(index+colnum+1);
    }
    else if(type==5)//v=2,h=2,left-top corner
    {
      flagpos.push(index);
      flagpos.push(index+1);
      flagpos.push(index+colnum);
    }
    else if(type==6)//v=2,h=2,right-top corner
    {
      flagpos.push(index);
      flagpos.push(index+1);
      flagpos.push(index+colnum+1);
    }
    else if(type==7) //v=2,h=2,left-bottom corner
    {
      flagpos.push(index);
      flagpos.push(index+colnum);
      flagpos.push(index+colnum+1);
    }
    else if(type==8)//v=2,h=2,right-bottom corner
    {
      flagpos.push(index+1);
      flagpos.push(index+colnum);
      flagpos.push(index+colnum+1);
    }
    return flagpos;
  },
  getDispIndex:function(dispDataIndex)
  {
    return this.dataLists[dispDataIndex].ddata.dispi;
  },
  getDispDataIndex:function(dispIndex)
  {
    //TODO:convert it;
    var dispDataIndex=dispIndex;
    for(var i=this.sectionDataStart;i<this.dataStart+this.maxDataCount;i++)
    {
      if(this.dataLists[i].ddata.placei==dispIndex)
      {
        dispDataIndex=i;
        break;
      }
    }
    return dispDataIndex;
  },
  getDispData:function()
  {
    var dataIndex=this.dataStart+this.dispDataIndex;
    return this.dataLists[dataIndex];
  },
  ctor: function () {
    this._super();
  },
  onExit: function() {
    this._super();
    if(cc.sys.isNative)
    {
      cc.eventManager.removeListener(this.listener);
    }
  },
  onEnter: function() {

    this.hideTemplates();
    this._super();
    //this.scheduleUpdate();
    if(cc.sys.isNative)
    {
      this.listener = cc.EventListenerCustom.create("UIMsg", this.onMsg.bind(this));
      cc.eventManager.addEventListenerWithFixedPriority(this.listener, 2);
    }
    var btnarr=["pnl_back","pnl_add","pnl_search","pnl_addr","pnl_mine","pnl_share"];
    for(var i=0;i<btnarr.length;i++)
    {
      var btn=ccui.helper.seekWidgetByName(this.root,btnarr[i]);
      if(btn!=null)
      {
        btn.addTouchEventListener(this.onButtonTouch.bind(this),this);
      }
    }

    this.dstatus=[];
    this.dstatus.push("上拉加载...");
    this.dstatus.push("下拉加载...");
    this.dstatus.push("释放立即加载");
    this.dstatus.push("正在加载...");
    this.dstatus.push("本页加载完成");
    this.dstatus.push("没有更多数据");

    this.events=[];
    this.events.push("SCROLL_TO_TOP");
    this.events.push("SCROLL_TO_BOTTOM");
    this.events.push("SCROLL_TO_LEFT");
    this.events.push("SCROLL_TO_RIGHT");
    this.events.push("SCROLLING");
    this.events.push("BOUNCE_TOP");
    this.events.push("BOUNCE_BOTTOM");
    this.events.push("BOUNCE_LEFT");
    this.events.push("BOUNCE_RIGHT");
    this.events.push("CONTAINER_MOVED");

    this.tevents=[];
    this.tevents.push("TOUCH_BEGAN");
    this.tevents.push("TOUCH_MOVED");
    this.tevents.push("TOUCH_ENDED");
    this.tevents.push("TOUCH_CANCELED");
    this.status = "";

    this.sv_main.addTouchEventListener(this.onScrollTouch.bind(this),this);
    this.sv_main.addEventListener(this.onScroll.bind(this),this);

    var clickwidget = ccui.helper.seekWidgetByName(this.item_tpl, "pnl_tpl_di");
    if(clickwidget!=null)
    {
      clickwidget.addTouchEventListener(this.onItemTouch.bind(this),this);
    }
    else
    {
      this.item_tpl.addTouchEventListener(this.onItemTouch.bind(this),this);
    }

    this.flagtop.setPosition(cc.p(0,this.getSvInnerSize().height));

    this.dispInit();
    this.calcPageIndex(this.dataStart);
    this.sstatus="add_bottom_data";
    this.currPages.start=this.pageindex;
    this.currPages.index=this.pageindex;
    this.currPages.end=this.pageindex;
    this.currPages.dir="";
    this.dispDataStart=this.getPageDataStart(this.pageindex);
    this.dispDataEnd=this.dispDataStart;
    this.printPage();
  },
  setAdapterFontSize:function(lbl,maxSize)
  {
    var length=lbl.getStringLength()*lbl.getFontSize();
    if(length>maxSize.width)
    {
      //TODO:把字体变小
      var fsize=Math.floor(maxSize.width/lbl.getStringLength());
      lbl.setFontSize(fsize);
      return fsize;
    }
    else
    {
      return lbl.getFontSize();
    }
  },
  stringfun:function(sin,start,end)
  {
    return sin.slice(start, end).replace(/([^x00-xff])/g, "$1a").slice(start, end).replace(/([^x00-xff])a/g, "$1");
  },
  GetLength:function(str) {
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
      charCode = str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    return realLength;
  },
  getRealLength:function(len,str)
  {
    var clen=0;
    for(var i=0;i<str.length;i++)
    {
      var charCode=str.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) clen+=1;
      else clen+=2;
      if(Math.ceil(clen/2)>len)
      {
        break;
      }
    }
    return clen;
  },
  setAdapterFontText:function(lbl,maxSize)
  {
    var length=lbl.getStringLength()*lbl.getFontSize();
    if(length>maxSize.width)
    {
      //TODO:截取定长字符
      var str=lbl.getString();
      var len=Math.floor(maxSize.width/lbl.getFontSize());
      var clen=this.getRealLength(len-2,str);
      var txt=this.stringfun(str,0,clen-1)+"...";
      lbl.setString(txt);
      return str;
    }
    else
    {
      return lbl.getString();
    }
  },
  resetTemplate:function()
  {
    var item_tpl=this.item_tpl.clone();
    var section_tpl=this.section_tpl.clone();
    var flagbottom=this.flagbottom.clone();
    var flagtop=this.flagtop();
    this.sv_main.removeAllChildren();
    this.sv_main.addChild(item_tpl);
    this.sv_main.addChild(section_tpl);
    this.sv_main.addChild(flagbottom);
    this.sv_main.addChild(flagtop);
    this.item_tpl=item_tpl;
    this.section_tpl=section_tpl;
    this.flagbottom=flagbottom;
    this.flagtop=flagtop;
  },
  getAllRowNum:function()
  {
    var rowcount=0;
    for(var i=0;i<this.dispSecs.length;i++)
    {
      var ddata=this.dispSecs[i].sdata.ddata;
      rowcount+=ddata.rownum;
    }
    //SysUtils.log("row:"+rowcount);
    return rowcount;
  },
  getSections:function(astart,aend)
  {
    var secs=[];
    for(var i=astart;i<aend;i++)
    {
      if(!this.isInList(this.dataLists[i].secindex,secs))
      {
        secs.push(this.dataLists[i].secindex);
      }
    }
    return secs;
  },
  isInFlags:function(index,val,Flags)
  {
    for(var i=0;i<index;i++)
    {
      if(Flags[i]==val)
      {
        return true;
      }
    }
    return false;
  },
  getSectionDataCount:function(start)
  {
    var count=0;
    var secindex=this.dataLists[start].secindex;
    for(var i=start;i<this.dataLists.length;i++)
    {
      if(secindex==this.dataLists[i].secindex)
      {
        count+=1;
      }
    }
    return count;
  },
  getSectionRdIndex:function(start)
  {
    if(start>=this.dataLists.length||start<0||start==null){SysUtils.log("getSectionRdIndex start="+start);return 0;}
    var secid=this.dataLists[start].secindex;
    var count=0;
    for(var i=start;i>=0;i--)
    {
      if(secid!=this.dataLists[i].secindex)
      {
        break;
      }
      count+=1;
    }
    return count;
  },
  isInPages:function(pindex)
  {
    for(var i=0;i<this.pages.length;i++)
    {
      if(this.pages[i].pindex==pindex)
      {
        return true;
      }
    }
    return false;
  },
  getiSections:function(index,seclist)
  {
    for(var i=0;i<seclist.length;i++)
    {
      if(index==seclist[i].secindex)
      {
        return seclist[i];
      }
    }
    return null;
  },
  setIndexDataPage:function(data)
  {
    var odata=data;
    if(!this.isInPages(data.pindex))
    {
      data.isshow=false;
      this.pages.push(data);
    }
    else
    {
      odata=this.getPageIndexData(data.pindex);
      if(data.dataend!=null)
      {
        odata.dataend=data.dataend;
      }
      if(odata.dcount!=null)
      {
        odata.dcount=data.count;
      }
      for(var i=0;i<data.secs.length;i++)
      {
        var dsecs=this.getiSections(data.secs[i].secindex,odata.secs);
        if(dsecs==null)
        {
          odata.secs.push(data.secs[i]);
          odata.secs[odata.secs.length-1].status=0;
        }
        else
        {
          if(data.secs[i].sstart!=null)
          {
            dsecs.sstart=data.secs[i].sstart;
          }
          if(data.secs[i].send!=null)
          {
            //SysUtils.log("send:"+data.secs[i].send);
            if(dsecs.sstart==null)
            {
              dsecs.sstart=0;
            }
            dsecs.send=data.secs[i].send;
          }
          dsecs.status=0;
        }
      }
    }
    /*
    SysUtils.log("set odata start");
    for(var i=0;i<odata.secs.length;i++)
    {
      SysUtils.log(odata.secs[i].secindex+":"+odata.secs[i].sstart+":"+odata.secs[i].send);
    }
    */
  },
  getPageIndexData:function(index)
  {
    var data=null;
    for(var i=0;i<this.pages.length;i++)
    {
      if(this.pages[index].pindex==index)
      {
        data=this.pages[index];
        break;
      }
    }
    return data;
  },
  calcPageIndex:function()
  {
    var count=0;
    var drow=0;
    var pindex=0;
    var pj=0;
    var ppj=0;
    var secsize=this.section_tpl.getContentSize();
    var onesize=this.item_tpl.getContentSize();
    var cntsize=this.sv_main.getContentSize();
    var dheight=0;
    var trow=0;
    //SysUtils.log("svheight:"+cntsize.height);
    this.pages=[];
    var rdstart=this.dispSecs[0].rdstart;
    this.setIndexDataPage({"pindex":pindex,"secs":[{"secindex":0,"sstart":rdstart}]});
    for(var i=0;i<this.dispSecs.length;i++)
    {
      var colcount=this.dispSecs[i].sdata.ddata.colnum;
      var Flags=this.dispSecs[i].sdata.ddata.Flags;
      var secindex=this.dispSecs[i].sdata.ddindex;
      var row=0;
      //SysUtils.log("rdstart="+this.dispSecs[i].rdstart);
      var pdata=this.getPageIndexData(pindex);
      dheight=(i+1)*secsize.height;
      for(var j=0;j<Flags.length;j++)
      {
        if(Flags[j]>-1)
        {
          this.dataLists[Flags[j]].ddata.pindex=pindex;
          ppj+=1;
          if(colcount==1)
          {
            row=Math.ceil((j+1)/colcount);
            trow=drow+row-1;
          }
          else
          {
            row=Math.ceil((j+1)/colcount);
            trow=drow+row+1;
          }
          var theight=dheight+trow*onesize.height;
          pj=j;
          if(!this.isInFlags(j,Flags[j],Flags))
          {
            count+=1;
          }
          pdata=this.getPageIndexData(pindex);
          //SysUtils.log("row:"+row+";j:"+j+";ppj:"+ppj+";dheight:"+dheight+";theight:"+theight+";cntsize:"+cntsize.height);
          if(theight>(cntsize.height*(pindex+1)))
          {
            var dataend=this.dataLists[Flags[j]].ddata.dispi;
            pdata.dataend=dataend;
            pdata.dcount=count;
            //drow=0;
            count=0;
            pindex+=1;
            this.dataLists[Flags[j]].ddata.pindex=pindex;
            ppj=0;
            var placecount=this.getPlaceCellCount(this.dispSecs[i].sid);
            if(pj<placecount)
            {
              this.setIndexDataPage({"pindex":pindex,"secs":[{"secindex":secindex,"sstart":pj,"send":placecount-1}]});
            }
          }
          else
          {
            this.setIndexDataPage({"pindex":pindex,"secs":[{"secindex":secindex,"send":pj}]});
          }
        }
      }
      drow+=row;
      pdata.rcount=drow;
    }
    var Flags=this.dispSecs[this.dispSecs.length-1].sdata.ddata.Flags;
	  var dataend=this.dataLists[Flags[pj]].ddata.dispi;
    var secindex=this.dispSecs[this.dispSecs.length-1].sdata.ddindex;
    this.setIndexDataPage({"pindex":pindex,"secs":[{"secindex":secindex,"send":pj}]});
    var pdata=this.getPageIndexData(pindex);
    pdata.dataend=dataend;
    pdata.dcount=count;
    pdata.rcount=drow;
    this.dispPages();
    //this.dispDatas();
  },
  mergeSection:function(sec,secs)
  {
    var isInList=false;
    var index=0;
    for(var i=0;i<secs.length;i++)
    {
      if(secs[i].secindex==sec.secindex)
      {
        index=i;
        isInList=true;
        break;
      }
    }
    if(isInList)
    {
      if(secs[index].send+1==sec.sstart)
      {
        secs[index].send=sec.send;
      }
    }
    else
    {
      secs.push({"secindex":sec.secindex,"sstart":sec.sstart,"send":sec.send});
    }
  },
  getAllPageSections:function(pstart,pend)
  {
    var secs=[];
    if(pstart<0)
    {
      pstart=0;
    }
    if(pend>this.pages.length-1)
    {
      pend=this.pages.length-1;
    }
    for(var i=pstart;i<=pend;i++) {
      for(var j=0;j<this.pages[i].secs.length;j++)
      {
        this.mergeSection(this.pages[i].secs[j],secs);
      }
    }
    return secs;
  },
  getAllPageSecIndex:function(secindex)
  {
    var secs=this.getAllPageSections(this.currPages.start,this.currPages.end);
    for(var i=0;i<secs.length;i++)
    {
      if(secs[i].secindex==secindex)
      {
        return i+1;
      }
    }
    return 1;
  },
  getAllPageRowNumExt:function(pstart,pend)
  {
    var secs=this.getAllPageSections(pstart,pend);
    var count=0;
    for(var i=0;i<secs.length;i++)
    {
      count+=this.getSectionPartRowCount(secs[i].secindex,secs[i].sstart,secs[i].send);
      //SysUtils.log(i+":"+secs[i].secindex+":"+secs[i].sstart+":"+secs[i].send+":"+count);
    }
    if(!cc.sys.isNative)
    {
      var c=document.getElementById("sp");
      c.innerHTML="<a href='http://www.baidu.com'>"+count+"</a>";
    }
    return count;
  },
  getAllPageRowNum:function(pstart,pend)
  {
    var count=0;
    if(pstart<0)
    {
      pstart=0;
    }
    if(pend>this.pages.length-1)
    {
      pend=this.pages.length-1;
    }
    for(var i=pstart;i<=pend;i++)
    {
      count+=this.getPageRowNum(this.pages[i]);
    }
    //SysUtils.log("getAllPageRowNum:"+count);
    return count;
  },
  isSectionDisp:function(secindex)
  {
    for(var i=0;i<this.pages.length;i++)
    {
      for(var j=0;j<this.pages[i].secs.length;j++)
      {
        if(secindex==this.pages[i].secs[j].secindex&&(this.pages[i].secs[j].status==0||this.pages[i].secs[j].status=="undefined"))
        {
          return false;
        }
      }
    }
    return true;
  },
  getPageRowNum:function(data)
  {
    //TODO:段合并为整段后，高度需要重新计算，因为分开有可能要补高度
    var sec_count=0;
    for(var i=0;i<data.secs.length;i++)
    {
      //var sob=this.dataSections[data.secs[i].secindex];
      sec_count+=this.getSectionPartRowCount(data.secs[i].secindex,data.secs[i].sstart,data.secs[i].send);
      //SysUtils.log("pseci:"+data.secs[i].secindex+":"+data.secs[i].sstart+":"+data.secs[i].send);
    }
    return sec_count;
  },
  dispPages:function()
  {
    for(var i=0;i<this.pages.length;i++)
    {
      var sec_count=this.getPageRowNum(this.pages[i]);
      var dstart=this.pages[i].dataend-this.pages[i].dcount;
      SysUtils.log("pages="+this.pages[i].pindex+":"+dstart+":"+this.pages[i].dataend+":"
          +this.pages[i].dcount+":::"+this.pages[i].rcount+":"+this.pages[i].secs.length
          +":"+sec_count);
      for(var j=0;j<this.pages[i].secs.length;j++)
      {
        //SysUtils.log("sid:"+this.pages[i].secs[j].status+":"+this.pages[i].secs[j].secindex+":"+j+":"+this.pages[i].secs[j].sstart+":"+this.pages[i].secs[j].send);
      }
    }
  },
  isInList:function(id,list)
  {
    for(var i=0;i<list.length;i++)
    {
      if(list[i]==id)
      {
        return true;
      }
    }
    return false;
  },
  getSectionPartRowCount:function(sectionid,start,end)
  {
    if(sectionid==null){SysUtils.log("getSectionPartRowCount:secid="+sectionid+":"+start+":"+end); return 0;}
    var srcount=0;
    var secid=this.getDispSectionId(sectionid);
    var dsecdata=this.dispSecs[secid];
    var start=start+1;
    var end=end+1;
    //SysUtils.log("secid="+secid+":"+start+":"+end+":"+dsecdata.sdata.datanum);
    if(start!=1&&end!=dsecdata.sdata.datanum)//mid
    {
      var doffset=Math.floor(start/dsecdata.sdata.ddata.colnum);
      var subrear=Math.ceil(end/dsecdata.sdata.ddata.colnum);
      //if(dsecdata.sdata.ddata.colnum==1)
      //{
        srcount=subrear-doffset+1;
      //}
      //else
      //{
      //  srcount=subrear-doffset;
      //}
    }
    else if(start!=1)//first
    {
      var doffset=Math.floor(start/dsecdata.sdata.ddata.colnum);
      //if(dsecdata.sdata.ddata.colnum==1) {
        srcount = dsecdata.sdata.ddata.rownum - doffset + 1;
      //}else
      //{
        //srcount = dsecdata.sdata.ddata.rownum - doffset;
      //}
    }
    else if(end!=dsecdata.sdata.datanum)//last
    {
      var partcount=Math.ceil(end/dsecdata.sdata.ddata.colnum);
      srcount=partcount;
    }
    else//all section
    {
      srcount=dsecdata.sdata.ddata.rownum;
    }
    //SysUtils.log("getSectionPartRowCount:"+sectionid+":"+start+":"+end+"="+srcount);
    return srcount;
  },
  getSpareSections:function(start,end)
  {
    var secs=[];
    for(var i=start;i<end;i++)
    {
      if(!this.isInList(this.dataLists[i].secindex,secs))
      {
        secs.push(this.dataLists[i].secindex);
      }
    }
    return secs;
  },
  getPageSections:function(start,pageindex)
  {
    var secs=[];
    for(var i=start;i<this.dataLists.length;i++)
    {
      if(this.dataLists[i].ddata.pindex==pageindex)
      {
        if(!this.isInList(this.dataLists[i].secindex,secs))
        {
          secs.push(this.dataLists[i].secindex);
        }
      }
    }
    return secs;
  },
  getPageUnDispSecs:function(start,pageindex)
  {
    var secs=this.getPageSections(start,pageindex);
    var usecs=[];
    for(var i=0;i<secs.length;i++)
    {
      var dsecid=this.getDispSectionId(secs[i]);
      var cs=this.dispSecs[dsecid].cs;
      if(cs==0&&!this.isInList(secs[i],usecs))
      {
        usecs.push(secs[i]);
      }
    }
    return usecs;
  },
  resetPositionUp_back:function(iheight,pageindex)
  {
    //TODO:先取段，在排版
    var rsecs=this.getAllPageSections(this.currPages.start,this.currPages.end);
    for(var i=0;i<rsecs.length;i++)
    {
      var dsid=this.getDispSectionId(rsecs[i].secindex);
      var swid=100000+parseInt(rsecs[i].secindex);
      var sectionwdiget=this.sv_main.getChildByTag(swid);
      var size=this.item_tpl.getContentSize();
      var ddata=this.dataSections[rsecs[i].secindex].ddata;
      var halfrowcount=this.getSectionPartRowCount(rsecs[i].secindex,rsecs[i].sstart,rsecs[i].send);
      if(sectionwdiget!=null)
      {
        var txtname=ccui.helper.seekWidgetByName(sectionwdiget,"spliter_name");
        txtname.setString(rsecs[i].secindex+1+":"+this.dispSecs[dsid].sdata.name);
        ddata.offset.y=(i+1)*this.section_tpl.getContentSize().height;
        ddata.pos=cc.p(0,iheight-ddata.offset.y-(this.currPages.dcount-halfrowcount)*size.height);
        sectionwdiget.setPosition(ddata.pos);
      }
      var start = this.dispSecs[dsid].dstart;
      var end = this.dispSecs[dsid].dstart+this.dispSecs[dsid].sdata.datanum;
      for(var j=start;j<end;j++)
      {
        var dwid=200000+this.dataLists[j].ddata.dispi;
        var datawidget=this.sv_main.getChildByTag(dwid);
        if(datawidget!=null)
        {
          var data=this.dataLists[j];
          var psrdef=this.getPageSectionRowDef(this.currPages.index,rsecs[i].secindex);
          var rowi=Math.floor((data.ddata.placei-psrdef.sstart)/ddata.colnum);
          rowi+=this.currPages.dcount-halfrowcount;
          var coli=data.ddata.placei%ddata.colnum;
          data.ddata.pos=cc.p(coli*size.width+ddata.offset.x,iheight-(rowi+1)*size.height-ddata.offset.y);
          datawidget.setPosition(data.ddata.pos);
        }
      }
    }
  },
  resetPositionUp:function(iheight,pageindex)
  {
    var secob=this.pages[pageindex].secs[this.pages[pageindex].secs.length-1];
    var dsid=this.getDispSectionId(secob.secindex);
    var ddata=this.dispSecs[dsid].sdata.ddata;
    if(secob.dcount!==this.dispSecs[dsid].sdata.datanum)
    {
      var swid=100000+parseInt(secob.secindex);
      var sectionwdiget=this.sv_main.getChildByTag(swid);
      var size=this.item_tpl.getContentSize();
      var halfrowcount=Math.ceil((secob.send-secob.sstart+1)/ddata.colnum);
      if(sectionwdiget!=null)
      {
        var ddsecid=this.getAllPageSecIndex(secob.secindex);//this.getPageSectionIndex(secob.secindex);
        var txtname=ccui.helper.seekWidgetByName(sectionwdiget,"spliter_name");
        txtname.setString(secob.secindex+1+":"+this.dispSecs[dsid].sdata.name);
        ddata.offset.y=ddsecid*this.section_tpl.getContentSize().height;
        ddata.pos=cc.p(0,iheight-ddata.offset.y-(this.currPages.dcount-halfrowcount)*size.height);
        sectionwdiget.setPosition(ddata.pos);
      }
      var start = this.dispSecs[dsid].dstart;
      var end = this.dispSecs[dsid].dstart+this.dispSecs[dsid].sdata.datanum;
      for(var i=start;i<end;i++)
      {
        var dwid=200000+this.dataLists[i].ddata.dispi;
        var datawidget=this.sv_main.getChildByTag(dwid);
        if(datawidget!=null)
        {
          var data=this.dataLists[i];
          var psrdef=this.getPageSectionRowDef(this.currPages.index,secob.secindex);
          var rowi=Math.floor((data.ddata.placei-psrdef.sstart)/ddata.colnum);
          rowi+=this.currPages.dcount-halfrowcount;
          var coli=data.ddata.placei%ddata.colnum;
          data.ddata.pos=cc.p(coli*size.width+ddata.offset.x,iheight-(rowi+1)*size.height-ddata.offset.y);
          datawidget.setPosition(data.ddata.pos);
        }
      }
    }
  },
  resetPosition:function(height,start,end)
  {
    SysUtils.log("resetPosition:"+start+":"+end);
    SysUtils.log(this.dataLists[start].data[1]+":"+this.dataLists[end].data[1]);
    var offset=height-this.oldheight;
    for(var i=start;i<=end;i++)
    {
      var id=this.dataLists[i].ddata.dispi;
      var pos=this.dataLists[i].ddata.pos;
      pos.y=pos.y+offset;
      var dwid=200000+id;
      var datawidget=this.sv_main.getChildByTag(dwid);
      if(datawidget==null)
      {
        //SysUtils.log("resetPosition data widget isnull.."+dwid);
      }
      else
      {
        datawidget.setPosition(pos);
      }
    }
    var secs=this.getSections(start,end);
    for(var i=0;i<secs.length;i++)
    {
      var swid=100000+parseInt(secs[i]);
      var secwidget=this.sv_main.getChildByTag(swid);
      var dsid=this.getDispSectionId(secs[i]);
      var sdata=this.dispSecs[dsid];
      var pos=sdata.sdata.ddata.pos;
      pos.y=pos.y+offset;
      if(secwidget==null)
      {
        //SysUtils.log("resetPosition section widget isnull.."+swid+":"+dsid);
      }
      else
      {
        secwidget.setPosition(pos);
      }
    }
    //this.debugsv_main();
  },
  debugsv_main:function()
  {
    var children=this.sv_main.getChildren();
    for(var i=0;i<children.length;i++)
    {
      SysUtils.log(i+":"+children[i].getTag()+":"+children[i].getName());
    }
  },
  isPageIsDisplay:function(pageindex)
  {
    var page=this.pages[pageindex];
    for(var i=0;i<page.secs.length;i++)
    {
      var secob=page.secs[i];
      if(secob.status==0)
      {
        return false;
      }
    }
    return true;
  },
  getPageSectionRowDef:function(pageindex,secindex)
  {
    //TODO:fix some section split errors, english pound/ section index 41,42
    var page=this.pages[pageindex];
    for(var i=0;i<page.secs.length;i++)
    {
      var secob=page.secs[i];
      if(secob.secindex==secindex)
      {
        var count=this.getSectionPartRowCount(secindex,secob.sstart,secob.send);
        secob.psrowoffset=0;//TODO:
        secob.psrowcount=count;
        //SysUtils.log(pageindex+":"+secindex+":"+count);
        secob.index=i;
        return secob;
      }
    }
    SysUtils.log("pageindex="+pageindex+" and secindex="+secindex+" not found");
    return null;
  },
  isTheSampePos:function(secindex,placei,posindex)
  {
    var Flags=this.dataSections[secindex].ddata.Flags;
    //SysUtils.log("isTheSampePlace:"+placei+":"+Flags[placei]+";"+posindex+":"+Flags[posindex]+":"+Flags.length);
    if(Flags[placei]==Flags[posindex]&&placei==posindex)
    {
      return true;
    }
    return false;
  },
  getLastPlaceItem:function(secindex,placei,posindex)
  {
    var Flags=this.dataSections[secindex].ddata.Flags;
    var lastpos=placei;
    var lasts=[];
    for(var i=placei;i<=posindex+1;i++)
    {
      if(i<Flags.length&&Flags[i]>-1)
      {
        if(!this.isInList(Flags[i],lasts))
        {
          lasts.push(Flags[i]);
          lastpos=i;
        }
      }
    }
    return lastpos;
  },
  isLastPlaceItem:function(secindex,placei,posindex)
  {
    var lasitemi=this.getLastPlaceItem(secindex,placei,posindex);
    //SysUtils.log("last:"+secindex+":"+lasitemi+":"+placei+":"+posindex);
    if(lasitemi==placei)
    {
      //SysUtils.log("true last:"+secindex+":"+lasitemi+":"+placei);
      return true;
    }
    return false;
  },
  isLastPlacePos:function(secindex,placei,posindex)
  {
    if(this.isTheSampePlace(secindex,placei,posindex)&&this.isLastPlaceItem(secindex,placei,posindex))
    {
      return true;
    }
    return false;
  },
  isTheSampePlace:function(secindex,placei,posindex)
  {
    var Flags=this.dataSections[secindex].ddata.Flags;
    //SysUtils.log("isTheSampePlace:"+placei+":"+Flags[placei]+";"+posindex+":"+Flags[posindex]+":"+Flags.length);
    if(Flags[placei]==Flags[posindex])
    {
      return true;
    }
    return false;
  },
  getDataIndex:function(secindex,placei)
  {
    var Flags=this.dataSections[secindex].ddata.Flags;
    return Flags[placei];
  },
  getAllDispPageSections:function()
  {
    var secs=[];
    var start=this.currPages.start;
    if(start<0)
    {
      start=0;
    }
    var end=this.currPages.end;
    if(end>=this.pages.length)
    {
      end=this.pages.length-1;
    }
    for(var i=start;i<=end;i++) {
      for (var j = 0; j < this.pages[i].secs.length; j++) {
        if(!this.isInList(this.pages[i].secs[j].secindex,secs))
        {
          secs.push(this.pages[i].secs[j].secindex);
        }
      }
    }
    //SysUtils.log("secs:"+secs.length);
    return secs;
  },
  getPageSectionIndex:function(secindex)
  {
    var start=this.currPages.index;
    if(start>this.currPages.start)
    {
      start=this.currPages.start;
    }
    if(start<0)
    {
      start=0;
    }
    var count=0;
    var secs=[];
    if(this.dyndir=="up")
    {
      //TODO:fix the up direction
      for(var i=start;i<=this.currPages.end;i++)
      {
        var isbreak=false;
        for(var j=0;j<this.pages[i].secs.length;j++)
        {
          var secid=this.getDispSectionId(this.pages[i].secs[j].secindex);
          if(!this.isInList(secid,secs))
          {
            secs.push(secid);
            count+=1;
          }
          if(secindex==this.pages[i].secs[j].secindex)
          {
            isbreak=true;
            break;
          }
        }
        if(isbreak)
        {
          break;
        }
      }
    }
    else
    {
      for(var i=start;i<=this.currPages.end;i++)
      {
        var isbreak=false;
        for(var j=0;j<this.pages[i].secs.length;j++)
        {
          var secid=this.getDispSectionId(this.pages[i].secs[j].secindex);
          if(this.dispSecs[secid].status==1&&!this.isInList(secid,secs))
          {
            secs.push(secid);
            count+=1;
          }
          if(secindex==this.pages[i].secs[j].secindex)
          {
            isbreak=true;
            break;
          }
        }
        if(isbreak)
        {
          break;
        }
      }
    }
    //SysUtils.log(start+":"+this.currPages.end+":"+count+":"+secindex);
    return count;
  },
  getSecText:function(secindex)
  {
    var pageob=this.pages[this.currPages.index];
    var psid=0;
    for(var i=0;i<pageob.secs.length;i++)
    {
      if(pageob.secs[i].secindex==secindex)
      {
        psid=i;
      }
    }
    /*
    if(i==0&&this.currPages.index>0)
    {
      var secs=this.pages[this.currPages.index-1].secs;
      var secob=secs[secs.length-1];
      if(secob.status==1)
      {

      }
    }
    */
    var secob=pageob.secs[psid];
    var scount=this.getPlaceCellCount(secindex);//this.dataSections[secob.secindex].datanum;
    var result=["",""];
    //SysUtils.log(secindex+":"+scount+":"+secob.sstart+":"+secob.send+":"+secob.dcount);
    //TODO:if split section in big cell
    if(this.isTheSampePlace(secindex,0,secob.sstart)&&this.isTheSampePlace(secindex,secob.send,scount-1))
    {
      result=["mid",""];
    }
    else if(secob.sstart>0&&secob.send<scount-1&&!this.isTheSampePlace(secindex,secob.send,scount-1)&&!this.isTheSampePlace(secindex,0,secob.sstart))
    {
      result=["mid","(...部分...)"];
    }
    else if(this.isTheSampePlace(secindex,0,secob.sstart))
    {
      result=["first","(部分...)"];
    }
    else if(this.isTheSampePlace(secindex,secob.send,scount-1))
    {
      result=["last","(...部分)"];
    }

    return result;
  },
  getStartSection:function(pindex)
  {
    if(pindex>0)
    {
      for(var i=pindex-1;i>=0;i--)
      {
        for(var j=this.pages[i].secs.length-1;j>=0;j--)
        {
          var secob=this.pages[i].secs[j];
          if(secob.sstart==0)
          {
            return [i,j,secob];
          }
        }
      }
    }
    return [0,0,0];
  },
  isFirstPlace:function(secindex,placei)
  {
    var Flags=this.dataSections[secindex].ddata.Flags;
    for(var i=0;i<placei;i++)
    {
      if(Flags[i]==Flags[placei])
      {
        return false;
      }
    }
    return true;
  },
  getData:function(secindex,placei)
  {
    var Flags=this.dataSections[secindex].ddata.Flags;
    return this.dataLists[Flags[placei]];
  },
  addItem:function(iheight)
  {

    var size=this.item_tpl.getContentSize();
    var secid=this.pages[this.currPages.index].secs[this.placesindex].secindex;
    //SysUtils.log(secid+":addItem:"+this.placeindex);
    var data= this.getData(secid,this.placeindex); //this.dataLists[dataindex];
    var psrdef=this.getPageSectionRowDef(this.currPages.index,secid);
    var dsecid=this.getDispSectionId(secid);
    var ddata=this.dispSecs[dsecid].sdata.ddata;
    if(data!=null&&this.isFirstPlace(secid,this.placeindex))
    {
      //var secid=data.secindex;
      var dsecdata=this.dispSecs[dsecid];
      var ddsecid=this.getPageSectionIndex(secid)-1;
      var secwidget=null;
      if(dsecdata.status==0)
      {
        dsecdata.status=1;
        //this.placeindex=0;
        secwidget=this.startSection(null,secid,ddsecid);
        if(this.dyndir=="up")
        {
          //ddata.offset.y+=this.section_tpl.getContentSize().height;
          ddata.pos=cc.p(0,iheight-ddata.offset.y-this.currPages.dcount*size.height);
        }
        else if(this.dyndir=="down")
        {
          ddata.offset.y+=this.section_tpl.getContentSize().height;
          ddata.pos=cc.p(0,iheight-ddata.offset.y-this.dispRowCount*size.height);
        }
        else
        {
          //TODO:up direction load postion set
          ddata.offset.y+=this.section_tpl.getContentSize().height;
          ddata.pos=cc.p(0,iheight-ddata.offset.y-this.currPages.dcount*size.height);
        }
        this.sv_main.addChild(secwidget);
        secwidget.setVisible(true);
        secwidget.setPosition(ddata.pos);
        //SysUtils.log("secindex:"+100000+data.secindex);
        secwidget.setTag(100000+data.secindex);
      }
      else
      {
        //SysUtils.log(":"+psrdef.index);
        if(psrdef.index==0)
        {
          if(this.dyndir=="down")
          {
            var scount=this.getPlaceCellCount(secid);
            if(this.isTheSampePlace(secid,psrdef.send,scount-1)&&!this.isTheSampePlace(secid,psrdef.start,0))
            {
              var ssid=this.getStartSection(this.currPages.index);
              var swid=100000+ssid[2].secindex;
              var swidget=this.sv_main.getChildByTag(swid);
              if(swidget!=null)
              {
                var title_name=this.dispSecs[dsecid].sdata.name;
                if(this.isTheSampePlace(ssid[2].secindex,0,ssid[2].sstart))
                {
                  title_name=ssid[2].secindex+1+":"+title_name;
                }
                else
                {
                  title_name=ssid[2].secindex+1+":"+title_name+"(...部分)";
                }
                var lbl=ccui.helper.seekWidgetByName(swidget,"spliter_name");
                lbl.setString(title_name);
                //var pnl_spliter=ccui.helper.seekWidgetByName(swidget,"pnl_spliter");
                //var size=this.sv_main.getContentSize();
                //lbl.setContentSize(size.width-15-lbl.getStringLength()*lbl.getFontSize(),2);
              }
            }
            //this.placeindex=0;
          }
        }
      }
      var item=this.sv_main.getChildByTag(200000+data.ddata.dispi);
      //SysUtils.log(this.placeindex+":"+psrdef.psrowcount*ddata.colnum+":"+this.dispDataIndex);
      if(item==null)
      {
        var tpl=this.getTemplate(data.ddata.tpl_type);
        var widget=tpl.clone();
        var clickwidget = ccui.helper.seekWidgetByName(widget, "pnl_tpl_di");
        if(clickwidget!=null)
        {
          clickwidget.addTouchEventListener(this.onItemTouch.bind(this),this);
        }
        else
        {
          widget.addTouchEventListener(this.onItemTouch.bind(this),this);
        }
        var datawidget=this.startItem(widget,secid,data.ddata.dispi,data.ddata.placei);
        this.sv_main.addChild(datawidget);
        //SysUtils.log("aoi:"+dataindex+":"+this.currPages.index+":"+secid);
        var rowi=Math.floor((data.ddata.placei-psrdef.sstart)/ddata.colnum);
        if(this.dyndir=="up")
        {
          rowi+=this.currPages.dcount;
        }
        else if(this.dyndir=="down")
        {
          rowi+=this.dispRowCount;
          //TODO:up direction load postion set
        }
        else
        {
          rowi+=this.currPages.dcount;
        }
        var coli=data.ddata.placei%ddata.colnum;
        data.ddata.pos=cc.p(coli*size.width+ddata.offset.x+data.ddata.offset.x,iheight-(rowi+1)*size.height-ddata.offset.y+data.ddata.offset.y);
        datawidget.setPosition(data.ddata.pos);
        datawidget.setTag(200000+data.ddata.dispi);
        datawidget.setVisible(true);
        this.endItem(datawidget,secid,data.ddata.dispi,data.ddata.placei);
        this.dispDataIndex+=1;
      }
    }

    this.placeindex+=1;
    if((psrdef.status==0||psrdef.status==null)&&(this.placeindex-this.placeoffset)>=psrdef.psrowcount*ddata.colnum)
    {
      //TODO:fix the same place pos
      psrdef.status=1;
      //SysUtils.log("add sec:"+secid+":"+this.dataSections[secid].name+":"+psrdef.psrowcount+":"+this.placeindex);
      this.dispRowCount+=psrdef.psrowcount;
      this.currPages.dcount+=psrdef.psrowcount;
      this.placeindex=0;
      this.placeoffset=this.placeindex;
      this.placesindex+=1;
      this.endSection(secwidget,secid,ddsecid);
    }
  },
  addItems:function()
  {
    var scount=5;
    var isEnd=false;
    while(scount>0)
    {
      scount-=1;
      if(this.placesindex>=this.pages[this.currPages.index].secs.length)
      {
        isEnd=true;
        break;
      }
      else
      {
        this.addItem(this.iheight);
      }
    }
    if(!isEnd)
    {
      this.scheduleOnce(this.addItems.bind(this),0.04);
    }
    else
    {
      if(this.dyndir=="up")
      {
        var txtflag=ccui.helper.seekWidgetByName(this.flagtop,"txt_flag");
        txtflag.setString(this.dstatus[4]);
      }
      else if(this.dyndir=="down")
      {
        var txtflag=ccui.helper.seekWidgetByName(this.flagbottom,"txt_flag");
        txtflag.setString(this.dstatus[4]);
      }
      else
      {
        var txtflag=ccui.helper.seekWidgetByName(this.flagbottom,"txt_flag");
        txtflag.setString(this.dstatus[4]);
      }
      this.scheduleOnce(function(delta){
        this.isappending=false;
        this.sv_main.setBounceEnabled(true);
        this.endPage(this.currPages.index);
        if(this.dyndir=="up")
        {
          this.pages[this.currPages.start].isshow=true;
          this.resetPositionUp(this.iheight,this.currPages.index);
          if(this.loadType=="drag")
          {
            this.sv_main.jumpToTop();
          }
          else
          {

          }
        }
        else if(this.dyndir=="down")
        {
          //TODO:reset the last section text flags
          this.pages[this.currPages.end].isshow=true;
          if(this.loadType=="drag") {
            this.sv_main.jumpToBottom();
          }
          else
          {

          }
        }
        else
        {
          this.pages[this.currPages.end].isshow=true;
          if(this.loadType=="drag")
          {
            this.sv_main.jumpToBottom();
          }
          else
          {

          }
        }
      }.bind(this),0.4);
    }
  },
  getPageDataStart:function(pageindex)
  {
    var page=this.pages[pageindex];
    var start=page.dataend-page.dcount;
    if(start<0)
    {
      start=0;
    }
    return start;
  },
  loadPrint:function()
  {
    var astart=this.currPages.start;
    if(astart<0)
    {
      astart=0;
    }
    var aend=this.currPages.end;
    if(aend>this.pages.length-1)
    {
      aend=this.pages.length-1;
    }
    if((aend-astart+1)<this.maxDispPage)
    {
      this.printPage();
    }
    else
    {
      //TODO:release one page,add one page
      this.printPage();
    }
  },
  printPage:function()
  {
    if(this.sstatus==""){
      //SysUtils.log("sstatus="+this.sstatus);
      return;
    }
    this.sstatus="";
    if(this.dyndir=="up")
    {
      this.currPages.index=this.currPages.start;
      if (this.currPages.start >= 0)
      {
        if(this.pages[this.currPages.start].isshow)
        {
          this.currPages.start-=1;
        }
        this.currPages.index=this.currPages.start;
      }
    }
    else if(this.dyndir=="down") {
      this.currPages.index = this.currPages.end;
      if (this.currPages.end < this.pages.length)
      {
        if(this.pages[this.currPages.end].isshow)
        {
          //SysUtils.log("add down");
          this.currPages.end+=1;
        }
        this.currPages.index = this.currPages.end;
      }
    }
    if(this.currPages.index>=this.pages.length||this.currPages.index<0){
      SysUtils.log("pageIndex out of bound "+this.currPages.index+","+this.pages.length);return;
    }
    if(this.dataLists.length<1) { SysUtils.log("addPage length="+this.dataLists.length); return; }
    if(this.isappending){ SysUtils.log("appending..."); return; }
    this.isappending=true;
    this.startPage(this.currPages.index);
    var maxCount=this.pages[this.currPages.index].dcount;
    var cpdataend=this.pages[this.currPages.index].dataend;
    SysUtils.log("maxCount:"+maxCount+":"+cpdataend);
    var start=cpdataend-maxCount;
    if(start<0)
    {
      start=0;
    }
    if(this.dyndir=="up")
    {
      this.dispDataStart=start;
    }
    else if(this.dyndir=="down")
    {
      this.dispDataEnd=cpdataend+1;
    }
    else
    {
      this.dispDataEnd=cpdataend+1;
    }

    this.oldheight=this.getSvInnerSize().height;
    //SysUtils.log("disp start:"+this.currPages.index+":"+start+":"+this.dispDataEnd+"::" +this.currPages.start+":"+this.currPages.end+":"+this.pages.length);
    var allrow=this.getAllPageRowNum(this.currPages.start,this.currPages.end);
    //SysUtils.log("allrow="+allrow);

    this.iheight=this.resetInnerHeight(allrow);
    this.currPages.dcount=0;

    if(this.dyndir=="up")
    {
      if(this.loadType=="drag")
      {
        var txtflag=ccui.helper.seekWidgetByName(this.flagtop,"txt_flag");
        txtflag.setString(this.dstatus[3]);
        var p=cc.p(0, this.sv_main.getContentSize().height - this.iheight - this.flagtop.getContentSize().height);
        if(cc.sys.isNative) {
          this.sv_main.setInnerContainerPosition(p);
        }
        else
        {
          this.sv_main._innerContainer.setPosition(p);
        }
      }
      else
      {

      }
    }
    else if(this.dyndir=="down")
    {
      if(start==273)//fix for dollor,//TODO:fix it use algrithm
      {
        start=start+3;
      }
      this.resetPosition(this.iheight,this.dispDataStart,start);
      if(this.loadType=="drag")
      {
        var p=cc.p(0, this.flagbottom.getContentSize().height);
        if(cc.sys.isNative) {
          this.sv_main.setInnerContainerPosition(p);
        }
        else
        {
          this.sv_main._innerContainer.setPosition(p);
        }
        var txtflag=ccui.helper.seekWidgetByName(this.flagbottom,"txt_flag");
        txtflag.setString(this.dstatus[3]);
      }
    }
    else
    {
      //this.resetPosition(this.iheight,cpdataend,this.dispDataEnd);
      if(this.loadType=="drag")
      {
        var p=cc.p(0, this.flagbottom.getContentSize().height);
        if(cc.sys.isNative) {
          this.sv_main.setInnerContainerPosition(p);
        }
        else
        {
          this.sv_main._innerContainer.setPosition(p);
        }
        var txtflag=ccui.helper.seekWidgetByName(this.flagbottom,"txt_flag");
        txtflag.setString(this.dstatus[3]);
      }
    }

    //SysUtils.log(":"+this.dyndir);

    //this.sv_main.stopAllActions();
    this.sv_main.setBounceEnabled(false);
    this.dispDataIndex=start;
    this.placeindex=this.dataLists[this.dispDataIndex].ddata.placei;
    this.placeoffset=this.placeindex;
    this.placesindex=0;

    this.scheduleOnce(function(delta){
      this.addItems();
    }.bind(this),0.04);

  },
  getItemHeight:function(sob,placei)
  {
    var Flags=sob.ddata.Flags;
    var pos=placei;
    var height=0;
    while(pos<Flags.length)
    {
      if(Flags[pos]==Flags[placei])
      {
        height+=1;
      }
      pos=pos+sob.ddata.colnum;
    }
    return height;
  },
  getLastLineHeight:function()
  {
    var page=this.pages[this.currPages.index];
    var secob=page.secs[page.secs.length-1];
    var secindex=secob.secindex;
    var sob=this.dataSections[secindex];
    var Flags=sob.ddata.Flags;
    var lastlsf=Math.floor(secob.send/sob.ddata.colnum)*sob.ddata.colnum;
    var lastlsc=Math.ceil(secob.send/sob.ddata.colnum)*sob.ddata.colnum;
    var height=this.getItemHeight(sob,lastlsf);
    for(var i=lastlsf;i<lastlsc;i++)
    {
      if(i<Flags.length)
      {
        var nheight=this.getItemHeight(sob,i);
        if(height<nheight)
        {
          height=nheight;
        }
      }
    }
    return height;
  },
  resetInnerHeight:function(rcount)
  {
    var size=this.item_tpl.getContentSize();
    var cs=this.sv_main.getContentSize();
    var offsetline=this.getLastLineHeight()-1;
    var iheight=size.height*(rcount+offsetline);
    var ssize=this.section_tpl.getContentSize();
    var secs=this.getAllDispPageSections();
    iheight+=ssize.height*secs.length+10;
    if(iheight<cs.height)
    {
      iheight=cs.height;
    }
    if(cc.sys.isNative)
    {
      this.sv_main.setInnerContainerSize(cc.size(cs.width,iheight));
    }
    else
    {
      this.sv_main._innerContainer.setContentSize(cc.size(cs.width,iheight));
    }
    this.flagtop.setPosition(cc.p(0,this.getSvInnerSize().height));
    //SysUtils.log("iheight:"+iheight+":"+rcount+":"+secs.length);
    return iheight;
  },
  update:function(delta){

  },
  adapterImage:function(pnl_ico,imgfile)
  {
    if(pnl_ico!=null&&jsb.fileUtils.isFileExist(imgfile))//scale icon to adapter
    {
      var image=new ccui.ImageView(imgfile);
      var isize=pnl_ico.getContentSize();
      var size=image.getContentSize();
      var scalex=isize.width/size.width;
      var scaley=isize.height/size.height;
      var scale=scalex;
      if(scalex>scaley)
      {
        scale=scaley;
      }
      pnl_ico.setBackGroundImage(imgfile);
      pnl_ico.setScale(scale-0.1);
      pnl_ico.setPosition(57,59);
    }
  },
  onItemTouch:function(sender,type)
  {
    this.itemTouch(null,-1,-1,-1,sender,type);
    switch(type)
    {
      case ccui.Widget.TOUCH_BEGAN:
          sender.setScale(0.8);
          this.scrolls=[];
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED:
          var index=sender.getTag()-200000;
          this.selectItem(null,0,index,index);
          sender.setScale(1.0);
        break;
      case ccui.Widget.TOUCH_CANCELED:
          this.loadPrint();
          sender.setScale(1.0);
        break;
      default:
        break;
    }
  },
  onScrollTouch:function(sender,type)
  {
    switch(type)
    {
      case ccui.Widget.TOUCH_BEGAN:
        this.scrolls=[];
        this.isTouch=true;
        break;
      case ccui.Widget.TOUCH_MOVED:
        break;
      case ccui.Widget.TOUCH_ENDED:
        this.isTouch=false;
        this.loadPrint();
        break;
      case ccui.Widget.TOUCH_CANCELED:
        this.isTouch=false;
        this.loadPrint();
        break;
      default:
        break;
    }
  },
  onButtonTouch:function(sender,type){
    switch (type) {
      case ccui.Widget.TOUCH_BEGAN:
        sender.setScale(0.8);
        break;
      case ccui.Widget.TOUCH_MOVED:

        break;
      case ccui.Widget.TOUCH_CANCELED:
        sender.setScale(1.0);
        break;
      case ccui.Widget.TOUCH_ENDED:
        if(sender.getName()=="pnl_back")
        {
          UIModule.closeLayer(this);
        }
        sender.setScale(1.0);
        break;
      default:
        sender.setScale(1.0);
        break;
    }
  },
  isMorePage:function(dir)
  {
    //SysUtils.log(this.currPages.index":"+this.pages.length);
    if(dir=="up")
    {
      if(this.currPages.start>=0&&this.pages.length>0)
      {
        return true;
      }
    }
    else if(dir=="down")
    {
      if(this.currPages.end<this.pages.length&&this.pages.length>0)
      {
        return true;
      }
    }
    return false;
  },
  getSvInnerPosition:function()
  {
    var p=cc.p(0,0);
    if(cc.sys.isNative) {
      p = this.sv_main.getInnerContainerPosition();
    }else
    {
      p = this.sv_main._innerContainer.getPosition();
    }
    return p;
  },
  getSvInnerSize:function()
  {
    var is=cc.size(0,0);
    if(cc.sys.isNative) {
      is = this.sv_main.getInnerContainerSize();
    }else
    {
      is = this.sv_main._innerContainer.getContentSize();
    }
    return is;
  },
  onScroll:function(sender,type)
  {
    var ttxt = this.events[type];
    var p=this.getSvInnerPosition();
    var is=this.getSvInnerSize();
    var shei=this.sv_main.getContentSize().height;
    if(ttxt=="SCROLLING")
    {
      if(p.y>0)// display bottom
      {
        this.sstatus="";
        var txtflag=ccui.helper.seekWidgetByName(this.flagbottom,"txt_flag");
        txtflag.setString(this.dstatus[0]);
        if(p.y>this.flagbottom.getContentSize().height)
        {
          //SysUtils.log(p.y+":"+is.height);
          if(this.isMorePage("down"))
          {
            txtflag.setString(this.dstatus[2]);
            this.sstatus = "add_bottom_data";
            this.dyndir = "down";
            this.currPages.dir = "down";
          } else {
            txtflag.setString(this.dstatus[5]);
          }
        }
      }
      else if(Math.abs(p.y)+shei>is.height)
      {
        //SysUtils.log(p.y+":"+shei+":"+is.height);
        this.sstatus="";
        var txtflag=ccui.helper.seekWidgetByName(this.flagtop,"txt_flag");
        txtflag.setString(this.dstatus[1]);
        if(Math.abs(p.y)+shei>is.height+this.flagtop.getContentSize().height)
        {
          if(this.isMorePage("up")) {
            txtflag.setString(this.dstatus[2]);
            this.sstatus = "add_top_data";
            this.dyndir = "up";
            this.currPages.dir = "up";
          } else {
            txtflag.setString(this.dstatus[5]);
          }
        }
      }
    }
  },
  onMsg:function(event)
  {

  }
});