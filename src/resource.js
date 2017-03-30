var res = {
    ccslogo_png : "res/logo.png",
    VideoList_json : "res/cVideoList.json",
    IcoinMall_json : "res/cIcoinMall.json",
    bgLayer_json : "res/cBgLayer.json",
    gameTemplate_json:"res/cGameTemplate.json",
    XiaoXiaoLe:"res/cLinkLine.json",
    RewardStatement:"res/cStatementLayer.json",
    gameStart:"res/GameStartLayer.json",
    victory:"res/VictoryLayer.json"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
