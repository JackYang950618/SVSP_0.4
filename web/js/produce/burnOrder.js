
function getWeekDate() {
    //获取时间
    var obj = new Date();
    var year = obj.getFullYear();
    var month = obj.getMonth() + 1;
    var day = obj.getDate();
    if (day % 7 > 0) var a = 1; else a = 0;
    var week = parseInt(day / 7) + a;
    return year + "年" + month + "月" + day + "日";
}

//全选复选框
function allSelect() {
    var isChecked = $('#allSel').prop('checked');
    if (isChecked) $("input[name='select']").prop('checked', true);
    else $("input[name='select']").prop('checked', false);
}
//-----------------------------

var pretreatmentId = "";    //预处理单号
var num = 0;               //克隆行数
var burnOrderId = "";      //焚烧工单号
var i1 = 0;           //焚烧工单序号
/**
 * 设置预处理单列表数据
 */
function loadPretreatmentList() {
    i1 = 0;                         //刷新页面时重新计数
    //获取数据
    $.ajax({
        type: "POST",                       // 方法类型
        url: "loadPretreatmentList",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            if (result != undefined && result.status == "success") {
                console.log(result);
                setPretreatmentList(result.data);
            } else {
                console.log(result.message);
            }
        },
        error: function (result) {
            console.log("error: " + result);
            console.log("失败");
        }
    });
    setSeniorSelectedList1();
}

/**
 * 设置高级检索的下拉框数据
 */
function setSeniorSelectedList1() {
    //设置状态下拉框
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getPretreatmentStateList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            if (result != undefined) {
                var data = eval(result);
                // 高级检索下拉框数据填充
                var state1 = $("#search1-state");
                state1.children().remove();
                $.each(data.stateList, function (index, item) {
                    var option = $('<option />');
                    option.val(index);
                    option.text(item.name);
                    state1.append(option);
                });
                state1.get(0).selectedIndex = -1;
            } else {
                console.log("fail: " + result);
            }
        },
        error: function (result) {
            console.log("error: " + result);
        }
    });
}

/**
 * 设置预处理单数据
 * @param result
 */
function setPretreatmentList(result) {
    // 获取id为cloneTr的tr元素
    var tr = $("#clone1");
    tr.siblings().remove();
    var serialNumber = 0;
    $.each(result, function (index, item) {
        //已作废的数据不显示
        if(item.state.name === '已作废' || item.state.name === '已确认'){
            return true;
        }
        serialNumber++;
        // 克隆tr，每次遍历都可以产生新的tr
        var clonedTr = tr.clone();
        clonedTr.show();
        // 循环遍历cloneTr的每一个td元素，并赋值
        clonedTr.children("td").each(function (inner_index) {
            var obj = eval(item);
            // 根据索引为部分td赋值
            switch (inner_index) {
                case(1):
                    //序号
                    $(this).html(serialNumber);
                    break;
                case (2):
                    // 预处理单号
                    $(this).html(obj.id);
                    break;
                case (3):
                    // 状态
                    $(this).html(obj.state.name);
                    break;
                case (4):
                    // 创建日期
                    $(this).html(getDateStr(obj.creationDate));
                    break;
                case (5):
                    // 重量合计
                    $(this).html(obj.weightTotal);
                    break;
                case (6):
                    // 备注
                    $(this).html(obj.remarks);
                    break;
                case (7):
                    // 散装比例
                    $(this).html(obj.bulkProportion);
                    break;
                case (8):
                    // 残渣比例
                    $(this).html(obj.distillationProportion);
                    break;
                case (9):
                    // 废液比例
                    $(this).html(obj.wasteLiquidProportion);
                    break;
                case (10):
                    // 污泥比例
                    $(this).html(obj.sludgeProportion);
                    break;
                case(11):
                //预处理暂存点
            }
        });
        // 把克隆好的tr追加到原来的tr前面
        clonedTr.removeAttr("id");
        clonedTr.insertBefore(tr);
    });
    // 隐藏无数据的tr
    tr.hide();
}

/**
 * 获取预处理单号(双击)
 * @param item
 * @returns {string}
 */
function getPretreatmentId(item) {
    return item.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
}

/**
 * 获取预处理单号（单击）
 * @param item
 * @returns {*}
 */
function getPretreatmentId1(item) {
    return item.parentElement.parentElement.firstElementChild.nextElementSibling.nextElementSibling.innerHTML;
}


/**
 * 双击编辑暂存点位置
 * @param item
 */
function toUpdate1(item) {
    pretreatmentId = getPretreatmentId(item);
    showViewModal(pretreatmentId);
}

/**
 * 单击编辑暂存点位置
 * @param item
 */
function toUpdate(item) {
    pretreatmentId = getPretreatmentId1(item);
    showViewModal(pretreatmentId);
}

/**
 * 显示预处理单编辑模态框
 * @param id
 */
