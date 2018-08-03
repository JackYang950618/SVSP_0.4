package com.jdlink.service.impl;

import com.jdlink.domain.Page;
import com.jdlink.domain.Produce.SampleInformation;
import com.jdlink.domain.Sample;
import com.jdlink.mapper.SampleInformationMapper;
import com.jdlink.service.SampleInformationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SampleInformationServiceImpl implements SampleInformationService {
    @Autowired
    SampleInformationMapper sampleInformationMapper;

    @Override
    public void add(SampleInformation sampleInformation){
        sampleInformationMapper.add(sampleInformation);
    }

    @Override
    public int count(){ return sampleInformationMapper.count(); }

    @Override
    public List<SampleInformation> listPage(Page page){ return sampleInformationMapper.listPage(page); }

    @Override
    public SampleInformation getByCode(String companyCode){ return sampleInformationMapper.getByCode(companyCode); }

    @Override
    public void addCheck(String companyCode){ sampleInformationMapper.addCheck(companyCode); }

    @Override
    public void update(SampleInformation sampleInformation){ sampleInformationMapper.update(sampleInformation); }

    @Override
    public List<SampleInformation> listByKeyword(String keyword){ return sampleInformationMapper.listByKeyword(keyword); }

    @Override
    public void updateSampleInfo(String companyCode){ sampleInformationMapper.updateSampleInfo(companyCode); }

    @Override
    public int searchCount(SampleInformation sampleInformation){ return sampleInformationMapper.searchCount(sampleInformation); }

    @Override
    public List<SampleInformation> search(SampleInformation sampleInformation){ return sampleInformationMapper.search(sampleInformation); }

}
