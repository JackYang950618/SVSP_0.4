function reset() {
    $("#search-Id").val("");
    $("#search-wastesCode").val("");
    $("#search-wastesType").val("");
    $("#search-company").val("");
}
//全选复选框
function allSelect() {
    var isChecked = $('#allSel').prop('checked');
    if (isChecked) $("input[name='select']").prop('checked',true);
    else $("input[name='select']").prop('checked',false);
}
//克隆行方法
function addNewLine() {
    $('.selectpicker').selectpicker({
        language: 'zh_CN',
        size: 4
    });
    // 获取id为cloneTr的tr元素
    var tr = $("#plusBtn").prev();
    // 克隆tr，每次遍历都可以产生新的tr
    var clonedTr = tr.clone();
    // 克隆后清空新克隆出的行数据
    clonedTr.children("td:eq(1),td:eq(2),td:eq(3),td:eq(4),td:eq(5),td:eq(6),td:eq(7)").find("input").val("");
    // 获取编号
    var id = $("#plusBtn").prev().children().get(0).innerHTML;
    //console.log(id);
    var id1=(id.replace(/[^0-9]/ig,""));
    var num = parseInt(id1);
    num++;
    clonedTr.children().get(0).innerHTML = num;
    clonedTr.children("td:not(0)").find("input,select").each(function () {
        var name = $(this).prop('name');
        var newName = name.replace(/[0-9]\d*/, num-1);
        //console.log(newName);
        $(this).prop('name', newName);
    });
    clonedTr.insertAfter(tr);
    var delBtn = "<a class='btn btn-default btn-xs' onclick='delLine(this);'><span class='glyphicon glyphicon-minus' aria-hidden='true'></span></a>&nbsp;";
    clonedTr.children("td:eq(0)").prepend(delBtn);
      $('.selectpicker').data('selectpicker', null);
      $('.bootstrap-select').find("button:first").remove();
      $('.selectpicker').selectpicker();
      $('.selectpicker').selectpicker('refresh');
}
//删除行方法
function delLine(e) {
    var tr = e.parentElement.parentElement;
    tr.parentNode.removeChild(tr);
}
//保存月季采购方法
function saveMonth() {
    //思路先添加
    //1获取除物料需求外的数据
    //在添加物料表
    data={
        applyMouth:$('#applyMonth').val(),
        demandTime:$('#demandTime').val(),
        applyDepartment:$('#applyDepartment').val(),
        proposer:$('#proposer').val(),
        divisionHead:$('#divisionHead').val(),
        purchasingDirector:$('#purchasingDirector').val(),
        purchasingHead:$('#purchasingHead').val(),
        generalManager:$('#generalManager').val(),
        procurementCategory:1//代表是月季采购
    }
    //执行添加到后台的ajax
    $.ajax({
        type: "POST",                       // 方法类型
        url: "addProcurement",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(data),
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
            }
            else {

                alert(result.message);
            }
        },error:function (result) {
         alert("服务器异常！")
        }
    });
    $('.myclass').each(function () {
   var suppliesName=$(this).children('td').eq(1).children('div').find('button').attr('title');
   var specifications=$(this).children('td').eq(2).children('input').val();
   var unit=$(this).children('td').eq(3).children('input').val();
   var inventory=$(this).children('td').eq(4).children('input').val();
   var demandQuantity=$(this).children('td').eq(5).children('input').val();
   var note=$(this).children('td').eq(6).children('input').val();
   var materialdata={
        suppliesName:suppliesName,
        specifications:specifications,
        unit:unit,
        inventory:inventory,
        demandQuantity:demandQuantity,
        note:note,
    }
    console.log(materialdata);
        $('.selectpicker').selectpicker('refresh');
    $.ajax({
        type: "POST",                       // 方法类型
        url: "addMaterial",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(materialdata),
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
            }
            else {
                alert(result.message);
            }
        },
        error:function (result) {
            alert(result.message);
        }

    });

 });
    alert("添加成功！")
    if(confirm("是否跳转到主页？")){
    window.location.href="monthProcurement.html";
    }
}
//加载月度采购申请表数据列表
function getMontnProcurement() {
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getProcurementList",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        success:function (result) {
            if (result != undefined && result.status == "success"){
               // console.log(result)
                //设置月度采购申请表数据
                setMonthProcurementList(result);
            }
            else {

                alert(result.message);
            }
        },
        error:function (result) {
            alert("服务器异常！")

        }
    });

}
//设置月度采购申请表数据
function setMonthProcurementList(result) {
    //$('.myclass').hide();
    var tr = $("#cloneTr");
    tr.siblings().remove();
    console.log(result.data);
    tr.attr('class','myclass');

        $.each(result.data, function (index, item) {
            //console.log(item);
            // 克隆tr，每次遍历都可以产生新的tr
            if(item.procurementCategory==true) {
                var clonedTr = tr.clone();
                clonedTr.show();
                // 循环遍历cloneTr的每一个td元素，并赋值
                clonedTr.children("td").each(function (inner_index) {
                    //1生成领料单号
                    var obj = eval(item);
                    // 根据索引为部分td赋值
                    switch (inner_index) {
                        // 申请单编号
                        case (0):
                            $(this).html(obj.receiptNumber);
                            break;
                        // 申请月份
                        case (1):
                            $(this).html(obj.applyMouth);
                            break;
                        // 需求时间
                        case (2):
                            $(this).html(getDateStr(obj.demandTime));
                            break;
                        // 申请部门
                        case (3):
                            $(this).html(obj.applyDepartment);
                            break;
                        // 申购部门负责人
                        case (4):
                            $(this).html(obj.proposer);
                            break;
                        // 申购部门分管领导
                        case (5):
                            $(this).html(obj.divisionHead);
                            break;
                        // 采购部门负责人
                        case (6):
                            $(this).html(obj.purchasingDirector);
                            break;
                        //采购部门分管领导
                        case (7):
                            $(this).html(obj.purchasingHead);
                            break;
                        //总经理
                        case (8):
                            $(this).html(obj.generalManager);
                            break;
                        //物资类别
                        case (9):
                            if(obj.state!=null){
                                $(this).html(obj.state.name);
                            }
                            break;
                    }
                });
                // 把克隆好的tr追加到原来的tr前面
                // clonedTr.removeAttr("class");
                clonedTr.insertBefore(tr);
            }

        });


    // 隐藏无数据的tr
    tr.hide();
    tr.removeAttr('class');
}
//审批
function approval(item) {
    if(confirm("确定审批?")) {
        //点击确定后操作
        var receiptNumber = $(item).parent().parent().children('td').eq(0).text();
        $.ajax({
            type: "POST",                       // 方法类型
            url: "setProcurementListSubmit",          // url
            async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
            dataType: "json",
            data: {'receiptNumber': receiptNumber},
            success: function (result) {
                if (result != undefined && result.status == "success") {
                    alert(result.message);
                    window.location.reload();
                }
                else {
                    alert(result.message);
                }
            },
            error: function (result) {
                alert("服务器异常!");
            }
        });
    }

}
//提交
function submit(item) {
    if(confirm("确定提交?")) {
        //点击确定后操作
        var receiptNumber = $(item).parent().parent().children('td').eq(0).text();
        $.ajax({
            type: "POST",                       // 方法类型
            url: "setProcurementListSubmit",          // url
            async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
            dataType: "json",
            data: {'receiptNumber': receiptNumber},
            success: function (result) {
                if (result != undefined && result.status == "success") {
                    alert(result.message);
                    window.location.reload();
                }
                else {
                    alert(result.message);
                }
            },
            error: function (result) {
                alert("服务器异常!");
            }
        });
    }
    }
