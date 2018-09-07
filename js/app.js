/**
 * 定时刷新token
 * 判断百度是否稳定
 * 加载百度地图
 * 第一次加载
 * 退出登录
 */

//  全局变量
var BoxNo='',
    AllconfigType=[],
    AllpathNum=[],
    AllpageSize=30;
    localStorage.getItem("Allcity")?Allcity=localStorage.getItem("Allcity"):'';
    localStorage.getItem("Allurl")?Allurl=localStorage.getItem("Allurl"):'';
    localStorage.getItem("mapTime")?mapTime=localStorage.getItem("mapTime"):'';
    localStorage.getItem("uiTime")?uiTime=localStorage.getItem("uiTime"):'';

$('#tab3 .uname').html(localStorage.getItem('uname'))
$('#tab3 .power').html(localStorage.getItem('department'))
$('#tab3 .city').html(Allcity)
$('#tab3 .url').html(Allurl)

$(document).on('click','.city-shezhi', function () {
    $.prompt('请输入城市(如果输入不正确的城市将导致地图发生错误!)',
      function (value) {
        value.replace(/其他/g,"");
        if(value.indexOf("海外")>-1||value.indexOf("台湾")>-1){
            value="北京";
            $.toast("暂不支持海外和台湾地区!");
        }
        Allcity=value;$('#tab3 .city').html(Allcity);
        localStorage.setItem("Allcity",value);
        $.toast("设置成功!");
        // map.centerAndZoom(value,10);
        console.log(value)
      }
    );
    $(".modal-text-input").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
        <button class="button button-link pull-right close-picker">确定</button>\
        <h1 class="title">选择地图默认位置</h1>\
        </header>'
      }).val(Allcity);
});
$(document).on('click','.url-shezhi', function () {
    $.prompt('请求地址需要比较完整的路径配置（包括服务器IP或域名；端口；目录等）',
      function (value) {
        Allurl=value;$('#tab3 .url').html(Allurl);
        localStorage.setItem("Allurl",value);
        $.toast("设置成功!");
      }
    );
    $(".modal-text-input").val(Allurl)
});
// 获取灯的类型
function configType(){
    var target='/StreetLightServer/api/app/configInfo/queryList.do',
        data=`timestamp=${new Date().getTime()}`;
        hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
        sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
    jQuery.ajax({
        type:'post',
        // async:false,
        url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
        dataType:'json',
        error:function(){console.log("错误!")}
    }).then((data)=>{
        for(var p of data.response){
            if(p.configType<AllLightNum){
                AllconfigType.push(p);
            }
        }
    })
}
configType();//执行一次

// 定时刷新token
setInterval(()=>{
    var target='/StreetLightServer/api/app/userInfo/login.do',
        data=`account=${localStorage.getItem('uname')}&password=${CryptoJS.MD5(localStorage.getItem('upwd')).toString()}&timestamp=${new Date().getTime()}`;
        hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
        sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
    jQuery.ajax({
        type:'post',
        url:Allurl+target+'?'+data+'&sign='+sign,
        dataType:'json',
        error:function(){console.log("错误!")}
    }).then((data)=>{
        if(data.resultCode==0000){
            localStorage.setItem('token', data.token);
        }else{
            console.log('定时刷新token发生错误'+data.msg)
        }
    })
},1000*60*9)
// 刷新后5秒取token
setTimeout(()=>{
    var target='/StreetLightServer/api/app/userInfo/login.do',
        data=`account=${localStorage.getItem('uname')}&password=${CryptoJS.MD5(localStorage.getItem('upwd')).toString()}&timestamp=${new Date().getTime()}`;
        hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
        sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
    jQuery.ajax({
        type:'post',
        url:Allurl+target+'?'+data+'&sign='+sign,
        dataType:'json',
        error:function(){console.log("错误!")}
    }).then((data)=>{
        if(data.resultCode==0000){
            localStorage.setItem('token', data.token);
        }else{
            console.log('定时刷新token发生错误'+data.msg)
        }
    })
},1000*5)

