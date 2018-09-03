/**加载库存的数据
 * 
 */
var isSearch = false;
array=[];//数组用来存放入库编号
array1=[]//数组用来存放剩余量的
function  batchingList() {
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getWasteInventoryList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success:function (result) {
         if(result != undefined && result.status == "success"){
             console.log(result);
             //设置库存列表
             setWasteInventoryList(result.data);
         }
         else {
             console.log(result.message);
         }
        },
        error:function (result) {
        alert("服务器异常！")
        }

    });
    //加载高级查询数据
    setSeniorSelectedList();
}
/**
 * 重置搜索数据
 */
function reset() {
    $("#senior").find("input").val("");
    $("#senior").find("select").get(0).selectedIndex = -1;
}

/**设置库存列表数据
 */
function setWasteInventoryList(result) {
    $(".myclass").hide();
    var tr = $("#cloneTr");
    tr.attr('class','myclass')
    console.log(result);
    //tr.siblings().remove();
        $.each(result, function (index, item) {
            if(item.actualCount>0){
                // 克隆tr，每次遍历都可以产生新的tr
                var clonedTr = tr.clone();
                clonedTr.show();
                // 循环遍历cloneTr的每一个td元素，并赋值
                clonedTr.children("td").each(function (inner_index) {
                    var obj = eval(item);
                    // 根据索引为部分td赋值
                    switch (inner_index) {
                        // 入库编号
                        case (1):
                            $(this).html(obj.inboundOrderId);

                            break;
                        // 仓库号
                        case (2):
                            if (obj.wareHouse == null) {
                                $(this).html("");
                            }
                            else {
                                $(this).html(obj.wareHouse.wareHouseId);
                            }
                            break;
                        //产废单位
                        case (3):
                            $(this).html(obj.wastes.client.companyName);
                            break;
                        // 危废名称
                        case (4):
                            $(this).html(obj.wastes.name);
                            break;
                        // 危废代码
                        case (5):
                            $(this).html(obj.wastes.wastesId);
                            break;
                        // 产废类别
                        case (6):
                            $(this).html("");
                            break;
                        // 进料方式
                        case (7):
                            $(this).html(obj.wastes.handleCategory.name);
                            break;
                        //数量
                        case (8):
                            $(this).html(obj.actualCount);
                            break;
                        //剩余数量
                        case (9):
                            $(this).html(obj.leftNumeber);
                            break;
                        case (10):
                            $(this).html(obj.wastes.remarks);
                            break;

                    }
                });
                // 把克隆好的tr追加到原来的tr前面
                clonedTr.removeAttr("id");
                clonedTr.insertBefore(tr);
            }
        });
        // 隐藏无数据的tr
        tr.hide();
    tr.removeAttr('class');

    //遍历赋值
    $(".myclass").each(function(){
        //1获得入库单号
        var inboundOrderId=this.firstElementChild.nextElementSibling.innerHTML;
        //console.log(inboundOrderId);
       $("#residualQuantity").attr("name",inboundOrderId);
        $("#residualQuantity").removeAttr('id');
    });


}
/*配料*/
function batching() {
    var items = $("input[name='select']:checked");//判断复选框是否选中
    items.each(function () {
        //获得库存Id
      var inboundOrderId=  $(this).parent().parent().next().html();
      //根据id获得库存的信息，进行转移放到配料中
        $.ajax({
            type: "POST",                       // 方法类型
            url: "getWasteInventoryByInboundOrderId",                  // url
            async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
            dataType: "json",
            data:{'inboundOrderId':inboundOrderId},
            success:function (result) {
                if(result != undefined && result.status == "success"){
                   console.log(result);
                    //设置配料列表
                    setBatchingWList(result.data);
                    //赋值配料单号这里为自动生成
                    $("#batchingOrderId").val(result.batchingOrderId);
                }
                else {
                    console.log(result.message);
                }
            },
            error:function (result) {
                alert("服务器异常！")
            }

        });
    });
}
/**设置配料列表数据
 *
 */
