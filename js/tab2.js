
function checkA(){
    var time=6000,num=0;
    var timer=setInterval(()=>{
        if(num>=3){
            window.clearInterval(timer);
            timer=null;
            return;
        }
        num++;
        console.log(num)
        var target='/StreetLightServer/api/app/terminalBoxControl/remoteSwitchLight.do',
            data=`userAccount=${localStorage.getItem('uname')}&userId=${localStorage.getItem('uInfoId')}&terminalBoxNos=${BoxNo}&controlType=${0}&lightTypes=${0}&pageIndex=${0}&pageSize=${0}&timestamp=${new Date().getTime()}`;
            hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
            sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
            console.log(data)
        jQuery.ajax({
            type:'post',
            url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
            dataType:'json',
            error:function(){console.log("错误!")}
        }).then((data)=>{
            console.log(data);
            $.toast(data.msg);
            if(data.resultCode==0006){
                window.clearInterval(timer);
                timer=null;
            }
        })
    },time)
}
// 列表显示更多文字
$("#tab").on("click",'.show-more',function(e){
    $(e.target).toggleClass("show-more");
})
// 初始化时间picker组件,为当天和前两天
    var curDate = new Date(),
        preDate = new Date(curDate.getTime() - 24*60*60*1000*2);//两天前的时间

        curmonth=(curDate.getMonth()+1)<10?'0'+(curDate.getMonth()+1):(curDate.getMonth()+1);
        curday=curDate.getDate()<10?'0'+curDate.getDate():curDate.getDate();
        premonth=(preDate.getMonth()+1)<10?'0'+(preDate.getMonth()+1):(preDate.getMonth()+1);
        preday=preDate.getDate()<10?'0'+preDate.getDate():preDate.getDate();

    var curdayArr=[curDate.getFullYear(),curmonth,curday],
        predayArr=[preDate.getFullYear(),premonth,preday];

    // 初始化picker的input键
    $("#op-btime").datetimePicker({
        value: [predayArr[0],predayArr[1],predayArr[2], '0', '00']
    });
    $("#op-otime").datetimePicker({
        value: [curdayArr[0],curdayArr[1],curdayArr[2], '0', '00']
    });
    $("#al-btime").datetimePicker({
        value:  [predayArr[0],predayArr[1],predayArr[2], '0', '00']
    });
    $("#al-otime").datetimePicker({
        value: [curdayArr[0],curdayArr[1],curdayArr[2], '0', '00']
    });
    //操作记录用户列表
    myAjax({
        "url":"/userInfo/queryList.do",
        "data":"pageIndex=1&pageSize=200",
        "callBack":function(res){
            var user=["全部"];
            for(var p of res.response){
                user.push(p.userName+"/"+p.account)
            }
            $("#op-user").picker({
                toolbarTemplate: `<header class="bar bar-nav">
                <button class="button button-link pull-right close-picker">确定</button>
                <h1 class="title">选择用户</h1>
                </header>`,
                cols: [{
                    textAlign: 'center',
                    values: user
                }]
            });
        }
    })