// 判断百度是否稳定
if(typeof(BMap)=='undefined'){
    $.toast("百度地图不稳定!");
    var IsBMap=false;
}else{
    var IsBMap=true;
}
// 加载百度地图
if(IsBMap){
    //设置container的高度
    // var div_h = $("#container").height()-30;
    // $("#container").css({"height":div_h+"px"});
    // 百度地图API功能
    var map = new BMap.Map("container");
    // var point = new BMap.Point(113.30764968,23.1200491);
    // map.centerAndZoom(point,9);
    map.centerAndZoom(Allcity,10);      // 初始化地图,用城市名设置地图中心点
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
    
    // 编写自定义函数,创建标注
    function addMarker(point,infoWindow,statu){
        //添加图标
        switch(statu){
            case '0': var url="img/icon/dx-green.png"; break;
            case '1': var url="img/icon/dx-gray.png"; break;
            case '2': var url="img/icon/dx-red.png"; break;
        }
    
        var myIcon= new BMap.Icon(url,new BMap.Size(25,30), {imageSize: new BMap.Size(25, 30)});
        var marker = new BMap.Marker(point,{icon:myIcon});
        map.addOverlay(marker);
    
        //click
        marker.addEventListener("click", function(){     
            var point =new BMap.Point(marker.getPosition().lng, marker.getPosition().lat) ;    //获取marker的位置
            map.zoomTo(14);
            map.panTo(point);     //跳转
            this.openInfoWindow(infoWindow); //开启信息窗口
        }); 
    }
}
//第一次加载数据
function firstAjax(){
    var target='/StreetLightServer/api/app/terminalBox/queryTreeList.do',
        data=`timestamp=${new Date().getTime()}`;
        hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
        sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
    jQuery.ajax({
        type:'post',
        url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
        dataType:'json',
        error:function(){console.log("错误!")}
    }).then((data)=>{
        // console.log(data)
        //如果token过时,会失败
        if(data.resultCode!='0000'){
            $.alert('你还未登录或登录超时!请重新登录', function () {
                window.location.href = "index.html";
                // 怕多点登录会导致后台负担,所有关闭时退出
                // var target='/StreetLightServer/api/app/userInfo/logout.do',
                //     data=`account=${localStorage.getItem('uname')}&timestamp=${new Date().getTime()}`;
                //     hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
                //     sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
                // jQuery.ajax({
                //     type:'post',
                //     url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
                //     dataType:'json',
                //     error:function(){console.log("错误!")}
                // }).then((data)=>{
                //     console.log(data);
                //     window.location.href = "index.html";
                // })
            });
        }
        //添加marker点
        var tree=data.response.listTerminalBoxTreeAreaJson,html="";
        if(IsBMap){
            //清除之前的maker
            // console.log(map.getOverlays().length)
            map.clearOverlays(); 
            for(var i of tree){
                for(var t of i.listTerminalBoxTreeRoadJson){
                    var area=t.roadName;
                    for(var u of t.listTerminalBoxTreeChildJson){
                        var point = new BMap.Point(u.eastLongitude,u.northLatitude);
                        var opts = {
                            width : 200,     // 信息窗口宽度
                            height: 180,     // 信息窗口高度
                            title : "【终端】" , // 信息窗口标题
                            enableMessage:true//设置允许信息窗发送短息
                            }
                        var msg=` <div id="abc">
                            <p>编 号： ${u.terminalBoxNo} </p>		
                            <p>名 称： ${u.terminalBoxName} </p>
                            <p>片 区： ${area} </p>
                            <p>地 址： ${u.address}  </p>
                            <p>责任人及电话：${u.phoneNo} </p>
                        </div> `;
                        var infoWindow = new BMap.InfoWindow(msg, opts);  // 创建信息窗口对象 
                        // console.log(point)
                        // console.log(u.onLineStatus.toString())
                        addMarker(point,infoWindow,u.onLineStatus.toString());
                        // console.log(point,infoWindow,u.onLineStatus)   
                    }
                }

            }
        }
        //修改信息(顶部在线离线)
            $("#index .information .all").html(data.response.totalNum)
            $("#index .information .online").html(data.response.onLineNum)
            $("#index .information .alert").html(data.response.faultNum)
        //加载终端树
        
            for(var t of tree){
                // html+=`<p class="list_t">${t.areaName}</p>
                html+=`<p class="list_t">${t.areaName} <span> (总:${t.totalNum}台，在线:${t.onLineNum}台)</span></p>
                <div class="list_d" style="display: none;">`
                for(var i of t.listTerminalBoxTreeRoadJson){
                    html+=`<p class="tree-title"><span class="y">${i.roadName}</span><span><i class="icon iconfont icon-shang icon-icon-arrow-down"></i></span></p>
                    <ul class="tree-list list-block">`;
                    for(var u of i.listTerminalBoxTreeChildJson){
                        html+=`<li class="height-limit item-link list-button" style="color:${u.onLineStatus==0?'green':(u.onLineStatus==1?'gray':'red')};"
                        data-id='${u.terminalBoxNo}' data-lng="${u.eastLongitude}" data-lat="${u.northLatitude}">${u.terminalBoxNo}/${u.terminalBoxName}</li>`;
                        // 保存每个终端控制的回路数
                        var pathNum={"terminalBoxNo":u.terminalBoxNo,"pathNum":u.pathNum}
                        AllpathNum.push(pathNum);
                    }
                    html+='</ul>';
                }
                html+=`</div>`
            }
            $(".tree-content").html(html)
            // jQuery('.tree-content .list_d').slideUp();
    })
}
firstAjax();
// 侧栏的点击事件(新增元素的也有效)
$('.tree-content').on("click",'.tree-title',function(e){
    var $tar=$(e.target);
    if($tar.hasClass("y")){
        $tar.parent().children().last().toggleClass("icon-ratate");
        $tar.parent().next().children().toggleClass("height-limit");
        if($tar.parent().next().css("height")=='0px'){
            var h=$tar.parent().next().children().length*43+"px";
            $tar.parent().next().css("height",h);
        }else{
            $tar.parent().next().css("height","0px");
        }
    }else if($tar.hasClass("tree-title")){
        $tar.children().last().toggleClass("icon-ratate");
        $tar.next().children().toggleClass("height-limit");
        if($tar.next().css("height")=='0px'){
            var h=$tar.next().children().length*43+"px";
            $tar.next().css("height",h);
        }else{
            $tar.next().css("height","0px");
        }

    }
})
$(".tree-content").on("click",'.tree-list li',function(e){
    var $tar=$(e.target);
    configSelect($tar.html(),jQuery(e.target).data('id'))//用jquery的 zepto 会省略前面的000
    if(IsBMap){
        var point = new BMap.Point($tar.data("lng"),$tar.data("lat"));
        map.zoomTo(13);
        map.panTo(point);     //跳转
        // this.openInfoWindow(infoWindow); //开启信息窗口
    }
})
jQuery(".tree-content").on("click",".list_t",function () {
    jQuery('.tree-content .list_d').stop();
    jQuery(this).siblings(".tree-content .list_t").removeAttr("data-up");
    if(jQuery(this).attr("data-up")=="open"){
        jQuery(this).removeAttr("data-up").siblings(".tree-content .list_d").slideUp(100);
    }else{
        jQuery(this).attr("data-up","open").next().slideDown(100).siblings(".tree-content .list_d").slideUp(100);
    }
});
//定时请求
setInterval(()=>{firstAjax()},mapTime)

