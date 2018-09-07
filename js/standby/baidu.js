//设置container的高度
// var div_h = $("#container").height()-30;
// $("#container").css({"height":div_h+"px"});
// 百度地图API功能
var map = new BMap.Map("container");
var point = new BMap.Point(113.30764968,23.1200491);
map.centerAndZoom(point,10);
// map.centerAndZoom("广州",11);      // 初始化地图,用城市名设置地图中心点
map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

// 编写自定义函数,创建标注
function addMarker(point,infoWindow,statu){
    //添加图标
    switch(statu){
        case 0: var url="img/icon/all.png"; break;
        case 1: var url="img/icon/online.png"; break;
        case 2: var url="img/icon/alert.png"; break;
    }

    var myIcon= new BMap.Icon(url,new BMap.Size(30,30), {imageSize: new BMap.Size(30, 30)});
    var marker = new BMap.Marker(point,{icon:myIcon});
    map.addOverlay(marker);

    //click
    marker.addEventListener("click", function(){     
        var point =new BMap.Point(marker.getPosition().lng, marker.getPosition().lat) ;    //获取marker的位置
        map.zoomTo(13);
        map.panTo(point);     //跳转
        this.openInfoWindow(infoWindow); //开启信息窗口
    
    }); 
    //mouseover
    marker.addEventListener("mouseover", function(){      
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); 	//跳动的动画
        this.openInfoWindow(infoWindow); //开启信息窗口
    }); 
    //mouseout
    marker.addEventListener("onmouseout", function(){      
        marker.setAnimation(); //跳动的动画
    }); 
}
//获取模拟的数据
var bounds = map.getBounds();
var sw = bounds.getSouthWest();
var ne = bounds.getNorthEast();
var lngSpan = Math.abs(sw.lng - ne.lng);
var latSpan = Math.abs(ne.lat - sw.lat);
var p_statu=[0,0,0,0,1,0,1,1,0,2,2,0,2,0,1,0,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,1,2,0,0,0,0,0];
var msg=[
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

        `,
        `
        <div id="abc">
        <p>编 号： 00042 </p>		
        <p>名 称： 测试42 </p>
        <p>片 区： 片区未知 </p>
        <p>道 路： 昭信生产线测试 </p>
        <p>地 址： 地址未知  </p>
        <p>责任人及电话：1234567912 </p>
    </div>

    `,
    " 责任人及电话：2",
    " 责任人及电话：3",
    " 责任人及电话：4",
    " 责任人及电话：5",
    " 责任人及电话：6",
    " 责任人及电话：7",
    " 责任人及电话：8",
    " 责任人及电话：9",
    " 责任人及电话：11",
    " 责任人及电话：12",
    " 责任人及电话：13",
    " 责任人及电话：14",
    " 责任人及电话：15",
    " 责任人及电话：16",
    " 责任人及电话：17",
    " 责任人及电话：18",
    " 责任人及电话：19",
    " 责任人及电话：20",
    " 责任人及电话：21",
    " 责任人及电话：22",
    " 责任人及电话：23",
    " 责任人及电话：24",
    " 责任人及电话：25"
];
for (var i = 0; i < 25; i ++) {
    var point = new BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.8));
    //添加窗口
    var opts = {
        width : 200,     // 信息窗口宽度
        height: 150,     // 信息窗口高度
        title : "【终端箱】" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
        }
    var infoWindow = new BMap.InfoWindow(msg[i], opts);  // 创建信息窗口对象 
    addMarker(point,infoWindow,p_statu[i]);
}



//添加控件
map.addControl(new BMap.NavigationControl());   //添加控件
var opt1 = {anchor :BMAP_ANCHOR_BOTTOM_RIGHT }
map.addControl(new BMap.ScaleControl(opt1));    //比例尺