function showViewModal(id) {
    $(".newLine").remove();
    $.ajax({
        type: "POST",
        url: "getPretreatmentById",
        async: false,
        data: {
            id: id
        },
        dataType: "json",
        success: function (result) {
            if (result.status == "success") {
                //设置数据
                var data = eval(result.data);
                console.log(result);
                setViewPretreatmentClone(result.data);
                $("#view-pretreatmentId").text(data.id);
                $("#view-remarks").text(data.remarks);
                $("#view-weightTotal").text(data.weightTotal);
                $("#view-calorificTotal").text(data.calorificTotal);
                $("#view-ashPercentageTotal").text(data.ashPercentageTotal);
                $("#view-wetPercentageTotal").text(data.wetPercentageTotal);
                $("#view-volatileNumberTotal").text(data.volatileNumberTotal);
                $("#view-chlorinePercentageTotal").text(data.chlorinePercentageTotal);
                $("#view-sulfurPercentageTotal").text(data.sulfurPercentageTotal);
                $("#view-phTotal").text(data.phTotal);
                $("#view-phosphorusPercentageTotal").text(data.phosphorusPercentageTotal);
                $("#view-fluorinePercentageTotal").text(data.fluorinePercentageTotal);
                $("#view-distillationProportion").text(data.distillationProportion);
                $("#view-wasteLiquidProportion").text(data.wasteLiquidProportion);
                $("#view-sludgeProportion").text(data.sludgeProportion);
                $("#view-bulkProportion").text(data.bulkProportion);
                $("#view-crushingProportion").text(data.crushingProportion);
                $("#view-suspensionProportion").text(data.suspensionProportion);
            } else {
                alert(result.message);
            }
        },
        error: function (result) {
            console.log(result);
            alert("服务器异常!");
        }
    });
    $("#viewModal").modal('show');
}

/**
 * 为预处理编辑模态框设置克隆数据
 * @param result
 */
function setViewPretreatmentClone(result) {
    // 获取id为cloneTr的tr元素
    var tr = $("#viewClone");
    num = 0;
    $.each(result.pretreatmentItemList, function (index, item) {
        // 克隆tr，每次遍历都可以产生新的tr
        var clonedTr = tr.clone();
        clonedTr.show();
        //重设id
        console.log("num:" + num);
        clonedTr.children().find("input").each(function () {
            var id = $(this).prop('id');
            var newId = id.replace(/[0-9]\d*/, num + 1);
            $(this).prop('id', newId);
        });
        num++;
        // 循环遍历cloneTr的每一个td元素，并赋值
        clonedTr.children("td").each(function (inner_index) {
            var obj = eval(item);
            // 根据索引为部分td赋值
            switch (inner_index) {
                case (0):
                    // 序号
                    $(this).html(obj.serialNumber);
                    break;
                case (1):
                    // 产废单位
                    $(this).html(obj.produceCompanyName);
                    break;
                case (2):
                    // 指标要求及来源
                    $(this).html(obj.requirements);
                    break;
                case (3):
                    // 危废名称
                    $(this).html(obj.wastes.name);
                    break;
                case (4):
                    // 比例
                    $(this).html(obj.proportion);
                    break;
                case (5):
                    // 重量（吨）
                    $(this).html(obj.wastes.weight);
                    break;
                case (6):
                    // 危废热值
                    $(this).html(obj.wastes.calorific);
                    break;
                case (7):
                    // 灰分
                    $(this).html(obj.wastes.ashPercentage);
                    break;
                case (8):
                    // 水分
                    $(this).html(obj.wastes.wetPercentage);
                    break;
                case (9):
                    // 挥发份
                    $(this).html(obj.wastes.volatileNumber);
                    break;
                case (10):
                    // 氯
                    $(this).html(obj.wastes.chlorinePercentage);
                    break;
                case (11):
                    // 硫
                    $(this).html(obj.wastes.sulfurPercentage);
                    break;
                case (12):
                    // PH
                    $(this).html(obj.wastes.ph);
                    break;
                case (13):
                    // P
                    $(this).html(obj.wastes.phosphorusPercentage);
                    break;
                case (14):
                    // F
                    $(this).html(obj.wastes.fluorinePercentage);
                    break;
                case (15):
                    // 备注
                    $(this).html(obj.wastes.remarks);
                    break;
                case (16):
                    // 处置方式
                    $(this).html(obj.wastes.processWay.name);
                    break;
                case (17):
                    // 进料方式
                    $(this).html(obj.wastes.handleCategory.name);
                    break;
                case(18):
                    //预处理暂存地址
                    $(this).find("input").val(obj.temporaryAddress);
                    break;
            }
            // var $num = num + 1;
            // $("#view["+ $num +"]-temporaryAddress").text(obj.temporaryAddress);
        });
        // 把克隆好的tr追加到原来的tr前面
        clonedTr.addClass("newLine");
        clonedTr.removeAttr("id");
        clonedTr.insertBefore(tr);
    });
    // 隐藏无数据的tr
    tr.hide();
}

var pretreatmentIdArray = [];
/**
 * 添加焚烧工单
 */