//多选模板加载
myAjax({
    "url":"/terminalBox/queryTreeList.do",
    "data":'',
    "callBack":function(data){
        var tree=data.response.listTerminalBoxTreeAreaJson,html="";
        for(var t of tree){
            // html+=`<p class="list_t">${t.areaName}</p>
            html+=`<p class="list_t"><input type="checkbox">${t.areaName} <span> (总:${t.totalNum}台，在线:${t.onLineNum}台)</span></p>
            <div class="list_d">`
            for(var i of t.listTerminalBoxTreeRoadJson){
                html+=`<p class="tree-title-ck"><input type="checkbox"><span class="y">${i.roadName}</span><span><i class="icon iconfont icon-shang icon-icon-arrow-down"></i></span></p>
                <ul class="tree-list-ck list-block">`;
                for(var u of i.listTerminalBoxTreeChildJson){
                    html+=`<li class="height-limit item-link list-button" style="color:${u.onLineStatus==0?'green':(u.onLineStatus==1?'gray':'red')};"
                    data-id='${u.terminalBoxNo}' data-lng="${u.eastLongitude}" data-lat="${u.northLatitude}"><input class="realckeck" type="checkbox" data-id="${u.terminalBoxNo}">${u.terminalBoxNo}/${u.terminalBoxName}</li>`;
                    // 保存每个终端控制的回路数
                    var pathNum={"terminalBoxNo":u.terminalBoxNo,"pathNum":u.pathNum}
                    AllpathNum.push(pathNum);
                }
                html+='</ul>';
            }
            html+=`</div>`
        }
        $(".tree-checkbox").html(html)

        $('.tree-title-ck').on("click",function(e){
            var $tar=$(e.target);
            if($tar.hasClass("y")){
                $tar.parent().children().last().toggleClass("icon-ratate");
                $tar.parent().next().children().toggleClass("height-limit");
                if($tar.parent().next().css("height")=='0px'){
                    var h=$tar.parent().next().children().length*43+"px";
                    $tar.parent().next().css("height",h);
                }else{
                    $tar.parent().next().css("height","0px");
                }
            }else if($tar.hasClass("tree-title-ck")){
                $tar.children().last().toggleClass("icon-ratate");
                $tar.next().children().toggleClass("height-limit");
                if($tar.next().css("height")=='0px'){
                    var h=$tar.next().children().length*43+"px";
                    $tar.next().css("height",h);
                }else{
                    $tar.next().css("height","0px");
                }

            }
        })
        jQuery('.tree-checkbox .list_d').slideUp(100);
        jQuery(".tree-checkbox .list_t").on("click",function (e) {
            if($(e.target).attr("type")=='checkbox'){return;}//如果是CheckBox就不展开
            jQuery('.tree-checkbox .list_d').stop();
            jQuery(this).siblings(".tree-checkbox .list_t").removeAttr("data-up");
            if(jQuery(this).attr("data-up")=="open"){
                jQuery(this).removeAttr("data-up").siblings(".tree-checkbox .list_d").slideUp(100);
            }else{
                jQuery(this).attr("data-up","open").next().slideDown(100).siblings(".tree-checkbox .list_d").slideUp(100);
            }
        });
        //二级判断一级函数
        function twoOne($tar){
            var pALl=$tar.parent().parent().children().children(["p>input"]),
            allNum=0;//所有的check
            for(var i=0;i<pALl.length;i++){
                if($(pALl[i]).prop("checked")){allNum++}
            }
            if(allNum==pALl.length){
                $tar.parent().parent().prev().children("input").prop("checked",true)
            }else{
                $tar.parent().parent().prev().children("input").prop("checked",false)
            }
        }
        //第一级
        jQuery(".tree-checkbox .list_t>input").on("click",function (e) {
            var $tar=$(e.target);
            //判断子级是否勾选
            if($tar.prop("checked")){
                $tar.parent().next().find("input").prop("checked",true)
            }else{
                $tar.parent().next().find("input").prop("checked",false)
            }
        })
        //第二级
        jQuery(".tree-title-ck>input").on("click",function (e) {
            var $tar=$(e.target);
            //判断父级是否勾选
            twoOne($tar)
            //判断子级是否勾选
            if($tar.prop("checked")){
                $tar.parent().next().children().children("input").prop("checked",true)
            }else{
                $tar.parent().next().children().children("input").prop("checked",false)
            }
        })
        //第三级
        $(".tree-list-ck li").on("click",function(e){
            //判断本身是否勾选
            var $tar=$(e.target);
            if($tar.attr("type")=='checkbox'){
                var ck=$tar.parent().parent().children().children("input"),
                allNum=0;//所有的check
                for(var i=0;i<ck.length;i++){
                    if($(ck[i]).prop("checked")){allNum++}
                }
                var parentCK=$tar.parent().parent().prev().children("input");
                if(allNum==ck.length){
                    //修改第二级
                    parentCK.prop("checked",true)
                    //再判断第一级
                    twoOne(parentCK)
                }else{
                    //修改第二级
                    parentCK.prop("checked",false)
                    //再判断第一级
                    twoOne(parentCK)
                }
                

            }else{
                var checked=!$tar.children("input").prop("checked");
                $tar.children("input").prop("checked",checked)
                //判断父级是否勾选
                var ck=$tar.parent().children().children("input"),
                    allNum=0;//所有的check
                for(var i=0;i<ck.length;i++){
                    if($(ck[i]).prop("checked")){allNum++}
                }
                var parentCK=$tar.parent().prev().children("input");
                if(allNum==ck.length){
                    //修改第二级
                    parentCK.prop("checked",true)
                    //再判断第一级
                    twoOne(parentCK)
                }else{
                    //修改第二级
                    parentCK.prop("checked",false)
                    //再判断第一级
                    twoOne(parentCK)
                }
            }
        })
    }
})
//多选模板关闭
$(document).on('closed','.popup-treeList', function () {
    var all=$(".tree-checkbox .realckeck"),
        msg="";
    for(var i=0;i<all.length;i++){
        if($(all[i]).prop("checked")){
            msg+=jQuery(all[i]).data("id")+';'
        }
    }
    $('.popup-remoteSwitchLight .config').html('已选的终端:'+(msg?msg.slice(0,-1):"还未选择"))
    //清除选择
    $(".tree-checkbox input").prop("checked",false)
});


//侧栏上面的所选的显示
function configSelect(data,id){
    $(".tree-select span").html(data);
    BoxNo=id;
    $(".historyInput input").val(data).attr("data-id",id)
}



//退出登录
$(document).on('click', '.login-out',function () {
    $.confirm('是否确认退出登录?',
      function () {
        window.location.href = "index.html";
      });
});