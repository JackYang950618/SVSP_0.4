<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jstl/fmt_rt" prefix="fmt" %>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>合同新增</title>
    <script src="js/jquery/2.0.0/jquery.min.js"></script>
    <script src="js/jquery/2.0.0/jquery.serializejson.js"></script>
    <link href="css/bootstrap/3.3.6/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap-datetimepicker.min.css" rel="stylesheet" media="screen">
    <link href="css/bootstrap/bootstrap-select.min.css" type="text/css" rel="stylesheet">
    <link href="css/dashboard.css" rel="stylesheet">
    <script type="text/javascript" src="js/bootstrap/bootstrap-datetimepicker.js" charset="UTF-8"></script>
    <script src="js/bootstrap/3.3.6/bootstrap.min.js"></script>
    <script src="js/bootstrap/bootstrap-datetimepicker.zh-CN.js"></script>
    <script src="js/bootstrap/bootstrap-select.min.js"></script>
    <script src="js/bootstrap/defaults-zh_CN.min.js"></script>
    <link href="css/dropdown-submenu.css" rel="stylesheet">
</head>
<script type="text/javascript">
    function loadContractSelectList() {
//取得下拉菜单的选项
        $.ajax({
            type: "POST",                            // 方法类型
            url: "getContractList",                  // url
            dataType: "json",
            success: function (result) {
                if (result != undefined) {
                    var data = eval(result);
                } else {
                    console.log(result);
                }
            },
            error:function (result) {
                console.log(result);
            }
        });
    }
</script>
<style>
    .focus {
        outline: none;
        border: 0px;
    }
</style>
<body onload="loadContractSelectList();">
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">产废服务平台</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="wastesPlatform.html">首页</a></li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">客户管理<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="clientBackup.html">客户备案</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="salesManage.html">业务员分配管理</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="questionnaireManage.html">危废数据调查表管理</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="sampleManage.html">客户样品登记</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">供应商管理<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="supplierBackup.html">供应商备案</a></li>
                    </ul>
                </li>
                <li class="dropdown active">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">合同管理<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="contractManage.html">合同列表</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="contractTemplate.html">合同模板</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">价格管理<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="quotation.html">报价管理</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="cost.html">成本管理</a></li>
                    </ul>
                </li>
                <li><a href="archivesManage.html">一企一档</a></li>

            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span class="glyphicon glyphicon-user"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">个人信息</a></li>
                        <li><a href="#">待办事项</a></li>
                        <li><a href="index.html">注销</a></li>
                    </ul>
                </li>
            </ul>
        </div><!--/.nav-collapse -->
    </div>