// 1-终端管理----------------------------
    $('.configManage').on("click",function(e){
        if(BoxNo==''){ $.alert('你还未选择终端!', function () { $.openPanel("#my-menu");});return;}
        myAjax({
            "url":"/terminalBox/queryConfiguration.do",
            "data":`terminalBoxNo=${BoxNo}`,
            "callBack":function(data){
                console.log(data);
                if(data.resultCode!='0000'){ $.alert('所选的终端,查询发生了错误!');return;}
                // tab1------------
                var tab1=data.response.terminalBoxBasicJson;
                var html1=`
                    <ul class="list-block">
                        <li>
                            <div class="item-content">
                                <div class="item-title label">终端编号</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.terminalBoxNo}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">终端名称</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.terminalBoxName}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">道路名称</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.roadName}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">道路位置坐标</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.roadLocation}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">片区名称</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.areaName}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">东经</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.eastLongitude}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">北纬</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.northLatitude}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">联系电话及责任人</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.phoneNo}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">装变容量(KVA)</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.volume}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">额定电流(A)</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.ratedElectricity}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">开关路数(路)</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.pathNum}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">点参数上传间隔(秒)</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.intervalTime}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">电流互感器变比</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.currentTransformerRatio}">
                                </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="item-content">
                                <div class="item-title label">响应时长(秒)</div>
                                <div class="item-input">
                                    <input type="text" value="${tab1.alarmBellDuration}">
                                </div>
                                </div>
                            </div>
                        </li>
                    </ul>`;
                $('#manage1 .content-block').html(html1);
                // tab2-----------
                var tab2_a=data.response.alarmTransformerJson,
                    tab2_b=[]
                    tab2_c=data.response.alarmWaterEnterJson,
                    tab2_d=data.response.alarmZoneInfraredJson,
                    tab2_e=data.response.alarmPowerJson.listPowerStatusJson,
                    tab2_f=data.response.alarmPhaseLossJson.listPhaseLossJson;
                for(var p of data.response.alarmDoorJson.listDoorJson){
                    for(var i=0;i<2;i++){
                        for(var u=0;u<3;u++){
                            if(p.doorType==i&&p.doorStatus==u){
                                var alarmContent=p.alarmContent,
                                    needCheck=p.needCheck,
                                    a={'alarmContent':alarmContent,'needCheck':needCheck};
                                    tab2_b.push(a)
                            }
                        }
                    }
                }
                var html2=`
                    <ul class="list-block">
                        <li class="list_t">变压器温度</li>
                        <li class="list_d">
                            <div class="item-content">
                                <div class="item-title label">报警温度(℃)</div>
                                <div class="item-input">
                                    <input type="text" value="${tab2_a.temperatureValue}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">报警内容</div>
                                <div class="item-input">
                                    <input type="text" value="${tab2_a.alarmContent}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">是否检测</div>
                                <div class="item-input">
                                    <input type="text" value="${tab2_a.needCheck==1?'是':'否'}">
                                </div>
                            </div>
                        </li>
                        <li class="list_t">箱门报警</li>
                        <li class="list_d">
                            <ul style=" padding-left: 25px;">
                                <li class="list_t a">前门</li>
                                <li class="list_d">
                                    <ul style=" padding-left: 25px;">
                                        <li  class="list_t b">正常开门</li>
                                        <li class="list_d">
                                            <div class="item-content">
                                                <div class="item-title label">报警内容</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[0].alarmContent}">
                                                </div>
                                            </div>
                                            <div class="item-content">
                                                <div class="item-title label">是否检测</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[0].needCheck==1?'是':'否'}">
                                                </div>
                                            </div>
                                        </li>
                                        <li  class="list_t b">非正常开门</li>
                                        <li class="list_d">
                                            <div class="item-content">
                                                <div class="item-title label">报警内容</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[1].alarmContent}">
                                                </div>
                                            </div>
                                            <div class="item-content">
                                                <div class="item-title label">是否检测</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[1].needCheck==1?'是':'否'}">
                                                </div>
                                            </div>
                                        </li>
                                        <li  class="list_t b">关门</li>
                                        <li class="list_d">
                                            <div class="item-content">
                                                <div class="item-title label">报警内容</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[2].alarmContent}">
                                                </div>
                                            </div>
                                            <div class="item-content">
                                                <div class="item-title label">是否检测</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[2].needCheck==1?'是':'否'}">
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                                <li class="list_t a">后门</li>
                                <li class="list_d">
                                    <ul>
                                        <li  class="list_t b">正常开门</li>
                                        <li class="list_d">
                                            <div class="item-content">
                                                <div class="item-title label">报警内容</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[3].alarmContent}">
                                                </div>
                                            </div>
                                            <div class="item-content">
                                                <div class="item-title label">是否检测</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[3].needCheck==1?'是':'否'}">
                                                </div>
                                            </div>
                                        </li>
                                        <li  class="list_t b">非正常开门</li>
                                        <li class="list_d">
                                            <div class="item-content">
                                                <div class="item-title label">报警内容</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[4].alarmContent}">
                                                </div>
                                            </div>
                                            <div class="item-content">
                                                <div class="item-title label">是否检测</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[4].needCheck==1?'是':'否'}">
                                                </div>
                                            </div>
                                        </li>
                                        <li  class="list_t b">关门</li>
                                        <li class="list_d">
                                            <div class="item-content">
                                                <div class="item-title label">报警内容</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[5].alarmContent}">
                                                </div>
                                            </div>
                                            <div class="item-content">
                                                <div class="item-title label">是否检测</div>
                                                <div class="item-input">
                                                    <input type="text" value="${tab2_b[5].needCheck==1?'是':'否'}">
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li class="list_t">进水报警</li>
                        <li class="list_d">
                            <div class="item-content">
                                <div class="item-title label">报警内容</div>
                                <div class="item-input">
                                    <input type="text" value="${tab2_c.alarmContent}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">是否检测</div>
                                <div class="item-input">
                                    <input type="text" value="${tab2_c.needCheck==1?'是':'否'}">
                                </div>
                            </div>
                        </li>
                        <li class="list_t">防区红外线报警</li>
                        <li class="list_d">
                            <div class="item-content">
                                <div class="item-title label">报警内容</div>
                                <div class="item-input">
                                    <input type="text" value="${tab2_d.alarmContent}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">是否检测</div>
                                <div class="item-input">
                                    <input type="text" value="${tab2_d.needCheck==1?'是':'否'}">
                                </div>
                            </div>
                        </li>
                        <li class="list_t">停电/恢复供电</li>
                        <li class="list_d">
                            <ul style=" padding-left: 25px;">
                                <li  class="list_t a">正常停电</li>
                                <li class="list_d">
                                    <div class="item-content">
                                        <div class="item-title label">报警内容</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_e[0].alarmContent}">
                                        </div>
                                    </div>
                                    <div class="item-content">
                                        <div class="item-title label">是否检测</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_e[0].needCheck==1?'是':'否'}">
                                        </div>
                                    </div>
                                </li>
                                <li  class="list_t a">非正常停电</li>
                                <li class="list_d">
                                    <div class="item-content">
                                        <div class="item-title label">报警内容</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_e[1].alarmContent}">
                                        </div>
                                    </div>
                                    <div class="item-content">
                                        <div class="item-title label">是否检测</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_e[1].needCheck==1?'是':'否'}">
                                        </div>
                                    </div>
                                </li>
                                <li  class="list_t a">恢复供电</li>
                                <li class="list_d">
                                    <div class="item-content">
                                        <div class="item-title label">报警内容</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_e[2].alarmContent}">
                                        </div>
                                    </div>
                                    <div class="item-content">
                                        <div class="item-title label">是否检测</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_e[2].needCheck==1?'是':'否'}">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                        <li class="list_t">缺相</li>
                        <li class="list_d">
                            <ul style=" padding-left: 25px;">
                                <li  class="list_t a">A相</li>
                                <li class="list_d">
                                    <div class="item-content">
                                        <div class="item-title label">报警内容</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_f[0].alarmContent}">
                                        </div>
                                    </div>
                                    <div class="item-content">
                                        <div class="item-title label">是否检测</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_f[0].needCheck==1?'是':'否'}">
                                        </div>
                                    </div>
                                </li>
                                <li  class="list_t a">B相</li>
                                <li class="list_d">
                                    <div class="item-content">
                                        <div class="item-title label">报警内容</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_f[1].alarmContent}">
                                        </div>
                                    </div>
                                    <div class="item-content">
                                        <div class="item-title label">是否检测</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_f[1].needCheck==1?'是':'否'}">
                                        </div>
                                    </div>
                                </li>
                                <li  class="list_t a">C相</li>
                                <li class="list_d">
                                    <div class="item-content">
                                        <div class="item-title label">报警内容</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_f[2].alarmContent}">
                                        </div>
                                    </div>
                                    <div class="item-content">
                                        <div class="item-title label">是否检测</div>
                                        <div class="item-input">
                                            <input type="text" value="${tab2_f[2].needCheck==1?'是':'否'}">
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>`;
                $('#manage2 .content-block').html(html2);
        
                var tab3=data.response.listPathLineJson;
                var html3=` <ul class="list-block">`;
                for(var p of data.response.listPathLineJson){
                    var OptionHtml='';
                    for(var o of AllconfigType){
                        OptionHtml+=`<option value='0' ${p.lightType==o.configType?'selected':''}>${o.configData1}</option>`
                    }
                    OptionHtml.length==0?"OptionHtml+='<option>无数据</option>'":''
                    html3+=
                    `<li class="list_t">${p.cableFaultContent.slice(0,-4)}</li>
                    <li class="list_d">
                        <ul style=" padding-left: 25px;">
                            <div class="item-content">
                                <div class="item-title label">类型</div>
                                <div class="item-input">
                                    <select>${OptionHtml}</select>
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">控制回路名称</div>
                                <div class="item-input">
                                    <input type="text" value="${p.pathLineName}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">使用状态</div>
                                <div class="item-input">
                                    <input type="text" value="${p.useStatus==0?"停用":(p.useStatus==1?'启用':'备用')}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">电流互感器变比</div>
                                <div class="item-input">
                                    <input type="text" value="${p.currentTransformerRatio}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">接触器不吸合报警内容</div>
                                <div class="item-input">
                                    <input type="text" value="${p.contactsNotTouchFaultContent}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">接触器不释放报警内容</div>
                                <div class="item-input">
                                    <input type="text" value="${p.contactsNotReleaseFaultContent}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">接触器检测</div>
                                <div class="item-input">
                                    <input type="text" value="${p.contactsFaultCheck==1?'是':'否'}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">断缆报警内容</div>
                                <div class="item-input">
                                    <input type="text" value="${p.cableFaultContent}">
                                </div>
                            </div>
                            <div class="item-content">
                                <div class="item-title label">线缆检测</div>
                                <div class="item-input">
                                    <input type="text" value="${p.cableFaultCheck==1?'是':'否'}">
                                </div>
                            </div>`;
                        for(var b of p.listElectricalPhaseJson){
        
                            html3+=`<li  class="list_t a">${b.electricalPhaseType==1?'A相':(b.electricalPhaseType==2?'B相':'C相')}</li>
                            <li class="list_d" style="padding-left:10px;">
                                <div class="item-content">
                                    <div class="item-title label">电流底限值(A)</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.currentLowValue}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">电流高限值(A)</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.currentHighValue}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">电流参考值(A)</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.currentReferenceValue}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">电压底限值(V)</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.voltageLowValue}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">电压高限值(V)</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.voltageHighValue}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">电压参考值(V)</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.voltageReferenceValue}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">实际路灯数(盏)</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.streetLightNum}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">欠流报警内容</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.currentLowFaultContent}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">过流报警内容</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.currentHighFaultContent}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">电流检测</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.currentFaultCheck==1?'是':'否'}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">欠压报警内容</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.voltageLowFaultContent}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">过压报警内容</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.voltageHighFaultContent}">
                                    </div>
                                </div>
                                <div class="item-content">
                                    <div class="item-title label">电压检测</div>
                                    <div class="item-input">
                                        <input type="text" value="${b.voltageFaultCheck==1?'是':'否'}">
                                    </div>
                                </div>
                            </li>`
                        }
                    html3+=`</ul></li>`;
                }
                html3+=`</ul>`;
                $('#manage3 .content-block').html(html3);
        
                jQuery('.popup-configManage  .list_d').slideUp();
                $.popup('.popup-configManage');
            }
        });  
    })
    jQuery(".popup-configManage").on("click",'.list_t',function () {
        jQuery('.popup-configManage  .list_d').stop();
        jQuery(this).siblings(".popup-configManage  .list_t").removeAttr("data-up");
        if(jQuery(this).attr("data-up")=="open"){
            jQuery(this).removeAttr("data-up").siblings(".popup-configManage  .list_d").slideUp(150);
        }else{
            jQuery(this).attr("data-up","open").next().slideDown(150).siblings(".popup-configManage  .list_d").slideUp();
        }
    });
