package com.jdlink.controller;

import com.jdlink.domain.CheckState;
import com.jdlink.domain.Client;
import com.jdlink.domain.Dictionary.DataDictionaryItem;
import com.jdlink.domain.Dictionary.EquipmentDataItem;
import com.jdlink.domain.Dictionary.MaterialCategoryItem;
import com.jdlink.domain.Dictionary.UnitDataItem;
import com.jdlink.domain.Page;
import com.jdlink.domain.Produce.*;
import com.jdlink.domain.Wastes;
import com.jdlink.service.IngredientsService;
import com.jdlink.service.dictionary.DictionaryService;
import com.jdlink.util.DBUtil;
import com.jdlink.util.DateUtil;
import com.jdlink.util.ImportUtil;
import com.jdlink.util.RandomUtil;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Controller
public class PRIngredientsController {

    @Autowired
    IngredientsService ingredientsService;
    @Autowired
    DictionaryService dictionaryService;
    ///////////辅料/备件入库单////////////////

    /**
     * 获取危废物质形态
     *
     * @return 物质形态
     */
    @RequestMapping("getProcurementCheckStateList")
    @ResponseBody
    public String getProcurementCheckStateList() {
        JSONObject res = new JSONObject();
        //JSONArray formTypeList = JSONArray.fromArray(FormType.values());
        CheckState[] states = new CheckState[]{CheckState.ToInbound, CheckState.ToPick};
        JSONArray stateList = JSONArray.fromArray(states);
        res.put("stateList", stateList);
        return res.toString();
    }

    /**
     * 获取当前入库单编号
     *
     * @return
     */
    @RequestMapping("getCurrentIngredientsInId")
    @ResponseBody
    public String getCurrentIngredientsInId() {
        // 生成焚烧工单号 yyyyMM00000
        Date date = new Date();   //获取当前时间
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMM");
        String prefix = simpleDateFormat.format(date);
        int count = ingredientsService.countInById(prefix) + 1;
        String suffix;
        if (count <= 9) suffix = "0000" + count;
        else if (count > 9 && count <= 99) suffix = "000" + count;
        else if (count > 99 && count <= 999) suffix = "00" + count;
        else if (count > 999 && count <= 9999) suffix = "0" + count;
        else suffix = "" + count;
        String id = RandomUtil.getAppointId(prefix, suffix);
        // 确保编号唯一
        while (ingredientsService.getInById(id) != null) {
            int index = Integer.parseInt(suffix);
            index += 1;
            if (index <= 9) suffix = "0000" + index;
            else if (index > 9 && index <= 99) suffix = "000" + index;
            else if (index > 99 && index <= 999) suffix = "00" + index;
            else if (index > 999 && index <= 9999) suffix = "0" + index;
            else suffix = "" + index;
            id = RandomUtil.getAppointId(prefix, suffix);
            System.out.println(id);
        }
        JSONObject res = new JSONObject();
        res.put("id", id);
        return res.toString();
    }

