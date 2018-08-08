package com.jdlink.domain.Produce;

import com.jdlink.domain.Client;
import com.jdlink.domain.Salesman;
import com.jdlink.domain.Wastes;

import java.util.Date;
import java.util.List;

public class WayBill {
    /**
     * 接运单序列号
     */
    private String id;
    /**
     * 产生单位/委托单位
     */
    private Client produceCompany;
    /**
     * 接收单位
     */
    private Client receiveCompany;
    /**
     * 总额
     */
    private Float total;
    /**
     * 接运单创建人
     */
    private String founder;
    /**
     * 接运单创建日期
     */
    private Date wayBillDate;
    /**
     * 备注
     */
    private String remarks;
    /**
     * 业务员
     */
    private Salesman salesman;
    /**
     * 接运单号
     */
    private String wayBillNumber;
    /**
    * 危废列表
    */
    private List<Wastes> wastesList;
    /**
     * 开票日期
     */
    private Date invoiceDate;
    /**
     * 发票号码
     */
    private String invoiceNumber;
    /**
     * 危废产生单位经手人
     */
    private String produceCompanyOperator;
    /**
     * 处置单位经手人
     */
    private String receiveCompanyOperator;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }



    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public String getFounder() {
        return founder;
    }

    public void setFounder(String founder) {
        this.founder = founder;
    }

    public Date getWayBillDate() {
        return wayBillDate;
    }

    public void setWayBillDate(Date wayBillDate) {
        this.wayBillDate = wayBillDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getWayBillNumber() {
        return wayBillNumber;
    }

    public void setWayBillNumber(String wayBillNumber) {
        this.wayBillNumber = wayBillNumber;
    }

    public List<Wastes> getWastesList() {
        return wastesList;
    }

    public void setWastesList(List<Wastes> wastesList) {
        this.wastesList = wastesList;
    }

    public Date getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(Date invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public Client getProduceCompany() {
        return produceCompany;
    }

    public void setProduceCompany(Client produceCompany) {
        this.produceCompany = produceCompany;
    }

    public Client getReceiveCompany() {
        return receiveCompany;
    }

    public void setReceiveCompany(Client receiveCompany) {
        this.receiveCompany = receiveCompany;
    }

    public Salesman getSalesman() {
        return salesman;
    }

    public void setSalesman(Salesman salesman) {
        this.salesman = salesman;
    }

    public String getProduceCompanyOperator() {
        return produceCompanyOperator;
    }

    public void setProduceCompanyOperator(String produceCompanyOperator) {
        this.produceCompanyOperator = produceCompanyOperator;
    }

    public String getReceiveCompanyOperator() {
        return receiveCompanyOperator;
    }

    public void setReceiveCompanyOperator(String receiveCompanyOperator) {
        this.receiveCompanyOperator = receiveCompanyOperator;
    }

    @Override
    public String toString() {
        return "WayBill{" +
                "id='" + id + '\'' +
                ", produceCompany=" + produceCompany +
                ", receiveCompany=" + receiveCompany +
                ", total=" + total +
                ", founder='" + founder + '\'' +
                ", wayBillDate=" + wayBillDate +
                ", remarks='" + remarks + '\'' +
                ", salesman=" + salesman +
                ", wayBillNumber='" + wayBillNumber + '\'' +
                ", wastesList=" + wastesList +
                ", invoiceDate=" + invoiceDate +
                ", invoiceNumber='" + invoiceNumber + '\'' +
                ", produceCompanyOperator='" + produceCompanyOperator + '\'' +
                ", receiveCompanyOperator='" + receiveCompanyOperator + '\'' +
                '}';
    }
}