//作废
function cancel(item) {
    if(confirm("确定作废?")){
        //点击确定后操作
        var receiptNumber=$(item).parent().parent().children('td').eq(0).text();
        $.ajax({
            type: "POST",                       // 方法类型
            url: "setProcurementListCancel",          // url
            async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
            dataType: "json",
            data:{'receiptNumber':receiptNumber},
            success:function (result) {
                if (result != undefined && result.status == "success"){
                    alert(result.message);
                    window.location.reload();
                }
                else {
                    alert(result.message);
                }
            },
            error:function (result) {
                alert("服务器异常!");
            }
        });


    }


}
//查询
function view1(item) {
    var receiptNumber=$(item).parent().parent().children('td').eq(0).text();
    //console.log(receiptNumber);
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getProcurementListById",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        data:{'receiptNumber':receiptNumber},
        //contentType: 'application/json;charset=utf-8',
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
                setMonthProcurementListModal(result.data[0].materialList);
            }
            else {
                alert(result.message);
            }
        },
        error:function (result) {
            alert("服务器异常!");
        }
    });
    $('#appointModal2').modal('show');
}
//双击查询
function view(item) {
    var receiptNumber=$(item).children().get(0).innerHTML;
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getProcurementListById",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        data:{'receiptNumber':receiptNumber},
        //contentType: 'application/json;charset=utf-8',
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
                setMonthProcurementListModal(result.data[0].materialList);
            }
            else {
                alert(result.message);
            }
        },
        error:function (result) {
            alert("服务器异常!");
        }
    });
    $('#appointModal2').modal('show');
}
//设置月度采购申请表数据模态框数据
function setMonthProcurementListModal(result) {
    //$('.myclass1').hide();
    var tr = $("#cloneTr2");
    tr.siblings().remove();
    tr.attr('class','myclass1');
    $.each(result, function (index, item) {
        //console.log(item);
        // 克隆tr，每次遍历都可以产生新的tr
            var clonedTr = tr.clone();
            clonedTr.show();
            // 循环遍历cloneTr的每一个td元素，并赋值
            clonedTr.children("td").each(function (inner_index) {
                //1生成领料单号
                var obj = eval(item);
                // 根据索引为部分td赋值
                switch (inner_index) {
                    // 物资名称
                    case (0):
                        $(this).html(obj.suppliesName);
                        break;
                    // 规格型号
                    case (1):
                        $(this).html(obj.specifications);
                        break;
                    // 单位
                    case (2):
                        $(this).html(obj.unit);
                        break;
                    // 库存量
                    case (3):
                        $(this).html(obj.inventory);
                        break;
                    // 需求数量
                    case (4):
                        $(this).html(obj.demandQuantity);
                        break;
                    // 备注
                    case (5):
                        $(this).html(obj.note);
                        break;
                    // 采购部门负责人
                }
            });
            // 把克隆好的tr追加到原来的tr前面
            clonedTr.removeAttr("id");
            clonedTr.insertBefore(tr);


    });
    // 隐藏无数据的tr
    tr.hide();
    tr.removeAttr('class');
}
//高级查询
function searchProcurement() {
    if ($("#senior").is(':visible')) {
        data = {
            receiptNumber: $("#search-receiptNumber").val(),
            applyMouth: $("#search-applyMouth").val(),
            demandTime: $("#search-demandTime").val(),
            applyDepartment: $("#search-applyDepartment").val(),
            proposer: $("#search-proposer").val(),
            divisionHead: $("#search-divisionHead").val(),
            purchasingDirector: $("#search-purchasingDirector").val(),
            purchasingHead:$("#search-purchasingHead").val(),
            generalManager:$("#search-generalManager").val(),
        };
        //console.log(data);
    }
    $.ajax({
        type: "POST",                       // 方法类型
        url: "searchProcurement",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined && result.status == "success") {
                //console.log(result);
                setMonthProcurementList(result);
            } else {
                alert(result.message);
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
}
//加载辅料列表
function getIngredientsList() {
    $('.selectpicker').selectpicker({
        language: 'zh_CN',
        size: 4
    });
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getIngredientsList",          // url
        async: false,                       // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        // data:{'receiptNumber':receiptNumber},
        contentType: 'application/json;charset=utf-8',
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
               var suppliesName=$('#suppliesName');
               suppliesName.children().remove();
               $.each(result.stringList,function (index,item) {
                   var option = $('<option />');
                   option.val(item);
                   option.text(item);
                   suppliesName.append(option);
                   $('.selectpicker').selectpicker('refresh');
               });


            }
            else {
                alert(result.message);
            }
        },

        error:function (result) {
            alert("服务器异常！");
        }
    });
}


