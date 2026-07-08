package com.study.travel.dto;

import lombok.Data;

@Data
public class PlanSaveRequest {
    private String city;
    private Integer days;
    private String content;  // JSON string
    private String preferences;
}