    /**
     * 根据Id获取对象数据
     *
     * @param id
     * @return
     */
    @RequestMapping("getIngredientsInById")
    @ResponseBody
    public String getIngredientsInById(String id) {
        JSONObject res = new JSONObject();
        try {
            //根据id查询出相应的对象信息
            IngredientsIn ingredientsIn = ingredientsService.getInById(id);
            //新建一个对象并给它赋值
            JSONObject data = JSONObject.fromBean(ingredientsIn);
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

    @RequestMapping("addIngredientsIn")
    @ResponseBody
    public String addIngredientsIn(@RequestBody IngredientsIn ingredientsIn) {
        JSONObject res = new JSONObject();
        try {
            String id = ingredientsIn.getId();
            String regEx = "[^0-9]";
            String reg = "[0-9]";
            Pattern p = Pattern.compile(regEx);
            Pattern p1 = Pattern.compile(reg);
            Matcher m = p.matcher(id);
            Matcher m1 = p1.matcher(id);
            String id1 = m.replaceAll("").trim();  // 截取ID中的数字
            String id2 = m1.replaceAll("").trim();  // 截取ID中的字符串
            Long index = Long.parseLong(id1);
            boolean e = false;
            while (ingredientsService.getInById(id) != null) {
                index++;
                id = id2 + index;
                e = true;
            }
            if (e) {   // 如果该ID已被更新
                ingredientsIn.setId(id);   // 更新ID
                for (int i = 0; i < ingredientsIn.getIngredientsList().size(); i++) {
                    ingredientsIn.getIngredientsList().get(i).setId(id);
                }
            }
            if (ingredientsIn.getCreationDate() == null) {
                ingredientsIn.setCreationDate(new Date());
            }
            ingredientsService.addIn(ingredientsIn);
            res.put("status", "success");
            res.put("message", "新建入库单成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "新建入库单失败");
        }
        return res.toString();
    }

    @RequestMapping("updateIngredientsIn")
    @ResponseBody
    public String updateIngredientsIn(@RequestBody IngredientsIn ingredientsIn) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.updateDataIn(ingredientsIn);
            res.put("status", "success");
            res.put("message", "入库单修改成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "入库单修改失败");
        }
        return res.toString();
    }

    /**
     * 获取分页数据
     *
     * @param page
     * @return
     */
    @RequestMapping("loadPageIngredientsInList")
    @ResponseBody
    public String loadPageIngredientsInList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<IngredientsIn> ingredientsInList = ingredientsService.listPageIn(page);
            JSONArray data = JSONArray.fromArray(ingredientsInList.toArray(new IngredientsIn[ingredientsInList.size()]));
            res.put("data", data);
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
     * 获取明细分页数据
     *
     * @param page
     * @return
     */
    @RequestMapping("loadPageIngredientsInItemList")
    @ResponseBody
    public String loadPageIngredientsInItemList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.listPageInItem(page); // 获取分页数据
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()])); // 数据转化
            res.put("data", data);
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
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientsInRecord")
    @ResponseBody
    public int totalIngredientsInRecord() {
        try {
            return ingredientsService.countIn();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientsInItemRecord")
    @ResponseBody
    public int totalIngredientsInItemRecord() {
        try {
            return ingredientsService.countInItem();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 导入
     *
     * @param excelFile
     * @return
     */
    @RequestMapping("importIngredientsInExcel")
    @ResponseBody
    public String importIngredientsInExcel(MultipartFile excelFile) {
        JSONObject res = new JSONObject();
        try {
            Object[][] data = ImportUtil.getInstance().getExcelFileData(excelFile).get(0);
            System.out.println("数据如下：");
            for (int i = 1; i < data.length; i++) {
                for (int j = 0; j < data[0].length; j++) {
                    System.out.print(data[i][j].toString());
                    System.out.print(",");
                }
                System.out.println();
            }
            Map<String, IngredientsIn> map = new HashMap<>();
            float totalPrice = 0;
            int serialNumber = 0;    // 序号
            List<Ingredients> ingredientsList = new ArrayList<>();
            for (int i = 1; i < data.length; i++) {
                String id = data[i][0].toString();
                //map内不存在即添加公共数据，存在即添加List内数据
                if (!map.keySet().contains(id)) {
                    map.put(id, new IngredientsIn());
                    map.get(id).setId(id);
                    map.get(id).setCompanyName(data[i][1].toString());
                    map.get(id).setFileId(data[i][2].toString());
                    map.get(id).setBookkeeper(data[i][3].toString());
                    map.get(id).setApprover(data[i][4].toString());
                    map.get(id).setKeeper(data[i][5].toString());
                    map.get(id).setAcceptor(data[i][6].toString());
                    map.get(id).setHandlers(data[i][7].toString());
                    // 如果时间格式不符合需求是18-9-1格式的添加为2018-9-1
                    if (data[i][17].toString().substring(0, 3).replaceAll("\\d+", "") != null ||
                            data[i][17].toString().substring(0, 3).replaceAll("\\d+", "") != "") {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
                        Date date = new Date();
                        String year1 = sdf.format(date).substring(0, 2); // 获取当前世纪 20
                        String date1 = year1 + data[i][17].toString();
                        System.out.print(data[i][17].toString() + " ");
                        map.get(id).setCreationDate(DateUtil.getDateFromStr(date1));   // 设置入库日期
                    }
                    //新存储一个id对象时，将以下两个累计数据清零
                    totalPrice = 0;
                    ingredientsList = new ArrayList<>();
                    serialNumber = 0;
                }
                serialNumber++;
                Ingredients ingredients = new Ingredients();
                ingredients.setSerialNumber(serialNumber + "");
                ingredients.setName(data[i][8].toString());
                String price = data[i][9].toString().replaceAll(",", "");  // 删除所有,
                price = price.replaceAll("，", "");
                ingredients.setUnitPrice(Float.parseFloat(price));
                String amount = data[i][10].toString().replaceAll(",", "");  // 删除所有,
                amount = amount.replaceAll("，", "");
                ingredients.setAmount(Float.parseFloat(amount));
                ingredients.setWareHouseName(data[i][11].toString());
                ingredients.setPost(data[i][12].toString());
                ingredients.setSpecification(data[i][13].toString());
                ingredients.setUnit(data[i][14].toString());
                // 根据计量单位名称获取计量单位数据字典ID 并设置
                UnitDataItem unitDataItem = new UnitDataItem();
                if (data[i][14].toString() != null && !data[i][14].toString().equals("") && !data[i][14].toString().equals("null")) {
                    DataDictionaryItem item = dictionaryService.getDatadictionaryItemByName(data[i][14].toString(), 25);
                    if (item != null) {
                        unitDataItem.setDataDictionaryItemId(item.getDataDictionaryItemId());
                    }
                }
                ingredients.setUnitDataItem(unitDataItem);
                ingredients.setRemarks(data[i][15].toString());
                switch (data[i][16].toString()) {
                    case ("医疗蒸煮系统"):
                        ingredients.setEquipment(Equipment.MedicalCookingSystem);
                        break;
                    case ("医疗蒸煮"):
                        ingredients.setEquipment(Equipment.MedicalCookingSystem);
                        break;
                    case ("A2"):
                        ingredients.setEquipment(Equipment.A2);
                        break;
                    case ("B2"):
                        ingredients.setEquipment(Equipment.B2);
                        break;
                    case ("二期二燃室"):
                        ingredients.setEquipment(Equipment.SecondaryTwoCombustionChamber);
                        break;
                    case ("二期"):
                        ingredients.setEquipment(Equipment.SecondaryTwoCombustionChamber);
                        break;
                    case ("三期预处理系统"):
                        ingredients.setEquipment(Equipment.ThirdPhasePretreatmentSystem);
                        break;
                    case ("三期"):
                        ingredients.setEquipment(Equipment.ThirdPhasePretreatmentSystem);
                        break;
                    case ("备2"):
                        ingredients.setEquipment(Equipment.Prepare2);
                        break;
                }
                EquipmentDataItem equipmentDataItem = new EquipmentDataItem();
                // 设置处置设备字典ID：根据处置设备的名称获取字典ID并设置
                if (data[i][16].toString() != null && !data[i][16].toString().equals("") && !data[i][16].toString().equals("null")) {
                    DataDictionaryItem item = dictionaryService.getDatadictionaryItemByName(data[i][16].toString(), 5);
                    if (item != null) {
                        equipmentDataItem.setDataDictionaryItemId(item.getDataDictionaryItemId());
                    }
                }
                ingredients.setEquipmentDataItem(equipmentDataItem);
                float total = Float.parseFloat(data[i][9].toString()) * Float.parseFloat(data[i][10].toString());
                ingredients.setTotalPrice(total);
                ingredients.setId(id);
                ingredientsList.add(ingredients);
                map.get(id).setIngredientsList(ingredientsList);
                totalPrice += total;
                map.get(id).setTotalPrice(totalPrice);
            }
            for (String key : map.keySet()) {
                IngredientsIn ingredientsIn1 = ingredientsService.getInById(map.get(key).getId());
                IngredientsIn ingredientsIn = map.get(key);
                for (Ingredients ingredients : ingredientsIn.getIngredientsList()) {
                    // 更新库存数量
                    if (ingredientsService.getAmountItems(ingredients) > 0) ingredients.setAid("exist");  //查询是否存在该物品
                    else ingredients.setAid("notExist");
                }
                if (ingredientsIn1 == null) {
                    //插入新数据
                    ingredientsService.addIn(ingredientsIn);
                } else {
                    //根据id更新数据
                    ingredientsService.updateIn(ingredientsIn);
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
    @RequestMapping("exportExcelIngredientsIn")
    @ResponseBody
    public String exportExcel(String name, HttpServletResponse response, String sqlWords) {
        JSONObject res = new JSONObject();
        try {
            DBUtil db = new DBUtil();
            // 设置表头
            String tableHead = "入库单号/单位名称/入库单创建日期/入库单状态/序号/物品名称/规格/单价/入库数/计量单位/物品总额/仓库/过账" +
                    "/附注/文件编号/记账人/审批人/保管人/验收人/经手人" +
                    "";
            name = "辅料备件入库单";   // 重写文件名
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
     * 获取查询总数
     *
     * @param ingredientsIn
     * @return
     */
    @RequestMapping("searchIngredientsInTotal")
    @ResponseBody
    public int searchIngredientsInTotal(@RequestBody IngredientsIn ingredientsIn) {
        try {
            return ingredientsService.searchInCount(ingredientsIn);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取查询总数
     *
     * @param ingredients
     * @return
     */
    @RequestMapping("searchIngredientsInItemTotal")
    @ResponseBody
    public int searchIngredientsInItemTotal(@RequestBody Ingredients ingredients) {
        try {
            return ingredientsService.searchInItemCount(ingredients);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 查询功能
     *
     * @param ingredients
     * @return
     */
    @RequestMapping("searchIngredientsInItem")
    @ResponseBody
    public String searchIngredientsInItem(@RequestBody Ingredients ingredients) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.searchInItem(ingredients);
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
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

    /**
     * 查询功能
     *
     * @param ingredientsIn
     * @return
     */
    @RequestMapping("searchIngredientsIn")
    @ResponseBody
    public String searchIngredientsIn(@RequestBody IngredientsIn ingredientsIn) {
        JSONObject res = new JSONObject();
        try {
            List<IngredientsIn> ingredientsInList = ingredientsService.searchIn(ingredientsIn);
            JSONArray data = JSONArray.fromArray(ingredientsInList.toArray(new IngredientsIn[ingredientsInList.size()]));
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

    /**
     * 作废功能
     *
     * @param id
     * @return
     */
    @RequestMapping("invalidIngredientsIn")
    @ResponseBody
    public String invalidIngredientsIn(String id) {
        JSONObject res = new JSONObject();
        try {
            IngredientsIn ingredientsIn = ingredientsService.getInById(id);  // 获取要作废的数据
//            System.out.println("作废的数据为：");
//            System.out.println(ingredientsIn);
//            for(Ingredients ingredients:ingredientsIn.getIngredientsList()){
//                System.out.print("采购单号:"+ingredients.getProcurementId());
//                System.out.print("，物品:"+ingredients.getName());
//                System.out.print("，规格:"+ingredients.getSpecification());
//                System.out.print("，仓库:"+ingredients.getWareHouseName());
//            }
//            System.out.println();
            ingredientsService.invalidIn(ingredientsIn);  // 将该数据作废并回退之前数据
            res.put("status", "success");
            res.put("message", "作废成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "作废失败");
        }
        return res.toString();
    }

    /**
     * 获取状态列表
     *
     * @return
     */
    @RequestMapping("getIngredientsInSeniorSelectedList")
    @ResponseBody
    public String getIngredientsInSeniorSelectedList() {
        JSONObject res = new JSONObject();
        // 获取枚举
        CheckState[] states = new CheckState[]{CheckState.NewBuild, CheckState.Invalid, CheckState.OutBounded};
        JSONArray stateList = JSONArray.fromArray(states);
        res.put("stateList", stateList);
        return res.toString();
    }


    /**
     * 判断库存表中是否有该种物品于同仓库存在
     *
     * @return
     */
    @RequestMapping("getItemsAmountsExist")
    @ResponseBody
    public String getItemsAmountsExist(@RequestBody Ingredients ingredients) {
        JSONObject res = new JSONObject();
        // 获取枚举
        try {
            int count = ingredientsService.getAmountItems(ingredients);
            res.put("status", "success");
            res.put("message", "获取成功！");
            res.put("data", count);
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "获取失败！");
        }
        return res.toString();
    }
    /////////////领料单//////////////////////

    /**
     * 获取当前领料单编号
     *
     * @return
     */
    @RequestMapping("getCurrentIngredientsReceiveId")
    @ResponseBody
    public String getCurrentIngredientsReceiveId() {
        // 生成焚烧工单号 yyyyMM00000
        Date date = new Date();   //获取当前时间
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMM");
        String prefix = simpleDateFormat.format(date);
        int count = ingredientsService.countReceiveById(prefix) + 1;
        String suffix;
        if (count <= 9) suffix = "0000" + count;
        else if (count > 9 && count <= 99) suffix = "000" + count;
        else if (count > 99 && count <= 999) suffix = "00" + count;
        else if (count > 999 && count <= 9999) suffix = "0" + count;
        else suffix = "" + count;
        String id = RandomUtil.getAppointId(prefix, suffix);
        // 确保编号唯一
        while (ingredientsService.getReceiveById(id) != null) {
            int index = Integer.parseInt(suffix);
            index += 1;
            if (index <= 9) suffix = "0000" + index;
            else if (index > 9 && index <= 99) suffix = "000" + index;
            else if (index > 99 && index <= 999) suffix = "00" + index;
            else if (index > 999 && index <= 9999) suffix = "0" + index;
            else suffix = "" + index;
            id = RandomUtil.getAppointId(prefix, suffix);
        }
        JSONObject res = new JSONObject();
        res.put("id", id);
        return res.toString();
    }

    /**
     * 根据Id获取对象数据
     *
     * @param id
     * @return
     */
    @RequestMapping("getIngredientsReceiveById")
    @ResponseBody
    public String getIngredientsReceiveById(String id) {
        JSONObject res = new JSONObject();
        try {
            //根据id查询出相应的对象信息
            IngredientsReceive ingredientsReceive = ingredientsService.getReceiveById(id);
            //新建一个对象并给它赋值
            JSONObject data = JSONObject.fromBean(ingredientsReceive);
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
     * 添加领料单
     *
     * @param ingredientsReceive
     * @return
     */
    @RequestMapping("addIngredientsReceive")
    @ResponseBody
    public String addIngredientsReceive(@RequestBody IngredientsReceive ingredientsReceive) {
        JSONObject res = new JSONObject();
        try {
            String id = ingredientsReceive.getId();
            String regEx = "[^0-9]";
            String reg = "[0-9]";
            Pattern p = Pattern.compile(regEx);
            Pattern p1 = Pattern.compile(reg);
            Matcher m = p.matcher(id);
            Matcher m1 = p1.matcher(id);
            String id1 = m.replaceAll("").trim();  // 截取ID中的数字
            String id2 = m1.replaceAll("").trim();  // 截取ID中的字符串
            Long index = Long.parseLong(id1);
            boolean e = false;
            while (ingredientsService.getReceiveById(id) != null) {
                index++;
                id = id2 + index;
                e = true;
            }
            if (e) {   // 如果该ID已被更新
                ingredientsReceive.setId(id);   // 更新ID
                for (int i = 0; i < ingredientsReceive.getIngredientsList().size(); i++) {
                    ingredientsReceive.getIngredientsList().get(i).setId(id);
                }
            }
            if (ingredientsReceive.getCreationDate() == null) {
                ingredientsReceive.setCreationDate(new Date());
            }
            ingredientsService.addAllReceive(ingredientsReceive);
            res.put("status", "success");
            res.put("message", "新建成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "新建失败");
        }
        return res.toString();
    }

    /**
     * 修改领料单
     *
     * @param ingredientsReceive
     * @return
     */
    @RequestMapping("updateIngredientsReceive")
    @ResponseBody
    public String updateIngredientsReceive(@RequestBody IngredientsReceive ingredientsReceive) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.updateDataReceive(ingredientsReceive);
            res.put("status", "success");
            res.put("message", "修改成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "修改失败");
        }
        return res.toString();
    }


    @RequestMapping("loadPageIngredientsReceiveList")
    @ResponseBody
    public String loadPageIngredientsReceiveList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<IngredientsReceive> ingredientsReceiveList = ingredientsService.listPageReceive(page);
            JSONArray data = JSONArray.fromArray(ingredientsReceiveList.toArray(new IngredientsReceive[ingredientsReceiveList.size()]));
            res.put("data", data);
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

    @RequestMapping("loadPageIngredientsReceiveItemList")
    @ResponseBody
    public String loadPageIngredientsReceiveItemList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.listPageReceiveItem(page);
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
            res.put("data", data);
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
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientsReceiveRecord")
    @ResponseBody
    public int totalIngredientsReceiveRecord() {
        try {
            return ingredientsService.countReceive();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientsReceiveItemRecord")
    @ResponseBody
    public int totalIngredientsReceiveItemRecord() {
        try {
            return ingredientsService.countReceiveItem();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 导入
     *
     * @param excelFile
     * @return
     */
    @RequestMapping("importIngredientsReceiveExcel")
    @ResponseBody
    public String importIngredientsReceiveExcel(MultipartFile excelFile) {
        JSONObject res = new JSONObject();
        try {
            Object[][] data = ImportUtil.getInstance().getExcelFileData(excelFile).get(0);
            System.out.println("数据如下：");
            for (int i = 0; i < data.length; i++) {
                for (int j = 0; j < data[0].length; j++) {
                    System.out.print(data[i][j].toString());
                    System.out.print(",");
                }
                System.out.println();
            }
            Map<String, IngredientsReceive> map = new HashMap<>();
            float totalAmount = 0;
            int serialNumber = 0;    // 序号
            List<Ingredients> ingredientsList = new ArrayList<>();
            for (int i = 1; i < data.length; i++) {
                String id = data[i][0].toString();
                //map内不存在即添加公共数据，存在即添加List内数据
                if (!map.keySet().contains(id)) {
                    map.put(id, new IngredientsReceive());
                    map.get(id).setId(id);
                    map.get(id).setDepartment(data[i][1].toString());
                    map.get(id).setFileId(data[i][2].toString());
                    map.get(id).setKeeper(data[i][3].toString());
                    map.get(id).setVicePresident(data[i][4].toString());
                    map.get(id).setWarehouseSupervisor(data[i][5].toString());
                    map.get(id).setPickingSupervisor(data[i][6].toString());
                    map.get(id).setPickingMan(data[i][7].toString());
                    //新存储一个id对象时，将以下两个累计数据清零
                    totalAmount = 0;
                    ingredientsList = new ArrayList<>();
                    serialNumber = 0;
                }
                serialNumber++;
                Ingredients ingredients = new Ingredients();
                ingredients.setSerialNumber(serialNumber + "");
                ingredients.setName(data[i][8].toString());
                ingredients.setReceiveAmount(Float.parseFloat(data[i][9].toString()));
                ingredients.setWareHouseName(data[i][10].toString());
                ingredients.setSpecification(data[i][11].toString());
                ingredients.setUnit(data[i][12].toString());
                ingredients.setRemarks(data[i][13].toString());
                ingredients.setId(id);
                //计算该物品在该仓库的总入库数和总已领取数
                //通过仓库名和物品名查询库存量
                Ingredients ingredients1 = ingredientsService.getAmountAndReceive(ingredients);
                float amount = ingredients1.getAmount();
                if (ingredients.getReceiveAmount() == amount) {
                    //设置可领料数为0，代表全部领取
                    ingredients.setNotReceiveAmount(0);
                } else if (ingredients.getReceiveAmount() < amount) {
                    //设置可领料数为1，代表部分领取
                    ingredients.setNotReceiveAmount(1);
                }
                ingredientsList.add(ingredients);
                map.get(id).setIngredientsList(ingredientsList);
                totalAmount += Float.parseFloat(data[i][9].toString());
                map.get(id).setTotalAmount(totalAmount);
            }
            for (String key : map.keySet()) {
                IngredientsReceive ingredientsReceive = map.get(key);
                //计算每单每个物品在各个仓库的领料数是否小于库存量
                for (Ingredients ingredients : ingredientsReceive.getIngredientsList()) {
                    //计算该物品在该仓库的总入库数和总已领取数
                    //通过仓库名和物品名查询库存量
                    Ingredients ingredients1 = ingredientsService.getAmountAndReceive(ingredients);
                    float amount = ingredients1.getAmount();
                    if (ingredients.getReceiveAmount() > amount) {
                        res.put("status", "fail");
                        res.put("message", ingredients.getWareHouseName() + "中" + ingredients.getName() + "库存不足,请重新确认领料数量！");
                        return res.toString();
                    }
                }
                IngredientsReceive ingredientsReceive1 = ingredientsService.getReceiveById(map.get(key).getId());
                if (ingredientsReceive1 == null) {
                    //插入新数据
                    ingredientsService.addAllReceive(ingredientsReceive);
                } else {
                    //根据id更新数据
                    ingredientsService.updateReceive(ingredientsReceive);
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
    @RequestMapping("exportExcelIngredientsReceive")
    @ResponseBody
    public String exportExcelIngredientsReceive(String name, HttpServletResponse response, String sqlWords) {
        JSONObject res = new JSONObject();
        try {
            DBUtil db = new DBUtil();
            // 设置表头
            String tableHead = "领料单号/部门/单据状态/创建日期/序号/物品名称/规格/领料数/计量单位/附注/仓库/主管副总经理" +
                    "/仓库部门主管/保管员/领料部门主管/领料人";
            name = "辅料备件领料单";   // 重写文件名
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
     * 获取查询总数
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsReceiveTotal")
    @ResponseBody
    public int searchIngredientsReceiveTotal(@RequestBody IngredientsReceive ingredientsReceive) {
        try {
            return ingredientsService.searchReceiveCount(ingredientsReceive);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取查询总数
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsReceiveItemTotal")
    @ResponseBody
    public int searchIngredientsReceiveItemTotal(@RequestBody Ingredients ingredients) {
        try {
            return ingredientsService.searchReceiveItemCount(ingredients);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 查询功能
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsReceive")
    @ResponseBody
    public String searchIngredientsReceive(@RequestBody IngredientsReceive ingredientsReceive) {
        JSONObject res = new JSONObject();
        try {
            List<IngredientsReceive> ingredientsReceiveList = ingredientsService.searchReceive(ingredientsReceive);
            JSONArray data = JSONArray.fromArray(ingredientsReceiveList.toArray(new IngredientsReceive[ingredientsReceiveList.size()]));
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

    /**
     * 查询功能
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsReceiveItem")
    @ResponseBody
    public String searchIngredientsReceiveItem(@RequestBody Ingredients ingredients) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.searchReceiveItem(ingredients);
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
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

    /**
     * 作废功能
     *
     * @param id
     * @return
     */
    @RequestMapping("invalidIngredientsReceive")
    @ResponseBody
    public String invalidIngredientsReceive(String id) {
        JSONObject res = new JSONObject();
        try {
            IngredientsReceive ingredientsReceive = ingredientsService.getReceiveById(id);  // 获取要作废的数据
            ingredientsService.invalidReceive(ingredientsReceive);
            res.put("status", "success");
            res.put("message", "作废成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "作废失败");
        }
        return res.toString();
    }

    /**
     * 获取物品库存列表
     *
     * @return
     */
    @RequestMapping("LoadPageIngredientsInventoryList")
    @ResponseBody
    public String LoadPageIngredientsInventoryList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.getInventoryList(page);
            for (int i = 0; i < ingredientsList.size(); i++) {
                Ingredients ingredients1 = ingredientsService.getSumByIngredient(ingredientsList.get(i));
                ingredientsList.get(i).setTotalAmount(ingredients1.getTotalAmount());
                ingredientsList.get(i).setAllTotalPrice(ingredients1.getAllTotalPrice());
                ingredientsList.get(i).setInTotalAmount(ingredients1.getInTotalAmount());
                ingredientsList.get(i).setInTotalPrice(ingredients1.getInTotalPrice());
                ingredientsList.get(i).setOutTotalAmount(ingredients1.getOutTotalAmount());
                ingredientsList.get(i).setOutTotalPrice(ingredients1.getOutTotalPrice());
                ingredientsList.get(i).setMonthBeginAmount(ingredients1.getMonthBeginAmount());
                ingredientsList.get(i).setMonthBeginTotalPrice(ingredients1.getMonthBeginTotalPrice());
            }
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
            res.put("data", data);
            res.put("status", "success");
            res.put("message", "获取成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "获取失败");
        }
        return res.toString();
    }

    /**
     * 获取查询记录数
     *
     * @return
     */
    @RequestMapping("searchIngredientInventoryTotal")
    @ResponseBody
    public int searchIngredientInventoryTotal(@RequestBody Ingredients ingredients) {
        try {
            return ingredientsService.searchInventoryCount(ingredients);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientInventoryRecord")
    @ResponseBody
    public int totalIngredientInventoryRecord() {
        try {
            return ingredientsService.countInventory();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 查询库存数据(新增页面查询功能)
     *
     * @param ingredients
     * @return
     */
    @RequestMapping("searchIngredientsInventory")
    @ResponseBody
    public String searchIngredientsInventory(@RequestBody Ingredients ingredients) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.searchInventory(ingredients);
            for (int i = 0; i < ingredientsList.size(); i++) {
                Ingredients ingredients1 = ingredientsService.getSumByIngredient(ingredientsList.get(i));
                ingredientsList.get(i).setTotalAmount(ingredients1.getTotalAmount());
                ingredientsList.get(i).setAllTotalPrice(ingredients1.getAllTotalPrice());
                ingredientsList.get(i).setInTotalAmount(ingredients1.getInTotalAmount());
                ingredientsList.get(i).setInTotalPrice(ingredients1.getInTotalPrice());
                ingredientsList.get(i).setOutTotalAmount(ingredients1.getOutTotalAmount());
                ingredientsList.get(i).setOutTotalPrice(ingredients1.getOutTotalPrice());
                ingredientsList.get(i).setMonthBeginAmount(ingredients1.getMonthBeginAmount());
                ingredientsList.get(i).setMonthBeginTotalPrice(ingredients1.getMonthBeginTotalPrice());
            }
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
            res.put("data", data);
            res.put("status", "success");
            res.put("message", "查询成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "查询失败");
        }
        return res.toString();
    }

    /**
     * 更新领料单状态为已出库
     *
     * @param id
     * @return
     */
    @RequestMapping("updateIngredientsReceiveState")
    @ResponseBody
    public String updateIngredientsReceiveState(String id) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.updateReceiveState(id);
            res.put("status", "success");
            res.put("message", "更新成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "更新失败");
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
    @RequestMapping("exportExcelIngredientsInventory")
    @ResponseBody
    public String exportExcelIngredientsInventory(String name, HttpServletResponse response, String sqlWords) {
        JSONObject res = new JSONObject();
        try {
            DBUtil db = new DBUtil();
            // 设置表头
            String tableHead = "编号/物品名称/库存量/计量单位/规格/仓库";
            name = "辅料备件库存";   // 重写文件名
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

    /////////////出库单//////////////////////

    /**
     * 获取当前出库单编号
     *
     * @return
     */
    @RequestMapping("getCurrentIngredientsOutId")
    @ResponseBody
    public String getCurrentReceivegredientsOutId() {
        // 生成焚烧工单号 yyyyMM00000
        Date date = new Date();   //获取当前时间
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMM");
        String prefix = simpleDateFormat.format(date);
        int count = ingredientsService.countOutById(prefix) + 1;
        String suffix;
        if (count <= 9) suffix = "0000" + count;
        else if (count > 9 && count <= 99) suffix = "000" + count;
        else if (count > 99 && count <= 999) suffix = "00" + count;
        else if (count > 999 && count <= 9999) suffix = "0" + count;
        else suffix = "" + count;
        String id = RandomUtil.getAppointId(prefix, suffix);
        // 确保编号唯一
        while (ingredientsService.getOutById(id) != null) {
            int index = Integer.parseInt(suffix);
            index += 1;
            if (index <= 9) suffix = "0000" + index;
            else if (index > 9 && index <= 99) suffix = "000" + index;
            else if (index > 99 && index <= 999) suffix = "00" + index;
            else if (index > 999 && index <= 9999) suffix = "0" + index;
            else suffix = "" + index;
            id = RandomUtil.getAppointId(prefix, suffix);
        }
        JSONObject res = new JSONObject();
        res.put("id", id);
        return res.toString();
    }

    /**
     * 根据Id获取对象数据
     *
     * @param id
     * @return
     */
    @RequestMapping("getIngredientsOutById")
    @ResponseBody
    public String getIngredientsOutById(String id) {
        JSONObject res = new JSONObject();
        try {
            //根据id查询出相应的对象信息
            IngredientsOut ingredientsOut = ingredientsService.getOutById(id);
            //新建一个对象并给它赋值
            JSONObject data = JSONObject.fromBean(ingredientsOut);
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

    @RequestMapping("addIngredientsOut")
    @ResponseBody
    public String addIngredientsOut(@RequestBody IngredientsOut ingredientsOut) {
        JSONObject res = new JSONObject();
        try {
            String id = ingredientsOut.getId();
            String regEx = "[^0-9]";
            String reg = "[0-9]";
            Pattern p = Pattern.compile(regEx);
            Pattern p1 = Pattern.compile(reg);
            Matcher m = p.matcher(id);
            Matcher m1 = p1.matcher(id);
            String id1 = m.replaceAll("").trim();  // 截取ID中的数字
            String id2 = m1.replaceAll("").trim();  // 截取ID中的字符串
            Long index = Long.parseLong(id1);
            boolean e = false;
            while (ingredientsService.getOutById(id) != null) {
                index++;
                id = id2 + index;
                e = true;
            }
            if (e) {   // 如果该ID已被更新
                ingredientsOut.setId(id);   // 更新ID
                for (int i = 0; i < ingredientsOut.getIngredientsList().size(); i++) {
                    ingredientsOut.getIngredientsList().get(i).setId(id);
                }
            }
            if (ingredientsOut.getCreationDate() == null) {
                ingredientsOut.setCreationDate(new Date());
            }
            ingredientsService.addOut(ingredientsOut);
            res.put("status", "success");
            res.put("message", "新建成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "新建失败");
        }
        return res.toString();
    }

    @RequestMapping("updateIngredientsOut")
    @ResponseBody
    public String updateIngredientsOut(@RequestBody IngredientsOut ingredientsOut) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.updateDataOut(ingredientsOut);
            res.put("status", "success");
            res.put("message", "修改成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "修改失败");
        }
        return res.toString();
    }

    @RequestMapping("loadPageIngredientsOutList")
    @ResponseBody
    public String loadPageIngredientsOutList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<IngredientsOut> ingredientsOutList = ingredientsService.listPageOut(page);
            JSONArray data = JSONArray.fromArray(ingredientsOutList.toArray(new IngredientsOut[ingredientsOutList.size()]));
            res.put("data", data);
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

    @RequestMapping("loadPageIngredientsOutItemList")
    @ResponseBody
    public String loadPageIngredientsOutItemList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.listPageOutItem(page);
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
            res.put("data", data);
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
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientsOutRecord")
    @ResponseBody
    public int totalIngredientsOutRecord() {
        try {
            return ingredientsService.countOut();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientsOutItemRecord")
    @ResponseBody
    public int totalIngredientsOutItemRecord() {
        try {
            return ingredientsService.countOutItem();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 导入
     *
     * @param excelFile
     * @return
     */
    @RequestMapping("importIngredientsOutExcel")
    @ResponseBody
    public String importIngredientsOutExcel(MultipartFile excelFile) {
        JSONObject res = new JSONObject();
        try {
            Object[][] data = ImportUtil.getInstance().getExcelFileData(excelFile).get(0);
            System.out.println("数据如下：");
            for (int i = 0; i < data.length; i++) {
                for (int j = 0; j < data[0].length; j++) {
                    System.out.print(data[i][j].toString());
                    System.out.print(",");
                }
                System.out.println();
            }
            Map<String, IngredientsOut> map = new HashMap<>();
            float totalAmount = 0;    //总出库数量
            float totalPrice = 0;     //总额
            int serialNumber = 0;    // 序号
            List<Ingredients> ingredientsList = new ArrayList<>();
            for (int i = 1; i < data.length; i++) {
                String id = data[i][0].toString();
                //map内不存在即添加公共数据，存在即添加List内数据
                if (!map.keySet().contains(id)) {
                    map.put(id, new IngredientsOut());
                    map.get(id).setId(id);
                    map.get(id).setDepartment(data[i][1].toString());
                    map.get(id).setFileId(data[i][2].toString());
                    map.get(id).setApprover(data[i][3].toString());
                    map.get(id).setKeeper(data[i][4].toString());
                    map.get(id).setHandlers(data[i][5].toString());
                    map.get(id).setBookkeeper(data[i][6].toString());
                    // 如果时间格式不符合需求是18-9-1格式的添加为2018-9-1
                    if (data[i][16].toString().substring(0, 3).replaceAll("\\d+", "") != null ||
                            data[i][16].toString().substring(0, 3).replaceAll("\\d+", "") != "") {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
                        Date date = new Date();
                        String year1 = sdf.format(date).substring(0, 2); // 获取当前世纪 20
                        String date1 = year1 + data[i][16].toString();
                        System.out.print("日期:");
                        System.out.print(data[i][16].toString() + " ");
                        System.out.println(date1 + ".");
                        map.get(id).setCreationDate(DateUtil.getDateFromStr(date1));   // 设置入库日期
                    }
                    //新存储一个id对象时，将以下两个累计数据清零
                    totalAmount = 0;
                    totalPrice = 0;
                    ingredientsList = new ArrayList<>();
                    serialNumber = 0;
                }
                serialNumber++;
                Ingredients ingredients = new Ingredients();
                ingredients.setSerialNumber(serialNumber + "");
                ingredients.setName(data[i][7].toString());
                ingredients.setUnitPrice(Float.parseFloat(data[i][8].toString()));
                ingredients.setReceiveAmount(Float.parseFloat(data[i][9].toString()));
                ingredients.setWareHouseName(data[i][10].toString());
                ingredients.setPost(data[i][11].toString());
                ingredients.setSpecification(data[i][12].toString());
                ingredients.setUnit(data[i][13].toString());
                ingredients.setRemarks(data[i][14].toString());
                switch (data[i][15].toString()) {
                    case ("医疗蒸煮系统"):
                        ingredients.setEquipment(Equipment.MedicalCookingSystem);
                        break;
                    case ("医疗蒸煮"):
                        ingredients.setEquipment(Equipment.MedicalCookingSystem);
                        break;
                    case ("A2"):
                        ingredients.setEquipment(Equipment.A2);
                        break;
                    case ("B2"):
                        ingredients.setEquipment(Equipment.B2);
                        break;
                    case ("二期二燃室"):
                        ingredients.setEquipment(Equipment.SecondaryTwoCombustionChamber);
                        break;
                    case ("二期"):
                        ingredients.setEquipment(Equipment.SecondaryTwoCombustionChamber);
                        break;
                    case ("三期预处理系统"):
                        ingredients.setEquipment(Equipment.ThirdPhasePretreatmentSystem);
                        break;
                    case ("三期"):
                        ingredients.setEquipment(Equipment.ThirdPhasePretreatmentSystem);
                        break;
                    case ("备2"):
                        ingredients.setEquipment(Equipment.Prepare2);
                        break;
                }
                float total = Float.parseFloat(data[i][8].toString()) * Float.parseFloat(data[i][9].toString());
                ingredients.setTotalPrice(total);
                ingredients.setId(id);
                Ingredients ingredients1 = ingredientsService.getInventoryByNameAndWare(ingredients);
                if (ingredients1 == null) {
                    res.put("status", "fail");
                    res.put("message", ingredients.getWareHouseName() + "中" + "没有" + ingredients.getName() + ",请重新确认!");
                    return res.toString();
                }
                float amount = ingredients1.getAmount(); // 获取库存量
                if (ingredients.getReceiveAmount() == amount) {
                    //设置可领料数为0，代表全部出库
                    ingredients.setNotReceiveAmount(0);
                } else if (ingredients.getReceiveAmount() < amount) {
                    //设置可领料数为1，代表部分出库
                    ingredients.setNotReceiveAmount(1);
                }
                ingredientsList.add(ingredients);
                map.get(id).setIngredientsList(ingredientsList);
                totalAmount += Float.parseFloat(data[i][9].toString());
                totalPrice += total;
                map.get(id).setTotalAmount(totalAmount);
                map.get(id).setTotalPrice(totalPrice);
            }
            String message = "";
            boolean out = true;   // 默认正常出库
            for (String key : map.keySet()) {
                IngredientsOut ingredientsOut = map.get(key);
                //计算每单每个物品在各个仓库的领料数是否小于库存量
                for (Ingredients ingredients : ingredientsOut.getIngredientsList()) {
                    //通过仓库名和物品名查询库存量
                    Ingredients ingredients1 = ingredientsService.getInventoryByNameAndWare(ingredients);
                    if (ingredients1 == null) {
                        //res.put("status", "fail");
                        message = message + ingredients.getWareHouseName() + "中" + "没有" + ingredients.getName() + "\n";
                        out = false; // 没有库存时出库失败
                    } else {
                        float amount = ingredients1.getAmount(); // 获取库存量
                        if (ingredients.getReceiveAmount() > amount) {
                            message = message + ingredients.getWareHouseName() + "中" + ingredients.getName() + "出库数大于库存量" + "\n";
                            out = false;  // 库存不足时出库失败
                        }
                    }
                }
                if (out) {     // 如果Out为true则正常更新添加
                    IngredientsOut ingredientsOut1 = ingredientsService.getOutById(map.get(key).getId());
                    if (ingredientsOut1 == null) {
                        //插入新数据
                        ingredientsService.addOut(ingredientsOut);
                    } else {
                        //根据id更新数据
                        ingredientsService.updateOut(ingredientsOut);
                    }
                }
            }
            if (out) {
                res.put("status", "success");
                res.put("message", "导入成功");
            } else {
                res.put("status", "fail");
                res.put("message", "部分导入失败\n" + message + "请重新检查！");
            }
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
    @RequestMapping("exportExcelIngredientsOut")
    @ResponseBody
    public String exportExcelIngredientsOut(String name, HttpServletResponse response, String sqlWords) {
        JSONObject res = new JSONObject();
        try {
            DBUtil db = new DBUtil();
            // 设置表头
            String tableHead = "出库单号/部门/单据创建日期/单据状态/序号/物品名称/规格/单价/出库数/计量单位/物品总额/仓库/过账" +
                    "/附注/文件编号/记账人/审批人/保管人/经手人";
            name = "辅料备件出库单";   // 重写文件名
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
     * 获取查询总数
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsOutTotal")
    @ResponseBody
    public int searchIngredientsOutTotal(@RequestBody IngredientsOut ingredientsOut) {
        try {
            return ingredientsService.searchOutCount(ingredientsOut);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取查询总数
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsOutItemTotal")
    @ResponseBody
    public int searchIngredientsOutItemTotal(@RequestBody Ingredients ingredients) {
        try {
            return ingredientsService.searchOutItemCount(ingredients);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 查询功能
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsOut")
    @ResponseBody
    public String searchIngredientsOut(@RequestBody IngredientsOut ingredientsOut) {
        JSONObject res = new JSONObject();
        try {
            List<IngredientsOut> ingredientsOutList = ingredientsService.searchOut(ingredientsOut);
            JSONArray data = JSONArray.fromArray(ingredientsOutList.toArray(new IngredientsOut[ingredientsOutList.size()]));
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

    /**
     * 查询功能
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientsOutItem")
    @ResponseBody
    public String searchIngredientsOutItem(@RequestBody Ingredients ingredients) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.searchOutItem(ingredients);
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
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

    /**
     * 作废功能
     *
     * @param id
     * @return
     */
    @RequestMapping("invalidIngredientsOut")
    @ResponseBody
    public String invalidIngredientsOut(String id) {
        JSONObject res = new JSONObject();
        try {
            IngredientsOut ingredientsOut = ingredientsService.getOutById(id);
            ingredientsService.invalidOut(ingredientsOut);
            res.put("status", "success");
            res.put("message", "作废成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "作废失败");
        }
        return res.toString();
    }

    /**
     * 获取库存量
     *
     * @param
     * @return
     */
    @RequestMapping("getInventoryByNameAndWare")
    @ResponseBody
    public float getInventoryByNameAndWare(@RequestBody Ingredients ingredients) {
        try {
            return ingredientsService.getInventoryByNameAndWare(ingredients).getAmount();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 结账功能
     *
     * @param
     * @return
     */
    @RequestMapping("ingredientOutSettled")
    @ResponseBody
    public String ingredientOutSettled(@RequestBody IngredientsOut ingredientsOut) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.outSettled(ingredientsOut);
            res.put("status", "success");
            res.put("message", "出库单锁定成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "出库单锁定失败");
        }
        return res.toString();
    }

    /**
     * 根据时间判定该月的数据是否结账（锁定）
     *
     * @param date
     * @return
     */
    @RequestMapping("ingredientOutIsSettled")
    @ResponseBody
    public String isSettled(Date date) {
        JSONObject res = new JSONObject();
        try {
            if (date == null) {   // 如果出库日期为空则赋值为当前日期
                date = new Date();
            }
            List<String> stringList = ingredientsService.getDateBbySettled();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");  // 获取出库时间的年月份
            String yearAndMouth = sdf.format(date);
            if (stringList.contains(yearAndMouth)) {
                res.put("message", "无法出库," + yearAndMouth + "月份出库单已结账");
                res.put("status", "fail");
            } else {
                res.put("message", "可以出库！");
                res.put("status", "success");
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "结账数据获取失败！");
        }
        return res.toString();
    }

    //////////////辅料备件物品维护

    /**
     * 获取辅料备件物品分页数据
     *
     * @param page
     * @return
     */
    @RequestMapping("loadPageIngredientList")
    @ResponseBody
    public String loadPageIngredientList(@RequestBody Page page) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.getIngredientsList(page); // 获取分页数据
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()])); // 数据转化
            res.put("data", data);
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
     * 获取总记录数
     *
     * @return
     */
    @RequestMapping("totalIngredientRecord")
    @ResponseBody
    public int totalIngredientRecord() {
        try {
            return ingredientsService.getCountIngredientsList();
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取查询总数
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredientTotal")
    @ResponseBody
    public int searchIngredientTotal(@RequestBody Ingredients ingredients) {
        try {
            return ingredientsService.searchCountIngredient(ingredients);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 查询功能
     *
     * @param
     * @return
     */
    @RequestMapping("searchIngredient")
    @ResponseBody
    public String searchIngredient(@RequestBody Ingredients ingredients) {
        JSONObject res = new JSONObject();
        try {
            List<Ingredients> ingredientsList = ingredientsService.searchIngredient(ingredients);
            JSONArray data = JSONArray.fromArray(ingredientsList.toArray(new Ingredients[ingredientsList.size()]));
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

    /**
     * 删除功能(根据ID删除辅料备件物品)
     *
     * @param
     * @return
     */
    @RequestMapping("deleteIngredient")
    @ResponseBody
    public String deleteIngredient(int id) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.deleteIngredient(id);
            res.put("status", "success");
            res.put("message", "删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "删除失败");
        }
        return res.toString();
    }

    /**
     * 修改功能(修改辅料备件物品)
     *
     * @param
     * @return
     */
    @RequestMapping("updateIngredient")
    @ResponseBody
    public String updateIngredient(@RequestBody Ingredients ingredients) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.updateIngredient(ingredients);
            res.put("status", "success");
            res.put("message", "修改成功!");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "修改失败!");
        }
        return res.toString();
    }

    /**
     * 新增功能(新增辅料备件物品)
     *
     * @param
     * @return
     */
    @RequestMapping("addIngredient")
    @ResponseBody
    public String addIngredient(@RequestBody IngredientsIn ingredientsIn) {
        JSONObject res = new JSONObject();
        try {
            for (Ingredients ingredients : ingredientsIn.getIngredientsList()) {
                Ingredients ingredients1 = ingredientsService.getIngredientByNameAndSpecification(ingredients);
                if (ingredients1 != null) {
                    res.put("status", "fail");
                    res.put("message", ingredients.getName() + "已存在!");
                } else {   // 如果物品不存在则新增
                    ingredientsService.addIngredient(ingredients);
                    res.put("status", "success");
                    res.put("message", ingredients.getName() + "新增成功!");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "新增失败");
        }
        return res.toString();
    }

    /**
     * 导入
     *
     * @param excelFile
     * @return
     */
    @RequestMapping("importIngredientExcel")
    @ResponseBody
    public String importIngredientExcel(MultipartFile excelFile) {
        JSONObject res = new JSONObject();
        try {
            Object[][] data = ImportUtil.getInstance().getExcelFileData(excelFile).get(0);
            System.out.println("数据如下：");
            for (int i = 0; i < data.length; i++) {
                for (int j = 0; j < data[0].length; j++) {
                    System.out.print(data[i][j].toString());
                    System.out.print(",");
                }
                System.out.println();
            }
            for (int i = 1; i < data.length; i++) {
                // 设置数据
                if (!data[i][1].toString().equals("null")) {// 类别不为空时添加
                    Ingredients ingredients = new Ingredients();
                    ingredients.setName(data[i][2].toString());//名称
                    MaterialCategoryItem materialCategoryItem = new MaterialCategoryItem();
                    int materialCategoryId = dictionaryService.getdatadictionaryitemIdByName(data[i][1].toString(), 28);
                    materialCategoryItem.setDataDictionaryItemId(materialCategoryId);
                    ingredients.setMaterialCategoryItem(materialCategoryItem);
                    UnitDataItem unitDataItem = new UnitDataItem();
                    int unitId = dictionaryService.getdatadictionaryitemIdByName(data[i][4].toString(), 25);
                    unitDataItem.setDataDictionaryItemId(unitId);
                    ingredients.setUnitDataItem(unitDataItem);

                    ingredients.setCode(data[i][0].toString());//编码
                    ingredients.setSpecification(data[i][3].toString());//规格
                    // 根据名称和规格获取对象
                    Ingredients ingredients1 = ingredientsService.getIngredientByNameAndSpecification(ingredients);
                    if (ingredients1 == null) {   // 不存在该物品则新增
                        ingredientsService.addIngredient(ingredients);
                    } else { // 存在即更新编码和计量单位
                        ingredientsService.updateCodeByIngredient(ingredients);
                    }
                }
            }
            res.put("status", "success");
            res.put("message", "导入成功！");
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
    @RequestMapping("exportExcelIngredient")
    @ResponseBody
    public String exportExcelIngredient(String name, HttpServletResponse response, String sqlWords) {
        JSONObject res = new JSONObject();
        try {
            DBUtil db = new DBUtil();
            // 设置表头
            String tableHead = "编码/物品名称/规格型号/计量单位/类别";
            name = "辅料备件物品列表";   // 重写文件名
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
     * 根据Id获取对象数据
     *
     * @param id
     * @return
     */
    @RequestMapping("getIngredientById")
    @ResponseBody
    public String getIngredientById(int id) {
        JSONObject res = new JSONObject();
        try {
            //根据id查询出相应的对象信息
            Ingredients ingredients = ingredientsService.getIngredientById(id);
            //新建一个对象并给它赋值
            JSONObject data = JSONObject.fromBean(ingredients);
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
     * 根据物品编码获取对象
     *
     * @param code
     * @return
     */
    @RequestMapping("getCountByIngredientCode")
    @ResponseBody
    public int getCountByIngredientCode(String code) {
        int count = ingredientsService.getCountByCode(code);  // 获取物品编码为code的物品数量
        return count;
    }

    /**
     * 根据前两位编码获取最新的物品编码
     *
     * @param type
     * @return
     */
    @RequestMapping("getCurrentCodeByType")
    @ResponseBody
    public String getCurrentCodeByType(String type) {
        int count = ingredientsService.getCountByType(type) + 1;  // 获取物品编码前两位为type的物品数量+1
        String code = "";
        String count1 = count + "";
        int length = count1.length();  // 获取数量位数
        for (int i = 0; i < (6 - length); i++) {
            count1 = "0" + count1;
        }
        code = type + count1;
        while (ingredientsService.getCountByCode(code) > 0) {   // 如果存在就一直加1
            int index = Integer.parseInt(code);
            index += 1;
            code = index + "";
        }
        return code;
    }

    /**
     * 根据入库单自动新增库存自动
     */
    @RequestMapping("setInventory")
    @ResponseBody
    public void setInventory() {
        //  ingredientsService.deleteInventory();    // 删除原库存。
        Page page = new Page();
        page.setStart(0);
        page.setCount(0);
        //  List<Ingredients> ingredientsList = ingredientsService.listPageInItem(page);
        Ingredients ingredients2 = new Ingredients();
        ingredients2.setId("20171200041");
        List<Ingredients> ingredientsList = ingredientsService.searchInItem(ingredients2);
        for (Ingredients ingredients : ingredientsList) {
            Ingredients ingredients1 = new Ingredients();
            ingredients1.setCode(ingredients.getCode());
            ingredients1.setName(ingredients.getName());
            ingredients1.setSpecification(ingredients.getSpecification());
            ingredients1.setUnit(ingredients.getUnit());
            ingredients1.setAmount(ingredients.getAmount());
            ingredients1.setWareHouseName(ingredients.getWareHouseName());
            ingredients1.setInAmount(ingredients.getAmount());
            ingredients1.setInId(ingredients.getId());
            ingredients1.setInPrice(ingredients.getUnitPrice());
            ingredientsService.addInventoryItem(ingredients1);
        }
    }

    ////////////辅料备件物品管理树状结构////////

    /**
     * 获取辅料物品树状数据
     *
     * @return
     */
    @RequestMapping("loadIngredientsTreeList")
    @ResponseBody
    public String loadIngredientsTreeList() {
        JSONObject res = new JSONObject();
        try {
            // 获取树状数据
            List<IngredientsTree> ingredientsTreeList = ingredientsService.listIngredientsTree();
            // 转换
            JSONArray data = JSONArray.fromArray(ingredientsTreeList.toArray(new IngredientsTree[ingredientsTreeList.size()]));
            res.put("data", data);
            res.put("status", "success");
            res.put("message", "数据获取成功!");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "数据获取失败！");
        }
        // 返回结果
        return res.toString();
    }

    /**
     * 导入物品树状结构
     *
     * @param excelFile
     * @return
     */
    @RequestMapping("importIngredientsTreeExcel")
    @ResponseBody
    public String importIngredientsTreeExcel(MultipartFile excelFile) {
        JSONObject res = new JSONObject();
        try {
            Object[][] data = ImportUtil.getInstance().getExcelFileData(excelFile).get(0);
            System.out.println("数据如下：");
            for (int i = 0; i < data.length; i++) {
                for (int j = 0; j < data[0].length; j++) {
                    System.out.print(data[i][j].toString());
                    System.out.print(",");
                }
                System.out.println();
            }
            for (int i = 1; i < data.length; i++) {
                // 设置数据
                if (!data[i][0].toString().equals("null") && data[i][0].toString() != null
                        && !data[i][1].toString().equals("null") && data[i][1].toString() != null
                        && !data[i][3].toString().equals("null") && data[i][3].toString() != null) {  // id和父节点ID/名称不为空时添加
                    IngredientsTree ingredientsTree = new IngredientsTree();
                    ingredientsTree.setId(Integer.parseInt(data[i][0].toString()));
                    ingredientsTree.setpId(Integer.parseInt(data[i][1].toString()));
                    MaterialCategoryItem materialCategoryItem = new MaterialCategoryItem();
                    DataDictionaryItem dataDictionaryItemM = dictionaryService.getDatadictionaryItemByName(data[i][2].toString(), 28);
                    if (dataDictionaryItemM != null) {
                        int materialCategoryId = dataDictionaryItemM.getDataDictionaryItemId();
                        materialCategoryItem.setDataDictionaryItemId(materialCategoryId);
                        ingredientsTree.setMaterialCategoryItem(materialCategoryItem);
                    }
                    ingredientsTree.setName(data[i][3].toString());
                    if(data[i][4].toString().equals("null")){
                        data[i][4] = "";
                    }
                    ingredientsTree.setSpecification(data[i][4].toString());
                    UnitDataItem unitDataItem = new UnitDataItem();
                    DataDictionaryItem dataDictionaryItemU = dictionaryService.getDatadictionaryItemByName(data[i][5].toString(), 25);
                    if (dataDictionaryItemU != null) {
                        int unitId = dataDictionaryItemU.getDataDictionaryItemId();
                        unitDataItem.setDataDictionaryItemId(unitId);
                        ingredientsTree.setUnitDataItem(unitDataItem);
                    }
                    IngredientsTree ingredientsTree1 = ingredientsService.getIngredientsTreeById(ingredientsTree.getId());// 根据ID获取对象
                    if (ingredientsTree1 == null) { // 如果存在则更新，不存在则新增
                        ingredientsService.addIngredientsTree(ingredientsTree);
                    } else {
                        ingredientsService.updateIngredientTree(ingredientsTree);
                    }
                }
            }
            res.put("status", "success");
            res.put("message", "导入成功！");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "导入失败，请重试！");
        }
        return res.toString();
    }

    /**
     * 根据Id获取对象数据
     *
     * @param id
     * @return
     */
    @RequestMapping("getIngredientsTreeById")
    @ResponseBody
    public String getIngredientsTreeById(int id) {
        JSONObject res = new JSONObject();
        try {
            //根据id查询出相应的对象信息
            IngredientsTree ingredientsTree = ingredientsService.getIngredientsTreeById(id);
            //新建一个对象并给它赋值
            JSONObject data = JSONObject.fromBean(ingredientsTree);
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
     * 根据Id更新辅料树状部分数据（编码，名称，规格，计量单位）
     *
     * @param
     * @return
     */
    @RequestMapping("updateIngredientsTree")
    @ResponseBody
    public String updateIngredientsTree(@RequestBody IngredientsTree ingredientsTree) {
        JSONObject res = new JSONObject();
        try {
            ingredientsService.updatePartIngredientTreeBuId(ingredientsTree);
            res.put("status", "success");
            res.put("message", "更新成功!");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "更新失败");
        }
        return res.toString();
    }

    /**
     * 新增
     *
     * @return
     */
    @RequestMapping("addIngredientsTree")
    @ResponseBody
    public String addIngredientsTree(@RequestBody IngredientsTree ingredientsTree) {
        JSONObject res = new JSONObject();
        try {
            int id = 0;
            id = ingredientsService.countTreeByPId(ingredientsTree.getpId());
            if(id == 0) {  // 如果该节点没有子节点则新增ID
                id = ingredientsTree.getpId() * 1000 + 1;
            }else{ // 如果有子节点则设置为最大子节点ID+1
                id = ingredientsService.maxByPId(ingredientsTree.getpId()) + 1; // 获取其子节点最大编码+1
            }
            while (ingredientsService.getIngredientsTreeById(id) != null) {
                id += 1;
            }
            String name = "新物品";
            ingredientsTree.setId(id);
            ingredientsTree.setName(name);
            ingredientsService.addIngredientsTree(ingredientsTree);    // 新增菜单模块和权限树模块
            res.put("status", "success");
            res.put("message", "新增成功!");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "新增失败！");
        }
        return res.toString();
    }

    /**
     * 删除
     *
     * @return
     */
    @RequestMapping("deleteIngredientsTreeById")
    @ResponseBody
    public String deleteIngredientsTreeById(int id) {
        JSONObject res = new JSONObject();
        try {
            IngredientsTree ingredientsTree = new IngredientsTree();
            ingredientsTree.setId(id);
            List<IngredientsTree> ingredientsTrees = getTreeIngredientsTreeList(id);  // 获取孩子节点
            ingredientsTree.setIngredientsTreeList(ingredientsTrees);     // 设置树状结构
            delete(ingredientsTree);
            res.put("status", "success");
            res.put("message", "删除成功!");
        } catch (Exception e) {
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "删除失败！");
        }
        return res.toString();
    }

    /**
     * 递归获取树状结构
     *
     * @return
     */
    public List<IngredientsTree> getTreeIngredientsTreeList(int id) {
        List<IngredientsTree> ingredientsTreeList = ingredientsService.getChildrenIngredientsTreeById(id);   // 获取子节点
        for (int i = 0; i < ingredientsTreeList.size(); i++) {  // 如果子节点存在子节点则获取
            ingredientsTreeList.get(i).setIngredientsTreeList(getTreeIngredientsTreeList(ingredientsTreeList.get(i).getId()));
        }
        return ingredientsTreeList;
    }

    /**
     * 递归删除节点及其子节点
     *
     */
    public void delete(IngredientsTree ingredientsTree) {
        ingredientsService.deleteById(ingredientsTree.getId());   // 删除节点
        if (ingredientsTree.getIngredientsTreeList() != null && ingredientsTree.getIngredientsTreeList().size() > 0) {  // 如果存在子节点则删除
            for (IngredientsTree ingredientsTree1 : ingredientsTree.getIngredientsTreeList()) {
                delete(ingredientsTree1);
            }
        }
    }

}