function confirmInsert() {
// 定义焚烧工单，存储勾选预处理单
    $(".newLine").remove();
    var burnOrderList = [];
    pretreatmentIdArray = [];
    var currentId = parseInt(getCurrentBurnOrderId());
    // 遍历计划单表格行，获取勾选的计划列表
    $("#pretreatmentData").children().not("#clone1").each(function () {
        //检查焚烧单号是否存在
        $("#burnOrderData").children().not("#burnOrderClonedTr").each(function () {
            while(currentId.toString() === $(this).find("td[name='burnOrder-burnOrderId']").text()){
                currentId++;
            }
        });
        var isCheck = $(this).find("input[name='select']").prop('checked');
        if (isCheck) {
            var pretreatmentId1 = $(this).find("td[name='pretreatmentId']").text();
            if ($.inArray(pretreatmentId1, pretreatmentIdArray) == -1) {
                pretreatmentIdArray.push(pretreatmentId1);
                var burnOrder = {};
                burnOrder.id = currentId.toString();
                burnOrder.pretreatmentId = pretreatmentId1;
                burnOrder.weightTotal = $(this).find("td[name='weightTotal']").text();
                burnOrder.remarks = $(this).find("td[name='remarks']").text();
                burnOrder.bulkProportion = $(this).find("td[name='bulkProportion']").text();
                burnOrder.distillationProportion = $(this).find("td[name='distillationProportion']").text();
                burnOrder.wasteLiquidProportion = $(this).find("td[name='wasteLiquidProportion']").text();
                burnOrder.sludgeProportion = $(this).find("td[name='sludgeProportion']").text();
                burnOrder.state = "新建";
                burnOrder.creationDate = getWeekDate();
                burnOrderList.push(burnOrder);
                currentId++;
            }
        }
    });
    // 遍历js对象数组列表，循环增加条目列表
    for (var i = 0; i < burnOrderList.length; i++) {
        i1++;
        var tr = $("#burnOrderClonedTr");
        // 克隆tr，每次遍历都可以产生新的tr
        var clonedTr = tr.clone();
        clonedTr.show();
        // 循环遍历cloneTr的每一个td元素，并赋值
        var obj = eval(burnOrderList[i]);
        clonedTr.children("td").each(function (inner_index) {
            // 根据索引为部分td赋值
            switch (inner_index) {
                case (0):
                    //序号
                    $(this).html(i1);
                    break;
                case (1):
                    //焚烧工单号
                    $(this).html(obj.id);
                    break;
                case(2):
                    //预处理单号
                    $(this).html(obj.pretreatmentId);
                    break;
                case (3):
                    //状态
                    $(this).html(obj.state);
                    break;
                case (4):
                    //创建日期
                    $(this).html(obj.creationDate);
                    break;
                case (5):
                    //总重量
                    $(this).html(obj.weightTotal);
                    break;
                case (6):
                    //备注
                    $(this).html(obj.remarks);
                    break;
                case (7):
                    //散装比例
                    $(this).html(obj.bulkProportion);
                    break;
                case (8):
                    //残渣比例
                    $(this).html(obj.distillationProportion);
                    break;
                case (9):
                    //废液比例
                    $(this).html(obj.wasteLiquidProportion);
                    break;
                case (10):
                    //污泥比例
                    $(this).html(obj.sludgeProportion);
                    break;
            }
        });
        // 把克隆好的tr追加到原来的tr前面
        clonedTr.removeAttr("id");
        clonedTr.addClass("newLine");
        clonedTr.insertBefore(tr);
        tr.hide();
    }
}

/**
 * 将焚烧工单数据添加到数据库
 */
function save(){
    var res = false;
    $("#burnOrderData").children().not("#burnOrderClonedTr").each(function () {
        var burnOrder = {};
        burnOrder.id = $(this).find("td[name='burnOrder-burnOrderId']").text();
        burnOrder.pretreatmentId = $(this).find("td[name='burnOrder-pretreatmentId']").text();
        // //查询预处理单数据
        $.ajax({
            type: "POST",
            url: "getPretreatmentById",
            async: false,
            data: {
                id: burnOrder.pretreatmentId
            },
            dataType: "json",
            success: function (result) {
                if(result.status == "success"){
                    //将数据转移至焚烧工单数据库
                    var data = eval(result.data);
                    console.log("预处理单数据:");
                    console.log(data);
                    burnOrder.remarks = data.remarks;
                    burnOrder.weightTotal = data.weightTotal;
                    burnOrder.calorificTotal = data.calorificTotal;
                    burnOrder.ashPercentageTotal = data.ashPercentageTotal;
                    burnOrder.wetPercentageTotal = data.wetPercentageTotal;
                    burnOrder.volatileNumberTotal = data.volatileNumberTotal;
                    burnOrder.chlorinePercentageTotal = data.chlorinePercentageTotal;
                    burnOrder.sulfurPercentageTotal = data.sulfurPercentageTotal;
                    burnOrder.phTotal = data.phTotal;
                    burnOrder.phosphorusPercentageTotal = data.phosphorusPercentageTotal;
                    burnOrder.fluorinePercentageTotal = data.fluorinePercentageTotal;
                    burnOrder.distillationProportion = data.distillationProportion;
                    burnOrder.wasteLiquidProportion = data.wasteLiquidProportion;
                    burnOrder.sludgeProportion = data.sludgeProportion;
                    burnOrder.bulkProportion = data.bulkProportion;
                    burnOrder.crushingProportion = data.crushingProportion;
                    burnOrder.suspensionProportion = data.suspensionProportion;
                    var pretreatmentItemList = [];
                    for(var i = 0; i < data.pretreatmentItemList.length; i++){
                        var pretreatmentItem = {};
                      //  pretreatmentItem.itemId = data.pretreatmentItemList[i].itemId;
                        pretreatmentItem.pretreatmentId = data.pretreatmentItemList[i].pretreatmentId;
                        pretreatmentItem.serialNumber = data.pretreatmentItemList[i].serialNumber;
                        pretreatmentItem.produceCompanyName = data.pretreatmentItemList[i].produceCompanyName ;
                        pretreatmentItem.requirements = data.pretreatmentItemList[i].requirements ;
                        var wastes = {};
                        wastes.ph = data.pretreatmentItemList[i].wastes.ph;
                        wastes.ashPercentage = data.pretreatmentItemList[i].wastes.ashPercentage;
                        wastes.wetPercentage = data.pretreatmentItemList[i].wastes.wetPercentage;
                        wastes.calorific = data.pretreatmentItemList[i].wastes.calorific;
                        wastes.sulfurPercentage = data.pretreatmentItemList[i].wastes.sulfurPercentage;
                        wastes.chlorinePercentage = data.pretreatmentItemList[i].wastes.chlorinePercentage;
                        wastes.phosphorusPercentage = data.pretreatmentItemList[i].wastes.phosphorusPercentage;
                        wastes.fluorinePercentage = data.pretreatmentItemList[i].wastes.fluorinePercentage;
                        wastes.remarks = data.pretreatmentItemList[i].wastes.remarks;
                        wastes.weight = data.pretreatmentItemList[i].wastes.weight;
                        wastes.volatileNumber = data.pretreatmentItemList[i].wastes.volatileNumber;
                        wastes.handleCategory = data.pretreatmentItemList[i].wastes.handleCategory.index;
                        wastes.processWay = data.pretreatmentItemList[i].wastes.processWay.index - 1; // ?
                        wastes.name = data.pretreatmentItemList[i].wastes.name;
                        pretreatmentItem.wastes = wastes;
                        pretreatmentItem.proportion = data.pretreatmentItemList[i].proportion ;
                        pretreatmentItem.temporaryAddress = data.pretreatmentItemList[i].temporaryAddress ;
                        pretreatmentItemList.push(pretreatmentItem);
                    }
                    burnOrder.pretreatmentItemList = pretreatmentItemList;
                }else alert(result.message);
            },
            error:function (result) {
                console.log(result.message);
            }
        });
        //将焚烧工单数据插入到数据库
        console.log("焚烧工单数据：");
        console.log(burnOrder);
        $.ajax({
            type: "POST",
            url: "insertNewBurnOrder",
            async: false,
            data: JSON.stringify(burnOrder),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if(result.status == "success"){
                    console.log(result.message);
                    res = true;
                }else alert(result.message);
            },
            error:function (result) {
                console.log(result.message);
                res = false;
            }
        });
    });
    if(res === true){
        alert("焚烧工单添加成功！");
        window.location.href="burnOrderList.html";
    }else if (res === false){
        alert("焚烧工单添加失败！");
    }
}

