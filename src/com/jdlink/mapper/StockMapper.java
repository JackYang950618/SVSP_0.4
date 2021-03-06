package com.jdlink.mapper;

import com.jdlink.domain.Client;
import com.jdlink.domain.Page;
import com.jdlink.domain.Produce.Stock;
import com.jdlink.domain.Produce.StockItem;
import com.jdlink.domain.QuotationItem;
import com.jdlink.domain.Wastes;

import java.util.List;

public interface StockMapper {
    /**
     * 添加申报信息
     */
    void add(Stock stock);
    /**
     * 获取申报Id
     */
    List getStockIdList();
    /**
     * 获取库存信息
     *
     */
    List<Stock> list();
    /**
     * 根据编号获取ID
     *
     */
    List<Stock> list(Page page);
    Stock getById(String stockId);
    Stock getByName(String stockName);
    //库存信息更新
    void updateStock(Stock stock);
//更新危废表
    void updateWastes(Wastes wastes);
    //提交申报
    void submitStock(String stockId);
    void cancelStock(String stockId);
    List<Stock> search(Stock stock);
    int total();
    int searchCount(Stock stock);
    void opinion(String stockId,String opinion);
    void back(String stockId,String opinion);
    void delete(Stock stock);
    void addList(Stock stock);
    void time1(Stock stock);
    void addStockItem(StockItem stockItem);
    void updateStockItem(StockItem stockItem);
   void deleteStockItem(String stockId);

  List<QuotationItem>  getQuotationitemByUndeclared(String clientId);

  void updateQuotationItemState(String quotationItemId);

  void perfectStockItem(StockItem stockItem);

  void updateCapacity(String clientId,float capacity);
}
