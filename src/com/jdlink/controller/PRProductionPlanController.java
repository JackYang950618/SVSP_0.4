package com.jdlink.controller;

import com.jdlink.domain.CheckState;
import com.jdlink.domain.Page;
import com.jdlink.domain.Produce.AuxiliaryConsumption;
import com.jdlink.domain.Produce.ProductionPlan;
import com.jdlink.service.ProductionPlanService;
import com.jdlink.util.DBUtil;
import com.jdlink.util.DateUtil;
import com.jdlink.util.ImportUtil;
import com.jdlink.util.RandomUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Controller
public class PRProductionPlanController {
    @Autowired
    ProductionPlanService productionPlanService;

    @RequestMapping("totalProductionPlanRecord")
    @ResponseBody
    public int totalProductionPlanRecord() {
        try {
            return productionPlanService.count();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @RequestMapping("searchProductionPlanTotal")
    @ResponseBody
    public int searchProductionPlanTotal(ProductionPlan productionPlan) {
        try {
            return productionPlanService.searchCount(productionPlan);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    @RequestMapping("loadPageProductionPlanList")
    @ResponseBody
    public String loadPageProductionPlanList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            // 取出查询客户
            List<ProductionPlan> productionPlanList = productionPlanService.listPage(page);
            // 计算最后页位置
            JSONArray array = JSONArray.fromArray(productionPlanList.toArray(new ProductionPlan[productionPlanList.size()]));
            res.put("data", array);
            res.put("status", "success");
            res.put("message", "分页数据获取成功!");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "分页数据获取失败！");
        }
        // 返回结果
        return res.toString();
    }

    /**
     * 查询功能
     *
     * @param
     * @return
     */
    @RequestMapping("searchProductionPlan")
    @ResponseBody
    public String searchSampleInfo(@RequestBody ProductionPlan productionPlan) {
        JSONObject res = new JSONObject();
        try {
            List<ProductionPlan> productionPlanList = productionPlanService.search(productionPlan);
            JSONArray data = JSONArray.fromArray(productionPlanList.toArray(new ProductionPlan[productionPlanList.size()]));
            res.put("status", "success");
            res.put("message", "查询成功");
            res.put("data", data);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "查询失败");
        }
        return res.toString();
    }

    @RequestMapping("getProductionPlanSeniorSelectedList")
    @ResponseBody
    public String getProductionPlanSeniorSelectedList() {
        JSONObject res = new JSONObject();
        // 获取枚举
        CheckState[] states = new CheckState[]{CheckState.NewBuild, CheckState.ToExamine, CheckState.Examining, CheckState.Approval, CheckState.Backed, CheckState.Invalid};
        JSONArray stateList = JSONArray.fromArray(states);
        res.put("stateList", stateList);
        return res.toString();
    }

