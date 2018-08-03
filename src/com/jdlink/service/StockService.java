package com.jdlink.service;

import com.jdlink.domain.Client;
import com.jdlink.domain.Produce.Stock;
import com.jdlink.domain.Wastes;

import java.util.List;

public interface StockService {
    void add(Stock stock);
    List getStockIdList();
    List<Stock> list();
    Stock getById(String stockId);
    void updateStock(Stock stock);
    void updateWastes(Wastes wastes);
    void submitStock(String stockId);
    void cancelStock(String stockId);
    List<Stock> search(Stock stock);
    int total();
    int searchCount(Stock stock);
}
