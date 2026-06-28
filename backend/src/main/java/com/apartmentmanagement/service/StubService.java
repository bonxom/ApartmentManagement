package com.apartmentmanagement.service;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class StubService {

    public Map<String, Object> getStubListResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Tính năng đang phát triển");
        response.put("data", Collections.emptyList());
        return response;
    }

    public Map<String, Object> getStubDetailResponse() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Tính năng đang phát triển");
        response.put("data", null);
        return response;
    }
}