// 1-运行界面------------------------
    //定时请求
    var isOpenconfigUI=false;
    setInterval(()=>{
        if(isOpenconfigUI){
            jQuery('.configUI').click();
        }
    },uiTime)
    // 关闭窗口,关掉循环
    jQuery('.popup-configUI .close-popup').click(()=>{
        isOpenconfigUI=false;
    })
    //点击进入
    jQuery('.configUI').on("click",function(e){
        if(BoxNo==''){$.alert('你还未选择终端!', function () { $.openPanel("#my-menu");});return;}

        isOpenconfigUI=true;
        var target='/StreetLightServer/api/app/terminalBox/queryRealTimeData.do',
            data=`terminalBoxNo=${BoxNo}&timestamp=${new Date().getTime()}`;
            hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
            sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
        jQuery.ajax({
            type:'post',
            url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
            dataType:'json',
            error:function(){console.log("错误!")}
        }).then((data)=>{
            console.log(data);
            if(data.resultCode=='0006'){ $.alert('所选的终端没有数据!');return;}
            if(data.resultCode!='0000'){ $.alert('所选的终端,查询发生了错误!');return;}
            var msg=data.response,box=data.response.alarmRealTimeDataJson;
            var html=`
                <div class="UItitle">
                    <p style="color:${msg.onLineStatus==1?'gray':(msg.onLineStatus==0?'green':'red')}">终端编号:${BoxNo}</p>
                    <p style="color:${msg.onLineStatus==1?'gray':(msg.onLineStatus==0?'green':'red')}">终端名称:${msg.terminalBoxName}</p>
                </div>
                <table class="table1 gridtable">
                    <tr>
                        <th>参数</th>
                        <th class='ax'>A相输入</th>
                        <th class='bx'>B相输入</th>
                        <th class='cx'>C相输入</th>
                    </tr>
                    <tr>
                        <td>电压(V)</td>
                        <td class='ax'>${msg.totalInputAVoltage}</td>
                        <td class='bx'>${msg.totalInputBVoltage}</td>
                        <td class='cx'>${msg.totalInputCVoltage}</td>
                    </tr>
                    <tr>
                        <td>电流(A)</td>
                        <td class='ax'>${msg.totalInputACurrent}</td>
                        <td class='bx'>${msg.totalInputBCurrent}</td>
                        <td class='cx'>${msg.totalInputCCurrent}</td>
                    </tr>
                </table>
                <table class="table2 gridtable">
                    <tr>
                        <th>参数</th>
                        <th>数值</th>
                        <th>单位</th>
                    </tr>
                    <tr>
                        <td>有功读数</td>
                        <td>${msg.activeReading}</td>
                        <td>KW·H</td>
                    </tr>
                    <tr>
                        <td>无功读数</td>
                        <td>${msg.reactiveReading}</td>
                        <td>KW·H</td>
                    </tr>
                    <tr>
                        <td>有功功率</td>
                        <td>${msg.activePower}</td>
                        <td>KW</td>
                    </tr>
                    <tr>
                        <td>无功功率</td>
                        <td>${msg.reactivePower}</td>
                        <td>KVar</td>
                    </tr>
                    <tr>
                        <td>功率因素</td>
                        <td>${msg.powerFactor}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>视在因素</td>
                        <td>${msg.inspectPower}</td>
                        <td>KVA</td>
                    </tr>
                </table>
                <table class="table3 gridtable">
                    <tr>
                        <td>前门状态</td>
                        <td>${msg.frontDoorStatus=='0'?'关':'开'}</td>
                    </tr>
                    <tr>
                        <td>后门状态</td>
                        <td>${msg.backDoorStatus=='0'?'关':'开'}</td>
                    </tr>
                    <tr>
                        <td>布放状态</td>
                        <td>${msg.armStatus=='0'?'布防':'撤防'}</td>
                    </tr>
                    <tr>
                        <td>总灯数</td>
                        <td>${msg.totalLightNum}</td>
                    </tr>
                    <tr>
                        <td>应亮灯数</td>
                        <td>${msg.shouldLightNum}</td>
                    </tr>
                    <tr>
                        <td>实际亮灯数</td>
                        <td>${msg.actualLightNum}</td>
                    </tr>
                    <tr>
                        <td>亮灯率</td>
                        <td>${msg.lightRatio}</td>
                    </tr>
                    <tr>
                        <td>上传时间</td>
                        <td>${msg.updateTime}</td>
                    </tr>

                </table>
                <div class="way">
                    <div class='div'>
                        <button class="mybutton-success ui-button allopen">全开</button>
                        <button class="mybutton-success ui-button allclose">全关</button>
                        <button class="mybutton-success ui-button f5">刷新</button>
                    </div>
                </div>
                <div class="uiparent">
                    <p>总输入漏电电流: <span>${msg.leakCurrent}A</span></p>
                </div>`;
                // <div class="way">
                //     <div class='div'>
                //         <button class="mybutton-success ui-button">全开</button>
                //         <button class="mybutton-success ui-button">全闭</button>
                //         <button class="mybutton-success ui-button">刷新</button>
                //         <button class="mybutton-success ui-button">电表读数</button>
                //         <br>
                //         <button class="mybutton-success ui-button">撤防</button>
                //         <button class="mybutton-success ui-button">布防</button>
                //         <button class="mybutton-success ui-button">查询</button>
                //     </div>
                // </div>
            // 计算出循环的路数
            for(var v of AllpathNum){
                if(v.terminalBoxNo==msg.terminalBoxNo){
                    var my_pathNum=Number(v.pathNum);
                }
            }
            // 循环
            for(var i=0;i<my_pathNum;i++){
                var sta=msg.listPathLineRealTimeDataJson[i].contactsStatus,
                    Usta=msg.listPathLineRealTimeDataJson[i].useStatus,
                    abc=msg.listPathLineRealTimeDataJson[i].listElectricalPhaseRealTimeDataJson,
                    my_lightType='';
                for(var o of AllconfigType){
                    if(o.configType==msg.listPathLineRealTimeDataJson[i].lightType){
                        my_lightType=o.configData1;
                    }
                }
                switch (sta) {
                    case '0': var staString='不吸合'; break;
                    case '1': var staString='不释放'; break;
                    case '2': var staString='吸合'; break;
                    case '3': var staString='释放'; break;
                }
                
                html+=`
                    <div class="uichild" ${sta==0||sta==1?"style='border:1px solid #be0f52'":''} >
                        <p>第${i+1}路--<span>${Usta==0?'停用':(Usta==1?'启用':'备用')}</span></p>
                        <p class="contactsStatus" ${sta==0||sta==1?"style='color:#be0f52'":''} > 
                            <span class="iconfont ${sta==2||sta==3?"icon-zhengchang":'icon-yichang'}"></span> ${staString}
                        </p>
                        <table class="table2 gridtable">
                            <tr>
                                <td>参数</td>
                                <td class='ax'>
                                    A相                
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="${Number(abc[0].voltage)>=180?'#icon-dengpao1':'#icon-dengpao2'}"></use>
                                    </svg>
                                </td>
                                <td class='bx'>
                                    B相
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="${Number(abc[1].voltage>=180)?'#icon-dengpao1':'#icon-dengpao2'}"></use>
                                    </svg>
                                </td>
                                <td class='cx'>
                                    C相
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="${Number(abc[2].voltage>=180)?'#icon-dengpao1':'#icon-dengpao2'}"></use>
                                    </svg>
                                </td>
                            </tr>
                            <tr>
                                <td rowspan='3'>参考值</td>
                                <td class='ax'>${abc[0].voltageReferenceValue}V</td>
                                <td class='bx'>${abc[1].voltageReferenceValue}V</td>
                                <td class='cx'>${abc[2].voltageReferenceValue}V</td>
                            </tr>
                            <tr>
                                <td class='ax'>${abc[0].currentReferenceValue}A</td>
                                <td class='bx'>${abc[1].currentReferenceValue}A</td>
                                <td class='cx'>${abc[2].currentReferenceValue}A</td>
                            </tr>
                            <tr>
                                <td class='ax'>${abc[0].streetLightNum}盏</td>
                                <td class='bx'>${abc[1].streetLightNum}盏</td>
                                <td class='cx'>${abc[2].streetLightNum}盏</td>
                            </tr>
                            <tr>
                                <td rowspan='3'>实测值</td>
                                <td class='ax'>${abc[0].voltage}V</td>
                                <td class='bx'>${abc[1].voltage}V</td>
                                <td class='cx'>${abc[2].voltage}V</td>
                            </tr>
                            <tr>
                                <td class='ax'>${abc[0].current}A</td>
                                <td class='bx'>${abc[1].current}A</td>
                                <td class='cx'>${abc[2].current}A</td>
                            </tr>
                            <tr>
                                <td class='ax'>${abc[0].lightNum}盏</td>
                                <td class='bx'>${abc[1].lightNum}盏</td>
                                <td class='cx'>${abc[2].lightNum}盏</td>
                            </tr>
                            <tr>
                                <td>亮灯率</td>
                                <td class='ax'>${abc[0].lightRatio}%</td>
                                <td class='bx'>${abc[1].lightRatio}%</td>
                                <td class='cx'>${abc[2].lightRatio}%</td>
                            </tr>
                        </table>   
                        <p class="bt">
                            <button class="mybutton-success ui-button" data-id='${i+1}'>开灯</button>
                            <button class="mybutton-red ui-button" data-id='${i+1}'>关灯</button>
                        </p>
                        <p class='msg'>亮灯:${msg.listPathLineRealTimeDataJson[i].lightTurnOnTime}     关灯:${msg.listPathLineRealTimeDataJson[i].lightTurnOffTime}</p>
                        <p class='msg'>${msg.listPathLineRealTimeDataJson[i].pathLineName}(${my_lightType})</p>
                    </div>
                    `;
            }
            // 加载
            $('.popup-configUI .content').html(html)
            $.popup('.popup-configUI');
        })
    })
    // 触发事件
    $(".popup-configUI").on("click",'.bt button',function(e){
        $.confirm('您确认执行此操作吗?',function () {
            var $tar=$(e.target);
            if($tar.hasClass('mybutton-success')){
                var controlType=1
            }else if($tar.hasClass('mybutton-red')){
                var controlType=2
            }else{
                var controlType=0
            }
            var pageIndex=0,pageSize=0;
            var target='/StreetLightServer/api/app/terminalBoxControl/switchLight.do',
            data=`userAccount=${localStorage.getItem('uname')}&userId=${localStorage.getItem('uInfoId')}&terminalBoxNos=${BoxNo}&controlType=${controlType}&pathLineNo=${$tar.data('id')}&pageIndex=${pageIndex}&pageSize=${pageSize}&timestamp=${new Date().getTime()}`;
            hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
            sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
            console.log(data)
        jQuery.ajax({
            type:'post',
            url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
            dataType:'json',
            error:function(){console.log("错误!")}
        }).then((data)=>{
            console.log(data);
            $.toast('指令已发出')
        })
        })
    })
    $(".popup-configUI").on("click",'.way button',function(e){
        var $tar=$(e.target);
        if($tar.hasClass('f5')){
            jQuery('.configUI').click();$.toast("刷新成功");return;
        }
        $.confirm('您确认执行此操作吗?',function () {
            if($tar.hasClass('allclose')){
                var pageIndex=0,pageSize=0;
                var target='/StreetLightServer/api/app/terminalBoxControl/switchLight.do',
                data=`userAccount=${localStorage.getItem('uname')}&userId=${localStorage.getItem('uInfoId')}&terminalBoxNos=${BoxNo}&controlType=2&pathLineNo=0&pageIndex=${pageIndex}&pageSize=${pageSize}&timestamp=${new Date().getTime()}`;
                hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
                sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
                console.log(data)
                jQuery.ajax({
                    type:'post',
                    url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
                    dataType:'json',
                    error:function(){console.log("错误!")}
                }).then((data)=>{
                    console.log(data);
                    $.toast('指令已发出')
                })
            }else if($tar.hasClass('allopen')){
                var pageIndex=0,pageSize=0;
                var target='/StreetLightServer/api/app/terminalBoxControl/switchLight.do',
                data=`userAccount=${localStorage.getItem('uname')}&userId=${localStorage.getItem('uInfoId')}&terminalBoxNos=${BoxNo}&controlType=1&pathLineNo=0&pageIndex=${pageIndex}&pageSize=${pageSize}&timestamp=${new Date().getTime()}`;
                hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
                sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
                console.log(data)
                jQuery.ajax({
                    type:'post',
                    url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
                    dataType:'json',
                    error:function(){console.log("错误!")}
                }).then((data)=>{
                    console.log(data);
                    $.toast('指令已发出')
                })
            }else{
                var controlType=0
            }
        })
    })

