package com.jdlink.controller;

import com.jdlink.domain.Dictionary.UnitDataItem;
import com.jdlink.domain.Page;
import com.jdlink.domain.Produce.Equipment;
import com.jdlink.domain.Produce.MedicalWastes;
import com.jdlink.service.MedicalWastesService;
import com.jdlink.util.DBUtil;
import com.jdlink.util.ImportUtil;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static com.jdlink.util.NumberToDate.double2Date;

@Controller
public class MedicalWastesController {
    @Autowired
    MedicalWastesService medicalWastesService;
    @RequestMapping("getNewestMedicalWastesId")
    @ResponseBody
    public  String getNewestMedicalWastesId(){
        JSONObject res=new JSONObject();
        Calendar cal = Calendar.getInstance();
        //获取年
        String year = String.valueOf(cal.get(Calendar.YEAR));
        //获取月
        String mouth = getMouth(String.valueOf(cal.get(Calendar.MONTH) + 1));
        //序列号
        String number = "00001";
        try {
            //1寻找最新的编号
            List<String> medicalWastesIdList=medicalWastesService.getNewId();
            if(medicalWastesIdList.size()==0){
                number = "00001";
            }
            if (medicalWastesIdList.size()>0){
                String s = medicalWastesIdList.get(0);//原字符串
                String s2 = s.substring(s.length() - 3, s.length());//最后一个3字符
                number = getString3(String.valueOf(Integer.parseInt(s2) + 1));
            }
            String medicalWastesId=year+mouth+number;
            res.put("medicalWastesId", medicalWastesId);
            res.put("status", "success");
            res.put("message", "最新编号获取成功");

        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "获取失败");
        }
        return  res.toString();
    }

    /**
     * 添加医危废信息
     * @param
     * @return
     */
    @RequestMapping("addMedicalWastes")
    @ResponseBody
    public String addMedicalWastes(@RequestBody MedicalWastes medicalWastes){
        JSONObject res=new JSONObject();
        try{

            if(medicalWastes.getEarlyNumber()==0){
                //获取前一天的危废
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                String date = sdf.format(medicalWastes.getDateTime());       //将Date类型转换成String类型
                MedicalWastes medicalWastes1=medicalWastesService.getMedicalWasteFromPrevious(date);

                if(medicalWastes1!=null){
                    float earlyNumber=medicalWastes1.getWastesAmount();
                    if(earlyNumber<0){
                        earlyNumber=0;
                    }
                    medicalWastes.setEarlyNumber(earlyNumber);//设置期初
                }
                if(medicalWastes1==null) {
                    medicalWastes.setEarlyNumber(0);//设置期初
                }
            }

            //设置库存医废库存量=期初量+蒸煮后入库KG-焚烧-蒸煮后转移量
            float wastesAmount=medicalWastes.getEarlyNumber()+medicalWastes.getAfterCookingInbound()-medicalWastes.getIncineration()-medicalWastes.getThisMonthSendCooking();
            medicalWastes.setWastesAmount(wastesAmount);
            medicalWastesService.addMedicalWastes(medicalWastes);
            res.put("date",medicalWastes.getDateTime());
            res.put("status", "success");
            res.put("message", "添加成功");

        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "添加失败");
        }

        return res.toString();
    }

    /**
     * 获得医危废列表
     * @param
     * @return
     */
    @RequestMapping("loadMedicalWastesList")
    @ResponseBody
    public String loadMedicalWastesList(@RequestBody Page page){
        JSONObject res=new JSONObject();
        try {

            List<MedicalWastes> medicalWastesList=medicalWastesService.loadMedicalWastesList(page);
            res.put("medicalWastesList", medicalWastesList);
            res.put("status", "success");
            res.put("message", "查询成功");

        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "查询失败");
        }

        return  res.toString();
    }

    /**
     * 高级查询
     * @param
     * @return
     */
    @RequestMapping("searchMedicalWastes")
    @ResponseBody
    public  String searchMedicalWastes(@RequestBody MedicalWastes medicalWastes){
        JSONObject res=new JSONObject();
        try{
         List<MedicalWastes> medicalWastesList=medicalWastesService.searchMedicalWastes(medicalWastes);
            MedicalWastes medicalWastes1;
           if(medicalWastes.getKeyword()!=null){
                medicalWastes1=null;
           }
           else {
                medicalWastes1=medicalWastesService.getCumulative(medicalWastes);
           }

            res.put("medicalWastes",medicalWastes1);
           res.put("medicalWastesList",medicalWastesList);
            res.put("status", "success");
            res.put("message", "高级查询成功");
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "高级查询失败");
        }
        return  res.toString();
    }


    /*高级查询计数*/
    @RequestMapping("searchMedicalWastesCount")
    @ResponseBody
    public int searchMedicalWastesCount(@RequestBody MedicalWastes medicalWastes){
        return medicalWastesService.searchMedicalWastesCount(medicalWastes);
    }

    //获取5位序列号
    public static String getString3(String id){
        while (id.length()!=5){
            System.out.println(id.length());
            id="0"+id;
        }
        return id;
    }
    //获取两位月数
    public  static  String getMouth(String mouth){
        if(mouth.length()!=2){
            mouth="0"+mouth;
        }
        return mouth;
    }

    /**
     * 通过日期获取
     * @param startDate
     * @param endDate
     * @return
     */
    @RequestMapping("getMedicalWastesByRange")
    @ResponseBody
    public String getMedicalWastesByRange(Date startDate, Date endDate){
        JSONObject res=new JSONObject();
        try{
            List<MedicalWastes> medicalWastesList=medicalWastesService.getMedicalWastesByRange(startDate, endDate);
            res.put("status", "success");
            res.put("message", "查询成功");
            res.put("data", medicalWastesList);
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "查询失败");
        }
        return  res.toString();

    }
    /**
     * 通过日期和设备
     */
    @RequestMapping("getMedicalWastesByDateAndEquipment")
    @ResponseBody
    public String getMedicalWastesByDateAndEquipment(Date startDate, Date endDate,String equipment){
        JSONObject res=new JSONObject();
        try{
            List<MedicalWastes> medicalWastesList=medicalWastesService.getMedicalWastesByDateAndEquipment(startDate, endDate,equipment);
            res.put("status", "success");
            res.put("message", "查询成功");
            res.put("data", medicalWastesList);
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "查询失败");
        }
        return  res.toString();
    }

    //获取总记录数
    @RequestMapping("totalMedicalWasteRecord")
    @ResponseBody
    public int totalMedicalWasteRecord(){
        try {
            return medicalWastesService.total();
        }catch(Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 作废
     */
    @RequestMapping("cancelMedicalWastes")
    @ResponseBody
    public String cancelMedicalWastes(String id){
        JSONObject res=new JSONObject();
        try{
            medicalWastesService.cancelMedicalWastes(id);
            res.put("status", "success");
            res.put("message", "作废成功");
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "作废失败");
        }

        return res.toString();
    }

    //导入医危废
    @RequestMapping("importMedicalWaste")
    @ResponseBody
    public String importMedicalWaste(MultipartFile excelFile){
        JSONObject res=new JSONObject();
        List<Object[][]> data = ImportUtil.getInstance().getExcelFileData(excelFile);
        try{
            Calendar cal = Calendar.getInstance();
            //获取年
            String year = String.valueOf(cal.get(Calendar.YEAR));
            //获取月
            String mouth = getMouth(String.valueOf(cal.get(Calendar.MONTH) + 1));
            //序列号
            String number = "00001";
            for(int i=0;i<data.size();i++){//遍历页
                for(int j=2;j<data.get(i).length;j++){


                    if(data.get(i)[j][0].toString()!="null"){


                        MedicalWastes medicalWastes=new MedicalWastes();
                        UnitDataItem unitDataItem=new UnitDataItem();
                        unitDataItem.setDataDictionaryItemId(138);
                        medicalWastes.setUnitDataItem(unitDataItem);
                        //寻找最新的编号
                        List<String> medicalWastesIdList=medicalWastesService.getNewId();
                        if(medicalWastesIdList.size()==0){
                            number = "00001";
                        }
                        if (medicalWastesIdList.size()>0){
                            String s = medicalWastesIdList.get(0);//原字符串
                            String s2 = s.substring(s.length() - 3, s.length());//最后一个3字符
                            number = getString3(String.valueOf(Integer.parseInt(s2) + 1));
                        }
                        String medicalWastesId=year+mouth+number;

                        medicalWastes.setMedicalWastesId(medicalWastesId);

                        //日期
                        if(data.get(i)[j][0]!="null"){
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
                            Date start = (Date)sdf.parseObject(data.get(i)[j][0].toString());
                            medicalWastes.setDateTime(start);
                        }
                        if(data.get(i)[j][0]=="null"){
                            medicalWastes.setDateTime(null);
                        }
                        //找到要添加的医危废的前一天的数据(为了获得昨天的库存数据做为今天的期初数据)
                        if(medicalWastes.getDateTime()!=null){
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            String date = sdf.format(medicalWastes.getDateTime());       //将Date类型转换成String类型
                            MedicalWastes medicalWastes1=medicalWastesService.getMedicalWasteFromPrevious(date);

                        }

                        //期初量
                        if(data.get(i)[j][1]!="null"){
                            medicalWastes.setEarlyNumber(Float.parseFloat(data.get(i)[j][1].toString()));
                        }
                        if(data.get(i)[j][1]=="null"){
                            medicalWastes.setEarlyNumber(0);
                        }


                        //接运单量kg(入库量)
                        if(data.get(i)[j][2]!="null"){
                            medicalWastes.setThisMonthWastes(Float.parseFloat(data.get(i)[j][2].toString()));
                        }
                        if(data.get(i)[j][2]=="null"){
                            medicalWastes.setThisMonthWastes(0);
                        }

                        //本日蒸煮医废(过磅)
                        if(data.get(i)[j][3]!="null"){
                            medicalWastes.setCookingWastes(Float.parseFloat(data.get(i)[j][3].toString()));
                        }
                        if(data.get(i)[j][3]=="null"){
                            medicalWastes.setCookingWastes(0);
                        }

                        //直接转处置量
                        if(data.get(i)[j][5]!="null"){
                            medicalWastes.setDirectDisposal(Float.parseFloat(data.get(i)[j][5].toString()));
                        }
                        if(data.get(i)[j][5]=="null"){
                            medicalWastes.setDirectDisposal(0);
                        }


                        //蒸煮后入库量
                        if(data.get(i)[j][6]!="null"){
                            medicalWastes.setAfterCookingInbound(Float.parseFloat(data.get(i)[j][6].toString()));
                        }

                        if(data.get(i)[j][6]=="null"){
                            medicalWastes.setAfterCookingInbound(0);
                        }

                        /*蒸煮后转移量*/
                        if(data.get(i)[j][7]!="null"){
                            medicalWastes.setThisMonthSendCooking(Float.parseFloat(data.get(i)[j][7].toString()));
                        }

                        if(data.get(i)[j][7]=="null"){
                            medicalWastes.setThisMonthSendCooking(0);
                        }

                        //焚烧量
                        if(data.get(i)[j][8]!="null"){
                            medicalWastes.setIncineration(Float.parseFloat(data.get(i)[j][8].toString()));
                        }
                        if(data.get(i)[j][8]=="null"){
                            medicalWastes.setIncineration(0);
                        }

                        /*误差量*/
                        //接运单量kg-蒸煮量（称重量）kg-转移到瑞意的量kg
                        medicalWastes.setErrorNumber(medicalWastes.getThisMonthWastes()-medicalWastes.getCookingWastes()-medicalWastes.getDirectDisposal());



                        //水分量=蒸煮量（称重量）kg-蒸煮后量KG


                        medicalWastes.setWetNumber(medicalWastes.getCookingWastes()-medicalWastes.getAfterCookingInbound());

                        //算库存公式为:本日医废进厂+期初量-焚烧-直接转处置量-水分-蒸煮后转移量-误差量
                        float wastesAmount=medicalWastes.getEarlyNumber()+medicalWastes.getAfterCookingInbound()-medicalWastes.getIncineration()-medicalWastes.getThisMonthSendCooking();

                        medicalWastes.setWastesAmount(wastesAmount);

                        //处置设备
                        //medicalWastes.setEquipment(Equipment.getEquipment((data[i][11].toString())));

                        medicalWastesService.addMedicalWastes(medicalWastes);
                    }

                }
            }
//            for(int i=2;i<data.length;i++){
//
//            }
            res.put("status", "success");
            res.put("message", "导入成功");
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "导入失败");
        }


        return res.toString();

    }

    //根据编号获取信息
    @RequestMapping("getMedicalWasteById")
    @ResponseBody
    public String getMedicalWasteById(String medicalWastesId){
        JSONObject res=new JSONObject();
        try {
            MedicalWastes medicalWastes=medicalWastesService.getMedicalWasteById(medicalWastesId);
            res.put("status", "success");
            res.put("message", "查询成功");
            res.put("data", medicalWastes);
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "查询失败");
        }

        return res.toString();

    }

    //修改信息
    @RequestMapping("updateMedicalWaste")
    @ResponseBody
    public String updateMedicalWaste(@RequestBody MedicalWastes medicalWastes){
        JSONObject res=new JSONObject();


        try {
            float wastesAmount=medicalWastes.getEarlyNumber()+medicalWastes.getAfterCookingInbound()-medicalWastes.getIncineration()-medicalWastes.getDirectDisposal()-medicalWastes.getThisMonthSendCooking();
            medicalWastes.setWastesAmount(wastesAmount);
            medicalWastesService.updateMedicalWaste(medicalWastes);
            MedicalWastes medicalWastes1=medicalWastesService.getMedicalWasteById(medicalWastes.getMedicalWastesId());
            res.put("date",medicalWastes1.getDateTime());
            res.put("status", "success");
            res.put("message", "更新成功");
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "更新失败");
        }
        return res.toString();

    }

    //医危废出入库导出
    @RequestMapping("exportExcelMedicalWastes")
    @ResponseBody
    public String exportExcelMedicalWastes(String name, HttpServletResponse response, String sqlWords){
        JSONObject res = new JSONObject();

        try {
            DBUtil db = new DBUtil();
            String tableHead = "登记单号/登记日期/登记部门/登记人/修改人/修改时间/本日进厂危废/本日直接转外处置量/本日蒸煮医废(过磅)/蒸煮后重量/蒸煮后入库量/本日蒸煮后外送量/误差量/水分含量/处置设备";
            name = "医危废出入库单";   //重写文件名
            db.exportExcel2(name, response, sqlWords, tableHead);//HttpServletResponse response
            res.put("status", "success");
            res.put("message", "导出成功");

        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "导出失败，请重试！");

        }


        return res.toString();
    }

    /*获取现有库存*/
    @RequestMapping("getCurrentWastesAmount")
    @ResponseBody
    public String getCurrentWastesAmount(){
        JSONObject res=new JSONObject();

        try {
                  MedicalWastes medicalWastes=medicalWastesService.getCurrentWastesAmount();
            res.put("status", "success");
            res.put("message", "获取现有库存成功");
            res.put("data", medicalWastes);
        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "获取现有库存失败");
        }

        return res.toString();
    }


    /*接口专用来更新期初库存*/
    @RequestMapping("UpdatePeriodAndInventory")
    @ResponseBody
    public String UpdatePeriodAndInventory(String keyword){
        JSONObject res=new JSONObject();

        try {
            List<MedicalWastes> medicalWastesList=medicalWastesService.UpdatePeriodAndInventory(keyword);
           for(int i=0;i<medicalWastesList.size();i++){
               UpdatePeriodAndInventory(medicalWastesList.get(i));
           }

            res.put("status", "success");
            res.put("message", "更新成功");

        }
        catch (Exception e){
            e.printStackTrace();
            res.put("status", "fail");
            res.put("message", "更新失败");
        }

          return res.toString();
    }

    /*更新期初与库存*/
    public void UpdatePeriodAndInventory(MedicalWastes medicalWastesList){


            //1更新期初
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            String date = sdf.format(medicalWastesList.getDateTime());       //将Date类型转换成String类型
            //前一天的医危废对象
            MedicalWastes medicalWastes1=medicalWastesService.getMedicalWasteFromPrevious(date);
            if(medicalWastes1!=null){
                //加入昨天的库存作为今天的期初
                float earlyNumber=medicalWastes1.getWastesAmount();
                if(earlyNumber<0){
                    earlyNumber=0;
                }
                //获得新的期初
                medicalWastesList.setEarlyNumber(earlyNumber);

            }
            else {
                medicalWastesList.setEarlyNumber(medicalWastesList.getEarlyNumber());
            }
            //2更新库存
            float wastesAmount=medicalWastesList.getEarlyNumber()+medicalWastesList.getAfterCookingInbound()-medicalWastesList.getIncineration()-medicalWastesList.getThisMonthSendCooking();
            medicalWastesList.setWastesAmount(wastesAmount);
            //更新期初与库存
               medicalWastesService.updateMedicalWaste(medicalWastesList);


        }

    }