    /**
     * 导入
     *
     * @param excelFile
     * @return
     */
    @RequestMapping("importProductionPlanExcel")
    @ResponseBody
    public String importProductionPlanExcel(MultipartFile excelFile) {
        JSONObject res = new JSONObject();
        try {
            Object[][] data = ImportUtil.getInstance().getExcelFileData(excelFile).get(0);
            {
                System.out.println("数据如下：");
                for (int i = 1; i < data.length; i++) {
                    for (int j = 0; j < data[0].length; j++) {
                        System.out.print(data[i][j].toString());
                        System.out.print(",");
                    }
                    System.out.println();
                }
            }
            ProductionPlan productionPlan = new ProductionPlan();
            for (int i = 1; i < data.length; i++) {
                productionPlan.setId(data[i][0].toString());
                productionPlan.setFounder(data[i][1].toString());
                AuxiliaryConsumption auxiliaryConsumption = new AuxiliaryConsumption();
                auxiliaryConsumption.setCalcareousLime(Float.parseFloat(data[i][2].toString()));
                auxiliaryConsumption.setWaterReducingAgent(Float.parseFloat(data[i][3].toString()));
                auxiliaryConsumption.setCommonActivatedCarbon(Float.parseFloat(data[i][4].toString()));
                auxiliaryConsumption.setNaclo(Float.parseFloat(data[i][5].toString()));
                auxiliaryConsumption.setActivatedCarbon(Float.parseFloat(data[i][6].toString()));
                auxiliaryConsumption.setStandardBox(Float.parseFloat(data[i][7].toString()));
                auxiliaryConsumption.setActivatedCarbonParticles(Float.parseFloat(data[i][8].toString()));
                auxiliaryConsumption.setWoodenPallets(Float.parseFloat(data[i][9].toString()));
                auxiliaryConsumption.setLye(Float.parseFloat(data[i][10].toString()));
                auxiliaryConsumption.setStandardTray_1m(Float.parseFloat(data[i][11].toString()));
                auxiliaryConsumption.setCausticSoda(Float.parseFloat(data[i][12].toString()));
                auxiliaryConsumption.setStandardTray_1_2m(Float.parseFloat(data[i][13].toString()));
                auxiliaryConsumption.setUrea(Float.parseFloat(data[i][14].toString()));
                auxiliaryConsumption.setSlagBag(Float.parseFloat(data[i][15].toString()));
                auxiliaryConsumption.setHydrochloricAcid(Float.parseFloat(data[i][16].toString()));
                auxiliaryConsumption.setFlyAshBag(Float.parseFloat(data[i][17].toString()));
                auxiliaryConsumption.setNahco3(Float.parseFloat(data[i][18].toString()));
                auxiliaryConsumption.setTonBox(Float.parseFloat(data[i][19].toString()));
                auxiliaryConsumption.setFlour(Float.parseFloat(data[i][20].toString()));
                auxiliaryConsumption.setSteam(Float.parseFloat(data[i][21].toString()));
                auxiliaryConsumption.setDefoamer(Float.parseFloat(data[i][22].toString()));
                auxiliaryConsumption.setDieselOil(Float.parseFloat(data[i][23].toString()));
                auxiliaryConsumption.setFlocculant(Float.parseFloat(data[i][24].toString()));
                auxiliaryConsumption.setNaturalGas(Float.parseFloat(data[i][25].toString()));
                auxiliaryConsumption.setSoftWaterReducingAgent(Float.parseFloat(data[i][26].toString()));
                auxiliaryConsumption.setElectricQuantity(Float.parseFloat(data[i][27].toString()));
                auxiliaryConsumption.setSoftWaterScaleInhibitor(Float.parseFloat(data[i][28].toString()));
                auxiliaryConsumption.setIndustrialWater(Float.parseFloat(data[i][29].toString()));
                auxiliaryConsumption.setpH(Float.parseFloat(data[i][30].toString()));
                auxiliaryConsumption.setTapWaterQuantity(Float.parseFloat(data[i][31].toString()));
                auxiliaryConsumption.setWaterReducingAgent(Float.parseFloat(data[i][32].toString()));
                productionPlan.setAuxiliaryConsumption(auxiliaryConsumption);
                productionPlan.setTransportRate(Float.parseFloat(data[i][33].toString()));
                productionPlan.setPlanQuantity(Float.parseFloat(data[i][34].toString()));

                ProductionPlan productionPlan1 = productionPlanService.getById(productionPlan.getId());
                if (productionPlan1 == null) {
                    //插入新数据
                    productionPlanService.add(productionPlan);
                } else {
                    //根据id更新数据
                    productionPlanService.update(productionPlan);
                }
            }
            res.put("status", "success");
            res.put("message", "导入成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "导入失败，请重试！");
        }
        return res.toString();
    }

    /**
     * 导出(带表头字段)
     *
     * @param name
     * @param response
     * @param sqlWords
     * @return
     */
    @RequestMapping("exportExcelProductionPlan")
    @ResponseBody
    public String exportExcel(String name, HttpServletResponse response, String sqlWords) {
        JSONObject res = new JSONObject();
        try {
            DBUtil db = new DBUtil();
            // 设置表头
            String tableHead = "产量计划单编号/创建日期/创建人/单据状态/计划运转率/计划数量/消石灰/污水用阻垢剂/" +
                    "普通活性炭粉/消毒液/高活性碳粉/标准箱/活性炭颗粒/木托盘/碱液/1m标准托盘/片碱/1.2m标准托盘/尿素" +
                    "/炉渣用吨袋/盐酸/飞灰用吨袋/小苏打(NaHCO3)/吨箱/面粉/蒸汽/消泡剂/柴油/絮凝剂(聚丙烯酰胺)/天然气/软水用还原剂/" +
                    "电量/软水用阻垢剂/工业水量/氨水(PH调节剂)/自来水量/污水用还原剂";
            name = "产量计划单";   // 重写文件名
            db.exportExcel2(name, response, sqlWords, tableHead);//HttpServletResponse response
            res.put("status", "success");
            res.put("message", "导出成功");
        } catch (IOException ex) {
            ex.printStackTrace();
            res.put("status", "fail");
            res.put("message", "导出失败，请重试！");
        }
        return res.toString();
    }

    /**
     * 审核通过
     *
     * @param
     * @return
     */
    @RequestMapping("approvalProductionPlan")
    @ResponseBody
    public String approvalProductionPlan(@RequestBody ProductionPlan productionPlan) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.approval(productionPlan);
            res.put("status", "success");
            res.put("message", "审核通过成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "审核通过失败！");
        }
        return res.toString();
    }