// 2-用户管理----------------------
    myAjax({
        "url":"/userInfo/queryList.do",
        "data":"pageIndex=1&pageSize=200",
        "callBack":function(res){
            console.log(res.response)
            if(res.resultCode==0005){
                $.toast('查询失败');return;
            }else if(res.resultCode==0006){
                $.toast('没有数据');return;
            }
            var html='',level=["高级管理员","中级管理员","初级管理员","一般用户"];
            for(var p of res.response){
                html+=`
                <li class="list_t">${p.userName}</li>
                <li class="list_d">
                    <div class="item-content">
                        <div class="item-title label">账号</div>
                        <div class="item-input">
                            <input type="text" value="${p.account}">
                        </div>
                    </div>
                    <div class="item-content">
                        <div class="item-title label">电话</div>
                        <div class="item-input">
                            <input type="text" value="${p.phoneNo}">
                        </div>
                    </div>
                    <div class="item-content">
                        <div class="item-title label">部门</div>
                        <div class="item-input">
                            <input type="text" value="${p.department}">
                        </div>
                    </div>
                    <div class="item-content">
                        <div class="item-title label">权限级别</div>
                        <div class="item-input">
                            <input type="text" value="${level[Number(p.level)]}">
                        </div>
                    </div>
                </li>`;
            }
            if(html==''){html+=`<li style="text-align:center;">没有数据</li>`}
            $(".popup-configUser .list-block").html(html)
            jQuery('.popup-configUser  .list_d').slideUp();
        }
    })
    // 点击伸缩事件
    jQuery(".popup-configUser").on("click",'.list_t',function () {
        jQuery('.popup-configUser  .list_d').stop();
        jQuery(this).siblings(".popup-configUser  .list_t").removeAttr("data-up");
        if(jQuery(this).attr("data-up")=="open"){
            jQuery(this).removeAttr("data-up").siblings(".popup-configUser  .list_d").slideUp(150);
        }else{
            jQuery(this).attr("data-up","open").next().slideDown(150).siblings(".popup-configUser  .list_d").slideUp();
        }
    });

