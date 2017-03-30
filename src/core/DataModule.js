var DataModule = DataModule || {};


DataModule.getStringFromFile=function(filename,uencry)
{
    //TODO:adapter for h5 version
    var update_file=jsb.fileUtils.getWritablePath()+"update/"+filename;
    if(uencry==null)
    {
        uencry=0;
    }
    //SysUtils.log(update_file);
    if(jsb.fileUtils.isFileExist(update_file))//优先读取更新中的数据
    {
        SysUtils.log("read update");
        return jsb.fileUtils.getStringFromFile(update_file,uencry);
    }
    else
    {
        return jsb.fileUtils.getStringFromFile(filename,uencry);
    }
}
var _coin_number=SysUtils.readJson("res/data/coin_number.json");