/**
 * 添加预处理暂存点位置信息
 */
function addTemporaryAddress() {
    //遍历获取暂存点数据
    var pretreatment = {};
    pretreatment.id = pretreatmentId;
    var pretreatmentItemList= [];
    for(var i = 0; i < num ; i++){
        var $i = i + 1;
        var pretreatmentItem = {};
        pretreatmentItem.temporaryAddress = $("#view"+ $i +"-temporaryAddress").val();
        console.log("暂存点：" + $("#view"+ $i +"-temporaryAddress").val());
        pretreatmentItem.serialNumber = $i;
        pretreatmentItem.pretreatmentId = pretreatmentId;
        pretreatmentItemList.push(pretreatmentItem);
    }
    pretreatment.pretreatmentItemList = pretreatmentItemList;
    $.ajax({
        type: "POST",
        url: "updateTemporaryAddressById",
        async: false,
        data: JSON.stringify(pretreatment),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result.status == "success") {
                alert(result.message);

            } else {
                alert(result.message);
            }
        },
        error: function (result) {
            console.log(result);
            alert("服务器异常!");
        }
    });
}

/**
 * 获取当前焚烧工单编号
 */
function getCurrentBurnOrderId() {
    var id1 = "";
    $.ajax({
        type: "POST",
        url: "getCurrentBurnOrderId",
        async: false,
        dataType: "json",
        success: function (result) {
              id1 = result.id;
        },
        error: function (result) {
            alert("服务器异常!");
        }
    });
    return id1;
}

/**
 * 回车查询
 */
function enterSearch1(){
    if (event.keyCode === 13) {   // 如果按下键为回车键，即执行搜素
        search1();      //
    }
}

/**
 * 延时自动查询
 */
$(document).ready(function () {//页面载入是就会进行加载里面的内容
    var last;
    // 新增页面
    $('#searchContent1').keyup(function (event) { //给Input赋予onkeyup事件
        last = event.timeStamp;//利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
        setTimeout(function () {
            if(last-event.timeStamp=== 0){
                search1();
            }else if (event.keyCode === 13) {   // 如果按下键为回车键，即执行搜素
                search1();      //
            }
        },600);
    });
    // 主页
    $('#searchContent').keyup(function (event) { //给Input赋予onkeyup事件
        last = event.timeStamp;//利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
        setTimeout(function () {
            if(last-event.timeStamp=== 0){
                searchBurnOrder();
            }else if (event.keyCode === 13) {   // 如果按下键为回车键，即执行搜素
                searchBurnOrder();      //
            }
        },600);
    });
});

/**
 * 新增页面预处理单查询功能
 */