//粗查询
$(document).ready(function () {//页面载入是就会进行加载里面的内容
    var last;
    $('#searchContent').keyup(function (event) { //给Input赋予onkeyup事件
        last = event.timeStamp;//利用event的timeStamp来标记时间，这样每次的keyup事件都会修改last的值，注意last必需为全局变量
        setTimeout(function () {
            if(last-event.timeStamp==0){
                searchWastesAnalysis();
            }
        },400);
    });
});

//粗查询
function searchWastesAnalysis() {
    switchPage(1);
    $('.myclass').each(function () {
        $(this).show();
    });
    //1分页模糊查询
    array.length=0;//清空数组
    array1.length=0;
    for(var i=1;i<=totalPage();i++){
        switchPage(parseInt(i));
        array.push($('.myclass'));
    }
    var text=$('#searchContent').val();
    for(var j=0;j<array.length;j++){
        $.each(array[j],function () {
            //console.log(this);
            if(($(this).children('td').text().indexOf(text)==-1)){
                $(this).hide();
            }
            if($(this).children('td').text().indexOf(text)!=-1){
                array1.push($(this));
            }
        });
    }
    for(var i=0;i<array1.length;i++){
        $.each(array1[i],function () {
            $('#tbody1').append(this) ;
        });
    }

    if(text.length<=0){
        switchPage(1);
        $('.myclass').each(function () {
            $(this).show();
        })
    }
}