    /**
     * 驳回
     *
     * @param
     * @return
     */
    @RequestMapping("rejectProductionPlan")
    @ResponseBody
    public String rejectWayBill(@RequestBody ProductionPlan productionPlan) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.reject(productionPlan);
            res.put("status", "success");
            res.put("message", "审核驳回成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "审核驳回失败！");
        }
        return res.toString();
    }

    /**
     * 提交
     *
     * @param id
     * @return
     */
    @RequestMapping("submitProductionPlan")
    @ResponseBody
    public String submitProductionPlan(String id) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.submit(id);
            res.put("status", "success");
            res.put("message", "提交成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "提交失败！");
        }
        return res.toString();
    }

    /**
     * 作废
     *
     * @param id
     * @return
     */
    @RequestMapping("invalidProductionPlan")
    @ResponseBody
    public String invalidProductionPlan(String id) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.invalid(id);
            res.put("status", "success");
            res.put("message", "作废成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "作废失败！");
        }
        return res.toString();
    }

    /**
     * 确认
     *
     * @param id
     * @return
     */
    @RequestMapping("confirmProductionPlan")
    @ResponseBody
    public String confirmProductionPlan(String id) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.confirm(id);
            res.put("status", "success");
            res.put("message", "确认成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "确认失败！");
        }
        return res.toString();
    }

    @RequestMapping("getProductionPlan")
    @ResponseBody
    public String getProductionPlan(String id) {
        JSONObject res = new JSONObject();
        try {
            //根据id查询出相应的对象信息
            ProductionPlan productionPlan = productionPlanService.getById(id);
            //新建一个对象并给它赋值
            JSONObject data = JSONObject.fromBean(productionPlan);
            res.put("data", data);
            res.put("status", "success");
            res.put("message", "获取数据成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "获取数据失败");
        }
        return res.toString();
    }

    /**
     * 删除
     *
     * @param id
     * @return
     */
    @RequestMapping("deleteProductionPlan")
    @ResponseBody
    public String deleteProductionPlan(String id) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.delete(id);
            res.put("status", "success");
            res.put("message", "删除成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "删除失败！");
        }
        return res.toString();
    }

    @RequestMapping("addProductionPlan")
    @ResponseBody
    public String addProductionPlan(@RequestBody ProductionPlan productionPlan) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.add(productionPlan);
            res.put("status", "success");
            res.put("message", "保存成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "保存失败！");
        }
        return res.toString();
    }

    /**
     * 获取目前的产量计划单号
     *
     * @return
     */
    @RequestMapping("getCurrentProductionPlanId")
    @ResponseBody
    public String getCurrentProductionPlanId() {
        JSONObject res = new JSONObject();
        try {
            // 生成预约号
            Date date = new Date();   //获取当前时间
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
            String prefix = simpleDateFormat.format(date);
            int count = productionPlanService.countById(prefix) + 1;
            String suffix;
            if (count <= 9) suffix = "0" + count;
            else suffix = count + "";
            String id = RandomUtil.getAppointId(prefix, suffix);
            // 确保编号唯一
            while (productionPlanService.getById(id) != null) {
                int index = Integer.parseInt(id);
                index += 1;
                id = index + "";
            }
            res.put("id", id);
        } catch (Exception e) {
            e.printStackTrace();

        }
        return res.toString();
    }

    @RequestMapping("updateProductionPlan")
    @ResponseBody
    public String updateProductionPlan(@RequestBody ProductionPlan productionPlan) {
        JSONObject res = new JSONObject();
        try {
            productionPlanService.update(productionPlan);
            res.put("status", "success");
            res.put("message", "修改成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "修改失败！");
        }
        return res.toString();
    }
}

