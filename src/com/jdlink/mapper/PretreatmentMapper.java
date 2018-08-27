package com.jdlink.mapper;

import com.jdlink.domain.Page;
import com.jdlink.domain.Produce.Pretreatment;
import com.jdlink.domain.Produce.PretreatmentItem;
import com.jdlink.domain.Wastes;

import java.util.List;

public interface PretreatmentMapper {
    int count();
    void add(Pretreatment pretreatment);
    void update(Pretreatment pretreatment);
    List<Pretreatment> listPage(Page page);
    Pretreatment getById(String id);
    List<Pretreatment> search(Pretreatment pretreatment);
    int searchCount(Pretreatment pretreatment);
    int countById(String id);
    int countItem();
    void invalid(String id);
    void adjust(Wastes wastes);
    PretreatmentItem getItemsById(int id);
}
