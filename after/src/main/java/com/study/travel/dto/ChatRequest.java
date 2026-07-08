package com.study.travel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 聊天请求 DTO（Data Transfer Object，数据传输对象）
 *
 * 当前端用户发送一条消息时，会把消息内容封装成这个对象传给后端。
 * 整个类目前只有一个字段：用户输入的消息文本。
 *
 * 比如前端 POST 过来 {"message": "我想去北京玩"}，
 * Spring 会自动把 JSON 解析成 ChatRequest 对象，message 字段就是 "我想去北京玩"。
 */
@Data   // Lombok 注解：自动生成 getter/setter/toString/equals/hashCode
public class ChatRequest {

    /**
     * 用户发送的消息内容
     *
     * @NotBlank 是校验注解，表示：
     * 1. 不能为 null
     * 2. 不能是空字符串 ""
     * 3. 不能是纯空格 "   "
     * 如果前端传了空消息，Spring 会自动返回 400 错误，提示 "消息不能为空"
     */
    @NotBlank(message = "消息不能为空")
    private String message;
}
