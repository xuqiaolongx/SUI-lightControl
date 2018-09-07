
//默认请求的端口
var Allurl='http://219.135.191.211:8081';

//秘钥
var Allappsecret='1c4q8h';
    
//默认定位的城市
var Allcity='广东 广州 天河区';

//定时更新
var mapTime=30000;//地图
var uiTime=10000;//运行界面

var AllLightNum=8;//configType小于多少的是不同类型的等


//我的ajax
function myAjax(obj){
    //obj.url -- obj.data -- obj.callBack
    var target='/StreetLightServer/api/app'+obj.url,
        data=obj.data?obj.data+`&timestamp=${new Date().getTime()}`:`timestamp=${new Date().getTime()}`;
        hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
        sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
    jQuery.ajax({
        type:'post',
        url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
        dataType:'json',
        error:function(){console.log("错误!")}
    }).then((data)=>{
        obj.callBack(data)
    })
}

