package com.study.travel.controller;

import com.study.travel.dto.ApiResult;
import com.study.travel.dto.ProfileUpdateRequest;
import com.study.travel.entity.User;
import com.study.travel.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResult<User>> getProfile(Authentication auth) {
        String username = auth.getName();
        User user = userService.getProfile(username);
        return ResponseEntity.ok(ApiResult.success(user));
    }

    @PutMapping
    public ResponseEntity<ApiResult<User>> updateProfile(Authentication auth,
                                                         @Valid @RequestBody ProfileUpdateRequest request) {
        String username = auth.getName();
        User user = userService.updateProfile(username, request);
        return ResponseEntity.ok(ApiResult.success("更新成功", user));
    }
}