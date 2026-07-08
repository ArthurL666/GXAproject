package com.study.travel.controller;

import com.study.travel.dto.ApiResult;
import com.study.travel.dto.AuthResponse;
import com.study.travel.dto.LoginRequest;
import com.study.travel.dto.RegisterRequest;
import com.study.travel.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResult<AuthResponse>> register(@Valid @RequestBody RegisterRequest request){
        AuthResponse response = userService.register(request);
        return ResponseEntity.ok(ApiResult.success("注册成功", response));
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResult<AuthResponse>> login(@Valid @RequestBody LoginRequest request){
        AuthResponse response = userService.login(request);
        return ResponseEntity.ok(ApiResult.success("登陆成功", response));
    }

}