function search1() {
    isSearch = true;
    var state = null;
    if ($("#search1-state").val() == 0) state = "NewBuild";//新建
    if ($("#search1-state").val() == 1) state = "Confirm";//已确认
    if ($("#search1-state").val() == 2) state = "Invalid";//已作废
    if ($("#senior1").is(':visible')) {
        var data = {
            id: $.trim($("#search1-id").val()),
            startDate: $("#search1-startDate").val(),
            endDate: $("#search1-endDate").val(),
            remarks: $.trim($("#search1-remarks").val()),
            state: state
        };
    }else {
        var keywords = $.trim($("#searchContent1").val());
        switch (keywords){
            case("新建"): keywords = "NewBuild";break;
            case("已作废"): keywords = "Invalid";break;
            case("作废"): keywords = "Invalid";break;
            case("已确认"): keywords = "Confirm";break;
            case("确认"): keywords = "Confirm";break;
        }
        data={
            keywords: keywords
        }
    }
    if (data == null) alert("请点击'查询设置'输入查询内容!");
    else {
        $.ajax({
            type: "POST",                            // 方法类型
            url: "searchPretreatment",                 // url
            async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
                if (result.data != undefined || result.status == "success") {
                    setPretreatmentList(result.data);
                } else {
                    console.log(result.message);
                }
            },
            error: function (result) {
                console.log(result);
                alert("服务器错误！");
            }
        });
    }
}
/////////////////////焚烧工单列表页面/////////////////////////////////

var currentPage = 1;                          //当前页数
var isSearch = false;
var data1;

/**
 * 返回count值
 * */
function countValue() {
    var mySelect = document.getElementById("count");
    var index = mySelect.selectedIndex;
    return mySelect.options[index].text;
}

/**
 * 计算总页数
 * */
function totalPage() {
    var totalRecord = 0;
    if (!isSearch) {
        $.ajax({
            type: "POST",                       // 方法类型
            url: "totalBurnOrderRecord",                  // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            dataType: "json",
            success: function (result) {
                if (result > 0) {
                    totalRecord = result;
                } else {
                    console.log("fail: " + result);
                    totalRecord = 0;
                }
            },
            error: function (result) {
                console.log("error: " + result);
                totalRecord = 0;
            }
        });
    } else {
        $.ajax({
            type: "POST",                       // 方法类型
            url: "searchBurnOrderTotal",                  // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(data1),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                // console.log(result);
                if (result > 0) {
                    totalRecord = result;
                    console.log("总记录数为:" + result);
                } else {
                    console.log("fail: " + result);
                    totalRecord = 0;
                }
            },
            error: function (result) {
                console.log("error: " + result);
                totalRecord = 0;
            }
        });
    }
    var count = countValue();                         // 可选
    var total = loadPages(totalRecord, count);
    return total;
}

/**
 * 设置克隆页码
 * */
function setPageClone(result) {
    $(".beforeClone").remove();
    setBurnOrderList(result);
    var total = totalPage();
    $("#next").prev().hide();
    var st = "共" + total + "页";
    $("#totalPage").text(st);
    var myArray = new Array();
    for (var i = 0; i < total; i++) {
        var li = $("#next").prev();
        myArray[i] = i + 1;
        var clonedLi = li.clone();
        clonedLi.show();
        clonedLi.find('a:first-child').text(myArray[i]);
        clonedLi.find('a:first-child').click(function () {
            var num = $(this).text();
            switchPage(num);
            addAndRemoveClass(this);
        });
        clonedLi.addClass("beforeClone");
        clonedLi.removeAttr("id");
        clonedLi.insertAfter(li);
    }
    $("#previous").next().next().eq(0).addClass("active");       // 将首页页面标蓝
    $("#previous").next().next().eq(0).addClass("oldPageClass");

}

/**
 * 点击页数跳转页面
 * @param pageNumber 跳转页数
 * */
function switchPage(pageNumber) {
    console.log("当前页：" + pageNumber);
    if(pageNumber > totalPage()){
        pageNumber = totalPage();
    }
    if (pageNumber == 0) {                 //首页
        pageNumber = 1;
    }
    if (pageNumber == -2) {
        pageNumber = totalPage();        //尾页
    }
    if (pageNumber == null || pageNumber == undefined) {
        console.log("参数为空,返回首页!");
        pageNumber = 1;
    }
    $("#current").find("a").text("当前页：" + pageNumber);
    if (pageNumber == 1) {
        $("#previous").addClass("disabled");
        $("#firstPage").addClass("disabled");
        $("#next").removeClass("disabled");
        $("#endPage").removeClass("disabled");
    }
    if (pageNumber == totalPage()) {
        $("#next").addClass("disabled");
        $("#endPage").addClass("disabled");
        $("#previous").removeClass("disabled");
        $("#firstPage").removeClass("disabled");
    }
    if (pageNumber > 1) {
        $("#previous").removeClass("disabled");
        $("#firstPage").removeClass("disabled");
    }
    if (pageNumber < totalPage()) {
        $("#next").removeClass("disabled");
        $("#endPage").removeClass("disabled");
    }
    addPageClass(pageNumber);           // 设置页码标蓝
    var page = {};
    page.count = countValue();                        //可选
    page.pageNumber = pageNumber;
    currentPage = pageNumber;          //当前页面
    //addClass("active");
    page.start = (pageNumber - 1) * page.count;
    if (!isSearch) {
        $.ajax({
            type: "POST",                       // 方法类型
            url: "loadPageBurnOrderList",         // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(page),
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            success: function (result) {
                if (result != undefined) {
                    setBurnOrderList(result.data);
                } else {
                    console.log("fail: " + result);
                }
            },
            error: function (result) {
                console.log("error: " + result);
            }
        });
    } else {
        data['page'] = page;
        $.ajax({
            type: "POST",                       // 方法类型
            url: "searchBurnOrder",         // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(data1),
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            success: function (result) {
                if (result != undefined) {
                    // console.log(result);
                    setBurnOrderList(result.data);
                } else {
                    console.log("fail: " + result);
                }
            },
            error: function (result) {
                console.log("error: " + result);
            }
        });
    }
}