</nav>
<div class="container-fluid" style="width: 80%">
    <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
            <ul class="nav nav-sidebar">
                <li><a href="wastesPlatform.html">概览</a></li>
                <li class="active"><a href="#">商务管理 <span class="sr-only">(current)</span></a></li>
                <li><a href="#">接收管理</a></li>
                <li><a href="#">贮存管理</a></li>
                <li><a href="#">预处理管理</a></li>
                <li><a href="#">处置管理</a></li>
                <li><a href="#">次生管理</a></li>
                <li><a href="#">基础数据</a></li>
                <li><a href="#">系统设置</a></li>
            </ul>
        </div>
    </div>
    <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <div class="row">
            <ol class="breadcrumb">
                <li><a href="businessModel.html">商务管理</a></li>
                <li><a href="#">合同管理</a></li>
                <li><a href="contractManage.html">合同列表</a></li>
            </ol>
        </div>
        <h2 class="sub-header" align="center">危险废物应急处置意向书</h2>
    <form method="post" id="contractInfoForm" enctype="multipart/form-data" >
            <div class="row">
                <div class="form-horizontal col-md-4" >
                    <div class="form-group" >
                        <label for="contractId" class="col-sm-4 control-label">合同编号</label>
                        <div class="col-xs-4" >
                            <input type="text" class="form-control" id="contractId" name="contractId" value="${emergency.contractId}" readonly >
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-4" >
                </div>
                <div class="form-horizontal col-md-4" >
                    <div class="form-group">
                        <label class="col-sm-6 control-label" for="area"> 所属区域</label>
                        <div class="col-xs-6">
                            <input type="text" class="form-control"  name="area" id="area"  value="${emergency.area}" >
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-4pull-left">
                    <div class="form-group pull-left" >
                        <label  class="col-sm-4 control-label" for="companyName">甲方：</label>
                        <div class="col-xs-8">
                            <input class="form-control" id="companyName" name="companyName" value="${emergency.companyName}">
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-8">

                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-8 pull-left">
                    <div class="form-group pull-left" >
                        <label  class="col-sm-4 control-label">乙方：</label>
                        <div class="col-xs-8">
                            <p>北控安耐得环保科技发展常州有限公司</p>
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-4"></div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-12">
                    <div class="form-group">
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为加强企业危险废物的管理，防止危险废物污染环境，根据《中华人民共和国固体废物污染环境防治法》的要求，甲乙双方经友好协商，
                            就甲方生产的工业危险废物(以下简称“危废”)处置事宜，达成如下合同：</p>
                    </div>
                </div>
            </div>
            <h5><b>一、委托事项</b></h5>
            <div class="row">
                <div class="form-horizontal col-md-12">
                    <div class="form-group">
                        <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;双方经友好协商，本着平等互利的原则，就<input type="text" style="width: 60px" class="focus" name="thing" value="${emergency.thing}">需应急处置的危险废弃物进行安全处置事宜
                            达成一致意见，具体内容如下：</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-8">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="wasteName">危险废物的名称及数量：</label>
                    </div>
                </div>
                <div class="form-horizontal col-md-4"></div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="wasteName" >名称：</label>
                        <div class="col-xs-4">
                            <p><input class="form-control focus" id="wasteName" name="wasteName" style="width: 100px" maxlength="18" value="${emergency.wasteName}" >[HW（）]</p>
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="tonNumber">数量：</label>
                        <div class="col-xs-4">
                            <p><input class="form-control focus" id="tonNumber" name="tonNumber" style="width: 50px" maxlength="10">[吨每年<input type="text" style="width: 40px" class="focus" maxlength="8">t/a]</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="name2">名称：</label>
                        <div class="col-xs-4">
                            <p><input class="form-control focus" id="name2" name="wasteName" style="width: 100px" maxlength="18">[HW（）]</p>
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="number2">数量：</label>
                        <div class="col-xs-4">
                            <p><input class="form-control focus" id="number2" name="tonNumber" style="width: 50px" maxlength="10">[吨每年<input type="text" style="width: 40px" class="focus" maxlength="8">t/a]</p>
                        </div>
                    </div>
                </div>
            </div>
            <h5><b>二、其他</b></h5>
            <div class="row">
                <div class="form-horizontal col-md-12">
                    <div class="form-group">
                        <p>
                            &nbsp;&nbsp;2.1危险废弃物的交付时间：经环保部门审批后，且乙方取得危险废物许可证后，签订危险废物应急处置合同，并开始废物转移。
                        </p>
                        <p>
                            &nbsp;&nbsp;2.2本合同一式六份，甲方执三份，乙方执三份。本合同经双方签字盖章，且经环保部门审批后生效。
                        </p>
                        <p>
                            &nbsp;&nbsp;2.3本合同有效期自2018年1月至2018年12月。
                        </p>
                        <p>
                            &nbsp;&nbsp;2.4本合同未尽事宜，甲乙双方可商定补充协议，补充协议经双方签字盖章后与本合同具有同等法律效力。
                        </p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">甲方单位(盖章)</label>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">乙方单位(盖章)</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="companyLegal">法定代表人：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="companyLegal" name="companyLegal" value="${emergency.companyLegal}">
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="clientLegal">企业负责人：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="clientLegal" name="clientLegal" value="${emergency.clientLegal}" >
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="companyAgent">委托代理人：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="companyAgent" name="companyAgent" value="${emergency.companyAgent}" >
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="clientAgent">委托代理人：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="clientAgent" name="clientAgent" value="${emergency.clientAgent}">
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="telephone">联系电话：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="telephone" name="telephone" value="${emergency.telephone}">
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">联系电话：</label>
                        <div class="col-xs-4">
                            <p>0519-86763880</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="address">单位地址：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="address" name="address" value="${emergency.address}">
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">单位地址：</label>
                        <div class="col-xs-4">
                            <p>新北区春江镇江边工业园滨江三路1号</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="bankName">开户：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="bankName" name="bankName" value="${emergency.bankName}">
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">开户：</label>
                        <div class="col-xs-4">
                            <p>建行常州新北支行</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label" for="bankAccount">账号：</label>
                        <div class="col-xs-4">
                            <input class="form-control" id="bankAccount" name="bankAccount" value="${emergency.bankAccount}">
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">账号：</label>
                        <div class="col-xs-4">
                            <p>1105021909000017734</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">日期：</label>
                        <div class="col-xs-4">
                            <p>&nbsp;年&nbsp;月&nbsp;日</p>
                        </div>
                    </div>
                </div>
                <div class="form-horizontal col-md-6">
                    <div class="form-group" >
                        <label  class="col-sm-4 control-label">日期：</label>
                        <div class="col-xs-4">
                            <p>&nbsp;年&nbsp;月&nbsp;日</p>
                        </div>
                    </div>
                </div>
            </div>
            <br>
            <br>
            <div class="row text-center">
                <a class="btn btn-success" onclick="contractAdjustSave1()">保存修改</a>
                <a class="btn btn-primary" onclick="contractAdjustSave()">提交修改</a>
                <a class="btn btn-danger" href="contractManage.html" id="back">返回</a>
            </div>
        </form>
    </div>
</div>
</body>
<script>
    $('.form_datetime1').datetimepicker({
        format: 'yyyy-mm-dd',
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
    $('.form_datetime2').datetimepicker({
        format: 'yyyy-mm-dd',
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });
    function contractAdjustSave1() {
        contractId='${contract.contractId}';
        $.ajax({
            type: "POST",                            // 方法类型
            url: "saveAdjustEmContract",                       // url
            async: false,                           // 同步：意思是当有返回值以后才会进行后面的js程序
            data: JSON.stringify($('#contractInfoForm').serializeJSON()),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result != undefined) {
                    // console.log(eval(result));
                    console.log("success: " + result);
                    alert("保存修改成功!");
                    //$(location).attr('href', 'contractManage.html');//跳转
                    $(location).attr('href', 'contractManage.html');
                    localStorage.name="Emergency";
                    location.href="contractManage.html";
                } else {
                    console.log("fail: " + result);
                    alert("保存失败!");
                }
            },
            error: function (result) {
                console.log("error: " + result);
                alert("服务器异常!");
            }
        });
    }
    $('#back').click(function () {
        $(location).attr('href', 'contractManage.html');
        localStorage.name="Emergency";
        location.href="contractManage.html";
    });
</script>
</html>