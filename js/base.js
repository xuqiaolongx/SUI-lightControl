function my_alert(msg) {
    var time = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2000;

    var $tar = $("#alert");
    $tar.html(msg).show().delay(time).slideUp(100);
}

// 下面都是ajax的案例--------------------------

// myAjax({
//     "url":"/terminalBoxHistoryData/queryList.do",
//     "data":`createTimeFrom=${operationTimeFrom}&createTimeTo=${operationTimeTo}&terminalBoxNo=${BoxNo}&pageIndex=${1}&pageSize=${AllpageSize}`,
//     "callBack":function(res){
//         console.log(res)
//     }
// })