/**
 * 输入页数跳转页面
 * */
function inputSwitchPage() {
    var pageNumber = $("#pageNumber").val();    // 获取输入框的值
    $("#current").find("a").text("当前页：" + pageNumber);
    if(pageNumber > totalPage()){
        pageNumber = totalPage();
    }
    if (pageNumber == null || pageNumber == "") {
        window.alert("跳转页数不能为空！")
    } else {
        if (pageNumber == 1) {
            $("#previous").addClass("disabled");
            $("#firstPage").addClass("disabled");
            $("#next").removeClass("disabled");
            $("#endPage").removeClass("disabled");
        }
        if (pageNumber == totalPage()) {
            $("#next").addClass("disabled");
            $("#endPage").addClass("disabled");

            $("#previous").removeClass("disabled");
            $("#firstPage").removeClass("disabled");
        }
        if (pageNumber > 1) {
            $("#previous").removeClass("disabled");
            $("#firstPage").removeClass("disabled");
        }
        if (pageNumber < totalPage()) {
            $("#next").removeClass("disabled");
            $("#endPage").removeClass("disabled");
        }
        currentPage = pageNumber;
        addPageClass(pageNumber);           // 设置页码标蓝
        var page = {};
        page.count = countValue();//可选
        page.pageNumber = pageNumber;
        page.start = (pageNumber - 1) * page.count;
        if (!isSearch) {
            $.ajax({
                type: "POST",                       // 方法类型
                url: "loadPageBurnOrderList",         // url
                async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
                data: JSON.stringify(page),
                dataType: "json",
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    if (result != undefined) {
                        console.log(result);
                        setBurnOrderList(result.data);
                    } else {
                        console.log("fail: " + result);
                    }
                },
                error: function (result) {
                    console.log("error: " + result);
                }
            });
        } else {
            data1['page'] = page;
            $.ajax({
                type: "POST",                       // 方法类型
                url: "searchBurnOrder",         // url
                async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
                data: JSON.stringify(data1),
                dataType: "json",
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    if (result != undefined) {
                        // console.log(result);
                        setBurnOrderList(result.data);
                    } else {
                        console.log("fail: " + result);
                    }
                },
                error: function (result) {
                    console.log("error: " + result);
                }
            });
        }
    }
}

/**
 * 分页 获取首页内容
 * */
function loadPageBurnOrderList() {
    var pageNumber = 1;               // 显示首页
    $("#current").find("a").text("当前页：1");
    $("#previous").addClass("disabled");
    $("#firstPage").addClass("disabled");
    $("#next").removeClass("disabled");            // 移除上一次设置的按钮禁用
    $("#endPage").removeClass("disabled");
    if (totalPage() == 1) {
        $("#next").addClass("disabled");
        $("#endPage").addClass("disabled");
    }
    var page = {};
    page.count = countValue();                                 // 可选
    page.pageNumber = pageNumber;
    page.start = (pageNumber - 1) * page.count;
    $.ajax({
        type: "POST",                       // 方法类型
        url: "loadPageBurnOrderList",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(page),
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            if (result != undefined && result.status == "success") {
                console.log(result);
                setPageClone(result.data);
            } else {
                console.log(result.message);
            }
        },
        error: function (result) {
            console.log("error: " + result);
            console.log("失败");
        }
    });
    // 设置高级检索的下拉框数据
    setSeniorSelectedList();
    isSearch = false;


}

/**
 * 计算分页总页数
 * @param totalRecord
 * @param count
 * @returns {number}
 */
function loadPages(totalRecord, count) {
    if (totalRecord == 0) {
        console.log("总记录数为0，请检查！");
        return 0;
    }
    else if (totalRecord % count == 0)
        return totalRecord / count;
    else
        return parseInt(totalRecord / count) + 1;
}

function setBurnOrderList(result) {
    // 获取id为cloneTr的tr元素
    var tr = $("#clone");
    tr.siblings().remove();
    $.each(result, function (index, item) {
        // 克隆tr，每次遍历都可以产生新的tr
        var clonedTr = tr.clone();
        clonedTr.show();
        // 循环遍历cloneTr的每一个td元素，并赋值
        clonedTr.children("td").each(function (inner_index) {
            var obj = eval(item);
            // 根据索引为部分td赋值
            switch (inner_index) {
                case (1):
                    // 焚烧工单号
                    $(this).html(obj.id);
                    break;
                case (2):
                    // 状态
                    $(this).html(obj.state.name);
                    break;
                case (3):
                    // 创建日期
                    $(this).html(getDateStr(obj.creationDate));
                    break;
                case (4):
                    // 重量合计
                    $(this).html(obj.weightTotal);
                    break;
                case (5):
                    // 备注
                    $(this).html(obj.remarks);
                    break;
                case (6):
                    // 散装比例
                    $(this).html(obj.bulkProportion);
                    break;
                case (7):
                    // 残渣比例
                    $(this).html(obj.distillationProportion);
                    break;
                case (8):
                    // 废液比例
                    $(this).html(obj.wasteLiquidProportion);
                    break;
                case (9):
                    // 污泥比例
                    $(this).html(obj.sludgeProportion);
                    break;
            }
        });
        // 把克隆好的tr追加到原来的tr前面
        clonedTr.removeAttr("id");
        clonedTr.insertBefore(tr);
    });
    // 隐藏无数据的tr
    tr.hide();
}

