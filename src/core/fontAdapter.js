

var FontAdapter = FontAdapter || {};

FontAdapter.doAdapter=function(widget)
{
  var childs=widget.getChildren();
  FontAdapter.doConvert(widget);
  for(var i=0;i<childs.length;i++)
  {
    FontAdapter.doAdapter(childs[i]);
  }
}

FontAdapter.doConvert=function(widget)
{
  var type=widget.getDescription();
  if(type=="Label")
  {
    var comdata=widget.getComponent("ComExtensionData");
    var data=comdata.getCustomProperty();
    if(data)
    {
      var params=data.split(":");
      if(params[0]=="font")
      {
        //SysUtils.log("setFontName="+params[1]);
        widget.setFontName(params[1]);
      }
      else
      {
        SysUtils.log("userdata:"+data);
      }
    }
  }
}

