package com.mastercard.mcs.clicktopay.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Value("${srcClientId:defaultValue}")
    private String srcClientId;

    @Value("${srcDpaId:defaultValue}")
    private String srcDpaId;

    @GetMapping
    public Map<String, String> getConfigValues() {
        Map<String, String> configValues = new HashMap<>();
        configValues.put("srcClientId", srcClientId);
        configValues.put("srcDpaId", srcDpaId);
        
        return configValues;
    }
}