/**
 * 设置高级检索的下拉框数据
 */
function setSeniorSelectedList() {
    //设置状态下拉框
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getPretreatmentStateList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            if (result != undefined) {
                var data = eval(result);
                // 高级检索下拉框数据填充
                var state = $("#search-state");
                state.children().remove();
                $.each(data.stateList, function (index, item) {
                    var option = $('<option />');
                    option.val(index);
                    option.text(item.name);
                    state.append(option);
                });
                state.get(0).selectedIndex = -1;
            } else {
                console.log("fail: " + result);
            }
        },
        error: function (result) {
            console.log("error: " + result);
        }
    });
}

/**
 * 导出excel
 * @param e
 */
function exportExcel() {
    console.log("export");
    var name = 't_pr_burnorder';
    var sqlWords = "select * from t_pr_burnorder join t_pr_burnorderitem where id = burnOrderId;";
    window.open('exportExcel?name=' + name + '&sqlWords=' + sqlWords);
}

/**
 * 导入模态框
 * */
function importExcelChoose() {
    $("#importExcelModal").modal('show');
}

/**
 * 下载模板
 * */
function downloadModal() {
    var filePath = '/var/local/apache-tomcat-7.0.86/bin/Files/Templates/burnOrderMode.xls';
    var r = confirm("是否下载模板?");
    if (r == true) {
        window.open('downloadFile?filePath=' + filePath);
    }
}

/**
 * 导入excel
 */
function importExcel() {
    document.getElementById("idExcel").click();
    document.getElementById("idExcel").addEventListener("change", function () {
        var eFile = document.getElementById("idExcel").files[0];
        var formFile = new FormData();
        formFile.append("excelFile", eFile);
        formFile.append("excelFile", eFile);
        $.ajax({
            type: "POST",                       // 方法类型
            url: "importBurnOrderExcel",              // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            dataType: "json",
            data: formFile,
            processData: false,
            contentType: false,
            success: function (result) {
                if (result != undefined) {
                    console.log(result);
                    if (result.status == "success") {
                        alert(result.message);
                        window.location.reload();         //刷新
                    } else {
                        alert(result.message);
                    }
                }
            },
            error: function (result) {
                console.log(result);
            }
        });
    });
}

/**
 * 回车查询
 */
function enterSearch(){
    if (event.keyCode === 13) {   // 如果按下键为回车键，即执行搜素
        searchBurnOrder();      //
    }
}

/**
 * 查询功能
 */
function searchBurnOrder() {
    isSearch = true;
    var page = {};
    var pageNumber = 1;                       // 显示首页
    page.pageNumber = pageNumber;
    page.count = countValue();
    page.start = (pageNumber - 1) * page.count;
    var state = null;
    if ($("#search-state").val() == 0) state = "NewBuild";//新建
    if ($("#search-state").val() == 1) state = "Confirm";//已确认
    if ($("#search-state").val() == 2) state = "Invalid";//已作废
    if ($("#senior").is(':visible')) {
        data1 = {
            id: $.trim($("#search-id").val()),
            startDate: $("#search-startDate").val(),
            endDate: $("#search-endDate").val(),
            remarks: $.trim($("#search-remarks").val()),
            state: state,
            page: page
        };
    }else{
        var keywords = $.trim($("#searchContent").val());
        switch (keywords){
            case("新建"): keywords = "NewBuild";break;
            case("待审批"): keywords = "ToExamine";break;
            case("审批中"): keywords = "Examining";break;
            case("审批通过"): keywords = "Approval";break;
            case("已驳回"): keywords = "Backed";break;
            case("驳回"): keywords = "Backed";break;
            case("已作废"): keywords = "Invalid";break;
            case("作废"): keywords = "Invalid";break;
            case("已确认"): keywords = "Confirm";break;
            case("确认"): keywords = "Confirm";break;
        }
        data1={
            page:page,
            keywords: keywords
        }
    }
    console.log(data1);
    if (data1 == null) alert("请点击'查询设置'输入查询内容!");
    else {
        $.ajax({
            type: "POST",                            // 方法类型
            url: "searchBurnOrder",                 // url
            async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(data1),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
                if (result.data != undefined || result.status == "success") {
                    setPageClone(result.data);
                } else {
                    console.log(result.message);
                }
            },
            error: function (result) {
                console.log(result);
                alert("服务器错误！");
            }
        });
    }
}

/**
 * 作废功能
 * @param item
 */
function invalid(item) {
    var id = getBurnOrderId1(item);
    if (confirm("确认作废？")) {
        $.ajax({
            type: "POST",
            url: "invalidBurnOrder",
            async: false,
            data: {
                id: id
            },
            dataType: "json",
            success: function (result) {
                if (result.status == "success") {
                    alert("作废成功!");
                    window.location.reload();
                } else {
                    alert(result.message);
                }
            },
            error: function (result) {
                console.log(result);
                alert("服务器异常!");
            }
        });
    }
}

/**
 * 获取焚烧工单号(双击)
 * @param item
 * @returns {string}
 */