function setBatchingWList(result) {
    var tr = $("#cloneTr2");
    tr.attr('class','myclass2');
    //tr.siblings().remove();
    //console.log(result);
    $.each(result, function (index, item) {
        // 克隆tr，每次遍历都可以产生新的tr
        var clonedTr = tr.clone();
        clonedTr.show();
        // 循环遍历cloneTr的每一个td元素，并赋值
        clonedTr.children("td").each(function (inner_index) {
            var obj=eval(item);
            // 根据索引为部分td赋值
            switch (inner_index) {
                // 入库编号
                case (0):
                    $(this).html(obj.inboundOrderId);
                    break;
                // 仓库号
                case (1):
                    if(obj.wareHouse==null){
                        $(this).html("");
                    }
                    else {
                        $(this).html(obj.wareHouse.wareHouseId);
                    }
                    break;
                //产废单位
                case (2):
                    $(this).html(obj.wastes.client.companyName);
                    break;
                // 危废名称
                case (3):
                    $(this).html(obj.wastes.name);
                    break;
                // 危废代码
                case (4):
                    $(this).html(obj.wastes.wastesId);
                    break;
                // 产废类别
                case (5):
                    $(this).html("");
                    break;
                // 进料方式
                case (6):
                    $(this).html(obj.wastes.handleCategory.name);
                    break;
                //数量
                case (7):
                    break;
                case (8):
                    $(this).html(obj.wastes.remarks);
                    break;
                case (9):
                    $(this).html(obj.wasteInventoryId);
                    break;
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
//加载高级查询数据
function setSeniorSelectedList() {
    $('.selectpicker').selectpicker({
        language: 'zh_CN',
        size: 4
    });//下拉框样式
    //查找枚举的信息
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getSeniorList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        success: function (result) {
            if (result != undefined && result.status == "success") {
               // console.log(result);
                var data = eval(result);
                // 高级检索下拉框数据填充
                //进料方式
                var handelCategory = $("#search-handelCategory");
                handelCategory.children().remove();
                $.each(data.handelCategoryList, function (index, item) {
                    var option = $('<option />');
                    option.val(index);
                    option.text(item.name);
                    handelCategory.append(option);
                });
                handelCategory.get(0).selectedIndex = -1;
                //危废代码
                var wastesInfoList = $("#search-wasteId");
                // 清空遗留元素
                wastesInfoList.children().remove();
                $.each(data.data, function (index, item) {
                    var option = $('<option />');
                    option.val(item.code);
                    option.text(item.code);
                    wastesInfoList.append(option);
                });
                wastesInfoList.removeAttr('id');
                $('.selectpicker').selectpicker('refresh');
                var companyList=$("#search-companyName");
                companyList.children().remove();
                $.each(data.array, function (index, item) {
                    var option = $('<option />');
                    option.val(item.clientId);
                    option.text(item.companyName);
                    companyList.append(option);
                });
                companyList.removeAttr('id');
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
//高级查询功能
function searchInventory() {
    // 精确查询
    if ($("#senior").is(':visible')) {
        data = {
            inboundDate:$("#search-inboundDate").val(),
            wastes:{ handleCategory: $("#search-handelCategory").val(), wastesId:$("select[name='search-wasteId']").selectpicker('val')},
            produceCompany:{companyName:$("select[name='search-companyName']").selectpicker('val')}};
        };
        console.log(data);
    $.ajax({
        type: "POST",                       // 方法类型
        url: "searchInventory",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined && result.status == "success") {
                console.log(result);
                setWasteInventoryList(result.data);
            } else {
                alert(result.message);
            }
        },
        error: function (result) {
            console.log(result);
        }
    });
    isSearch = true;
}
//数量加减
function adjustNumber(item) {
    var inboundOrderId=item.parentElement.firstElementChild.innerHTML;
    console.log(inboundOrderId);
    var td=$("td[name='123']");//找到指定的单元格
    var td1=$("td[name='321']");
    if(td.length!=0){
        td.each(function () {
            //获得指定的入库单号
            var content = $(this).html();//获得内容
            var name = $(this).attr('name');
            if (name.search("123") != -1) {
                $(this).attr('name', '321');
                $(this).html("<input type='text' style='width: 100px;' value="+content+" name='count'  id='input1' onkeyup='subtraction(this);'>");
            }
        });
    }
    if(td1.length!=0){
        $(td1).html($("#input1").val());
        $("#input1").remove();
        $(td1).attr('name', '123');
       $(td).html("<td class='text-right modal-packingType' onclick=' adjustNumber(this);'>");
    }


}
//数量加减
function subtraction(item) {
    //获得相应的入库单号
    var flag=false;
    var inboundOrderId = item.parentElement.parentElement.firstElementChild.innerHTML;
    var number=$(item).val();
    //1根据入库单号获得总量，然后根据配料量减去得到剩余量
    setTimeout(time(inboundOrderId,number), 2000);
  // console.log(array)
    //进行运算
}
function time(inboundOrderId,number) {
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getWasteInventoryLeftNumber",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        data: {'inboundOrderId':inboundOrderId,'number':number},
        dataType: "json",
        // contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result != undefined && result.status == "success") {
                console.log(result);
                $("td[name="+inboundOrderId+"]").html(result.leftNumber);
            } else {
                alert(result.message);
            }
        },
        error: function (result) {
            alert("服务器异常！")
        }
    });
}
//保存
function save() {
    $(".myclass2").each(function () {
        var data={
            batchingOrderId:$("#batchingOrderId").val(),//配料编号
            inboundOrder:{ inboundOrderId:this.firstElementChild.innerHTML,},
            wareHouse:{ wareHouseId:this.firstElementChild.nextElementSibling.innerHTML},
            produceCompany:{companyName:this.firstElementChild.nextElementSibling.nextElementSibling.innerHTML},
            // wastes:{wastesId:this.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML,//危废代码
            // //  // name:this.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML,
            //      },
            // wasteType:this.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML,
            batchingNumber:this.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.value,
           'remarks':this.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML,
            batchingDate:$("#date").val(),//配料日期
            createDate:$("#createDate").val(),//创建日期
            creator:$("#creator").val(),
            wasteInventory:{wastes:{name:this.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML,wastesId:this.firstElementChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML},
                }


    };
        console.log(data);
        $.ajax({
                type: "POST",                       // 方法类型
                url: "addBatchingOrder",                  // url
                async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
                data: JSON.stringify(data),
                dataType: "json",
               contentType: "application/json; charset=utf-8",
            success:function (result) {
                if (result != undefined && result.status == "success"){
                    console.log(result);
                }
                else {
                    alert(result.message);

                }
            },

            error:function (result) {
                    alert("服务器异常")

            }
        });
    });
    alert("添加成功！");
    window.location.href="ingredientsList.html";
}
//配料单显示页面加载
function loadBatchingOrderList() {
//1执行ajax取数据
    $.ajax({
        type: "POST",                       // 方法类型
        url: "getBatchOrderList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
               setBatchingOrderList(result.batchingOrderList);
            }
            else
                alert(result.message);

        },
        error:function (result) {
            alert("服务器异常！");
        }


    });



}
//加载配料单数据源
function setBatchingOrderList(result) {
        var tr = $("#cloneTr3");
        tr.siblings().remove();
        $.each(result, function (index, item) {
            // 克隆tr，每次遍历都可以产生新的tr
            if(item.checkState.name=='待领料'){
                var clonedTr = tr.clone();
                clonedTr.show();
                // 循环遍历cloneTr的每一个td元素，并赋值
                clonedTr.children("td").each(function (inner_index) {
                    var obj = eval(item);
                    // 根据索引为部分td赋值
                    switch (inner_index) {
                        // 序号
                        case (1):
                            $(this).html(parseInt(index)+1);
                            break;
                        // 配料单号
                        case (2):
                            $(this).html(obj.batchingOrderId);
                            break;
                        // 危废名称
                        case (3):
                            if(obj.wasteInventory.wastes!=null){
                                $(this).html(obj.wasteInventory.wastes.name);
                            }
                            else {
                                $(this).html("");
                            }

                            break;
                        // 处理类别
                        case (4):
                            if(obj.wasteInventory.wastes.processWay!=null){
                                $(this).html(obj.wasteInventory.wastes.processWay.name);
                            }
                            else {
                                $(this).html("");
                            }

                            break;
                        // 数量
                        case (5):
                            $(this).html(obj.batchingNumber);
                            break;
                        // 计量单位
                        case (6):
                            if(obj.wasteInventory.wastes!=null){
                                $(this).html(obj.wasteInventory.wastes.unit);
                            }
                            else {
                                $(this).html("");
                            }
                            break;
                        // 产废单位
                        case (7):
                            if(obj.wasteInventory.wastes.client!=null){
                                $(this).html(obj.wasteInventory.wastes.client.companyName);
                            }
                            else {
                                $(this).html("");
                            }
                            break;
                        //创建人
                        case (8):
                            $(this).html(obj.creator);
                            break;
                        //创建日期
                        case (9):
                            if(obj.createDate!=null){
                                $(this).html(getDateStr(obj.createDate));
                            }
                            else {
                                $(this).html("");
                            }
                            break;
                        //备注
                        case (10):
                            $(this).html(obj.remarks);
                            break;
                        //状态
                        case (11):
                            $(this).html(obj.checkState.name);
                            break;
                    }
                });
                // 把克隆好的tr追加到原来的tr前面
                clonedTr.removeAttr("id");
                clonedTr.insertBefore(tr);
            }
        });
        // 隐藏无数据的tr
        tr.hide();
}
//生成领料单
 function generateRequisition(){

     var items = $("input[name='select']:checked");//判断复选框是否选中
     // for (var i=1;i<items.length;i++) {
     //     //获得配料单号
     //     var batchingOrderId=  $(items).parent().parent().next().next().html();
     //     console.log(batchingOrderId);
     //     //危废名称
     //     var name= $(this).parent().parent().next().next().next().html();
     //     //处理类别
     //     var handelCatogory=$(this).parent().parent().next().next().next().next().html();
     //     //数量
     //     var batchingNumber=$(this).parent().parent().next().next().next().next().next().html();
     //     //计量单位
     //     var unit=$(this).parent().parent().next().next().next().next().next().next().html();
     //     //产废单位
     //     var produceCompany=$(this).parent().parent().next().next().next().next().next().next().next().html();
     //     //创建人
     //     var creator=$(this).parent().parent().next().next().next().next().next().next().next().next().html();
     //     data={
     //         batchingOrder:{batchingOrderId:batchingOrderId,
     //             creator:creator,
     //             batchingNumber:batchingNumber,
     //             wasteInventory:{wastes:{name:name,unit:unit,client:{companyName:produceCompany,}}},},
     //     },
     //         //根据id获得库存的信息，进行转移放到配料中
     //         add(data);
     // }
     if(items.length>0){
         items.each(function () {
             //获得配料单号
             var batchingOrderId=  $(this).parent().parent().next().next().html();
             //危废名称
             var namename= $(this).parent().parent().next().next().next().html();
             //处理类别
             var handelCatogory=$(this).parent().parent().next().next().next().next().html();
             //数量
             var batchingNumber=$(this).parent().parent().next().next().next().next().next().html();
             //计量单位
             var unit=$(this).parent().parent().next().next().next().next().next().next().html();
             //产废单位
             var produceCompany=$(this).parent().parent().next().next().next().next().next().next().next().html();
             //创建人
             var creator=$(this).parent().parent().next().next().next().next().next().next().next().next().html();
             data={
                 batchingOrder:{batchingOrderId:batchingOrderId,
                     creator:creator,
                     batchingNumber:batchingNumber,
                     wasteInventory:{wastes:{name:name,unit:unit,client:{companyName:produceCompany,}}},},


             },
                 //点击确定后操作
    //根据id获得库存的信息，进行转移放到配料中
             add(data);
         });
         alert("领料成功！");
         //在这里进行领料单操作赋值
         // $.ajax({
         //     type: "POST",                       // 方法类型
         //     url: "updateMaterialRequisitionId",                  // url
         //     async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
         //     dataType: "json",
         //     contentType: "application/json; charset=utf-8",
         //     success:function (result) {
         //
         //     },
         //     error:function (result) {
         //
         //     }
         // });
         if(confirm("是否跳转到领料单页面?")){
             window.location.href="materialRequisition1.html";

         }
     }
    else {
         alert("请勾选数据！")
     }
 }
 //生成领料单1
function add(data) {
    $.ajax({
        type: "POST",                       // 方法类型
        url: "addRequisition",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success:function (result) {
            if(result != undefined && result.status == "success"){
                console.log(result);
            }
            else {
                console.log(result.message);
            }
        },
        error:function (result) {
            alert("服务器异常！")
        }

    });
}
//领料单新增页面预加载
function loadMaterialRequisitionList(){

    $.ajax({
        type: "POST",                       // 方法类型
        url: "getMaterialRequisitionList",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
                //设置领料单新增列表
                //赋值配料单
                //1重新做一个方法用来生成领料单号

                setMaterialRequisitionList(result.jsonArray);
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
//设置领料单新增列表
function setMaterialRequisitionList(result) {
    var tr = $("#cloneTr1");
    tr.attr('class','myclass');

    $.each(result, function (index, item) {
            // 克隆tr，每次遍历都可以产生新的tr
            if(item.checkState.name=='已领料'){
                var clonedTr = tr.clone();
                clonedTr.show();

                // 循环遍历cloneTr的每一个td元素，并赋值
                clonedTr.children("td").each(function (inner_index) {
                    //1生成领料单号
                    var obj = eval(item);
                    // 根据索引为部分td赋值
                    switch (inner_index) {
                        // 领料单号
                        case (0):

                            $(this).html(obj.materialRequisitionId);
                            break;
                        // 厂家
                        case (1):
                            if(obj.batchingOrder.wasteInventory.wastes.client!=null){
                                $(this).html(obj.batchingOrder.wasteInventory.wastes.client.companyName);
                            }
                            break;
                        // 危废名称
                        case (2):
                            $(this).html(obj.batchingOrder.wasteInventory.wastes.name);
                            break;
                        // 危废代码
                        case (3):
                            $(this).html(obj.batchingOrder.wasteInventory.wastes.wastesId);
                            break;
                        // 危废类别
                        case (4):
                            $(this).html("");
                            break;
                        // 单位
                        case (5):
                            $(this).html(obj.batchingOrder.wasteInventory.wastes.unit);
                            break;
                        // 配料数量
                        case (6):
                            $(this).html(obj.batchingOrder.batchingNumber);
                            break;
                        //领用数量
                        case (7):
                            $(this).html(obj.batchingOrder.batchingNumber);
                            break;
                        //附注
                        case (8):
                            $(this).html(obj.batchingOrder.wasteInventory.wastes.remarks);
                            break;
                        case (9):
                            $(this).html(obj.batchingOrder.batchingOrderId);
                            break;
                    }
                });
                // 把克隆好的tr追加到原来的tr前面
                clonedTr.removeAttr("id");
                clonedTr.insertBefore(tr);
            }
        });
    // 隐藏无数据的tr
    tr.hide();
    tr.removeAttr('class');

}
//判断是否存在领料单号
function isMaterialRequisitionOrderId() {
    $.ajax({
        type: "POST",                       // 方法类型
        url: "isMaterialRequisitionOrderId",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        contentType: "application/json; charset=utf-8",
       success:function (result) {
           if (result != undefined && result.status == "success"){
               //console.log(result.theNewestmaterialRequisitionOrderId);
               theNewestmaterialRequisitionOrderId=result.theNewestmaterialRequisitionOrderId;
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
//生成领料单号(当数据库没有领料单的时候)
function generateRequisitionNumber(index) {
   var date=new Date();
   var year=(date.getFullYear()).toString();
   var mouth=((date.getMonth()+1)).toString();
   while (index.toString().length!=3) {
       index="0"+index;
   }

   if(mouth.length!=2){
       mouth="0"+mouth;
   }
  return year+mouth+index;

}
//生成领料单号(当数据库存在领料单的时候)
function generateRequisitionNumber1(theNewestmaterialRequisitionOrderId) {
    var s= theNewestmaterialRequisitionOrderId;//原字符串
    var s2 = s.substring(s.length - 3, s.length);//最后一个3字符
    var s1=s.substring(0, s.length - 3);
    var number = getString3((parseInt(s2) + 1));
    return s1+number;
}
function getString3(number) {
    while (number.length!=3){
        number="0"+number;
    }
    return number;
}
//保存领料单 实则是更新
function updateMaterialRequisitionOrder() {
    if(confirm("确认领料?")){
//1遍历
        $('.myclass').each(function (index) {
            var materialRequisitionId= $(this).children().get(0).innerHTML;//领料单
            //厂家
            var companyName=$(this).children().get(1).innerHTML;
            //危废名称
            var name=$(this).children().get(2).innerHTML;
            //危废代码
            var wasteId=$(this).children().get(3).innerHTML;
            //危废类别
            var category=$(this).children().get(3).innerHTML;
            //单位
            var unit=$(this).children().get(4).innerHTML;
            //配料数量
            var batchingNumber=$(this).children().get(5).innerHTML;
            //领用数量
            var recipientsNumber=$(this).children().get(6).innerHTML;
            //附注
            var remarks=$(this).children().get(7).innerHTML;
            //部门
            var departmentName=$("#departmentName").val();
            //主管副总经理
            var deputyGeneral=$("#deputyGeneral").val();
            //仓库部门主管
            var warehouseManager=$("#warehouseManager").val();
            //保管员
            var guardian=$("#guardian").val();
            //	领料部门主管
            var materialManager=$("#materialManager").val();
            //领料人
            var picker=$("#picker").val();
            data={
                departmentName:departmentName,
                deputyGeneral:deputyGeneral,
                warehouseManager:warehouseManager,
                guardian:guardian,
                materialManager:materialManager,
                picker:picker,
                materialRequisitionId:materialRequisitionId
            };
            update(data);
        });
        if(confirm("是否跳转到领料单列表页面?")){
            //点击确定后操作
            window.location.href="materialRequisition.html"
        }
    }

}
//更新领料单的特有数据
function update(data) {
    $.ajax({
        type: "POST",                       // 方法类型
        url: "updateMaterialRequisitionOrder",                  // url
        async: false,                      // 同步：意思是当有返回值以后才会进行后面的js程序
        dataType: "json",
        data:JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success:function (result) {
            if (result != undefined && result.status == "success"){
                console.log(result);
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