var currentPage = 1;                          //当前页数
var isSearch = false;
var data;
var sampleId;
$('#embed').load('embed/loginLogModal.html');

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
            url: "totalSampleInformationRecord",                  // url
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
            url: "searchSampleInfoTotal",                  // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                // console.log(result);
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
    setSampleList(result);
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
        });
        clonedLi.addClass("beforeClone");
        clonedLi.removeAttr("id");
        clonedLi.insertAfter(li);
    }

}

/**
 * 点击页数跳转页面
 * @param pageNumber 跳转页数
 * */
function switchPage(pageNumber) {
    console.log("当前页：" + pageNumber);
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
    var page = {};
    page.count = countValue();                        //可选
    page.pageNumber = pageNumber;
    currentPage = pageNumber;          //当前页面
    //addClass("active");
    page.start = (pageNumber - 1) * page.count;
    if (!isSearch) {
        $.ajax({
            type: "POST",                       // 方法类型
            url: "loadPageSampleInformationList",         // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(page),
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            success: function (result) {
                if (result != undefined) {
                    setSampleList(result.data);
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
            url: "searchSampleInfo",         // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify(data),
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            success: function (result) {
                if (result != undefined) {
                    // console.log(result);
                    setSampleList(result.data);
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

function enterSwitchPage() {
    if (event.keyCode === 13) {
        inputSwitchPage();
    }
}

/**
 * 输入页数跳转页面
 * */
function inputSwitchPage() {
    var pageNumber = $("#pageNumber").val();    // 获取输入框的值
    if (pageNumber == null || pageNumber == undefined) {
        window.alert("跳转页数不能为空！")
    } else {
        if (pageNumber > totalPage()) {
            alert("跳转页数超出总页数！");
            pageNumber = 1;
        }
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
        $("#current").find("a").text("当前页：" + pageNumber);
        var page = {};
        page.count = countValue();//可选
        page.pageNumber = pageNumber;
        page.start = (pageNumber - 1) * page.count;
        if (!isSearch) {
            $.ajax({
                type: "POST",                       // 方法类型
                url: "loadPageSampleInformationList",         // url
                async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
                data: JSON.stringify(page),
                dataType: "json",
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    if (result != undefined) {
                        console.log(result);
                        setSampleList(result.data);
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
                url: "searchSampleInfo",         // url
                async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
                data: JSON.stringify(data),
                dataType: "json",
                contentType: 'application/json;charset=utf-8',
                success: function (result) {
                    if (result != undefined) {
                        // console.log(result);
                        setSampleList(result.data);
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
function loadPageSampleInformationList() {
    var pageNumber = 1;               // 显示首页
    $("#current").find("a").text("当前页：1");
    $("#previous").addClass("disabled");
    $("#firstPage").addClass("disabled");
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
        url: "loadPageSampleInformationList",          // url
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

function setSampleList(result) {
    // 获取id为cloneTr的tr元素
    var tr = $("#cloneTr");
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
                //预约单号
                case (0):
                    $(this).html(obj.id);
                    break;
                // 公司代码
                case (1):
                    $(this).html(obj.companyCode);
                    break;
                //危废代码
                case (2):
                    $(this).html(obj.wastesCode);
                    break;
                // 样品状态
                case (3):
                    if (obj.applyState != null) {
                        obj.name = obj.applyState.name;
                    }
                    $(this).html(obj.name);
                    break;
                //基础检测项目
                case (4): {
                    var list = [];
                    if (obj.isPH === true) list.push("PH");
                    if (obj.isAsh === true) list.push("灰");
                    if (obj.isWater === true) list.push("水");
                    if (obj.isHeat === true) list.push("热");
                    if (obj.isSulfur === true) list.push("硫");
                    if (obj.isChlorine === true) list.push("氯");
                    if (obj.isFluorine === true) list.push("氟");
                    if (obj.isPhosphorus === true) list.push("磷");
                    var flag = false;
                    var r = "";
                    //遍历分隔字符串,以逗号隔开
                    for (var i = 0; i < list.length; i++) {
                        if (flag) {
                            r += ",";
                        } else {
                            flag = true;
                        }
                        r += list[i];  //在r末尾插入s
                    }
                    obj.basicItems = r.toString();
                }
                    $(this).html(obj.basicItems);
                    break;
                // 增加检测项目
                case (5): {
                    var list1 = [];
                    if (obj.isFlashPoint === true) list1.push("闪点");
                    if (obj.isViscosity === true) list1.push("黏度");
                    var flag = false;
                    var r = "";
                    for (var i = 0; i < list1.length; i++) {
                        if (flag) {
                            r += ",";
                        } else {
                            flag = true;
                        }
                        r += list1[i];
                    }
                    obj.addItems = r.toString();
                }
                    $(this).html(obj.addItems);
                    break;
                // 签收人
                case (6):
                    $(this).html(obj.laboratorySigner);
                    break;
                case (7):
                    // console.log(getDateStr(obj.samplingDate));
                    $(this).html(getDateStr(obj.samplingDate));
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
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getSampleInfoSeniorSelectedList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            if (result != undefined) {
                var data = eval(result);
                // 高级检索下拉框数据填充
                var applyState = $("#search-state");
                applyState.children().remove();
                $.each(data.applyStateList, function (index, item) {
                    var option = $('<option />');
                    option.val(index);
                    option.text(item.name);
                    applyState.append(option);
                });
                applyState.get(0).selectedIndex = -1;
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
 * 日期格式
 */
$('.form_datetime').datetimepicker({
    language: 'zh-CN',
    format: 'yyyy-mm-dd hh:ii:ss',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    showMeridian: 1
});

/**
 * 预约登记-显示预约框
 */
function appointModal() {
    // 显示框体
    setSelectList();
    $('#appointModal').modal('show');

}

/**
 * 转化基础项目
 * @param data
 * @returns {string}
 */
function basicItems(data) {
    var list = [];
    //只显示第一组数据
    if (data.isPH === true) list.push("PH");
    if (data.isAsh === true) list.push("灰");
    if (data.isWater === true) list.push("水");
    if (data.isHeat === true) list.push("热");
    if (data.isSulfur === true) list.push("硫");
    if (data.isChlorine === true) list.push("氯");
    if (data.isFluorine === true) list.push("氟");
    if (data.isPhosphorus === true) list.push("磷");
    var flag = false;
    var r = "";
    //遍历分隔字符串,以逗号隔开
    for (var i = 0; i < list.length; i++) {
        if (flag) {
            r += ",";
        } else {
            flag = true;
        }
        r += list[i];  //在r末尾插入s
    }
    return r.toString();
}

/**
 * 转化增加项目
 * @param data
 * @returns {string}
 */
function addItems(data) {
    var list1 = [];
    if (data.isFlashPoint === true) list1.push("闪点");
    if (data.isViscosity === true) list1.push("黏度");
    var flag = false;
    var r1 = "";
    for (var i = 0; i < list1.length; i++) {
        if (flag) {
            r1 += ",";
        } else {
            flag = true;
        }
        r1 += list1[i];
    }
    return r1.toString();
}

/**
 * 单击获取Id
 * @param menu
 * @returns {string}
 */
function getSampleIdByMenu(menu) {
    return menu.parentElement.parentElement.firstElementChild.innerHTML;
}

/**
 * 双击获取ID
 * @param menu
 * @returns {string}
 */
function getSampleIdByMenu1(menu) {
    return menu.firstElementChild.innerHTML;
}

/**
 * 双击查看
 * @param menu
 */
function viewSample1(menu) {
    sampleId = getSampleIdByMenu1(menu);
    view(sampleId);
}

/**
 * 单击查看
 */
function viewSample(menu) {
    sampleId = getSampleIdByMenu(menu);
    view(sampleId);
}

/**
 * 显示查看模态框
 * @param sampleId
 */
function view(sampleId) {
    $(".newLine").remove();
    $("#footer").show();
    $.ajax({
        type: "POST",                            // 方法类型
        url: "getSampleInformation",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        data: {
            'sampleId': sampleId
        },
        dataType: "json",
        success: function (result) {
            console.log(result);
            if (result != undefined) {
                var data = eval(result.data);
                if (result.status == "success") {
                    $("#model1-companyCode").text(data.companyCode);
                    $("#model1-signer").text(data.laboratorySigner);
                    console.log(data.wastesList);
                    for (var i = 0; i < data.wastesList.length; i++) {
                        if (i > 0) addLine();
                        var $i = i;
                        $("span[id='model[" + $i + "].wastesCode']").text(data.wastesList[i].code);
                        $("span[id='model[" + $i + "].basicItems']").text(basicItems(data.wastesList[i]));
                        $("span[id='model[" + $i + "].addItems']").text(addItems(data.wastesList[i]));
                    }
                    // 显示框体
                    $('#viewAppointModal').modal('show');
                } else {
                    alert(result.message);
                }
            }
        },
        error: function (result) {
            console.dir(result);
            alert("服务器异常!");
        }
    });
}

function addLine() {
    // 获取id为plusBtn的tr元素
    var tr = $("#cloneBefore").prev();
    // 克隆tr，每次遍历都可以产生新的tr
    var clonedTr = tr.clone();
    // 克隆后清空新克隆出的行数据
    var num = clonedTr.children().find("span:first").prop('id').charAt(6);
    clonedTr.children().find("span").text("");
    clonedTr.children().find("span").each(function () {
        var id = $(this).prop('id');
        var newId = id.replace(/[0-9]\d*/, parseInt(num) + 1);
        $(this).prop('id', newId);
        // var name = $(this).prop('name');
        // var newName = name.replace(/[0-9]\d*/, parseInt(id) + 1);
        // $(this).prop('name', newName);
    });
    clonedTr.addClass("newLine");
    clonedTr.insertAfter(tr);
}

/**
 * 确认收样
 */
function confirmCheck() {
    $.ajax({
        type: "POST",                             // 方法类型
        url: "confirmSampleInformationCheck",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        data: {
            'sampleId': sampleId
        },
        dataType: "json",
        success: function (result) {
            if (result.status == "success") {
                alert(result.message);
                window.location.reload();
            } else {
                alert(result.message);
            }
        },
        error: function (result) {
            console.dir(result);
            alert("服务器异常!");
        }
    });
}

/**
 * 为公司代码和危废代码下拉框填充数据
 */
function setSelectList() {
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getClientAndWastesCodeSelectedList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            if (result != undefined && result.status === "success") {
                var data = eval(result);
                console.log("下拉数据为：");
                console.log(data);
                // 下拉框数据填充
                var companyCode = $("#model-companyCode");
                $.each(data.companyCodeList, function (index, item) {
                    var option = $('<option />');
                    option.val(parseInt(item.clientId));
                    option.text(item.clientId);
                    companyCode.append(option);
                });
                var wastesCode = $("#wastesList0-wastesCode");
                $.each(data.wastesCodeList, function (index, item) {
                    var option = $('<option />');
                    option.val(parseInt(item.code.replace(/[^0-9]/ig, "")));
                    option.text(item.code);
                    wastesCode.append(option);
                });
                // 下拉框数据填充
                var companyCode1 = $("#model3-companyCode");
                $.each(data.companyCodeList, function (index, item) {
                    var option = $('<option />');
                    option.val(parseInt(item.clientId));
                    option.text(item.clientId);
                    companyCode1.append(option);
                });
                var wastesCode1 = $("#wastes0-wastesCode");
                $.each(data.wastesCodeList, function (index, item) {
                    var option = $('<option />');
                    option.val(parseInt(item.code.replace(/[^0-9]/ig, "")));
                    option.text(item.code);
                    wastesCode1.append(option);
                });
                //刷新下拉数据
                $('.selectpicker').selectpicker('refresh');
            } else {
                console.log("fail: " + result);
            }
        },
        error: function (result) {
            console.log("error: " + result);
        }
    });
}

var num = 0;

/**
 * 预约登记-新增样品
 */
function addNewLine() {
    num++;
    // 获取id为plusBtn的tr元素
    var tr = $("#addBtn").prev();
    // 克隆tr，每次遍历都可以产生新的tr
    var clonedTr = tr.clone();
    // 克隆后清空新克隆出的行数据
    //clonedTr.children().find("input:first-child").prop('name').charAt(11);
    clonedTr.children().find("input").val("");
    clonedTr.children().find("input:checkbox").prop('checked', false);
    clonedTr.children().find("select").selectpicker('val', '');
    clonedTr.children().find("input,select").each(function () {
        var name = $(this).prop('name');
        var newName = name.replace(/[0-9]\d*/, num);
        $(this).prop('name', newName);
        var id = $(this).prop('id');
        var newId = id.replace(/[0-9]\d*/, num);
        $(this).prop('id', newId);
    });
    clonedTr.addClass("newLine");
    clonedTr.insertAfter(tr);
    //清空数据为重新初始化selectpicker
    $('.selectpicker').data('selectpicker', null);
    $('.bootstrap-select').find("button:first").remove();
    $('.selectpicker').selectpicker();
    // var delBtn = "<div class='col-md-4'><a class='btn btn-default btn-xs' onclick='delLine(this);'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></a>&nbsp;</div>";
    // $("#addBtn").prepend(delBtn);
}

/**
 * 删除行
 */
function delLine(item) {
    var form = item.parents();
    form.next().remove();
    form.remove();
}

/**
 * 显示确认收样框
 */
function checkModal(menu) {
    $(".newLine").remove();
    sampleId = getSampleIdByMenu(menu);
    // 更新数据
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getSampleInformation",              // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        data: {
            'sampleId': sampleId
        },
        dataType: "json",
        success: function (result) {
            if (result != undefined) {
                if (result.status == "success") {
                    var data = eval(result.data);
                    $("#model2-companyCode").text(data.companyCode);
                    $("#model2-signer").text(data.laboratorySigner);
                    console.log(data.wastesList);
                    for (var i = 0; i < data.wastesList.length; i++) {
                        if (i > 0) addNextLine();
                        var $i = i;
                        $("span[id='checkModel[" + $i + "].wastesCode']").text(data.wastesList[i].code);
                        $("span[id='checkModel[" + $i + "].basicItems']").text(basicItems(data.wastesList[i]));
                        $("span[id='checkModel[" + $i + "].addItems']").text(addItems(data.wastesList[i]));
                    }
                }
                else {
                    alert(result.message);
                }
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
    // 显示框体
    $('#checkModal').modal('show');
}

/**
 * 显示确认收样 克隆样品数据
 */
function addNextLine() {
    // 获取id为plusBtn的tr元素
    var tr = $("#clone").prev();
    // 克隆tr，每次遍历都可以产生新的tr
    var clonedTr = tr.clone();
    // 克隆后清空新克隆出的行数据
    var num = clonedTr.children().find("span:first").prop('id').charAt(11);
    clonedTr.children().find("span").text("");
    clonedTr.children().find("span").each(function () {
        var id = $(this).prop('id');
        var newId = id.replace(/[0-9]\d*/, parseInt(num) + 1);
        $(this).prop('id', newId);
    });
    clonedTr.addClass("newLine");
    clonedTr.insertAfter(tr);
}


/**
 * 修改信息功能
 */
function adjustSample(menu) {
    num = 0;
    setSelectList();
    $(".newLine").remove();
    sampleId = getSampleIdByMenu(menu);
    $.ajax({
        type: "POST",                            // 方法类型
        url: "getSampleInformation",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        data: {
            'sampleId': sampleId
        },
        dataType: "json",
        success: function (result) {
            console.log(result);
            if (result != undefined) {
                var data = eval(result.data);
                if (result.status == "success") {
                    $("#model3-companyCode").selectpicker('val', parseInt(data.companyCode));
                    $("#model3-signer").val(data.laboratorySigner);
                    for (var i = 0; i < data.wastesList.length; i++) {
                        if (i > 0) addNewLine2();
                        var $i = i;
                        $("#wastes" + $i + "-wastesCode").selectpicker('val', parseInt(data.wastesList[i].code.replace(/[^0-9]/ig, "")));
                        $("input[name='wastes[" + $i + "].isPH']").prop('checked', data.wastesList[i].isPH);
                        $("input[name='wastes[" + $i + "].isAsh']").prop('checked', data.wastesList[i].isAsh);
                        $("input[name='wastes[" + $i + "].isWater']").prop('checked', data.wastesList[i].isWater);
                        $("input[name='wastes[" + $i + "].isHeat']").prop('checked', data.wastesList[i].isHeat);
                        $("input[name='wastes[" + $i + "].isS']").prop('checked', data.wastesList[i].isSulfur);
                        $("input[name='wastes[" + $i + "].isCl']").prop('checked', data.wastesList[i].isChlorine);
                        $("input[name='wastes[" + $i + "].isF']").prop('checked', data.wastesList[i].isFluorine);
                        $("input[name='wastes[" + $i + "].isP']").prop('checked', data.wastesList[i].isPhosphorus);
                        $("input[name='wastes[" + $i + "].isFlashPoint']").prop('checked', data.wastesList[i].isFlashPoint);
                        $("input[name='wastes[" + $i + "].isViscosity']").prop('checked', data.wastesList[i].isViscosity);
                    }
                    // 显示框体
                    $('#adjustModal').modal('show');
                } else {
                    alert(data.message);
                    console.log(data.exception);
                }
            }
        },
        error: function (result) {
            console.dir(result);
            alert("服务器异常!");
        }
    });
}

/**
 * 修改新增行
 */
function addNewLine2() {
    num++;
    // 获取id为plusBtn的tr元素
    var tr = $("#addBtn3").prev();
    // 克隆tr，每次遍历都可以产生新的tr
    var clonedTr = tr.clone();
    // 克隆后清空新克隆出的行数据
    //clonedTr.children().find("input:first-child").prop('name').charAt(11);
    clonedTr.children().find("input").val("");
    clonedTr.children().find("input:checkbox").prop('checked', false);
    clonedTr.children().find("select").selectpicker('val', '');
    clonedTr.children().find("input,select").each(function () {
        var name = $(this).prop('name');
        var newName = name.replace(/[0-9]\d*/, num);
        $(this).prop('name', newName);
        var id = $(this).prop('id');
        var newId = id.replace(/[0-9]\d*/, num);
        $(this).prop('id', newId);
    });
    clonedTr.addClass("newLine");
    clonedTr.insertAfter(tr);
    //清空数据为重新初始化selectpicker
    $('.selectpicker').data('selectpicker', null);
    $('.bootstrap-select').find("button:first").remove();
    $('.selectpicker').selectpicker();
    // var delBtn = "<div class='col-md-4'><a class='btn btn-default btn-xs' onclick='delLine(this);'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></a>&nbsp;</div>";
    // $("#addBtn").prepend(delBtn);
}

function getWastesByWastesId(id) {
    $.ajax({
        type: "POST",                            // 方法类型
        url: "getWastesByWastesId",                 // url
        async: false, // 同步：意思是当有返回值以后才会进行后面的js程序
        data: {
            id: id
        },
        dataType: "json",
        success: function (result) {
            if (result != null && result.status == "success") {
                console.log("wastes:");
                console.log(result);
                if (result.data != null) return true;
                else return false;
            }
        },
        error: function (result) {
            alert("获取失败!");
            console.log(result);
        }
    });
}

/**
 * 通过预约单号对预约单进行修改
 */
function updateAppointBySampleId() {
    var sampleInformation = {};
    sampleInformation.id = sampleId;
    sampleInformation.companyCode = $("#model3-companyCode").find("option:selected").text();
    sampleInformation.laboratorySigner = $("#model3-signer").val();
    sampleInformation['wastesList'] = [];
    var lineCount = $("select[name^='wastes'][name$='wastesCode']").length - 1;
    var wastesId = null;
    $.ajax({
        type: "POST",                            // 方法类型
        url: "getCurrentWastesId",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            //alert("wastesId获取成功!");
            wastesId = result.id;
        },
        error: function (result) {
            //  alert("wastesId获取失败!");
            console.log(result);
        }
    });
    var data = {};
    //获取wastesId
    $.ajax({
        type: "POST",                            // 方法类型
        url: "getSampleInformation",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        data: {
            sampleId: sampleId
        },
        success: function (result) {
            console.log("获取的数据为：");
            console.log(result);
            data = result.data;
        },
        error: function (result) {
            console.log(result);
            alert("服务器异常!");
        }
    });
    for (var i = 0; i < lineCount; i++) {
        console.log(lineCount);
        var wastes = {};
        var $i = i;
        if (data.wastesList[i] != null) {
            wastes.id = data.wastesList[i].id;
            wastes.ph = 1;
        } else {
            wastes.id = wastesId;
            wastes.ph = 0;
            var num1 = parseInt(wastesId) + 1;
            wastesId = num1 + "";
        }
        wastes.code = $("select[name='wastes[" + $i + "].wastesCode']").find("option:selected").text();
        wastes.isPH = $("input[name='wastes[" + $i + "].isPH']").prop('checked');
        wastes.isAsh = $("input[name='wastes[" + $i + "].isAsh']").prop('checked');
        wastes.isWater = $("input[name='wastes[" + $i + "].isWater']").prop('checked');
        wastes.isHeat = $("input[name='wastes[" + $i + "].isHeat']").prop('checked');
        wastes.isSulfur = $("input[name='wastes[" + $i + "].isS']").prop('checked');
        wastes.isChlorine = $("input[name='wastes[" + $i + "].isCl']").prop('checked');
        wastes.isFluorine = $("input[name='wastes[" + $i + "].isF']").prop('checked');
        wastes.isPhosphorus = $("input[name='wastes[" + $i + "].isP']").prop('checked');
        wastes.isFlashPoint = $("input[name='wastes[" + $i + "].isFlashPoint']").prop('checked');
        wastes.isViscosity = $("input[name='wastes[" + $i + "].isViscosity']").prop('checked');
        sampleInformation.wastesList.push(wastes);
    }
    console.log("要更新的数据为:");
    console.log(sampleInformation);
    $.ajax({
        type: "POST",                            // 方法类型
        url: "updateSampleInformation",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(sampleInformation),
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        success: function (result) {
            console.log(result);
            if (result != undefined) {
                var data = eval(result);
                if (data.status == "success") {
                    alert(data.message);
                    window.location.reload();
                } else {
                    alert(data.message);
                    console.log(data.exception);
                }
            }
        },
        error: function (result) {
            console.dir(result);
            alert("服务器异常!");
        }
    });
}

/**
 * 回车查询
 */
function enterSearch() {
    if (event.keyCode === 13) {   // 如果按下键为回车键，即执行搜素
        searchSampleInfo();      //
    }
}

/**
 * 延时自动查询
 */
$(document).ready(function () {//页面载入是就会进行加载里面的内容
    var last;
    $('#searchContent').keyup(function (event) { //给Input赋予onkeyup事件
        last = event.timeStamp;//利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
        setTimeout(function () {
            if(last-event.timeStamp=== 0){
                searchSampleInfo();
            }else if (event.keyCode === 13) {   // 如果按下键为回车键，即执行搜素
                searchSampleInfo();      //
            }
        },600);
    });
});

/**
 * 查询功能
 */
function searchSampleInfo() {
    isSearch = true;
    var page = {};
    var pageNumber = 1;                       // 显示首页
    page.pageNumber = pageNumber;
    page.count = countValue();
    page.start = (pageNumber - 1) * page.count;
    // 精确查询
    var applyState = null;
    if ($("#search-state").val() == 0) applyState = "Appointed";
    if ($("#search-state").val() == 1) applyState = "Canceld";
    if ($("#search-state").val() == 2) applyState = "SampleTaked";
    if ($("#search-state").val() == 3) applyState = "Invalid";
    if ($("#senior").is(':visible')) {
        data = {
            id: $.trim($("#search-id").val()),
            companyCode: $.trim($("#search-companyCode").val()),
            wastesCode: $.trim($("#search-wastesCode").val()),
            laboratorySigner:$.trim( $("#search-signer").val()),
            applyState: applyState,
            isPH: $("#isPH1").prop("checked"),
            isAsh: $("#isAsh1").prop("checked"),
            isWater: $("#isWater1").prop("checked"),
            isHeat: $("#isHeat1").prop("checked"),
            isSulfur: $("#isS1").prop("checked"),
            isChlorine: $("#isCl1").prop("checked"),
            isFluorine: $("#isF1").prop("checked"),
            isPhosphorus: $("#isP1").prop("checked"),
            isFlashPoint: $("#isFlashPoint1").prop("checked"),
            isViscosity: $("#isViscosity1").prop("checked"),
            page: page
        };
        console.log(data);
        // 模糊查询
    } else {
        var keywords = $.trim($("#searchContent").val());
        switch (keywords) {
            case "闪点":
                var isFlashPoint = true;
                keywords = "";
                break;
            case "黏度":
                var isViscosity = true;
                keywords = "";
                break;
            case "PH":
                var isPH = true;
                keywords = "";
                break;
            case "灰分":
                var isAsh = true;
                keywords = "";
                break;
            case "灰":
                var isAsh = true;
                keywords = "";
                break;
            case "水分":
                var isWater = true;
                keywords = "";
                break;
            case "水":
                var isWater = true;
                keywords = "";
                break;
            case "热值":
                var isHeat = true;
                keywords = "";
                break;
            case "热":
                var isHeat = true;
                keywords = "";
                break;
            case "硫":
                var isSulfur = true;
                keywords = "";
                break;
            case "氯":
                var isChlorine = true;
                keywords = "";
                break;
            case "氟":
                var isFluorine = true;
                keywords = "";
                break;
            case "磷":
                var isPhosphorus = true;
                keywords = "";
                break;
        }
        data = {
            page: page,
            keywords: keywords,
            isFlashPoint: isFlashPoint,
            isViscosity: isViscosity,
            isPH: isPH,
            isAsh: isAsh,
            isWater: isWater,
            isHeat: isHeat,
            isSulfur: isSulfur,
            isChlorine: isChlorine,
            isFluorine: isFluorine,
            isPhosphorus: isPhosphorus
        }
    }
    $.ajax({
        type: "POST",                            // 方法类型
        url: "searchSampleInfo",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(data),
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
            alert("服务器异常!");
        }
    });
    isSearch = true;
}

/**
 * 添加预约登记单
 */
function addAppoint() {
    var sampleInformation = {};
    //获取id
    $.ajax({
        type: "POST",                            // 方法类型
        url: "getCurrentSampleInformationId",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            //alert("数据获取成功！");
            sampleInformation.id = result.id;
        },
        error: function (result) {
            alert("服务器异常!");
            console.log(result);
        }
    });
    sampleInformation.companyCode = $("#model-companyCode").find("option:selected").text();
    sampleInformation.laboratorySigner = $("#model-signer").val();
    sampleInformation['wastesList'] = [];
    var lineCount = $("select[name^='wastesList'][name$='wastesCode']").length;
    var wastesId = null;
    //获取wastesId
    $.ajax({
        type: "POST",                            // 方法类型
        url: "getCurrentWastesId",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            //alert("wastesId获取成功!");
            wastesId = result.id;
        },
        error: function (result) {
            //  alert("wastesId获取失败!");
            console.log(result);
        }
    });
    var id1 = parseInt(wastesId);
    for (var i = 0; i < lineCount; i++) {
        var wastes = {};
        var $i = i;
        //id 递增
        var id2 = id1++;
        wastes.id = id2;
        wastes.code = $("select[name='wastesList[" + $i + "].wastesCode']").find("option:selected").text();
        wastes.isPH = $("input[name='wastesList[" + $i + "].isPH']").prop('checked');
        wastes.isAsh = $("input[name='wastesList[" + $i + "].isAsh']").prop('checked');
        wastes.isWater = $("input[name='wastesList[" + $i + "].isWater']").prop('checked');
        wastes.isHeat = $("input[name='wastesList[" + $i + "].isHeat']").prop('checked');
        wastes.isSulfur = $("input[name='wastesList[" + $i + "].isS']").prop('checked');
        wastes.isChlorine = $("input[name='wastesList[" + $i + "].isCl']").prop('checked');
        wastes.isFluorine = $("input[name='wastesList[" + $i + "].isF']").prop('checked');
        wastes.isPhosphorus = $("input[name='wastesList[" + $i + "].isP']").prop('checked');
        wastes.isFlashPoint = $("input[name='wastesList[" + $i + "].isFlashPoint']").prop('checked');
        wastes.isViscosity = $("input[name='wastesList[" + $i + "].isViscosity']").prop('checked');
        sampleInformation.wastesList.push(wastes);
    }
    console.log("添加的数据为：");
    console.log(sampleInformation);
    $.ajax({
        type: "POST",                            // 方法类型
        url: "addSampleInfo",                 // url
        async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(sampleInformation),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            console.log(result);
            if (result != undefined) {
                var data = eval(result);
                if (data.status == "success") {
                    alert(data.message);
                    window.location.reload();
                } else {
                    alert(data.message);
                }
            }
        },
        error: function (result) {
            console.dir(result);
            alert("服务器异常!");
        }
    });
}

/**
 * 删除预约单----->改作废
 */
function deleteSample(menu) {
    sampleId = getSampleIdByMenu(menu);
    var msg = "是否作废该条记录？";
    if (confirm(msg) == true) {
        $.ajax({
            type: "POST",                       // 方法类型
            url: "cancelSampleInformation",              // url
            async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
            data: {
                'sampleId': sampleId
            },
            dataType: "json",
            success: function (result) {
                if (result != undefined) {
                    var data = eval(result);
                    alert(data.message);
                    if (data.status == "success") {
                        window.location.reload();
                    }
                }
            },
            error: function (result) {
                console.log(result);
            }
        });
    }
}

// 对Date原型进行改造，增加方法format
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

/**
 * 导出excel
 * @param e
 */
function exportExcel(e) {
    var name = 't_pr_sampleinformation';
    var sqlWords = "select companyCode,wastesCode,applyState,laboratorySigner,isPH,isAsh,isWater,isHeat,isSulfur,isChlorine,isFluorine,isPhosphorus,isFlashPoint,isViscosity from t_pr_sampleinformation ";
    window.open('exportExcel?name=' + name + '&sqlWords=' + sqlWords);
}

/**
 * 关闭模态框并刷新
 */
function closeModal() {
    $("#appointModal").hide();
    window.location.reload();
}

/**
 * 打印功能
 */
function print() {
    //打印模态框
    $("#footer").hide();
    $("#viewModal").printThis({
        debug: false,             // 调试模式下打印文本的渲染状态
        importCSS: false,       // 为打印文本引入外部样式link标签 ["<link rel='stylesheet' href='/static/jquery/forieprint.css' media='print'>","",""]
        importStyle: false,      // 为打印把文本书写内部样式 ["<style>#ceshi{}</style>","",""]
        printDelay: 333,      // 布局完打印页面之后与真正执行打印功能中间的间隔
        copyTagClasses: false
    });

}
