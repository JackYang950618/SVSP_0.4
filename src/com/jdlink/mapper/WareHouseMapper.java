package com.jdlink.mapper;

import com.jdlink.domain.Inventory.WareHouse;

import java.util.List;

public interface WareHouseMapper {

    /**
     * 获取编号
     * @return 编号
     */
    String getCurrentId();
    /**
     * 增加仓库
     * @param wareHouse 仓库
     */
    void add(WareHouse wareHouse);

    /**
     * 通过仓库名找到仓库
     * @param name 仓库名
     */
    WareHouse getWareHouseByName(String name);

    /**
     * 通过编号获取到仓库
     * @param id 编号
     * @return 仓库
     */
    WareHouse getWareHouseById(String id);

    /**
     * 列出所有仓库
     * @return 仓库
     */
    List<WareHouse> list();

    /**
     * 更新仓库
     * @param wareHouse 仓库对象
     */
    void update(WareHouse wareHouse);

    /**
     * 删除仓库
     * @param id 编号
     */
    void delete(String id);

    /**
     * 获取仓库的数量
     * @return 仓库的数量
     */
    int count();


}