function getBurnOrderId(item) {
    return item.firstElementChild.nextElementSibling.innerHTML;
}

/**
 * 获取焚烧工单号（单击）
 * @param item
 * @returns {string}
 */
function getBurnOrderId1(item) {
    return item.parentElement.parentElement.firstElementChild.nextElementSibling.innerHTML;
}

/**
 * 双击查看焚烧工单
 * @param item
 */
function toView(item) {
    burnOrderId = getBurnOrderId(item);
    showBurnOrderViewModal(burnOrderId);
}

/**
 * 单击查看焚烧工单
 */
function toView1(item) {
    burnOrderId = getBurnOrderId1(item);
    showBurnOrderViewModal(burnOrderId);
}

/**
 * 显示焚烧工单模态框
 * @param id
 */
function showBurnOrderViewModal(id) {
    $(".newLine").remove();
    $.ajax({
        type: "POST",
        url: "getBurnOrderById",
        async: false,
        data: {
            id: id
        },
        dataType: "json",
        success: function (result) {
            if (result.status == "success") {
                //设置数据
                var data = eval(result.data);
                console.log("" + result);
                setViewBurnOrderClone(data);
                $("#view1-Id").text(data.id);
                $("#view1-remarks").text(data.remarks);
                $("#view1-weightTotal").text(data.weightTotal);
                $("#view1-calorificTotal").text(data.calorificTotal);
                $("#view1-ashPercentageTotal").text(data.ashPercentageTotal);
                $("#view1-wetPercentageTotal").text(data.wetPercentageTotal);
                $("#view1-volatileNumberTotal").text(data.volatileNumberTotal);
                $("#view1-chlorinePercentageTotal").text(data.chlorinePercentageTotal);
                $("#view1-sulfurPercentageTotal").text(data.sulfurPercentageTotal);
                $("#view1-phTotal").text(data.phTotal);
                $("#view1-phosphorusPercentageTotal").text(data.phosphorusPercentageTotal);
                $("#view1-fluorinePercentageTotal").text(data.fluorinePercentageTotal);
                $("#view1-distillationProportion").text(data.distillationProportion);
                $("#view1-wasteLiquidProportion").text(data.wasteLiquidProportion);
                $("#view1-sludgeProportion").text(data.sludgeProportion);
                $("#view1-bulkProportion").text(data.bulkProportion);
                $("#view1-crushingProportion").text(data.crushingProportion);
                $("#view1-suspensionProportion").text(data.suspensionProportion);
            } else {
                alert(result.message);
            }
        },
        error: function (result) {
            console.log(result);
            alert("服务器异常!");
        }
    });
    $("#viewModal1").modal('show');
}

/**
 * 为查看模态框设置克隆数据
 * @param result
 */
function setViewBurnOrderClone(result) {
    // 获取id为cloneTr的tr元素
    var tr = $("#viewClone1");
    $.each(result.pretreatmentItemList, function (index, item) {
        // 克隆tr，每次遍历都可以产生新的tr
        var clonedTr = tr.clone();
        clonedTr.show();
        // 循环遍历cloneTr的每一个td元素，并赋值
        clonedTr.children("td").each(function (inner_index) {
            var obj = eval(item);
            // 根据索引为部分td赋值
            switch (inner_index) {
                case (0):
                    // 序号
                    $(this).html(obj.serialNumber);
                    break;
                case (1):
                    // 产废单位
                    $(this).html(obj.produceCompanyName);
                    break;
                case (2):
                    // 指标要求及来源
                    $(this).html(obj.requirements);
                    break;
                case (3):
                    // 危废名称
                    $(this).html(obj.wastes.name);
                    break;
                case (4):
                    // 比例
                    $(this).html(obj.proportion);
                    break;
                case (5):
                    // 重量（吨）
                    $(this).html(obj.wastes.weight);
                    break;
                case (6):
                    // 危废热值
                    $(this).html(obj.wastes.calorific);
                    break;
                case (7):
                    // 灰分
                    $(this).html(obj.wastes.ashPercentage);
                    break;
                case (8):
                    // 水分
                    $(this).html(obj.wastes.wetPercentage);
                    break;
                case (9):
                    // 挥发份
                    $(this).html(obj.wastes.volatileNumber);
                    break;
                case (10):
                    // 氯
                    $(this).html(obj.wastes.chlorinePercentage);
                    break;
                case (11):
                    // 硫
                    $(this).html(obj.wastes.sulfurPercentage);
                    break;
                case (12):
                    // PH
                    $(this).html(obj.wastes.ph);
                    break;
                case (13):
                    // P
                    $(this).html(obj.wastes.phosphorusPercentage);
                    break;
                case (14):
                    // F
                    $(this).html(obj.wastes.fluorinePercentage);
                    break;
                case (15):
                    // 备注
                    $(this).html(obj.wastes.remarks);
                    break;
                case (16):
                    // 处置方式
                    $(this).html(obj.wastes.processWay.name);
                    break;
                case (17):
                    // 进料方式
                    $(this).html(obj.wastes.handleCategory.name);
                    break;
                case (18):
                    //预处理暂存点
                    $(this).html(obj.temporaryAddress);
                    break;
            }
        });
        // 把克隆好的tr追加到原来的tr前面
        clonedTr.addClass("newLine");
        clonedTr.removeAttr("id");
        clonedTr.insertBefore(tr);
    });
    // 隐藏无数据的tr
    tr.hide();
}