// 2-遥控开关灯-----------------------
    // 主干道全夜灯---A  
    // 主干道半夜灯---B  
    // 节能灯---C
    // 高杆灯---D
    // 庭院灯---E
    // 公园灯---F
    // 草坪灯---G
    // 郊区灯---H
    $('.popup-remoteSwitchLight .linghtOn,.popup-remoteSwitchLight .linghtOff').on('click',function(e){
        $.confirm('您确认执行此操作吗?',function () {
            var $tar=$(e.target),
                controlType=0,
                lightTypes="",
                terminalBoxNos="",
                pageIndex=0,
                pageSize=50;
            // 修改controltype
            if($tar.hasClass('linghtOn')){
                controlType=1
            }else if($tar.hasClass('linghtOff')){
                controlType=2
            }
            //修改lighttypes
            var lightArr=[0,0,0,0,0,0,0,0];
            for(var i=0;i<8;i++){
                if(jQuery(".popup-remoteSwitchLight .check input:eq("+i+")").prop('checked')){
                    var a=i;
                    if(i==2){a=1}else if(i==1){a=2}
                    lightArr[a]=1;
                }
            }
            lightTypes=lightArr.join(';');
            //修改terminalBoxNos pageindex pagesize
            var boxString=$('.popup-remoteSwitchLight .config').html().slice(6);
            if(boxString=="还未选择"){
                $.alert('你还未选择终端!点击页面中的 “还未选择进行” 进行选择')
            }else{
                for(var i=0;i<=boxString.length;i+=300){
                    terminalBoxNos=boxString.slice(i,(i/300+1)*300-1)
                    pageIndex=(i/300)+1;
                    myAjax({
                        url:'/terminalBoxControl/remoteSwitchLight.do',
                        data:`userAccount=${localStorage.getItem('uname')}&userId=${localStorage.getItem('uInfoId')}&terminalBoxNos=${terminalBoxNos}&controlType=${controlType}&lightTypes=${lightTypes}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
                        callBack:function(data){
                            console.log(data);
                            $.toast('指令已发出')
                            // $.toast(data.msg); //指令已发出,请等待回传
                            if(data.resultCode=='0000'){
                                // ckeckA();
                            }
                        }
                    })
                }
            }
            

        });
    })
    $('.popup-remoteSwitchLight').on('click','.config',function(e){
        $.popup('.popup-treeList');
    })
    // 遥控开关灯的时间
    setInterval(()=>{
        var mydate=new Date(),
            weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
            week=weekday[mydate.getDay()],//获取当前星期几
            day=mydate.getFullYear()+"年"+mydate.getMonth()+"月"+mydate.getDate()+"日";//获取当前日期
            time=mydate.getHours()+":"
            +(mydate.getMinutes()<10?'0'+mydate.getMinutes():mydate.getMinutes())+":"
            +(mydate.getSeconds()<10?'0'+mydate.getSeconds():mydate.getSeconds()); //获取钟表时间
        $('.popup-remoteSwitchLight .Tday').html('当前时间：'+day+' '+week)
        $('.popup-remoteSwitchLight .Ttime').html(time)
    },1000)

// 2-开关灯时间设置
    function lightConfigFun(){
        myAjax({
            url:"/configInfo/queryList.do",
            data:'',
            callBack:function(data){
                var html='',
                    headerData='',//获取时间段的数据
                    map=[{
                        name:"时间段I",
                        target:"configData3",
                        lightOnType:"configData2",
                        lightOnTime:"configData3",
                        lightOffType:"configData4",
                        lightOffTime:"configData5"

                    },{
                        name:"时间段II",
                        target:"configData4",
                        lightOnType:"configData6",
                        lightOnTime:"configData7",
                        lightOffType:"configData8",
                        lightOffTime:"configData9"
                    },{
                        name:"时间段III",
                        target:"configData5",
                        lightOnType:"configData10",
                        lightOnTime:"configData11",
                        lightOffType:"configData12",
                        lightOffTime:"configData13"
                    }];
                //获取时间段的数据
                for(var p of data.response){
                    if(p.configType==11){headerData=p}
                }
                if(!headerData){
                    return;
                    $.alert("后台没有返回configType为11的数据!");
                }
                //组成HTML
                for(var i=0;i<3;i++){
                    var use=eval('headerData.'+map[i].target);
                    // console.log(headerData)
                    html+=`
                    <div class="card D${i}">
                    <div class="card-header">
                        <span>${map[i].name}</span>
                        <label class="label-checkbox item-content">
                                <input type="checkbox" name="my-checkbox" ${use==0?'checked':''}>
                                <div class="item-media"><i class="icon icon-form-checkbox" data-el="D${i}"></i></div>
                        </label>
                    </div><div class="card-content"><ul class="card-content-inner">`
                    for(var p of data.response){
                        if(p.configType<AllLightNum){
                            html+=`<li class="l-title">${p.configData1}</li>
                            <li class="light">
                                <span>开灯</span>
                                <select>
                                    <option>经纬开</option>
                                    <option selected>固定开</option>
                                </select>
                                <input type="time"  value="02:22">
                            </li>
                            <li class="light">
                                <span>关灯</span>
                                <select>
                                    <option selected>经纬开</option>
                                    <option>固定开</option>
                                </select>
                                <input type="time"  value="02:22">
                            </li>`;
                        }
                    }
                    html+=`</ul></div></div>`; //加上末尾
                }
                html+=`<div class="list-block">
                    <div class="item-content">
                        <div class="item-media"><i class="icon icon-form-name"></i></div>
                        <div class="item-inner">
                        <div class="item-title label">东经</div>
                        <div class="item-input">
                            <input type="number" value="${headerData.configData1}">
                        </div>
                        </div>
                    </div>
                    <div class="item-content">
                        <div class="item-media"><i class="icon icon-form-name"></i></div>
                        <div class="item-inner">
                        <div class="item-title label">北纬</div>
                        <div class="item-input">
                            <input type="number" value="${headerData.configData2}">
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="content-block">
                        <div class="row">
                        <div class="col-50"><a href="#" class="button button-big button-fill again">再次获取设置</a></div>
                        <div class="col-50"><a href="#" class="button button-big button-fill button-success">保存修改</a></div>
                        </div>
                    </div>`;
                $("#router-lightConfig .content").html(html);
                //slideUp功能
                jQuery("#router-lightConfig .card-content").slideUp()
            }
        })
    }
    lightConfigFun()
    //点击事件
    jQuery("#router-lightConfig").on('click','.card-header',(e)=>{
        var $tar=jQuery(e.target)
        console.log($tar)
        console.log($tar.hasClass('icon-form-checkbox'))
        if($tar.hasClass('card-header')){
            $tar.next().slideToggle(300)
        }
    });
    //两个点击按钮事件
    $("#router-lightConfig").on('click','.button-success',()=>{
        if($("#router-lightConfig .label-checkbox input:checked").length!=1){
            $.toast("请选择一个时间段");return;
        }else{
            $.toast("该功能还在完善中")
        }
    })
    $("#router-lightConfig").on('click','.again',()=>{
        lightConfigFun()
    })
// 2-操作记录-------------------------
    // 点击查询
    $(".popup-operation").on('click','.popup-search',function(){
        var a=$("#op-btime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var operationTimeFrom=a[0]+' '+a[1];
        var a=$("#op-otime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var operationTimeTo=a[0]+' '+a[1];

        var target='/StreetLightServer/api/app/operationRecord/queryList.do',
            data=`operationTimeFrom=${operationTimeFrom}&operationTimeTo=${operationTimeTo}&userAccount=${$("#op-user").val()=="全部"?"":$("#op-user").val().split("/")[1]}&pageIndex=1&pageSize=${AllpageSize}&timestamp=${new Date().getTime()}`;
            hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
            sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
        jQuery.ajax({
            type:'post',
            url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
            dataType:'json',
            error:function(){console.log("错误!")}
        }).then((data)=>{
            console.log(data)
            if(data.resultCode!='0000'){$.toast(data.msg);return;}
            $.toast("一共查询到"+data.totalNum+"条数据")
            var html='';
            for(var p of data.response){
                html+=`
                    <li>
                        <p class="time">
                            <i class="icon iconfont icon-lingxing"></i>
                            <span>${p.operationTime}</span>  
                        </p>
                        <p class="msg show-more">操作内容 : ${p.operationContent}</p> 
                        <p class="object show-more">操作对象 : ${p.operationObject}</p>
                        <div class="user clear">
                            <p><i class="icon iconfont icon-user"></i>用户名称 : ${p.userName}</p> 
                            <p><i class="icon iconfont icon-fl-shuju"></i>用户账号 : ${p.userAccount}</p> 
                        </div>
                    </li> `;
            }
            $('.popup-operation .op-list').html(html);
            if(data.totalNum>AllpageSize){
                $(".popup-operation .loadMore").show().attr("data-index",2);
                $(".popup-operation .loadAll").hide();
            }
        })

    })
    // 加载跟多事件
    $(".popup-operation").on('click','.loadMore',function(e){
        opLoadMore($(e.target).data('index'))
    })
    // 加载跟多函数
    function opLoadMore(pageIndex){
        var a=$("#op-btime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var operationTimeFrom=a[0]+' '+a[1];
        var a=$("#op-otime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var operationTimeTo=a[0]+' '+a[1];

        var target='/StreetLightServer/api/app/operationRecord/queryList.do',
            data=`operationTimeFrom=${operationTimeFrom}&operationTimeTo=${operationTimeTo}&userAccount=${$("#op-user").val()=="全部"?"":$("#op-user").val().split("/")[1]}&pageIndex=${pageIndex}&pageSize=${AllpageSize}&timestamp=${new Date().getTime()}`;
            hmacSHA1 = CryptoJS.HmacSHA1(target+'?'+data, Allappsecret),
            sign=encodeURIComponent(hmacSHA1.toString(CryptoJS.enc.Base64));
        jQuery.ajax({
            type:'post',
            url:Allurl+target+'?'+data+'&sign='+sign+'&token='+localStorage.getItem('token'),
            dataType:'json',
            error:function(){console.log("错误!")}
        }).then((data)=>{
            console.log(data)
            $(".popup-operation .loadMore").attr("data-index",pageIndex+1);
            var html='';
            for(var p of data.response){
                html+=`
                    <li>
                        <p class="time">
                            <i class="icon iconfont icon-lingxing"></i>
                            <span>${p.operationTime}</span>  
                        </p>
                        <p class="msg show-more">操作内容 : ${p.operationContent}</p> 
                        <p class="object show-more">操作对象 : ${p.operationObject}</p>
                        <div class="user clear">
                            <p><i class="icon iconfont icon-user"></i>用户名称 : ${p.userName}</p> 
                            <p><i class="icon iconfont icon-fl-shuju"></i>用户账号 : ${p.userAccount}</p> 
                        </div>
                    </li> `;
            }
            $('.popup-operation .op-list').append(html);
            if(data.totalNum<=AllpageSize*pageIndex){
                $(".popup-operation .loadMore").hide();
                $(".popup-operation .loadAll").show();
            }
        })
    }



// 3-报警记录-------------------------
    //点击进入
    $("#tab2 .pop-alert").on("click",function(e){
        if(BoxNo==''){ $.alert('你还未选择终端!', function () { $.openPanel("#my-menu");});return;}
        $.router.load("#router-alert");
    })
    //点击查询条件
    var alertArr=[
        {name:"箱门报警",value:false},
        {name:"红外报警",value:false},
        {name:"停电报警",value:false},
        {name:"电压报警",value:false},
        {name:"电流报警",value:false},
        {name:"缺相报警",value:false},
        {name:"断损报警",value:false},
        {name:"接触器报警",value:false},
        {name:"水浸报警",value:false},
        {name:"非时间段开关灯",value:false},
    ]
    $(".alertCheck").on('click',function(e){
        var html='<ul class="alertModle">'
        for(var p of alertArr){
            html+=`<li>
            <label class="label-checkbox item-content">
                <input type="checkbox" name="my-checkbox" ${p.value?"checked":""}>
                <div class="item-media"><i class="icon icon-form-checkbox"></i></div>
                <div class="item-inner">
                <div class="item-text">${p.name}</div>
                </div>
            </label>
            </li>`;
        }
        html+='</ul>'
        $.modal({
            afterText:html,
            buttons: [
              {
                text: '确定',
                onClick: function() {
                    for(var i=0,data=$(".alertModle input");i<data.length;i++){
                        alertArr[i].value=$(data[i]).attr('checked');
                    }
                    var msg="",arr=[];//要写入alertCheck input的字符串
                    for(var u=0;u<alertArr.length;u++){
                        if(alertArr[u].value){
                            msg+=alertArr[u].name+"|";
                            arr[u]=1
                        }else{
                            arr[u]=0
                        }
                    }
                    $(".alertCheck input").val(msg).attr("data-arr",arr.join(""))
                }
              },
              {
                text: '取消',
                close: true
              },
            ]
        })
    })
    //点击查询
    $(".popup-alert").on('click','.popup-search',function(){
        if($(".alertCheck input").data("arr")=='0'){
            $.toast("请选择查询条件");return;
        }
        var a=$("#al-btime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var operationTimeFrom=a[0]+' '+a[1];
        var a=$("#al-otime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var operationTimeTo=a[0]+' '+a[1];
        console.log($(".alertCheck input").data("arr"))
        myAjax({
            "url":"/alarmInfo/queryList.do",
            "data":`alarmType=${$(".alertCheck input").data("arr")}&alarmTimeFrom=${operationTimeFrom}&alarmTimeTo=${operationTimeTo}&terminalBoxNo=${BoxNo}&pageIndex=${1}&pageSize=${AllpageSize}`,
            "callBack":function(data){
                console.log(data)
                if(data.resultCode!='0000'){$.toast(data.msg);return;}
                $.toast("一共查询到"+data.totalNum+"条数据")
                var html='';
                for(var p of data.response){
                    html+=`
                        <li>
                            <p class="time">
                                <i class="icon iconfont icon-lingxing"></i>
                                <span>${alertArr[Number(p.alarmType)].name}</span>  
                            </p>
                            <p class="msg show-more">终端片区 : ${p.areaName}</p> 
                            <p class="msg show-more">终端道路 : ${p.roadName}</p> 
                            <p class="msg show-more">终端名称 : ${p.terminalBoxName}</p> 
                            <p class="msg show-more">报警时间 : ${p.beginTime}</p> 
                            <p class="object">报警内容 : ${p.content}</p>
                        </li> `;
                }
                $('.popup-alert .op-list').html(html);
                if(data.totalNum>AllpageSize){
                    $(".popup-alert .loadMore").show().attr("data-index",2);
                    $(".popup-alert .loadAll").hide();
                }
            }
        })
    })
    // 加载跟多事件
    $(".popup-alert").on('click','.loadMore',function(e){
        alLoadMore($(e.target).data('index'))
    })
    // 加载跟多函数
    function alLoadMore(pageIndex){
        var a=$("#al-btime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var alarmTimeFrom=a[0]+' '+a[1];
        var a=$("#al-otime").val().split(" ");
        a[1].length==4?a[1]="0"+a[1]+":00":a[1]+=":00";
        var alarmTimeTo=a[0]+' '+a[1];
        myAjax({
            "url":"/alarmInfo/queryList.do",
            "data":`alarmType=${$(".alertCheck input").data("arr")}&alarmTimeFrom=${alarmTimeFrom}&alarmTimeTo=${alarmTimeTo}&terminalBoxNo=${BoxNo}&pageIndex=${pageIndex}&pageSize=${AllpageSize}`,
            "callBack":function(data){
                console.log(data)
                $(".popup-alert .loadMore").attr("data-index",pageIndex+1);
                var html='';
                for(var p of data.response){
                    html+=`
                    <li>
                        <p class="time">
                            <i class="icon iconfont icon-lingxing"></i>
                            <span>报警类型：${alertArr[Number(p.alarmType)].name}</span>  
                        </p>
                        <p class="msg show-more">终端片区 : ${p.areaName}</p> 
                        <p class="msg show-more">终端道路 : ${p.roadName}</p> 
                        <p class="msg show-more">终端名称 : ${p.terminalBoxName}</p> 
                        <p class="msg show-more">报警时间 : ${p.beginTime}</p> 
                        <p class="object">暴击内容 : ${p.content}</p>
                    </li> `;
                }
                $('.popup-alert .op-list').append(html);
                if(data.totalNum<=AllpageSize*pageIndex){
                    $(".popup-alert .loadMore").hide();
                    $(".popup-alert .loadAll").show();
                }
            }
        })
    }
// 3-历史记录
    myAjax({
        url:"/terminalBoxHistoryData/queryList.do",
        data:'createTimeFrom=2018-09-03 00:00:00&createTimeTo=2018-09-05 00:00:00&terminalBoxId=""&pageIndex=1&pageSize=30',
        callBack:function(data){
            console.log(data)
            if(data.resultCode!='0000'){$.toast(data.msg);return;}
            // $.toast("一共查询到"+data.totalNum+"条数据")
            var html='';
            for(var p of data.response){
                var sta=data
                switch (sta) {
                    case '0': var staString='不吸合'; break;
                    case '1': var staString='不释放'; break;
                    case '2': var staString='吸合'; break;
                    case '3': var staString='释放'; break;
                }
                html+=`<li>
                    <p class="time">
                        <i class="icon iconfont icon-lingxing"></i>
                        <span>${p.terminalBoxName}</span>  
                    </p>
                    <p class="msg two">
                        <span>编号 : ${p.terminalBoxNo} </span>
                        <span>亮灯率 : ${p.lightRatio}%</span>
                    </p>
                    <p class="msg show-more">时间 : ${p.createTime}</p> 
                    <p class="msg show-more">片区/道路 : ${p.areaName+'/'+p.roadName}</p> 
                    <div class="slideup">
                    <p class="msg dian">总输入电压 : 
                        <span><i class="icon iconfont icon-dian c1"></i>A相电压:${p.voltage_A}V</span>
                        <span><i class="icon iconfont icon-dian c2"></i>B相电压:${p.voltage_B}V</span>
                        <span><i class="icon iconfont icon-dian c5"></i>C相电压:${p.voltage_C}V</span>
                    </p> 
                    <p class="msg dian">总输入电流 : 
                        <span><i class="icon iconfont icon-dian c1"></i>A相电流:${p.current_A}A</span>
                        <span><i class="icon iconfont icon-dian c2"></i>B相电流:${p.current_B}A</span>
                        <span><i class="icon iconfont icon-dian c5"></i>C相电流:${p.current_C}A</span>
                    </p>`;
                for(var i=1;i<=16;i++){
                    var sta=eval('p.contactsStatus_'+i);
                    switch (sta) {
                        case '0': var staString='不吸合'; break;
                        case '1': var staString='不释放'; break;
                        case '2': var staString='吸合'; break;
                        case '3': var staString='释放'; break;
                    }
                    html+=`<p class="msg">第${i}路 : 接触器状态:${staString}
                        <p class="msg dian">
                            <span><i class="icon iconfont icon-dian c1"></i>A相电流:${eval('p.current_A_'+i)}A</span>
                            <span><i class="icon iconfont icon-dian c2"></i>B相电流:${eval('p.current_B_'+i)}A</span>
                            <span><i class="icon iconfont icon-dian c5"></i>C相电流:${eval('p.current_C_'+i)}A</span>
                        </p> 
                    </p>`;
                }
                html+="</div></li>";       
            }
            $('#router-history .op-list').html(html);
            if(data.totalNum>AllpageSize){
                $(".popup-alert .loadMore").show().attr("data-index",2);
                $(".popup-alert .loadAll").hide();
            }
            jQuery("#router-history .slideup").slideUp();
        }
    })
    // 点击展示更多
    $("#router-history").on("click",".op-list li",(e)=>{
        jQuery(e.currentTarget).find(".slideup").slideToggle();
        console.log(jQuery(e.currentTarget).offset())
        // console.log(jQuery(e.currentTarget).scrollTop())
        // console.log($("#router-history .content").scrollTop())
    })

// 关闭侧栏后触发事件
$('#my-menu').on('closed',function(){
    // console.log(45645)
})



